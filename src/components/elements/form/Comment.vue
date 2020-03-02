<template>
    <div class="form-group mt-3 text-center">
        <input v-model="body" type="text" class="form-control">
        <button
                @click="ajaCommentSend"
                type="button"
                class="btn btn-lg btn-primary"
        >{{submitTxt}}
        </button>
        <span
                @click="() => {this.body = '';}"
                class="btn btn-lg btn-danger"
        >{{resetTxt}}</span>
    </div>
</template>

<script>
    import AjaxAlina from "@/services/AjaxAlina";
    import ConfigApi from "@/configs/ConfigApi";

    export default {
        name:    "Comment",
        data() {
            return {
                body: "",
            }
        },
        props:   {
            level:                   {
                type:    Number,
                default: 1,
            },
            root_tale_id:            {
                type:    Number,
                default: null,
            },
            answer_to_tale_id:       {
                type:    Number,
                default: null,
            },
            type:                    {
                type:    String,
                default: "COMMENT",
            },
            //
            pageSize:                {
                type:    Number,
                default: 5,
            },
            pageCurrentNumber:       {
                type:    Number,
                default: 1,
            },
            //
            onAjaCommentSentSuccess: Function,
            submitTxt:               {
                default: "Submit"
            },
            resetTxt:                {
                default: "Clear"
            },
        },
        methods: {
            ajaGetComments(){
                AjaxAlina.newInst({
                    method: 'GET',
                    url:    this.options.urlFeed,
                    onDone: (aja) => {
                        UtilsArray.vueSensitiveConcat(this.feed, aja.respBody.data.tales);
                        this.feedPagination = aja.respBody.meta.tale;
                        console.log(">>>____________________________");
                        console.log("onDone");
                        console.log(this.feed);
                        console.log("<<<____________________________");
                    }
                })

            },
            ajaCommentSend(event) {
                AjaxAlina.newInst({
                    method:     'POST',
                    url:        `${ConfigApi.url_base}/tale/CommentAdd`,
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
                        if (this.onAjaCommentSentSuccess) {
                            this.onAjaCommentSentSuccess(aja);
                        }
                        console.log(">>>____________________________");
                        console.log("ajaCommentSend");
                        console.log(aja);
                        console.log(aja.respBody);
                        console.log(event);
                        console.log("<<<____________________________");
                    }
                })
                .go();
            }
        }
    };
</script>

<style scoped lang="scss"></style>
