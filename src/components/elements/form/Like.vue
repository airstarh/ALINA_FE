<template>
    <span>
        <button
                @click="onLike"
                class="btn btn-sm"
        >
            <span v-if="dCurrentUserLiked" class="text-danger"><b-icon-heart-fill></b-icon-heart-fill></span>
            <span v-if="!dCurrentUserLiked"><b-icon-heart></b-icon-heart></span>
        </button>
        <button
                class="btn btn-primary btn-sm"
        >{{dAmountLikes}}
        </button>
    </span>
</template>

<script>
    import CurrentUser from "@/services/CurrentUser";
    import ConfigApi from "@/configs/ConfigApi";
    import AjaxAlina from "@/services/AjaxAlina";
    export default {
        name:    "Like",
        props:   {
            pAmountLikes:      {
                type:    Number | String,
                default: 0,
            },
            pCurrentUserLiked: {
                type:    Number | String,
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
                val:               0
            };
        },
        mounted(){
            this.dCurrentUserLiked = this.pCurrentUserLiked;
            this.dAmountLikes = this.pAmountLikes;
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
                if (!this.CU.isLoggedIn()) {
                    alert('Only logged-in users are allowed to like :-)');
                    return;
                }
                this.val = 1;
                const o  = {
                    "ref_table": this.ref_table,
                    "ref_id":    this.ref_id,
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
                console.log(this.dAmountLikes);
                console.log(this.pAmountLikes);
            }
        }
    };
</script>

<style scoped></style>
