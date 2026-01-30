import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store/store";
import ConfigApi from "@/configs/ConfigApi";
import 'whatwg-fetch'
import VueCookies from 'vue-cookies';
import BootstrapVue from "bootstrap-vue";
import { BootstrapVueIcons } from 'bootstrap-vue'
import lodash from "lodash";
import VueSocialSharing from 'vue-social-sharing'
import VueDateFns from "vue-date-fns";
import VueI18n from 'vue-i18n'
import Translations from '@/locales/index'
import CurrentLocale from "@/services/CurrentLocale";
import CKEditor from '@ckeditor/ckeditor5-vue2';
import YmapPlugin from 'vue-yandex-maps'
import AlinaPageGlobalAnalyzer from '@/services/AlinaPageGlobalAnalyzer'

window.AlinaPageGlobalAnalyzer = AlinaPageGlobalAnalyzer;

Vue.config.productionTip = false;
//#####
Vue.use(YmapPlugin, ConfigApi.YandexMaps)
//#####
Vue.use(CKEditor);
//#####
Vue.use(VueI18n);
const i18n = new VueI18n({
    locale: CurrentLocale.language,
    messages: Translations, // Key - language to use the rule for, `'ru'`, in this case
    // Value - function to choose right plural form
    pluralizationRules: {
        /**
         * @param choice {number} a choice index given by the input to $tc: `$tc('path.to.rule', choiceIndex)`
         * @param choicesLength {number} an overall amount of available choices
         * @returns a final choice index to select plural word by
         */
        'ru': function (choice, choicesLength) {
            // this === VueI18n instance, so the locale property also exists here
            if (choice === 0) {
                return 0;
            }
            const teen = choice > 10 && choice < 20;
            const endsWithOne = choice % 10 === 1;
            if (choicesLength < 4) {
                return (!teen && endsWithOne) ? 1 : 2;
            }
            if (!teen && endsWithOne) {
                return 1;
            }
            if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
                return 2;
            }
            return (choicesLength < 4) ? 2 : 3;
        }
    },
    // SUPPRESS WARNINGS
    silentTranslationWarn: true,        // suppress "missing key" warnings
    silentFallbackWarn: true,            // suppress fallback warnings
});
//#####
Vue.use(VueCookies);
Vue.$cookies.config('1d', '/', '', true, 'None');
//Vue.$cookies.set('test', '11223344');
//#####
Vue.use(BootstrapVue);
//#####
Vue.use(BootstrapVueIcons);
//#####
/*Initial approach leads to constant console error message: You gave to install lodash*/
/*Or Uncaught TypeError: Cannot redefine property: lodash*/
//import VueLodash    from 'vue-lodash';
Vue.prototype.lodash = lodash;
//const options = {name: 'lodash', lodash: lodash}; // customize the way you want to call it
//Vue.use(VueLodash, options); // options is optional
//#####
Vue.use(VueSocialSharing);
//#####
Vue.use(VueDateFns);
//#####
import "@/assets/css/a010.scss";
//#####
export const AppAlina = new Vue({
    i18n,
    router,
    store,
    render: h => h(App)
}).$mount("#app");
