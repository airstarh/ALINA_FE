<template>
    <div class="container">
        <div class="row align-items-center vh-almost-100">
            <div class="col-md-6 mx-auto">
                <router-link to="/auth/reset_password_request"
                             class="btn btn-sm btn-primary"
                >Reset password
                </router-link>
                &nbsp;
                <router-link to="/auth/register"
                             class="btn btn-sm btn-primary"
                >Register
                </router-link>
                <div class="alina-form">
                    <h1>Login</h1>
                    <input type="text" v-model="post.mail" placeholder="Mail" class="form-control">
                    <input type="password" v-model="post.password" placeholder="Password" class="form-control">
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
    export default {
        name:       "auth_login",
        data() {
            return {
                referer: null,
                CurrentUser,
                options: {
                    url: `${ConfigApi.url_base}/auth/login`
                },
                post:    {
                    mail:     '',
                    password: '',
                    form_id:  'login',
                }
            }
        },
        components: {
            StandardButtons
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.referer = from.path;
            })
        },
        created() {
            if (this.CurrentUser.obj().isLoggedIn()) {
                this.$router.replace({path: '/tale/feed'});
            }
        },
        methods:    {
            runAJax() {
                const _t = this;
                AjaxAlina.newInst({
                    url:        this.options.url,
                    postParams: this.post,
                    method:     'POST',
                    onDone:     (aja) => {
                        if (aja.respBody.meta.alina_response_success == 1) {
                            if (history) {
                                history.go(-1);
                                return true;
                            }
                            if (_t.referer) {
                                _t.$router.replace({path: _t.referer});
                            } else {
                                _t.$router.replace({path: '/tale/feed'});
                            }
                        }
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
