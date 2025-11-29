/**
 * @template T
 * @typedef {(next: T, prev: T | undefined) => void} Subscriber
 */

/**
 * Creates reactive object allowing set new value and subscribe to the value change.
 * If new value isn't equal to previous, each callback passed via subscribe method will be fired.
 * @template T
 * @class Observable
 */

class Observable {
  /** @type {T | undefined} */
  internal;

  /** @type {Array<Subscriber<T>>} */
  callbacks = [];

  /** Allows to set initial value
   * @param {T} [initial]
   */
  constructor(initial) {
    this.internal = initial;
  }

  /**
   * Higher order function acceping subscriber and returning unsubscriber
   * @param {Subscriber<T>} callback a function accepting next and prev values
   * @returns {() => void} unsubscriber function stops firing callback
   */
  subscribe(callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('[createObservable]: expected callback to be a function.');
    }
    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback);
      this.callbacks = this.callbacks.slice(0, index).concat(this.callbacks.slice(index + 1));
    };
  }

  /** @returns {T | undefined} */
  get value() {
    return this.internal;
  }

  /** @param {T | undefined} next */
  set value(next) {
    if (next !== this.internal) {
      const prev = this.internal;
      this.internal = next;
      for (let i = 0; i < this.callbacks.length; i++) {
        this.callbacks[i](this.internal, prev);
      }
    }
  }
}

export default Observable;
