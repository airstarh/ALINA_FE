<template v-if="flagMessagesShown">

  <b-modal
      id="alina-messages-wrapper"
      v-model="flagMessagesShown"
      dialog-class="alina-messages-dialog"
      :hide-header="true"
      header-class="alina-messages-header"
      title-class="alina-messages-title"
      content-class="alina-messages-content"
      body-class="alina-messages-body"
      footer-class="alina-messages-footer"
      title="Messages"
      :ok-only="true"
      size="lg"
      header-bg-variant="dark"
      body-bg-variant="dark"
      footer-bg-variant="dark"
  >
    <div
        v-for="(item, i) in MessagesObj.store"
        :key="i"
        v-bind:class="MessagesObj.statusClasses[item.status]"
    >
      <pre v-html="itemText(item)"></pre>
    </div>
  </b-modal>
</template>

<script>
import MessagesObj from "@/services/MessagesObj";

export default {
  name:  "Messages",
  props: {},
  data() {
    return {
      MessagesObj: MessagesObj,
      vsprintf:    require('sprintf-js').vsprintf
    }
  },
  methods:  {
    ehDeleteAllMessages() {
      MessagesObj.deleteAll();
    },
    itemText(item) {
      let res = '';
      try {
        res = vsprintf(this.$t(item.templateString), item.params.map(v => this.$t(v)))
      } catch (e) {
        res = item.templateString;
      }
      return res;
    }
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
