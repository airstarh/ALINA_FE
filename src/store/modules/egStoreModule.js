// File: egStoreModule.js
const state = {
  sProp: 10
};

const getters = {
  gProp: state => {
    return state.sProp;
  }
};
const mutations = {
  //generic(state, payload) {},
  mProp(state, v) {
    state.sProp = v;
  }
};
const actions = {
  aProp({ commit }, v) {
    commit("mProp", v);
    return v;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
