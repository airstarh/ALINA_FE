import Vue    from "vue";
import App    from "./App.vue";
import router from "./router";
import store  from "./store/store";

Vue.config.productionTip = false;

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);
import '../public/a010.scss'

import KeenUI from 'keen-ui';
Vue.use(KeenUI);

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount("#app");
