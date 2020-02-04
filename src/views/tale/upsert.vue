<template>
    <div class="container">
        <div class="row">
            <div class="col mx-auto">
                <div class="alina-form">
                    <h1>Your tale</h1>
                    <input type="text" v-model="post.header" placeholder="Header" class="form-control">
                    <ckeditor ref="asd" :editor="options.editor" v-model="post.body" :config="options.editorConfig" :fileUploadResponse="fileUploadResponse" height="100px"></ckeditor>
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
    import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
    //import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';
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
    import AppAlina from "@/router";
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
                            //SimpleUploadAdapter,
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
                                'insertTable',
                                '|',
                                //'ckfinder',
                                'imageUpload',
                                'imageTextAlternative',
                                '|',
                                'imageStyle:full', 'imageStyle:side', /*'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',*/
                                '|',
                                'undo',
                                'redo'
                            ]
                        },
                        styles:       [
                            // This option is equal to a situation where no style is applied.
                            'full',

                            // This represents an image aligned to the left.
                            'alignLeft',

                            // This represents an image aligned to the right.
                            'alignRight'
                        ],
                        // simpleUpload: {
                        //     uploadUrl: `${ConfigApi.url_base}/FileUpload/Common`,
                        // },
                        // ckfinder:     {
                        //     uploadUrl: `${ConfigApi.url_base}/FileUpload/Common`
                        // },
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
        mounted() {
            console.log(">>>____________________________");
            console.log("xxx");
            console.log(this.$refs.asd
            );
            console.log("<<<____________________________");
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
