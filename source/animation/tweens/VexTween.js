const Easing = {
    linear: (tmr) => tmr,
    quadIn: (tmr) => tmr * tmr,
    quadOut: (tmr) => tmr * (2 - tmr),
    quadInOut: (tmr) => (tmr < 0.5 ? 2 * tmr * tmr : -1 + (4 - 2 * tmr) * tmr),
    cubicIn: (tmr) => tmr * tmr * tmr,
    cubicOut: (tmr) => --tmr * tmr * tmr + 1,
};

/**
 * @file VexTween.js
 * 
 * Animates numeric properties of an object over time with an easing function.
 * A lightweight manager tracks all active tweens; 
 *  `VexGame.update()` drives it each frame.
 */
class VexTween {
    constructor(target, properties, duration, options = {}) {
        this.target = target;
        this.duration = duration;
        this.ease = options.ease || Easing.linear;
        this.onComplete = options.onComplete || null;
        this.elapsed = 0;
        this.done = false;

        this._from = {};
        this._to = properties;
        Object.keys(properties).forEach(key => {
            this._from[key] = target[key];
        });
    }

    update(dt) {
        if (this.done)
            return;
        this.elapsed += dt;
        const tmr = Math.min(1, this.elapsed / this.duration);
        const eased = this.ease(tmr);
        Object.keys(this._to).forEach(key => {
            const from = this._from[key];
            const to = this._to[key];
            this.target[key] = from + (to - from) * eased;
        });
        if (tmr >= 1) {
            this.done = true;
            if (this.onComplete)
                this.onComplete();
        }
    }
}

// Static manager - Call VexTween.tween() from anywhere.
const activeTweens = [];

function tween(target, properties, duration, options = {}) {
    const tmr = new VexTween(target, properties, duration, options);
    activeTweens.push(tmr);
    return tmr;
}

function updateTweens(dt) {
    for (let i = activeTweens.length - 1; i >= 0; i--) {
        activeTweens[i].update(dt);
        if (activeTweens[i].done)
            activeTweens.splice(i, 1);
    }
}

function cancelTweensOf(target) {
    for (let i = activeTweens.length - 1; i >= 0; i--) {
        if (activeTweens[i].target === target)
            activeTweens.splice(i, 1);
    }
}

export default { tween, updateTweens, cancelTweensOf, Easing };