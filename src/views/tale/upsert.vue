<template>
    <div class="container">
        <div class="row">
            <div class="col mx-auto">
                <div class="alina-form">
                    <h1>Your tale</h1>
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
                    <div class="ck ck-content bg-light">
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
    // @ is an alias to /src
    import StandardButtons from "@/components/elements/form/StandardButtons";
    import ConfigApi from "@/configs/ConfigApi";
    import AjaxAlina from "@/services/AjaxAlina";
    import CurrentUser from "@/services/CurrentUser";
    //#####
    import CKEditor from '@ckeditor/ckeditor5-vue';
    import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
    //import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
    import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
    import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
    import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
    import LinkPlugin from '@ckeditor/ckeditor5-link/src/link';
    import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';
    import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
    import Table from '@ckeditor/ckeditor5-table/src/table';
    import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
    import PasteFromOffice from "@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice";
    //##
    import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
    import Image from '@ckeditor/ckeditor5-image/src/image';
    import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
    import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
    import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
    import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
    import {MyCustomUploadAdapterPlugin} from "@/Utils/AlinaCustomUploader";
    //#####
    import UtilsData from "@/Utils/UtilsData";
    //#####

    export default {
        name:       "tale_upsert",
        data() {
            return {
                options: {
                    url:          `${ConfigApi.url_base}/tale/upsert`,
                    editorConfig: {
                        extraPlugins: [MyCustomUploadAdapterPlugin],
                        plugins:      [
                            EasyImage,
                            //CKFinder,
                            EssentialsPlugin,
                            BoldPlugin,
                            ItalicPlugin,
                            LinkPlugin,
                            ParagraphPlugin,
                            Alignment,
                            Table,
                            TableToolbar,
                            PasteFromOffice,
                            Image,
                            ImageToolbar,
                            ImageCaption,
                            ImageStyle,
                            ImageResize,
                        ],
                        toolbar:      {
                            items: [
                                'bold',
                                'italic',
                                'link',
                                'alignment',
                                '|',
                                'insertTable',
                                'tableRow',
                                'tableColumn',
                                'mergeTableCells',
                                '|',
                                //'ckfinder',
                                'imageUpload',
                                '|',
                                'undo',
                                'redo'
                            ]
                        },
                        image:        {
                            toolbar: [ 'imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight' ],
                            styles: [
                                'full',
                                'alignLeft',
                                'alignRight'
                            ],
                        },
                        // ckfinder:     {
                        //     uploadUrl: `${ConfigApi.url_base}/FileUpload/Common`
                        // },
                    },
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
            next(vm => {
                vm.post.id = vm.getCurrentId(to);
                vm.getTale();
            })
        },
        beforeRouteUpdate(to, from, next) {
            const vm   = this;
            vm.post.id = vm.getCurrentId(to);
            vm.getTale();
            next();
        },
        //endregion Router Hooks
        //##################################################
        updated() {

        },
        methods:    {
            onCkEditorReady(ck) {
                let res;
                if (ck && ck.ui) {
                    res = Array.from(ck.ui.componentFactory.names('image'));
                }

                console.log(">>>____________________________");
                console.log("xxx");
                console.log(res);
                console.log("<<<____________________________");
            },
            getCurrentId(to) {
                let id = null;
                if (to && to.params && to.params.id) {
                    id = to.params.id;
                }
                return id;
            },

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
            },
            getTale() {
                const oAjax = AjaxAlina.newInst({
                    url:    this.post.id
                            ? `${this.options.url}/${this.post.id}`
                            : `${this.options.url}`
                    ,
                    method: 'GET',
                    onDone: (aja) => {
                        this.post = aja.respBody.data;
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
