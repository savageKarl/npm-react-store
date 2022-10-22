import { memo } from "react";
import { useStore } from "../store";

function B() {
  const store = useStore();
  console.debug("B rendered");
  return (
    <div>
      <h2>I'm the B</h2>
      <div>number：{store.count}</div>
    </div>
  );
}

export default memo(B);
