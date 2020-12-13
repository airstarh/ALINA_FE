<template>
<span>
<ShareNetwork
        network="VK"
        :url="`${ConfigApi.url_base}/tale/upsert/${tale.id}`"
        :title="`${tale.header}`"
        :description="UtilsStr.truncate(tale.body_txt, 100)"
>
    <button class="btn p-1" title="vkontakte">
        <svg height="1.8rem" width="1.8rem">
            <use :xlink:href="`${iconVk.url}`"></use>
        </svg>
    </button>
</ShareNetwork>
<ShareNetwork
        network="facebook"
        :url="`${ConfigApi.url_base}/tale/upsert/${tale.id}`"
        :title="`${tale.header}`"
        :description="UtilsStr.truncate(tale.body_txt, 100)"
>
    <button class="btn p-1" title="facebook">
        <svg height="1.8rem" width="1.8rem">
            <use :xlink:href="`${iconFb.url}`"></use>
        </svg>
    </button>
</ShareNetwork>
<ShareNetwork
        network="Telegram"
        :url="`${ConfigApi.url_base}/tale/upsert/${tale.id}`"
        :title="`${tale.header}`"
        :description="UtilsStr.truncate(tale.body_txt, 100)"
>
    <button class="btn p-1" title="Telegram">
        <svg height="1.8rem" width="1.8rem">
            <use :xlink:href="`${iconTg.url}`"></use>
        </svg>

    </button>
</ShareNetwork>
<ShareNetwork
        network="WhatsApp"
        :url="`${ConfigApi.url_base}/tale/upsert/${tale.id}`"
        :title="`${tale.header}`"
        :description="UtilsStr.truncate(tale.body_txt, 100)"
>
    <button class="btn p-1" title="WhatsApp">
        <svg height="1.8rem" width="1.8rem">
            <use :xlink:href="`${iconWp.url}`"></use>
        </svg>
    </button>
</ShareNetwork>
<ShareNetwork
        network="Skype"
        :url="`${ConfigApi.url_base}/tale/upsert/${tale.id}`"
        :title="`${tale.header}`"
        :description="UtilsStr.truncate(tale.body_txt, 100)"
>
<button class="btn p-1" title="Skype">
    <svg height="1.8rem" width="1.8rem">
        <use :xlink:href="`${iconSk.url}`"></use>
    </svg>
</button>
</ShareNetwork>
<ShareNetwork
        network="Viber"
        :url="`${ConfigApi.url_base}/tale/upsert/${tale.id}`"
        :title="`${tale.header}`"
        :description="UtilsStr.truncate(tale.body_txt, 100)"
>
<button class="btn p-1" title="Viber">
<svg height="1.8rem" width="1.8rem">
    <use :xlink:href="`${iconVb.url}`"></use>
</svg>
</button>
</ShareNetwork>
<ShareNetwork
        network="LinkedIn"
        :url="`${ConfigApi.url_base}/tale/upsert/${tale.id}`"
        :title="`${tale.header}`"
        :description="UtilsStr.truncate(tale.body_txt, 100)"
>
<button class="btn p-1" title="LinkedIn">
<svg height="1.8rem" width="1.8rem">
<use :xlink:href="`${iconIn.url}`"></use>
</svg>
</button>
</ShareNetwork>
</span>
</template>

<script>
    import ConfigApi from "@/configs/ConfigApi";
    import UtilsStr from "@/Utils/UtilsStr";
    import iconVk from "@/assets/svg/socialnets/vk.svg";
    import iconFb from "@/assets/svg/socialnets/fb.svg";
    import iconWp from "@/assets/svg/socialnets/whatsapp.svg";
    import iconTg from "@/assets/svg/socialnets/telgram.svg";
    import iconSk from "@/assets/svg/socialnets/skype.svg";
    import iconVb from "@/assets/svg/socialnets/viber.svg";
    import iconIn from "@/assets/svg/socialnets/linkedin.svg";
    export default {
        name:  "Share",
        props: {
            tale: {
                type:    Object,
                default: () => {
                    return {
                        id:       null,
                        body_txt: null,
                    };
                }
            }
        },
        data() {
            return {
                iconIn,
                iconVb,
                iconSk,
                iconFb,
                iconVk,
                iconWp,
                iconTg,
                UtilsStr,
                ConfigApi
            }
        }
    };
</script>

<style scoped lang="scss">
    svg {
        fill: #c845ea;
    }
</style>
