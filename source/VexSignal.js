/**
 * @file VexSignal.js
 * 
 * A simple typed event dispatcher.
 */
export default class VexSignal {
    constructor() {
        this.listeners = [];
    }

    add(listener) {
        this.listeners.push(listener);
        return listener;
    }

    addOnce(listener) {
        const wrapped = (...args) => {
            this.remove(wrapped);
            listener(...args);
        };
        return this.add(wrapped);
    }

    remove(listener) {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) 
            this.listeners.splice(index, 1);
    }

    removeAll() {
        this.listeners.length = 0;
    }

    dispatch(...args) {
        // Copy the array in case a listener adds/removes during dispatch.
        [...this.listeners].forEach((listener) => listener(...args));
    }
}
