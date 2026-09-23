/**
 * @file VexAnimationController.js
 *
 * Slices a spritesheet into frames and plays
 *  frame sequences at a given framerate.
 */
export default class VexAnimationController {
  constructor(sprite) {
    this.sprite = sprite;
    this._frames = []; // { x, y, width, height } rects into the sheet.
    this._animations = new Map(); // name -> { frames: [index,...], framerate, looped }
    this._current = null;
    this._frameIndex = 0;
    this._elapsed = 0;
    this.currentFrame = null;
    this.finished = false;
  }

  _setupSheet(image, frameWidth, frameHeight) {
    this._frames = [];
    const cols = Math.floor(image.width / frameWidth);
    const rows = Math.floor(image.height / frameHeight);
    // Slice the image into frames.
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this._frames.push({
          x: c * frameWidth,
          y: r * frameHeight,
          width: frameWidth,
          height: frameHeight,
        });
      }
    }
  }

  /**
   * Usage:
   * VexAnimationController.add("run", [0,1,2,3], 12, true)
   */
  add(name, frameIndices, framerate = 12, looped = true) {
    this._animations.set(name, { frames: frameIndices, framerate, looped });
  }

  /**
   * Usage:
   * VexAnimationController.play("run", true)
   */
  play(name, force = false) {
    if (this._current === name && !force) return;
    if (!this._animations.has(name)) return;
    this._current = name;
    this._frameIndex = 0;
    this._elapsed = 0;
    this.finished = false;
    this._applyFrame();
  }

  _applyFrame() {
    const anim = this._animations.get(this._current);
    if (!anim) return;
    const frameNum = anim.frames[this._frameIndex];
    this.currentFrame = this._frames[frameNum] || null;
  }

  update(dt) {
    if (!this._current) return;
    const anim = this._animations.get(this._current);
    if (!anim || this.finished) return;

    this._elapsed += dt;
    const frameDuration = 1 / anim.framerate;
    while (this._elapsed >= frameDuration) {
      this._elapsed -= frameDuration;
      this._frameIndex++;
      if (this._frameIndex >= anim.frames.length) {
        if (anim.looped) this._frameIndex = 0;
        else {
          this._frameIndex = anim.frames.length - 1;
          this.finished = true;
          break;
        }
      }
    }
    this._applyFrame();
  }
}
