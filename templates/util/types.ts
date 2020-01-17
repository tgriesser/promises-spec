/**
 * These types are all intentionally pretty lax, since all we care about
 * is the machinery, not the types. Rest-assured, we make proper use of
 * Generics and don't throw as many unknowns/any's in our real world code.
 */

export type Deferred = {
  promise: APlusPromise;
  resolve: (val: unknown) => void;
  reject: (val: unknown) => void;
};

export type PromiseFn = (
  resolve: (val: unknown) => void,
  reject: (val: unknown) => void
) => void;

export type OnFulfilledFn = (val?: any) => any;

export type OnRejectedFn = (val?: any) => any;

export interface APlusPromise {
  then: (onFulfilledFn?: OnFulfilledFn, onRejected?: OnRejectedFn) => any;
}
