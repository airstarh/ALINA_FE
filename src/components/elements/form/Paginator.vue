<template>
    <div>
        <span v-if="pagesTotal>1">
            <span class="btn" @click="onClickPage(pageSize, 1)" :class="{ 'btn-secondary': 1==pageCurrentNumber}"> &lt;&lt;&lt; </span>
            <span class="btn" @click="onClickPage(pageSize, pageCurrentNumber-1)"> &lt; </span>
            <span
                    v-for="(v, i) in pagesArray"
                    :key="i"
                    class="btn"
                    :class="{ 'btn-secondary': v==pageCurrentNumber}"
                    @click="onClickPage(pageSize, v)"
            >{{v}}</span>
            <span class="btn" @click="onClickPage(pageSize, pageCurrentNumber+1)"> &gt; </span>
            <span class="btn" @click="onClickPage(pageSize, pagesTotal)" :class="{ 'btn-secondary': pagesTotal==pageCurrentNumber}"> &gt;&gt;&gt; </span>
        </span>
        <span v-if="pagesTotal>1">
            <span class="btn">{{pageCurrentNumber}}/{{pagesTotal}}</span>
        </span>
        <!--<span class="btn">{{rowStart}}-{{rowEnd}}/{{rowsTotal}}</span>-->
        <span v-if="pageCurrentNumber<pagesTotal">
            <span v-if="onClickMore" class="btn" @click="onClickMore(pageSize, pageCurrentNumber+1)">More(+{{pageSize}})</span>
        </span>
        <span v-if="rowsTotal > pageSize">
            <span v-if="onClickAll" class="btn" @click="onClickAll(rowsTotal, 1)">All({{rowsTotal}})</span>
        </span>
    </div>
</template>

<script>
    import AjaxAlina from "@/services/AjaxAlina";
    import ConfigApi from "@/configs/ConfigApi";
    export default {
        name:    "Paginator",
        data() {
            return {
                pagesArray: [],
                rowStart:   0,
                rowEnd:     0,
            }
        },
        created() {
            this.calcPagesArray();
        },
        props:   {
            more:              {
                type:    Boolean,
                default: false
            },
            pageCurrentNumber: {
                type:    Number,
                default: -1
            },
            pageSize:          {
                type:    Number,
                default: 0
            },
            rowsTotal:         {
                type:    Number,
                default: 0
            },
            pagesTotal:        {
                type:    Number,
                default: 1234
            },
            onClickPage:       {
                type:    Function,
                default: () => {}
            },
            onClickMore:       {
                type:    Function | null,
                default: null
            },
            onClickAll:        {
                type:    Function | null,
                default: null
            }
        },
        methods: {
            calcPagesArray() {
                let arr   = new Array(this.pagesTotal).fill(null).map((x, i) => ++i);
                arr       = [];
                const pcn = this.pageCurrentNumber;
                arr.unshift(pcn);
                if (pcn - 1 > 0) {arr.unshift(pcn - 1)}
                if (pcn - 2 > 0) {arr.unshift(pcn - 2)}
                if (pcn + 1 <= this.pagesTotal) {arr.push(pcn + 1)}
                if (pcn + 2 <= this.pagesTotal) {arr.push(pcn + 2)}
                // arr.unshift('Previous');
                // arr.push('Next');
                this.pagesArray = arr;
                this.rowEnd     = this.pageCurrentNumber * this.pageSize >= this.rowsTotal ? this.rowsTotal : this.pageCurrentNumber * this.pageSize;
                //this.rowStart   = this.pageCurrentNumber * this.pageSize - this.pageSize + 1;
                this.rowStart   = this.rowEnd - this.pageSize + 1;
                if (this.rowStart > this.rowEnd) {this.rowStart = this.rowEnd}
                //if (this.rowStart <= 0) {this.rowStart = 1}
                //this.$forceUpdate();
            }
        },
        watch:   {
            pagesTotal:        function (newVal, oldVal) {
                this.calcPagesArray();
            },
            pageCurrentNumber: function (newVal, oldVal) {
                this.calcPagesArray();
            },
            pageSize:          function (newVal, oldVal) {
                this.calcPagesArray();
            }
        }
    }
</script>

<style scoped lang="scss">
    .btn {
        color: #eee;
    }
</style>
