<template>
    <div class="container">
        <div class="row">
            <div class="col mx-auto">
                <div class="alina-form">
                    <h1>Your tale</h1>
                    <input type="text" v-model="post.header" placeholder="Header" class="form-control">
                    <ckeditor :editor="options.editor" v-model="post.body" :config="options.editorConfig"></ckeditor>
                    <input type="text" v-model="post.body" placeholder="Body" class="form-control">
                    <input type="text" v-model="post.publish_at" placeholder="Publish at" class="form-control">
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
    import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
    //import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';

    export default {
        name:       "tale_upsert",
        data() {
            return {
                options: {
                    url:          `${ConfigApi.url_base}/tale/upsert`,
                    editorConfig: {
                        //plugins: [SimpleUploadAdapter],
                        simpleUpload: {
                            uploadUrl: `${ConfigApi.url_base}/FileUpload/Common`,
                        },
                    },
                    editor:       ClassicEditor,
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
                        this.post = aja.respBody.data;
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
