import VexGroup from "../../VexGroup.js";
import VexSprite from "../../VexSprite.js";

/**
 * @file VexEmitter.js
 *
 * Spawns short-lived particles with randomized velocity,
 *  using the same recycling groups already use so bursts don't allocate new
 *  sprites every time.
 */
export default class VexEmitter extends VexGroup {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
  }

  emit() {
    const particle = this.recycle(() =>
      new VexSprite(this.x, this.y).makeGraphic(4, 4, "#ffaa00"),
    );
    particle.x = this.x;
    particle.y = this.y;
    // Random left / right
    particle.velocity.x = (Math.random() - 0.5) * 200;
    // Upward burst
    particle.velocity.y = -Math.random() * 200;
    particle.lifeSpan;
    particle.age = 0;
  }

  update(dt) {
    super.update(dt);
    this.forEachAlive((particle) => {
      if (particle.age >= particle.lifeSpan) particle.kill();
    });
  }
}
