<template>
  <div :style="options.style">
    <div class="mb-5">
      <b-button
          v-b-toggle="`comment-collapse-${answer_to_tale_id}`"
          :class="{
                      'btn-md':level==1,
                      'btn-sm':level>1,
                      }"
      >{{ $tc('COUNTER_COMMENTS', commentsTotal) }}
      </b-button>
    </div>
    <b-collapse
        :id="`comment-collapse-${answer_to_tale_id}`"
        @show="onExpandCommentList(`comment-collapse-${answer_to_tale_id}`)"
        :visible="level == 3"
        class="mb-5"
    >
      <div
          v-for="(tale, feedIndex) in feed"
          :key="tale.id"
          class="mt-1"
          :data-id="tale.id"
          :data-to="tale.answer_to_tale_id"
          :data-root="root_tale_id"
          :data-index="feedIndex"
      >
        <div
            :class="{
                        highlight: $route.query.highlight == tale.id,
                    }"
        >
          <!--##################################################-->
          <!--region User Info-->
          <div class="mt-5">&nbsp;</div>
          <UserAvatar
              :userId="tale.owner_id"
              :userFirstName="tale.owner_firstname"
              :userLastName="tale.owner_lastname"
              :emblemUrl="tale.owner_emblem"
              emblemWidth="50px"
              :someDate="tale.publish_at"
          ></UserAvatar>
          <!--endregion User Info-->
          <!--##################################################-->
          <!--region Comment body          -->
          <div class="row no-gutters" v-if="!state.feedsInEdit.includes(tale.id)">
            <div class="col">
              <div class="ck-content">
                <div class="notranslate" v-html="UtilsStr.content(tale.body)"></div>
              </div>
              <div class="mt-3"></div>
            </div>
          </div>
          <!--endregion Comment body          -->
          <!--##################################################-->
          <div class="row no-gutters" v-else>
            <div class="col">
              <ckeditor class="notranslate" v-model="tale.body" :editor="options.editor" :config="options.editorConfig" @ready="pageRecalcIframeHeight()"></ckeditor>
            </div>
          </div>

          <div class="row no-gutters m-buttons-1">
            <div class="col text-right" v-if="CU.ownsOrAdminOrModerator(tale.owner_id)">
                            <span class="row no-gutters">
                                <button @click="ajaDeleteComment(feed[feedIndex], feedIndex)" class="col btn btn-sm btn-danger">{{ $t("TXT_DELETE") }}</button>
                                <button @click="toggleCommentEditMode(feed[feedIndex], feedIndex)" v-if="!state.feedsInEdit.includes(tale.id)" class="col btn btn-sm btn-info">{{ $t("TXT_EDIT") }}</button>
                                <button @click="commentCancelEdit(feed[feedIndex], feedIndex)" v-if="state.feedsInEdit.includes(tale.id)" class="col btn btn-sm btn-info">{{ $t("TXT_CANCEL") }}</button>
                                <button @click="ajaCommentSave(feed[feedIndex], feedIndex)" v-if="state.feedsInEdit.includes(tale.id)" class="col btn btn-sm btn-success">{{ $t("TXT_SUBMIT") }}</button>
                            </span>
            </div>
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
          </div>
        </div>
        <Comment
            v-if="tale.level < 2"
            :level="tale.level+1"
            type="COMMENT"
            :root_tale_id="tale.root_tale_id"
            :answer_to_tale_id="tale.id"
            :count_by_answer_to_tale_id="tale.count_answer_to_tale_id"
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
      <div
          v-if="CU.isLoggedIn() && AlinaStorage.Comment.expanded.includes(`comment-collapse-${answer_to_tale_id}`)"
      >
        <!--##################################################-->
        <!--region User Info-->
        <div class="mt-5">&nbsp;</div>
        <div class="mt-5">&nbsp;</div>
        <UserAvatar
            :userId="CU.attributes.id"
            :userFirstName="CU.attributes.firstname"
            :userLastName="CU.attributes.lastname"
            :emblemUrl="CU.attributes.emblem"
            emblemWidth="50px"
            :someDate="null"
        ></UserAvatar>
        <!--endregion User Info-->
        <!--##################################################-->
        <!--region EDITOR-->
        <div class="row no-gutters">
          <div
              class="col"
          >
            <ckeditor class="notranslate" v-model="body" :editor="options.editor" :config="options.editorConfig" @ready="pageRecalcIframeHeight()"></ckeditor>
            <div class="row no-gutters">
              <div class="col"></div>
              <div class="col">
                <div class="row no-gutters">
                  <button @click="() => {this.body = '';}" class="col btn btn-sm btn-warning">{{ $t("TXT_CLEAR") }}</button>
                  <button @click="ajaCommentAdd" type="button" class="col btn btn-sm btn-success">{{ $t("TXT_SUBMIT") }}</button>
                </div>
              </div>
            </div>
            <div>&nbsp;</div>
          </div>
        </div>
      </div>
      <!--endregion EDITOR-->
      <!--##################################################-->
      <!--region Login or Register-->
      <div v-if="!CU.isLoggedIn()" class="col">
        <router-link
            to="/auth/login"
            class="btn btn-sm btn-primary"
        >{{ $t("IMP_LOGIN") }}
        </router-link>
        {{ $t("or") }}
        <router-link
            to="/auth/register"
            class="btn btn-sm btn-primary"
        >{{ $t("IMP_REGISTER") }}
        </router-link>
        {{ $t("to post comments") }}
      </div>
      <!--endregion Login or Register-->
      <!--##################################################-->

    </b-collapse>
  </div>
</template>

<script>
import UtilsStr       from "@/Utils/UtilsStr";
import AjaxAlina      from "@/services/AjaxAlina";
import ConfigApi      from "@/configs/ConfigApi";
import UtilsArray     from "@/Utils/UtilsArray";
import Comment        from "@/components/elements/form/Comment";
import Like           from "@/components/elements/form/Like";
import Paginator      from "@/components/elements/form/Paginator";
import ClassicEditor  from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import ConfigCkEditor from "@/configs/ConfigCkEditor";
import CurrentUser    from "@/services/CurrentUser";
import AlinaStorage   from "@/services/AlinaStorage";
import UtilsData      from "@/Utils/UtilsData";
import lodash         from 'lodash';
import UserAvatar     from "@/components/UserAvatar";

export default {
  name:       "Comment",
  components: {
    UserAvatar,
    Paginator,
    Like,
    Comment,
  },
  data() {
    return {
      UtilsStr,
      AlinaStorage,
      ConfigApi,
      CU:             CurrentUser.obj(),
      options:        {
        urlFeed:       `${ConfigApi.url_base}/tale/feed`,
        urlTaleUpsert: `${ConfigApi.url_base}/tale/upsert`,
        urlCommentDel: `${ConfigApi.url_base}/tale/delete`,
        editorConfig:  ConfigCkEditor,
        editor:        ClassicEditor,
        style:         {
          "margin-left":  this.level == 1 ? '0' : 10 + '%',
          "padding-left": "1mm",
          "border-left":  this.level == 1 ? '#A9ABAD solid 7px' : '#A9ABAD solid 2px'
        },
        styleComment:  {}
      },
      state:          {
        feedsInEdit: []
      },
      body:           "",
      feed:           [],
      feedPagination: {
        pageCurrentNumber: 'last',
        pageSize:          this.level == 1 ? 10 : 10,
        rowsTotal:         0,
        pagesTotal:        0,
      },
    }
  },
  props: {
    level:                      {
      type:    Number,
      default: 1,
    },
    type:                       {
      type:    String,
      default: 'COMMENT',
    },
    root_tale_id:               {
      type:    Number,
      default: null,
    },
    answer_to_tale_id:          {
      type:    Number,
      default: null,
    },
    count_by_answer_to_tale_id: {
      type:    Number,
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
  methods:  {
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
        method:    'GET',
        getParams: GET,
        url:       `${this.options.urlFeed}/${this.feedPagination.pageSize}/${this.feedPagination.pageCurrentNumber}/${this.answer_to_tale_id}`,
        onDone:    (aja) => {
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
        }
      })
      .go();
    },
    ajaCommentAdd(event) {
      const _t = this;
      AjaxAlina.newInst({
        method:     'POST',
        url:        this.options.urlTaleUpsert,
        enctype:    'application/json',
        postParams: {
          "level":             this.level,
          "root_tale_id":      this.root_tale_id,
          "answer_to_tale_id": this.answer_to_tale_id,
          "type":              this.type,
          "body":              this.body,
          "form_id":           "actionCommentAdd",
        },
        onDone:     (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            _t.feed.push(aja.respBody.data);
            ++_t.feedPagination.rowsTotal;
            this.body = '';
          }
          this.pageRecalcIframeHeight();
        }
      })
      .go();
    },
    pageChange(pageSize, pageCurrentNumber) {
      this.feedPagination.pageSize          = pageSize;
      this.feedPagination.pageCurrentNumber = pageCurrentNumber;
      this.ajaGetComments();
    },
    onClickMore(pageSize, pageCurrentNumber) {
      this.feedPagination.pageSize          = pageSize;
      this.feedPagination.pageCurrentNumber = pageCurrentNumber;
      this.ajaGetComments(true);
    },
    onClickAll(pageSize, pageCurrentNumber) {
      this.feedPagination.pageSize          = pageSize;
      this.feedPagination.pageCurrentNumber = pageCurrentNumber;
      this.ajaGetComments(false);
    },
    toggleCommentEditMode(comment, feedIndex) {
      if (!this.state.feedsInEdit.includes(comment.id)) {
        comment.bodyPrevious = comment.body;
        this.state.feedsInEdit.push(comment.id)
      } else {
        UtilsArray.elRemoveByValue(this.state.feedsInEdit, comment.id);
      }
    },
    ajaCommentSave(comment, feedIndex) {
      const _t        = this;
      comment.form_id = 'actionUpsert';
      AjaxAlina.newInst({
        method:     'POST',
        url:        `${this.options.urlTaleUpsert}/${comment.id}`,
        postParams: comment,
        onDone:     (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            this.toggleCommentEditMode(comment, feedIndex);
          }
          this.pageRecalcIframeHeight();
        }
      })
      .go();
    },
    commentCancelEdit(comment, feedIndex) {
      comment.body = comment.bodyPrevious;
      this.toggleCommentEditMode(comment, feedIndex);
    },
    ajaDeleteComment(comment, feedIndex) {
      if (!confirm("Are you sure?")) {return;}
      comment.form_id = 'actionDelete';
      AjaxAlina.newInst({
        method:     'POST',
        url:        `${this.options.urlCommentDel}/${comment.id}`,
        postParams: comment,
        onDone:     (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            UtilsArray.elRemoveByIndex(this.feed, feedIndex);
          }
          this.pageRecalcIframeHeight();
        }
      })
      .go();
    },
    onExpandCommentList(collapseId) {
      UtilsArray.pushIfNotAlready(this.AlinaStorage.Comment.expanded, collapseId);
      this.ajaGetComments();
    },
    processQuery() {
      const q    = this.$route.query;
      let idRoot = null;
      let idAnsw = null;
      if (q.expand) {
        idRoot = `comment-collapse-${this.root_tale_id}`;
        if (!this.AlinaStorage.Comment.expanded.includes(idRoot)) {
          this.$root.$emit('bv::toggle::collapse', idRoot);
        }
        //#####
        this.feed.forEach((e, i) => {
          if (e.id == q.expand) {
            idAnsw = `comment-collapse-${q.expand}`;
            if (!this.AlinaStorage.Comment.expanded.includes(idAnsw)) {
              this.$root.$emit('bv::toggle::collapse', idAnsw);
            }
          }
        });
      }
    },
    pageRecalcIframeHeight: lodash.debounce(() => {
      ConfigApi.pageRecalcIframeHeight();
    }, 300),
  }, // #####
  watch:    {
    // $route(to, from) {
    //   const q = this.$route.query;
    //   if (UtilsData.empty(q.expand)) {
    //     this.feedPagination.pageCurrentNumber = 'last';
    //   }
    //   this.ajaGetComments();
    // },
  }, // #####
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
    }
  }
};
</script>

<style scoped lang="scss">
.highlight {
  background-color: #ffb200;
  color: black;
}
</style>
