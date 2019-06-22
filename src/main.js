import Vue    from "vue";
import App    from "./App.vue";
import router from "./router";
import store  from "./store/store";

Vue.config.productionTip = false;

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);
import '../public/a010.scss'

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount("#app");
