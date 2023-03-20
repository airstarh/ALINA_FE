<template>
    <span class="text-nowrap">
        <button
            @click="onLike"
            class="btn btn-lg"
        >
            <span v-if="dCurrentUserLiked" class="text-danger"><b-icon-heart-fill></b-icon-heart-fill></span>
            <span v-if="!dCurrentUserLiked" class="text-white"><b-icon-heart></b-icon-heart></span>
        </button><button
        @click="ajaGetFeed"
        class="btn btn-secondary btn-lg"
    >{{ dAmountLikes }}
        </button>

        <b-modal
            id="like"
            v-model="flagModalShown"
            class="like"
            title="Likers"
            :ok-only="true"
            size="lg"
        >
        <div
            v-for="(item,index) in feed"
            :key="item.id"
            class="mb-1"
        >
            <div class="row no-gutters">
                <div class="col-auto">
                  <router-link :to="`/auth/profile/${item.user_id}`">
                      <img v-if="item.from_emblem" :src="item.from_emblem" :alt="item.from_firstname" width="70px">
                      <img v-if="!item.from_emblem" src="@/assets/anarki.png" width="70px">
                  </router-link>
                </div>
                <div class="col pl-2">
                    <router-link :to="`/auth/profile/${item.user_id}`" class="btn btn-primary">
                      {{ item.from_firstname }} {{ item.from_lastname }}
                    </router-link>
                </div>
            </div>
            <Paginator
                :pageCurrentNumber="parseInt(feedPagination.pageCurrentNumber)"
                :pageSize="parseInt(feedPagination.pageSize)"
                :rowsTotal="parseInt(feedPagination.rowsTotal)"
                :pagesTotal="parseInt(feedPagination.pagesTotal)"
                :onClickPage="pageChange"
            ></Paginator>
        </div>
    </b-modal>
    </span>
</template>

<script>
import CurrentUser from "@/services/CurrentUser";
import ConfigApi   from "@/configs/ConfigApi";
import AjaxAlina   from "@/services/AjaxAlina";
import Paginator   from "@/components/elements/form/Paginator";
export default {
  name:       "Like",
  components: {
    Paginator
  },
  props:      {
    pAmountLikes:      {
      type:    Number | String,
      default: 0,
    },
    pCurrentUserLiked: {
      type:    Number | String,
      default: 0,
    },
    ref_table:         {
      type:    String,
      default: 'tale',
    },
    ref_id:            {
      type:    Number,
      default: 0,
    },
  },
  data() {
    return {
      options:        {
        urlLike: `${ConfigApi.url_base}/like/process`,
        urlFeed: `${ConfigApi.url_base}/like/selectlist`
      },
      CU:             CurrentUser.obj(),
      feed:           [],
      feedPagination: {
        pageCurrentNumber: 1,
        pageSize:          10,
        rowsTotal:         0,
        pagesTotal:        0,
      },
      flagModalShown: false,
      // #####
      dCurrentUserLiked: 0,
      dAmountLikes:      0,
      val:               0
    };
  },
  mounted() {
    this.dCurrentUserLiked = this.pCurrentUserLiked;
    this.dAmountLikes      = this.pAmountLikes;
  },
  watch:   {
    pAmountLikes() {
      this.dAmountLikes = this.pAmountLikes;
    },
    pCurrentUserLiked() {
      this.dCurrentUserLiked = this.pCurrentUserLiked;
    }
  },
  methods: {
    onLike() {
      if (!this.CU.isLoggedIn()) {
        alert('Only logged-in users are allowed to like :-)');
        return;
      }
      this.val = 1;
      const o  = {
        "ref_table": this.ref_table,
        "ref_id":    this.ref_id,
        "val":       this.val,
        "form_id":   'actionProcess',
      };
      AjaxAlina.newInst({
        method:     'POST',
        url:        this.options.urlLike,
        postParams: o,
        onDone:     (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            this.dAmountLikes      = aja.respBody.data.AmountLikes;
            this.dCurrentUserLiked = aja.respBody.data.CurrentUserLiked;
          }
        }
      })
      .go();
    },
    ajaGetFeed() {
      if (this.dAmountLikes < 1) {return;}
      const ps        = this.feedPagination.pageSize;
      const pn        = this.feedPagination.pageCurrentNumber;
      const ref_table = this.ref_table;
      const ref_id    = this.ref_id;
      AjaxAlina.newInst({
        method: 'GET',
        url:    `${this.options.urlFeed}/${ps}/${pn}/${ref_table}/${ref_id}`,
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            this.feed           = aja.respBody.data;
            this.feedPagination = aja.respBody.meta.lk;
            this.flagModalShown = true;
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
  }
};
</script>

<style scoped></style>
