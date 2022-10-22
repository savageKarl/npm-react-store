import { defineStore } from "../lib";

export const useStore = defineStore({
  state: {
    count: 0,
    name: "savage",
  },
  actions: {
    increment() {
      this.count += 1;
    },
    changeName() {
      this.name = "foo";
      console.debug(this);

    },
  },
  computed: {
    dbCount() {
      return this.count * 2;
    },
  },
});
