export type Subscriber<T> = (next: T, prev: T | undefined) => void;

declare class Observable<T = any> {
  constructor(initial?: T);
  subscribe(callback: Subscriber<T>): () => void;
  get value(): T;
  set value(next: T);
}

export default Observable;
