<template>
    <div class="container">
        <div class="row">
            <div class="col mx-auto">
                <div class="alina-form">
                    <h1>Your tale {{post.id}}</h1>
                    <StandardButtons :onGo="runAJax"></StandardButtons>
                    <input type="text" v-model="post.header" placeholder="Header" class="form-control">
                    <ckeditor
                            v-model="post.body"
                            :editor="options.editor"
                            :config="options.editorConfig"
                            @ready="onCkEditorReady"
                            :fileUploadResponse="fileUploadResponse"
                    ></ckeditor>
                    <hr>
                    <StandardButtons :onGo="runAJax"></StandardButtons>
                    <hr>
                    <div class="ck-content bg-light">
                        <div v-html="post.body"></div>
                    </div>
                    <hr>
                    <StandardButtons :onGo="runAJax"></StandardButtons>
                    <hr>
                    <textarea v-model="post.body" placeholder="Body" rows="11" class="form-control"></textarea>
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
    import UtilsData from "@/Utils/UtilsData";
    import StandardButtons from "@/components/elements/form/StandardButtons";
    import ConfigApi from "@/configs/ConfigApi";
    import AjaxAlina from "@/services/AjaxAlina";
    import CurrentUser from "@/services/CurrentUser";
    //#####
    import CKEditor from '@ckeditor/ckeditor5-vue';
    import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
    import ConfigCkEditor from "@/configs/ConfigCkEditor";
    //import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
    //#####

    export default {
        name:       "tale_upsert",
        data() {
            return {
                options: {
                    url:          `${ConfigApi.url_base}/tale/upsert`,
                    editorConfig: ConfigCkEditor,
                    editor:       ClassicEditor,
                },
                post:    {
                    id:         null,
                    header:     '',
                    body:       '',
                    publish_at: '',
                    form_id:    'actionUpsert',
                }
            }
        },
        components: {
            StandardButtons,
            ckeditor: CKEditor.component
        },
        //##################################################
        //region Router Hooks
        beforeRouteEnter(to, from, next) {
            next((vm) => {
                const id = vm.getRouteParam('id', to);
                vm.ajaxGetTale(id);
            })
        },
        beforeRouteUpdate(to, from, next) {
            const vm = this;
            const id = vm.getRouteParam('id', to);
            vm.ajaxGetTale(id);
            next();
        },
        //endregion Router Hooks
        //##################################################
        updated() {

        },
        methods:    {
            onCkEditorReady(ck) {
                // let res;
                // if (ck && ck.ui) {
                //     res = Array.from(ck.ui.componentFactory.names('image'));
                // }
                //
                // console.log(">>>____________________________");
                // console.log("onCkEditorReady");
                // console.log(res);
                // console.log("<<<____________________________");
            },
            getRouteParam(paramName, to) {
                if (UtilsData.empty(to)) {to = this.$route;}
                let res = null;
                if (to && to.params && to.params[paramName]) {
                    res = to.params[paramName];
                }
                return res;
            },

            runAJax() {
                AjaxAlina.newInst({
                    method:     'POST',
                    url:        this.options.url,
                    postParams: this.post,
                    onDone:     (aja) => {
                        this.post = aja.respBody.data;
                    }
                })
                .go();
            },

            ajaxGetTale(id) {
                const _t = this;
                //###############
                //region Fix Double get
                if (!UtilsData.empty(id) && id == _t.post.id) {
                    return null;
                }
                //endregion Fix Double get
                //###############
                AjaxAlina.newInst({
                    method: 'GET',
                    url:    id
                            ? `${_t.options.url}/${id}`
                            : `${_t.options.url}`
                    ,
                    onDone: (aja) => {
                        _t.post = aja.respBody.data;
                        //###############
                        //region Fix Double get
                        if (UtilsData.empty(id)) {
                            _t.$router.replace({path: `/tale/upsert/${_t.post.id}`});
                        }
                        //endregion Fix Double get
                        //###############
                    }
                })
                .go();
            },
            fileUploadResponse: function (evt) {
                console.log(">>>____________________________");
                console.log("fileUploadResponse");
                console.log(arguments);
                console.log("<<<____________________________");
            }

        }
    };
</script>
<!--##################################################-->
<!--##################################################-->
<!--##################################################-->
