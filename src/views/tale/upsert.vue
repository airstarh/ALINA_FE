<template>
    <div class="container">
        <div class="row">
            <div class="col mx-auto">
                <!---->
                <!---->
                <!---->
                <div v-if="CU.ownsOrAdminOrModerator(post.owner_id)" class="row mb-1">
                    <div @click="ajaDeleteTale(post)" class="col btn btn-danger">Delete</div>
                    <div @click="options.modeEdit = !options.modeEdit" class="col btn btn-info">{{options.modeEdit ? 'Cancel':'Edit'}}</div>
                </div>

                <div class="row no-gutters mt-4">
                    <div class="col-auto">
                        <div class="fixed-height-150px">
                            <router-link :to="'/auth/profile/'+post.owner_id">
                                <img v-if="post.owner_emblem" :src="post.owner_emblem" width="100px" class="rounded-circle">
                                <img v-if="!post.owner_emblem" src="../../assets/anarki.png" width="100px" class="rounded-circle">
                            </router-link>
                        </div>
                    </div>
                    <div class="col text-right">
                        <router-link :to="'/auth/profile/'+post.owner_id"
                                     class="btn btn-sm btn-primary text-left text-break mb-1"
                        >{{post.owner_firstname || 'Anonymous'}} {{post.owner_lastname}}
                        </router-link>
                        <br>
                        <router-link :to="'/tale/upsert/'+post.id"
                                     class="btn btn-sm btn-info text-left mb-1">
                            {{post.publish_at | unix_to_date_time}}
                        </router-link>
                        <br>
                    </div>

                </div>
                <!--##################################################-->
                <!--##################################################-->
                <!--##################################################-->
                <div class="alina-form" v-if="options.modeEdit">
                    <div>#{{post.id}}</div>
                    <input type="text" v-model="post.header" placeholder="Header" class="form-control">
                    <ckeditor
                            v-model="post.body"
                            :editor="options.editor"
                            :config="options.editorConfig"
                    ></ckeditor>
                    <!---->
                    <!---->
                    <!---->
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">Publish at</span>
                        </div>
                        <ui-datepicker
                                picker-type="modal"
                                orientation="portrait"
                                :value="post.publish_at | unix_secs_to_date_obj"
                                @input="onChangeDateField('post.publish_at', $event)"
                                :startOfWeek="1"
                                :customFormatter="uiDatePickerCustomFormatter"
                        ></ui-datepicker>
                    </div>
                    <StandardButtons :onGo="runAJax"></StandardButtons>
                    <hr>
                    <div class="ck-content">
                        <div v-html="post.body"></div>
                    </div>
                    <StandardButtons :onGo="runAJax"></StandardButtons>
                    <hr>
                    <div v-if="CU.isAdmin()">
                        <textarea v-model="post.body" placeholder="Body" rows="11" class="form-control"></textarea>
                    </div>
                </div>
                <!--##################################################-->
                <!--##################################################-->
                <!--##################################################-->
                <div v-if="!options.modeEdit">
                    <div class="row no-gutters mt-4 mb-2">
                        <h1 class="col">
                            <a :href="`${ConfigApi.url_base}/tale/upsert/${post.id}`"
                               class="btn btn-block btn-secondary text-left"
                               target="_blank"
                            >{{post.header}}</a>
                        </h1>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="ck-content">
                                <div v-html="post.body"></div>
                            </div>
                        </div>
                    </div>

                    <Comment v-if="post.level < 2"
                             :level="post.level+1"
                             type="COMMENT"
                             :root_tale_id="post.id"
                             :answer_to_tale_id="post.id"
                    ></Comment>
                </div>
                <!--    -->
                <!--    -->
                <!--    -->
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
    //#####
    import CKEditor from '@ckeditor/ckeditor5-vue';
    import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
    import ConfigCkEditor from "@/configs/ConfigCkEditor";
    import UtilsObject from "@/Utils/UtilsObject";
    import UtilsDate from "@/Utils/UtilsDate";
    //import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
    //#####

    export default {
        name:       "tale_upsert",
        data() {
            return {
                CU:        CurrentUser.obj(),
                ConfigApi: ConfigApi,
                options:   {
                    url:          `${ConfigApi.url_base}/tale/upsert`,
                    urlDelete:    `${ConfigApi.url_base}/tale/delete`,
                    editorConfig: ConfigCkEditor,
                    editor:       ClassicEditor,
                    modeEdit:     false
                },
                post:      {
                    id:              null,
                    header:          '',
                    body:            '',
                    publish_at:      '',
                    is_submitted:    0,
                    form_id:         'actionUpsert',
                    owner_emblem:    '',
                    owner_firstname: '',
                    owner_lastname:  '',
                    owner_id:        '',
                }
            }
        },
        components: {
            StandardButtons,
            ckeditor: CKEditor.component,
            Comment,
        },
        //##################################################
        //region Router Hooks
        beforeRouteEnter(to, from, next) {
            next((vm) => {
                const id = vm.getRouteParam('id', to);
                vm.ajaxGetTale(id);
            })
        },
        beforeRouteUpdate(to, from, next) {
            const vm = this;
            const id = vm.getRouteParam('id', to);
            vm.ajaxGetTale(id);
            next();
        },
        //endregion Router Hooks
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

            runAJax() {
                AjaxAlina.newInst({
                    method:     'POST',
                    url:        this.options.url,
                    postParams: this.post,
                    onDone:     (aja) => {
                        if (aja.respBody.meta.alina_response_success == 1) {
                            this.post             = aja.respBody.data;
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
                if (!UtilsData.empty(id) && id == _t.post.id) {
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
                        _t.post = aja.respBody.data;
                        if (_t.post.is_submitted == 0) {_t.options.modeEdit = true;}
                        //###############
                        //region Fix Double get
                        if (UtilsData.empty(id)) {
                            _t.$router.replace({path: `/tale/upsert/${_t.post.id}`});
                        }
                        //endregion Fix Double get
                        //###############
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

            uiDatePickerCustomFormatter(dateObj) {
                return this.$date(dateObj, "YYYY-MM-DD");
            },

            onChangeDateField(thisKey, dateObj) {
                UtilsObject.setByPath(this, thisKey, UtilsDate.toUnixTimeSecs(dateObj));
            },
        }
    };
</script>