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
     * @public
     */
    constructor(initial?: T);
    /** @private @type {T | undefined} */
    private internal;
    /** @private @type {Array<Subscriber<T>>} */
    private callbacks;
    /** @private @type {T | undefined} */
    private initialValue;
    /**
     * Higher order function accepting subscriber and returning unsubscribe function
     * @param {Subscriber<T>} callback a function accepting next and prev values
     * @returns {() => void} unsubscribe function stops firing callback
     * @public
     */
    public subscribe(callback: Subscriber<T>): () => void;
    /** @param {T | undefined} next @public */
    public set value(arg: T);
    /** @returns {T | undefined} @public */
    public get value(): T;
    /**
     * Clears subscribers and restores initial value
     * @public
     */
    public reset(): void;
}
