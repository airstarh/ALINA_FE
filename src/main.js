import Vue                 from "vue";
import App                 from "@/App.vue";
import router              from "@/router";
import store               from "@/store/store";
import 'whatwg-fetch'
//#####
Vue.config.productionTip = false;
//#####
import BootstrapVue        from "bootstrap-vue";
Vue.use(BootstrapVue);
import "../public/a010.scss";
//##
import {BootstrapVueIcons} from 'bootstrap-vue'
Vue.use(BootstrapVueIcons);
//#####
import KeenUI              from "keen-ui";
Vue.use(KeenUI);
//#####
/*Initial approach leads to constant console error message: You gave to install lodash*/
/*Or Uncaught TypeError: Cannot redefine property: lodash*/
//import VueLodash    from 'vue-lodash';
import lodash              from "lodash";
Vue.prototype.lodash = lodash;
//const options = {name: 'lodash', lodash: lodash}; // customize the way you want to call it
//Vue.use(VueLodash, options); // options is optional
//#####
import VueCookies          from 'vue-cookies';
Vue.use(VueCookies);
Vue.$cookies.config('1d','/', '', true, 'None');
Vue.$cookies.set('sewa', 'pisewa');
//#####
import VueDateFns          from "vue-date-fns";
import UtilsDate           from "@/Utils/UtilsDate";
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
Vue.filter('unix_to_date_time', function (value, format = "YYYY-MM-DD HH:mm:ss") {
    if (!value) value = 0;
    value = parseInt(value);
    return UtilsDate.UnixSecsToFormat(value, format);
});
Vue.filter('unix_secs_to_date_obj', function (value) {
    value = parseInt(value);
    return UtilsDate.toDateObj(value, true);
});
Vue.filter('json_str', function (value) {
    return JSON.stringify(value);
});
//#####
export const AppAlina = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
