type Callback = (...args: any) => any;
type Deps = { [k: string]: Callback[] };
type StateType = Record<string | number | symbol, unknown>;

export type _StoreWithGetters<G> = {
  readonly [k in keyof G]: G[k] extends (...args: any[]) => infer R ? R : never;
};

export type _GettersTree<S extends StateType> = Record<
  string,
  | ((state: S) => any)
  | (() => any)
>

// 这个计算属性有点复杂，需要把函数类型转为 返回值的类型
// Store 的 C需要再进行一层处理
// 这里改变this指向是为了增加类似提示
type Options<S extends StateType, A, C> = {
  state: S;
  computed?: C & ThisType<S & _StoreWithGetters<C>> & _GettersTree<S>;
  actions?: A & ThisType<S & A & _StoreWithGetters<C>>;
};

// 先别关心store
type Store<S, A, C> = S & A & _StoreWithGetters<C>;

// 遇到问题，改变不到 this 的类型指向，  done
// 改变类型指向用 内置的 ThisType 就好，看 pinia 还是有好处的
// 已经实现 action 访问  state 了 done
// 现在 要实现了 computed 访问 state

// 不能约束 computed 的类型，否则没法转换类型
// 遇到一个问题，actions函数访问不到 computed函数的this
// ThisType 无法访问 一个对象是函数类型的类型

// 先把最基本的类型写完

// 目前是完成计算属性的this指向和进行函数类型转换了，但是现在没法约束计算属性是函数类型

function defineStore<
  S extends StateType,
  A extends Record<string, Callback>,
  C = {}
>(options: Options<S, A, C>) {
  function u1seStore(): Store<S, A, C > {
    const store = { ...options.state, ...options.actions, ...options.computed };
    return store as any;
  }

  return u1seStore;
}

const u1seStore = defineStore({
  state: {
    count: 0,
    name: "savage",
  },
  computed: {
    shit() {},
    dbCount() {
      // this.count
      // return this.count * 2;
    },
  },
  actions: {
    add() {
      console.debug(this.shit);
      console.debug(this.dbCount);
      this.count = 999;
      this.print();
    },
    print() {},
  },
});

const store = u1seStore();
export {};
