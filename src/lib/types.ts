export type Callback = (...args: any) => any;
export type DepsType = { [k: string]: Set<Callback> };
export type StateType = Record<string | number | symbol, unknown>;

export type ReturnType<T> = T extends (...args: any) => infer R
  ? R extends (...args: any) => any
    ? ReturnType<R>
    : R
  : never;

export type StoreWithGetters<G> = {
  readonly [K in keyof G]: ReturnType<G[K]>;
};

export type GettersTree<S extends StateType> = Record<
  string,
  ((state: S) => any) | (() => any)
>;

export type Options<S extends StateType, A, C> = {
  state: S;
  computed?: C & ThisType<S & StoreWithGetters<C>> & GettersTree<S>;
  actions?: A & ThisType<S & A & StoreWithGetters<C>>;
};

export type Store<S, A, C> = S &
  A &
  StoreWithGetters<C> & {
    patch(v: Partial<S> | ((arg: S) => unknown)): unknown;
    useWatcher<K extends keyof S>(v: K, fn: (oldV: S[K], V: S[K]) => any): any;
  };

export type DepStack = Callback[];
