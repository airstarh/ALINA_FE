<template>
    <div id="alina-body-wrapper"
         :style="{
            'overflow': pageIsInIframe ? 'hidden':'scroll'
         }"
    >
        <MenuHorizontalMain v-if="!pageIsInIframe"></MenuHorizontalMain>
        <router-view :key="$route.fullPath"></router-view>
        <Messages></Messages>
        <Spinner></Spinner>
    </div>
</template>
<script>
    import MenuHorizontalMain from "@/components/MenuHorizontalMain";
    import Messages from "@/components/global/Messages";
    import Spinner from "@/components/global/Spinner";
    import AlinaStorage from "@/services/AlinaStorage";
    import UtilsArray from "@/Utils/UtilsArray";
    import SpinnerObj from "@/services/SpinnerObj";
    import ConfigApi from "@/configs/ConfigApi";
    export default {
        name:       "App",
        components: {
            MenuHorizontalMain,
            Messages,
            Spinner,
        },
        data() {
            return {
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
        computed:   {
            pageIsInIframe() {
                return this.ConfigApi.pageIsInIframe();
            }
        },
        watch:      {
            $route(to, from) {
                // console.log(">>> ROUTER ____________________________");
                // console.log("from");
                // console.log(from);
                // console.log("to");
                // console.log(to);
                // console.log("<<<  ROUTER  ____________________________");
            }
        }
    };
</script>

<style lang="scss">

</style>
