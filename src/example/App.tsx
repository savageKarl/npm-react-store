
import Counter from "./components/Counter";

import { useStore } from "./store";

function App() {
  console.debug("app render");
  const store = useStore();
  // debugger;

  const { count, dbCount, fullname } = store;

  function changeName() {
    store.user.firstname = 'foo'
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>{count}</div>
        <div>{dbCount}</div>
        <div>{fullname}</div>
        <button onClick={() => changeName()}>change name</button>
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
