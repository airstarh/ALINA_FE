<template>
    <div class="p-0"
         :class="{
            'container':!pageIsInIframe,
            'container-fluid':pageIsInIframe
         }"
    >
        <div v-if="!tale.id">...</div>
        <div class="row no-gutters" v-if="tale.id">
            <div class="col">
                <!--region Buttons-->
                <div v-if="CU.ownsOrAdminOrModerator(tale.owner_id) && !pageIsInIframe" class="row no-gutters mb-1 m-buttons-1">
                    <button @click="ajaDeleteTale(tale)" class="col btn btn-danger">Delete</button>
                    <button @click="options.modeEdit = !options.modeEdit" class="col btn btn-info">{{options.modeEdit ? 'Cancel':'Edit'}}</button>
                    <button @click="ajaPostTale" class="col btn btn-primary" v-if="options.modeEdit">sim-sim</button>
                </div>
                <!--endregion Buttons-->
                <!--region User Info-->
                <div class="row no-gutters mt-4 " v-if="!pageIsInIframe">
                    <div class="col-auto">
                        <span class="btn-secondary text-left text-nowrap badge-pill p-2">
                            <router-link :to="'/auth/profile/'+tale.owner_id" class="fixed-height-150px">
                                <img v-if="tale.owner_emblem" :src="tale.owner_emblem" width="100px" class="rounded-circle">
                                <img v-if="!tale.owner_emblem" src="@/assets/anarki.png" width="100px" class="rounded-circle">
                            </router-link>
                            <router-link :to="'/auth/profile/'+tale.owner_id" class="text-light">
                                {{UtilsStr.fullName(tale.owner_firstname, tale.owner_lastname, tale.owner_id)}}
                            </router-link>
                        </span>
                    </div>
                </div>
                <!--endregion User Info-->
                <!--region Tale-->
                <div v-if="!pageIsInIframe">
                    <!--region Tale. mode Edit-->
                    <div class="" v-if="options.modeEdit">
                        <div>Tale #{{tale.id}}</div>
                        <h1 class="btn btn-block btn-secondary">
                            <input type="text" v-model="tale.header" placeholder="Header" class="notranslate form-control">
                        </h1>
                        <ckeditor
                                class="notranslate"
                                v-model="tale.body"
                                :editor="options.editor"
                                :config="options.editorConfig"
                        ></ckeditor>
                        <div class="mb-3"></div>
                        <div class="mb-3">
                            <input type="text" v-model="tale.iframe" placeholder="iframe" class="notranslate form-control">
                        </div>
                        <div class="mt-1 mb-3">
                            <AlinaDatePicker
                                    v-model="tale.publish_at"
                                    label="Publish at"
                                    idq="publish_at"
                                    class="notranslate"
                            ></AlinaDatePicker>
                        </div>
                        <div class="mb-3">
                            <ui-checkbox v-model="tale.is_adult_denied" :trueValue="1" :false-value="0" :checked="tale.is_adult_denied==1">Not for kids</ui-checkbox>
                        </div>
                        <div class="mb-3">
                            <ui-checkbox v-model="tale.is_adv" trueValue="1" false-value="0" :checked="tale.is_adv==1">Advertisement</ui-checkbox>
                        </div>

                        <StandardButtons :onGo="ajaPostTale"></StandardButtons>

                        <hr>
                        <div class="display-3">Result:</div>
                        <hr>
                        <div class="ck-content">
                            <div v-html="tale.body"></div>
                        </div>
                        <div v-if="tale.iframe" class="mt-3">
                            <iframe :src="tale.iframe" frameborder="1" width="100%" height="250px"></iframe>
                        </div>

                        <div v-if="CU.isAdmin()">
                            <hr>
                            <div class="display-3">HTML:</div>
                            <hr>
                            <textarea v-model="tale.body" placeholder="Body" rows="11" class="form-control"></textarea>
                        </div>
                    </div>
                    <!--endregion Tale. mode Edit-->
                    <!--region Tale. mode Read-->
                    <div v-else>
                        <div class="mt-3"></div>
                        <div class="row no-gutters mt-2 mb-2">
                            <div class="col" style="position: relative">
                                <h1 class="notranslate m-0" :lang="tale.lang">
                                    <a :href="`${ConfigApi.url_base}/tale/upsert/${tale.id}`"
                                       class="btn btn-block text-left"
                                       :class="{
                                               'btn-secondary':tale.is_adult_denied==0,
                                               'btn-danger':tale.is_adult_denied==1
                                           }"
                                    >{{tale.header || '¯\_(ツ)_/¯' }}
                                    </a>
                                </h1>
                                <div class="notranslate" style="position: absolute; right: 1%; bottom: -1.5rem;">
                                    <router-link :to="'/tale/upsert/'+tale.id"
                                                 class="btn btn-sm btn-info text-left mb-1">
                                        {{tale.publish_at | unix_to_date_time}}
                                    </router-link>
                                </div>
                            </div>
                        </div>
                        <div class="mt-5">&nbsp;</div>
                        <div class="row no-gutters">
                            <div class="col">
                                <div class="ck-content" :lang="tale.lang">
                                    <div class="notranslate" v-html="tale.body"></div>
                                </div>
                            </div>
                        </div>
                        <div v-if="tale.iframe" class="mt-3">
                            <iframe :src="tale.iframe" frameborder="1" width="100%" height="500px"></iframe>
                        </div>
                        <div class="mt-3"></div>
                    </div>
                    <!--endregion Tale. mode Read-->
                </div>
                <!--endregion Tale-->
                <!--region Share & Likes-->
                <div class="row no-gutters mb-2">
                    <div class="col">
                        <div class="text-left m-buttons-1">
                            <Share :tale="tale"></Share>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="text-right">
                            <Like
                                    :pAmountLikes="tale.count_like"
                                    :pCurrentUserLiked="tale.current_user_liked"
                                    ref_table="tale"
                                    :ref_id="tale.id"
                            ></Like>
                        </div>
                    </div>
                </div>
                <!--endregion Share & Likes-->
                <Comment v-if="tale.level < 2"
                         :level="tale.level+1"
                         type="COMMENT"
                         :root_tale_id="tale.root_tale_id ? tale.root_tale_id : tale.id"
                         :answer_to_tale_id="tale.id"
                         :count_by_answer_to_tale_id="tale.count_root_tale_id"
                ></Comment>
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
    import AlinaDatePicker from "@/components/elements/form/AlinaDatePicker";
    import CKEditor from '@ckeditor/ckeditor5-vue';
    import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
    import ConfigCkEditor from "@/configs/ConfigCkEditor";
    import UtilsObject from "@/Utils/UtilsObject";
    import UtilsDate from "@/Utils/UtilsDate";
    import UtilsStr from "@/Utils/UtilsStr";
    import Share from "@/components/elements/form/Share";
    //import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
    //#####
    export default {
        name:       "tale_upsert",
        data() {
            return {
                UtilsStr,
                CU:        CurrentUser.obj(),
                ConfigApi: ConfigApi,
                options:   {
                    url:          `${ConfigApi.url_base}/tale/upsert`,
                    urlDelete:    `${ConfigApi.url_base}/tale/delete`,
                    editorConfig: ConfigCkEditor,
                    editor:       ClassicEditor,
                    modeEdit:     false
                },
                tale:      {
                    id:                 null,
                    header:             '',
                    body:               '',
                    publish_at:         '',
                    is_submitted:       0,
                    form_id:            'actionUpsert',
                    owner_emblem:       '',
                    owner_firstname:    '',
                    owner_lastname:     '',
                    owner_id:           '',
                    count_like:         '',
                    current_user_liked: '',
                    router_alias:       {
                        id:    null,
                        url:   null,
                        alias: null,
                    },
                }
            }
        },
        components: {
            Share,
            StandardButtons,
            ckeditor: CKEditor.component,
            Comment,
            Like,
            AlinaDatePicker
        },
        //##################################################
        //region Router Hooks
        mounted() {
            const vm = this;
            const id = vm.getRouteParam('id');
            vm.ajaxGetTale(id);
        },
        updated() {
        },
        // beforeRouteEnter(to, from, next) {
        //     next((vm) => {
        //         const id = vm.getRouteParam('id', to);
        //         vm.ajaxGetTale(id);
        //     })
        // },
        // beforeRouteUpdate(to, from, next) {
        //     const vm = this;
        //     const id = vm.getRouteParam('id', to);
        //     vm.ajaxGetTale(id);
        //     next();
        // },
        //endregion Router Hooks
        //##################################################
        computed:   {
            pageIsInIframe() {
                return this.ConfigApi.pageIsInIframe();
            }
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
            ajaPostTale() {
                AjaxAlina.newInst({
                    method:     'POST',
                    url:        this.options.url,
                    postParams: this.tale,
                    onDone:     (aja) => {
                        if (aja.respBody.meta.alina_response_success == 1) {
                            this.tale             = aja.respBody.data;
                            this.options.modeEdit = false;
                        }
                    }
                })
                .go();
            },
            ajaxGetTale(id) {
                const _t = this;
                //###############
                //region Fix Double get
                if (!UtilsData.empty(id) && id == _t.tale.id) {
                    return null;
                }
                //endregion Fix Double get
                //###############
                AjaxAlina.newInst({
                    method: 'GET',
                    url:    id
                            ? `${_t.options.url}/${id}`
                            : `${_t.options.url}`
                    ,
                    onDone: (aja) => {
                        if (aja.respBody.meta.alina_response_success == 1) {
                            _t.tale = aja.respBody.data;
                            if (_t.tale.is_submitted == 0) {_t.options.modeEdit = true;}
                            //###############
                            //region Fix Double get
                            if (UtilsData.empty(id) && !UtilsData.empty(_t.tale.id)) {
                                _t.$router.replace({path: `/tale/upsert/${_t.tale.id}`});
                            }
                            //endregion Fix Double get
                            //###############
                        }
                    }
                })
                .go();
            },
            ajaDeleteTale(tale) {
                if (!confirm("Are you sure?")) {return;}
                const _t     = this;
                tale.form_id = 'actionDelete';
                AjaxAlina.newInst({
                    method:     'POST',
                    url:        `${this.options.urlDelete}/${tale.id}`,
                    postParams: tale,
                    onDone:     (aja) => {
                        if (aja.respBody.meta.alina_response_success == 1) {
                            _t.$router.replace({path: `/tale/feed`});
                        }
                    }
                })
                .go();
            },
        }
    };
</script>