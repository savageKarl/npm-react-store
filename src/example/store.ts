import { defineStore } from "../lib";

export const useStore = defineStore({
  state: {
    count: 2,
    name: "savage",
  },
  actions: {
    increment() {
      this.count += 1;
      this.name = 'hell'
    },
    changeName() {
      this.name = "foo";
    },
  },
  computed: {
    dbCount(): number {
      console.debug("dbCount just execute once");
      return this.count * 2;
    },
    three(state): number {
      console.debug('can access the state')
      return this.dbCount * 3;
    },
  },
});
