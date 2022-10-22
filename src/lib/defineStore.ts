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

let Dep: any = null;

/*
开发思路：


// 如果用vue的依赖收集原理去做响应式，那么就会有一个问题，如果组件卸载了，没法清除依赖，不用清除依赖，除非不行，换回发布订阅模型

看样子，vue是不会清除依赖，那么这个内存永远都存在这个东西
useStore 执行的时候，所有依赖都收集了

只要把计算属性执行一遍


// 添加两个 api， useWatcher和 patch
然后 把 state，action和处理过的computed，再proxy即可。





*/

function createReactive<T extends object>(target: T): T {
  const deps: Deps = {};

  const obj = new Proxy(target, {
    get(target, key: string, receiver) {
      const res = Reflect.get(target, key, receiver);
      if (Dep) {
        console.debug("收集依赖", key, Dep);
        deps[key]?.add(Dep) || (deps[key] = new Set<Callback>().add(Dep));
      }
      // debugger;
      if (isObject(res)) return createReactive(res);

      return res;
    },
    set(target, key: string, value, receiver) {
      const res = Reflect.set(target, key, value, receiver);
      // debugger;
      console.debug("渲染组件");
      console.debug(deps[key], "当前属性依赖");
      deps[key]?.forEach((item) => {
        item();
      });
      return res;
    },
  });

  return obj;
}

function setupComputed(fns: Record<string, Callback>, s: StateType) {
  if (fns) {
    for (let k in fns) {
      fns[k] = fns[k].bind(fns, s);
      // 这里的依赖需要再看看具体怎么实现 todo
      Dep = { name: k, fn: fns[k] };
      fns[k] = fns[k]();
      Dep = null;
    }
  }
}

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




export function defineStore<
  S extends StateType,
  A extends Record<string, Callback>,
  C = {}
>(options: Options<S, A, C>) {
  const state = options.state;
  const actions = options.actions;

  // 先proxystate，收集计算属性依赖
  options.state = createReactive(options.state);

  const computed = options.computed as any as Record<string, Callback>;
  setupComputed(computed, options.state);

  const s = {
    ...state,
    ...computed,
    ...actions,
  };

  const store = createReactive(s);
  // 这里要写一个函数

  function useStore(): Store<S, A, C> {
    // 如果使用vue的依赖收集法，每个属性收集自己的依赖，然后自己改变，就执行依赖就行，不需要引入事件中心了，实际上，每个属性，都有自己的事件中心
    useCollectDep();
    return store as any;
    // return store as any;
  }
  return useStore;
}


defineStore({
  state: {
    count: 0
  },
  actions: {
    shit() {
      this.count = 1
    }
  }
})