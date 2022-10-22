import { defineStore } from "../lib/index";

export const useStore = defineStore({
  state: {
    count: 10,
    name: "savage",
  },
  actions: {
    // 会自动传入 state
    increment(state, payload) {
      state.count += 1;
      // console.debug(state, payload);
    },
    changeName(state) {
      state.name = "foo";
    },
  },
  computed: {
    dbCount(state) {
      console.debug('计算属性 dbcount只会执行一次')
      return state.count * 2;
    }
  }
});
