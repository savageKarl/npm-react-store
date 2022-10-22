# React-store

> 简单、高效的`React`全局状态管理器

- **轻量**
- **优雅**
- **高性能**
- **灵活**
- **渐进式**
- **模块化**

## 安装

```
npm install @savage181855/react-store
```

## 兼容性

项目使用了 ES6 的`proxy`，仅支持主流浏览器，查看[详情](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7)。

## 快速使用

定义个`useStore`hook 并导出

```javascript
import { defineStore } from "@savage181855/react-store";

export const useStore = defineStore({
  state: {
    count: 10,
    name: "savage",
  },
  actions: {
    // 会自动传入 state
    increment(state, payload) {
      state.count += 1;
    },
    changeName(state) {
      state.name = "foo";
    },
  },
  computed: {
    // 会自动传入 state
    dbCount(state) {
      return state.count * 2;
    },
  },
});
```

在`Counter`组件里导入使用

```javascript
import { memo } from "react";

import { useStore } from "../store";

export function Count() {
  const store = useStore();
  // 使用 usePicker hook 来导入在 defineStore 里面定义的 state, actions 和 computed
  const { count, increment, name, changeName, dbCount } = store.usePicker([
    "count",
    "name",
    "increment",
    "changeName",
    "dbCount",
  ]);

  // 使用 useWatcher hook 来监听 state 的属性
  store.useWatcher("count", (oldV, v) => {
    console.debug("count change", oldV, v);
  });

  function changeName2() {
    // patch 传入对象将跟 state 对象进行合并
    store.patch({ name: "bar" });
  }

  function changeName3() {
    // patch 传入函数，函数将传入 state 对象
    store.patch((state) => (state.name = "hell"));
  }

  return (
    <div>
      <h1>I'm the counter</h1>
      <div>number：{count}</div>

      {/* 直接使用即可，不需要调用*/}
      <div>计算属性dbCount：{dbCount}</div>
      
      <div>
        <button onClick={() => increment("payload")}> +1</button>
      </div>
      <h3>{name}</h3>
      <button onClick={() => changeName()}>changeName</button>
      <button onClick={() => changeName2()}>changeName2</button>
      <button onClick={() => changeName3()}>changeName3</button>
    </div>
  );
}

export default memo(Count);
```

