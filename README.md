# React-store

> 简单、高效的`React`全局状态管理器

## 特点

- **轻量**
- **优雅**
- **高性能**
- **灵活**
- **渐进式**
- **模块化**

## 功能

- **按需渲染**
- **计算属性**
- **监听器**
- **智能提示**

## 安装

```
npm install @savage181855/react-store -S
```

**注意**：第三方镜像同步不及时，一定记得使用官方镜像！！！

## 兼容性

项目使用了 ES6 的`proxy`，仅支持主流浏览器，查看[详情](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7)。

## 快速使用

定义个`useStore`hook 并导出

```javascript
import { defineStore } from "@savage181855/react-store";

export const useStore = defineStore({
  state: {
    count: 0,
    name: "savage",
  },
  actions: {
    increment() {
      this.count += 1;
      this.name = "hell";
    },
    changeName() {
      this.name = "foo";
    },
  },
  computed: {
    dbCount(): number {
      console.debug("dbCount just execute once");
      return this.count * 2;
    },
    three(state): number {
      console.debug("can access the state");
      return this.dbCount * 3;
    },
  },
});
```

在`Counter`组件里导入使用

```javascript
import { memo } from "react";

import { useStore } from "../store";

export function Count() {
  console.debug("count rendered");

  const store = useStore();

  const { count, name, increment, changeName } = store;

  store.useWatcher("count", (oldV, value) => {
    console.debug("watch", oldV, value);
  });

  function changeName2() {
    // pass the object
    store.patch({ name: "bar" });
  }

  function changeName3() {
    // pass the function
    store.patch((state) => (state.name = "shit"));
  }
  return (
    <div>
      <h1>I'm the counter</h1>
      <div>number：{count}</div>
      <div>
        <button onClick={() => increment()}> +1</button>
      </div>
      <h3>{name}</h3>

      {/* use the computed property */}
      <div>{store.dbCount}</div>
      <button onClick={() => changeName()}>changeName</button>
      <button onClick={() => changeName2()}>changeName2</button>
      <button onClick={() => changeName3()}>changeName3</button>
    </div>
  );
}

export default memo(Count);
```


## 结语

希望该工具能够提高您的开发效率和开发体验，请点个 start ！！！，谢谢。