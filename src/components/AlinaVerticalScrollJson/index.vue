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

        <div class="file-meta">
          <button
            v-if="isCurrentUserAllowedEdit(row)"
            type="button"
            class="file-delete-button"
            :title="$t('Delete')"
            :aria-label="$t('Delete')"
            @click="$emit('onDelete', row, index)">{{ $t("i_delete") }}</button>
          <small v-if="formattedFileSize(row.size)" class="file-size">
            {{ formattedFileSize(row.size) }}
          </small>
          <button type="button" class="file-copy-button" :title="$t('Copy URL')" :aria-label="$t('Copy URL')" @click="copyFileUrl(row)">
            {{ $t(copiedFileId === row.id ? 'i_ok' : 'i_copy') }}
          </button>
        </div>
        <router-link v-if="row.source_path" :to="row.source_path" class="file-source-link">
          {{ sourceLabel(row) }}
        </router-link>
        <span v-else-if="row.source_type" class="file-source-link">{{ sourceLabel(row) }}</span>

        <template v-if="modeEdit && isCurrentUserAllowedEdit(row)">
          <div class="file-order-controls">
            <aInput
              type="number"
              v-model="row.order"
              :modeEdit="true"
              :disabled="true"
              inputWidth="8ch"
              :placeholder="$t('File Order')"
              componentDisplay="block" />
            <b-button
              v-if="smartOrdering"
              size="sm"
              class="btn btn-a"
              :disabled="index === 0"
              @click="$emit('onMove', index, -1)">{{ $t("i_up") }}</b-button>
            <b-button
              v-if="smartOrdering"
              size="sm"
              class="btn btn-a"
              :disabled="index === pJson.length - 1"
              @click="$emit('onMove', index, 1)">{{ $t("i_down") }}</b-button>
            <b-button
              v-if="smartOrdering"
              size="sm"
              class="btn btn-a"
              :disabled="index === 0"
              @click="$emit('onMoveTo', index, 0)">{{ $t("i_first") }}</b-button>
            <b-button
              v-if="smartOrdering"
              size="sm"
              class="btn btn-a"
              :disabled="index === pJson.length - 1"
              @click="$emit('onMoveTo', index, pJson.length - 1)">{{ $t("i_last") }}</b-button>
          </div>

          <!-- Individual save is intentionally disabled: files are saved by the top bulk-save button.
          <div class="d-flex mt-2" style="gap: 5mm;">
            <b-button
              size="sm"
              class="btn btn-a"
              @click="$emit('onChange', row, index)">{{ $t("TXT_SUBMIT") }}</b-button>
          </div>
          -->
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
  emits: ["onDelete", "onChange", "onMove", "onMoveTo"],
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
    smartOrdering: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      CurrentUser: CurrentUser.obj(),
      copiedFileId: null,
      copyTimer: null,
    };
  },
  mounted() {
    AlinaPageGlobalAnalyzer.AlinaAudioPlayer.addAudioEventHandlers();
  },
  updated() {
    AlinaPageGlobalAnalyzer.AlinaAudioPlayer.addAudioEventHandlers();
  },
  beforeUnmount() {
    clearTimeout(this.copyTimer);
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
    formattedFileSize(size) {
      return UtilsFS.formatFileSize(size);
    },
    sourceLabel(file) {
      const labels = {tale: 'Tale', comment: 'Comment', user: 'Profile'};
      const label = this.$t(labels[file.source_type] || file.source_type);
      return `${label} #${file.entity_id}`;
    },
    async copyFileUrl(file) {
      try {
        await navigator.clipboard.writeText(this.fileUrl(file));
        this.copiedFileId = file.id;
        clearTimeout(this.copyTimer);
        this.copyTimer = setTimeout(() => {
          this.copiedFileId = null;
        }, 3000);
      } catch {
        this.copiedFileId = null;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.vertical-file-list {
  display: flex;
  flex-direction: column;
  gap: 13mm;
  width: 99%;
  margin: 0 auto;
}

.vertical-file-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 3mm;
  width: 100%;
  padding: 8mm 1mm 8mm 1mm;
  border-radius: 30px;
  background-color: #111;
}

.vertical-file-preview {
  flex: 0 0 auto;
}

.vertical-file-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2mm;
  flex: 1 1 50mm;
  min-width: min(90vw, 50mm);
  overflow-wrap: anywhere;
}

.vertical-file-details :deep(.aInput) {
  flex: 0 0 auto;
  width: 100%;
  max-width: 100%;
}

.vertical-file-details :deep(.aInput.aInput-edit:not(.aInput-fixed-width)) {
  flex: 0 0 auto;
}

.file-meta { display: flex; align-items: center; gap: .4rem; }
.file-delete-button { width: 2rem; height: 2rem; min-width: 2rem; padding: 0; border: 1px solid #777; border-radius: .25rem; color: inherit; background: transparent; }
.file-delete-button:hover { background: #444; }
.file-copy-button { min-width: 2rem; padding: 0 .35rem; border: 1px solid #777; border-radius: .25rem; color: inherit; background: transparent; }
.file-copy-button:hover { background: #444; }
.file-source-link { color: #8fc7ff !important; font-size: .85rem; }

.file-order-controls {
  display: flex;
  align-items: center;
  gap: 3mm;
}

.file-order-controls :deep(.aInput) {
  width: auto;
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
