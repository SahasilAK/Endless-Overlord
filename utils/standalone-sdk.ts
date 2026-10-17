/**
 * Offline replacement for the Playground SDK in the standalone Android app.
 * This never contacts Google Playground, and the real game saves continue to
 * use the existing localStorage profile implementation in App.tsx.
 */
export class StandalonePlaygroundSDK {
  async init(
    _onGameEvent?: (event: unknown) => void,
    _onPresenceEvent?: (event: unknown) => void,
    _onLobbyStatus?: (status: unknown) => void,
  ): Promise<void> {}
  startGame(): void {}
  pauseStateChanged(_paused: boolean): void {}
  gameOver(): void {}
  levelComplete(_level: number | string): void {}
  scoreUpdated(_score: {value: number; level?: string}): void {}
}
