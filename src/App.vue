<template>
  <div
      class="alina-flex-vertical-container"
      :class="{
          'alina-vh-100':!pageIsInIframe
        }"
      :style="{
          'overflow': pageIsInIframe ? 'hidden':''
        }"
  >
    <div class="alina-flex-vertical-header" v-if="!fullScreen">
      <MenuHorizontalMain></MenuHorizontalMain>
    </div>
    <div class="alina-flex-vertical-content">
      <Messages></Messages>
      <Spinner></Spinner>
      <router-view></router-view>
    </div>
    <div class="alina-flex-vertical-footer" v-if="!fullScreen">
      <Footer></Footer>
    </div>
  </div>
</template>
<script>
import MenuHorizontalMain      from "@/components/MenuHorizontalMain";
import Footer                  from "@/components/Footer";
import Messages                from "@/components/global/Messages";
import Spinner                 from "@/components/global/Spinner";
import AlinaStorage            from "@/services/AlinaStorage";
import UtilsArray              from "@/Utils/UtilsArray";
import PageSettings            from "@/services/PageSettings";
import ConfigApi               from "@/configs/ConfigApi";
import AlinaPageGlobalAnalyzer from "@/services/AlinaPageGlobalAnalyzer";

export default {
  name:       "App",
  components: {
    MenuHorizontalMain,
    Messages,
    Spinner,
    Footer,
  },
  data() {
    return {
      PageSettings,
      AlinaStorage,
      ConfigApi
    }
  },
  mounted() {
    /**
     * Documentation:
     * https://bootstrap-vue.org/docs/components/collapse
     */
    this.$root.$on('bv::collapse::state', (collapseId, isJustShown) => {
      // if (collapseId.startsWith('comment-collapse-')) {
      //   if (isJustShown) {
      //     UtilsArray.pushIfNotAlready(this.AlinaStorage.Comment.expanded, collapseId)
      //   } else {
      //     UtilsArray.elRemoveByValue(this.AlinaStorage.Comment.expanded, collapseId)
      //   }
      // }
    });
  },
  created() {
    let _this = this;
    document.addEventListener('keyup', function (event) {
      if (event.ctrlKey && event.altKey) {
        if (event.key == 'f') {
          _this.toggleFullScreen();
        }
        //_this.log(event);
      }
    });
  },
  computed: {
    pageIsInIframe() {
      return AlinaPageGlobalAnalyzer.pageIsInIframe();
    },
    fullScreen() {
      if (this.pageIsInIframe) {
        return true;
      }
      if (PageSettings.showMainMenu === false) {
        return true;
      }
      return false;
    },
  },
  watch:    {
    $route(to, from) {
    }
  },
  methods:  {
    toggleFullScreen() {
      PageSettings.showMainMenu = !PageSettings.showMainMenu;
    },
    log() {
    }
  }
};
</script>
<style scoped>

</style>