<template>
    <div class="container p-0">
        <div class="row no-gutters" v-if="CU.ownsOrAdminOrModerator(post.id)">
            <div @click="options.modeEdit = !options.modeEdit" class="col btn btn-info">{{options.modeEdit ? 'Cancel':'Edit'}}</div>
        </div>
        <div class="row no-gutters">
            <div class="col">
                <h5 class="text-break">Profile #{{post.id}}</h5>
            </div>
        </div>
        <div v-if="options.modeEdit" class="text-break">
            <div class="row no-gutters">
                <div class="col-4">
                    <div class="alina-form">
                        <ui-fileupload
                                accept="image/*"
                                :multiple="false"
                                :name="ConfigApi.ALINA_FILE_UPLOAD_KEY"
                                @change="onChangeFileField"
                        >Select an image
                        </ui-fileupload>
                        <a :href="post.emblem" target="_blank">
                            <img v-if="post.emblem" :src="post.emblem" width="100%">
                            <img v-if="!post.emblem" src="../../assets/anarki.png" width="100%">
                        </a>
                    </div>
                </div>
                <div class="col pl-2">
                    <div class="alina-form">
                        <div class="row no-gutters mt-4 justify-content-center align-items-center">
                            <div class="col-12 text-center">
                                <a :href="'mailto:'+post.mail">
                                    {{post.mail}}
                                </a>
                            </div>
                        </div>
                        <!--##################################################-->

                        <div class="row no-gutters mt-4 justify-content-center align-items-center">
                            <div class="col">
                                <label for="firstname">First name</label>
                                <input v-model="post.firstname" type="text" id="firstname" class="form-control">
                            </div>
                        </div>

                        <!--##################################################-->

                        <div class="row no-gutters mt-4 justify-content-center align-items-center">
                            <div class="col">
                                <label for="lastname">Last name</label>
                                <input v-model="post.lastname" type="text" id="lastname" class="form-control">
                            </div>
                        </div>

                        <!--##################################################-->

                        <div class="row no-gutters mt-4 justify-content-center align-items-center">
                            <div class="col">
                                <AlinaDatePicker
                                        v-model="post.birth"
                                        label="Birth"
                                        idq="birth"
                                        class="notranslate"
                                ></AlinaDatePicker>
                            </div>
                        </div>

                        <!--##################################################-->
                        <StandardButtons :onGo="runAJax"></StandardButtons>
                    </div>
                </div>
            </div>
            <div class="row no-gutters mt-4">
                <div class="col">
                    <ckeditor
                            class="notranslate"
                            v-model="post.about_myself"
                            :editor="options.CkEditorObj"
                            :config="options.CkEditorConfig"
                    ></ckeditor>
                </div>
            </div>
        </div>
        <!--##################################################-->
        <!--##################################################-->
        <!--##################################################-->
        <div v-if="!options.modeEdit" class="text-break">
            <div class="row no-gutters">
                <div class="col-4">
                    <a :href="post.emblem" target="_blank">
                        <img v-if="post.emblem" :src="post.emblem" width="100%">
                        <img v-if="!post.emblem" src="../../assets/anarki.png" width="100%">
                    </a>
                </div>
                <div class="col pl-2">
                    <!--##################################################-->
                    <div class="row no-gutters mb-1 justify-content-center align-items-center">
                        <div class="notranslate col font-weight-bold">
                            {{post.firstname}} {{post.lastname}}
                        </div>
                    </div>
                    <!--##################################################-->
                    <div class="row no-gutters mb-1 justify-content-center align-items-center">
                        <div class="col">
                            {{post.birth | unix_to_date }}
                        </div>
                    </div>
                    <!--##################################################-->
                    <div class="row no-gutters mb-1 justify-content-center align-items-center">
                        <div class="col-12">
                            <a :href="'mailto:'+post.mail">
                                {{post.mail}}
                            </a>
                        </div>
                    </div>
                    <!--##################################################-->
                </div>
            </div>
            <div class="row no-gutters mt-4">
                <div class="col">
                    <div class="ck-content">
                        <div class="notranslate" v-html="post.about_myself"></div>
                    </div>
                </div>
            </div>
        </div>
        <tale_feed
                :doShowAuthorInfo="false"
                :queryProps="{'owner':getCurrentId()}"
        ></tale_feed>
    </div>
</template>
<!--##################################################-->
<!--##################################################-->
<!--##################################################-->
<script>
    // @ is an alias to /src
    import StandardButtons from "@/components/elements/form/StandardButtons";
    import ConfigApi from "@/configs/ConfigApi";
    import AjaxAlina from "@/services/AjaxAlina";
    import CurrentUser from "@/services/CurrentUser";
    import UtilsDate from "@/Utils/UtilsDate";
    import UtilsData from "@/Utils/UtilsData";
    import AlinaDatePicker from "@/components/elements/form/AlinaDatePicker";
    import tale_feed from "@/views/tale/feed";
    //#####
    import CKEditor from '@ckeditor/ckeditor5-vue';
    import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
    import ConfigCkEditor from "@/configs/ConfigCkEditor";
    import UtilsObject from "@/Utils/UtilsObject";
    //#####
    export default {
        name:       "auth_profile",
        data() {
            return {
                ConfigApi: ConfigApi,
                CU:        CurrentUser.obj(),
                options:   {
                    CkEditorConfig: ConfigCkEditor,
                    CkEditorObj:    ClassicEditor,
                    url:            `${ConfigApi.url_base}/auth/profile`,
                    urlEmblem:      `${ConfigApi.url_base}/FileUpload/CkEditor`,
                    dateFields:     ['birth'],
                    modeEdit:       false,
                },
                post:      {
                    id:           '',
                    mail:         '',
                    firstname:    '',
                    lastname:     '',
                    birth:        null,
                    about_myself: '',
                    emblem:       '',
                    form_id:      'profile',
                }
            }
        },
        components: {
            StandardButtons,
            ckeditor: CKEditor.component,
            AlinaDatePicker,
            tale_feed
        },
        //##################################################
        //region Router Hooks
        beforeRouteEnter(to, from, next) {
            next(vm => {
                const id = vm.getCurrentId(to);
                vm.fetchProfile(id);
            })
        },
        beforeRouteUpdate(to, from, next) {
            const vm = this;
            const id = vm.getCurrentId(to);
            vm.fetchProfile(id, next);
        },
        //endregion Router Hooks
        //##################################################
        created() {
        },
        methods:    {
            //##################################################
            //region Define User
            getCurrentId(to) {
                let id = null;
                if (!to) {
                    if (this && this.$router && this.$router.currentRoute && this.$router.currentRoute) {
                        to = this.$router.currentRoute;
                    }
                }
                if (to && to.params && to.params.id) {
                    id = to.params.id;
                } else {
                    id = CurrentUser.obj().attributes.id;
                }
                if (UtilsData.empty(id)) {
                    //this.$router.replace({path: `/auth/login`});
                }
                return id;
            },
            fetchProfile(id, callback) {
                AjaxAlina.newInst({
                    url:    `${this.options.url}/${id}`,
                    method: 'GET',
                    onDone: (aja) => {
                        if (aja.respBody.meta.alina_response_success == 1) {
                            this.post             = UtilsObject.mergeRecursively(this.post, aja.respBody.data.user);
                            this.options.modeEdit = false;
                        }
                        //#####
                        if (callback) {
                            callback();
                        }
                    }
                })
                .go();
            },
            //endregion Define User
            //##################################################
            runAJax() {
                const oAjax = AjaxAlina.newInst({
                    method:     'POST',
                    url:        this.options.url,
                    postParams: this.post,
                    onDone:     (aja) => {
                        if (aja.respBody.meta.alina_response_success == 1) {
                            this.post             = UtilsObject.mergeRecursively(this.post, aja.respBody.data.user);
                            this.options.modeEdit = false;
                        }
                    }
                })
                .go();
            },
            //##################################################
            onChangeFileField(fileList, event) {
                AjaxAlina.newInst({
                    method:     'POST',
                    url:        this.options.urlEmblem,
                    enctype:    'multipart/form-data',
                    postParams: {
                        "form_id":  "actionCommon",
                        "userfile": fileList,
                    },
                    onDone:     (aja) => {
                        this.post.emblem = aja.respBody.data.url;
                    }
                })
                .go();
            },
        }
    };
</script>
<!--##################################################-->
<!--##################################################-->
<!--##################################################-->
