import "whatwg-fetch";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";
import "@/assets/css/a010.scss";

import {createApp} from "vue";
import {
  BButton,
  BCollapse,
  BDropdownItem,
  BFormSelect,
  BModal,
  BNavItem,
  BNavItemDropdown,
  BNavbar,
  BNavbarBrand,
  BNavbarNav,
  BNavbarToggle,
  BSpinner,
  createBootstrap,
  vBModal,
  vBToggle,
} from "bootstrap-vue-next";
import VueCookies from "vue3-cookies";
import {CkeditorPlugin} from "@ckeditor/ckeditor5-vue";
import YmapPlugin from "vue-yandex-maps";
import lodash from "lodash";
import {createI18n} from "vue-i18n";

import App from "@/App.vue";
import router from "@/router";
import store from "@/store/store";
import ConfigApi from "@/configs/ConfigApi";
import Translations from "@/locales/index";
import CurrentLocale from "@/services/CurrentLocale";
import AlinaPageGlobalAnalyzer from "@/services/AlinaPageGlobalAnalyzer";

window.AlinaPageGlobalAnalyzer = AlinaPageGlobalAnalyzer;

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: CurrentLocale.language,
  fallbackLocale: "en",
  messages: Translations,
  missingWarn: false,
  fallbackWarn: false,
  pluralRules: {
    ru(choice, choicesLength) {
      if (choice === 0) return 0;
      const teen = choice > 10 && choice < 20;
      const endsWithOne = choice % 10 === 1;
      if (choicesLength < 4) return !teen && endsWithOne ? 1 : 2;
      if (!teen && endsWithOne) return 1;
      if (!teen && choice % 10 >= 2 && choice % 10 <= 4) return 2;
      return choicesLength < 4 ? 2 : 3;
    },
  },
});

const app = createApp(App);
const bootstrapComponents = {
  BButton,
  BCollapse,
  BDropdownItem,
  BFormSelect,
  BModal,
  BNavItem,
  BNavItemDropdown,
  BNavbar,
  BNavbarBrand,
  BNavbarNav,
  BNavbarToggle,
  BSpinner,
};

for (const [name, component] of Object.entries(bootstrapComponents)) {
  app.component(name, component);
}

app.directive("b-modal", vBModal);
app.directive("b-toggle", vBToggle);
app.config.globalProperties.lodash = lodash;
app.use(YmapPlugin, ConfigApi.YandexMaps);
app.use(CkeditorPlugin);
app.use(VueCookies, {
  expireTimes: "1d",
  path: "/",
  domain: "",
  secure: true,
  sameSite: "None",
});
app.use(createBootstrap());
app.use(i18n);
app.use(router);
app.use(store);

export const AppAlina = app.mount("#app");
