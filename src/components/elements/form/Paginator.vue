<template>
  <div
    v-if="pagesTotal > 1"
    style=""
    class="d-flex justify-content-between mt-3 mb-3"
  >
    <div
      class="btn btn-sm"
      @click="onClickPage(pageSize, 1)"
      :class="[{ 'btn-secondary': 1 == pageCurrentNumber }, 'rounded-circle']"
    >
      {{ $t("i_start") }}
    </div>
    <div
      class="btn btn-sm rounded-circle"
      @click="onClickPage(pageSize, pageCurrentNumber - 1)"
    >
      {{ $t("i_previous") }}
    </div>
    <div
      v-for="(v, i) in pagesArray"
      :key="i"
      class="btn btn-sm"
      :class="[{ 'btn-secondary': v == pageCurrentNumber }, 'rounded-circle']"
      @click="onClickPage(pageSize, v)"
    >
      {{ v }}
    </div>
    <div
      class="btn btn-sm rounded-circle"
      @click="onClickPage(pageSize, pageCurrentNumber + 1)"
    >
      {{ $t("i_next") }}
    </div>
    <div
      class="btn btn-sm"
      @click="onClickPage(pageSize, pagesTotal)"
      :class="[{ 'btn-secondary': pagesTotal == pageCurrentNumber }, 'rounded-circle']"
    >
      {{ $t("i_finish") }}
    </div>
    <div class="btn btn-sm d-none d-lg-inline-block">
      {{ pageCurrentNumber }}/{{ pagesTotal }}
    </div>
    <div
      v-if="pageCurrentNumber < pagesTotal && onClickMore"
      class="btn btn-sm"
      @click="onClickMore(pageSize, pageCurrentNumber + 1)"
    >
      <span>{{ $tc("More") }} +{{ pageSize }}</span>
    </div>
    <div
      v-if="rowsTotal > pageSize && onClickAll"
      class="btn btn-sm"
      @click="onClickAll(rowsTotal, 1)"
    >
      <span>{{ $tc("TXT_FULL_LIST") }} {{ rowsTotal }} </span>
    </div>
  </div>
</template>

<script>
import AjaxAlina from "@/services/AjaxAlina";
import ConfigApi from "@/configs/ConfigApi";

export default {
  name: "Paginator",
  data() {
    return {
      pagesArray: [],
      rowStart: 0,
      rowEnd: 0,
    };
  },
  created() {
    this.calcPagesArray();
  },
  props: {
    more: {
      type: Boolean,
      default: false,
    },
    pageCurrentNumber: {
      type: Number,
      default: -1,
    },
    pageSize: {
      type: Number,
      default: 0,
    },
    rowsTotal: {
      type: Number,
      default: 0,
    },
    pagesTotal: {
      type: Number,
      default: 1234,
    },
    onClickPage: {
      type: Function,
      default: () => {},
    },
    onClickMore: {
      type: Function | null,
      default: null,
    },
    onClickAll: {
      type: Function | null,
      default: null,
    },
  },
  methods: {
    calcPagesArray() {
      let arr = new Array(this.pagesTotal).fill(null).map((x, i) => ++i);
      arr = [];
      const pcn = this.pageCurrentNumber;
      arr.unshift(pcn);
      if (pcn - 1 > 0) {
        arr.unshift(pcn - 1);
      }
      if (pcn - 2 > 0) {
        arr.unshift(pcn - 2);
      }
      if (pcn + 1 <= this.pagesTotal) {
        arr.push(pcn + 1);
      }
      if (pcn + 2 <= this.pagesTotal) {
        arr.push(pcn + 2);
      }
      // arr.unshift('Previous');
      // arr.push('Next');
      this.pagesArray = arr;
      this.rowEnd =
        this.pageCurrentNumber * this.pageSize >= this.rowsTotal
          ? this.rowsTotal
          : this.pageCurrentNumber * this.pageSize;
      //this.rowStart   = this.pageCurrentNumber * this.pageSize - this.pageSize + 1;
      this.rowStart = this.rowEnd - this.pageSize + 1;
      if (this.rowStart > this.rowEnd) {
        this.rowStart = this.rowEnd;
      }
      //if (this.rowStart <= 0) {this.rowStart = 1}
      //this.$forceUpdate();
    },
  },
  watch: {
    pagesTotal: function (newVal, oldVal) {
      this.calcPagesArray();
    },
    pageCurrentNumber: function (newVal, oldVal) {
      this.calcPagesArray();
    },
    pageSize: function (newVal, oldVal) {
      this.calcPagesArray();
    },
  },
};
</script>

<style scoped lang="scss">
.btn {
  color: #eee;
}
</style>
