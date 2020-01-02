<template v-if="MessagesObj.store.length > 0">
    <div
            class="messages lalala"
            @click="deleteAllMessages"
    >
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
    import UtilsArray  from "@/Utils/UtilsArray";

    export default {
        name:    "Messages",
        props:   {},
        data() {
            return {
                MessagesObj: MessagesObj
            }
        },
        methods: {
            deleteAllMessages() {
                UtilsArray.clear(MessagesObj.store);
            }
        }
    };
</script>

<style scoped lang="scss"></style>
