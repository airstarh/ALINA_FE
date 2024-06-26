<template>
  <div class="p-1 mt-3 mb-3" v-if="modeEdit || dArrFiles.length > 0 || ownLength > 0">
    <div>
      <b-button
          v-b-toggle="[`f-${entity_id}`]"
          variant="secondary"
      >
          <span
              style="font-size: 2em;vertical-align: middle;"
          >
            <b-icon
                icon="file-earmark-richtext"
            ></b-icon>
          </span>
        <span>{{ $t('Attached files') }}</span>
        <span
            v-if="ownLength>0"
            style="font-size: 2em;vertical-align: middle;"
        >&nbsp;{{ ownLength }}</span>
      </b-button>
      <b-collapse
          :id="`f-${entity_id}`" class="mt-3"
          @show="onShow"
          @hide="onHide"
      >
        <div class="row no-gutters">
          <div class="col">
            <ui-fileupload
                v-if="modeEdit"
                accept="*/*"
                :multiple="true"
                :name="ConfigApi.ALINA_FILE_UPLOAD_KEY"
                @change="onChangeFileField"
            >{{ $t("Select your files") }}
            </ui-fileupload>
          </div>
          <div
              v-if="modeEdit && dArrFiles.length > 0"
              class="col"
          >
            <b-btn block size="md" variant="success" @click="onChangeBulk(dArrFiles)">{{ $t('Bulk File Save') }}</b-btn>
          </div>
        </div>
        <AlinaHorizontalScrollJson
            :pJson="dArrFiles"
            :showOnly="['url']"
            :modeManage="modeEdit"
            @onDelete="onDelete"
            @onChange="onChange"
        ></AlinaHorizontalScrollJson>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import AlinaHorizontalScrollJson from "@/components/AlinaHorizontalScrollJson";
import ConfigApi                 from "@/configs/ConfigApi";
import AjaxAlina                 from "@/services/AjaxAlina";
import UtilsArray                from "@/Utils/UtilsArray";
import CurrentUser               from "@/services/CurrentUser";
import UtilsData                 from "@/Utils/UtilsData";
import AlinaPageGlobalAnalyzer   from "@/services/AlinaPageGlobalAnalyzer";
import UtilsFS                   from "@/Utils/UtilsFS";

export default {
  name:  "AlinaFileUploader",
  props: {
    entity_id:    {
      default: CurrentUser.obj().attributes.id
    },
    entity_table: {
      default: 'user'
    },
    container:    'FILE',
    root_id:      null,
    parent_id:    null,
    level:        1,
    order:        0,
    pArrFiles:    {
      default() {
        return [];
      }
    },
    modeEdit:     {
      default: true
    },
    ownLength:    {
      default: 0
    }
  },
  data() {
    return {
      CurrentUser: CurrentUser.obj(),
      options:     {
        urlFileUpload:     `${ConfigApi.url_base}/FileUpload`,
        urlFileDelete:     `${ConfigApi.url_base}/FileUpload/delete`,
        urlFileUpdate:     `${ConfigApi.url_base}/AdminDbManager/EditRow`,
        urlFileUpdateBulk: `${ConfigApi.url_base}/AdminDbManager/UpdateBulk`,
        urlGetFiles:       `${ConfigApi.url_base}/FileUpload/getFiles`,
      },
      ConfigApi,
      dArrFiles:   [],
    }
  },
  created() {
    this.mergePropsAndData();
    //this.loadFileList();
    this.loopFiles();
  },
  updated() {
    this.pageRecalcIframeHeight();
  },
  methods:    {

    loopFiles() {
      for (let [i, model] of Object.entries(this.dArrFiles)) {
        if (model.hasOwnProperty('name_fs')) {
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
      AjaxAlina.newInst({
        method: 'GET',
        url:    `${this.options.urlGetFiles}/${this.entity_table}/${this.entity_id}`,
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            UtilsArray.clear(this.dArrFiles);
            UtilsArray.vueSensitiveConcat(this.dArrFiles, aja.respBody.data);
            this.loopFiles();
          }
        }
      })
          .go();
    },
    onChangeFileField(fileList, event) {
      AjaxAlina.newInst({
        method:     'POST',
        url:        this.options.urlFileUpload,
        enctype:    'multipart/form-data',
        postParams: {
          entity_id:    this.entity_id,
          entity_table: this.entity_table,
          container:    'FILE',
          root_id:      null,
          parent_id:    null,
          level:        1,
          order:        0,
          "form_id":    "actionIndex",
          "userfile":   fileList,
        },
        onDone:     (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            //this.dArrFiles = aja.respBody.data;
            UtilsArray.vueSensitiveConcat(this.dArrFiles, aja.respBody.data);
            this.loopFiles();
          }
        }
      })
          .go();
    },
    onDelete(obj, index) {
      // console.log(">>>>>>>>>>>>>>>>>>>>");
      // console.log("xxx");
      // console.log(index);
      // console.log(obj);
      if (!confirm("Are you sure?")) {return;}
      const _t    = this;
      obj.form_id = 'actionDelete';
      AjaxAlina.newInst({
        method:     'DELETE',
        url:        `${this.options.urlFileDelete}/${obj.id}`,
        postParams: obj,
        onDone:     (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            UtilsArray.elRemoveByIndex(_t.dArrFiles, index);
          }
        }
      })
          .go();
    },
    onChange(obj, index) {
      // console.log(">>>>>>>>>>>>>>>>>>>>");
      // console.log("onChange");
      // console.log(index);
      // console.log(obj);
      //return null;
      //if (!confirm("Are you sure?")) {return;}
      const _t    = this;
      obj.form_id = 'actionEditRow';
      AjaxAlina.newInst({
        method:     'POST',
        url:        `${this.options.urlFileUpdate}/file/${obj.id}`,
        postParams: obj,
        onDone:     (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            _t.loadFileList();
          }
        }
      })
          .go();
    },
    onChangeBulk(dArrFiles) {
      const _t    = this;
      const obj   = {};
      obj.form_id = 'actionUpdateBulk';
      obj.list    = dArrFiles;
      AjaxAlina.newInst({
        method:     'POST',
        url:        `${this.options.urlFileUpdateBulk}/file`,
        postParams: obj,
        onDone:     (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            _t.loadFileList();
          }
        }
      })
          .go();
    },
    onShow() {
      this.loadFileList();
    },
    onHide() {
      UtilsArray.clear(this.dArrFiles);
    },
    pageRecalcIframeHeight() {
      const className = `AlinaIframe-tale-${this.entity_id}`;
      AlinaPageGlobalAnalyzer.pageRecalcIframeHeight(className);
    },
  },
  components: {
    AlinaHorizontalScrollJson
  },
};
</script>

<style scoped lang="scss"></style>
