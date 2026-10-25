<template>
  <div
    :style="dConf.style"
    class="">
    <div class="mb-2">
      <b-button
        v-b-toggle="`comment-collapse-${answer_to_tale_id}`"
        :class="[
          'comment-collapse-toggle',
          {
            'btn-md btn-a': level == 1,
            'btn-sm btn-a': level > 1,
          },
        ]">{{ $t("COUNTER_COMMENTS", commentsTotal) }}
      </b-button>
    </div>
    <b-collapse
      :id="`comment-collapse-${answer_to_tale_id}`"
      :model-value="isExpanded"
      @update:model-value="onExpandedChanged"
      @show="onExpandCommentList(`comment-collapse-${answer_to_tale_id}`)"
      @shown="pageRecalcIframeHeight"
      @hidden="pageRecalcIframeHeight"
      :visible="level == 3">
      <!--##################################################-->
      <!--region SUBMITTED COMMENTS-->
      <div
        v-for="tale in displayedFeed"
        :key="tale.id"
        class=""
        :data-id="tale.id"
        :data-to="tale.answer_to_tale_id"
        :data-root="root_tale_id">
        <div
          class="single-comment mt-5"
          :class="{
            highlight: $route.query.highlight == tale.id,
            'pinned-comment': Number(tale.is_sticked) === 1,
          }">
          <!--##################################################-->
          <!--region User Info-->

          <UserAvatar
            :userId="tale.owner_id"
            :userFirstName="tale.owner_firstname"
            :userLastName="tale.owner_lastname"
            :emblemUrl="tale.owner_emblem"
            emblemWidth="min(50px, 5vmax)"
            :someDate="tale.publish_at"
            :isComment="true"></UserAvatar>
          <!--endregion User Info-->
          <!--##################################################-->
          <!--region Comment body          -->
          <div class="mt-1">&nbsp;</div>
          <div
            class="row g-0"
            v-if="!state.feedsInEdit.includes(tale.id)">
            <div class="col">
              <div class="mt-1 mb-3">
                <BorgEditor
                  :modeEdit="false"
                  v-model="tale.body" />
              </div>
            </div>
          </div>
          <!--################################################## -->
          <div
            v-else
            class="row g-0">
            <div class="col">
              <BorgEditor
                v-model="tale.body"
                @ready="pageRecalcIframeHeight()" />
            </div>
          </div>
          <div class="mt-3">&nbsp;</div>
          <!--endregion Comment body          -->
          <!--##################################################-->
          <!--region Buttons, Likes-->
          <div class="row g-0 m-buttons-1">
            <!--region Buttons EDIT CANCEL SUBMIT-->
            <div class="col">
              <div
                class="d-flex"
                style="gap: 3mm;"
                v-if="CU.ownsOrAdminOrModerator(tale.owner_id) || canPinComments">
                <template v-if="CU.ownsOrAdminOrModerator(tale.owner_id)">
                  <button
                    @click="ajaDeleteComment(tale)"
                    class="btn btn-sm btn-a">
                    {{ $t("i_delete") }}
                  </button>
                  <button
                    @click="toggleCommentEditMode(tale)"
                    v-if="!state.feedsInEdit.includes(tale.id)"
                    class="btn btn-sm btn-a">
                    {{ $t("i_edit") }}
                  </button>
                  <button
                    @click="commentCancelEdit(tale)"
                    v-if="state.feedsInEdit.includes(tale.id)"
                    class="btn btn-sm btn-a">
                    {{ $t("i_undo") }}
                  </button>
                  <button
                    @click="ajaCommentSave(tale)"
                    v-if="state.feedsInEdit.includes(tale.id)"
                    class="btn btn-sm btn-a">
                    {{ $t("i_ok") }}
                  </button>
                </template>
                <button
                  v-if="canPinComments"
                  type="button"
                  class="btn btn-sm btn-a"
                  :title="$t(Number(tale.is_sticked) === 1 ? 'Unpin comment' : 'Pin comment')"
                  :aria-label="$t(Number(tale.is_sticked) === 1 ? 'Unpin comment' : 'Pin comment')"
                  @click="ajaSetCommentPinned(tale, Number(tale.is_sticked) === 1 ? 0 : 1)">
                  {{ Number(tale.is_sticked) === 1 ? $t("i_unpin") : $t("i_pin") }}
                </button>
              </div>
            </div>
            <!--endregion Buttons EDIT CANCEL SUBMIT-->
            <!--region Likes-->
            <div class="col">
              <div class="text-end">
                <Like
                  :pAmountLikes="tale.count_like"
                  :pCurrentUserLiked="tale.current_user_liked"
                  :pAmountDislikes="tale.count_dislike"
                  :pCurrentUserDisliked="tale.current_user_disliked"
                  ref_table="tale"
                  :ref_id="tale.id"></Like>
              </div>
            </div>
            <!--endregion Likes-->
          </div>
          <!--endregion Buttons, Likes-->
          <!--##################################################-->
        </div>
        <div class="mt-2">&nbsp;</div>
        <Comment
          v-if="tale.level < 2"
          :level="tale.level + 1"
          type="COMMENT"
          :root_tale_id="tale.root_tale_id"
          :answer_to_tale_id="tale.id"
          :count_by_answer_to_tale_id="tale.count_answer_to_tale_id"
          :root_tale_object="root_tale_object"
          :expanded-collapse-ids="expandedCollapseIds"
          @expanded-changed="$emit('expandedChanged', $event)"></Comment>
      </div>
      <Paginator
        :pageCurrentNumber="parseInt(feedPagination.pageCurrentNumber)"
        :pageSize="parseInt(feedPagination.pageSize)"
        :rowsTotal="parseInt(feedPagination.rowsTotal)"
        :pagesTotal="parseInt(feedPagination.pagesTotal)"
        :onClickPage="pageChange"
        :onClickMore="onClickMore"
        :onClickAll="onClickAll"></Paginator>
      <!--endregion SUBMITTED COMMENTS-->
      <!--##################################################-->
      <!--region NEW COMMENT-->
      <div v-if="flagNewCommentAvailable()">
        <!--##################################################-->
        <!--region User Info-->

        <!--endregion User Info-->
        <!--##################################################-->
        <!--region EDITOR-->
        <div class="mt-5">&nbsp;</div>
        <div :class="['alina-comment-editor', { 'mt-5': level == 1 }]">
          <BorgEditor
            v-model="body"
            @ready="pageRecalcIframeHeight()" />
          <div class="row g-0">
            <div class="col">
              <button
                @click="
                  () => {
                    this.body = '';
                  }
                "
                class="btn btn-sm btn-a">
                {{ $t("i_clear") }}
              </button>
            </div>
            <div class="col">
              <button
                @click="ajaCommentAdd"
                type="button"
                class="btn btn-lg w-100 btn-a">
                {{ $t("i_ok") }}
              </button>
            </div>
          </div>
        </div>
        <!--endregion EDITOR-->
      </div>
      <!--endregion NEW COMMENT-->
      <!--##################################################-->
      <div
        v-if="root_tale_object.is_comment_for_owner == 1"
        class="m-3">
        {{ $t("Comments only for owner") }}
      </div>
      <!--##################################################-->
      <!--region Login or Register-->

      <div
        v-if="!CU.isLoggedIn()"
        class="col mt-5">
        <a
          href="#/auth/login"
          class="btn btn-sm btn-primary"
          target="_top">{{ $t("IMP_LOGIN") }}
        </a>
        {{ $t("i_ok") }}
        <a
          href="#/auth/register"
          class="btn btn-sm btn-primary"
          target="_top">{{ $t("IMP_REGISTER") }}
        </a>
        {{ $t("to post comments") }}
      </div>
      <!--endregion Login or Register-->
      <!--##################################################-->
    </b-collapse>
  </div>
</template>

<script>
import UtilsStr from "@/Utils/UtilsStr.js";
import AjaxAlina from "@/services/AjaxAlina";
import ConfigApi from "@/configs/ConfigApi";
import UtilsArray from "@/Utils/UtilsArray";
import Like from "@/components/elements/form/Like";
import Paginator from "@/components/elements/form/Paginator";
import CurrentUser from "@/services/CurrentUser";
import AlinaStorage from "@/services/AlinaStorage";
import UserAvatar from "@/components/UserAvatar.vue";
import AlinaPageGlobalAnalyzer from "@/services/AlinaPageGlobalAnalyzer";
import BorgEditor from "@/components/BorgEditor";

export default {
  name: "Comment",
  components: {
    UserAvatar,
    Paginator,
    Like,
    BorgEditor,
  },
  data() {
    return {
      AlinaStorage,
      ConfigApi,
      CU: CurrentUser.obj(),
      dConf: {
        urlFeed: `${ConfigApi.url_base}/tale/feed`,
        urlTaleUpsert: `${ConfigApi.url_base}/tale/upsert`,
        urlCommentDel: `${ConfigApi.url_base}/tale/delete`,
        urlCommentStick: `${ConfigApi.url_base}/tale/StickComment`,
        style: {
          padding: "0",
          margin: "0",
          "margin-left": this.level == 1 ? "0" : "min(5%, 100px)",
          "border-left":
            this.level == 1 ? "#A9ABAD solid 2px" : "#A9ABAD solid 1px",
          /**/
          //"max-width":    this.level == 1 ? '95vw' : '85vw',
          //"max-width":    '80%',
        },
        styleComment: {},
      },
      state: {
        feedsInEdit: [],
      },
      body: "",
      feed: [],
      pinnedComment: null,
      feedPagination: {
        pageCurrentNumber: "last",
        pageSize: this.level == 1 ? 10 : 10,
        rowsTotal: 0,
        pagesTotal: 0,
      },
    };
  },
  emits: ["bv::toggle::collapse", "expandedChanged"],
  props: {
    root_tale_object: {
      type: Object,
      default: null,
    },
    level: {
      type: Number,
      default: 1,
    },
    type: {
      type: String,
      default: "COMMENT",
    },
    root_tale_id: {
      type: Number,
      default: null,
    },
    answer_to_tale_id: {
      type: Number,
      default: null,
    },
    count_by_answer_to_tale_id: {
      type: Number,
      default: 0,
    },
    expandedCollapseIds: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.processQuery();
    this.pageRecalcIframeHeight();
  },
  updated() {
    this.processQuery();
    this.pageRecalcIframeHeight();
  },
  methods: {
    refreshExpanded() {
      if (this.isExpanded) {
        this.ajaGetComments();
      }
    },

    onExpandedChanged(expanded) {
      if (expanded) {
        UtilsArray.pushIfNotAlready(
          this.AlinaStorage.Comment.expanded,
          this.collapseId,
        );
      } else {
        UtilsArray.elRemoveByValue(
          this.AlinaStorage.Comment.expanded,
          this.collapseId,
        );
      }

      this.$emit("expandedChanged", {
        collapseId: this.collapseId,
        expanded,
      });
    },

    ajaGetComments(more = false) {
      // #####
      const q = this.$route.query;
      let GET = {};
      if (q.expand && q.expand != this.answer_to_tale_id) {
        if (this.level == 1) {
          GET.expand = q.expand;
        }
      }
      // #####
      AjaxAlina.newInst({
        method: "GET",
        getParams: GET,
        url: `${this.dConf.urlFeed}/${this.feedPagination.pageSize}/${this.feedPagination.pageCurrentNumber}/${this.answer_to_tale_id}`,
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            if (more) {
              UtilsArray.vueSensitiveConcat(this.feed, aja.respBody.data.tale);
            } else {
              this.feed = [];
              this.feed = aja.respBody.data.tale;
            }
            this.pinnedComment =
              this.level == 1
                ? (aja.respBody.meta.pinned_comment ?? null)
                : null;
            this.feedPagination = aja.respBody.meta.tale;
          }
          this.pageRecalcIframeHeight();
        },
      }).go();
    },
    ajaCommentAdd(event) {
      if (UtilsStr.stripHTML(this.body) === "") {
        return;
      }

      const _t = this;
      AjaxAlina.newInst({
        method: "POST",
        url: this.dConf.urlTaleUpsert,
        enctype: "application/json",
        postParams: {
          level: this.level,
          root_tale_id: this.root_tale_id,
          answer_to_tale_id: this.answer_to_tale_id,
          type: this.type,
          body: this.body,
          form_id: "actionCommentAdd",
        },
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            _t.feed.push(aja.respBody.data);
            ++_t.feedPagination.rowsTotal;
            this.body = "";
          }
          this.pageRecalcIframeHeight();
        },
      }).go();
    },
    pageChange(pageSize, pageCurrentNumber) {
      this.feedPagination.pageSize = pageSize;
      this.feedPagination.pageCurrentNumber = pageCurrentNumber;
      this.ajaGetComments();
    },
    onClickMore(pageSize, pageCurrentNumber) {
      this.feedPagination.pageSize = pageSize;
      this.feedPagination.pageCurrentNumber = pageCurrentNumber;
      this.ajaGetComments(true);
    },
    onClickAll(pageSize, pageCurrentNumber) {
      this.feedPagination.pageSize = pageSize;
      this.feedPagination.pageCurrentNumber = pageCurrentNumber;
      this.ajaGetComments(false);
    },
    toggleCommentEditMode(comment) {
      if (!this.state.feedsInEdit.includes(comment.id)) {
        comment.bodyPrevious = comment.body;
        this.state.feedsInEdit.push(comment.id);
      } else {
        UtilsArray.elRemoveByValue(this.state.feedsInEdit, comment.id);
      }
    },

    ajaCommentSave(comment) {
      if (UtilsStr.stripHTML(comment.body) === "") {
        return;
      }

      const _t = this;
      comment.form_id = "actionUpsert";
      AjaxAlina.newInst({
        method: "POST",
        url: `${this.dConf.urlTaleUpsert}/${comment.id}`,
        postParams: comment,
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            this.toggleCommentEditMode(comment);
          }
          this.pageRecalcIframeHeight();
        },
      }).go();
    },
    commentCancelEdit(comment) {
      comment.body = comment.bodyPrevious;
      this.toggleCommentEditMode(comment);
    },
    ajaDeleteComment(comment) {
      if (!confirm("Are you sure?")) {
        return;
      }
      comment.form_id = "actionDelete";
      AjaxAlina.newInst({
        method: "POST",
        url: `${this.dConf.urlCommentDel}/${comment.id}`,
        postParams: comment,
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            this.ajaGetComments();
          }
          this.pageRecalcIframeHeight();
        },
      }).go();
    },
    ajaSetCommentPinned(comment, isSticked) {
      AjaxAlina.newInst({
        method: "POST",
        url: `${this.dConf.urlCommentStick}/${comment.id}`,
        postParams: {
          is_sticked: Number(isSticked) === 1 ? 1 : 0,
          form_id: "actionStickComment",
        },
        onDone: () => {
          this.ajaGetComments();
          this.pageRecalcIframeHeight();
        },
      }).go();
    },
    onExpandCommentList(collapseId) {
      UtilsArray.pushIfNotAlready(
        this.AlinaStorage.Comment.expanded,
        collapseId
      );
      this.ajaGetComments();
    },
    processQuery() {
      const q = this.$route.query;
      let idRoot = null;
      let idAnsw = null;
      if (q.expand) {
        idRoot = `comment-collapse-${this.root_tale_id}`;
        if (!this.AlinaStorage.Comment.expanded.includes(idRoot)) {
          this.$root.$emit("bv::toggle::collapse", idRoot);
        }
        //#####
        this.displayedFeed.forEach((e) => {
          if (e.id == q.expand) {
            idAnsw = `comment-collapse-${q.expand}`;
            if (!this.AlinaStorage.Comment.expanded.includes(idAnsw)) {
              this.$root.$emit("bv::toggle::collapse", idAnsw);
            }
          }
        });
      }
    },
    pageRecalcIframeHeight() {
      const iframeClassName = `AlinaIframe-tale-${this.root_tale_id}`;
      const heightRefClassName = `alina-tale-id-${this.root_tale_id}`;
      AlinaPageGlobalAnalyzer.pageRecalcIframeHeight(
        iframeClassName,
        heightRefClassName
      );
    },
    flagNewCommentAvailable() {
      if (!this.CU.isLoggedIn()) {
        return false;
      }
      if (
        !this.isExpanded
      ) {
        return false;
      }
      if (this.CU.ownsOrAdminOrModerator(this.root_tale_object.owner_id)) {
        return true;
      }
      if (this.root_tale_object?.is_comment_for_owner == 1) {
        return false;
      }
      if (this.root_tale_object?.is_comment_denied == 0) {
        return true;
      }
      return false;
    },
  },
  watch: {
    // $route(to, from) {
    //   const q = this.$route.query;
    //   if (UtilsData.empty(q.expand)) {
    //     this.feedPagination.pageCurrentNumber = 'last';
    //   }
    //   this.ajaGetComments();
    // },
  },
  computed: {
    displayedFeed() {
      if (!this.pinnedComment) {
        return this.feed;
      }

      return [
        this.pinnedComment,
        ...this.feed.filter((comment) => comment.id != this.pinnedComment.id),
      ];
    },
    canPinComments() {
      return (
        this.level == 1 &&
        this.CU.ownsOrAdminOrModerator(this.root_tale_object?.owner_id)
      );
    },
    collapseId() {
      return `comment-collapse-${this.answer_to_tale_id}`;
    },
    isExpanded() {
      return this.level == 3 || this.expandedCollapseIds.includes(this.collapseId);
    },
    // a computed getter
    commentsTotal: function () {
      let res = 0;
      if (this.feedPagination.rowsTotal) {
        res =
          Number(this.feedPagination.rowsTotal) +
          (this.pinnedComment ? 1 : 0);
      }
      if (this.count_by_answer_to_tale_id) {
        res = this.count_by_answer_to_tale_id;
      }
      return res;
    },
  },
};
</script>

<style scoped lang="scss">
.comment-collapse-toggle {
  outline: none !important;
  border: .5px solid #777 !important;
  border-left: 0 !important;
  border-radius: 0 4px 4px 0 !important;
}

.single-comment {
  background-color: #222;
  border-radius: 5%;
  padding: 10px 2px;
}

.pinned-comment {
  background-color: #120133;
}

.highlight {
  background-color: #ffb200;
  color: black;
}
</style>
