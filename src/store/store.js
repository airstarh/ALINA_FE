import Vue           from "vue";
import Vuex          from "vuex";
import egStoreModule from "./modules/egStoreModule";

Vue.use(Vuex);

export default new Vuex.Store({
	state:     {},
	mutations: {},
	actions:   {},
	modules:   {
		egStoreModule
	}
});
