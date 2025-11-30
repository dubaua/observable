/* eslint-disable no-unused-vars */
import assert from 'assert';
import Observable from './observable.js';

describe('Observable', () => {
  it('can pass initial value as constructor parameter', () => {
    const initial = 42;
    const observable = new Observable(initial);
    assert.strictEqual(observable.value, initial);
  });

  it('can subscribe to change', () => {
    const observable = new Observable();

    let counter = 0;

    function subscriber() {
      counter++;
    }

    observable.subscribe(subscriber);

    observable.value = 'some';

    assert.strictEqual(counter, 1);
  });

  it('subscriber function accepts next and prev values', () => {
    const initial = 42;
    const following = 69;
    const observable = new Observable(initial);

    const tempStorage = {};

    function subscriber(next, prev) {
      tempStorage.next = next;
      tempStorage.prev = prev;
    }

    observable.subscribe(subscriber);

    observable.value = following;

    const isNextAndPrevCaught = tempStorage.next === following && tempStorage.prev === initial;

    assert.strictEqual(isNextAndPrevCaught, true);
  });

  it('subscribe methods return higher order function allowing to unsubscribe', () => {
    const observable = new Observable();

    const log = [];

    function logger(next) {
      log.push(next);
    }

    const stopLogging = observable.subscribe(logger);

    observable.value = 0;
    const firstCaught = log.length === 1;

    observable.value = 42;
    const secondCaught = log.length === 2;

    stopLogging();
    observable.value = 69;
    const thirdNotCaught = log.length === 2;

    const successfullyUnsubscribed = firstCaught && secondCaught && thirdNotCaught;

    assert.strictEqual(successfullyUnsubscribed, true);
  });

  it('throws an error if subscriber is not a function', () => {
    const observable = new Observable();

    function errorCase() {
      observable.subscribe(null);
    }

    assert.throws(errorCase, /\[createObservable\]: expected callback to be a function./);
  });

  it('correctly unsubscribe if multiple subscribers added', () => {
    const observable = new Observable();

    const log1 = [];

    function logger1(next) {
      log1.push(next);
    }

    const log2 = [];

    function logger2(next) {
      log2.push(next);
    }

    const log3 = [];

    function logger3(next) {
      log3.push(next);
    }

    const stopLogging1 = observable.subscribe(logger1);
    const stopLogging2 = observable.subscribe(logger2);
    const stopLogging3 = observable.subscribe(logger3);

    observable.value = 1;
    observable.value = 2;
    observable.value = 3;
    observable.value = 4;
    observable.value = 5;
    stopLogging2();
    observable.value = 6;
    observable.value = 7;
    observable.value = 8;

    const firstAndThirdContunedLoggingAndSecondStopped = log1.length === 8 && log2.length === 5 && log3.length === 8;

    assert.strictEqual(firstAndThirdContunedLoggingAndSecondStopped, true);
  });

  it('callback is not fired if next value is equal to prev', () => {
    const initial = 42;
    const observable = new Observable(initial);

    const log = [];
    function logger(next) {
      log.push(next);
    }

    const stopLogging = observable.subscribe(logger);

    observable.value = initial;
    observable.value = initial;
    observable.value = initial;

    const callbackNotFiredIfValueDidntChanged = log.length === 0;

    assert.strictEqual(callbackNotFiredIfValueDidntChanged, true);
  });

  it('reset clears subscribers and restores initial value', () => {
    const initial = 10;
    const observable = new Observable(initial);

    const log = [];
    observable.subscribe((next) => {
      log.push(next);
    });

    observable.value = 20;
    observable.reset();
    const resetBackToInitial = observable.value === initial;

    observable.value = 30;
    const subscriberNotCalledAfterReset = log.length === 1;

    assert.strictEqual(resetBackToInitial, true);
    assert.strictEqual(subscriberNotCalledAfterReset, true);
  });
});
