<template>
    <div id="alina-body-wrapper">
        <MenuHorizontalMain></MenuHorizontalMain>
        <div id="app">
            <router-view/>
        </div>
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
                console.log(`Router. ${from} -> ${to}`);
            }
        }
    };
</script>

<style lang="scss">

</style>
