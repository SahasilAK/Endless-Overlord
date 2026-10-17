export interface SpriteActionConfig {
  imageUrl: string;
  totalFrames: number;
  frameWidth: number;
  frameHeight: number;
  fps: number;
  loop?: boolean;
}

export interface SpriteAnimationState {
  currentAction: string;
  currentFrame: number;
  timer: number;
}

export class SpriteRenderer {
  private configs: Record<string, SpriteActionConfig>;

  constructor(configs: Record<string, SpriteActionConfig>) {
    this.configs = configs;
  }

  /**
   * Advances the animation state based on delta time.
   */
  getNextState(
    currentState: SpriteAnimationState,
    deltaTime: number
  ): SpriteAnimationState {
    const config = this.configs[currentState.currentAction];
    if (!config) return currentState;

    const nextState = { ...currentState };
    nextState.timer += deltaTime;
    const frameDuration = 1 / Math.max(1, config.fps);

    if (nextState.timer >= frameDuration) {
      const framesToAdvance = Math.floor(nextState.timer / frameDuration);
      nextState.timer %= frameDuration;

      if (config.loop === false) {
        nextState.currentFrame = Math.min(
          config.totalFrames - 1,
          nextState.currentFrame + framesToAdvance
        );
      } else {
        nextState.currentFrame = (nextState.currentFrame + framesToAdvance) % Math.max(1, config.totalFrames);
      }
    }
    return nextState;
  }

  /**
   * Draws the sprite to the canvas using preloaded images with clean frame slicing and zero artifacts.
   */
  draw(
    ctx: CanvasRenderingContext2D,
    state: SpriteAnimationState,
    x: number,
    y: number,
    width: number,
    height: number,
    loadedImages: Record<string, HTMLImageElement | null>,
    flipX = false
  ) {
    const config = this.configs[state.currentAction];
    if (!config) return;

    const img = loadedImages[config.imageUrl];

    if (!img || !img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
      // Safe styled fallback
      ctx.save();
      ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.beginPath();
      ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const frameW = config.frameWidth || naturalW;
    const frameH = config.frameHeight || naturalH;

    const framesPerRow = Math.max(1, Math.floor(naturalW / frameW));
    const safeFrame = Math.max(0, Math.min(config.totalFrames - 1, state.currentFrame));
    const sourceX = (safeFrame % framesPerRow) * frameW;
    const sourceY = Math.floor(safeFrame / framesPerRow) * frameH;

    // Guard source dimensions to prevent sub-pixel bleeding
    const sWidth = Math.min(frameW, naturalW - sourceX);
    const sHeight = Math.min(frameH, naturalH - sourceY);

    if (sWidth <= 0 || sHeight <= 0) return;

    ctx.save();
    if (flipX) {
      ctx.translate(Math.round(x + width), Math.round(y));
      ctx.scale(-1, 1);
      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        sWidth,
        sHeight,
        0,
        0,
        Math.round(width),
        Math.round(height)
      );
    } else {
      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        sWidth,
        sHeight,
        Math.round(x),
        Math.round(y),
        Math.round(width),
        Math.round(height)
      );
    }
    ctx.restore();
  }
}
