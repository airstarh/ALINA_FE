<template>
    <div class="container">
        <div class="row">
            <div class="col mx-auto">
                <div v-for="(tale, index) in feed" v-bind:key="tale.id">
                    <hr>
                    <!--##################################################-->
                    <!--##################################################-->
                    <!--##################################################-->
                    <!-- region Tale -->
                    <div class="container">
                        <div class="row align-items-center">
                            <div class="col"><h3>{{tale.header}}</h3></div>
                            <div class="col"><h3>{{tale.id}}</h3></div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <img :src="tale.owner_emblem" height="50px">
                                {{tale.owner_firstname}} {{tale.owner_lastname}}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <div class="ck-content bg-light">
                                    <div v-html="tale.body"></div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col">
                                <div class="alina-form">
                                    <Comment
                                            :level="1"
                                            type="COMMENT"
                                            :root_tale_id="tale.id"
                                            :answer_to_tale_id="tale.id"
                                    ></Comment>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="clearfix"></div>
                    <!-- endregion Tale -->
                    <!--##################################################-->
                    <!--##################################################-->
                    <!--##################################################-->
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
    import Comment from "@/components/elements/form/Comment";
    //#####
    import CKEditor from '@ckeditor/ckeditor5-vue';
    import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
    //import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
    import ConfigCkEditor from "@/configs/ConfigCkEditor";
    import UtilsArray from "@/Utils/UtilsArray";
    //#####

    export default {
        name:       "tale_feed",
        components: {
            StandardButtons,
            ckeditor: CKEditor.component,
            Comment
        },
        data() {
            return {
                options: {
                    urlFeed:      `${ConfigApi.url_base}/tale/feed`,
                    editorConfig: ConfigCkEditor,
                    editor:       ClassicEditor,
                },
                feed:    []
            }
        },
        //##################################################
        //region Router Hooks
        beforeRouteEnter(to, from, next) {
            next((vm) => {
                //
            })
        },
        beforeRouteUpdate(to, from, next) {
            const vm = this;
            //
            next();
        },
        //endregion Router Hooks
        //##################################################
        created() {
            this.ajaGetFeed();
        },
        methods:    {
            onCkEditorReady(ck) {

            },
            getRouteParam(paramName, to) {
                if (UtilsData.empty(to)) {to = this.$route;}
                let res = null;
                if (to && to.params && to.params[paramName]) {
                    res = to.params[paramName];
                }
                return res;
            },

            ajaGetFeed() {
                AjaxAlina.newInst({
                    method: 'GET',
                    url:    this.options.urlFeed,
                    onDone: (aja) => {
                        UtilsArray.vueSensitiveConcat(this.feed, aja.respBody.data.tales);
                        console.log(">>>____________________________");
                        console.log("onDone");
                        console.log(this.feed);
                        console.log("<<<____________________________");
                    }
                })
                .go();
            },
        }
    };
</script>
<!--##################################################-->
<!--##################################################-->
<!--##################################################-->
