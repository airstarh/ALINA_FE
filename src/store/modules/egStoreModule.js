// File: egStoreModule.js
import Vue  from "vue";

const state = {
	sProp:         10,
};

const getters   = {
	gProp: (state) => {
		return state.sProp;
	}
};
const mutations = {
	//generic(state, payload) {},
	mProp(state, v) {
		Vue.set(state, "sProp", v);
	},
};
const actions   = {
	aProp({commit}, v) {
		commit('mProp', v);
		return v;
	},
};

export default {
	namespaced: true
	, state
	, getters
	, mutations
	, actions
}
