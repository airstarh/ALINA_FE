<template>
    <div class="container">
        <div class="row">
            <div class="col mx-auto">
                <Paginator
                        :pageCurrentNumber="parseInt(feedPagination.pageCurrentNumber)"
                        :pageSize="parseInt(feedPagination.pageSize)"
                        :rowsTotal="parseInt(feedPagination.rowsTotal)"
                        :pagesTotal="parseInt(feedPagination.pagesTotal)"
                        :onClickPage="pageChange"
                ></Paginator>
                <!--##################################################-->
                <!--##################################################-->
                <!--##################################################-->
                <!-- region Tale -->
                <div v-for="(tale, index) in feed" v-bind:key="tale.id">
                    <hr>
                    <div class="row align-items-center">
                        <div class="col"><h3>{{tale.header}}</h3></div>
                        <div class="col-1"><h3>{{tale.id}}</h3></div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <img :src="tale.owner_emblem || 'https://www.tokkoro.com/picsup/5675648-batwoman-wallpapers.jpg'" height="50px">
                            {{tale.owner_firstname || 'Batwoman'}} {{tale.owner_lastname}}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="ck-content bg-light">
                                <div v-html="tale.body"></div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col">
                            <div>
                                <Comment
                                        :level="1"
                                        type="COMMENT"
                                        :root_tale_id="tale.id"
                                        :answer_to_tale_id="tale.id"
                                ></Comment>
                            </div>
                        </div>
                    </div>

                    <div class="clearfix"></div>
                </div>
                <!-- endregion Tale -->
                <!--##################################################-->
                <!--##################################################-->
                <!--##################################################-->

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
</template>
<!--##################################################-->
<!--##################################################-->
<!--##################################################-->
<script>
    import UtilsData from "@/Utils/UtilsData";
    import StandardButtons from "@/components/elements/form/StandardButtons";
    import ConfigApi from "@/configs/ConfigApi";
    import AjaxAlina from "@/services/AjaxAlina";
    import CurrentUser from "@/services/CurrentUser";
    import Comment from "@/components/elements/form/Comment";
    import Paginator from "@/components/elements/form/Paginator";
    //#####
    import UtilsArray from "@/Utils/UtilsArray";
    import Obj from "@/Utils/UtilsObject";
    //#####

    export default {
        name:       "tale_feed",
        components: {
            StandardButtons,
            Comment,
            Paginator
        },
        data() {
            return {
                options:        {
                    urlFeed: `${ConfigApi.url_base}/tale/feed`,
                },
                feed:           [],
                feedPagination: {
                    pageCurrentNumber: 1,
                    pageSize:          5,
                    rowsTotal:         0,
                    pagesTotal:        0,
                },
            }
        },
        //##################################################
        //region Router Hooks
        beforeRouteEnter(to, from, next) {
            next((vm) => {
                //
            })
        },
        beforeRouteUpdate(to, from, next) {
            const vm = this;
            //
            next();
        },
        //endregion Router Hooks
        //##################################################
        created() {
            this.ajaGetFeed();
        },
        methods:    {
            getRouteParam(paramName, to) {
                if (UtilsData.empty(to)) {to = this.$route;}
                let res = null;
                if (to && to.params && to.params[paramName]) {
                    res = to.params[paramName];
                }
                return res;
            },
            //##################################################
            ajaGetFeed() {
                AjaxAlina.newInst({
                    method: 'GET',
                    url:    `${this.options.urlFeed}/${this.feedPagination.pageSize}/${this.feedPagination.pageCurrentNumber}`,
                    onDone: (aja) => {
                        //UtilsArray.vueSensitiveConcat(this.feed, aja.respBody.data.tale);
                        this.feed           = aja.respBody.data.tale;
                        this.feedPagination = aja.respBody.meta.tale;
                    }
                })
                .go();
            },
            pageChange(pageSize, pageCurrentNumber) {
                this.feedPagination.pageSize          = pageSize;
                this.feedPagination.pageCurrentNumber = pageCurrentNumber;
                this.ajaGetFeed();
            },
            //##################################################

            //##################################################
        }
    };
</script>
<!--##################################################-->
<!--##################################################-->
<!--##################################################-->
