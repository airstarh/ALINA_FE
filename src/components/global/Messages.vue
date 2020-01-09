<template v-if="flagMessagesShown">

    <b-modal
            id="messages"
            v-model="flagMessagesShown"
            class="messages lalala"
            title="Messages"
            :ok-only="true"
    >
        <div
                v-for="item in MessagesObj.store"
                v-bind:key="'msg_'+item.id"
                v-bind:class="item.status"
        >
            {{ item.text }}
        </div>
    </b-modal>
</template>

<script>
    import MessagesObj from "@/services/MessagesObj";
    import UtilsArray  from "@/Utils/UtilsArray";

    export default {
        name:     "Messages",
        props:    {},
        data() {
            return {
                MessagesObj: MessagesObj,
            }
        },
        methods:  {
            ehDeleteAllMessages() {
                UtilsArray.clear(MessagesObj.store);
            },
        },
        computed: {
            flagMessagesShown: {
                get() {
                    return MessagesObj.store.length > 0;
                },
                set(v) {
                    if (!v) {
                        this.ehDeleteAllMessages();
                    }
                },
            }
        },
        watch:    {},
    };
</script>

<style scoped lang="scss"></style>
