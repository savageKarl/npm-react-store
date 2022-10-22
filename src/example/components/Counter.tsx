import { memo } from "react";

import { useStore } from "../store";

export function Count() {
  const store = useStore();
  const { count, increment, name, changeName } = store.usePicker([
    "count",
    "name",
    "increment",
    "changeName",
  ]);
// console.debug(dbCount)
  console.debug("count rendered");

  function changeName2() {
    store.patch({ name: "bar" });
  }

  function changeName3() {
    store.patch((state) => (state.name = "shit"));
  }
  store.useWatcher("count", (oldV, v) => {
    console.debug("count change", oldV, v);
  });
  return (
    <div>
      <h1>I'm the counter</h1>
      <div>number：{count}</div>
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
