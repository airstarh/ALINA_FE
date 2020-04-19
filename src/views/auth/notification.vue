<template>
    <div class="container p-0">
        <div v-if="feed.length == 0">List is empty</div>
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
                    <!--##################################################-->
                    <!--##################################################-->
                    <!-- region Feed -->
                    <div class="row mb-5">
                        <div class="col">
                            <button
                                    @click="ajaDeleteAll"
                                    class="btn btn-danger"
                            >Delete all
                            </button>
                        </div>
                    </div>
                    <div v-for="(item, index) in feed" v-bind:key="item.id"
                         class="row no-gutters mb-3"
                         :class="{
                            'ishown': item.is_shown
                         }"
                    >
                        <span class="col-auto">
                            <img v-if="item.from_emblem" :src="item.from_emblem" width="50px" class="rounded-circle">
                        </span>
                        <span class="col">
                            <span v-html="item.txt"></span>
                            <br>
                            <span><b>{{item.from_firstname}} {{item.from_lastname}}</b></span>
                            <br>
                            <span>
                                <i>{{item.created_at | unix_to_date_time}}</i>
                            </span>
                        </span>
                        <span class="col-auto">
                            <button
                                    class="btn btn-danger"
                                    @click="ajaDeleteItem(item.id, index)">Delete</button>
                        </span>
                        <hr>
                    </div>
                    <!-- endregion Feed -->
                    <!--##################################################-->
                    <!--##################################################-->
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
<!--##################################################-->
<!--##################################################-->
<!--##################################################-->
<script>
    import UtilsData from "@/Utils/UtilsData";
    import ConfigApi from "@/configs/ConfigApi";
    import AjaxAlina from "@/services/AjaxAlina";
    import CurrentUser from "@/services/CurrentUser";
    import Paginator from "@/components/elements/form/Paginator";
    import UtilsArray from "@/Utils/UtilsArray";
    import Obj from "@/Utils/UtilsObject";
    //#####
    export default {
        name:       "notification",
        components: {
            Paginator
        },
        props:      {
            // #####
            queryProps: {
                type:    Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                ConfigApi:      ConfigApi,
                CU:             CurrentUser.obj(),
                options:        {
                    urlFeed:        `${ConfigApi.url_base}/notification/SelectListLatest`,
                    urlMarkAsShown: `${ConfigApi.url_base}/notification/MarkAsShownEarlierThan`,
                    urlDelete:      `${ConfigApi.url_base}/notification/Delete`,
                    urlDeleteAll:   `${ConfigApi.url_base}/notification/Delete`,
                },
                queryData:      {},
                feed:           [],
                feedPagination: {
                    pageCurrentNumber: 1,
                    pageSize:          10,
                    rowsTotal:         0,
                    pagesTotal:        0,
                },
            }
        },
        //##################################################
        created() {
            this.ajaGetFeed();
        },
        //##################################################
        methods:    {
            //##################################################
            ajaGetFeed() {
                AjaxAlina.newInst({
                    method:    'GET',
                    url:       `${this.options.urlFeed}/${this.feedPagination.pageSize}/${this.feedPagination.pageCurrentNumber}`,
                    getParams: {...{}, ...this.queryProps, ...this.$route.query},
                    onDone:    (aja) => {
                        //UtilsArray.vueSensitiveConcat(this.feed, aja.respBody.data.tale);
                        if (aja.respBody.meta.alina_response_success == 1) {
                            this.feed           = aja.respBody.data;
                            this.feedPagination = aja.respBody.meta.notification;
                            if (this.feed && this.feed[0]) {
                                this.ajaMarkAsShown();
                            }
                        }
                        document.getElementById('alina-body-wrapper').scrollTop = 0;
                    }
                })
                .go();
            },
            ajaMarkAsShown() {
                const latest = this.feed[0].created_at;
                AjaxAlina.newInst({
                    method: 'GET',
                    url:    `${this.options.urlMarkAsShown}/${latest}`,
                    onDone: (aja) => {
                        if (aja.respBody.meta.alina_response_success == 1) {
                            this.CU.attributes.count_notifications = 0;
                        }
                    }
                })
                .go();
            },
            ajaDeleteItem(id, index) {
                AjaxAlina.newInst({
                    method:     'POST',
                    url:        `${this.options.urlDelete}/${id}`,
                    postParams: {form_id: "actionDelete"},
                    onDone:     (aja) => {
                        if (aja.respBody.meta.alina_response_success == 1) {
                            UtilsArray.elRemoveByIndex(this.feed, index);
                            if (this.feed.length == 0) {
                                let pageCurrentNumber =
                                        this.feedPagination.pageCurrentNumber - 1;
                                if (pageCurrentNumber > 0) {
                                    this.feedPagination.pageCurrentNumber = pageCurrentNumber;
                                } else {
                                    this.feedPagination.pageCurrentNumber = 1;
                                }
                                this.ajaGetFeed();
                            }
                        }
                    }
                })
                .go();
            },
            ajaDeleteAll() {
                if (!confirm("Are you sure?")) {return;}
                AjaxAlina.newInst({
                    method:     'POST',
                    url:        `${this.options.urlDeleteAll}`,
                    postParams: {form_id: "actionDeleteAll"},
                    onDone:     (aja) => {
                        if (aja.respBody.meta.alina_response_success == 1) {
                            this.feed = [];
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
            //##################################################
        },
        watch:      {
            $route(to, from) {
                //
            }
        }
    };
</script>
<!--##################################################-->
<!--##################################################-->
<!--##################################################-->
<style>
    .ishown {
        background-color: #d8d8d8;
    }
</style>
