<template>
    <div class="nav text-center">
        <<<
        <span
                v-for="(v, i) in pagesArray"
                class="nav-item nav-link btn"
                :class="{ 'btn-primary': v==pageCurrentNumber}"
                @click="onClickPage(pageSize, v)"
        >
            {{v}}
        </span>
        >>>
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
            }
        },
        created(){
            //this.calcPagesArray();
        },
        props:   {
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
            onClickPage:       Function,
        },
        methods: {
            calcPagesArray() {
                const arr = new Array(this.pagesTotal).fill(null).map((x, i) => ++i);
                // arr.unshift('Previous');
                // arr.push('Next');
                this.pagesArray = arr;
                //this.$forceUpdate();
            }
        },
        watch:   {
            pagesTotal: function (newVal, oldVal) {
                this.calcPagesArray();
            }
        }
    }
</script>

<style scoped lang="scss"></style>
