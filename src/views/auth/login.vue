<template>
    <div class="container h-100">
        <div class="row align-items-center h-100">
            <div class="col-md-6 mx-auto">
                <form action="" method="post" enctype="multipart/form-data">
                    <h1>Login</h1>
                    <input type="text" v-model="post.mail" placeholder="Mail" class="form-control">
                    <input type="password" v-model="post.password" placeholder="Password" class="form-control">
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
    import ConfigApi       from "@/configs/ConfigApi";
    import AjaxAlina       from "@/services/AjaxAlina";
    import CurrentUser     from "@/services/CurrentUser";

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
                        const id = CurrentUser.obj().attributes.id;
                        // if (id) {
                        //     this.$router.replace({path: `/auth/profile`});
                        // }
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
