export default Observable;
export type Subscriber<T> = (next: T, prev: T | undefined) => void;
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
declare class Observable<T> {
    /** Allows to set initial value
     * @param {T} [initial]
     */
    constructor(initial?: T);
    /** @type {T | undefined} */
    internal: T | undefined;
    /** @type {Array<Subscriber<T>>} */
    callbacks: Subscriber<T>[];
    /**
     * Higher order function acceping subscriber and returning unsubscriber
     * @param {Subscriber<T>} callback a function accepting next and prev values
     * @returns {() => void} unsubscriber function stops firing callback
     */
    subscribe(callback: Subscriber<T>): () => void;
    /** @param {T | undefined} next */
    set value(arg: T);
    /** @returns {T | undefined} */
    get value(): T;
}
