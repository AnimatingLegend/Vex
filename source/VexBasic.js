/**
 * @file VexBasic.js
 * 
 * The root class for anything that lives in the game world and needs
 *  `update()`/`destroy()` lifecycle hooks.
 */
export default class VexBasic {
    constructor() {
        this.exists = true;
        this.active = true;
        this.visible = true;
        this.alive = true;
        this.ID = -1;
    }

    update(dt) {
        // Override in subclasses.
    }

    draw(ctx, camera) {
        // Override in subclasses.
    }

    destroy() {
        // Override in subclasses to release references.
    }

    kill() {
        this.alive = false;
        this.exists = false;
    }

    revive() {
        this.alive = true;
        this.exists = true;
    }
}
