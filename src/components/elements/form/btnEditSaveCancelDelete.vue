<template>
  <div v-if="CU.ownsOrAdminOrModerator(owner_id) && !pageIsInIframe()" class="row no-gutters mb-1 m-buttons-1">
    <!--Delete-->
    <button @click="onDelete" class="col btn btn-danger">{{ $t("TXT_DELETE") }}</button>
    <!--Edit-->
    <button @click="onEdit" class="col btn btn-info" v-if="!modeEdit">{{ $t("TXT_EDIT") }}</button>
    <!--Cancel-->
    <button @click="onCancel" class="col btn btn-info" v-if="modeEdit">{{ $t("TXT_CANCEL") }}</button>
    <!--Save-->
    <button @click="onSave" class="col btn btn-primary" v-if="modeEdit">{{ $t("TXT_SUBMIT") }}</button>
  </div>
</template>

<script>
import CurrentUser from "@/services/CurrentUser";
import ConfigApi   from "@/configs/ConfigApi";

export default {
  name:  "btnEditSaveCancelDelete",
  props: {
    subject:  {
      type:    Object,
      default: {}
    },
    owner_id: {
      type:    Number,
      default: null
    },
    modeEdit: {
      type:    Boolean,
      default: false
    }
  },
  data() {
    return {
      CU: CurrentUser.obj(),
      ConfigApi
    }
  },
  methods: {
    // ##################################################
    onSave() {
      this.$emit('onSave', this.subject)
    },
    onEdit() {
      this.$emit('onEdit', this.subject)
    },
    onCancel() {
      this.$emit('onCancel', this.subject)
    },
    onDelete() {
      this.$emit('onDelete', this.subject)
    },
    // ##################################################
    pageIsInIframe() {
      return this.ConfigApi.pageIsInIframe();
    },
    // ##################################################
  }
};
</script>

<style scoped lang="scss"></style>
