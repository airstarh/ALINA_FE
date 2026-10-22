<template>
  <div
    class="alina-flex-vertical-container"
    :class="{
      'alina-vh-100': !pageIsInIframe,
      'alina-chat-page-layout': $route.meta.chat,
    }"
    :style="{
      overflow: pageIsInIframe ? 'hidden' : '',
    }"
  >
    <div
      class="alina-flex-vertical-header"
      v-if="!fullScreen"
    >
      <MenuHorizontalMain></MenuHorizontalMain>
    </div>
    <div class="alina-flex-vertical-content" :class="{'alina-chat-page-content': $route.meta.chat}">
      <Messages />
      <Spinner />
      <Popup />
      <router-view v-slot="{ Component }">
        <KeepAlive include="tale_feed">
          <component :is="Component" />
        </KeepAlive>
      </router-view>
    </div>
    <div
      class="alina-flex-vertical-footer"
      v-if="!fullScreen"
    >
      <Footer></Footer>
    </div>
  </div>
</template>
<script>
import {defineAsyncComponent} from "vue";
import Messages from "@/components/global/Messages.vue";
import Spinner from "@/components/global/Spinner.vue";
import Popup from "@/components/global/Popup.vue";
import AlinaStorage from "@/services/AlinaStorage";
import PageSettings from "@/services/PageSettings";
import ConfigApi from "@/configs/ConfigApi";
import AlinaPageGlobalAnalyzer from "@/services/AlinaPageGlobalAnalyzer";

const menuModules = import.meta.glob("@/components/_specific/*/MenuHorizontalMain.vue");
const footerModules = import.meta.glob("@/components/_specific/*/Footer.vue");
const specificFolder = import.meta.env.VITE_APP_ALINA_FOLDER || "_specific/default";

function loadSpecificComponent(modules, componentName) {
  const configuredPath = `/src/components/${specificFolder}/${componentName}.vue`;
  const fallbackPath = `/src/components/_specific/default/${componentName}.vue`;
  const loader = modules[configuredPath] || modules[fallbackPath];

  if (!loader) {
    throw new Error(`${componentName} not found in ${specificFolder} or _specific/default`);
  }

  return defineAsyncComponent(loader);
}

export default {
  name: "App",
  components: {
    Messages,
    Spinner,
    Popup,
    MenuHorizontalMain: loadSpecificComponent(menuModules, "MenuHorizontalMain"),
    Footer: loadSpecificComponent(footerModules, "Footer"),
  },
  data() {
    return {
      PageSettings,
      AlinaStorage,
      ConfigApi,
    };
  },
  created() {
    let _this = this;

    // region KEY PRESS
    document.addEventListener("keyup", function (event) {
      if (event.ctrlKey && event.altKey) {
        if (event.key == "f") {
          _this.toggleFullScreen();
        }
        //_this.log(event);
      }
    });
    // endregion KEY PRESS
  },
  computed: {
    pageIsInIframe() {
      return AlinaPageGlobalAnalyzer.pageIsInIframe();
    },
    fullScreen() {
      if (this.pageIsInIframe) {
        return true;
      }
      if (this.PageSettings.showMainMenu === false) {
        return true;
      }
      return false;
    },
  },
  watch: {
    $route(to, from) {},
  },
  methods: {
    toggleFullScreen() {
      this.PageSettings.showMainMenu = !this.PageSettings.showMainMenu;
    },
    log() {},
  },
};
</script>
<style scoped>
.alina-chat-page-layout { height: 100dvh; min-height: 0; overflow: hidden; }
.alina-chat-page-content { display: flex; flex-direction: column; flex: 1 1 0; min-height: 0; overflow: hidden; }
</style>
