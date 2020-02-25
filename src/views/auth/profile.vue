<template>
    <div class="container h-100">
        <h1>Profile {{post.mail}}</h1>
        <div class="row">
            <div class="col-lg mx-auto">
                <div class="alina-form">
                    <ui-fileupload
                            accept="image/*"
                            :multiple="false"
                            name="userfile[]"
                            @change="onChangeFileField"
                    >Select an image
                    </ui-fileupload>
                    <div class="clearfix"></div>
                    <img :src="post.emblem" width="100%">
                </div>
            </div>
            <div class="col mx-auto">
                <div class="alina-form">
                    <input type="hidden" v-model="post.form_id" class="form-control">
                    <input type="hidden" v-model="post.id" class="form-control">

                    <!--##################################################-->

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
                            <input v-model="post.birth" type="text" id="birth" class="form-control">
                            <ui-datepicker
                                    icon="eventpacks"
                                    picker-type="modal"
                                    v-model="post.birth"
                                    :startOfWeek="1"
                                    orientation="portrait"
                                    :customFormatter="customFormatter"
                            ></ui-datepicker>
                        </div>
                    </div>

                    <!--##################################################-->

                    <div class="row mt-4 justify-content-center align-items-center">
                        <div class="col-6 text-right">
                            <label for="about_myself">about_myself</label>
                        </div>
                        <div class="col-6">
                            <textarea v-model="post.about_myself" rows="10" id="about_myself" class="form-control"></textarea>
                        </div>
                    </div>

                    <!--##################################################-->
                    <!--##################################################-->
                    <!--##################################################-->


                    <StandardButtons :onGo="runAJax"></StandardButtons>
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

    export default {
        name:       "auth_profile",
        data() {
            return {
                CU:      CurrentUser.obj(),
                options: {
                    url:       `${ConfigApi.url_base}/auth/profile`,
                    urlEmblem: `${ConfigApi.url_base}/FileUpload/CkEditor`
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
            StandardButtons
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
                const oAjax = AjaxAlina.newInst({
                    url:    `${this.options.url}/${id}`,
                    method: 'GET',
                    onDone: (aja) => {
                        Object.entries(this.post).forEach(([k, v]) => {
                            if (aja.respBody.data.user.hasOwnProperty(k)) {
                                if (k === "birth") {
                                    this.post[k] = new Date(aja.respBody.data.user[k] * 1000);
                                } else {
                                    this.post[k] = aja.respBody.data.user[k];
                                }
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
            customFormatter(dateObj) {
                return this.$date(dateObj, "DD MMMM YYYY");
            },
            //endregion Birth
            //##################################################
            runAJax() {
                const oAjax = AjaxAlina.newInst({
                    method:     'POST',
                    url:        this.options.url,
                    postParams: this.post,
                    onDone:     (aja) => {
                        //ToDo: ???
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
                        console.log(">>>____________________________");
                        console.log("aja onChangeFileField");
                        console.log(aja);
                        console.log(fileList);
                        console.log(event);
                        console.log("<<<____________________________");
                    }
                })
                .go();

            }
        }
    };
</script>
<!--##################################################-->
<!--##################################################-->
<!--##################################################-->
