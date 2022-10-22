
import Counter from "./components/Counter";

import { useStore } from "./store";

function App() {
  console.debug("app render");
  const store = useStore();
  // debugger;

  const { count, dbCount } = store;

  return (
    <div className="App">
      <header className="App-header">
        <div>{count}</div>
        <div>{dbCount}</div>
        <button onClick={() => store.count++}>+1</button>
        <Counter />
        {/* <A />
        <B />
        <C /> */}
      </header>
    </div>
  );
}

export default App;
