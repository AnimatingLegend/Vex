/**
 * @file VexGlobal.js
 *
 * A global access point for input, screen size, the active camera, and cached assets.
 *
 * This is a singleton object, not a class, since on one should
 *  ever exist per game instance.
 */
const VexGlobal = {
  width: 0,
  height: 0,
  camera: null,
  state: null,
  elapsed: 0,

  keys: {
    _down: new Set(),
    _justPressed: new Set(),
    _justReleased: new Set(),

    pressed(code) {
      return this._down.has(code);
    },
    justPressed(code) {
      return this._justPressed.has(code);
    },
    justReleased(code) {
      return this._justReleased.has(code);
    },
    // Called once per frame by `Game.js`, after `update()`, to clear one-frame flags.
    _endFrame() {
      this._justPressed.clear();
      this._justReleased.clear();
    },
    _onKeyDown(e) {
      if (!this._down.has(e.code)) this._justPressed.add(e.code);
      this._down.add(e.code);
    },
    _onKeyUp(e) {
      this._down.delete(e.code);
      this._justReleased.add(e.code);
    },
  },

  mouse: {
    x: 0,
    y: 0,
    pressed: false,
    justPressed: false,
    justReleased: false,

    _onMove(e, canvas) {
      const rect = canvas.getBoundingClientRect();
      this.x = e.clientX - rect.left;
      this.y = e.clientY - rect.top;
    },
    _onDown() {
      this.pressed = true;
      this.justPressed = true;
    },
    _onUp() {
      this.pressed = false;
      this.justReleased = true;
    },
    _endFrame() {
      this.justPressed = false;
      this.justReleased = false;
    },
  },

  // Asset Cache: keyed by URL so repeated `load()` calls reuse the same resource.
  _imageCache: new Map(),
  _soundCache: new Map(),

  async loadImage(path) {
    if (this._imageCache.has(path)) return this._imageCache.get(path);
    const img = new Image();
    const promise = new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
    img.src = path;
    this._imageCache.set(path, promise);
    return promise;
  },

  loadSound(path) {
    if (this._soundCache.has(path)) return this._soundCache.get(path);
    const audio = new Audio(path);
    this._soundCache.set(path, audio);
    return audio;
  },

  playSound(path, volume = 1) {
    const base = this.loadSound(path);
    // Clone so overlapping plays of the same effect don't cut eachother off.
    const instance = base.cloneNode();
    instance.volume = volume;
    instance.play();
    return instance;
  },

  switchState(newState) {
    if (this.state) this.state.destroy();
    this.state = newState;
    this.state.create();
  },
};

export default VexGlobal;
