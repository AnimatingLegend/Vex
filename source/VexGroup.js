import VexBasic from "./VexBasic.js";

export default class VexGroup extends VexBasic {
  constructor(maxSize = 0) {
    super();
    this.members = [];
    this.maxSize = maxSize; // 0 = unlimited
  }

  add(object) {
    const existingIndex = this.members.indexOf(object);
    if (existingIndex !== -1) return object;
    if (this.maxSize > 0 && this.members.length >= this.maxSize) return object;

    this.members.push(object);
    return object;
  }

  remove(object) {
    const i = this.members.indexOf(object);
    if (i !== -1) this.members.splice(i, 1);
    return object;
  }

  /**
   * Reuses a dead member if one exists,
   *  otherwise constructs a new one with factoryFn.
   */
  recycle(factoryFn) {
    const dead = this.members.find((m) => !m.alive);
    if (dead) {
      dead.revive();
      return dead;
    }
    const created = factoryFn();
    this.add(created);
    return created;
  }

  forEach(fn) {
    this.members.forEach((m) => {
      if (m.exists) fn(m);
    });
  }

  forEachAlive(fn) {
    this.members.forEach((m) => {
      if (m.exists && m.alive) fn(m);
    });
  }

  update(dt) {
    this.members.forEach((m) => {
      if (m.exists && m.active) m.update(dt);
    });
  }

  draw(ctx, camera) {
    this.members.forEach((m) => {
      if (m.exists && m.visible) m.draw(ctx, camera);
    });
  }

  countLiving() {
    return this.members.filter((m) => m.exists && m.alive).length;
  }

  clear() {
    this.members.length = 0;
  }

  destroy() {
    this.members.forEach((m) => m.destroy());
    this.members.length = 0;
  }
}
