import { memo } from "react";
import { useStore } from "../store";

function B() {
  const store = useStore();
  const { count } = store.usePicker(["count", "increment"]);
  console.debug("B rendered");
  return (
    <div>
      <h2>I'm the B</h2>
      <div>number：{count}</div>
    </div>
  );
}

export default memo(B);
