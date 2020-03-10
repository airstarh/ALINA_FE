<template>
    <div class="container">
        <div class="row">
            <div class="col-11">
                <h1>{{post.firstname || post.mail}} {{post.lastname}}</h1>
            </div>
            <div class="col" v-if="CU.ownsOrAdminOrModerator(post.id)">
                <span @click="options.modeEdit = !options.modeEdit" class="btn btn-info">Edit</span>
            </div>
        </div>
        <div v-if="options.modeEdit">
            <div class="row">
                <div class="col-6">
                    <div class="alina-form">
                        <ui-fileupload
                                accept="image/*"
                                :multiple="false"
                                name="userfile[]"
                                @change="onChangeFileField"
                        >Select an image
                        </ui-fileupload>
                        <a :href="post.emblem" target="_blank">
                            <img :src="post.emblem" width="100%">
                        </a>
                    </div>
                </div>
                <div class="col-6">
                    <div class="alina-form">
                        <input type="hidden" v-model="post.form_id" class="form-control">
                        <input type="hidden" v-model="post.id" class="form-control">

                        <!--##################################################-->

                        <!--##################################################-->
                        <div class="row mt-4 justify-content-center align-items-center">
                            <div class="col-12 text-center">
                                <a :href="'mailto:'+post.mail">
                                    {{post.mail}}
                                </a>
                            </div>
                        </div>
                        <!--##################################################-->

                        <div class="row mt-4 justify-content-center align-items-center">
                            <div class="col-6 text-right">
                                <label for="firstname">firstname</label>
                            </div>
                            <div class="col-6">
                                <input v-model="post.firstname" type="text" id="firstname" class="form-control">
                            </div>
                        </div>

                        <!--##################################################-->

                        <div class="row mt-4 justify-content-center align-items-center">
                            <div class="col-6 text-right">
                                <label for="lastname">lastname</label>
                            </div>
                            <div class="col-6">
                                <input v-model="post.lastname" type="text" id="lastname" class="form-control">
                            </div>
                        </div>

                        <!--##################################################-->

                        <div class="row mt-4 justify-content-center align-items-center">
                            <div class="col-6 text-right">
                                <label for="birth">birth</label>
                            </div>
                            <div class="col-6">
                                <ui-datepicker
                                        icon="eventpacks"
                                        picker-type="modal"
                                        :value="post.birth | unix_secs_to_date_obj"
                                        @input="onChangeDateField('post.birth', $event)"
                                        :startOfWeek="1"
                                        orientation="portrait"
                                        :customFormatter="uiDatePickerCustomFormatter"
                                ></ui-datepicker>
                            </div>
                        </div>

                        <!--##################################################-->
                        <StandardButtons :onGo="runAJax"></StandardButtons>
                    </div>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col">
                    <ckeditor
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
        <div v-if="!options.modeEdit">
            <div class="row">
                <div class="col-6">
                    <a :href="post.emblem" target="_blank">
                        <img :src="post.emblem" width="100%">
                    </a>
                </div>
                <div class="col-6">
                    <div>
                        <!--##################################################-->
                        <div class="row mt-4 justify-content-center align-items-center">
                            <div class="col-12 text-center">
                                <a :href="'mailto:'+post.mail">
                                    {{post.mail}}
                                </a>
                            </div>
                        </div>
                        <!--##################################################-->

                        <div class="row mt-4 justify-content-center align-items-center">
                            <div class="col-6 text-right">
                                <label for="firstname">firstname</label>
                            </div>
                            <div class="col-6">
                                {{post.firstname}}
                            </div>
                        </div>

                        <!--##################################################-->

                        <div class="row mt-4 justify-content-center align-items-center">
                            <div class="col-6 text-right">
                                <label for="lastname">lastname</label>
                            </div>
                            <div class="col-6">
                                {{post.lastname}}
                            </div>
                        </div>

                        <!--##################################################-->

                        <div class="row mt-4 justify-content-center align-items-center">
                            <div class="col-6 text-right">
                                <label for="birth">birth</label>
                            </div>
                            <div class="col-6">
                                {{post.birth | unix_to_date }}
                            </div>
                        </div>

                        <!--##################################################-->
                    </div>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col">
                    <div class="ck-content">
                        <div v-html="post.about_myself"></div>
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
    // @ is an alias to /src
    import StandardButtons from "@/components/elements/form/StandardButtons";
    import ConfigApi from "@/configs/ConfigApi";
    import AjaxAlina from "@/services/AjaxAlina";
    import CurrentUser from "@/services/CurrentUser";
    import UtilsDate from "@/Utils/UtilsDate";
    import UtilsData from "@/Utils/UtilsData";
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
                CU:      CurrentUser.obj(),
                options: {
                    CkEditorConfig: ConfigCkEditor,
                    CkEditorObj:    ClassicEditor,
                    url:            `${ConfigApi.url_base}/auth/profile`,
                    urlEmblem:      `${ConfigApi.url_base}/FileUpload/CkEditor`,
                    dateFields:     ['birth'],
                    modeEdit:       false,
                },
                post:    {
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
            ckeditor: CKEditor.component
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
                if (to && to.params && to.params.id) {
                    id = to.params.id;
                } else {
                    id = CurrentUser.obj().attributes.id;
                }
                if (UtilsData.empty(id)) {
                    this.$router.replace({path: `/auth/login`});
                }
                return id;
            },
            fetchProfile(id, callback) {
                AjaxAlina.newInst({
                    url:    `${this.options.url}/${id}`,
                    method: 'GET',
                    onDone: (aja) => {
                        Object.entries(this.post).forEach(([k, v]) => {
                            if (aja.respBody.data.user.hasOwnProperty(k)) {
                                // if (this.options.dateFields.includes(k)) {
                                //     this.post[k] = UtilsDate.toDateObj(aja.respBody.data.user[k], true);
                                // } else {
                                //     this.post[k] = aja.respBody.data.user[k];
                                // }
                                this.post = UtilsObject.mergeRecursively(this.post, aja.respBody.data.user);
                            }
                        });
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
            //region Birth\
            uiDatePickerCustomFormatter(dateObj) {
                return this.$date(dateObj, "YYYY-MM-DD");
            },
            //endregion Birth
            //##################################################
            runAJax() {
                const oAjax = AjaxAlina.newInst({
                    method:     'POST',
                    url:        this.options.url,
                    postParams: this.post,
                    onDone:     (aja) => {
                        if (aja.respBody.meta.alina_response_success == 1) {
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
            //##################################################
            onChangeDateField(thisKey, dateObj) {
                UtilsObject.setByPath(this, thisKey, UtilsDate.toUnixTimeSecs(dateObj));
            }
            //##################################################
        }
    };
</script>
<!--##################################################-->
<!--##################################################-->
<!--##################################################-->
