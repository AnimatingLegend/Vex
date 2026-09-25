import { VexState, VexText, VexSprite, VexGlobal } from "../../index.js";

export default class PlayState extends VexState {
  create() {
    this.musicPath = "./assets/sound/NCS_Electric_PopMusic.wav";

    this.descText = new VexText(
      100,
      100,
      "Click on the block to Play / Fade in the song",
      {
        font: "20px Courier New",
        bold: true,
        color: "#ffffff",
      },
    );
    this.descText.x = 55;
    this.descText.y = 110;
    this.add(this.descText);

    this.block = new VexSprite(255, 180).makeGraphic(120, 120, "#ffffff");
    this.add(this.block);

    this.descTextTwo = new VexText(100, 100, "Space to fade out", {
      font: "20px Courier New",
      bold: true,
      color: "#ffffff",
    });
    this.descTextTwo.x = 210;
    this.descTextTwo.y = 350;
    this.add(this.descTextTwo);
  }

  update(dt) {
    super.update(dt);

    const mouseX = VexGlobal.mouse.x;
    const mouseY = VexGlobal.mouse.y;
    const clickedBlock =
      mouseX >= this.block.x &&
      mouseX <= this.block.x + this.block.width &&
      mouseY >= this.block.y &&
      mouseY <= this.block.y + this.block.height;

    // Start looping music with a 2-second smooth fade-in.
    if (VexGlobal.mouse.justPressed && clickedBlock) {
      const music = VexGlobal.playMusic(this.musicPath, 0, true);
      if (music !== null) music.fadeIn(2, 0.8);
      console.log(
        "Playing & Fading In (Volume: 0.8). Press Space to Fade Out.",
      );
    }

    if (VexGlobal.keys.justPressed("Space")) {
      VexGlobal.stopMusic(2);
      console.log("Fading Out (2s)...\nClick to Play Again");
    }
  }
}
