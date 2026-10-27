<template>
  <div
    v-if="tale.id"
    :key="tale.id"
    :class="[
      'p-0 alina-tale-wrapper',
      {
        'mt-5': !pFlagInFeed,
        'container': !pageIsInIframe,
        'container-fluid': pageIsInIframe,
      },
    ]">
    <div :class="['row', 'g-0', `alina-tale-id-${tale.id}`, pageIsInIframe ? '' : 'divine-shadow']">
      <div class="col-12">
        <div
          v-if="!pageIsInIframe && tale.is_header_hidden != 1"
          style="position: relative">
          <h1
            :class="[
              'notranslate m-0 p-2 text-start rounded-bottom alina-tale-header',
              {
                'bg-danger': tale.is_adult_denied == 1,
              },
            ]"
            :lang="tale.lang">
            <aInput
              v-model="tale.header"
              :placeholder="$t('Header').toString()"
              :modeEdit="dConf.modeEdit"
              componentDisplay="block"
              :href="UtilsSys.hrefToBackend(tale, 'tale/upsert')" />
          </h1>
          <div
            v-if="tale.is_date_hidden != 1"
            class="notranslate alina-tale-date">
            <router-link
              :to="'/tale/upsert/' + tale.id"
              class="btn-sm text-start mb-1 corporate-bg-gradient no-decoration alina-tale-date-link">
              {{ UtilsDate.fromUnixToDateTime(tale.publish_at) }}
            </router-link>
          </div>
        </div>

        <div
          v-if="!pageIsInIframe"
          class="row g-0 mt-2 mb-2 align-items-center justify-content-between mb-3 mt-3">
          <div class="col">
            <!-- region  AVATAR -->
            <UserAvatar
              v-if="tale.is_avatar_hidden == 0"
              :userId="tale.owner_id"
              :userFirstName="tale.owner_firstname"
              :userLastName="tale.owner_lastname"
              :emblemUrl="tale.owner_emblem"
              emblemWidth="7vmax"
              :someDate="null" />
            <!-- endregion  AVATAR -->
          </div>
          <div
            v-if="CU.ownsOrAdminOrModerator(tale.owner_id)"
            class="col-2">
            <!-- region BUTTONS -->
            <btnEditSaveCancelDelete
              :modeEdit="dConf.modeEdit"
              :owner_id="tale.owner_id"
              :subject="tale"
              @onSave="ajaPostTale"
              @onEdit="onEdit"
              @onCancel="onCancel"
              @onDelete="ajaDeleteTale" />
            <!-- endregion BUTTONS -->
          </div>
        </div>

        <BorgEditor
          v-if="!pageIsInIframe"
          :modeEdit="dConf.modeEdit"
          v-model="tale.body"
          class="ps-1 pe-1"
          />

        <div class="mb-3">&nbsp;</div>

        <!-- region BODY FREE -->
        <div
          v-if="!dConf.modeEdit && tale.body_free"
          v-html="tale.body_free"></div>
        <!-- endregion BODY FREE -->

        <!-- region iframe VIEW -->
        <aInput
          v-if="!dConf.modeEdit && tale.iframe"
          v-model="tale.iframe"
          :src="tale.iframe"
          :label="$t('iframe')"
          :placeholder="$t('iframe').toString()"
          :modeEdit="dConf.modeEdit"
          componentDisplay="block" />
        <!-- endregion iframe VIEW -->

        <!-- # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #  -->

        <!-- region EDIT -->
        <div v-if="!pageIsInIframe && dConf.modeEdit" class="ps-4 pe-4">
          <div class="mb-3">&nbsp;</div>

          <!-- region DATE -->
          <AlinaDatePicker
            v-model="tale.publish_at"
            label="Publish at"
            idq="publish_at"
            class="notranslate"
            :modeEdit="dConf.modeEdit" />
          <!-- endregion DATE -->

          <div style="margin-top: 50px; margin-bottom: 50px">
          <!-- region ADVANCED EDIT BUTTONS -->
          <div
            class="d-flex justify-content-start flex-wrap mb-3"
            style="gap: 1mm">
            <b-button
              class="btn-a"
              :class="{
                'edit-section-button-active': expandedEditBlock === 'main',
              }"
              @click="toggleEditBlock('main')">
              {{ $t("Main") }}
            </b-button>

            <b-button
              v-if="CU.isAdmin() || CU.isModerator() || CU.isPrivileged()"
              class="btn-a"
              :class="{
                'edit-section-button-active': expandedEditBlock === 'alias',
              }"
              @click="toggleEditBlock('alias')">
              {{ $t("Page Alias") }}
            </b-button>

            <b-button
              v-if="CU.isAdmin() || CU.isModerator() || CU.isPrivileged()"
              class="btn-a"
              :class="{
                'edit-section-button-active': expandedEditBlock === 'iframe',
              }"
              @click="toggleEditBlock('iframe')">
              {{ $t("iframe") }}
            </b-button>

            <b-button
              v-if="CU.isAdmin()"
              class="btn-a"
              :class="{
                'edit-section-button-active': expandedEditBlock === 'body-free',
              }"
              @click="toggleEditBlock('body-free')">
              {{ $t("body_free") }}
            </b-button>
          </div>
          <!-- endregion ADVANCED EDIT BUTTONS -->

          <!-- region TALE VIEW SETTINGS -->
          <b-collapse
            :id="`tale-main-${tale.id}`"
            :model-value="expandedEditBlock === 'main'"
            class="mt-3">
            <div class="row g-0 tale-view-settings">
              <div class="col-md">
                <div class="mb-3">
                  <!-- is_header_hidden -->
                  <aInput
                    :label="$t('Hide header').toString()"
                    v-model="tale.is_header_hidden"
                    type="checkbox"
                    :flagLabelFirst="false"
                    :modeEdit="true" />
                </div>
                <div class="mb-3">
                  <!-- is_date_hidden -->
                  <aInput
                    :label="$t('Hide date').toString()"
                    v-model="tale.is_date_hidden"
                    type="checkbox"
                    :flagLabelFirst="false"
                    :modeEdit="dConf.modeEdit" />
                </div>
                <div class="mb-3">
                  <!-- is_avatar_hidden -->
                  <aInput
                    :label="$t('Hide avatar').toString()"
                    v-model="tale.is_avatar_hidden"
                    type="checkbox"
                    :flagLabelFirst="false"
                    :modeEdit="dConf.modeEdit" />
                </div>
                <div class="mb-3">
                  <!-- is_social_sharing_hidden -->
                  <aInput
                    :label="$t('Hide social sharing').toString()"
                    v-model="tale.is_social_sharing_hidden"
                    type="checkbox"
                    :flagLabelFirst="false"
                    :modeEdit="dConf.modeEdit" />
                </div>
                <div class="mb-3">
                  <!-- is_comment_denied -->
                  <aInput
                    :label="$t('Comments denied').toString()"
                    v-model="tale.is_comment_denied"
                    type="checkbox"
                    :flagLabelFirst="false"
                    :modeEdit="dConf.modeEdit" />
                </div>
                <div class="mb-3">
                  <!-- is_comment_for_owner -->
                  <aInput
                    :label="$t('Comments only for owner').toString()"
                    v-model="tale.is_comment_for_owner"
                    type="checkbox"
                    :flagLabelFirst="false"
                    :modeEdit="dConf.modeEdit" />
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
                    :modeEdit="dConf.modeEdit" />
                </div>
                <div class="mb-3">
                  <!-- is_adult_denied -->
                  <aInput
                    :label="$t('Not for kids').toString()"
                    v-model="tale.is_adult_denied"
                    type="checkbox"
                    :flagLabelFirst="false"
                    :modeEdit="dConf.modeEdit" />
                </div>
                <div class="mb-3">
                  <!-- is_adv -->
                  <aInput
                    :label="$t('Advertisement').toString()"
                    v-model="tale.is_adv"
                    type="checkbox"
                    :flagLabelFirst="false"
                    :modeEdit="dConf.modeEdit" />
                </div>
                <div class="mb-3">
                  <!-- is_draft -->
                  <aInput
                    :label="$t('Hide on feed').toString()"
                    v-model="tale.is_draft"
                    type="checkbox"
                    :flagLabelFirst="false"
                    :modeEdit="dConf.modeEdit" />
                </div>
                <div class="mb-3">
                  <!-- is_for_registered -->
                  <aInput
                    :label="$t('Only for registered users').toString()"
                    v-model="tale.is_for_registered"
                    type="checkbox"
                    :flagLabelFirst="false"
                    :modeEdit="dConf.modeEdit" />
                </div>

                <!-- seo_index -->
                <div class="mb-3">
                  <aInput
                    v-model="tale.seo_index"
                    :label="$t(' SEO Index')"
                    :placeholder="$t('SEO Index')"
                    :modeEdit="dConf.modeEdit" />
                </div>
              </div>
            </div>
          </b-collapse>
          <!-- endregion TALE VIEW SETTINGS -->

          <!-- region ALIAS -->
          <b-collapse
            v-if="CU.isAdmin() || CU.isModerator() || CU.isPrivileged()"
            :id="`tale-alias-${tale.id}`"
            :model-value="expandedEditBlock === 'alias'"
            class="mt-3">
            <div>
              {{ taleUrl }}
            </div>

            <aInput
              v-model="tale.router_alias"
              :label="$t('Page Alias').toString()"
              :placeholder="$t('Page Alias').toString()"
              :modeEdit="dConf.modeEdit"
              componentDisplay="block" />
          </b-collapse>
          <!-- endregion ALIAS -->

          <!-- region iframe -->
          <b-collapse
            v-if="CU.isAdmin() || CU.isModerator() || CU.isPrivileged()"
            :id="`tale-iframe-${tale.id}`"
            :model-value="expandedEditBlock === 'iframe'"
            class="mt-3">
            <aInput
              v-model="tale.iframe"
              :src="tale.iframe"
              :label="$t('iframe')"
              :placeholder="$t('iframe').toString()"
              :modeEdit="dConf.modeEdit"
              componentDisplay="block" />

            <div
              v-if="tale.iframe"
              class="mt-3 mb-3">
              <iframe
                :src="tale.iframe"
                frameborder="1"
                width="98%"
                height="300px"></iframe>
            </div>
          </b-collapse>
          <!-- endregion iframe -->

          <!-- region BODY FREE -->
          <b-collapse
            v-if="CU.isAdmin()"
            :id="`tale-body-free-${tale.id}`"
            :model-value="expandedEditBlock === 'body-free'"
            class="mt-3">
            <div class="input-group input-group mb-3">
              <!-- body_free -->
              <span class="input-group-text bg-dark text-light">{{
                $t("body_free")
              }}</span>
              <textarea
                class="form-control"
                :placeholder="$t('body_free').toString()"
                v-model="tale.body_free"
                rows="20"></textarea>
            </div>
            <div class="mt-3 mb-3">
              <div v-html="tale.body_free"></div>
            </div>
          </b-collapse>
          <!-- endregion BODY FREE -->
          </div>
        </div>
        <!-- endregion EDIT -->

        <!-- # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #  -->

        <!-- region Yandex Map-->
        <div
          class="row g-0 mx-1 ps-2"
          :style="
            dConf.modeEdit
              ? { marginTop: '50px', marginBottom: '50px' }
              : null
          ">
          <div class="col">
            <AlinaYandexMap
              :item="tale"
              :mode-edit="dConf.modeEdit"></AlinaYandexMap>
          </div>
        </div>
        <!-- endregion Yandex Map-->

        <!--##################################################-->

        <!-- region FILES -->
        <div class="mt-3 mb-3">
          <AlinaFileUploader
            ref="fileUploader"
            :entity_id="tale.id"
            entity_table="tale"
            :owner_id="tale.owner_id"
            :modeEdit="dConf.modeEdit"
            :ownLength="tale.count_files"
            :expanded="taleUiState.filesExpanded"
            @update:expanded="handleFilesExpandedChanged" />
        </div>
        <!-- endregion FILES -->

        <!--##################################################-->
        <div class="mt-2">&nbsp;</div>
        <!--##################################################-->

        <!-- region Share & Likes-->
        <div
          class="row g-0 ps-1 pe-1"
          v-if="tale.is_social_sharing_hidden != 1">
          <div class="col">
            <div class="text-start m-buttons-1">
              <Share :tale="tale"></Share>
            </div>
          </div>
          <div class="col-auto">
            <div class="text-end">
              <Like
                v-if="tale.is_comment_denied != 1"
                :pAmountLikes="tale.count_like"
                :pCurrentUserLiked="tale.current_user_liked"
                :pAmountDislikes="tale.count_dislike"
                :pCurrentUserDisliked="tale.current_user_disliked"
                ref_table="tale"
                :ref_id="tale.id"></Like>
            </div>
          </div>
        </div>
        <!-- endregion Share & Likes-->

        <!--##################################################-->
        <div class="mt-2">&nbsp;</div>
        <!--##################################################-->

        <!-- region COMMENTS -->
        <div
          v-if="tale.is_comment_denied != 1"
          class="mb-5">
          <Comment
            ref="comments"
            v-if="tale.level < 2"
            :level="tale.level + 1"
            type="COMMENT"
            :root_tale_id="tale.root_tale_id ? tale.root_tale_id : tale.id"
            :answer_to_tale_id="tale.id"
            :count_by_answer_to_tale_id="tale.count_root_tale_id"
            :root_tale_object="tale"
            :expanded-collapse-ids="taleUiState.commentsExpanded"
            @expanded-changed="handleCommentExpandedChanged"></Comment>
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
import {consumeChatTaleDraft} from "@/services/ChatTaleDraft.js";
import {
  createTaleSessionKey,
  markFeedDataStale,
  readSessionState,
  writeSessionState,
} from "@/services/FeedSessionState";
//#####
export default {
  name: "tale_upsert",
  emits: ["deleted", "taleChanged", "modeEditChanged"],
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
      expandedEditBlock: null,
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
        owner_id: -1,
        count_like: "",
        current_user_liked: "",
        count_dislike: "",
        current_user_disliked: "",
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
        geo_zoom: "4",
        geo_is_map_shown: "0",
        count_files: 0,
      },
      storage: {
        keyTaleLastTouched: "keyTaleLastTouched",
      },
      taleUiState: {
        filesExpanded: false,
        commentsExpanded: [],
        scrollPosition: 0,
      },
      hasBeenActivated: false,
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
    this.restoreTaleUiState(this.pTale?.id ?? this.routerTaleId);
    const id = this.routerTaleId;
    this.ajaxGetTale(id);
  },

  mounted() {
    if (!this.pFlagInFeed) {
      window.addEventListener("pagehide", this.handlePageHide);
    }
  },

  activated() {
    if (!this.pFlagInFeed) {
      if (
        this.$route.path === "/tale/upsert"
        && this.tale.id
        && this.tale.is_submitted == 1
      ) {
        this.startNewTale();
      } else if (this.hasBeenActivated) {
        this.refreshExpandedLocalData();
      }
      this.hasBeenActivated = true;
      this.restoreScrollPosition();
    }
  },

  beforeRouteLeave(to, from) {
    if (!this.pFlagInFeed) {
      this.taleUiState.scrollPosition = window.scrollY;
      this.saveTaleUiState();
    }
  },

  beforeUnmount() {
    if (!this.pFlagInFeed) {
      window.removeEventListener("pagehide", this.handlePageHide);
      this.taleUiState.scrollPosition = window.scrollY;
    }
    this.saveTaleUiState();
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
    "dConf.modeEdit"(newVal) {
      this.$emit("modeEditChanged", {
        taleId: this.tale.id,
        modeEdit: newVal,
      });
    },

    "tale.id": function (valNew, valOld) {
      if (this.tale.is_submitted === 1) {
        this.dConf.modeEdit = false;
      }
    },

    tale: {
      handler(newVal, oldVal) {
        if (this.dConf.modeEdit) {
          this.taleLastTouchedRemember(newVal);
          this.$emit("taleChanged", newVal);
        }
      },
      deep: true,
    },

    routerTaleId: function (valNew, valOld) {
      if (this.pFlagInFeed || !this.$route.path.startsWith("/tale/upsert")) {
        return;
      }

      this.saveTaleUiState(valOld);
      this.restoreTaleUiState(valNew);
      if (valNew) {
        this.ajaxGetTale(valNew);
      } else {
        this.startNewTale();
      }
    },
  },

  methods: {
    toggleEditBlock(blockName) {
      this.expandedEditBlock =
        this.expandedEditBlock === blockName ? null : blockName;
    },

    handlePageHide() {
      this.taleUiState.scrollPosition = window.scrollY;
      this.saveTaleUiState();
    },

    startNewTale() {
      this.tale = {
        id: null,
        is_submitted: 0,
      };
      this.dConf.modeEdit = false;
      this.restoreTaleUiState(null);
      this.ajaxGetTale(null);
    },

    refreshExpandedLocalData() {
      if (this.taleUiState.filesExpanded) {
        this.$refs.fileUploader?.loadFileList();
      }
      this.$refs.comments?.refreshExpanded();
    },

    taleStateId() {
      return this.pTale?.id ?? this.routerTaleId ?? this.tale.id;
    },

    saveTaleUiState(taleId = this.taleStateId()) {
      if (!taleId) {
        return;
      }

      writeSessionState(
        sessionStorage,
        createTaleSessionKey(taleId),
        this.taleUiState,
      );
    },

    restoreTaleUiState(taleId = this.taleStateId()) {
      const saved = taleId
        ? readSessionState(sessionStorage, createTaleSessionKey(taleId))
        : null;

      this.taleUiState = {
        filesExpanded: saved?.filesExpanded === true,
        commentsExpanded: Array.isArray(saved?.commentsExpanded)
          ? saved.commentsExpanded
          : [],
        scrollPosition: Number(saved?.scrollPosition) || 0,
      };
    },

    restoreScrollPosition() {
      this.$nextTick(() => {
        window.scrollTo({
          left: 0,
          top: this.taleUiState.scrollPosition,
          behavior: "auto",
        });
      });
    },

    handleFilesExpandedChanged(expanded) {
      this.taleUiState.filesExpanded = expanded;
      this.saveTaleUiState();
    },

    handleCommentExpandedChanged({collapseId, expanded}) {
      const expandedIds = this.taleUiState.commentsExpanded;
      const index = expandedIds.indexOf(collapseId);

      if (expanded && index === -1) {
        expandedIds.push(collapseId);
      } else if (!expanded && index !== -1) {
        expandedIds.splice(index, 1);
      }

      this.saveTaleUiState();
    },

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
      this.tale.is_submitted = 1;
      AjaxAlina.newInst({
        method: "POST",
        url: this.dConf.url,
        postParams: this.tale,
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            Object.assign(this.tale, aja.respBody.data);
            this.dConf.modeEdit = false;
            this.taleLastTouchedRemember({});
            markFeedDataStale(sessionStorage);
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
            _t.restoreScrollPosition();
            if (_t.tale.is_submitted == 0) {
              if (_t.CU.ownsOrAdminOrModerator(_t.tale.owner_id)) {
                _t.dConf.modeEdit = true;
                _t.taleLastTouchedRecall();
                const chatDraft = consumeChatTaleDraft(sessionStorage);
                if (chatDraft) {
                  _t.tale.header = chatDraft.header;
                  _t.tale.body = chatDraft.body;
                  _t.taleLastTouchedRemember(_t.tale);
                }
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
            markFeedDataStale(sessionStorage);
            _t.tale = {};
            _t.$emit("deleted");

            if (!_t.$route.path.includes("tale/feed")) {
              _t.$router.replace({ path: `/tale/feed` });
            }
          }
        },
      }).go();
    }, // endregion CRUD
    // ##################################################
  },
};
</script>

<style scoped>
.alina-tale-date {
  position: absolute;
  right: 1%;
  bottom: 0;
  z-index: 1;
  transform: translateY(50%);
}

.alina-tale-date-link {
  display: inline-block;
  padding: 2px !important;
  font-size: min(2vmin, .8rem);
  line-height: 1.2;
}

.alina-tale-wrapper {
  width: 100%;
  max-width: 1000px;
  margin-inline: auto;
}

.edit-section-button-active {
  background-color: #0b3d91 !important;
  outline-color: #0b3d91 !important;
}
</style>
