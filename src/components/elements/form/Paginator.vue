<template>
    <div class="text-center">
        <span v-if="pageCurrentNumber<pagesTotal">
            <span class="btn" @click="onClickPage(pageSize, 1)"> <<< </span>
            <span class="btn" @click="onClickPage(pageSize, pageCurrentNumber-1)"> < </span>
            <span
                    v-for="(v, i) in pagesArray"
                    class="btn"
                    :class="{ 'btn-primary': v==pageCurrentNumber}"
                    @click="onClickPage(pageSize, v)"
            >
                {{v}}
            </span>
            <span class="btn" @click="onClickPage(pageSize, pageCurrentNumber+1)"> > </span>
            <span class="btn" @click="onClickPage(pageSize, pagesTotal)"> >>> </span>
            <span class="btn">{{pageCurrentNumber}}/{{pagesTotal}}</span>
            <span class="btn">{{rowStart}}-{{rowEnd}}/{{rowsTotal}}</span>
            <span class="btn" @click="onClickMore(pageSize, pageCurrentNumber+1)">More</span>
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
            //this.calcPagesArray();
        },
        props:   {
            more:              {
                type:    Boolean,
                default: false
            },
            pageCurrentNumber: {
                type:    Number,
                default: 1
            },
            pageSize:          {
                type:    Number,
                default: 3
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
                type:    Function,
                default: () => {}
            },
        },
        methods: {
            calcPagesArray() {
                const arr = new Array(this.pagesTotal).fill(null).map((x, i) => ++i);
                // arr.unshift('Previous');
                // arr.push('Next');
                this.pagesArray = arr;
                this.rowStart   = this.pageCurrentNumber * this.pageSize - this.pageSize + 1;
                this.rowEnd     = this.pageCurrentNumber * this.pageSize >= this.rowsTotal ? this.rowsTotal : this.pageCurrentNumber * this.pageSize;
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

<style scoped lang="scss"></style>
