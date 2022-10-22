import { useEffect, useReducer, useRef } from "react";

import {
  installEventCenter,
  hasChanged,
  get,
  deepClone,
  isObject,
} from "@savage181855/utils";

import type {
  Deps,
  StateType,
  Options,
  Callback,
  Store,
  StoreWithGetters,
} from "./types";

let Dep: null | Callback = null;

/*
开发思路：

// 如果用vue的依赖收集原理去做响应式，那么就会有一个问题，如果组件卸载了，没法清除依赖，不用清除依赖，除非不行，换回发布订阅模型

看样子，vue是不会清除依赖，那么这个内存永远都存在这个东西
useStore 执行的时候，所有依赖都收集了

只要把计算属性执行一遍

// 添加两个 api， useWatcher和 patch
然后 把 state，action和处理过的computed，再proxy即可。
*/

/** 创建响应式对象 */
function createReactive<T extends object>(target: T): T {
  const deps: Deps = {};

  const obj = new Proxy(target, {
    get(target, key: string, receiver) {
      const res = Reflect.get(target, key, receiver);
      if (Dep) {
        deps[key]?.add(Dep) || (deps[key] = new Set<Callback>().add(Dep));
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
        deps[key]?.forEach((item) => item());
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
      Dep = function () {
        // debugger;
        (proxyStore as any)[k] = fns[k]();
      };
      (proxyStore as any)[k] = fns[k]();
      Dep = null;
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
    Dep = callback.current;
  }

  useEffect(() => {
    Dep = null;
    if (!callback.current) {
      console.debug("收集完毕");
    }
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

  setupComputed(computed, store as any);

  function useStore(): Store<S, A, C> {
    useCollectDep();
    return store as any;
  }
  return useStore;
}
