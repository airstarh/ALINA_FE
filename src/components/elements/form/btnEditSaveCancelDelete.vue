<template>
  <div
    v-if="CU.ownsOrAdminOrModerator(owner_id) && !pageIsInIframe()"
    class="row no-gutters mb-1 m-buttons-1"
  >
    <!--Delete-->
    <button
      @click="onDelete"
      class="col-3 btn btn-danger"
    >
      {{ $t("TXT_DELETE") }}
    </button>
    <!--Edit-->
    <button
      @click="onEdit"
      class="col btn btn-secondary"
      v-if="!modeEdit"
    >
      {{ $t("TXT_EDIT") }}
    </button>
    <!--Cancel-->
    <button
      @click="onCancel"
      class="col btn btn-secondary"
      v-if="modeEdit"
    >
      {{ $t("TXT_CANCEL") }}
    </button>
    <!--Save-->
    <button
      @click="onSave"
      class="col btn btn-secondary"
      v-if="modeEdit"
    >
      {{ $t("TXT_SUBMIT") }}
    </button>
  </div>
</template>

<script>
import CurrentUser from "@/services/CurrentUser";
import ConfigApi from "@/configs/ConfigApi";
import AlinaPageGlobalAnalyzer from "@/services/AlinaPageGlobalAnalyzer";

export default {
  name: "btnEditSaveCancelDelete",
  emits: ["onSave", "onEdit", "onCancel", "onDelete"],
  props: {
    subject: {
      type: Object,
      default: {},
    },
    owner_id: {
      type: Number,
      default: () => null,
    },
    modeEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      CU: CurrentUser.obj(),
      ConfigApi,
    };
  },
  methods: {
    // ##################################################
    onSave() {
      this.$emit("onSave", this.subject);
    },
    onEdit() {
      this.$emit("onEdit", this.subject);
    },
    onCancel() {
      this.$emit("onCancel", this.subject);
    },
    onDelete() {
      this.$emit("onDelete", this.subject);
    }, // ##################################################
    pageIsInIframe() {
      return AlinaPageGlobalAnalyzer.pageIsInIframe();
    }, // ##################################################
  },
};
</script>

<style scoped lang="scss"></style>
