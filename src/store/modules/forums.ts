import { RegionDetail } from "app/db";
import { Mutation } from "vuex"
import * as MutationTypes from "../mutation-types"

const state = {
  regionList: [] as RegionDetail[],
}

const mutations: { [key: string]: Mutation<typeof state> } = {
  [MutationTypes.UPDATE_REGIONS_LIST](state, payload: RegionDetail[]) {
    state.regionList = payload;
  }
}

export default {
  state,
  mutations,
};

export type State = typeof state;
