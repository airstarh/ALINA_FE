<template>
    <div class="container h-100">
        <div class="row align-items-center h-100">
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
        methods:    {
            runAJax() {
                const oAjax = AjaxAlina.newInst({
                    url:        this.options.url,
                    postParams: this.post,
                    method:     'POST',
                    onDone:     (aja) => {
                        //...
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
