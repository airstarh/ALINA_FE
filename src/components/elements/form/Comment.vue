<template>
    <div :style="options.style">

        <!---->
        <!---->
        <!---->
        <div class="mb-5">
            <b-button v-b-toggle="'collapse-'+answer_to_tale_id">Answers {{feedPagination.rowsTotal}}</b-button>
        </div>
        <b-collapse :id="'collapse-'+answer_to_tale_id" :visible="level == 3" class="mb-5">

            <!--##################################################-->
            <!--##################################################-->
            <!--##################################################-->
            <div v-for="(tale, feedIndex) in feed" v-bind:key="tale.id" class="mt-1">
                <div>
                    <div class="row" v-if="!state.feedsInEdit.includes(tale.id)">
                        <div class="col">
                            <a :href="tale.owner_emblem" target="_blank">
                                <img v-if="tale.owner_emblem" :src="tale.owner_emblem" :height="level==1?'70px':'40px'" class="float-left rounded-circle mr-1">
                                <img v-if="!tale.owner_emblem" src="../../../assets/anarki.png" :height="level==1?'70px':'40px'" class="float-left rounded-circle mr-1">
                            </a>

                            <router-link :to="'/auth/profile/'+tale.owner_id">
                                {{tale.owner_firstname || 'Anonymous'}} {{tale.owner_lastname}}
                            </router-link>

                            <br>
                            <!--<router-link :to="'/tale/upsert/'+tale.id">-->
                            {{tale.publish_at | unix_to_date_time}}
                            <!--</router-link>-->
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
                        <div class="col">&nbsp;</div>
                        <div class="col text-right">
                            <div v-if="CU.ownsOrAdminOrModerator(tale.owner_id)" class="row">
                                <div @click="ajaDeleteComment(feed[feedIndex], feedIndex)" class="col btn btn-sm btn-danger">Delete</div>
                                <div @click="toggleCommentEditMode(feed[feedIndex], feedIndex)" v-if="!state.feedsInEdit.includes(tale.id)" class="col btn btn-sm btn-info">Edit</div>
                                <div @click="commentCancelEdit(feed[feedIndex], feedIndex)" v-if="state.feedsInEdit.includes(tale.id)" class="col btn btn-sm btn-info">Cancel</div>
                                <div @click="ajaCommentSave(feed[feedIndex], feedIndex)" v-if="state.feedsInEdit.includes(tale.id)" class="col btn btn-sm btn-success">Save</div>
                            </div>
                        </div>
                    </div>
                </div>
                <Comment v-if="tale.level < 2"
                         :level="tale.level+1"
                         type="COMMENT"
                         :root_tale_id="root_tale_id"
                         :answer_to_tale_id="tale.id"
                ></Comment>
            </div>
            <!--##################################################-->
            <!--##################################################-->
            <!--##################################################-->
            <Paginator
                    :pageCurrentNumber="parseInt(feedPagination.pageCurrentNumber)"
                    :pageSize="parseInt(feedPagination.pageSize)"
                    :rowsTotal="parseInt(feedPagination.rowsTotal)"
                    :pagesTotal="parseInt(feedPagination.pagesTotal)"
                    :onClickPage="pageChange"
                    :onClickMore="onClickMore"
                    :onClickAll="onClickAll"
            ></Paginator>
            <div class=" alina-form mt-2 mb-2" v-if="CU.isLoggedIn()">
                <!--<input v-model="body" type="text" class="form-control">-->
                <ckeditor v-model="body" :editor="options.editor" :config="options.editorConfig"></ckeditor>
                <div class="row">
                    <div class="col"></div>
                    <div class="col">
                        <div class="row">
                            <div @click="() => {this.body = '';}" class="col btn btn-sm btn-warning">{{resetTxt}}</div>
                            <div @click="ajaCommentAdd" type="button" class="col btn btn-sm btn-success">{{submitTxt}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </b-collapse>
        <!---->
        <!---->
        <!---->
        <!---->


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
    import CurrentUser from "@/services/CurrentUser";
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
                CU:             CurrentUser.obj(),
                options:        {
                    urlFeed:       `${ConfigApi.url_base}/tale/feed`,
                    urlTaleUpsert: `${ConfigApi.url_base}/tale/upsert`,
                    urlCommentDel: `${ConfigApi.url_base}/tale/delete`,
                    editorConfig:  ConfigCkEditor,
                    editor:        ClassicEditor,
                    style:         {
                        "margin-left": this.level == 1 ? '0' : 5 + '%',
                        "padding-left": "1mm",
                        "border-left": this.level == 1 ? '#D369BA solid 3px' : '#5440D1 solid 2px'
                    },
                    styleComment:  {}

                },
                state:          {
                    feedsInEdit: []
                },
                body:           "",
                feed:           [],
                feedPagination: {
                    pageCurrentNumber: 'last',
                    pageSize:          this.level == 1 ? 3 : 3,
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

            ajaCommentAdd(event) {
                const _t = this;
                AjaxAlina.newInst({
                    method:     'POST',
                    url:        this.options.urlTaleUpsert,
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
                        if (aja.respBody.meta.alina_response_success == 1) {
                            _t.feed.push(aja.respBody.data);
                            ++_t.feedPagination.rowsTotal;
                        }
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

            ajaCommentSave(comment, feedIndex) {
                const _t        = this;
                comment.form_id = 'actionUpsert';
                AjaxAlina.newInst({
                    method:     'POST',
                    url:        `${this.options.urlTaleUpsert}/${comment.id}`,
                    postParams: comment,
                    onDone:     (aja) => {
                        if (aja.respBody.meta.alina_response_success == 1) {
                            this.toggleCommentEditMode(comment, feedIndex);
                        }
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
                        if (aja.respBody.meta.alina_response_success == 1) {
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
