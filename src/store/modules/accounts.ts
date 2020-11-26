import { Mutation } from "vuex"
import { LOGIN, LOGOUT } from "../mutation-types"

const state = {
  username: '',
}

const mutations: { [key: string]: Mutation<typeof state> } = {
  [LOGIN](state, payload: string) {
    state.username = payload;
  },
  [LOGOUT](state) {
    state.username = '';
  }
}

export default {
  state,
  mutations,
};

export type State = typeof state;
