<template>
  <div class="table-responsive">

    <div class="scrolling-wrapper">
      <div
          class="scrolling-item"
          v-for="(row, index) in pJson"
      >
        <AlinAFile
            :p-file-json="row"
        ></AlinAFile>

        <div v-if="modeManage">
          <div v-if="isCurrentUserAllowedEdit(row)">
            <b-btn variant="danger" @click="$emit('onDelete', row, index)">{{ $t('Delete') }}</b-btn>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import CurrentUser from "@/services/CurrentUser";
import AlinAFile   from "@/components/AlinaHorizontalScrollJson/AlinAFile.vue";

export default {
  name:       "AlinaHorizontalScroll",
  emits:      ['onDelete'],
  components: {
    AlinAFile
  },
  props:      {
    pJson:           {
      default: []
    },
    showOnly:        {
      default() {return []}
    },
    modeManage:      {
      default: false
    },
    modeHideHeaders: {
      default: true
    }
  },
  data() {
    return {
      dJson:       [],
      arrHeaders:  [],
      arrData:     [],
      CurrentUser: CurrentUser.obj(),
    }
  },
  created() {
    this.defineHeaders();
  },
  beforeUpdate() {
    this.defineHeaders();
  },
  methods: {
    defineHeaders() {
      if (this.showOnly.length > 0) {
        this.arrHeaders = this.showOnly;
      } else {
        this.arrHeaders = Object.keys(Array.isArray(this.pJson) && this.pJson.length > 0 ? this.pJson[this.pJson.length - 1] : []);
      }

      console.log(">>>>>>>>>>>>>>>>>>>>");
      console.log("this.pJson");
      console.log(this.pJson);
    },
    isCurrentUserAllowedEdit(obj) {
      //ToDo: Extend
      const isOwner = CurrentUser.obj().owns(obj.owner_id);
      return isOwner;
      //return isOwner || this.CurrentUser.isAdmin() || this.CurrentUser.isModerator();
    },
    isHeaderAsHtml(header) {
      const arrHtmlHeaders = [
        'url',
        'img',
        'icon',
        'link',
      ];
      return arrHtmlHeaders.includes(header);
    }
  }
};
</script>

<style scoped lang="scss">
.scrolling-wrapper {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;

}

.scrolling-item {
  text-align: center;
  flex: 0 0 auto;
  width: 30vmin;
  height: 50vmin;
  padding: 1vw;
  margin: 5px 1px;
  border: #777 solid 1px;
  border-radius: 10px;
  word-wrap: break-word !important;
  overflow-wrap: anywhere !important;
  overflow: hidden;
}

</style>
