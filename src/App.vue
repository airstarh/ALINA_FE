<template>
    <div id="alina-body-wrapper">
        <MenuHorizontalMain></MenuHorizontalMain>
        <router-view/>
        <Messages></Messages>
    </div>
</template>
<script>
    import MenuHorizontalMain from "./components/MenuHorizontalMain";
    import Messages from "@/components/global/Messages";

    export default {
        name:       "App",
        components: {
            MenuHorizontalMain,
            Messages
        },
        watch:      {
            $route(to, from) {
                console.log(">>> ROUTER ____________________________");
                console.log("from");
                console.log(from);
                console.log("to");
                console.log(to);
                console.log("<<<  ROUTER  ____________________________");
            }
        }
    };
</script>

<style lang="scss">

</style>
