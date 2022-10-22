import { defineStore } from "../lib";

export const useStore = defineStore({
  state: {
    count: 2,
    name: "savage",
  },
  actions: {
    increment() {
      this.count += 1;
      this.name = 'fuckyou'
    },
    changeName() {
      this.name = "foo";
    },
  },
  computed: {
    dbCount(): number {
      console.debug("只会执行一次");
      return this.count * 2;
    },
    three(state): number {
      return this.dbCount * 3;
      // return 2;
    },
  },
});
