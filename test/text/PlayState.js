import {
  VexState,
  VexSprite,
  VexGlobal,
  VexText,
  VexEmitter,
} from "../../index.js";

/**
 * @file PlayState.js
 *
 * A minimal "hello world" for Vex:
 * Click on the block to add 50 points to your score.
 */
export default class PlayState extends VexState {
  create() {
    this.descText = new VexText(100, 100, "Click on the block!", {
      font: "20px Courier New",
      bold: true,
      color: "#ffffff",
    });
    this.descText.x = 200;
    this.descText.y = 110;
    this.add(this.descText);

    this.block = new VexSprite(255, 180).makeGraphic(120, 120, "#ffffff");
    this.add(this.block);

    this.scoreText = new VexText(100, 100, "Score: 0", {
      font: "20px Courier New",
      bold: true,
      color: "#ffffff",
    });
    this.scoreText.x = 250;
    this.scoreText.y = 350;
    this.add(this.scoreText);

    this.score = 0;

    this.particles = new VexEmitter(0, 0);
    this.add(this.particles);
  }

  update(dt) {
    super.update(dt);

    if (VexGlobal.mouse.justPressed) {
      this.particles.x = VexGlobal.mouse.x;
      this.particles.y = VexGlobal.mouse.y;
      for (let i = 0; i < 8; i++) {
        this.particles.emit();
      }

      this.score += 20;
      this.scoreText.setText(`Score: ${this.score}`);
    }
  }
}
