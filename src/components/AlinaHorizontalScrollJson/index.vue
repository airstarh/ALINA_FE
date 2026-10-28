<template>
  <div>
    <div class="scrolling-wrapper">
      <div
        class="scrolling-item"
        v-for="(row, index) in pJson">
        <div
          v-if="modeEdit"
          class="text-start">
          <div
            v-if="isCurrentUserAllowedEdit(row)"
            class="mt-2">
            <aInput
              :maxLength="200"
              v-model="row.name_human"
              :modeEdit="modeEdit"
              componentDisplay="block"
              :placeholder="$t('File Name')" />
            <div class="file-order-controls">
              <aInput
                type="number"
                v-model="row.order"
                :modeEdit="modeEdit"
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
            </div>
            <!-- Individual save is intentionally disabled: files are saved by the top bulk-save button.
            <div class="d-flex mt-3 mb-3" style="gap:5mm;">
              <b-button
                size="sm"
                class="btn btn-a"
                @click="$emit('onChange', row, index)">{{ $t("TXT_SUBMIT") }}
              </b-button>
            </div>
            -->
          </div>
        </div>

        <AlinAFile :p-file-json="row" />

        <b-button
          v-if="isCurrentUserAllowedEdit(row)"
          size="sm"
          class="btn btn-a mt-2 mb-2"
          @click="$emit('onDelete', row, index)">{{ $t("Delete") }}</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import CurrentUser from "@/services/CurrentUser";
import AlinAFile from "@/components/AlinaHorizontalScrollJson/AlinAFile.vue";
import aInput from "@/components/elements/form/aInput.vue";
import AlinaPageGlobalAnalyzer from "@/services/AlinaPageGlobalAnalyzer";

export default {
  name: "AlinaHorizontalScroll",
  emits: ["onDelete", "onChange", "onMove"],
  components: {
    AlinAFile,
    aInput,
  },
  props: {
    pJson: {
      default: [],
    },
    showOnly: {
      default() {
        return [];
      },
    },
    modeEdit: {
      default: false,
    },
    smartOrdering: {
      type: Boolean,
      default: true,
    },
    modeHideHeaders: {
      default: true,
    },
  },
  data() {
    return {
      dJson: [],
      arrHeaders: [],
      arrData: [],
      CurrentUser: CurrentUser.obj(),
    };
  },
  created() {
    this.defineHeaders();
  },
  beforeUpdate() {
    this.defineHeaders();
  },
  updated() {
    AlinaPageGlobalAnalyzer.AlinaAudioPlayer.addAudioEventHandlers();
  },
  methods: {
    defineHeaders() {
      if (this.showOnly.length > 0) {
        this.arrHeaders = this.showOnly;
      } else {
        this.arrHeaders = Object.keys(
          Array.isArray(this.pJson) && this.pJson.length > 0
            ? this.pJson[this.pJson.length - 1]
            : []
        );
      }
    },
    isCurrentUserAllowedEdit(obj) {
      const isOwner = CurrentUser.obj().owns(obj.owner_id);
      return (
        isOwner || this.CurrentUser.isAdmin() || this.CurrentUser.isModerator()
      );
    },
    isHeaderAsHtml(header) {
      const arrHtmlHeaders = ["url", "img", "icon", "link"];
      return arrHtmlHeaders.includes(header);
    },
  },
};
</script>

<style scoped lang="scss">
.scrolling-wrapper {
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  align-content: stretch;
  gap: 10px;
  flex-wrap: nowrap;
  overflow-x: auto;

  & .scrolling-item {
    min-width: min(90vw, 10cm);
    flex: 0 0 min(90vw, 10cm);
    border: #777 solid 1px;
    border-radius: 10px;
  }
}

.file-order-controls {
  display: flex;
  align-items: center;
  gap: 3mm;
}
</style>
