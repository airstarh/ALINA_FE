<template>
    <div :style="options.style">

        <div>
            <b-button v-b-toggle.collapse-1 variant="primary">Toggle Collapse</b-button>
            <b-collapse id="collapse-1" class="mt-2">
                <b-card>
                    <p class="card-text">Collapse contents Here</p>
                    <b-button v-b-toggle.collapse-1-inner size="sm">Toggle Inner Collapse</b-button>
                    <b-collapse id="collapse-1-inner" class="mt-2">
                        <b-card>Hello!</b-card>
                    </b-collapse>
                </b-card>
            </b-collapse>
        </div>

        <div class="alina-form text-right"
             v-if="level==1"
             :style="options.styleComment"
        >
            <!--<input v-model="body" type="text" class="form-control">-->
            <ckeditor v-model="body" :editor="options.editor" :config="options.editorConfig"></ckeditor>
            to {{answer_to_tale_id}} to {{root_tale_id}}
            <span @click="() => {this.body = '';}" class="btn btn-sm btn-warning">{{resetTxt}}</span>
            <button @click="ajaCommentSend" type="button" class="btn btn-sm btn-success">{{submitTxt}}</button>
        </div>
        <div v-for="(tale, feedIndex) in feed" v-bind:key="tale.id">
            <div :style="options.styleComment">
                <div class="row" v-if="!state.feedsInEdit.includes(tale.id)">
                    <div class="col">
                        <img :src="tale.owner_emblem || 'https://www.tokkoro.com/picsup/5675648-batwoman-wallpapers.jpg'" height="25px">
                        {{tale.owner_firstname || 'Batwoman' }} {{tale.owner_lastname}}
                        {{tale.id}} to {{tale.answer_to_tale_id}}
                    </div>
                </div>
                <div class="row" v-if="!state.feedsInEdit.includes(tale.id)">
                    <div class="col">
                        <div class="ck-content">
                            <div v-html="tale.body"></div>
                        </div>
                    </div>
                </div>
                <div class="row" v-if="state.feedsInEdit.includes(tale.id)">
                    <div class="col">
                        <ckeditor v-model="tale.body" :editor="options.editor" :config="options.editorConfig"></ckeditor>
                    </div>
                </div>

                <div class="row">
                    <div class="col text-right">
                        <span @click="ajaDeleteComment(feed[feedIndex], feedIndex)" class="btn btn-sm btn-danger">Delete</span>
                        <span @click="toggleCommentEditMode(feed[feedIndex], feedIndex)" v-if="!state.feedsInEdit.includes(tale.id)" class="btn btn-sm btn-info">Edit</span>
                        <span @click="commentCancelEdit(feed[feedIndex], feedIndex)" v-if="state.feedsInEdit.includes(tale.id)" class="btn btn-sm btn-info">Cancel</span>
                        <span @click="ajaSaveComment(feed[feedIndex], feedIndex)" v-if="state.feedsInEdit.includes(tale.id)" class="btn btn-sm btn-success">Save</span>
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
                :style="options.styleComment"
                :pageCurrentNumber="parseInt(feedPagination.pageCurrentNumber)"
                :pageSize="parseInt(feedPagination.pageSize)"
                :rowsTotal="parseInt(feedPagination.rowsTotal)"
                :pagesTotal="parseInt(feedPagination.pagesTotal)"
                :onClickPage="pageChange"
                :onClickMore="onClickMore"
                :onClickAll="onClickAll"
        ></Paginator>
        <div class="clearfix"></div>
        <div class="alina-form text-right" :style="options.styleComment">
            <!--<input v-model="body" type="text" class="form-control">-->
            <ckeditor v-model="body" :editor="options.editor" :config="options.editorConfig"></ckeditor>
            to {{answer_to_tale_id}} to {{root_tale_id}}
            <span @click="() => {this.body = '';}" class="btn btn-sm btn-warning">{{resetTxt}}</span>
            <button @click="ajaCommentSend" type="button" class="btn btn-sm btn-success">{{submitTxt}}</button>
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
                    urlFeed:        `${ConfigApi.url_base}/tale/feed`,
                    urlCommentAdd:  `${ConfigApi.url_base}/tale/CommentAdd`,
                    urlCommentEdit: `${ConfigApi.url_base}/tale/upsert`,
                    urlCommentDel:  `${ConfigApi.url_base}/tale/delete`,
                    editorConfig:   ConfigCkEditor,
                    editor:         ClassicEditor,
                    style:          {
                        "margin-left": this.level == 1 ? '0' : 5 + '%',
                    },
                    styleComment:   {
                        "border-left": this.level == 1 ? '#ACAEAF solid 10px' : '#ACAEAF solid 10px'
                    }

                },
                state:          {
                    feedsInEdit: []
                },
                body:           "",
                feed:           [],
                feedPagination: {
                    pageCurrentNumber: 'last',
                    pageSize:          this.level == 1 ?  3 : 3,
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
                            this.feed = [];
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
                        _t.feed.push(aja.respBody.data);
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

            onClickAll(pageSize, pageCurrentNumber) {
                this.feedPagination.pageSize          = pageSize;
                this.feedPagination.pageCurrentNumber = pageCurrentNumber;
                this.ajaGetComments(false);
            },

            toggleCommentEditMode(comment, feedIndex) {
                if (!this.state.feedsInEdit.includes(comment.id)) {
                    comment.bodyPrevious = comment.body;
                    this.state.feedsInEdit.push(comment.id)
                } else {
                    UtilsArray.elRemoveByValue(this.state.feedsInEdit, comment.id);
                }
            },

            ajaSaveComment(comment, feedIndex) {
                const _t        = this;
                comment.form_id = 'actionUpsert';
                AjaxAlina.newInst({
                    method:     'POST',
                    url:        `${this.options.urlCommentEdit}/${comment.id}`,
                    postParams: comment,
                    onDone:     (aja) => {
                        this.toggleCommentEditMode(comment, feedIndex);
                    }
                })
                .go();
            },

            commentCancelEdit(comment, feedIndex) {
                comment.body = comment.bodyPrevious;
                this.toggleCommentEditMode(comment, feedIndex);
            },

            ajaDeleteComment(comment, feedIndex) {
                const _t        = this;
                comment.form_id = 'actionDelete';
                AjaxAlina.newInst({
                    method:     'POST',
                    url:        `${this.options.urlCommentDel}/${comment.id}`,
                    postParams: comment,
                    onDone:     (aja) => {
                        if (aja.respBody.data.success == 1) {
                            UtilsArray.elRemoveByIndex(this.feed, feedIndex);
                        }
                    }
                })
                .go();

            }

        }
    };
</script>

<style scoped lang="scss"></style>
