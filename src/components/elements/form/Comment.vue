<template>
    <div>
        <div v-for="(tale, index) in feed" v-bind:key="tale.id"
             :class="{
                'ml-0':tale.level == 1,
                'ml-5':tale.level == 2,
             }"
        >
            <!--<div class="row align-items-center">-->
            <!--    <div class="col-1"><h3>{{tale.id}}</h3></div>-->
            <!--</div>-->
            <div class="row">
                <div class="col">
                    <img :src="tale.owner_emblem || 'https://www.tokkoro.com/picsup/5675648-batwoman-wallpapers.jpg'" height="50px">
                    {{tale.owner_firstname || 'Batwoman' }} {{tale.owner_lastname}}
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="ck-content bg-light">
                        <div v-html="tale.body"></div>
                    </div>
                </div>
            </div>
            <div class="clearfix"></div>
            <Comment v-if="tale.level < 2"
                     :level="tale.level+1"
                     type="COMMENT"
                     :root_tale_id="root_tale_id"
                     :answer_to_tale_id="tale.id"
            ></Comment>
            <div class="clearfix"></div>
        </div>
        <div class="clearfix"></div>
        <Paginator
                :pageCurrentNumber="parseInt(feedPagination.pageCurrentNumber)"
                :pageSize="parseInt(feedPagination.pageSize)"
                :rowsTotal="parseInt(feedPagination.rowsTotal)"
                :pagesTotal="parseInt(feedPagination.pagesTotal)"
                :onClickPage="pageChange"
                :onClickMore="onClickMore"
        ></Paginator>
        <div class="clearfix"></div>
        <div class="alina-form form-group mt-3 text-right"
             :class="{
                'ml-0':level == 1,
                'ml-5':level == 2,
             }"
        >
            <!--<input v-model="body" type="text" class="form-control">-->
            <ckeditor
                    v-model="body"
                    :editor="options.editor"
                    :config="options.editorConfig"
            ></ckeditor>
            <span @click="() => {this.body = '';}" class="btn btn-lg btn-danger">{{resetTxt}}</span>
            <button @click="ajaCommentSend" type="button" class="btn btn-lg btn-primary">{{submitTxt}}</button>
        </div>
    </div>
</template>

<script>
    import AjaxAlina from "@/services/AjaxAlina";
    import ConfigApi from "@/configs/ConfigApi";
    import UtilsArray from "@/Utils/UtilsArray";
    import Comment from "@/components/elements/form/Comment";
    import Paginator from "@/components/elements/form/Paginator";
    //#####
    import CKEditor from '@ckeditor/ckeditor5-vue';
    import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
    import ConfigCkEditor from "@/configs/ConfigCkEditor";
    //import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
    //#####
    export default {
        name:       "Comment",
        components: {
            Paginator,
            Comment,
            ckeditor: CKEditor.component
        },
        data() {
            return {
                options:        {
                    urlFeed:       `${ConfigApi.url_base}/tale/feed`,
                    urlCommentAdd: `${ConfigApi.url_base}/tale/CommentAdd`,
                    editorConfig:  ConfigCkEditor,
                    editor:        ClassicEditor,
                },
                body:           "",
                feed:           [],
                feedPagination: {
                    pageCurrentNumber: 1,
                    pageSize:          3,
                    rowsTotal:         0,
                    pagesTotal:        0,
                },
            }
        },
        props:      {
            level:             {
                type:    Number,
                default: 1,
            },
            type:              {
                type:    String,
                default: 'COMMENT',
            },
            root_tale_id:      {
                type:    Number,
                default: null,
            },
            answer_to_tale_id: {
                type:    Number,
                default: null,
            },
            //
            submitTxt:         {default: "Submit"},
            resetTxt:          {default: "Clear"},
        },
        created() {
            this.ajaGetComments();
        },
        methods:    {
            ajaGetComments(more = false) {
                AjaxAlina.newInst({
                    method: 'GET',
                    url:    `${this.options.urlFeed}/${this.feedPagination.pageSize}/${this.feedPagination.pageCurrentNumber}/${this.answer_to_tale_id}`,
                    onDone: (aja) => {
                        if (more) {
                            UtilsArray.vueSensitiveConcat(this.feed, aja.respBody.data.tale);
                        } else {
                            this.feed = aja.respBody.data.tale;
                        }
                        this.feedPagination = aja.respBody.meta.tale;
                    }
                })
                .go();
            },
            ajaCommentSend(event) {
                const _t = this;
                AjaxAlina.newInst({
                    method:     'POST',
                    url:        this.options.urlCommentAdd,
                    enctype:    'application/json',
                    postParams: {
                        "level":             this.level,
                        "root_tale_id":      this.root_tale_id,
                        "answer_to_tale_id": this.answer_to_tale_id,
                        "type":              this.type,
                        "body":              this.body,
                        "form_id":           "actionCommentAdd",
                    },
                    onDone:     (aja) => {
                        _t.ajaGetComments();
                        // if (this.onAjaCommentSentSuccess) {
                        //     this.onAjaCommentSentSuccess(aja);
                        // }
                    }
                })
                .go();
            },
            pageChange(pageSize, pageCurrentNumber) {
                this.feedPagination.pageSize          = pageSize;
                this.feedPagination.pageCurrentNumber = pageCurrentNumber;
                this.ajaGetComments();
            },
            onClickMore(pageSize, pageCurrentNumber) {
                this.feedPagination.pageSize          = pageSize;
                this.feedPagination.pageCurrentNumber = pageCurrentNumber;
                this.ajaGetComments(true);
            },
        }
    };
</script>

<style scoped lang="scss"></style>
