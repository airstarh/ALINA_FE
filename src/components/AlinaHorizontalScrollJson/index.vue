<template>
  <div>
    <div class="scrolling-wrapper">
      <div
        class="scrolling-item"
        v-for="(row, index) in pJson"
      >
        <div
          v-if="modeManage"
          class="text-left"
        >
          <div v-if="isCurrentUserAllowedEdit(row)">
            <input
              type="text"
              v-model="row.name_human"
              class="form-control form-control-sm"
              :placeholder="$t('File Name')"
            />
            <input
              type="text"
              v-model="row.order"
              class="form-control form-control-sm"
              :placeholder="$t('File Order')"
            />
            <b-btn
              block
              size="sm"
              variant="success"
              @click="$emit('onChange', row, index)"
              >{{ $t("TXT_SUBMIT") }}
            </b-btn>
            <b-btn
              block
              size="sm"
              variant="danger"
              @click="$emit('onDelete', row, index)"
              >{{ $t("Delete") }}</b-btn
            >
          </div>
        </div>

        <AlinAFile :p-file-json="row"></AlinAFile>
      </div>
    </div>
  </div>
</template>

<script>
import CurrentUser from "@/services/CurrentUser";
import AlinAFile from "@/components/AlinaHorizontalScrollJson/AlinAFile.vue";

export default {
  name: "AlinaHorizontalScroll",
  emits: ["onDelete", "onChange"],
  components: {
    AlinAFile,
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
    modeManage: {
      default: false,
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
      // return isOwner;
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
  gap: 10px;
  flex-wrap: nowrap;
  overflow-x: auto;

  & .scrolling-item {
    flex: 1 0 auto;
    border: #777 solid 1px;
    border-radius: 10px;
  }
}
</style>
