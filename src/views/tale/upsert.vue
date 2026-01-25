<template>
  <div
    class="p-0 alina-tale-wrapper"
    :class="{
      container: !pageIsInIframe,
      'container-fluid': pageIsInIframe,
    }"
  >
    <div v-if="!tale.id">...</div>

    <!--##################################################-->
    
    <div
      v-if="tale.id"
      :class="['row', 'no-gutters', `alina-tale-id-${tale.id}`]"
    >
      <div class="col">
        <!--##################################################-->

        <!-- region  AVATAR -->
        <UserAvatar
          v-if="tale.is_avatar_hidden == 0 && !pageIsInIframe"
          :userId="tale.owner_id"
          :userFirstName="tale.owner_firstname"
          :userLastName="tale.owner_lastname"
          :emblemUrl="tale.owner_emblem"
          emblemWidth="7vmax"
          :someDate="null"
          class="mt-5 mb-5 text-center"
        ></UserAvatar>
        <!-- endregion  AVATAR -->

        <!--##################################################-->

        <!-- region BUTTONS -->
        <btnEditSaveCancelDelete
          v-if="!pFlagInFeed"
          :modeEdit="dConf.modeEdit"
          :owner_id="tale.owner_id"
          :subject="tale"
          @onSave="ajaPostTale"
          @onEdit="onEdit"
          @onCancel="onCancel"
          @onDelete="ajaDeleteTale"
        >
        </btnEditSaveCancelDelete>
        <!-- endregion BUTTONS -->

        <!--##################################################-->

        <!-- region TALE -->
        <div v-if="!pageIsInIframe">
          <!-- region MODE EDIT -->
          <div v-if="dConf.modeEdit">
            <div>Tale #{{ tale.id }}</div>
            <h1>
              <aInput
                v-model="tale.header"
                :placeholder="$t('Header').toString()"
                :modeEdit="dConf.modeEdit"
                componentDisplay="block"
              />
            </h1>
            <BorgEditor
              v-model="tale.body"
              :modeEdit="dConf.modeEdit"
            />

            <div class="mb-3">&nbsp;</div>

            <!-- region DATE -->
            <div class="mt-1 mb-3">
              <AlinaDatePicker
                v-model="tale.publish_at"
                label="Publish at"
                idq="publish_at"
                class="notranslate"
                :modeEdit="dConf.modeEdit"
              ></AlinaDatePicker>
            </div>
            <!-- endregion DATE -->

            <!-- region BODY FREE -->
            <div v-if="CU.isAdmin()">
              <div class="input-group input-group mb-3">
                <!-- body_free -->
                <div class="input-group-prepend">
                  <span class="input-group-text bg-dark text-light">{{
                    $tc("body_free")
                  }}</span>
                </div>
                <textarea
                  class="form-control"
                  :placeholder="$tc('body_free').toString()"
                  v-model="tale.body_free"
                  rows="20"
                ></textarea>
              </div>
              <div class="mt-3 mb-3">
                <div v-html="tale.body_free"></div>
              </div>
            </div>
            <!-- endregion BODY FREE -->

            <!-- region ALIAS -->
            <div class="mb-3">
              <div>
                {{ taleUrl }}
              </div>

              <aInput
                v-model="tale.router_alias"
                :label="$tc('Page Alias').toString()"
                :placeholder="$tc('Page Alias').toString()"
                :modeEdit="dConf.modeEdit"
                componentDisplay="block"
              />
            </div>
            <!-- endregion ALIAS -->

            <!-- region iframe -->
            <div class="mb-3">
              <aInput
                v-model="tale.iframe"
                :label="$tc('iframe')"
                :placeholder="$tc('iframe').toString()"
                :modeEdit="dConf.modeEdit"
                componentDisplay="block"
              />
            </div>

            <div
              v-if="tale.iframe"
              class="mt-3"
            >
              <iframe
                :src="tale.iframe"
                frameborder="1"
                width="90%"
                height="250px"
              ></iframe>
            </div>
            <!-- endregion iframe -->

            <!-- region TALE VIEW SETTINGS -->
            <div
              class="row no-gutters tale-view-settings"
              style="max-width: 99%"
            >
              <div class="col-md">
                <div class="mb-3">
                  <!-- is_header_hidden -->
                  <aInput
                    :label="$t('Hide header').toString()"
                    v-model="tale.is_header_hidden"
                    type="checkbox"
                    :flagLabelFirst="false"
                    :modeEdit="true"
                  />
                </div>
                <div class="mb-3">
                  <!-- is_date_hidden -->
                  <aInput
                    :label="$t('Hide date').toString()"
                    v-model="tale.is_date_hidden"
                    type="checkbox"
                    :flagLabelFirst="false"
                    :modeEdit="dConf.modeEdit"
                  />
                </div>
                <div class="mb-3">
                  <!-- is_avatar_hidden -->
                  <aInput
                    :label="$t('Hide avatar').toString()"
                    v-model="tale.is_avatar_hidden"
                    type="checkbox"
                    :flagLabelFirst="false"
                    :modeEdit="dConf.modeEdit"
                  />
                </div>
                <div class="mb-3">
                  <!-- is_social_sharing_hidden -->
                  <aInput
                    :label="$t('Hide social sharing').toString()"
                    v-model="tale.is_social_sharing_hidden"
                    type="checkbox"
                    :flagLabelFirst="false"
                    :modeEdit="dConf.modeEdit"
                  />
                </div>
                <div class="mb-3">
                  <!-- is_comment_denied -->
                  <aInput
                    :label="$t('Comments denied').toString()"
                    v-model="tale.is_comment_denied"
                    type="checkbox"
                    :flagLabelFirst="false"
                    :modeEdit="dConf.modeEdit"
                  />
                </div>
                <div class="mb-3">
                  <!-- is_comment_for_owner -->
                  <aInput
                    :label="$t('Comments only for owner').toString()"
                    v-model="tale.is_comment_for_owner"
                    type="checkbox"
                    :flagLabelFirst="false"
                    :modeEdit="dConf.modeEdit"
                  />
                </div>
              </div>
              <div class="col-md">
                <div class="mb-3">
                  <!-- is_sticked -->
                  <aInput
                    :label="$t('Sticked').toString()"
                    v-model="tale.is_sticked"
                    type="checkbox"
                    :flagLabelFirst="false"
                    :modeEdit="dConf.modeEdit"
                  />
                </div>
                <div class="mb-3">
                  <!-- is_adult_denied -->
                  <aInput
                    :label="$t('Not for kids').toString()"
                    v-model="tale.is_adult_denied"
                    type="checkbox"
                    :flagLabelFirst="false"
                    :modeEdit="dConf.modeEdit"
                  />
                </div>
                <div class="mb-3">
                  <!-- is_adv -->
                  <aInput
                    :label="$t('Advertisement').toString()"
                    v-model="tale.is_adv"
                    type="checkbox"
                    :flagLabelFirst="false"
                    :modeEdit="dConf.modeEdit"
                  />
                </div>
                <div class="mb-3">
                  <!-- is_draft -->
                  <aInput
                    :label="$t('Hide on feed').toString()"
                    v-model="tale.is_draft"
                    type="checkbox"
                    :flagLabelFirst="false"
                    :modeEdit="dConf.modeEdit"
                  />
                </div>
                <div class="mb-3">
                  <!-- is_for_registered -->
                  <aInput
                    :label="$t('Only for registered users').toString()"
                    v-model="tale.is_for_registered"
                    type="checkbox"
                    :flagLabelFirst="false"
                    :modeEdit="dConf.modeEdit"
                  />
                </div>

                <!-- seo_index -->
                <div class="mb-3">
                  <aInput
                    v-model="tale.seo_index"
                    :label="$tc(' SEO Index')"
                    :placeholder="$tc('SEO Index')"
                    :modeEdit="dConf.modeEdit"
                  />
                </div>
              </div>
            </div>
            <!-- endregion TALE VIEW SETTINGS -->
          </div>
          <!-- endregion MODE EDIT -->

          <!--##################################################-->

          <!-- region MODE READ -->
          <div v-if="!dConf.modeEdit">
            <div class="row no-gutters">
              <div
                class="col mb-3"
                style="position: relative"
                v-if="tale.is_header_hidden != 1"
              >
                <h1
                  :class="[
                    'notranslate m-0 p-3 text-left rounded alina-tale-header',
                    {
                      'bg-danger': tale.is_adult_denied == 1,
                    },
                  ]"
                  :lang="tale.lang"
                >
                  <a
                    :href="UtilsSys.hrefToBackend(tale, 'tale/upsert')"
                    class="m-0"
                  >
                    <aInput
                      v-model="tale.header"
                      :placeholder="$t('Header').toString()"
                      :modeEdit="dConf.modeEdit"
                    />
                  </a>
                </h1>
                <div
                  v-if="tale.is_date_hidden != 1"
                  class="notranslate"
                  style="
                    position: absolute;
                    right: 1%;
                    bottom: -1.5rem;
                    padding: 1rem;
                  "
                >
                  <router-link
                    :to="'/tale/upsert/' + tale.id"
                    class="btn-sm text-left mb-1 corporate-bg-gradient no-decoration"
                    style="font-size: 2vmin"
                  >
                    {{ UtilsDate.fromUnixToDateTime(tale.publish_at) }}
                  </router-link>
                </div>
              </div>
            </div>

            <!--##################################################-->

            <div
              v-if="
                (tale.is_header_hidden == 1 || tale.is_date_hidden == 1) &&
                CU.ownsOrAdminOrModerator(tale.owner_id)
              "
            >
              <router-link :to="'/tale/upsert/' + tale.id">... </router-link>
            </div>
            <div class="row no-gutters mt-1">
              <div
                class="col"
                :lang="tale.lang"
              >
                <BorgEditor
                  :modeEdit="dConf.modeEdit"
                  v-model="tale.body"
                />
              </div>
            </div>
            <div
              v-if="tale.body_free"
              class="mt-3"
            >
              <div v-html="tale.body_free"></div>
            </div>
            <div
              v-if="tale.iframe"
              class="mt-3"
            >
              <iframe
                :src="tale.iframe"
                frameborder="1"
                width="90%"
                height="500px"
              ></iframe>
            </div>
            <div class="mt-3">&nbsp;</div>
          </div>
          <!-- endregion MODE READ -->

          <!--##################################################-->
        </div>
        <!-- endregion TALE -->

        <!--##################################################-->

        <!-- region Yandex Map-->
        <div class="row m-1">
          <div class="col">
            <AlinaYandexMap
              :item="tale"
              :mode-edit="dConf.modeEdit"
            ></AlinaYandexMap>
          </div>
        </div>
        <!-- endregion Yandex Map-->

        <!--##################################################-->

        <!-- region FILES -->
        <div
          class="row no-gutters"
          v-if="tale.count_files > 0 || dConf.modeEdit"
        >
          <div class="col mb-3">
            <AlinaFileUploader
              :entity_id="tale.id"
              entity_table="tale"
              :modeEdit="dConf.modeEdit"
              :ownLength="tale.count_files"
            ></AlinaFileUploader>
          </div>
        </div>
        <!-- endregion FILES -->

        <!--##################################################-->

        <!-- region Buttons-->
        <btnEditSaveCancelDelete
          v-if="!pFlagInFeed"
          :owner_id="tale.owner_id"
          :modeEdit="dConf.modeEdit"
          :subject="tale"
          @onSave="ajaPostTale"
          @onEdit="onEdit"
          @onCancel="onCancel"
          @onDelete="ajaDeleteTale"
        >
        </btnEditSaveCancelDelete>
        <!-- endregion Buttons-->

        <!--##################################################-->

        <!-- region Share & Likes-->
        <div
          class="row no-gutters mb-3"
          v-if="tale.is_social_sharing_hidden != 1"
        >
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
        <!-- endregion Share & Likes-->

        <!--##################################################-->

        <!-- region COMMENTS -->
        <div
          v-if="tale.is_comment_denied != 1"
          class="mb-5"
        >
          <Comment
            v-if="tale.level < 2"
            :level="tale.level + 1"
            type="COMMENT"
            :root_tale_id="tale.root_tale_id ? tale.root_tale_id : tale.id"
            :answer_to_tale_id="tale.id"
            :count_by_answer_to_tale_id="tale.count_root_tale_id"
            :root_tale_object="tale"
          ></Comment>
        </div>
        <!-- endregion COMMENTS -->

        <!--##################################################-->
      </div>
    </div>
  </div>
</template>
<script>
import UtilsData from "@/Utils/UtilsData";
import StandardButtons from "@/components/elements/form/StandardButtons.vue";
import ConfigApi from "@/configs/ConfigApi";
import AjaxAlina from "@/services/AjaxAlina";
import CurrentUser from "@/services/CurrentUser";
import Comment from "@/components/elements/form/Comment.vue";
import Like from "@/components/elements/form/Like.vue";
import AlinaDatePicker from "@/components/elements/form/AlinaDatePicker.vue";
import UtilsStr from "@/Utils/UtilsStr";
import Share from "@/components/elements/form/Share.vue";
import AlinaYandexMap from "@/components/elements/form/AlinaYandexMap.vue";
import UtilsSys from "@/Utils/UtilsSys";
import btnEditSaveCancelDelete from "@/components/elements/form/btnEditSaveCancelDelete.vue";
import AlinaFileUploader from "@/components/elements/form/AlinaFileUploader.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import AlinaPageGlobalAnalyzer from "@/services/AlinaPageGlobalAnalyzer";
import UtilsDate from "../../Utils/UtilsDate";
import BorgEditor from "@/components/BorgEditor/index.vue";
import aInput from "@/components/elements/form/aInput.vue";
//#####
export default {
  name: "tale_upsert",
  props: {
    pTale: {
      type: Object,
      default: null,
    },
    pFlagInFeed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      UtilsSys,
      UtilsStr,
      CU: CurrentUser.obj(),
      ConfigApi,
      dConf: {
        url: `${ConfigApi.url_base}/tale/upsert`,
        urlDelete: `${ConfigApi.url_base}/tale/delete`,
        modeEdit: false,
      },
      tale: {
        id: null,
        header: "",
        body: "",
        body_free: "",
        publish_at: "",
        is_submitted: 0,
        type: "POST",
        form_id: "actionUpsert",
        is_adult_denied: 0,
        is_adv: 0,
        owner_emblem: "",
        owner_firstname: "",
        owner_lastname: "",
        owner_id: "",
        count_like: "",
        current_user_liked: "",
        router_alias: "",
        router_alias_id: null,
        iframe: null,
        count_root_tale_id: 0,
        is_draft: 0,
        is_comment_denied: 0,
        is_sticked: 0,
        is_sticked_on_home: 0, //ToDo: Seems not in use
        is_header_hidden: 0,
        is_date_hidden: 0,
        is_avatar_hidden: 0,
        is_social_sharing_hidden: 0,
        is_for_registered: 0,
        is_comment_for_owner: 0,
        seo_index: 0.1,
        geo_latitude: 0,
        geo_longitude: 0,
        geo_map_type: "map",
        geo_zoom: "11",
        geo_is_map_shown: "0",
        count_files: 0,
      },
      storage: {
        keyTaleLastTouched: "keyTaleLastTouched",
      },
    };
  },
  components: {
    aInput,
    UserAvatar,
    btnEditSaveCancelDelete,
    Share,
    AlinaYandexMap,
    StandardButtons,
    Comment,
    Like,
    AlinaDatePicker,
    AlinaFileUploader,
    BorgEditor,
  },
  created() {
    const id = this.routerTaleId;
    this.ajaxGetTale(id);
  },
  computed: {
    UtilsDate() {
      return UtilsDate;
    },
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
      return AlinaPageGlobalAnalyzer.pageIsInIframe();
    },

    /**
     * Current tale ID from route params
     * @type {(this: Vue) => string|number|null}
     * @returns {string|number|null} The tale ID or null if not present
     */
    routerTaleId() {
      let res = null;
      const route = this.$route;
      if (route && route.params && route.params.id) {
        res = route.params.id;
      }
      return res;
    },
    currentTaleId() {
      let res = null;
      const tale = this.tale;
      if (tale && tale.hasOwnProperty("id")) {
        res = tale.id;
      }
      return res;
    },
  },
  watch: {
    "tale.id": function (valNew, valOld) {
      if (this.tale.is_submitted === 1) {
        this.dConf.modeEdit = false;
      }
    },
    tale: {
      handler(newVal, oldVal) {
        if (this.dConf.modeEdit) {
          this.taleLastTouchedRemember(newVal);
        }
      },
      deep: true,
    },
    routerTaleId: function (valNew) {
      this.ajaxGetTale(valNew);
    },
  },

  methods: {
    // ##################################################
    // region Functional Actions
    taleLastTouchedRemember(tale) {
      localStorage.setItem(
        this.storage.keyTaleLastTouched,
        JSON.stringify(tale)
      );
    },

    taleLastTouchedRecall() {
      const taleLastTouchedString = localStorage.getItem(
        this.storage.keyTaleLastTouched
      );
      if (taleLastTouchedString) {
        const taleLastTouchedObj = JSON.parse(taleLastTouchedString);
        if (taleLastTouchedObj && taleLastTouchedObj.id) {
          if (taleLastTouchedObj?.body?.length > 10) {
            if (taleLastTouchedObj.id == this.tale.id) {
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
      this.dConf.modeEdit = true;
      this.taleLastTouchedRecall();
    },

    onCancel() {
      this.dConf.modeEdit = false;
      this.taleLastTouchedRemember({});
      if (this.tale.is_submitted == 0) {
        this.$router.replace({ path: "/" });
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
        method: "POST",
        url: this.dConf.url,
        postParams: this.tale,
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            Object.assign(this.tale, aja.respBody.data);
            this.dConf.modeEdit = false;
            this.taleLastTouchedRemember({});
          }
        },
      }).go();
    },

    ajaxGetTale(id, forceGet = false) {
      const _t = this;
      //###############
      if (this.pFlagInFeed) {
        if (this.pTale) {
          Object.assign(_t.tale, this.pTale);
          return null;
        }
      }
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
        method: "GET",
        url: id ? `${_t.dConf.url}/${id}` : `${_t.dConf.url}`,
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            if (!UtilsData.empty(_t.routerTaleId)) {
              if (aja.respBody.data.id != _t.routerTaleId) {
                _t.$router.replace({
                  path: `/tale/upsert/${aja.respBody.data.id}`,
                });
                return null;
              }
            }
            Object.assign(_t.tale, aja.respBody.data);
            if (_t.tale.is_submitted == 0) {
              if (this.CU.ownsOrAdminOrModerator(_t.tale.owner_id)) {
                _t.dConf.modeEdit = true;
                this.taleLastTouchedRecall();
              }
            }
            //###############
            if (UtilsData.empty(id) && !UtilsData.empty(_t.tale.id)) {
              _t.$router.replace({ path: `/tale/upsert/${_t.tale.id}` });
            }
            //###############
          }
        },
      }).go();
    },

    ajaDeleteTale(tale) {
      if (!confirm("Are you sure?")) {
        return;
      }
      const _t = this;
      tale.form_id = "actionDelete";
      AjaxAlina.newInst({
        method: "POST",
        url: `${this.dConf.urlDelete}/${tale.id}`,
        postParams: tale,
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            _t.$router.replace({ path: `/tale/feed` });
          }
        },
      }).go();
    }, // endregion CRUD
    // ##################################################
  },
};
</script>
