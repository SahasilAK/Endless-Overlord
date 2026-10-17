// tslint:disable
/* eslint-disable */
import {useCallback, useEffect, useRef, useState} from 'react';

/**
 * @fileoverview Hook for interacting with the Playground SDK.
 */

/**
 * Hook to interact with Playground SDK features.
 * Dynamically loads the script and initializes the SDK.
 */
/** Browser-hosted standalone adapter. Does not require Google's private Playground SDK. */
class BrowserGameSDK {
  private bestScore = 0;
  constructor() {
    try { this.bestScore = Number(localStorage.getItem('eternal_overlord_host_high_score') || '0') || 0; }
    catch (_) { /* storage can be blocked in private browsing */ }
  }
  startGame() {}
  pauseStateChanged(_paused: boolean) {}
  scoreUpdated(score: {value: number; level?: string}) {
    const next = Number(score?.value) || 0;
    if (next > this.bestScore) {
      this.bestScore = next;
      try { localStorage.setItem('eternal_overlord_host_high_score', String(next)); }
      catch (_) { /* continue without browser storage */ }
    }
  }
  gameOver() {}
  levelComplete(_level: string | number) {}
}
const localGameSDK = new BrowserGameSDK();
export function usePlayground() {
  const onGameEventRef = useRef<((event: any) => void) | null>(null);
  const onPresenceEventRef = useRef<((presence: any) => void) | null>(null);
  const onLobbyStatusRef = useRef<((status: any) => void) | null>(null);
  return { sdk: localGameSDK, isReady: true, onGameEventRef, onPresenceEventRef, onLobbyStatusRef };
}

export interface BaseGameState {
  status: string;
  score: number;
  level?: number | string;
}

/**
 * Hook to automatically synchronize game scores and game lifecycle (start,
 * score updates, game over, level complete) with the Playground SDK.
 *
 * @param gameState Current game state containing status ('START' | 'PLAYING' |
 *     'GAME_OVER' | 'VICTORY' | 'LEVEL_COMPLETE' | etc.), score, and optional level.
 * @param sdk Optional existing PlaygroundSDK instance (e.g. from usePlayground()).
 *     If omitted, usePlayground() is invoked internally.
 */
export function usePlaygroundGameLifecycle(
  gameState: BaseGameState,
  sdk?: any,
) {
  const defaultHook = usePlayground();
  const activeSdk = sdk ?? defaultHook.sdk;
  const hasCalledGameOver = useRef(false);
  const hasCalledLevelComplete = useRef(false);
  const lastScoreRef = useRef(gameState.score);
  const lastLevelRef = useRef(gameState.level);
  const lastIsPausedRef = useRef(false);

  // Keep last score and level up to date for unmount flush fallback
  lastScoreRef.current = gameState.score;
  lastLevelRef.current = gameState.level;

  useEffect(() => {
    if (!activeSdk) return;

    const status = (gameState.status || '').toUpperCase();
    const isGameOver =
      status === 'GAME_OVER' || status === 'DEFEAT' || status === 'LOST';
    const isLevelComplete =
      status === 'VICTORY' || status === 'WIN' || status === 'LEVEL_COMPLETE';
    const currentLevel = gameState.level ?? 1;

    const isPaused = status === 'PAUSED' || status === 'PAUSE';
    if (lastIsPausedRef.current !== isPaused) {
      if (typeof activeSdk.pauseStateChanged === 'function') {
        activeSdk.pauseStateChanged(isPaused);
      }
      lastIsPausedRef.current = isPaused;
    }

    if (status === 'PLAYING') {
      activeSdk.scoreUpdated({
        value: gameState.score,
        level: String(currentLevel),
      });
      hasCalledGameOver.current = false;
      hasCalledLevelComplete.current = false;
    } else if (isGameOver) {
      if (!hasCalledGameOver.current) {
        activeSdk.scoreUpdated({
          value: gameState.score,
          level: String(currentLevel),
        });
        activeSdk.gameOver();
        hasCalledGameOver.current = true;
      }
    } else if (isLevelComplete) {
      if (!hasCalledLevelComplete.current) {
        activeSdk.scoreUpdated({
          value: gameState.score,
          level: String(currentLevel),
        });
        activeSdk.levelComplete(currentLevel);
        hasCalledLevelComplete.current = true;
      }
    }
  }, [gameState.score, gameState.status, gameState.level, activeSdk]);

  // Unmount fallback: record score if game unmounts without calling gameOver or levelComplete
  useEffect(() => {
    return () => {
      if (
        activeSdk &&
        !hasCalledGameOver.current &&
        !hasCalledLevelComplete.current &&
        lastScoreRef.current > 0
      ) {
        try {
          const levelToReport = lastLevelRef.current ?? 1;
          activeSdk.scoreUpdated({
            value: lastScoreRef.current,
            level: String(levelToReport),
          });
          activeSdk.gameOver();
        } catch (_) {}
      }
    };
  }, [activeSdk]);
}

declare interface RpcMessage {
  type: string;
  payload: unknown;
  messageId: string;
}

declare interface RpcResponse {
  messageId: string;
  success: boolean;
  payload?: unknown;
  error?: string;
}

// Simple unique ID generator
let nextMessageId = 0;
function generateMessageId() {
  return `rpc-message-${nextMessageId++}`;
}

/**
 * React hook for making RPC calls to the parent window via postMessage.
 * This is designed to interact with IframeMessagingService in the host app.
 */
export function useRpc<RequestType, ResponseType>(
  rpcName: string,
): [(payload: RequestType) => Promise<ResponseType>, boolean] {
  const [isLoading, setIsLoading] = useState(false);
  const resolvers = useRef<Map<string, (resp: any) => void>>(new Map()).current;
  const rejecters = useRef<Map<string, (err: Error) => void>>(
    new Map(),
  ).current;

  useEffect(() => {
    const handleResponse = (event: MessageEvent<RpcResponse>) => {
      const response = event.data;
      if (
        response &&
        response.messageId &&
        (resolvers.has(response.messageId) || rejecters.has(response.messageId))
      ) {
        if (response.success) {
          resolvers.get(response.messageId)?.(response.payload);
        } else {
          rejecters.get(response.messageId)?.(
            new Error(response.error ?? 'Unknown RPC error'),
          );
        }
        resolvers.delete(response.messageId);
        rejecters.delete(response.messageId);
      }
    };

    window.addEventListener('message', handleResponse);
    return () => {
      window.removeEventListener('message', handleResponse);
    };
  }, [resolvers, rejecters]);

  const callRpc = useCallback(
    (payload: RequestType): Promise<ResponseType> => {
      // The original Playground 'exitChat' action is unavailable on ordinary websites.
      if (rpcName === 'exitChat' && window.parent === window) {
        return Promise.resolve(undefined as ResponseType);
      }
      setIsLoading(true);
      const promise = new Promise<ResponseType>((resolve, reject) => {
        const messageId = generateMessageId();
        resolvers.set(messageId, resolve);
        rejecters.set(messageId, reject);

        const message: RpcMessage = {
          type: rpcName,
          payload,
          messageId,
        };
        window.parent.postMessage(message, '*'); // Consider restricting target origin
      });
      promise.finally(() => {
        setIsLoading(false);
      });
      return promise;
    },
    [rpcName, resolvers, rejecters],
  );

  return [callRpc, isLoading];
}

export type NumberConfigEntry = {
  value: number;
  type: 'number';
  label: string;
  group: string;
  min?: number;
  max?: number;
  step?: number;
};

export type BooleanConfigEntry = {
  value: boolean;
  type: 'boolean';
  label: string;
  group: string;
};

export type ColorConfigEntry = {
  value: string; // hex e.g. "#ff0000"
  type: 'color';
  label: string;
  group: string;
};

export type SelectConfigEntry = {
  value: string;
  type: 'select';
  label: string;
  group: string;
  options: string[];
};

export type Vector2ConfigEntry = {
  value: {x: number; y: number};
  type: 'vector2';
  label: string;
  group: string;
};

export type ConfigEntry =
  | NumberConfigEntry
  | BooleanConfigEntry
  | ColorConfigEntry
  | SelectConfigEntry
  | Vector2ConfigEntry;

export type GameConfig = Record<string, ConfigEntry>;

// Utility: extract a flat values object from a CONFIG
export type ConfigValues<T extends GameConfig> = {
  [K in keyof T]: T[K]['value'];
};
