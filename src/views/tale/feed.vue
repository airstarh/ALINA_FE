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
              <div v-else :key="`${tale.id}_2`" :class="{is_draft:tale.is_draft, is_sticked:tale.is_sticked}" class="corporate-border-color">
                <tale_upsert
                    :p-flag-in-feed="true"
                    :p-tale="tale"
                ></tale_upsert>
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
import AlinaYandexMap  from "@/components/elements/form/AlinaYandexMap";
import Comment         from "@/components/elements/form/Comment";
import Like            from "@/components/elements/form/Like";
import Share           from "@/components/elements/form/Share";
import Paginator       from "@/components/elements/form/Paginator";
import tale_upsert             from "@/views/tale/upsert";
import UtilsStr        from "@/Utils/UtilsStr";
import UtilsSys        from "@/Utils/UtilsSys";

export default {
  name:       "tale_feed",
  components: {
    AlinaYandexMap,
    Share,
    StandardButtons,
    Comment,
    Like,
    Paginator,
    tale_upsert
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
    this.dataGetParams.txt = this.$route.query.txt;
    this.ajaGetFeed();
  },
  methods: {
    queryFunction(q = {}) {
      this.feedPagination.pageCurrentNumber = 1;
      const path                            = this.$router.currentRoute.path;
      const getParams                       = {...this.$route.query, ...{txt: this.dataGetParams.txt}};
      this.$router.push({path: path, query: getParams}).catch(() => {});
      //this.ajaGetFeed();
    },
    ajaGetFeed() {
      AjaxAlina.newInst({
        method:    'GET',
        url:       `${this.options.urlFeed}/${this.feedPagination.pageSize}/${this.feedPagination.pageCurrentNumber}`,
        getParams: {...{}, ...this.queryProps, ...this.$route.query},
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
  },
  watch:   {
    $route(to, from) {
      this.dataGetParams.txt = this.$route.query.txt;
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
