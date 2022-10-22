import React, { useEffect, useReducer, useRef } from "react";

import Counter from "./components/Counter";
import A from "./components/A";
import B from "./components/B";
import C from "./components/C";



// const useStore = defineStore({
//   state: {
//     count: 0
//   },
//   actions: {

//   },
//   computed: {

//   }
// });

function App() {
  console.debug("app render");
  // const store = useStore();
  // store
  return (
    <div className="App">
      <header className="App-header">
        {/* {store.count}
        {store.count} */}
        {/* <button onClick={() => n.current++}>+1</button> */}
        {/* <button onClick={() => store.count++}>+1</button> */}
        {/* <Counter />
        <A />
        <B />
        <C /> */}
      </header>
    </div>
  );
}

export default App;
