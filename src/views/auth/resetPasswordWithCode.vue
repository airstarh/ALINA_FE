<template>
    <div class="container h-100">
        <div class="row align-items-center h-100">
            <div class="col-md-6 mx-auto">
                <router-link to="/auth/login"
                             class="btn btn-sm btn-primary"
                >Login
                </router-link>
                &nbsp;
                <router-link to="/auth/register"
                             class="btn btn-sm btn-primary"
                >Register
                </router-link>
                <form action="" method="post" enctype="multipart/form-data">
                    <h1>Reset password with code</h1>
                    <input type="text" v-model="post.mail" placeholder="Mail" class="form-control">
                    <input type="text" v-model="post.reset_code" placeholder="Code" class="form-control">
                    <input type="password" v-model="post.password" placeholder="Password" class="form-control">
                    <input type="password" v-model="post.confirm_password" placeholder="Confirm password" class="form-control">
                    <input type="hidden" v-model="post.form_id" class="form-control">
                    <StandardButtons :onGo="runAJax"></StandardButtons>
                </form>
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
        name:       "auth_reset_password_with_code",
        data() {
            return {
                options: {
                    url: `${ConfigApi.url_base}/auth/ResetPasswordWithCode`
                },
                post:    {
                    mail:             '',
                    reset_code:       '',
                    password:         '',
                    confirm_password: '',
                    form_id:          'actionResetPasswordWithCode',
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
