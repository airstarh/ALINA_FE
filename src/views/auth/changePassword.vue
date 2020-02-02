<template>
    <div class="container h-100">
        <div class="row align-items-center h-100">
            <div class="col-md-6 mx-auto">
                <div class="alina-form">
                    <h1>Change Password</h1>
                    <input type="password" v-model="post.password" placeholder="Password" class="form-control">
                    <input type="password" v-model="post.confirm_password" placeholder="CInfirm Password" class="form-control">
                    <input type="hidden" v-model="post.form_id" class="form-control">
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
        name:       "auth_change_password",
        data() {
            return {
                options: {
                    url: `${ConfigApi.url_base}/auth/ChangePassword`
                },
                post:    {
                    form_id:          'actionChangePassword',
                    password:         '',
                    confirm_password: '',
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
