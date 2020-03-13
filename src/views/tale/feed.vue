<template>
    <div class="container">
        <div class="row">
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
                    <div class="row align-items-top mb-1">
                        <!--<router-link :to="'/auth/profile/'+tale.owner_id"
                                     class="col btn btn-primary text-left"
                        >{{tale.owner_firstname || 'Anonymous'}} {{tale.owner_lastname}}</router-link>
                        &lt;!&ndash;#####&ndash;&gt;
                        <router-link :to="'/tale/upsert/'+tale.id"
                                     class="col btn btn-info text-left"
                        >{{tale.publish_at | unix_to_date_time}}</router-link>-->
                        <!--#####-->

                        <!--#####-->
                    </div>
                    <div class="row no-gutters">
                        <h2 class="col">
                            <a :href="`${ConfigApi.url_base}/tale/upsert/${tale.id}`"
                               class="btn btn-block btn-secondary text-left"
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
                        <div class="col text-right">
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
                            <div class="ck-content">
                                <div v-html="tale.body"></div>
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
                            ></Comment>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                    <div class="clearfix"></div>
                    <div class="row">
                        <div v-if="index!=feed.length-1" class="cpl mx-auto mt-5 mb-5 text-center">
                            <!--<h4>¯\_(ツ)_/¯</h4>-->
                            <!--<img src="/divider001.png" alt="divider" height="80px">-->
                        </div>
                    </div>
                    <div class="clearfix"></div>
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
                ConfigApi:      ConfigApi,
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
