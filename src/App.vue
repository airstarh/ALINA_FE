<template>
    <div id="alina-body-wrapper">
        <MenuHorizontalMain></MenuHorizontalMain>
        <router-view/>
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
    export default {
        name:       "App",
        components: {
            MenuHorizontalMain,
            Messages,
            Spinner,
        },
        data() {
            return {
                AlinaStorage
            }
        },
        mounted() {
            this.$root.$on('bv::collapse::state', (collapseId, isJustShown) => {
                if (isJustShown) {
                    SpinnerObj.isOn = true;
                    UtilsArray.pushIfNotAlready(this.AlinaStorage.Comment.expanded, collapseId)
                } else {
                    UtilsArray.elRemoveByValue(this.AlinaStorage.Comment.expanded, collapseId)
                }
            });
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
