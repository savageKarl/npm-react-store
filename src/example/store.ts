import { defineStore } from "../lib";

export const useStore = defineStore({
  state: {
    count: 0,
    name: "savage",
    user: {
      age:0,
      firstname: 'greet',
      lastname: 'bar',
    },

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
    fullname(state) {
      return state.user.firstname + state.user.lastname;
    }
  },
});
