import VexBasic from "./VexBasic.js";
import VexGroup from "./VexGroup.js";

/**
 * @file VexState.js
 * 
 * A screen/scene in the game.
 * Holds all its objects in one root `VexGroup` so `update()` and `draw()`
 *  cascade automatically.
 */
export default class VexState extends VexBasic {
    constructor() {
        super();
        this._group = new VexGroup();
        this.subState = null;
    }

    add(object) {
        return this._group.add(object);
    }

    remove(object) {
        return this._group.remove(object);
    }

    /**
     * Override this - called once when the state becomes active.
     */
    create() {}

    openSubState(subState) {
        this.subState = subState;
        subState.create();
    }

    closeSubState() {
        if (this.subState)
            this.subState.destroy();
        this.subState = null;
    }

    update(dt) {
        if (this.subState) {
            this.subState.update(dt);
            return;
        }
        this._group.update(dt);
    }

    draw(ctx, camera) {
        this._group.draw(ctx, camera);
        if (this.subState)
            this.subState.draw(ctx, camera);
    }

    destroy() {
        this._group.destroy();
    }
}
