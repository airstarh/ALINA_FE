<template>
  <div id="alina-body-wrapper"
       :style="{
            'overflow': pageIsInIframe ? 'hidden':'auto'
         }"
       class="bg-dark text-white"
  >
    <MenuHorizontalMain v-if="!fullScreen"></MenuHorizontalMain>
    <router-view></router-view>
    <Messages></Messages>
    <Spinner></Spinner>
    <div v-if="!fullScreen">
      <Footer></Footer>

    </div>
  </div>
</template>
<script>
import MenuHorizontalMain from "@/components/MenuHorizontalMain";
import Footer             from "@/components/Footer";
import Messages           from "@/components/global/Messages";
import Spinner            from "@/components/global/Spinner";
import AlinaStorage       from "@/services/AlinaStorage";
import UtilsArray         from "@/Utils/UtilsArray";
import PageSettings       from "@/services/PageSettings";
import ConfigApi          from "@/configs/ConfigApi";
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
    this.$root.$on('bv::collapse::state', (collapseId, isJustShown) => {
      if (collapseId.startsWith('comment-collapse-')) {
        if (isJustShown) {
          UtilsArray.pushIfNotAlready(this.AlinaStorage.Comment.expanded, collapseId)
        } else {
          UtilsArray.elRemoveByValue(this.AlinaStorage.Comment.expanded, collapseId)
        }
      }
    });
  },
  created() {
    let _this = this;
    document.addEventListener('keyup', function (event) {
      if (
          event.ctrlKey
          &&
          event.altKey
      ) {
        if (event.key == 'f') {
          _this.toggleFullScreen();
        }
        //_this.log(event);
      }
    });
  },
  computed: {
    pageIsInIframe() {
      return this.ConfigApi.pageIsInIframe();
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
      // console.log(">>> ROUTER ____________________________");
      // console.log("from");
      // console.log(from);
      // console.log("to");
      // console.log(to);
      // console.log("<<<  ROUTER  ____________________________");
    }
  },
  methods:  {
    toggleFullScreen() {
      PageSettings.showMainMenu = !PageSettings.showMainMenu;
    },
    log() {
      console.log(">>>>>>>>>>>>>>>>>>>>");
      console.log("log arguments");
      console.log(arguments);
    }
  }
};
</script>

<style lang="scss">

</style>
