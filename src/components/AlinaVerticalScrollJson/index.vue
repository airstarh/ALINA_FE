<template>
  <div class="vertical-file-list">
    <div
      v-for="(row, index) in pJson"
      :key="row.id ?? index"
      class="vertical-file-item">
      <div class="vertical-file-preview">
        <AlinAFile
          :p-file-json="row"
          display-mode="vertical"
          :show-caption="false" />
      </div>

      <div class="vertical-file-details">
        <aInput
          v-model="row.name_human"
          :maxLength="200"
          :modeEdit="modeEdit && isCurrentUserAllowedEdit(row)"
          componentDisplay="block"
          :href="modeEdit && isCurrentUserAllowedEdit(row) ? null : fileUrl(row)"
          target="_blank"
          :download="flagShowDownload(row.fType) ? row.name_human : null"
          :placeholder="$t('File Name')" />

        <template v-if="modeEdit && isCurrentUserAllowedEdit(row)">
          <aInput
            type="number"
            v-model="row.order"
            :modeEdit="true"
            :placeholder="$t('File Order')"
            componentDisplay="block" />

          <div class="d-flex mt-2" style="gap: 5mm;">
            <b-button
              size="sm"
              class="btn btn-a"
              @click="$emit('onChange', row, index)">{{ $t("TXT_SUBMIT") }}</b-button>
            <b-button
              size="sm"
              class="btn btn-a"
              @click="$emit('onDelete', row, index)">{{ $t("Delete") }}</b-button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import CurrentUser from "@/services/CurrentUser";
import UtilsFS from "@/Utils/UtilsFS";
import AlinAFile from "@/components/AlinaHorizontalScrollJson/AlinAFile.vue";
import aInput from "@/components/elements/form/aInput.vue";
import AlinaPageGlobalAnalyzer from "@/services/AlinaPageGlobalAnalyzer";

export default {
  name: "AlinaVerticalScrollJson",
  emits: ["onDelete", "onChange"],
  components: {
    AlinAFile,
    aInput,
  },
  props: {
    pJson: {
      type: Array,
      default: () => [],
    },
    modeEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      CurrentUser: CurrentUser.obj(),
    };
  },
  mounted() {
    AlinaPageGlobalAnalyzer.AlinaAudioPlayer.addAudioEventHandlers();
  },
  updated() {
    AlinaPageGlobalAnalyzer.AlinaAudioPlayer.addAudioEventHandlers();
  },
  methods: {
    isCurrentUserAllowedEdit(file) {
      return this.CurrentUser.owns(file.owner_id)
        || this.CurrentUser.isAdmin()
        || this.CurrentUser.isModerator();
    },
    fileUrl(file) {
      const path = file.url_path;

      if (!path) {
        return "";
      }

      const baseUrl = import.meta.env.VITE_APP_ALINA_DOMAIN || window.location.origin;

      try {
        return new URL(path, baseUrl).href;
      } catch {
        return path;
      }
    },
    flagShowDownload(fType) {
      return ![
        UtilsFS.typeImage,
        UtilsFS.typePdf,
        UtilsFS.typeAudio,
        UtilsFS.typeVideo,
        UtilsFS.typeText,
        UtilsFS.typeWeb,
      ].includes(fType);
    },
  },
};
</script>

<style scoped lang="scss">
.vertical-file-list {
  display: flex;
  flex-direction: column;
  gap: 2mm;
  width: 100%;
}

.vertical-file-item {
  display: flex;
  align-items: center;
  gap: 3mm;
  width: 100%;
  padding: 2mm;
  border: 1px solid #777;
  border-radius: 10px;
}

.vertical-file-preview {
  flex: 0 0 auto;
  min-height: 17mm;
}

.vertical-file-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2mm;
  flex: 1 1 auto;
  min-width: 0;
  overflow-wrap: anywhere;
}

.vertical-file-details :deep(.aInput) {
  flex: 0 0 auto;
  width: 100%;
  max-width: 100%;
}

.vertical-file-details :deep(a),
.vertical-file-details :deep(a:link),
.vertical-file-details :deep(a:visited),
.vertical-file-details :deep(a:hover),
.vertical-file-details :deep(a:active) {
  color: inherit;
  text-decoration: none;
}
</style>
