import VexBasic from "../VexBasic.js";

/**
 * @file VexText.js
 *
 * Renders a string using the canvas native text APIs.
 * Positioned and drawn the same way a sprite is, so it respects camera scroll and
 *  can be added to any VexGroup/VexState like anything else.
 */
export default class VexText extends VexBasic {
  constructor(x = 0, y = 0, text = "", options = {}) {
    super();
    this.x = x;
    this.y = y;
    this.text = text;

    this.font = options.font || "16px sans-serif";
    this.bold = options.bold || false;
    this.color = options.color || "#ffffff";
    this.align = options.align || "left"; // 'left' | 'center' | 'right'
    this.alpha = options.alpha ?? 1;

    // 0 = Fixed on screen (HUD/UI Text).
    // 1 = Moves fully with the world.
    this.scrollFactor = {
      x: options.scrollFactor?.x ?? 0,
      y: options.scrollFactor?.y ?? 0,
    };
    this.offset = {
      x: 0,
      y: 0,
    };
  }

  setText(text) {
    this.text = text;
    return this;
  }

  draw(ctx, camera) {
    if (!this.visible) return;

    // Same compensation Sprite uses: cancels out the canvas-level camera
    // transform when scrollFactor isn't 1, so scrollFactor 0 text stays
    // pinned to the screen instead of scrolling with the world.
    const sx =
      this.x + camera.scroll.x * (1 - this.scrollFactor.x) - this.offset.x;
    const sy =
      this.y + camera.scroll.y * (1 - this.scrollFactor.y) - this.offset.y;

    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.font = this.bold ? `bold ${this.font}` : this.font;
    ctx.fillStyle = this.color;
    ctx.textAlign = this.align;
    ctx.textBaseline = "top";
    ctx.fillText(this.text, sx, sy);
    ctx.restore();
  }
}
