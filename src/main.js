import Vue          from "vue";
import App          from "@/App.vue";
import router       from "@/router";
import store        from "@/store/store";
import 'whatwg-fetch'
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
import UtilsDate    from "@/Utils/UtilsDate";

Vue.use(VueDateFns);
//#####
Vue.filter('capitalize', function (value) {
    if (!value) return '';
    value = value.toString();
    return value.charAt(0).toUpperCase() + value.slice(1)
});
Vue.filter('unix_to_date', function (value, format = "YYYY-MM-DD") {
    if (!value) return '';
    value = parseInt(value);
    return UtilsDate.UnixSecsToFormat(value, format);
});

Vue.filter('unix_to_date_time', function (value, format = "YYYY-MM-DD H:m:s") {
    if (!value) return '';
    value = parseInt(value);
    return UtilsDate.UnixSecsToFormat(value, format);
});

Vue.filter('unix_secs_to_date_obj', function (value) {
    value = parseInt(value);
    return UtilsDate.toDateObj(value, true);
});
//#####
export const AppAlina = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
