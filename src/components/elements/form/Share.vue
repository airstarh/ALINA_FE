<template>
  <span>
    <ShareNetwork
      network="VK"
      :url="hrefToBackend"
      :title="`${tale.header}`"
      :description="UtilsStr.truncate(tale.body_txt, 100)"
    >
      <button
        class="btn p-1"
        title="vkontakte"
      >
        <svg
          height="1.8rem"
          width="1.8rem"
          class="corporate-svg-fill"
        >
          <use :xlink:href="`${iconVk.url}`"></use>
        </svg>
      </button>
    </ShareNetwork>
    <ShareNetwork
      network="facebook"
      :url="hrefToBackend"
      :title="`${tale.header}`"
      :description="UtilsStr.truncate(tale.body_txt, 100)"
    >
      <button
        class="btn p-1"
        title="facebook"
      >
        <svg
          height="1.8rem"
          width="1.8rem"
          class="corporate-svg-fill"
        >
          <use :xlink:href="`${iconFb.url}`"></use>
        </svg>
      </button>
    </ShareNetwork>
    <ShareNetwork
      network="Telegram"
      :url="hrefToBackend"
      :title="`${tale.header}`"
      :description="UtilsStr.truncate(tale.body_txt, 100)"
    >
      <button
        class="btn p-1"
        title="Telegram"
      >
        <svg
          height="1.8rem"
          width="1.8rem"
          class="corporate-svg-fill"
        >
          <use :xlink:href="`${iconTg.url}`"></use>
        </svg>
      </button>
    </ShareNetwork>
    <ShareNetwork
      network="WhatsApp"
      :url="hrefToBackend"
      :title="`${tale.header}`"
      :description="UtilsStr.truncate(tale.body_txt, 100)"
    >
      <button
        class="btn p-1"
        title="WhatsApp"
      >
        <svg
          height="1.8rem"
          width="1.8rem"
          class="corporate-svg-fill"
        >
          <use :xlink:href="`${iconWp.url}`"></use>
        </svg>
      </button>
    </ShareNetwork>

    <ShareNetwork
      network="Viber"
      :url="hrefToBackend"
      :title="`${tale.header}`"
      :description="UtilsStr.truncate(tale.body_txt, 100)"
    >
      <button
        class="btn p-1"
        title="Viber"
      >
        <svg
          height="1.8rem"
          width="1.8rem"
          class="corporate-svg-fill"
        >
          <use :xlink:href="`${iconVb.url}`"></use>
        </svg>
      </button>
    </ShareNetwork>
    <ShareNetwork
      network="LinkedIn"
      :url="hrefToBackend"
      :title="`${tale.header}`"
      :description="UtilsStr.truncate(tale.body_txt, 100)"
    >
      <button
        class="btn p-1"
        title="LinkedIn"
      >
        <svg
          height="1.8rem"
          width="1.8rem"
          class="corporate-svg-fill"
        >
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
import iconVb from "@/assets/svg/socialnets/viber.svg";
import iconIn from "@/assets/svg/socialnets/linkedin.svg";
import UtilsSys from "@/Utils/UtilsSys";
export default {
  name: "Share",
  computed: {
    hrefToBackend() {
      return UtilsSys.hrefToBackend(this.tale, "tale/upsert");
    },
  },
  props: {
    tale: {
      type: Object,
      default: () => {
        return {
          id: null,
          body_txt: null,
        };
      },
    },
  },
  data() {
    return {
      iconIn,
      iconVb,
      iconFb,
      iconVk,
      iconWp,
      iconTg,
      UtilsStr,
      ConfigApi,
    };
  },
};
</script>

<style scoped lang="scss"></style>
