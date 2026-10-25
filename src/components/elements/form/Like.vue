<template>
  <span class="tale-reactions text-nowrap">
    <button type="button" class="btn btn-lg tale-reaction-button tale-reaction-positive"
            :class="{'is-active': dCurrentUserReaction === 1}" :aria-pressed="dCurrentUserReaction === 1"
            @click="onReaction(1)">+</button>
    <button type="button" class="btn btn-lg btn-a tale-reaction-count tale-reaction-positive"
            :class="{'has-reactions': dAmountLikes > 0}" @click="ajaGetFeed">
      {{ dAmountLikes }}
    </button>
    <button type="button" class="btn btn-lg tale-reaction-button tale-reaction-negative"
            :class="{'is-active': dCurrentUserReaction === -1}" :aria-pressed="dCurrentUserReaction === -1"
            @click="onReaction(-1)">−</button>
    <button type="button" class="btn btn-lg btn-a tale-reaction-count tale-reaction-negative"
            :class="{'has-reactions': dAmountDislikes > 0}" @click="ajaGetFeed">
      {{ dAmountDislikes }}
    </button>

    <b-modal
      :id="modalId"
      v-model="flagModalShown"
      class="like"
      dialog-class="reaction-summary-dialog"
      title="Reactions"
      :ok-only="true"
    >
      <table class="tale-reaction-table">
        <thead><tr><th>+</th><th>−</th></tr></thead>
        <tbody><tr>
          <td>
            <router-link v-for="item in positiveFeed" :key="item.id" :to="`/auth/profile/${item.user_id}`" class="tale-reaction-person">
              <img v-if="item.from_emblem" :src="item.from_emblem" :alt="item.from_firstname" class="a-circle tale-reaction-avatar" />
              <img v-else src="@/assets/anarki.png" class="a-circle tale-reaction-avatar" alt="" />
              <span>{{ UtilsStr.fullName(item.from_firstname, item.from_lastname, item.user_id) }}</span>
            </router-link>
            <span v-if="!positiveFeed.length" class="tale-reaction-empty">—</span>
          </td>
          <td>
            <router-link v-for="item in negativeFeed" :key="item.id" :to="`/auth/profile/${item.user_id}`" class="tale-reaction-person">
              <img v-if="item.from_emblem" :src="item.from_emblem" :alt="item.from_firstname" class="a-circle tale-reaction-avatar" />
              <img v-else src="@/assets/anarki.png" class="a-circle tale-reaction-avatar" alt="" />
              <span>{{ UtilsStr.fullName(item.from_firstname, item.from_lastname, item.user_id) }}</span>
            </router-link>
            <span v-if="!negativeFeed.length" class="tale-reaction-empty">—</span>
          </td>
        </tr></tbody>
      </table>
      <Paginator
        :pageCurrentNumber="parseInt(feedPagination.pageCurrentNumber)"
        :pageSize="parseInt(feedPagination.pageSize)"
        :rowsTotal="parseInt(feedPagination.rowsTotal)"
        :pagesTotal="parseInt(feedPagination.pagesTotal)"
        :onClickPage="pageChange"
      ></Paginator>
    </b-modal>
  </span>
</template>

<script>
import CurrentUser from "@/services/CurrentUser";
import ConfigApi from "@/configs/ConfigApi";
import AjaxAlina from "@/services/AjaxAlina";
import Paginator from "@/components/elements/form/Paginator";
import UtilsStr from "@/Utils/UtilsStr.js";

export default {
  name: "Like",
  components: {
    Paginator,
  },
  props: {
    pAmountLikes: {
      type: [Number, String],
      default: 0,
    },
    pCurrentUserLiked: {
      type: [Number, String],
      default: 0,
    },
    pAmountDislikes: {
      type: [Number, String],
      default: 0,
    },
    pCurrentUserDisliked: {
      type: [Number, String],
      default: 0,
    },
    ref_table: {
      type: String,
      default: "tale",
    },
    ref_id: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      UtilsStr,
      options: {
        urlLike: `${ConfigApi.url_base}/like/process`,
        urlFeed: `${ConfigApi.url_base}/like/selectlist`,
      },
      CU: CurrentUser.obj(),
      feed: [],
      feedPagination: {
        pageCurrentNumber: 1,
        pageSize: 10,
        rowsTotal: 0,
        pagesTotal: 0,
      },
      flagModalShown: false,
      // #####
      dCurrentUserLiked: 0,
      dAmountLikes: 0,
      dAmountDislikes: 0,
      dCurrentUserReaction: 0,
    };
  },
  computed: {
    modalId() {
      return `like-${this.ref_table}-${this.ref_id}`;
    },
    positiveFeed() {
      return this.feed.filter(item => Number(item.val) === 1);
    },
    negativeFeed() {
      return this.feed.filter(item => Number(item.val) === -1);
    },
  },
  mounted() {
    this.dCurrentUserLiked = this.pCurrentUserLiked;
    this.dAmountLikes = this.pAmountLikes;
    this.dAmountDislikes = this.pAmountDislikes;
    this.dCurrentUserReaction = Number(this.pCurrentUserDisliked) ? -1 : (Number(this.pCurrentUserLiked) ? 1 : 0);
  },
  watch: {
    pAmountLikes() {
      this.dAmountLikes = this.pAmountLikes;
    },
    pCurrentUserLiked() {
      this.dCurrentUserLiked = this.pCurrentUserLiked;
      this.syncCurrentReaction();
    },
    pAmountDislikes() {
      this.dAmountDislikes = this.pAmountDislikes;
    },
    pCurrentUserDisliked() {
      this.syncCurrentReaction();
    },
  },
  methods: {
    syncCurrentReaction() {
      this.dCurrentUserReaction = Number(this.pCurrentUserDisliked) ? -1 : (Number(this.pCurrentUserLiked) ? 1 : 0);
    },
    onReaction(val) {
      if (!this.CU.isLoggedIn()) {
        alert("Only logged-in users are allowed to react :-)");
        return;
      }
      const o = {
        ref_table: this.ref_table,
        ref_id: this.ref_id,
        val,
        form_id: "actionProcess",
      };
      AjaxAlina.newInst({
        method: "POST",
        url: this.options.urlLike,
        postParams: o,
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            this.dAmountLikes = aja.respBody.data.AmountLikes;
            this.dAmountDislikes = aja.respBody.data.AmountDislikes;
            this.dCurrentUserReaction = Number(aja.respBody.data.CurrentUserReaction);
            this.dCurrentUserLiked = this.dCurrentUserReaction === 1 ? 1 : 0;
          }
        },
      }).go();
    },
    ajaGetFeed() {
      if (Number(this.dAmountLikes) + Number(this.dAmountDislikes) < 1) {
        return;
      }
      const ps = this.feedPagination.pageSize;
      const pn = this.feedPagination.pageCurrentNumber;
      const ref_table = this.ref_table;
      const ref_id = this.ref_id;
      AjaxAlina.newInst({
        method: "GET",
        url: `${this.options.urlFeed}/${ps}/${pn}/${ref_table}/${ref_id}`,
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            this.feed = aja.respBody.data;
            this.feedPagination = aja.respBody.meta.lk;
            this.flagModalShown = true;
          }
        },
      }).go();
    },
    pageChange(pageSize, pageCurrentNumber) {
      this.feedPagination.pageSize = pageSize;
      this.feedPagination.pageCurrentNumber = pageCurrentNumber;
      this.ajaGetFeed();
    },
  },
};
</script>

<style scoped>
.tale-reactions { display: inline-flex; align-items: stretch; }
.tale-reaction-button, .tale-reaction-count { min-width: 2.6rem; border-radius: 0; color: #f4f4f4; }
.tale-reaction-button:first-child { border-radius: .375rem 0 0 .375rem; }
.tale-reaction-count:last-of-type { border-radius: 0 .375rem .375rem 0; }
.tale-reaction-positive.is-active, .tale-reaction-positive.has-reactions { color: #172117; background: #9bd2a5; }
.tale-reaction-negative.is-active, .tale-reaction-negative.has-reactions { color: #2b1111; background: #e6a2a2; }
.tale-reaction-table { width: 100%; table-layout: fixed; border-collapse: collapse; color: #f4f4f4; background: #333; }
.tale-reaction-table th, .tale-reaction-table td { width: 50%; padding: .5rem; vertical-align: top; border: 1px solid #666; overflow-wrap: anywhere; }
.tale-reaction-table th { color: #fff; background: #292929; text-align: center; font-size: 1.2rem; }
.tale-reaction-table th:first-child { color: #9bd2a5; }
.tale-reaction-table th:last-child { color: #e6a2a2; }
.tale-reaction-person { display: flex; align-items: center; gap: .4rem; margin-bottom: .35rem; padding: .25rem; border-radius: .25rem; color: #8fc7ff; text-decoration: none; }
.tale-reaction-person:hover { color: #fff; background: #505050; }
.tale-reaction-avatar { flex: 0 0 auto; width: 30px; height: 30px; object-fit: cover; }
.tale-reaction-empty { display: block; color: #aaa; text-align: center; }
</style>
