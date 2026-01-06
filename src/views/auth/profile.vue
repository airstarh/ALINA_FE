<template>
  <div>
    <div class="row no-gutters mt-2 mb-2">
      <div class="col">
        <h5 class="text-break">
          Profile #{{ post.id }}
        </h5>
      </div>
      <div class="col-auto text-right">
        <button v-if="options.modeEdit && CU.ownsOrAdminOrModerator(post.id)" @click="ajaDeleteUser(post)" class="btn btn-danger">{{ $t("TXT_DELETE_PROFILE") }}</button>
        <button v-if="CU.ownsOrAdminOrModerator(post.id) && !options.modeEdit" @click="options.modeEdit = !options.modeEdit" class="btn btn-secondary">{{ options.modeEdit ? $t("TXT_CANCEL") : $t("TXT_EDIT") }}</button>
        <StandardButtons v-if="CU.ownsOrAdminOrModerator(post.id) && options.modeEdit" :onGo="runAJax"></StandardButtons>
      </div>
    </div>

    <div :key="curId">
      <div class="text-center">

        <h1 class="notranslate font-weight-bold mb-4">
          &ensp;
          <aInput v-model="post.firstname" :modeEdit="options.modeEdit" :placeholder="$t('First name')" inputAlign="center" />
          &ensp;
          <aInput v-model="post.lastname" :modeEdit="options.modeEdit" :placeholder="$t('Last name')" inputAlign="center" />
        </h1>

        <div class="mb-4">
          <AlinaDatePicker v-model="post.birth" label="Birth" idq="birth" class="notranslate" format="dateTime" :modeEdit="options.modeEdit"></AlinaDatePicker>
        </div>

        <div class="mb-4">
          <aInput v-model="post.mail" type="email" />
        </div>

      </div>

      <div class="text-break">
        <div class="row no-gutters justify-content-center">
          <div class="col-md-4">
            <a :href="post.emblem">
              <aInput
                v-if="options.modeEdit"
                type="file"
                :modeEdit="options.modeEdit"
                :label="$t('Select an image')"
                accept="image/*"
                :multiple="false"
                :name="ConfigApi.ALINA_FILE_UPLOAD_KEY"
                @change="onChangeFileField" />
              <img v-if="post.emblem" :src="post.emblem" width="100%" class="rounded">
              <img v-if="!post.emblem" src="@/assets/anarki.png" width="100%">
            </a>
          </div>

          <div v-if="post.about_myself" class="col pl-2">
            <BorgEditor :modeEdit="options.modeEdit" v-model="post.about_myself" />
          </div>
        </div>

      </div>

    </div>

    <StandardButtons v-if="options.modeEdit" :onGo="runAJax" class="mt-5"></StandardButtons>

    <div class="mt-5">&nbsp;</div>
    <tale_feed :doShowAuthorInfo="false" :queryProps="{ 'owner': this.curId }" v-if="this.curId"></tale_feed>

  </div>
</template>

<script>
// @ is an alias to /src
import StandardButtons from "@/components/elements/form/StandardButtons";
import aInput from "@/components/elements/form/aInput";
import ConfigApi from "@/configs/ConfigApi";
import AjaxAlina from "@/services/AjaxAlina";
import CurrentUser from "@/services/CurrentUser";
import AlinaDatePicker from "@/components/elements/form/AlinaDatePicker";
import tale_feed from "@/views/tale/feed";
import UtilsObject from "@/Utils/UtilsObject";
import UtilsStr from "@/Utils/UtilsStr";
import UtilsDate from "../../Utils/UtilsDate";
import BorgEditor from "@/components/BorgEditor";
//#####
export default {
  name: "auth_profile",
  data() {
    return {
      UtilsStr,
      ConfigApi: ConfigApi,
      CU: CurrentUser.obj(),
      options: {
        url: `${ConfigApi.url_base}/auth/profile`,
        urlEmblem: `${ConfigApi.url_base}/FileUpload/CkEditor`,
        urlDelete: `${ConfigApi.url_base}/auth/UserDelete`,
        dateFields: ['birth'],
        modeEdit: false,
      },
      post: {
        id: '',
        mail: '',
        firstname: '',
        lastname: '',
        birth: null,
        about_myself: '',
        emblem: '',
        form_id: 'profile',
      }
    }
  },
  components: {
    StandardButtons,
    aInput,
    AlinaDatePicker,
    tale_feed,
    BorgEditor,
  },
  created() {
    const vm = this;
    const id = this.curId;
    vm.fetchProfile(id);
  },
  methods: {
    //##################################################
    //region Define User
    fetchProfile(id, callback) {
      AjaxAlina.newInst({
        url: `${this.options.url}/${id}`,
        method: 'GET',
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            this.post = UtilsObject.mergeRecursively(this.post, aja.respBody.data.user);
            this.options.modeEdit = false;
          }
        }
      })
        .go();
    }, //endregion Define User
    //##################################################
    ajaDeleteUser(post) {
      if (!confirm("Are you sure?")) { return; }
      if (!confirm("Are you REALLY sure???")) { return; }
      const _t = this;
      post.form_id = 'actionUserDelete';
      AjaxAlina.newInst({
        method: 'POST',
        url: `${this.options.urlDelete}/${post.id}`,
        postParams: post,
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            _t.$router.replace({ path: `/tale/feed` });
          }
        }
      })
        .go();
    }, //##################################################
    runAJax() {
      AjaxAlina.newInst({
        method: 'POST',
        url: this.options.url,
        postParams: this.post,
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            this.post = UtilsObject.mergeRecursively(this.post, aja.respBody.data.user);
            this.options.modeEdit = false;
          }
        }
      })
        .go();
    }, //##################################################
    onChangeFileField(fileList) {
      AjaxAlina.newInst({
        method: 'POST',
        url: this.options.urlEmblem,
        enctype: 'multipart/form-data',
        postParams: {
          "form_id": "actionCommon",
          "userfile": fileList,
        },
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            this.post.emblem = aja.respBody.data.url;
          }
        }
      })
        .go();
    },
  },
  computed: {
    UtilsDate() {
      return UtilsDate
    },
    curId() {
      let id = null;
      if (this?.$route?.params?.id) {
        id = this.$route.params.id;
      } else {
        id = CurrentUser.obj().attributes.id;
      }
      return id;
    }
  },
  watch: {
    curId: function (newVal) {
      this.fetchProfile(newVal);
    }
  }
};
</script>
