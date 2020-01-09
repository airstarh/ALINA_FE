<template>
    <div class="container h-100">
        <div class="row align-items-center h-100">
            <div class="col-md-6 mx-auto">
                <div class="alina-form" action="" method="post" enctype="multipart/form-data">
                    <h1>Profile</h1>
                    <input type="hidden" v-model="post.form_id" class="form-control">
                    <input type="text" v-model="post.id" class="form-control">

                    <!--##################################################-->

                    <div class="row mt-4 justify-content-center align-items-center">
                        <div class="col-6 text-right">
                            <label for="mail">mail</label>
                        </div>
                        <div class="col-6">
                            <input v-model="post.mail" type="text" id="mail" class="form-control">
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
                            <input v-model="post.birth" type="text" id="birth" class="form-control">
                            <ui-datepicker
                                    icon="eventpacks"
                                    picker-type="modal"
                                    v-model="post.birth"
                                    :startOfWeek="1"
                                    orientation="portrait"
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
    import ConfigApi       from "@/configs/ConfigApi";
    import AjaxAlina       from "@/services/AjaxAlina";
    import CurrentUser     from "@/services/CurrentUser";
    import UtilsDate       from "@/Utils/UtilsDate";

    export default {
        name:       "auth_profile",
        data() {
            return {
                CU:      CurrentUser.obj(),
                options: {
                    url: `${ConfigApi.url_base}/auth/profile`
                },
                post:    {
                    id:           '',
                    mail:         '',
                    firstname:    '',
                    lastname:     '',
                    birth:        null,
                    about_myself: '',
                    // password:             '',
                    // new_password:         '',
                    // confirm_new_password: '',
                    form_id:      'profile',
                }
            }
        },
        components: {
            StandardButtons
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                const id = vm.getCurrentId(to);
                vm.fetchProfile(id);
            })
        },
        // если путь изменяется, а компонент уже отображён,
        // то логика будет немного иной
        beforeRouteUpdate(to, from, next) {
            const vm = this;
            const id = vm.getCurrentId(to);
            vm.fetchProfile(id, next);
        },
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
                    url:        this.options.url,
                    postParams: this.post,
                    method:     'POST',
                    onDone:     (aja) => {
                        //ToDo: ???
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
