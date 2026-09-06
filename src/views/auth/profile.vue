<template>
  <div>
    <div class="container mt-3 mb-3 p-0">
      <div class="row no-gutters mt-2 mb-2">
        <div class="col"></div>
        <div class="col-auto row no-gutters justify-content-end" style="gap:5mm;">
          <sup class="f-left text-sm">[ID {{ post.id }}]</sup>
          <button v-if="options.modeEdit && CU.ownsOrAdminOrModerator(post.id)" @click="ajaDeleteUser(post)" class="btn btn-a" style="min-width: 8ch;">{{ $t("i_delete") }}</button>
          <button v-if="CU.ownsOrAdminOrModerator(post.id) && !options.modeEdit" @click="options.modeEdit = !options.modeEdit" class="btn btn-a">{{ options.modeEdit ? $t("i_cancel") : $t("i_edit") }}</button>
          <StandardButtons v-if="CU.ownsOrAdminOrModerator(post.id) && options.modeEdit" :onGo="runAJax"></StandardButtons>
        </div>
      </div>
    </div>

    <div class="container-fluid container-bio">
      <div class="row no-gutters row-bio" style="gap:7mm;">
        <div class="col item-bio item-photo">
          <aInput
            v-if="options.modeEdit"
            type="file"
            display="block"
            :modeEdit="options.modeEdit"
            :label="$t('Upload')"
            accept="image/*"
            :multiple="false"
            :idNameKey="ConfigApi.ALINA_FILE_UPLOAD_KEY"
            @change="onChangeFileField" />
          <div></div>
          <img v-if="post.emblem" :src="post.emblem" class="avatar rounded">
          <img v-if="!post.emblem" src="@/assets/anarki.png" class="avatar">
        </div>
        <div class="col item-bio item-about-info">
          <div class="item-about">
            <div class="text-center">
              <h1 class="notranslate font-weight-bold mb-4 d-flex flex-wrap" style="gap:2mm;">
                <aInput v-model="post.firstname" class="profile-name-input" :modeEdit="options.modeEdit" :placeholder="$t('First name')" inputAlign="center"/>
                <aInput v-model="post.lastname" class="profile-name-input" :modeEdit="options.modeEdit" :placeholder="$t('Last name')" inputAlign="center"/>
              </h1>

              <div class="mb-4">
                <AlinaDatePicker v-model="post.birth" label="Birth" idq="birth" class="notranslate" format="dateTime" :modeEdit="options.modeEdit"></AlinaDatePicker>
              </div>

              <div class="mb-4">
                <aInput v-model="post.mail" type="email" :formatter="UtilsStr.transformEmail" />
              </div>

            </div>
          </div>
          <div class="item-info">
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
import StandardButtons from "@/components/elements/form/StandardButtons.vue";
import aInput from "@/components/elements/form/aInput.vue";
import ConfigApi from "@/configs/ConfigApi";
import AjaxAlina from "@/services/AjaxAlina";
import CurrentUser from "@/services/CurrentUser";
import AlinaDatePicker from "@/components/elements/form/AlinaDatePicker.vue";
import tale_feed from "@/views/tale/feed.vue";
import UtilsObject from "@/Utils/UtilsObject";
import UtilsStr from "@/Utils/UtilsStr";
import UtilsDate from "../../Utils/UtilsDate";
import BorgEditor from "@/components/BorgEditor/index.vue";
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

<style>
.profile-name-input {
  flex: 1 1 10rem;
  min-width: 0;
}

.container-bio {
  & .row-bio {
    justify-content: space-around;

    & .item-bio {
      /* border: 1px solid yellow; */
    }

    & .item-photo {
      text-align: center;

      & img {
        height: min(50vw, 50vh);
        width: min(95vw, 500px);
        object-fit: cover;
        background-color: red;
      }
    }

    & .item-about-info {
      /* border: 1px solid blue; */
      flex: 1 1 50vw;

      & .item-about {}

      & .item-info {}
    }
  }
}
</style>
