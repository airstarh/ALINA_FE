<template>
    <div class="text-center">
        <button
                @click="onLike"
                class="btn btn-primary btn-sm"
        >
            <span v-if="dCurrentUserLiked">uNLike</span>
            <span v-if="!dCurrentUserLiked">Like</span>
        </button>
        <button
                class="btn btn-primary btn-sm"
        >{{dAmountLikes}}
        </button>
    </div>
</template>

<script>
    import CurrentUser from "@/services/CurrentUser";
    import ConfigApi from "@/configs/ConfigApi";
    import AjaxAlina from "@/services/AjaxAlina";
    export default {
        name:    "Like",
        props:   {
            pAmountLikes:      {
                type:    Number,
                default: 0,
            },
            pCurrentUserLiked: {
                type:    Number,
                default: 0,
            },
            ref_table:         {
                type:    String,
                default: 'tale',
            },
            ref_id:            {
                type:    Number,
                default: 0,
            },
        },
        data() {
            return {
                options:           {
                    urlLike: `${ConfigApi.url_base}/like/process`
                },
                CU:                CurrentUser.obj(),
                dCurrentUserLiked: 0,
                dAmountLikes:      0,
                user_id:           null,
                val:               0
            };
        },
        watch:   {
            pAmountLikes() {
                this.dAmountLikes = this.pAmountLikes;
            },
            pCurrentUserLiked() {
                this.dCurrentUserLiked = this.pCurrentUserLiked;
            }
        },
        methods: {
            onLike() {
                this.val = 1;
                const o  = {
                    "ref_table": this.ref_table,
                    "ref_id":    this.ref_id,
                    "user_id":   this.user_id,
                    "val":       this.val,
                    "form_id":   'actionProcess',
                };
                AjaxAlina.newInst({
                    method:     'POST',
                    url:        this.options.urlLike,
                    postParams: o,
                    onDone:     (aja) => {
                        if (aja.respBody.meta.alina_response_success == 1) {
                            this.dAmountLikes      = aja.respBody.data.AmountLikes;
                            this.dCurrentUserLiked = aja.respBody.data.CurrentUserLiked;
                        }
                    }
                })
                .go();
            },
            watchWhoLikes() {

            },
            log() {
                console.log("log ++++++++++");
                console.log(this);
            }
        }
    };
</script>

<style scoped></style>
