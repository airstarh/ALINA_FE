<template v-if="MessagesObj.store.length > 0">
    <div class="messages">
        <div>X</div>
        <div
                v-for="item in MessagesObj.store"
                v-bind:key="item.id"
                v-bind:class="item.status"
        >
            {{ item.text }}
        </div>
    </div>
</template>

<script>
    import MessagesObj from "@/services/MessagesObj";

    export default {
        name:  "Messages",
        props: {},
        data() {
            return {
                MessagesObj: MessagesObj
            }
        },
    };
</script>

<style scoped lang="scss"></style>
