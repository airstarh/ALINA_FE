<template>
    <div class="container h-100">
        <div class="row align-items-center h-100">
            <div class="col-md-6 mx-auto">
                <div class="alina-form">
                    <h1>Your tale</h1>
                    <input type="text" v-model="post.header" class="form-control">
                    <input type="text" v-model="post.body" class="form-control">
                    <input type="text" v-model="post.publish_at" class="form-control">
                    <input type="hidden" v-model="post.id" class="form-control">
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
        name:       "tale_upsert",
        data() {
            return {
                options: {
                    url: `${ConfigApi.url_base}/tale/upsert`
                },
                post:    {
                    id:         '',
                    header:     '',
                    body:       '',
                    publish_at: '',
                    form_id:    'actionUpsert',
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
