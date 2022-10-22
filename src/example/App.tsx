import React, { useEffect, useReducer, useRef, useState } from "react";

import Counter from "./components/Counter";
import A from "./components/A";
import B from "./components/B";
import C from "./components/C";

import { useStore } from "./store";

function App() {
  console.debug("app render");
  const store = useStore();
  // debugger;
  store.useWatcher("count", (oldV, value) => {
    console.debug("watch", oldV, value);
  });
  const { count, dbCount } = store;

  return (
    <div className="App">
      <header className="App-header">
        <div>{count}</div>
        <div>{dbCount}</div>
        <button onClick={() => store.count++}>+1</button>
        {/* <Counter />
        <A />
        <B />
        <C /> */}
      </header>
    </div>
  );
}

export default App;
