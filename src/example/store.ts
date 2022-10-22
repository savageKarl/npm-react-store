import { defineStore } from "../lib";

export const useStore = defineStore({
  state: {
    count: 10,
    name: "savage",
  },
  actions: {
    increment() {
      this.count += 1;
    },
    changeName() {
      this.name = 'foo';
    },
  },
  computed: {
    dbCount() {
      return this.count * 2;
    },
  },
});
