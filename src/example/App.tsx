import React, { useEffect, useReducer, useRef } from "react";

import Counter from "./components/Counter";
import A from "./components/A";
import B from "./components/B";
import C from "./components/C";

import { useStore } from "./store";

// import {defineStore} from '../lib'

// const useStore = defineStore({
//   state: {
//     count: 0
//   },
//   actions: {
//     print() {
//       this.count = 2
//       console.debug(this)
//     }
//   }
// })

function App() {
  console.debug("app render");
  const store = useStore();

  const { count } = store;
  return (
    <div className="App">
      <header className="App-header">
        <div>{count}</div>
        {/* <div>{store.name}</div> */}
        {/* <button onClick={() => store.count++}>+1</button> */}
        <Counter />
        {/* <A />
        <B />
        <C /> */}
      </header>
    </div>
  );
}

export default App;
