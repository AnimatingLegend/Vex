import VexBasic from "../../VexBasic.js";
import VexGlobal from "../../VexGlobal.js";

export default class VexTilemap extends VexBasic {
  constructor(x = 0, y = 0) {
    super();
    this.x = x;
    this.y = y;

    this.tileWidth = 0;
    this.tileHeight = 0;
    this.widthInTiles = 0;
    this.heightInTiles = 0;

    this.width = 0;
    this.height = 0;

    this.data = [];

    this.tileSet = null;
    this.scrollFactor = { x: 1, y: 1 };
  }

  draw(ctx, camera) {
    if (!this.visible || !this.tileSet) return;

    const startCol = Math.max(
      0,
      Math.floor((camera.scroll.x - this.x) / this.tileWidth),
    );
    const endCol = Math.min(
      this.widthInTiles,
      Math.ceil((camera.scroll.x + camera.width - this.x) / this.tileWidth),
    );

    const startRow = Math.max(
      0,
      Math.floor((camera.scroll.y - this.y) / this.tileHeight),
    );
    const endRow = Math.min(
      this.heightInTiles,
      Math.ceil((camera.scroll.y + camera.height - this.y) / this.tileHeight),
    );

    const tilesetCols = Math.floor(this.tileSet.width / this.tileWidth);

    for (let r = startRow; r < endRow; r++) {
      for (let c = startCol; c < endCol; c++) {
        const tileIndex = this.getTileIndex(c, r);
        // 0 = empty space.
        if (tileIndex <= 0) continue;

        const graphicIndex = tileIndex - 1;
        const sx = (graphicIndex % tilesetCols) * this.tileWidth;
        const sy = Math.floor(graphicIndex / tilesetCols) * this.tileHeight;

        const dx = this.x + c * this.tileWidth;
        const dy = this.y + r * this.tileHeight;

        ctx.drawImage(
          this.tileSet,
          sx,
          sy,
          this.tileWidth,
          this.tileHeight,
          dx,
          dy,
          this.tileWidth,
          this.tileHeight,
        );
      }
    }
  }

  getTileIndex(col, row) {
    if (
      col < 0 ||
      col >= this.widthInTiles ||
      row < 0 ||
      row >= this.heightInTiles
    )
      return -1;

    let index = row * this.widthInTiles + col;
    return this.data[index];
  }

  getTileAt(worldX, worldY) {
    const col = Math.floor((worldX - this.x) / this.tileWidth);
    const row = Math.floor((worldY - this.y) / this.tileHeight);
    return this.getTileIndex(col, row);
  }

  async loadMapFromCSV(csvData, tilesetPath, tileWidth, tileHeight) {
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.tileSet = await VexGlobal.loadImage(tilesetPath);

    const rows = csvData.trim().split("\n");
    this.heightInTiles = rows.length;
    this.data = [];

    for (let r = 0; r < rows.length; r++) {
      const cols = rows[r]
        .split(",")
        .map((value) => parseInt(value.trim(), 10));
      if (r === 0) this.widthInTiles = cols.length;
      this.data.push(...cols);
    }

    this.width = this.widthInTiles * this.tileWidth;
    this.height = this.heightInTiles * this.tileHeight;
    return this;
  }
}
