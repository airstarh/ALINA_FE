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
    import Font from '@ckeditor/ckeditor5-font/src/font';
    import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
    import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
    import Code from '@ckeditor/ckeditor5-basic-styles/src/code';
    import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
    import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';
    import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';

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
                            MediaEmbed,
                            Superscript,
                            Subscript,
                            Code,
                            Strikethrough,
                            Underline,
                            Font,
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
                                'underline',
                                'strikethrough',
                                'code',
                                'subscript',
                                'superscript',
                                'fontColor',
                                'fontBackgroundColor',
                                '|',
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
                                'mediaEmbed',
                                '|',
                                'undo',
                                'redo'
                            ]
                        },
                        image:        {
                            toolbar: ['imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight'],
                            styles:  [
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
                vm.ajaxGetTale();
            })
        },
        beforeRouteUpdate(to, from, next) {
            const vm = this;
            vm.ajaxGetTale();
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
            getTaleIdFromUrl() {
                let to = this.$route;
                let id = null;
                if (to && to.params && to.params.id) {
                    id = to.params.id;
                }
                return id;
            },

            runAJax() {
                const oAjax = AjaxAlina.newInst({
                    method:     'POST',
                    url:        this.options.url,
                    postParams: this.post,
                    onDone:     (aja) => {
                        this.post = aja.respBody.data;
                    }
                })
                .go();
            },
            ajaxGetTale() {
                const vm = this;
                let id   = this.getTaleIdFromUrl();
                if (!UtilsData.empty(id) && this.post.id == id) {
                    return null;
                }
                this.post.id = id;
                AjaxAlina.newInst({
                    method: 'GET',
                    url:    this.post.id
                            ? `${this.options.url}/${this.post.id}`
                            : `${this.options.url}`
                    ,
                    onDone: (aja) => {
                        this.post = aja.respBody.data;
                        if (this.post.id != id) {
                            this.$router.replace({path: `/tale/upsert/${this.post.id}`});
                        }
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
