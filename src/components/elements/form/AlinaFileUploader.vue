<template>
  <div class="p-1 mt-3 mb-3" v-if="modeEdit || dArrFiles.length > 0 || ownLength > 0">
    <div>
      <b-button v-b-toggle="[`f-${entity_id}`]" variant="primary">{{ $t('Attached Documents') }} <span v-if="ownLength>0">{{ownLength}}</span></b-button>
      <b-collapse :id="`f-${entity_id}`" class="mt-3" @show="onShow">
        <ui-fileupload
            v-if="modeEdit"
            accept="*/*"
            :multiple="true"
            :name="ConfigApi.ALINA_FILE_UPLOAD_KEY"
            @change="onChangeFileField"
        >{{ $t("Select your files") }}
        </ui-fileupload>

        <AlinaTableJson
            :pJson="dArrFiles"
            :showOnly="['url']"
            :modeManage="modeEdit"
            @onDelete="onDelete"
        ></AlinaTableJson>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import AlinaTableJson from "@/components/AlinaTableJson";
import ConfigApi      from "@/configs/ConfigApi";
import AjaxAlina      from "@/services/AjaxAlina";
import UtilsArray     from "@/Utils/UtilsArray";
import CurrentUser    from "@/services/CurrentUser";
import UtilsData      from "@/Utils/UtilsData";

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
      default() {return [];}
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
        urlFileUpload: `${ConfigApi.url_base}/FileUpload`,
        urlFileDelete: `${ConfigApi.url_base}/FileUpload/delete`,
        urlGetFiles:   `${ConfigApi.url_base}/FileUpload/getFiles`,
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
  methods:    {
    loopFiles() {
      for (let [i, model] of Object.entries(this.dArrFiles)) {
        if (model.hasOwnProperty('url_path')) {
          const strDw = this.$t('Download');
          model.url   = `<a href="${model.url_path}" target="_blank" class="btn btn-sm btn-block text-left btn-dark">${model.name_human}</a>`;
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
      console.log(">>>>>>>>>>>>>>>>>>>>");
      console.log("xxx");
      console.log(index);
      console.log(obj);
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
    onShow(){
      this.loadFileList();
    },
  },
  components: {
    AlinaTableJson
  },
};
</script>

<style scoped lang="scss"></style>
