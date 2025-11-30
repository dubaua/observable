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
  /** @private @type {T | undefined} */
  internal;

  /** @private @type {Array<Subscriber<T>>} */
  callbacks = [];

  /** @private @type {T | undefined} */
  initialValue;

  /** Allows to set initial value
   * @param {T} [initial]
   * @public
   */
  constructor(initial) {
    this.internal = initial;
    this.initialValue = initial;
  }

  /**
   * Higher order function accepting subscriber and returning unsubscribe function
   * @param {Subscriber<T>} callback a function accepting next and prev values
   * @returns {() => void} unsubscribe function stops firing callback
   * @public
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

  /** @returns {T | undefined} @public */
  get value() {
    return this.internal;
  }

  /** @param {T | undefined} next @public */
  set value(next) {
    if (next !== this.internal) {
      const prev = this.internal;
      this.internal = next;
      for (let i = 0; i < this.callbacks.length; i++) {
        this.callbacks[i](this.internal, prev);
      }
    }
  }

  /**
   * Clears subscribers and restores initial value
   * @public
   */
  reset() {
    this.callbacks = [];
    this.internal = this.initialValue;
  }
}

export default Observable;
