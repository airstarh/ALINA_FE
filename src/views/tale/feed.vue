<template>
  <div class="container p-0 alina-feed-wrapper">
    <div class="alina-feed-start"></div>
    <!--##################################################-->
    <!--region SEARCH FORM-->
    <div class="row no-gutters">
      <div class="col">
        <div class="input-group mb-3 btn btn-block btn-dark">
          <div class="input-group-prepend">
            <button
              @click="search"
              class="input-group-text btn btn-primary"
            >
              <b-icon icon="search"></b-icon>
            </button>
          </div>
          <input
            type="text"
            class="form-control"
            aria-label="Search"
            v-model="dataGetParams.txt"
            placeholder=""
          />
          <div class="input-group-append">
            <button
              @click="searchClear"
              class="input-group-text btn btn-danger"
            >
              <b-icon icon="backspace-fill"></b-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--endregion SEARCH FORM-->
    <!--##################################################-->
    <!--region FEED-PAGINATOR-UP-DOWN-TALE-->
    <div
      v-if="feed.length"
      class="alina-feed-paginator-tale"
    >
      <div class="row no-gutters">
        <div class="col mx-auto">
          <!--##################################################-->
          <!--region PAGINATOR-->
          <div class="text-center alina-feed-paginator">
            <Paginator
              :pageCurrentNumber="parseInt(feedPagination.pageCurrentNumber)"
              :pageSize="parseInt(feedPagination.pageSize)"
              :rowsTotal="parseInt(feedPagination.rowsTotal)"
              :pagesTotal="parseInt(feedPagination.pagesTotal)"
              :onClickPage="pageChange"
            ></Paginator>
          </div>
          <!--endregion PAGINATOR-->
          <!--##################################################-->
          <!--region TALE-->
          <div
            v-for="(tale, index) in feed"
            v-bind:key="tale.id"
            :class="['mt-5 alina-feed-tale', `alina-feed-tale-${index}`]"
          >
            <!--region UP-DOWN-->
            <div class="sticky-top">
              <div class="row no-gutters text-center mt-5 alina-feed-up-down">
                <div
                  class="col btn cursor-pointer"
                  @click="scrollToClassName('alina-feed-start')"
                >
                  {{ $t("i_up") }}{{ $t("i_up") }}
                </div>
                &nbsp;
                <div
                  class="col btn cursor-pointer"
                  @click="scrollToClassName('alina-feed-end')"
                >
                  {{ $t("i_down") }}{{ $t("i_down") }}
                </div>
                &nbsp;
                <div
                  class="col btn cursor-pointer"
                  @click="scrollToClassName(`alina-feed-tale-${index - 1}`)"
                >
                  {{ $t("i_up") }}
                </div>
                &nbsp;
                <div
                  class="col btn cursor-pointer"
                  @click="scrollToClassName(`alina-feed-tale-${index + 1}`)"
                >
                  {{ $t("i_down") }}
                </div>
              </div>
            </div>
            <!--endregion UP-DOWN-->
            <!--##################################################-->
            <transition name="slide-fade">
              <div
                :key="`${tale.id}_1`"
                v-if="
                  tale.is_adult_denied == 1 && !feedForceShow.includes(tale.id)
                "
              >
                <div class="row no-gutters mb-5">
                  <div class="img-wrapper">
                    <img
                      class="img-responsive"
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Parental_Advisory_label.svg/500px-Parental_Advisory_label.svg.png"
                    />
                    <div class="img-overlay">
                      <button
                        class="btn btn-lg btn-block btn-primary"
                        @click="feedForceShow.push(tale.id)"
                      >
                        I am ready to watch dangerous content
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-else
                :key="`${tale.id}_2`"
                :class="{
                  is_draft: tale.is_draft,
                  is_sticked: tale.is_sticked,
                }"
                class="corporate-border-color"
              >
                <tale_upsert
                  :p-flag-in-feed="true"
                  :p-tale="tale"
                ></tale_upsert>
              </div>
            </transition>
          </div>
          <!--endregion TALE-->
          <!--##################################################-->
          <!--##################################################-->
          <!--region UP-DOWN-->
          <div class="sticky-top">
            <div class="row no-gutters text-center mb-5 alina-feed-up-down">
              <div
                class="col btn btn-secondary cursor-pointer"
                @click="scrollToClassName('alina-feed-start')"
              >
                &uarr;&uarr;
              </div>
              &nbsp;
              <div
                class="col btn btn-secondary cursor-pointer"
                @click="scrollToClassName('alina-feed-end')"
              >
                &darr;&darr;
              </div>
              &nbsp;
              <div
                class="col btn btn-secondary cursor-pointer"
                @click="scrollToClassName(`alina-feed-tale-${feed.length - 1}`)"
              >
                &uarr;
              </div>
              &nbsp;
              <div
                class="col btn btn-secondary cursor-pointer"
                @click="scrollToClassName(`alina-feed-tale-${feed.length + 1}`)"
              >
                &darr;
              </div>
            </div>
          </div>
          <!--endregion UP-DOWN-->
          <!--##################################################-->
          <!--##################################################-->
          <!-- region PAGINATOR -->
          <div class="mt-5 text-center alina-feed-paginator">
            <Paginator
              :pageCurrentNumber="parseInt(feedPagination.pageCurrentNumber)"
              :pageSize="parseInt(feedPagination.pageSize)"
              :rowsTotal="parseInt(feedPagination.rowsTotal)"
              :pagesTotal="parseInt(feedPagination.pagesTotal)"
              :onClickPage="pageChange"
            ></Paginator>
          </div>
          <!-- endregion PAGINATOR -->
          <!--##################################################-->
        </div>
      </div>
    </div>
    <!--endregion FEED-PAGINATOR-UP-DOWN-TALE-->
    <!--##################################################-->
    <div class="alina-feed-end"></div>
  </div>
</template>
<script>
import StandardButtons from "@/components/elements/form/StandardButtons.vue";
import ConfigApi from "@/configs/ConfigApi";
import AjaxAlina from "@/services/AjaxAlina";
import AlinaYandexMap from "@/components/elements/form/AlinaYandexMap.vue";
import Comment from "@/components/elements/form/Comment.vue";
import Like from "@/components/elements/form/Like.vue";
import Share from "@/components/elements/form/Share.vue";
import Paginator from "@/components/elements/form/Paginator.vue";
import tale_upsert from "@/views/tale/upsert.vue";
import UtilsStr from "@/Utils/UtilsStr";
import UtilsSys from "@/Utils/UtilsSys";

export default {
  name: "tale_feed",

  components: {
    AlinaYandexMap,
    Share,
    StandardButtons,
    Comment,
    Like,
    Paginator,
    tale_upsert,
  },

  props: {
    // #####
    doShowAuthorInfo: {
      type: Boolean,
      default: true,
    }, // #####
    queryProps: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      UtilsSys,
      UtilsStr,
      ConfigApi: ConfigApi,
      options: {
        urlFeed: `${ConfigApi.url_base}/tale/feed`,
      },
      dataGetParams: {
        txt: "",
      },
      feed: [],
      feedPagination: {
        pageCurrentNumber: 1,
        pageSize: 10,
        rowsTotal: 0,
        pagesTotal: 0,
      },
      feedForceShow: [],
    };
  },

  created() {
    this.onAddressBarModified();
  },

  methods: {
    modifyAddressBar(q = {}) {
      const path = this.$router.currentRoute.path;
      const query = {
        ...this.$route.query,
        ...q,
      };
      this.$router
        .push({
          path: path,
          query: query,
        })
        .catch(() => {});
      //this.ajaGetFeed();
    },

    onAddressBarModified() {
      this.dataGetParams.txt = Array.isArray(this.$route.query?.txt)
        ? this.$route.query.txt.join(",")
        : this.$route.query?.txt || "";

      this.feedPagination.pageCurrentNumber = Array.isArray(
        this.$route.query?.pageCurrentNumber
      )
        ? 1
        : parseInt(this.$route.query?.pageCurrentNumber || 1, 10);

      this.feedPagination.pageSize = this.$route.query?.pageSize || 10;
      this.ajaGetFeed();
    },

    ajaGetFeed() {
      AjaxAlina.newInst({
        method: "GET",
        url: `${this.options.urlFeed}/${this.feedPagination.pageSize}/${this.feedPagination.pageCurrentNumber}`,
        getParams: { ...{}, ...this.queryProps, ...this.$route.query },
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            //UtilsArray.vueSensitiveConcat(this.feed, aja.respBody.data.tale);
            this.feed = aja.respBody.data.tale;
            this.feedPagination = aja.respBody.meta.tale;
            //this.feedPagination= Obj.mergeRecursively(this.feedPagination, aja.respBody.meta.tale);
            // #####
            if (this.feedPagination.pageCurrentNumber != 1) {
              this.scrollTop();
            }
          }
        },
      }).go();
    },

    pageChange(pageSize, pageCurrentNumber) {
      this.feedPagination.pageSize = pageSize;
      this.feedPagination.pageCurrentNumber = pageCurrentNumber;
      this.modifyAddressBar({
        pageSize: this.feedPagination.pageSize,
        pageCurrentNumber: this.feedPagination.pageCurrentNumber,
      });
      //this.ajaGetFeed();
    },

    search() {
      this.feedPagination.pageCurrentNumber = 1;
      this.modifyAddressBar({
        pageCurrentNumber: 1,
        txt: this.dataGetParams.txt,
      });
    },

    searchClear() {
      this.feedPagination.pageCurrentNumber = 1;
      this.dataGetParams.txt = "";
      this.modifyAddressBar({
        pageCurrentNumber: 1,
        txt: "",
      });
      //this.ajaGetFeed();
    },

    scrollTop(className = "alina-feed-start") {
      this.scrollToClassName("alina-feed-start");
    },

    scrollBottom(className = "alina-feed-end") {
      this.scrollToClassName("alina-feed-end");
    },

    scrollToClassName(className = "alina-feed-start") {
      const el = this.$el.getElementsByClassName(className)[0];
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    },
  },

  watch: {
    $route(to, from) {
      this.onAddressBarModified();
    },
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
  content: " ";
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

h1 a:hover,
h2 a:hover {
  text-decoration: none;
}

/**experimental*/
.stick-bottom {
  position: -webkit-sticky;
  position: sticky;
  /*bottom: 100px;*/
  top: 95vh;
  z-index: 1020;
}

.alina-feed-up-down {
  & div.btn {
    background-color: #22222288;
    color: #666666;
  }
}
</style>
