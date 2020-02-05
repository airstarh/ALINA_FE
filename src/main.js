import Vue          from "vue";
import App          from "@/App.vue";
import router       from "@/router";
import store        from "@/store/store";
//#####
Vue.config.productionTip = false;
//#####
import BootstrapVue from "bootstrap-vue";

Vue.use(BootstrapVue);
import "../public/a010.scss";
//#####
import KeenUI       from "keen-ui";

Vue.use(KeenUI);
//#####
import VueLodash    from 'vue-lodash';

const options = {name: 'lodash'}; // customize the way you want to call it
Vue.use(VueLodash, options); // options is optional
//#####
const VueCookie = require('vue-cookie');
Vue.use(VueCookie);
//#####
import VueDateFns   from "vue-date-fns";

Vue.use(VueDateFns);
//#####
export const AppAlina = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
