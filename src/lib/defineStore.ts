import { useEffect, useReducer, useRef } from "react";

import { hasChanged, deepClone, isObject } from "@savage181855/utils";

import type {
  DepsType,
  StateType,
  Options,
  Callback,
  Store,
  DepStack,
} from "./types";

// 全局依赖收集
let Dep: DepStack = [];

/** 创建响应式对象 */
function createReactive<T extends object>(target: T): T {
  const deps: DepsType = {};

  const obj = new Proxy(target, {
    get(target, key: string, receiver) {
      const res = Reflect.get(target, key, receiver);
      if (Dep.length > 0) {
        if (!deps[key]) deps[key] = new Set<Callback>();
        Dep.forEach((item) => deps[key]?.add(item));
      }
      // debugger;
      if (isObject(res)) return createReactive(res);

      return res;
    },
    set(target, key: string, value, receiver) {
      const oldV = deepClone((target as any)[key]);
      const res = Reflect.set(target, key, value, receiver);
      // debugger;
      if (hasChanged(oldV, value)) {
        deps[key]?.forEach((item) => item(oldV, value));
      }
      return res;
    },
  });

  return obj;
}

/** 设置计算属性，指定 this 和 传入 state，并且将自己作为 state 的依赖被收集 */
function setupComputed(fns: Record<string, Callback>, proxyStore: StateType) {
  if (fns) {
    for (let k in fns) {
      fns[k] = fns[k].bind(proxyStore, proxyStore);
      Dep.push(() => ((proxyStore as any)[k] = fns[k]()));
      (proxyStore as any)[k] = fns[k]();
      Dep.pop();
    }
  }
}

/** 收集页面使用的数据 */
function useCollectDep() {
  const [, forceUpdate] = useReducer((c) => c + 1, 0);
  const callback = useRef<Callback>();
  // 依赖只收集一次
  if (!callback.current) {
    callback.current = function () {
      forceUpdate();
    };
    Dep.push(callback.current);
  }

  useEffect(() => {
    Dep.pop();
  });
}

/** 转换 actions，解决  store的 action 出现 this 丢失的问题 */
function setupActions(plainStore: StateType, proxyStore: StateType) {
  for (let k in plainStore) {
    if (typeof plainStore[k] === "function") {
      plainStore[k] = (plainStore[k] as Function).bind(proxyStore);
    }
  }
}

/** 给 store 安装 patch 方法 */
function setupPatchOfStore(store: StateType) {
  store.patch = function (val: StateType | Callback) {
    if (typeof val === "object") {
      for (let k in val) {
        store[k] = (val as any)[k];
      }
    }

    if (typeof val === "function") {
      val(store);
    }
  };
}

/** 给 store 安装 watch hook */
function setupStoreOfWatcherHook(store: StateType) {
  store.useWatcher = function useWatcher(v: string, fn: Callback) {
    const callback = useRef<Callback>();
    if (!callback.current) callback.current = fn;
    Dep.push(callback.current);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let temp = store[v];
    Dep.pop();
  };
}

export function defineStore<
  S extends StateType,
  A extends Record<string, Callback>,
  C = {}
>(options: Options<S, A, C>) {
  const actions = options.actions;

  // 先 proxystate，收集计算属性依赖
  const state = createReactive(options.state);

  const computed = options.computed as any as Record<string, Callback>;

  const s = {
    ...state,
    ...computed,
    ...actions,
  } as Record<string, StateType | Callback>;

  const store = createReactive(s);

  setupActions(s, store);
  setupPatchOfStore(store);
  setupStoreOfWatcherHook(store);
  setupComputed(computed, store as any);

  function useStore(): Store<S, A, C> {
    useCollectDep();
    return store as any;
  }
  return useStore;
}
