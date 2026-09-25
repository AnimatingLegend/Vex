import VexTween from "../tweens/VexTween.js";

/**
 * @file VexSound
 *
 * Universal sound object used for streaming, music, and sound effects.
 */
export default class VexSound {
  constructor(path = null) {
    this.audio = path ? new Audio(path) : null;
  }

  play(forceReset = false) {
    if (!this.audio) return;
    if (forceReset) this.audio.currentTime = 0;
    this.audio.play();
  }

  pause() {
    if (this.audio) this.audio.pause();
  }

  stop() {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  fade(toVolume, duration = 1, onComplete = null) {
    if (!this.audio) return;
    VexTween.cancelTweensOf(this.audio);
    VexTween.tween(this.audio, { volume: toVolume }, duration, { onComplete });
  }

  fadeIn(duration = 1, toVolume = 1) {
    this.volume = 0;
    this.play();
    this.fade(toVolume, duration);
  }

  fadeOut(duration = 1, onComplete = null) {
    this.fade(0, duration, () => {
      this.stop();
      if (onComplete) onComplete();
    });
  }

  get volume() {
    return this.audio ? this.audio.volume : 0;
  }

  set volume(val) {
    if (this.audio) this.audio.volume = Math.max(0, Math.min(1, val));
  }

  get loop() {
    return this.audio ? this.audio.loop : false;
  }

  set loop(val) {
    if (this.audio) this.audio.loop = val;
  }
}
