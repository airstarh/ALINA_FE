<template>
    <div class="container p-0">
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
                    <!-- region Tale -->
                    <div v-for="(tale, index) in feed" v-bind:key="tale.id">
                        <transition name="slide-fade">
                            <div
                                    :key="`${tale.id}_1`"
                                    v-if="tale.is_adult_denied == 1 && !feedForceShow.includes(tale.id)"
                                    >
                                <div class="row no-gutters mb-5">
                                    <div class="img-wrapper">
                                        <img class="img-responsive" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Parental_Advisory_label.svg/500px-Parental_Advisory_label.svg.png">
                                        <div class="img-overlay">
                                            <button
                                                    class="btn btn-lg btn-block btn-primary"
                                                    @click="feedForceShow.push(tale.id)"
                                            >I am ready to watch dangerous content
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else :key="`${tale.id}_2`">
                                <div class="row no-gutters">
                                    <h2 class="notranslate col" :lang="tale.lang">
                                        <a :href="`${ConfigApi.url_base}/tale/upsert/${tale.id}`"
                                           class="btn btn-block text-left display-3"
                                           :class="{
                                   'btn-secondary':tale.is_adult_denied==0,
                                   'btn-danger':tale.is_adult_denied==1
                                   }"
                                           target="_blank"
                                        >{{tale.header || '¯\_(ツ)_/¯' }}</a>
                                    </h2>
                                </div>
                                <div class="row no-gutters">
                                    <div class="col-auto" v-if="doShowAuthorInfo">
                                        <div class="fixed-height-150px">
                                            <router-link :to="'/auth/profile/'+tale.owner_id">
                                                <img v-if="tale.owner_emblem" :src="tale.owner_emblem" width="150px" class="rounded-circle">
                                                <img v-if="!tale.owner_emblem" src="../../assets/anarki.png" width="150px" class="rounded-circle">
                                            </router-link>
                                        </div>
                                    </div>
                                    <div class="notranslate col text-right">
                                        <router-link v-if="doShowAuthorInfo" :to="'/auth/profile/'+tale.owner_id"
                                                     class="btn btn-sm btn-primary text-left text-break mb-1"
                                        >{{tale.owner_firstname || 'Anonymous'}} {{tale.owner_lastname}}
                                        </router-link>
                                        <div class="clearfix"></div>
                                        <router-link :to="'/tale/upsert/'+tale.id"
                                                     class="btn btn-sm btn-info text-left mb-1">
                                            {{tale.publish_at | unix_to_date_time}}
                                        </router-link>
                                        <br>
                                    </div>

                                </div>
                                <div class="row no-gutters">
                                    <div class="col">
                                        <div class="ck-content" :lang="tale.lang">
                                            <div class="notranslate" v-html="tale.body"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <Like
                                            :pAmountLikes="tale.count_like"
                                            :pCurrentUserLiked="tale.current_user_liked"
                                            ref_table="tale"
                                            :ref_id="tale.id"
                                    ></Like>
                                </div>
                                <div class="row no-gutters">
                                    <div class="col">
                                        <Comment
                                                :level="1"
                                                type="COMMENT"
                                                :root_tale_id="tale.root_tale_id ? tale.root_tale_id : tale.id"
                                                :answer_to_tale_id="tale.id"
                                                :count_by_answer_to_tale_id="tale.count_root_tale_id"
                                        ></Comment>
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </div>
                    <!-- endregion Tale -->
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
<script>
    import UtilsData from "@/Utils/UtilsData";
    import StandardButtons from "@/components/elements/form/StandardButtons";
    import ConfigApi from "@/configs/ConfigApi";
    import AjaxAlina from "@/services/AjaxAlina";
    import CurrentUser from "@/services/CurrentUser";
    import Comment from "@/components/elements/form/Comment";
    import Like from "@/components/elements/form/Like";
    import Paginator from "@/components/elements/form/Paginator";
    import UtilsArray from "@/Utils/UtilsArray";
    import Obj from "@/Utils/UtilsObject";
    export default {
        name:       "tale_feed",
        components: {
            StandardButtons,
            Comment,
            Like,
            Paginator
        },
        props:      {
            // #####
            doShowAuthorInfo: {
                type:    Boolean,
                default: true,
            },
            // #####
            queryProps:       {
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
                feedForceShow:  [],
            }
        },
        created() {
            this.ajaGetFeed();
        },
        methods:    {
            queryFunction(q = {}) {
                const res   = Obj.eraseEmpty({
                    ...{},
                    ...this.queryData,
                    ...q
                });
                const path1 = this.$router.currentRoute.path;
                this.$router.push({path: path1, query: res});
            },
            ajaGetFeed() {
                AjaxAlina.newInst({
                    method:    'GET',
                    url:       `${this.options.urlFeed}/${this.feedPagination.pageSize}/${this.feedPagination.pageCurrentNumber}`,
                    getParams: {...{}, ...this.queryProps, ...this.$route.query},
                    onDone:    (aja) => {
                        if (aja.respBody.meta.alina_response_success == 1) {
                            //UtilsArray.vueSensitiveConcat(this.feed, aja.respBody.data.tale);
                            this.feed                                               = aja.respBody.data.tale;
                            this.feedPagination                                     = aja.respBody.meta.tale;
                            //this.feedPagination= Obj.mergeRecursively(this.feedPagination, aja.respBody.meta.tale);
                            document.getElementById('alina-body-wrapper').scrollTop = 0;
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
            search() {
                this.queryFunction();
            },
            searchClear() {
                this.queryData.txt = '';
                this.queryFunction();
            }
        },
        watch:      {
            $route(to, from) {
                this.ajaGetFeed();
            }
        }
    };
</script>
<style>
    .btn.display-3 {
        font-size: 2rem;
    }

    /*region Centered Button*/
    .img-wrapper {
        width: 100%;
        position: relative;
    }

    .img-responsive {
        width: 100%;
        height: auto;
    }

    .img-overlay {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
    }

    .img-overlay:before {
        content: ' ';
        display: block;
        /* adjust 'height' to position overlay content vertically */
        height: 50%;
    }

    /*endregion Centered Button*/

    /**/
    .slide-fade-enter-active,
    .slide-fade-leave-active {
        transition: opacity 2.05s ease;
        opacity: 1;
        max-height: 99999px;
    }

    .slide-fade-enter {
        max-height: 0;
        opacity: 0;
    }
    .slide-fade-leave-to {
        max-height: 0;
        opacity: 0;
    }
    /*.slide-fade-leave{*/
    /*    */
    /*}*/

    /*.slide-fade-enter-to {*/
    /*    max-height: 999999px;*/
    /*    overflow: auto;*/
    /*}*/
    /**/
</style>
