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
      {/* use the computed property */}
      <div>
        <button onClick={() => increment()}> +1</button>
      </div>
      <h3>{name}</h3>
      <button onClick={() => changeName()}>changeName</button>
      <button onClick={() => changeName2()}>changeName2</button>
      <button onClick={() => changeName3()}>changeName3</button>
    </div>
  );
}

export default memo(Count);
