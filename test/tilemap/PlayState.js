import { VexState, VexTilemap } from "../../index.js";

function createTileset() {
  const canvas = document.createElement("canvas");
  canvas.width = 64; // 2 tiles wide (32x32 each)
  canvas.height = 32;

  const ctx = canvas.getContext("2d");
  // Tile 1: Green block
  ctx.fillStyle = "#44aa44";
  ctx.fillRect(0, 0, 32, 32);
  // Tile 2: Brown block
  ctx.fillStyle = "#885533";
  ctx.fillRect(32, 0, 32, 32);

  return canvas.toDataURL();
}

export default class PlayState extends VexState {
  async create() {
    const csv = `
    1,1,1,1,1,1,1,1,1,1
    1,0,0,0,0,0,0,0,0,1
    1,0,0,0,0,0,2,2,0,1
    1,0,0,2,2,0,0,0,0,1
    1,1,1,1,1,1,1,1,1,1
    `;

    this.tileMap = new VexTilemap(160, 100);
    await this.tileMap.loadMapFromCSV(csv, createTileset(), 32, 32);
    this.add(this.tileMap);
  }
}
