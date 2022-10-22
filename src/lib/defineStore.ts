import {useEffect, useReducer, useRef} from 'react'


let Dep: any = null;

type Callback = (...args: any) => unknown;
type Deps = { [k: string]: Set<Callback> };
type StateType = Record<string, unknown>;

type Options<S extends StateType, A, C> = {
  state: S;
  actions?: A & Record<string, Callback>;
  computed?: C & Record<string, Callback>;
};

type Store<S, A, C> =  S

export type StoreGeneric = Store<
  StateType,
  Record<string, Callback>,
  Record<string, Callback>
>;

type StoreDefinition<S extends StateType, A, C> = {
  (): Store<S, A, C>;
};

function defineStore<S extends StateType, A, C>(
  options: Options<S, A, C>
): StoreDefinition<S, A, C> {
  const s = {
    ...options.state,
    // ...options.actions,
    // ...options.computed,
    
  };
  

  const deps: Deps = {};

  const store = new Proxy(s, {
    get(target, key: string, receiver) {
      const res = Reflect.get(target, key, receiver);
      if (Dep) {
        console.debug("收集依赖", key, Dep);
        deps[key]?.add(Dep) || (deps[key] = new Set<Callback>().add(Dep));
      }
      return res;
    },
    set(target, key: string, value, receiver) {
      const res = Reflect.set(target, key, value, receiver);
      console.debug("渲染组件");
      console.debug(deps[key], "当前属性依赖");
      deps[key]?.forEach((item) => {
        item();
      });
      return res;
    },
  });



 function useStore (): StoreGeneric {
    // 如果使用vue的依赖收集法，每个属性收集自己的依赖，然后自己改变，就执行依赖就行，不需要引入事件中心了，实际上，每个属性，都有自己的事件中心

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

    return store;
  };
  return useStore as any;
}