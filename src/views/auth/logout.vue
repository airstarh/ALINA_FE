<template>
    <div class="container h-100">
        <div class="row align-items-center h-100">
            <div class="col-md-6 mx-auto">
                <form action="" method="post" enctype="multipart/form-data">
                    <h1>LogOut</h1>
                    <div v-if="CU.isLoggedIn()">You are logged in</div>
                    <div v-if="!CU.isLoggedIn()">You are logged out</div>
                    <input type="hidden" v-model="post.form_id" class="form-control">
                    <StandardButtons
                            :onGo="runAJax"
                            submit-txt="Bye-bye"
                    ></StandardButtons>
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
        name:       "auth_logout",
        data() {
            return {
                CU:      CurrentUser.obj(),
                options: {
                    url: `${ConfigApi.url_base}/auth/logout`
                },
                post:    {
                    form_id: 'logout',
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
                        //ToDo: auto log out
                        this.$router.replace({ path: `/about` });
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
