<template>
  <div class="p-0"
       :class="{
            'container':!pageIsInIframe,
            'container-fluid':pageIsInIframe
         }"
  >
    <div v-if="!tale.id">...</div>
    <div class="row no-gutters" v-if="tale.id">
      <div class="col">
        <!--##################################################-->
        <!--region Buttons-->
        <btnEditSaveCancelDelete
            :owner_id="tale.owner_id"
            :modeEdit="options.modeEdit"
            :subject="tale"
            @onSave="ajaPostTale"
            @onEdit="onEdit"
            @onCancel="onCancel"
            @onDelete="ajaDeleteTale"
        ></btnEditSaveCancelDelete>
        <!--endregion Buttons-->
        <!--##################################################-->
        <!--region User Info-->
        <div class="row no-gutters mt-4 " v-if="!pageIsInIframe && tale.is_avatar_hidden != 1">
          <div class="col-auto">
                        <span class="btn-secondary text-left text-nowrap badge-pill p-2">
                            <router-link :to="'/auth/profile/'+tale.owner_id" class="fixed-height-150px">
                                <img v-if="tale.owner_emblem" :src="tale.owner_emblem" width="100px" class="rounded-circle">
                                <img v-if="!tale.owner_emblem" src="@/assets/anarki.png" width="100px" class="rounded-circle">
                            </router-link>
                            <router-link :to="'/auth/profile/'+tale.owner_id" class="text-light">
                                {{ UtilsStr.fullName(tale.owner_firstname, tale.owner_lastname, tale.owner_id) }}
                            </router-link>
                        </span>
          </div>
        </div>
        <!--endregion User Info-->
        <!--##################################################-->
        <!--region Tale-->
        <div v-if="!pageIsInIframe">
          <!--##################################################-->
          <!--region Tale. mode Edit-->
          <div class="" v-if="options.modeEdit">
            <div>Tale #{{ tale.id }}</div>
            <h1 class="btn btn-block btn-secondary">
              <input type="text" v-model="tale.header" placeholder="Header" class="notranslate form-control">
            </h1>
            <ckeditor
                class="notranslate"
                v-model="tale.body"
                :editor="options.editor"
                :config="options.editorConfig"
            ></ckeditor>
            <div class="mb-3"></div>
            <div class="mt-1 mb-3">
              <AlinaDatePicker
                  v-model="tale.publish_at"
                  label="Publish at"
                  idq="publish_at"
                  class="notranslate"
              ></AlinaDatePicker>
            </div>

            <div>
              {{ taleUrl }}
            </div>
            <div class="input-group input-group mb-3">
              <!-- router_alias -->
              <div class="input-group-prepend">
                <span class="input-group-text bg-dark text-light">{{ $tc('Page Alias') }}</span>
              </div>
              <input type="text" class="form-control" :placeholder="$tc('Page Alias')" v-model="tale.router_alias">
            </div>

            <div class="input-group input-group mb-3">
              <!-- iframe -->
              <div class="input-group-prepend">
                <span class="input-group-text bg-dark text-light">iframe</span>
              </div>
              <input type="text" class="form-control" placeholder="iframe" v-model="tale.iframe">
            </div>
            <div v-if="tale.iframe" class="mt-3">
              <iframe :src="tale.iframe" frameborder="1" width="100%" height="250px"></iframe>
            </div>

            <div class="row no-gutters">
              <div class="col">
                <div class="mb-3">
                  <!-- is_header_hidden -->
                  <ui-checkbox v-model="tale.is_header_hidden" :trueValue="1" :false-value="0" :checked="tale.is_header_hidden==1">{{ $t("Hide header") }}</ui-checkbox>
                </div>
                <div class="mb-3">
                  <!-- is_avatar_hidden -->
                  <ui-checkbox v-model="tale.is_avatar_hidden" :trueValue="1" :false-value="0" :checked="tale.is_avatar_hidden==1">{{ $t("Hide avatar") }}</ui-checkbox>
                </div>
                <div class="mb-3">
                  <!-- is_social_sharing_hidden -->
                  <ui-checkbox v-model="tale.is_social_sharing_hidden" :trueValue="1" :false-value="0" :checked="tale.is_social_sharing_hidden==1">{{ $t("Hide social sharing") }}</ui-checkbox>
                </div>
                <div class="mb-3">
                  <!-- is_comment_denied -->
                  <ui-checkbox v-model="tale.is_comment_denied" :trueValue="1" :false-value="0" :checked="tale.is_comment_denied==1">{{ $t("Comments denied") }}</ui-checkbox>
                </div>
              </div>
              <div class="col">
                <div class="mb-3">
                  <!-- is_sticked -->
                  <ui-checkbox v-model="tale.is_sticked" :trueValue="1" :false-value="0" :checked="tale.is_sticked==1">{{ $t("Sticked") }}</ui-checkbox>
                </div>
                <div class="mb-3">
                  <!-- is_adult_denied -->
                  <ui-checkbox v-model="tale.is_adult_denied" :trueValue="1" :false-value="0" :checked="tale.is_adult_denied==1">{{ $t("Not for kids") }}</ui-checkbox>
                </div>
                <div class="mb-3">
                  <!-- is_adv -->
                  <ui-checkbox v-model="tale.is_adv" trueValue="1" false-value="0" :checked="tale.is_adv==1">{{ $t("Advertisement") }}</ui-checkbox>
                </div>
                <div class="mb-3">
                  <!-- is_draft -->
                  <ui-checkbox v-model="tale.is_draft" :trueValue="1" :false-value="0" :checked="tale.is_draft==1">{{ $t("Hide on feed") }}</ui-checkbox>
                </div>
              </div>
            </div>
            <!--##################################################-->
          </div>
          <!--endregion Tale. mode Edit-->
          <!--##################################################-->
          <!--region Tale. mode Read-->
          <div v-else>
            <div class="mt-3"></div>
            <div class="row no-gutters mt-2 mb-2">
              <div class="col" style="position: relative;" v-if="tale.is_header_hidden != 1">
                <h1 class="notranslate m-0" :lang="tale.lang">
                  <a :href="UtilsSys.hrefToBackend(tale, 'tale/upsert')"
                     class="btn btn-block text-left"
                     :class="{
                          'btn-secondary':tale.is_adult_denied==0,
                          'btn-danger':tale.is_adult_denied==1
                     }"
                  >{{ tale.header || '¯\_(ツ)_/¯' }}
                  </a>
                </h1>
                <div class="notranslate" style="position: absolute; right: 1%; bottom: -1.5rem;">
                  <router-link :to="'/tale/upsert/'+tale.id"
                               class="btn btn-sm btn-info text-left mb-1">
                    {{ tale.publish_at | unix_to_date_time }}
                  </router-link>
                </div>
              </div>
            </div>
            <div class="row no-gutters mt-5">
              <div class="col">
                <div class="ck-content" :lang="tale.lang">
                  <div class="notranslate" v-html="UtilsStr.content(tale.body)"></div>
                </div>
              </div>
            </div>
            <div v-if="tale.iframe" class="mt-3">
              <iframe :src="tale.iframe" frameborder="1" width="100%" height="500px"></iframe>
            </div>
            <div class="mt-3"></div>
          </div>
          <!--endregion Tale. mode Read-->
          <!--##################################################-->
        </div>
        <!--endregion Tale-->
        <!--##################################################-->
        <!--region Yandex Map-->
        <div class="row no-gutters">
          <div class="col">
            <AlinaYandexMap
                :item="tale"
                :mode-edit="options.modeEdit"
            ></AlinaYandexMap>
          </div>
        </div>
        <!--endregion Yandex Map-->
        <!--##################################################-->
        <!--region Buttons-->
        <btnEditSaveCancelDelete
            :owner_id="tale.owner_id"
            :modeEdit="options.modeEdit"
            :subject="tale"
            @onSave="ajaPostTale"
            @onEdit="onEdit"
            @onCancel="onCancel"
            @onDelete="ajaDeleteTale"
        ></btnEditSaveCancelDelete>
        <!--endregion Buttons-->
        <!--##################################################-->
        <!--region Share & Likes-->
        <div class="row no-gutters mb-2" v-if="tale.is_social_sharing_hidden != 1">
          <div class="col">
            <div class="text-left m-buttons-1">
              <Share :tale="tale"></Share>
            </div>
          </div>
          <div class="col-auto">
            <div class="text-right">
              <Like
                  v-if="tale.is_comment_denied != 1"
                  :pAmountLikes="tale.count_like"
                  :pCurrentUserLiked="tale.current_user_liked"
                  ref_table="tale"
                  :ref_id="tale.id"
              ></Like>
            </div>
          </div>
        </div>
        <!--endregion Share & Likes-->
        <!--##################################################-->
        <div v-if="tale.is_comment_denied != 1">
          <Comment v-if="tale.level < 2"
                   :level="tale.level+1"
                   type="COMMENT"
                   :root_tale_id="tale.root_tale_id ? tale.root_tale_id : tale.id"
                   :answer_to_tale_id="tale.id"
                   :count_by_answer_to_tale_id="tale.count_root_tale_id"
          ></Comment>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import UtilsData               from "@/Utils/UtilsData";
import StandardButtons         from "@/components/elements/form/StandardButtons";
import ConfigApi               from "@/configs/ConfigApi";
import AjaxAlina               from "@/services/AjaxAlina";
import CurrentUser             from "@/services/CurrentUser";
import Comment                 from "@/components/elements/form/Comment";
import Like                    from "@/components/elements/form/Like";
import AlinaDatePicker         from "@/components/elements/form/AlinaDatePicker";
import ClassicEditor           from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import ConfigCkEditor          from "@/configs/ConfigCkEditor";
import UtilsStr                from "@/Utils/UtilsStr";
import Share                   from "@/components/elements/form/Share";
import AlinaYandexMap          from "@/components/elements/form/AlinaYandexMap";
import UtilsSys                from "@/Utils/UtilsSys";
import btnEditSaveCancelDelete from "@/components/elements/form/btnEditSaveCancelDelete";
//import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
//#####
export default {
  name: "tale_upsert",
  data() {
    return {
      UtilsSys,
      UtilsStr,
      CU:        CurrentUser.obj(),
      ConfigApi: ConfigApi,
      options:   {
        url:          `${ConfigApi.url_base}/tale/upsert`,
        urlDelete:    `${ConfigApi.url_base}/tale/delete`,
        editorConfig: ConfigCkEditor,
        editor:       ClassicEditor,
        modeEdit:     false
      },
      tale:      {
        id:                       null,
        header:                   '',
        body:                     '',
        publish_at:               '',
        is_submitted:             0,
        type:                     'POST',
        form_id:                  'actionUpsert',
        is_adult_denied:          0,
        is_adv:                   0,
        owner_emblem:             '',
        owner_firstname:          '',
        owner_lastname:           '',
        owner_id:                 '',
        count_like:               '',
        current_user_liked:       '',
        router_alias:             '',
        router_alias_id:          null,
        iframe:                   null,
        count_root_tale_id:       0,
        is_draft:                 0,
        is_comment_denied:        0,
        is_sticked:               0,
        is_header_hidden:         0,
        is_avatar_hidden:         0,
        is_social_sharing_hidden: 0,
        is_sticked_on_home:       0,
        geo_latitude:             0,
        geo_longitude:            0,
        geo_map_type:             'map',
        geo_zoom:                 '11',
        geo_is_map_shown:         '0',
      },
      storage:   {
        keyTaleLastTouched: 'keyTaleLastTouched',
      },
    }
  },
  components: {
    btnEditSaveCancelDelete,
    Share,
    AlinaYandexMap,
    StandardButtons,
    Comment,
    Like,
    AlinaDatePicker
  },
  created() {
    const id = this.routerTaleId;
    this.ajaxGetTale(id);
  },
  computed: {
    taleUrl() {
      let res = ConfigApi.url_base;
      if (this.tale.router_alias) {
        res += `/${this.tale.router_alias}`;
      } else {
        res += `/tale/upsert/${this.tale.id}`;
      }
      return res;
    },
    pageIsInIframe() {
      return this.ConfigApi.pageIsInIframe();
    },
    routerTaleId() {
      let res     = null;
      const route = this.$route;
      if (route && route.params && route.params.id) {
        res = route.params.id;
      }
      return res;
    },
    currentTaleId() {
      let res    = null;
      const tale = this.tale;
      if (tale && tale.hasOwnProperty('id')) {
        res = tale.id;
      }
      return res;
    },
  },
  watch:    {
    "tale.id":    function (valNew, valOld) {
      if (this.tale.is_submitted === 1) {
        this.options.modeEdit = false;
      }
    },
    tale:         {
      handler(newVal, oldVal) {
        if (this.options.modeEdit) {
          this.taleLastTouchedRemember(newVal);
        }
      },
      deep: true
    },
    routerTaleId: function (valNew) {
      this.ajaxGetTale(valNew);
    }
  },
  methods:  {
    // ##################################################
    // region Functional Actions
    taleLastTouchedRemember(tale) {
      localStorage.setItem(this.storage.keyTaleLastTouched, JSON.stringify(tale));
    },
    taleLastTouchedRecall() {
      const taleLastTouchedString = localStorage.getItem(this.storage.keyTaleLastTouched)
      if (taleLastTouchedString) {
        const taleLastTouchedObj = JSON.parse(taleLastTouchedString);
        if (taleLastTouchedObj && taleLastTouchedObj.id) {
          if (taleLastTouchedObj.body.length > 10) {
            if (
                taleLastTouchedObj.id == this.tale.id
            ) {
              Object.assign(this.tale, taleLastTouchedObj);
            }
          }
        }
      }
    },
    // endregion Functional Actions
    // ##################################################
    // region Event Handlers
    onEdit() {
      this.options.modeEdit = true;
      this.taleLastTouchedRecall();
    },
    onCancel() {
      this.options.modeEdit = false
      this.taleLastTouchedRemember({});
      if (this.tale.is_submitted == 0) {
        this.$router.replace({path: '/'})
      } else {
        this.ajaxGetTale(this.tale.id, true);
      }
      return null;
    },
    // endregion Event Handlers
    // ##################################################
    // region CRUD
    ajaPostTale() {
      AjaxAlina.newInst({
        method:     'POST',
        url:        this.options.url,
        postParams: this.tale,
        onDone:     (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            Object.assign(this.tale, aja.respBody.data)
            this.options.modeEdit = false;
            this.taleLastTouchedRemember({})
          }
        }
      })
          .go();
    },
    ajaxGetTale(id, forceGet = false) {
      const _t = this;
      //###############
      //region Fix Double get
      if (!UtilsData.empty(id) && id == _t.tale.id) {
        if (!forceGet) {
          return null;
        }
      }
      //endregion Fix Double get
      //###############
      AjaxAlina.newInst({
        method: 'GET',
        url:    id
                ? `${_t.options.url}/${id}`
                : `${_t.options.url}`
        ,
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            if (!UtilsData.empty(_t.routerTaleId)) {
              if (aja.respBody.data.id != _t.routerTaleId) {
                _t.$router.replace({path: `/tale/upsert/${aja.respBody.data.id}`});
                return null;
              }
            }
            Object.assign(_t.tale, aja.respBody.data)
            if (_t.tale.is_submitted == 0) {
              if (this.CU.ownsOrAdminOrModerator(_t.tale.owner_id)) {
                _t.options.modeEdit = true;
                this.taleLastTouchedRecall();
              }
            }
            //###############
            if (UtilsData.empty(id) && !UtilsData.empty(_t.tale.id)) {
              _t.$router.replace({path: `/tale/upsert/${_t.tale.id}`});
            }
            //###############
          }
        }
      })
          .go();
    },
    ajaDeleteTale(tale) {
      if (!confirm("Are you sure?")) {return;}
      const _t     = this;
      tale.form_id = 'actionDelete';
      AjaxAlina.newInst({
        method:     'POST',
        url:        `${this.options.urlDelete}/${tale.id}`,
        postParams: tale,
        onDone:     (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            _t.$router.replace({path: `/tale/feed`});
          }
        }
      })
          .go();
    },
    // endregion CRUD
    // ##################################################
  }
};
</script>