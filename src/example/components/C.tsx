import { memo } from "react";
import { useStore } from "../store";

function C() {
  const store = useStore();
  const { dbCount } = store;
  console.debug("C rendered");
  return (
    <div>
      <h2>I'm the C</h2>

      <div>计算属性dbCount：{dbCount}</div>
      <div>计算属性dbCount：{dbCount}</div>
    </div>
  );
}

export default memo(C);
