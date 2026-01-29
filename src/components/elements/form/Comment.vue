<template>
  <div
    :style="options.style"
    class=""
  >
    <div class="mb-2">
      <b-button
        v-b-toggle="`comment-collapse-${answer_to_tale_id}`"
        :class="{
          'btn-md': level == 1,
          'btn-sm': level > 1,
        }"
        class="bg-black"
        >{{ $tc("COUNTER_COMMENTS", commentsTotal) }}
      </b-button>
    </div>
    <b-collapse
      :id="`comment-collapse-${answer_to_tale_id}`"
      @show="onExpandCommentList(`comment-collapse-${answer_to_tale_id}`)"
      @shown="pageRecalcIframeHeight"
      @hidden="pageRecalcIframeHeight"
      :visible="level == 3"
      class=""
    >
      <!--##################################################-->
      <!--region SUBMITTED COMMENTS-->
      <div
        v-for="(tale, feedIndex) in feed"
        :key="tale.id"
        class=""
        :data-id="tale.id"
        :data-to="tale.answer_to_tale_id"
        :data-root="root_tale_id"
        :data-index="feedIndex"
      >
        <div
          class="single-comment mt-5"
          :class="{
            highlight: $route.query.highlight == tale.id,
          }"
        >
          <!--##################################################-->
          <!--region User Info-->

          <UserAvatar
            :userId="tale.owner_id"
            :userFirstName="tale.owner_firstname"
            :userLastName="tale.owner_lastname"
            :emblemUrl="tale.owner_emblem"
            emblemWidth="min(50px, 5vmax)"
            :someDate="tale.publish_at"
            :isComment="true"
            class=""
          ></UserAvatar>
          <!--endregion User Info-->
          <!--##################################################-->
          <!--region Comment body          -->
          <div
            class="row no-gutters"
            v-if="!state.feedsInEdit.includes(tale.id)"
          >
            <div class="col">
              <div class="mt-1 mb-3">
                <BorgEditor
                  :modeEdit="false"
                  v-model="tale.body"
                />
              </div>
            </div>
          </div>
          <!--################################################## -->
          <div
            v-else
            class="row no-gutters"
          >
            <div class="col">
              <BorgEditor
                v-model="tale.body"
                @ready="pageRecalcIframeHeight()"
              />
            </div>
          </div>
          <!--endregion Comment body          -->
          <!--##################################################-->
          <!--region Buttons, Likes-->
          <div class="row no-gutters m-buttons-1">
            <!--region Buttons EDIT CANCEL SUBMIT-->
            <div class="col">
              <span
                class=""
                v-if="CU.ownsOrAdminOrModerator(tale.owner_id)"
              >
                <button
                  @click="ajaDeleteComment(feed[feedIndex], feedIndex)"
                  class="btn btn-sm btn-danger"
                >
                  {{ $t("TXT_DELETE") }}
                </button>
                <button
                  @click="toggleCommentEditMode(feed[feedIndex], feedIndex)"
                  v-if="!state.feedsInEdit.includes(tale.id)"
                  class="btn btn-sm btn-secondary"
                >
                  {{ $t("TXT_EDIT") }}
                </button>
                <button
                  @click="commentCancelEdit(feed[feedIndex], feedIndex)"
                  v-if="state.feedsInEdit.includes(tale.id)"
                  class="btn btn-sm btn-secondary"
                >
                  {{ $t("TXT_CANCEL") }}
                </button>
                <button
                  @click="ajaCommentSave(feed[feedIndex], feedIndex)"
                  v-if="state.feedsInEdit.includes(tale.id)"
                  class="btn btn-sm btn-secondary"
                >
                  {{ $t("TXT_SUBMIT") }}
                </button>
              </span>
            </div>
            <!--endregion Buttons EDIT CANCEL SUBMIT-->
            <!--region Likes-->
            <div class="col">
              <div class="text-right">
                <Like
                  :pAmountLikes="tale.count_like"
                  :pCurrentUserLiked="tale.current_user_liked"
                  ref_table="tale"
                  :ref_id="tale.id"
                ></Like>
              </div>
            </div>
            <!--endregion Likes-->
          </div>
          <!--endregion Buttons, Likes-->
          <!--##################################################-->
        </div>
        <Comment
          v-if="tale.level < 2"
          :level="tale.level + 1"
          type="COMMENT"
          :root_tale_id="tale.root_tale_id"
          :answer_to_tale_id="tale.id"
          :count_by_answer_to_tale_id="tale.count_answer_to_tale_id"
          :root_tale_object="root_tale_object"
        ></Comment>
      </div>
      <Paginator
        :pageCurrentNumber="parseInt(feedPagination.pageCurrentNumber)"
        :pageSize="parseInt(feedPagination.pageSize)"
        :rowsTotal="parseInt(feedPagination.rowsTotal)"
        :pagesTotal="parseInt(feedPagination.pagesTotal)"
        :onClickPage="pageChange"
        :onClickMore="onClickMore"
        :onClickAll="onClickAll"
      ></Paginator>
      <!--endregion SUBMITTED COMMENTS-->
      <!--##################################################-->
      <!--region NEW COMMENT-->
      <div v-if="flagNewCommentAvailable()">
        <!--##################################################-->
        <!--region User Info-->

        <!--endregion User Info-->
        <!--##################################################-->
        <!--region EDITOR-->
        <div class="row no-gutters mt-5">
          <div class="col">
            <BorgEditor
              v-model="body"
              @ready="pageRecalcIframeHeight()"
            />
            <div class="row no-gutters">
              <div class="col">
                <button
                  @click="
                    () => {
                      this.body = '';
                    }
                  "
                  class="btn btn-sm btn-danger"
                >
                  {{ $t("TXT_CLEAR") }}
                </button>
              </div>
              <div class="col">
                <button
                  @click="ajaCommentAdd"
                  type="button"
                  class="col btn btn-sm btn-secondary"
                >
                  {{ $t("TXT_SUBMIT") }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <!--endregion EDITOR-->
      </div>
      <!--endregion NEW COMMENT-->
      <!--##################################################-->
      <div
        v-if="root_tale_object.is_comment_for_owner == 1"
        class="m-3"
      >
        {{ $tc("Comments only for owner") }}
      </div>
      <!--##################################################-->
      <!--region Login or Register-->
      <div class="m-3">&nbsp;</div>
      <div
        v-if="!CU.isLoggedIn()"
        class="col"
      >
        <a
          href="#/auth/login"
          class="btn btn-sm btn-primary"
          target="_top"
          >{{ $t("IMP_LOGIN") }}
        </a>
        {{ $t("or") }}
        <a
          href="#/auth/register"
          class="btn btn-sm btn-primary"
          target="_top"
          >{{ $t("IMP_REGISTER") }}
        </a>
        {{ $t("to post comments") }}
      </div>
      <!--endregion Login or Register-->
      <!--##################################################-->
    </b-collapse>
  </div>
</template>

<script>
import UtilsStr from "@/Utils/UtilsStr";
import AjaxAlina from "@/services/AjaxAlina";
import ConfigApi from "@/configs/ConfigApi";
import UtilsArray from "@/Utils/UtilsArray";
import Comment from "@/components/elements/form/Comment";
import Like from "@/components/elements/form/Like";
import Paginator from "@/components/elements/form/Paginator";
import CurrentUser from "@/services/CurrentUser";
import AlinaStorage from "@/services/AlinaStorage";
import UserAvatar from "@/components/UserAvatar";
import AlinaPageGlobalAnalyzer from "@/services/AlinaPageGlobalAnalyzer";
import BorgEditor from "@/components/BorgEditor";

export default {
  name: "Comment",
  components: {
    UserAvatar,
    Paginator,
    Like,
    Comment,
    BorgEditor,
  },
  data() {
    return {
      UtilsStr,
      AlinaStorage,
      ConfigApi,
      CU: CurrentUser.obj(),
      options: {
        urlFeed: `${ConfigApi.url_base}/tale/feed`,
        urlTaleUpsert: `${ConfigApi.url_base}/tale/upsert`,
        urlCommentDel: `${ConfigApi.url_base}/tale/delete`,
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
      feedPagination: {
        pageCurrentNumber: "last",
        pageSize: this.level == 1 ? 10 : 10,
        rowsTotal: 0,
        pagesTotal: 0,
      },
    };
  },
  emits: ["bv::toggle::collapse"],
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
        url: `${this.options.urlFeed}/${this.feedPagination.pageSize}/${this.feedPagination.pageCurrentNumber}/${this.answer_to_tale_id}`,
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            if (more) {
              UtilsArray.vueSensitiveConcat(this.feed, aja.respBody.data.tale);
            } else {
              this.feed = [];
              this.feed = aja.respBody.data.tale;
            }
            this.feedPagination = aja.respBody.meta.tale;
          }
          this.pageRecalcIframeHeight();
        },
      }).go();
    },
    ajaCommentAdd(event) {
      const _t = this;
      AjaxAlina.newInst({
        method: "POST",
        url: this.options.urlTaleUpsert,
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
    toggleCommentEditMode(comment, feedIndex) {
      if (!this.state.feedsInEdit.includes(comment.id)) {
        comment.bodyPrevious = comment.body;
        this.state.feedsInEdit.push(comment.id);
      } else {
        UtilsArray.elRemoveByValue(this.state.feedsInEdit, comment.id);
      }
    },
    ajaCommentSave(comment, feedIndex) {
      const _t = this;
      comment.form_id = "actionUpsert";
      AjaxAlina.newInst({
        method: "POST",
        url: `${this.options.urlTaleUpsert}/${comment.id}`,
        postParams: comment,
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            this.toggleCommentEditMode(comment, feedIndex);
          }
          this.pageRecalcIframeHeight();
        },
      }).go();
    },
    commentCancelEdit(comment, feedIndex) {
      comment.body = comment.bodyPrevious;
      this.toggleCommentEditMode(comment, feedIndex);
    },
    ajaDeleteComment(comment, feedIndex) {
      if (!confirm("Are you sure?")) {
        return;
      }
      comment.form_id = "actionDelete";
      AjaxAlina.newInst({
        method: "POST",
        url: `${this.options.urlCommentDel}/${comment.id}`,
        postParams: comment,
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            UtilsArray.elRemoveByIndex(this.feed, feedIndex);
          }
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
        this.feed.forEach((e, i) => {
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
        !this.AlinaStorage.Comment.expanded.includes(
          `comment-collapse-${this.answer_to_tale_id}`
        )
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
    // a computed getter
    commentsTotal: function () {
      let res = 0;
      if (this.feedPagination.rowsTotal) {
        res = this.feedPagination.rowsTotal;
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
.single-comment {
}

.highlight {
  background-color: #ffb200;
  color: black;
}
</style>
