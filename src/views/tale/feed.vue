<template>
  <div class="container p-0">
    <div class="alina-feed-search"></div>
    <div class="row no-gutters">
      <div class="col">
        <div class="input-group mb-3 btn btn-block btn-dark">
          <div class="input-group-append">
            <button @click="searchClear" class="input-group-text btn btn-danger">{{ $t("TXT_CLEAR") }}</button>
          </div>
          <input type="text" class="form-control" aria-label="Search" v-model="dataGetParams.txt" placeholder="">
          <div class="input-group-append">
            <button @click="search" class="input-group-text btn btn-primary">{{ $t("TXT_SEARCH") }}</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="feed.length > 0">
      <div class="row no-gutters">
        <div class="col mx-auto">
          <div class="mb-5 text-center">
            <Paginator
                :pageCurrentNumber="parseInt(feedPagination.pageCurrentNumber)"
                :pageSize="parseInt(feedPagination.pageSize)"
                :rowsTotal="parseInt(feedPagination.rowsTotal)"
                :pagesTotal="parseInt(feedPagination.pagesTotal)"
                :onClickPage="pageChange"
            ></Paginator>
          </div>
          <!--##################################################-->
          <!-- region Tale -->
          <div v-for="(tale, index) in feed" v-bind:key="tale.id">
            <transition name="slide-fade">
              <div
                  :key="`${tale.id}_1`"
                  v-if="tale.is_adult_denied == 1 && !feedForceShow.includes(tale.id)"
              >
                <div class="row no-gutters mb-5">
                  <div class="img-wrapper">
                    <img class="img-responsive" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Parental_Advisory_label.svg/500px-Parental_Advisory_label.svg.png">
                    <div class="img-overlay">
                      <button
                          class="btn btn-lg btn-block btn-primary"
                          @click="feedForceShow.push(tale.id)"
                      >I am ready to watch dangerous content
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else :key="`${tale.id}_2`" :class="{is_draft:tale.is_draft, is_sticked:tale.is_sticked}">
                <div class="row no-gutters" v-if="tale.is_header_hidden != 1">
                  <div class="col" style="position: relative">
                    <h2 :lang="tale.lang"
                        class="notranslate btn btn-block text-left display-3 m-0"
                        :class="{
                                               'btn-secondary':tale.is_adult_denied==0,
                                               'btn-danger':tale.is_adult_denied==1
                                            }"
                    >
                      <a :href="UtilsSys.hrefToBackend(tale, 'tale/upsert')"
                         :title="$t('View SEO-friendly page')"
                         class="text-light"
                         style="display:inline-block; width: 100%"
                      >
                        {{ tale.header || '¯\_(ツ)_/¯' }}
                      </a>
                    </h2>
                    <div class="notranslate" style="position: absolute; right: 1%; bottom: -1.5em; z-index: 10">
                      <router-link
                          :title="$t('View on separate page')"
                          :to="'/tale/upsert/'+tale.id"
                          class="btn btn-sm btn-light text-left mb-1"
                      >
                        {{ tale.publish_at | unix_to_date_time }}
                      </router-link>
                    </div>
                  </div>
                </div>
                <div class="row no-gutters align-items-center" v-if="tale.is_avatar_hidden != 1">
                  <div class="col " v-if="doShowAuthorInfo">
                    <div style="width: 100px; max-height: 150px" class="m-auto">
                      <router-link :to="'/auth/profile/'+tale.owner_id" class="center">
                        <img v-if="tale.owner_emblem" :src="tale.owner_emblem" width="100%" class="rounded-circle">
                        <img v-if="!tale.owner_emblem" src="@/assets/anarki.png" width="100%" class="rounded-circle">
                      </router-link>
                    </div>
                    <div class="text-center">
                      <router-link v-if="doShowAuthorInfo" :to="'/auth/profile/'+tale.owner_id" class="btn btn-sm btn-secondary text-break mb-1">{{ UtilsStr.fullName(tale.owner_firstname, tale.owner_lastname, tale.owner_id) }}</router-link>
                    </div>
                  </div>
                </div>
                <div v-if="tale.is_header_hidden == 1">
                  <router-link
                      :title="$t('View on separate page')"
                      :to="'/tale/upsert/'+tale.id"
                      class=""
                  >
                    .
                  </router-link>
                  <a :href="`UtilsSys.hrefToBackend(tale, 'tale/upsert')`"
                     :title="$t('View SEO-friendly page')"
                  >
                    .
                  </a>
                </div>
                <div class="mt-3"></div>
                <div class="row no-gutters">
                  <div class="col">
                    <div class="ck-content" :lang="tale.lang">
                      <div class="notranslate" v-html="UtilsStr.content(tale.body)"></div>
                    </div>
                    <div v-if="tale.iframe" class="mt-3">
                      <iframe :src="tale.iframe" frameborder="1" width="100%" height="500px"></iframe>
                    </div>
                  </div>
                </div>
                <div class="mt-3"></div>
                <div class="row no-gutters mb-2">
                  <div class="col" v-if="tale.is_social_sharing_hidden != 1">
                    <div class="text-left m-buttons-1">
                      <Share :tale="tale"></Share>
                    </div>
                  </div>
                  <div class="col-auto" v-if="tale.is_comment_denied != 1">
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
                <div class="row no-gutters" v-if="tale.is_comment_denied != 1">
                  <div class="col">
                    <Comment
                        :level="1"
                        type="COMMENT"
                        :root_tale_id="tale.root_tale_id ? tale.root_tale_id : tale.id"
                        :answer_to_tale_id="tale.id"
                        :count_by_answer_to_tale_id="tale.count_root_tale_id"
                    ></Comment>
                  </div>
                </div>
              </div>
            </transition>
            <div class="mt-5"></div>
            <div class="mt-5"></div>
          </div>
          <!-- endregion Tale -->
          <!--##################################################-->
          <div class="mt-5 text-center">
            <Paginator
                :pageCurrentNumber="parseInt(feedPagination.pageCurrentNumber)"
                :pageSize="parseInt(feedPagination.pageSize)"
                :rowsTotal="parseInt(feedPagination.rowsTotal)"
                :pagesTotal="parseInt(feedPagination.pagesTotal)"
                :onClickPage="pageChange"
            ></Paginator>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import StandardButtons from "@/components/elements/form/StandardButtons";
import ConfigApi       from "@/configs/ConfigApi";
import AjaxAlina       from "@/services/AjaxAlina";
import Comment         from "@/components/elements/form/Comment";
import Like            from "@/components/elements/form/Like";
import Share           from "@/components/elements/form/Share";
import Paginator       from "@/components/elements/form/Paginator";
import Obj             from "@/Utils/UtilsObject";
import UtilsStr        from "@/Utils/UtilsStr";
import UtilsSys        from "@/Utils/UtilsSys";
export default {
  name:       "tale_feed",
  components: {
    Share,
    StandardButtons,
    Comment,
    Like,
    Paginator
  },
  props:      {
    // #####
    doShowAuthorInfo: {
      type:    Boolean,
      default: true,
    },
    // #####
    queryProps: {
      type:    Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      UtilsSys,
      UtilsStr,
      ConfigApi:      ConfigApi,
      options:        {
        urlFeed: `${ConfigApi.url_base}/tale/feed`,
      },
      dataGetParams:  {
        txt: '',
      },
      feed:           [],
      feedPagination: {
        pageCurrentNumber: 1,
        pageSize:          10,
        rowsTotal:         0,
        pagesTotal:        0,
      },
      feedForceShow:  [],
    }
  },
  created() {
    this.helperDefineQueryDataTxt();
    this.ajaGetFeed();
  },
  methods: {
    queryFunction(q = {}) {
      const res                             = Obj.eraseEmpty({
        ...{},
        ...this.dataGetParams,
        ...q
      });
      this.feedPagination.pageCurrentNumber = 1;
      const path1                           = this.$router.currentRoute.path;
      this.$router.replace({path: path1, query: res}).catch(() => {});
      this.ajaGetFeed();
    },
    ajaGetFeed() {
      AjaxAlina.newInst({
        method:    'GET',
        url:       `${this.options.urlFeed}/${this.feedPagination.pageSize}/${this.feedPagination.pageCurrentNumber}`,
        getParams: {...{}, ...this.queryProps, ...this.$route.query, ...this.dataGetParams},
        onDone:    (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            //UtilsArray.vueSensitiveConcat(this.feed, aja.respBody.data.tale);
            this.feed           = aja.respBody.data.tale;
            this.feedPagination = aja.respBody.meta.tale;
            //this.feedPagination= Obj.mergeRecursively(this.feedPagination, aja.respBody.meta.tale);
            // #####
            // alina-feed-search
            const el = this.$el.getElementsByClassName('alina-feed-search')[0];
            if (el) {
              el.scrollIntoView({behavior: 'smooth'});
            }
            // #####
          }
        }
      })
      .go();
    },
    pageChange(pageSize, pageCurrentNumber) {
      this.feedPagination.pageSize          = pageSize;
      this.feedPagination.pageCurrentNumber = pageCurrentNumber;
      this.ajaGetFeed();
    },
    search() {
      this.queryFunction();
    },
    searchClear() {
      this.dataGetParams.txt = '';
      this.queryFunction();
    },
    helperDefineQueryDataTxt() {
      if (this.$route.query.txt) {
        this.dataGetParams.txt = this.$route.query.txt;
      } else {
        this.dataGetParams.txt = '';
      }
    }
  },
  watch:   {
    $route(to, from) {
      this.helperDefineQueryDataTxt();
      this.ajaGetFeed();
    }
  },
};
</script>
<style scoped lang="scss">
.btn.display-3 {
  font-size: 1.5rem;
}

/*region Centered Button*/
.img-wrapper {
  width: 100%;
  position: relative;
}

.img-responsive {
  width: 100%;
  height: auto;
}

.img-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}

.img-overlay:before {
  content: ' ';
  display: block;
  /* adjust 'height' to position overlay content vertically */
  height: 50%;
}

/*endregion Centered Button*/

/**/
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 2.05s ease;
  opacity: 1;
  max-height: 99999px;
}

.slide-fade-enter {
  max-height: 0;
  opacity: 0;
}

.slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
}

h1 a:hover, h2 a:hover {
  text-decoration: none
}
</style>
