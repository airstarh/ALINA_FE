<template>
    <div class="container">
        <div class="row no-gutters">
            <div class="col">
                <div class="input-group mb-3">
                    <div class="input-group-append">
                        <button @click="searchClear" class="input-group-text btn btn-danger">clear</button>
                    </div>
                    <input type="text" class="form-control" aria-label="Search" v-model="queryData.txt">
                    <div class="input-group-append">
                        <button @click="search" class="input-group-text btn btn-primary">Search</button>
                    </div>
                </div>
            </div>
        </div>
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
                    <!-- region Tale -->
                    <div v-for="(tale, index) in feed" v-bind:key="tale.id">
                        <div class="row no-gutters">
                            <h2 class="notranslate col" :lang="tale.lang">
                                <a :href="`${ConfigApi.url_base}/tale/upsert/${tale.id}`"
                                   class="btn btn-block btn-secondary text-left display-3"
                                   target="_blank"
                                >{{tale.header}}</a>
                            </h2>
                        </div>
                        <div class="row no-gutters">
                            <div class="col-auto">
                                <div class="fixed-height-150px">
                                    <router-link :to="'/auth/profile/'+tale.owner_id">
                                        <img v-if="tale.owner_emblem" :src="tale.owner_emblem" width="150px" class="rounded-circle">
                                        <img v-if="!tale.owner_emblem" src="../../assets/anarki.png" width="150x" class="rounded-circle">
                                    </router-link>
                                </div>
                            </div>
                            <div class="notranslate col text-right">
                                <router-link :to="'/auth/profile/'+tale.owner_id"
                                             class="btn btn-sm btn-primary text-left text-break mb-1"
                                >{{tale.owner_firstname || 'Anonymous'}} {{tale.owner_lastname}}
                                </router-link>
                                <br>
                                <router-link :to="'/tale/upsert/'+tale.id"
                                             class="btn btn-sm btn-info text-left mb-1">
                                    {{tale.publish_at | unix_to_date_time}}
                                </router-link>
                                <br>
                            </div>

                        </div>
                        <div class="row">
                            <div class="col">
                                <div class="ck-content" :lang="tale.lang">
                                    <div class="notranslate" v-html="tale.body"></div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col">
                                <Comment
                                        :level="1"
                                        type="COMMENT"
                                        :root_tale_id="tale.id"
                                        :answer_to_tale_id="tale.id"
                                        :count_by_answer_to_tale_id="tale.count_answer_to_tale_id"
                                ></Comment>
                            </div>
                        </div>
                        <div class="clearfix mt-5"></div>
                    </div>
                    <!-- endregion Tale -->
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
        props:      {
            queryProps: {
                type:    Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                ConfigApi:      ConfigApi,
                options:        {
                    urlFeed: `${ConfigApi.url_base}/tale/feed`,
                },
                queryData:      {
                    txt: '',
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
        //##################################################
        methods:    {
            getRouteParam(paramName, to) {
                if (UtilsData.empty(to)) {to = this.$route;}
                let res = null;
                if (to && to.params && to.params[paramName]) {
                    res = to.params[paramName];
                }
                return res;
            },
            queryFunction(q) {
                const res = Obj.eraseEmpty({
                    ...{},
                    ...this.queryData,
                    ...q
                });
                this.$router.push({path: `/tale/feed`, query: res});
            },
            //##################################################
            ajaGetFeed() {
                AjaxAlina.newInst({
                    method:    'GET',
                    url:       `${this.options.urlFeed}/${this.feedPagination.pageSize}/${this.feedPagination.pageCurrentNumber}`,
                    getParams: {...{}, ...this.queryProps, ...this.$route.query},
                    onDone:    (aja) => {
                        //UtilsArray.vueSensitiveConcat(this.feed, aja.respBody.data.tale);
                        this.feed           = aja.respBody.data.tale;
                        this.feedPagination = aja.respBody.meta.tale;
                        //this.feedPagination= Obj.mergeRecursively(this.feedPagination, aja.respBody.meta.tale);
                        //#####//#####//#####
                        document.getElementById('alina-body-wrapper').scrollTop = 0;
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
            search() {
                this.queryFunction({});
            },
            searchClear() {
                this.queryData.txt = '';
                this.queryFunction({});
            }
            //##################################################
        },
        watch:      {
            $route(to, from) {
                this.ajaGetFeed();
            }
        }
    };
</script>
<!--##################################################-->
<!--##################################################-->
<!--##################################################-->
<style>
    .btn.display-3 {
        font-size: 2rem;
    }
</style>
