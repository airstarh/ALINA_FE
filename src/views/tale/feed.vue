<template>
  <div class="container p-0 alina-feed-wrapper">
    <div class="alina-feed-start"></div>
    <!--##################################################-->

    <!--##################################################-->
    <!-- region SEARCH -->
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
    <!-- endregion SEARCH -->
    <!--##################################################-->

    <!--##################################################-->
    <!-- region FEED  -->
    <div
      v-if="feed.length"
      class="alina-feed-paginator-tale"
    >
      <div class="row no-gutters">
        <div class="col mx-auto">
          <!--##################################################-->
          <!-- region PAGINATOR -->
          <div class="text-center alina-feed-paginator">
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

          <!-- # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #  -->
          <!-- region WRAPPER TALE-->
          <div
            v-for="(tale, index) in feed"
            :key="tale.id"
            v-if="tale.id"
            v-bind:key="tale.id"
            :class="[
              'mt-5 p-1',
              'alina-feed-tale',
              `alina-feed-tale-order-${index}`,
              `alina-feed-tale-id-${tale.id}`,
            ]"
          >
            <!--##################################################-->
            <!-- region UP DOWN EACH TALE -->
            <div
              v-if="tale.id"
              class="sticky-top"
            >
              <div class="row no-gutters text-center alina-feed-up-down mt-3">
                <div
                  class="col btn btn-sm cursor-pointer"
                  @click="scrollToClassName('alina-feed-start')"
                >
                  {{ $t("i_up") }}{{ $t("i_up") }}
                </div>
                &nbsp;
                <div
                  class="col btn btn-sm cursor-pointer"
                  @click="scrollToClassName('alina-feed-end')"
                >
                  {{ $t("i_down") }}{{ $t("i_down") }}
                </div>
                &nbsp;
                <div
                  class="col btn btn-sm cursor-pointer"
                  @click="
                    scrollToClassName(`alina-feed-tale-order-${index - 1}`)
                  "
                >
                  {{ $t("i_up") }}
                </div>
                &nbsp;
                <div
                  class="col btn btn-sm cursor-pointer"
                  @click="
                    scrollToClassName(`alina-feed-tale-order-${index + 1}`)
                  "
                >
                  {{ $t("i_down") }}
                </div>
              </div>
            </div>
            <!-- endregion UP DOWN EACH TALE -->
            <!--##################################################-->

            <transition name="slide-fade">
              <!-- region ADULT -->
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
                      src="@/assets/adult.png"
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
              <!-- endregion ADULT -->
              <!-- region TALE -->
              <div
                v-else
                :key="`${tale.id}_2`"
                :class="[
                  {
                    is_draft: tale.is_draft,
                    is_sticked: tale.is_sticked,
                  },
                  'corporate-border-color',
                  !expandedTales[tale.id] ? 'collapsed' : '',
                ]"
              >
                <tale_upsert
                  :p-flag-in-feed="true"
                  :p-tale="tale"
                  @deleted="ajaGetFeed"
                  @taleChanged="
                    (newTale) => {
                      handleTaleChanged(newTale, index);
                    }
                  "
                  @modeEditChanged="
                    ({ taleId, modeEdit }) => {
                      handleModeEditChanged(taleId, modeEdit, index);
                    }
                  "
                ></tale_upsert>
              </div>
              <!-- endregion TALE -->
            </transition>
            <div class="text-center position-relative">
              <button
                v-if="!taleMustBeExpanded(tale)"
                class="btn btn-sm btn-secondary position-relative rounded-pill"
                @click="
                  toggleExpand(tale.id);
                  expandedTales[tale.id]
                    ? () => {}
                    : scrollToClassName(`alina-feed-tale-order-${index}`);
                "
                style="top: 20px; width: 20vw"
              >
                {{ expandedTales[tale.id] ? $t("i_collapse") : $t("i_expand") }}
              </button>
            </div>
          </div>
          <!-- endregion WRAPPER TALE-->
          <!-- # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #  -->

          <!--##################################################-->
          <!-- region LAST UPDOWN -->
          <div class="sticky-top">
            <div class="row no-gutters text-center mb-5 alina-feed-up-down">
              <div
                class="col btn btn-secondary cursor-pointer"
                @click="scrollToClassName('alina-feed-start')"
              >
                {{ $t("i_up") }}{{ $t("i_up") }}
              </div>
              &nbsp;
              <div
                class="col btn btn-secondary cursor-pointer"
                @click="
                  scrollToClassName(`alina-feed-tale-order-${feed.length - 1}`)
                "
              >
                {{ $t("i_up") }}
              </div>
            </div>
          </div>
          <!-- endregion LAST UPDOWN -->
          <!--##################################################-->

          <!--##################################################-->
          <!-- region LAST PAGINATOR -->
          <div class="mt-5 text-center alina-feed-paginator">
            <Paginator
              :pageCurrentNumber="parseInt(feedPagination.pageCurrentNumber)"
              :pageSize="parseInt(feedPagination.pageSize)"
              :rowsTotal="parseInt(feedPagination.rowsTotal)"
              :pagesTotal="parseInt(feedPagination.pagesTotal)"
              :onClickPage="pageChange"
            ></Paginator>
          </div>
          <!-- endregion LAST PAGINATOR -->
          <!--##################################################-->
        </div>
      </div>
    </div>
    <!-- endregion FEED -->
    <!--##################################################-->

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
      expandedTales: {},
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
    taleMustBeExpanded(tale) {
      return (tale?.body?.length || 0) < 1000;
    },

    toggleExpand(taleId, forcedValue = null) {
      let val = !this.expandedTales[taleId];

      if (forcedValue !== null) {
        val = forcedValue;
      }

      this.$set(this.expandedTales, taleId, val);
    },

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
            //~example~ UtilsArray.vueSensitiveConcat(this.feed, aja.respBody.data.tale);
            this.feed = aja.respBody.data.tale;

            this.feed.map((tale) => {
              this.toggleExpand(tale?.id, this.taleMustBeExpanded(tale));
            });

            this.feedPagination = aja.respBody.meta.tale;

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

    handleTaleChanged(newTale, index) {
      this.feed[index] = newTale;
    },

    handleModeEditChanged(taleId, modeEdit, index) {
      if (modeEdit === true) {
        this.toggleExpand(taleId, true);
      }
    },

    log(data) {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      console.log(data);
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

.alina-feed-tale {
  border-radius: 20px;
  background-color: #333333;
  filter: drop-shadow(1px 1px 30px rgba(0, 0, 0, 0.8));
  margin-bottom: 25vh;

  & .alina-feed-up-down {
    & div.btn {
      background-color: #222222ff;
      color: #dddddddd;
    }

    & div.btn:first-child {
      border-radius: 20px 0 0 0;
    }

    & div.btn:last-child {
      border-radius: 0 20px 0 0;
    }
  }

  .collapsed {
    overflow: hidden;
    max-height: 55vh;
  }
}
</style>
