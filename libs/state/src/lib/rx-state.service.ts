import { Injectable, OnDestroy } from '@angular/core';
import {
  interval,
  isObservable,
  Observable,
  OperatorFunction,
  Subscribable,
  Subscription,
  Unsubscribable
} from 'rxjs';
import {
  createAccumulationObservable,
  createSideEffectObservable,
  isOperateFnArrayGuard,
  isStringArrayGuard,
  pipeFromArray,
  stateful,
  WrongSelectParamsError,
  isKeyOf
} from './core';
import { filter, map, pluck, tap } from 'rxjs/operators';

type ProjectStateFn<T> = (oldState: T) => Partial<T>;
type ProjectValueFn<T, K extends keyof T> = (oldState: T) => T[K];

type ProjectStateReducer<T, V> = (oldState: T, value: V) => Partial<T>;

type ProjectValueReducer<T, K extends keyof T, V> = (
  oldState: T,
  value: V
) => T[K];

/**
 * @description
 * RxState is a light-weight reactive state management service for managing local state in angular.
 *
 * ![state logo](https://raw.githubusercontent.com/BioPhoton/rx-angular/master/libs/state/images/state_logo.png)
 *
 * @example
 * ```Typescript
 * Component({
 *   selector: 'app-stateful',
 *   template: `<div>{{ state$ | async | json }}</div>`,
 *   providers: [RxState]
 * })
 * export class StatefulComponent {
 *   readonly state$ = this.state.select();
 *
 *   constructor(private state: RxState<{ foo: string }>) {}
 * }
 * ```
 *
 * @docsCategory RxState
 * @docsPage RxState
 */
@Injectable()
export class RxState<T extends object> implements OnDestroy, Subscribable<T> {
  private subscription = new Subscription();

  private accumulationObservable = createAccumulationObservable<T>();
  private effectObservable = createSideEffectObservable();

  /**
   * @description
   * The full unmodified state exposed as `Observable<T>`
   * The main difference between `$`and `select` is,
   * `select` uses publishReplay(1) under the hood and applies the {@link stateful} operator internally.
   */
  readonly $ = this.accumulationObservable.signal$;

  /**
   * @internal
   */
  constructor() {
    this.subscription.add(this.subscribe());
  }

  /**
   * @internal
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * @description
   * Read from the state in imperative manner. Returns the state object in its current state.
   *
   * @example
   * ```Typescript
   * const { disabled } = state.get();
   * if (!disabled) {
   *   doStuff();
   * }
   * ```
   *
   * @return T
   */
  get(): T {
    return this.accumulationObservable.state;
  }

  /**
   * @description
   * Manipulate one or many properties of the state by providing a `Partial<T>` state or a `ProjectionFunction<T>`.
   *
   * @example
   * Update one or many properties of the state by providing a `Partial<T>`
   * ```TypeScript
   * const partialState = {
   *   foo: 'bar',
   *   bar: 5
   * };
   * state.set(partialState);
   * ```
   *
   * Update one or many properties of the state by providing a `ProjectionFunction<T>`
   * ```TypeScript
   * const reduceFn = oldState => ({
   *   bar: oldState.bar + 5
   * });
   * state.set(reduceFn);
   * ```
   *
   * @param {Partial<T>|ProjectStateFn<T>} stateOrProjectState
   * @return void
   */
  set(stateOrProjectState: Partial<T> | ProjectStateFn<T>): void;

  /**
   * @description
   * Manipulate a single property of the state by the property name and a `ProjectionFunction<T>`.
   *
   * @example
   * ```TypeScript
   * const reduceFn = oldState => oldState.bar + 5;
   * state.set('bar', reduceFn);
   * ```
   *
   * @param {K} key
   * @param {ProjectValueFn<T, K>} projectSlice
   * @return void
   */
  set<K extends keyof T, O>(key: K, projectSlice: ProjectValueFn<T, K>): void;
  /**
   * @internal
   */
  set<K extends keyof T>(
    keyOrStateOrProjectState: Partial<T> | ProjectStateFn<T> | K,
    stateOrSliceProjectFn?: ProjectValueFn<T, K>
  ): void {
    if (
      typeof keyOrStateOrProjectState === 'object' &&
      stateOrSliceProjectFn === undefined
    ) {
      this.accumulationObservable.nextSlice(keyOrStateOrProjectState);
      return;
    }

    if (
      typeof keyOrStateOrProjectState === 'function' &&
      stateOrSliceProjectFn === undefined
    ) {
      this.accumulationObservable.nextSlice(
        keyOrStateOrProjectState(this.accumulationObservable.state)
      );
      return;
    }

    if (
      isKeyOf<T>(keyOrStateOrProjectState) &&
      typeof stateOrSliceProjectFn === 'function'
    ) {
      const state: Partial<T> = {};
      state[keyOrStateOrProjectState] = stateOrSliceProjectFn(
        this.accumulationObservable.state
      );
      this.accumulationObservable.nextSlice(state);
      return;
    }

    throw new Error('wrong param');
  }

  /**
   * @description
   * Connect an `Observable<Partial<T>>` to the state `T`.
   * Any change emitted by the source will get merged into the state.
   * Subscription handling is done automatically.
   *
   * @example
   * ```Typescript
   * const sliceToAdd$ = interval(250).pipe(mapTo({
   *   bar: 5,
   *   foo: 'foo'
   * });
   * state.connect(sliceToAdd$);
   * // every 250ms the properties bar and foo get updated due to the emission of sliceToAdd$
   * ```
   *
   * Additionally you can provide a `projectionFunction` to access the current state object and do custom mappings.
   * ```Typescript
   * const sliceToAdd$ = interval(250).pipe(mapTo({
   *   bar: 5,
   *   foo: 'foo'
   * });
   * state.connect(sliceToAdd$, (state, slice) => state.bar += slice.bar);
   * // every 250ms the properties bar and foo get updated due to the emission of sliceToAdd$. Bar will increase by
   * 5 due to the projectionFunction
   * ```
   */
  connect<V>(
    inputOrSlice$: Observable<Partial<T> | V>,
    projectFn?: ProjectStateReducer<T, V>
  ): void;
  /**
   *
   * @description
   * Connect an `Observable<T[K]>` source to a specific property `K` in the state `T`. Any emitted change will update
   * this
   * specific property in the state.
   * Subscription handling is done automatically.
   *
   * @example
   * ```Typescript
   * const myTimer$ = interval(250);
   * state.connect('timer', myTimer$);
   * // every 250ms the property timer will get updated
   * ```
   */
  connect<K extends keyof T>(key: K, slice$: Observable<T[K]>): void;
  /**
   *
   * @description
   * Connect an `Observable<Partial<T>>` source to a specific property in the state. Additionally you can provide a
   * `projectionFunction` to access the current state object on every emission of your connected `Observable`.
   * Any change emitted by the source will get merged into the state.
   * Subscription handling is done automatically.
   *
   * @example
   *
   * ```Typescript
   * const myTimer$ = interval(250);
   * state.connect('timer', myTimer$, (state, timerChange) => state.timer += timerChange);
   * // every 250ms the property timer will get updated
   * ```
   */
  connect<K extends keyof T, V>(
    key: K,
    input$: Observable<V>,
    projectSliceFn: ProjectValueReducer<T, K, V>
  ): void;
  /**
   * @internal
   */
  connect<K extends keyof T, V>(
    keyOrInputOrSlice$: K | Observable<Partial<T> | V>,
    projectOrSlices$?: ProjectStateReducer<T, V> | Observable<T[K]>,
    projectValueFn?: ProjectValueReducer<T, K, V>
  ): void {
    if (
      isObservable<Partial<T>>(keyOrInputOrSlice$) &&
      projectOrSlices$ === undefined &&
      projectValueFn === undefined
    ) {
      const slice$ = keyOrInputOrSlice$.pipe(
        filter(slice => slice !== undefined)
      );
      this.accumulationObservable.nextSliceObservable(slice$);
      return;
    }

    if (
      isObservable<V>(keyOrInputOrSlice$) &&
      typeof projectOrSlices$ === 'function' &&
      !isObservable<T[K]>(projectOrSlices$) &&
      projectValueFn === undefined
    ) {
      const project = projectOrSlices$;
      const slice$ = keyOrInputOrSlice$.pipe(
        filter(slice => slice !== undefined),
        map(v => project(this.get(), v))
      );
      this.accumulationObservable.nextSliceObservable(slice$);
      return;
    }

    if (
      isKeyOf<T>(keyOrInputOrSlice$) &&
      isObservable<T[K]>(projectOrSlices$) &&
      projectValueFn === undefined
    ) {
      const key = keyOrInputOrSlice$;
      const slice$ = projectOrSlices$.pipe(
        filter(slice => slice !== undefined),
        map(value => ({ ...{}, [key]: value }))
      );
      this.accumulationObservable.nextSliceObservable(slice$);
      return;
    }

    if (
      isKeyOf<T>(keyOrInputOrSlice$) &&
      isObservable<V>(projectOrSlices$) &&
      typeof projectValueFn === 'function'
    ) {
      const key = keyOrInputOrSlice$;
      const slice$ = projectOrSlices$.pipe(
        filter(slice => slice !== undefined),
        map(value => ({ ...{}, [key]: projectValueFn(this.get(), value) }))
      );
      this.accumulationObservable.nextSliceObservable(slice$);
      return;
    }

    throw new Error('wrong params passed to connect');
  }

  /**
   * @description
   * returns the state as cached and distinct `Observable<T>`. This way you don't have to think about **late
   * subscribers**,
   * **multiple subscribers** or **multiple emissions** of the same value
   *
   * @example
   * ```Typescript
   * const state$ = state.select();
   * state$.subscribe(state => doStuff(state));
   * ```
   *
   * @returns Observable<T>
   */
  select(): Observable<T>;

  /**
   * @description
   * returns the state as cached and distinct `Observable<A>`. Accepts arbitrary
   * [rxjs operators](https://rxjs-dev.firebaseapp.com/guide/operators) to enrich the selection with reactive composition.
   *
   * @example
   * ```Typescript
   * const profilePicture$ = state.select(
   *  pluck('profilePicture'),
   *  switchMap(profilePicture => mapImageAsync(profilePicture))
   * );
   * ```
   * @param op { OperatorFunction<T, A> }
   * @returns Observable<A>
   */
  select<A = T>(op: OperatorFunction<T, A>): Observable<A>;
  /**
   * @internal
   */
  select<A = T, B = A>(
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>
  ): Observable<B>;
  /**
   * @internal
   */
  select<A = T, B = A, C = B>(
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>
  ): Observable<C>;
  /**
   * @internal
   */
  select<A = T, B = A, C = B, D = C>(
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>
  ): Observable<D>;
  /**
   * @internal
   */
  select<A = T, B = A, C = B, D = C, E = D>(
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>
  ): Observable<E>;
  /**
   * @description
   * Access a single property of the state by providing keys.
   * Returns a single property of the state as cached and distinct `Observable<T[K1]>`.
   *
   * @example
   *  **Access a single property**
   * ```Typescript
   * const bar$ = state.select('bar');
   * ```
   *
   * **Access a nested property**
   * ```Typescript
   * const foo$ = state.select('bar', 'foo');
   * ```
   * @return Observable<T[K1]>
   */
  select<K1 extends keyof T>(k1: K1): Observable<T[K1]>;
  /**
   * @internal
   */
  select<K1 extends keyof T, K2 extends keyof T[K1]>(
    k1: K1,
    k2: K2
  ): Observable<T[K1][K2]>;
  /**
   * @internal
   */
  select<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2]
  >(k1: K1, k2: K2, k3: K3): Observable<T[K1][K2][K3]>;
  /**
   * @internal
   */
  select<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3]
  >(k1: K1, k2: K2, k3: K3, k4: K4): Observable<T[K1][K2][K3][K4]>;
  /**
   * @internal
   */
  select<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4]
  >(k1: K1, k2: K2, k3: K3, k4: K4, k5: K5): Observable<T[K1][K2][K3][K4][K5]>;
  /**
   * @internal
   */
  select<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5]
  >(
    k1: K1,
    k2: K2,
    k3: K3,
    k4: K4,
    k5: K5,
    k6: K6
  ): Observable<T[K1][K2][K3][K4][K5][K6]>;
  /**
   * @internal
   */
  select<R>(
    ...opOrMapFn: OperatorFunction<T, R>[] | string[]
  ): Observable<T | R> {
    if (!opOrMapFn || opOrMapFn.length === 0) {
      return this.accumulationObservable.state$.pipe(stateful());
    } else if (isStringArrayGuard(opOrMapFn)) {
      return this.accumulationObservable.state$.pipe(
        stateful(pluck(...opOrMapFn))
      );
    } else if (isOperateFnArrayGuard(opOrMapFn)) {
      return this.accumulationObservable.state$.pipe(
        stateful(pipeFromArray(opOrMapFn))
      );
    }
    throw new WrongSelectParamsError();
  }

  /**
   * @description
   * Manages side-effects of your state. Provide an `Observable<any>` **side-effect** and an optional
   * `sideEffectFunction`.
   * Subscription handling is done automatically.
   *
   * @example
   * Directly pass an observable side-effect
   * ```Typescript
   * const localStorageEffect$ = changes$.pipe(
   *  tap(changes => storeChanges(changes))
   * );
   *
   * state.hold(localStorageEffect$);
   * ```
   *
   * Pass an additional `sideEffectFunction`
   * ```Typescript
   * const localStorageEffectFn = changes => storeChanges(changes);
   * state.hold(changes$, localStorageEffectFn);
   * ```
   */
  hold<S>(
    obsOrObsWithSideEffect: Observable<S>,
    sideEffectFn?: (arg: S) => void
  ): void {
    if (sideEffectFn) {
      this.effectObservable.nextEffectObservable(
        obsOrObsWithSideEffect.pipe(tap(sideEffectFn))
      );
      return;
    }
    this.effectObservable.nextEffectObservable(obsOrObsWithSideEffect);
  }

  /**
   * @internal
   */
  subscribe(): Unsubscribable {
    const subscription = new Subscription();
    subscription.add(this.accumulationObservable.subscribe());
    subscription.add(this.effectObservable.subscribe());
    return subscription;
  }
}
