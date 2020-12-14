<template v-if="flagMessagesShown">

    <b-modal
            id="messages"
            v-model="flagMessagesShown"
            class="messages"
            title="Messages"
            :ok-only="true"
            size="lg"
    >
        <div
                v-for="(item, i) in MessagesObj.store"
                :key="i"
                v-bind:class="MessagesObj.statusClasses[item.status]"
        >
            <pre v-html="item.text"></pre>
        </div>
    </b-modal>
</template>

<script>
    import MessagesObj from "@/services/MessagesObj";
    import UtilsArray from "@/Utils/UtilsArray";

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
                MessagesObj.deleteAll();
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

<style scoped lang="scss">
    pre {
        background-color: transparent;
    }
</style>
