<template>
    <div class="container p-0">
        <div class="row no-gutters m-buttons-1" v-if="CU.ownsOrAdminOrModerator(post.id)">
            <button @click="ajaDeleteUser(post)" class="col btn btn-danger">Suicide</button>
            <button @click="options.modeEdit = !options.modeEdit" class="col btn btn-info">{{options.modeEdit ? 'Cancel':'Edit'}}</button>
        </div>
        <div class="row no-gutters">
            <div class="col">
                <div class="mt-2"></div>
                <h5 class="text-break">Profile #{{post.id}}</h5>
                <div class="mt-2"></div>
            </div>
        </div>
        <div :key="curId">
            <!--region Edit Mode-->
            <div v-if="options.modeEdit" class="text-break">
                <div class="row no-gutters p-0">
                    <div class="col-md-4 m-0">
                        <div class="alina-form">
                            <ui-fileupload
                                    accept="image/*"
                                    :multiple="false"
                                    :name="ConfigApi.ALINA_FILE_UPLOAD_KEY"
                                    @change="onChangeFileField"
                            >Select an image
                            </ui-fileupload>
                            <a :href="post.emblem" target="_blank">
                                <img v-if="post.emblem" :src="post.emblem" width="100%" class="rounded">
                                <img v-if="!post.emblem" src="../../assets/anarki.png" width="100%">
                            </a>
                        </div>
                    </div>
                    <div class="col pl-1 m-0">
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
            <!--endregion Edit Mode-->
            <!--region  Read Mode-->
            <div v-else class="text-break">
                <div class="row no-gutters">
                    <div class="col-md-4">
                        <a :href="post.emblem" target="_blank">
                            <img v-if="post.emblem" :src="post.emblem" width="100%" class="rounded">
                            <img v-if="!post.emblem" src="../../assets/anarki.png" width="100%">
                        </a>
                    </div>
                    <div class="col pl-2">
                        <!--##################################################-->
                        <div class="row no-gutters mb-1 justify-content-center align-items-center">
                            <h3 class="notranslate col font-weight-bold">
                                {{UtilsStr.fullName(post.firstname, post.lastname, post.id)}}
                            </h3>
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
            <!--endregion  Read Mode-->
        </div>
        <div class="mt-5"></div>
        <tale_feed
                :doShowAuthorInfo="false"
                :queryProps="{'owner':curId}"
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
    import UtilsStr from "@/Utils/UtilsStr";
    //#####
    export default {
        name:       "auth_profile",
        data() {
            return {
                UtilsStr,
                ConfigApi: ConfigApi,
                CU:        CurrentUser.obj(),
                options:   {
                    CkEditorConfig: ConfigCkEditor,
                    CkEditorObj:    ClassicEditor,
                    url:            `${ConfigApi.url_base}/auth/profile`,
                    urlEmblem:      `${ConfigApi.url_base}/FileUpload/CkEditor`,
                    urlDelete:      `${ConfigApi.url_base}/auth/UserDelete`,
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
        created() {
            const vm = this;
            const id = this.curId;
            vm.fetchProfile(id);
        },
        methods:    {
            //##################################################
            //region Define User
            fetchProfile(id, callback) {
                AjaxAlina.newInst({
                    url:    `${this.options.url}/${id}`,
                    method: 'GET',
                    onDone: (aja) => {
                        if (aja.respBody.meta.alina_response_success == 1) {
                            this.post             = UtilsObject.mergeRecursively(this.post, aja.respBody.data.user);
                            this.options.modeEdit = false;
                        }
                    }
                })
                .go();
            },
            //endregion Define User
            //##################################################
            ajaDeleteUser(post) {
                if (!confirm("Are you sure?")) {return;}
                if (!confirm("Are you REALLY sure???")) {return;}
                const _t     = this;
                post.form_id = 'actionUserDelete';
                AjaxAlina.newInst({
                    method:     'POST',
                    url:        `${this.options.urlDelete}/${post.id}`,
                    postParams: post,
                    onDone:     (aja) => {
                        if (aja.respBody.meta.alina_response_success == 1) {
                            _t.$router.replace({path: `/tale/feed`});
                        }
                    }
                })
                .go();
            },
            //##################################################
            runAJax() {
                AjaxAlina.newInst({
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
                        if (aja.respBody.meta.alina_response_success == 1) {
                            this.post.emblem = aja.respBody.data.url;
                        }
                    }
                })
                .go();
            },
        },
        computed:   {
            curId() {
                let id = null;
                if (this && this.$route && this.$route.params && this.$route.params.id) {
                    id = this.$route.params.id;
                } else {
                    id = CurrentUser.obj().attributes.id;
                }
                return id;
            }
        }
    };
</script>
