<template>
  <div
    class="mt-3 mb-3"
    v-if="modeEdit || dArrFiles.length > 0 || ownLength > 0">

    <div>
      <div class="d-flex" style="gap:2mm;">
        <b-button
          v-b-toggle="[`f-${entity_id}`]"
          class="btn-a">
          <span style="font-size: 2em; vertical-align: middle">
            <i class="bi bi-file-earmark-richtext"></i>
          </span>
          <span>{{ $t("Attached files") }}</span>
          <span
            v-if="ownLength > 0"
            style="font-size: 2em; vertical-align: middle">&nbsp;{{ ownLength }}</span>
        </b-button>

        <button
          v-if="ownLength && CurrentUser.ownsOrAdminOrModerator(owner_id) && dArrFiles.length > 0"
          class="btn btn-a"
          @click="dModeEdit = !dModeEdit">
          {{ dModeEdit ? $t("i_undo") : $t("i_edit") }}
        </button>

        <b-button
          v-if="dModeEdit && dArrFiles.length > 0"
          size="md"
          class="btn btn-a"
          @click="onChangeBulk(dArrFiles)">{{ $t("i_ok") }}</b-button>

        <button
          type="button"
          v-if="ownLength && dArrFiles.length > 0"
          class="btn btn-a"
          :title="viewMode === 'horizontal' ? 'Vertical view' : 'Horizontal view'"
          :aria-label="viewMode === 'horizontal' ? 'Vertical view' : 'Horizontal view'"
          @click="toggleViewMode">
          <i :class="viewMode === 'horizontal' ? 'bi bi-list-ul' : 'bi bi-layout-three-columns'"></i>
        </button>


      </div>

      <b-collapse
        :id="`f-${entity_id}`"
        :model-value="dExpanded"
        @update:model-value="onExpandedChanged"
        class="mt-3"
        @show="onShow"
        @hide="onHide">

        <div class="d-flex justify-content-center">
          <aInput
            v-if="!loadByOwner"
            type="file"
            :modeEdit="dModeEdit"
            accept="*/*"
            :multiple="true"
            :idNameKey="ConfigApi.ALINA_FILE_UPLOAD_KEY"
            :label="$t('Upload')"
            @change="onChangeFileField" />
        </div>
        <AlinaHorizontalScrollJson
          v-if="viewMode === 'horizontal'"
          :pJson="dArrFiles"
          :showOnly="['url']"
          :modeEdit="dModeEdit"
          @onDelete="onDelete"
          @onChange="onChange"></AlinaHorizontalScrollJson>
        <AlinaVerticalScrollJson
          v-else
          :pJson="dArrFiles"
          :modeEdit="dModeEdit"
          @onDelete="onDelete"
          @onChange="onChange"></AlinaVerticalScrollJson>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import AlinaHorizontalScrollJson from "@/components/AlinaHorizontalScrollJson/index.vue";
import AlinaVerticalScrollJson from "@/components/AlinaVerticalScrollJson/index.vue";
import ConfigApi from "@/configs/ConfigApi";
import AjaxAlina from "@/services/AjaxAlina";
import UtilsArray from "@/Utils/UtilsArray";
import CurrentUser from "@/services/CurrentUser";
import UtilsData from "@/Utils/UtilsData";
import AlinaPageGlobalAnalyzer from "@/services/AlinaPageGlobalAnalyzer";
import UtilsFS from "@/Utils/UtilsFS";
import aInput from "@/components/elements/form/aInput";

export default {
  name: "AlinaFileUploader",
  emits: ["update:expanded"],
  props: {
    entity_id: {
      type: Number,
      default: CurrentUser.obj().attributes.id,
    },
    entity_table: {
      type: String,
      default: "user",
    },
    owner_id: {
      type: Number,
      default: null,
    },
    container: {
      type: String,
      default: "FILE",
    },
    root_id: {
      type: Number,
      default: null,
    },
    parent_id: {
      type: Number,
      default: null,
    },
    level: {
      type: Number,
      default: 1,
    },
    order: {
      default: 0,
    },
    pArrFiles: {
      type: Array,
      default() {
        return [];
      },
    },
    modeEdit: {
      type: Boolean,
      default: true,
    },
    ownLength: {
      type: Number,
      default: 0,
    },
    expanded: {
      type: Boolean,
      default: false,
    },
    loadByOwner: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      CurrentUser: CurrentUser.obj(),
      dConf: {
        urlFileUpload: `${ConfigApi.url_base}/FileUpload`,
        urlFileDelete: `${ConfigApi.url_base}/FileUpload/delete`,
        urlFileUpdate: `${ConfigApi.url_base}/AdminDbManager/EditRow`,
        urlFileUpdateBulk: `${ConfigApi.url_base}/AdminDbManager/UpdateBulk`,
        urlGetFiles: `${ConfigApi.url_base}/FileUpload/getFiles`,
        urlGetFilesByOwner: `${ConfigApi.url_base}/FileUpload/getFilesByOwner`,
      },
      ConfigApi,
      dArrFiles: [],
      dModeEdit: this.modeEdit,
      dExpanded: this.expanded,
      viewMode: "vertical",
    };
  },
  created() {
    this.mergePropsAndData();
    this.loopFiles();
  },
  updated() {
    this.pageRecalcIframeHeight();
  },
  methods: {
    onExpandedChanged(expanded) {
      this.dExpanded = expanded;
      this.$emit("update:expanded", expanded);
    },
    toggleViewMode() {
      this.viewMode = this.viewMode === "horizontal" ? "vertical" : "horizontal";
      this.$nextTick(this.pageRecalcIframeHeight);
    },
    loopFiles() {
      for (let [i, model] of Object.entries(this.dArrFiles)) {
        if (model.hasOwnProperty("name_fs")) {
          model.fType = UtilsFS.getType(model.name_fs);
        }
      }
    },
    mergePropsAndData() {
      if (!UtilsData.empty(this.pArrFiles)) {
        UtilsArray.vueSensitiveConcat(this.dArrFiles, this.pArrFiles);
      }
    },
    loadFileList() {
      const _t = this;
      AjaxAlina.newInst({
        method: "GET",
        url: _t.loadByOwner
          ? `${_t.dConf.urlGetFilesByOwner}/${_t.owner_id}`
          : `${_t.dConf.urlGetFiles}/${_t.entity_table}/${_t.entity_id}`,
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            UtilsArray.clear(_t.dArrFiles);
            UtilsArray.vueSensitiveConcat(_t.dArrFiles, aja.respBody.data);
            _t.loopFiles();
            _t.pageRecalcIframeHeight();
          }
        },
      }).go();
    },
    onChangeFileField(fileList) {
      const _t = this;
      AjaxAlina.newInst({
        method: "POST",
        url: _t.dConf.urlFileUpload,
        enctype: "multipart/form-data",
        postParams: {
          entity_id: _t.entity_id,
          entity_table: _t.entity_table,
          container: "FILE",
          root_id: null,
          parent_id: null,
          level: 1,
          order: 0,
          form_id: "actionIndex",
          userfile: fileList,
        },
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            //_t.dArrFiles = aja.respBody.data;
            UtilsArray.vueSensitivePrepend(_t.dArrFiles, aja.respBody.data);
            _t.loopFiles();
          }
          _t.pageRecalcIframeHeight();
        },
      }).go();
    },
    onDelete(obj, index) {
      // console.log(">>>>>>>>>>>>>>>>>>>>");
      // console.log("xxx");
      // console.log(index);
      // console.log(obj);
      if (!confirm("Are you sure?")) {
        return;
      }
      const _t = this;
      obj.form_id = "actionDelete";
      AjaxAlina.newInst({
        method: "DELETE",
        url: `${this.dConf.urlFileDelete}/${obj.id}`,
        postParams: obj,
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            UtilsArray.elRemoveByIndex(_t.dArrFiles, index);
          }
          _t.pageRecalcIframeHeight();
        },
      }).go();
    },
    onChange(obj, index) {
      // console.log(">>>>>>>>>>>>>>>>>>>>");
      // console.log("onChange");
      // console.log(index);
      // console.log(obj);
      //return null;
      //if (!confirm("Are you sure?")) {return;}
      const _t = this;
      obj.form_id = "actionEditRow";
      AjaxAlina.newInst({
        method: "POST",
        url: `${this.dConf.urlFileUpdate}/file/${obj.id}`,
        postParams: obj,
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            _t.loadFileList();
          }
          _t.pageRecalcIframeHeight();
        },
      }).go();
    },
    onChangeBulk(dArrFiles) {
      const _t = this;
      const obj = {};
      obj.form_id = "actionUpdateBulk";
      obj.list = dArrFiles;
      AjaxAlina.newInst({
        method: "POST",
        url: `${this.dConf.urlFileUpdateBulk}/file`,
        postParams: obj,
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            _t.loadFileList();
            _t.dModeEdit = false;
          }
          _t.pageRecalcIframeHeight();
        },
      }).go();
    },
    onShow() {
      this.loadFileList();
    },
    onHide() {
      UtilsArray.clear(this.dArrFiles);
    },
    pageRecalcIframeHeight() {
      const iframeClassName = `AlinaIframe-tale-${this.entity_id}`;
      const heightRefClassName = `alina-tale-id-${this.entity_id}`;
      AlinaPageGlobalAnalyzer.pageRecalcIframeHeight(
        iframeClassName,
        heightRefClassName
      );
    },
  },

  watch: {
    expanded(newValue) {
      this.dExpanded = newValue;
    },
    modeEdit(newValue) {
      return (this.dModeEdit = newValue);
    },
  },

  components: {
    aInput,
    AlinaHorizontalScrollJson,
    AlinaVerticalScrollJson,
  },
};
</script>

<style scoped lang="scss"></style>
