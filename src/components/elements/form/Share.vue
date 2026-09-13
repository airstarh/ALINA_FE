<template>
  <span>
    <button
      class="btn btn-sm btn-secondary rounded-circle"
      @click="copyToBuffer"
      :title="$t('Copy link')">
      <i class="bi bi-share" v-if="!stateCopying"></i>
      <i class="bi bi-check" v-if="stateCopying"></i>
    </button>

    <button
      class="btn p-1"
      title="vkontakte"
      @click="shareToVk">
      <span
        class="share-vk-icon"
        :style="{ '--share-icon-url': `url('${iconVk}')` }"
        aria-hidden="true"></span>
    </button>
  </span>
</template>

<script>
import ConfigApi from "@/configs/ConfigApi";
import UtilsStr from "@/Utils/UtilsStr";
import iconVk from "@/assets/svg/socialnets/vk.svg?url&no-inline";
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
      iconVk,
      UtilsStr,
      ConfigApi,
      stateCopying: false,
    };
  },
  methods: {
    shareToVk() {
      const params = new URLSearchParams({
        url: this.hrefToBackend,
        title: this.tale.header || "",
        description: UtilsStr.truncate(this.tale.body_txt || "", 100),
      });
      window.open(
        `https://vk.com/share.php?${params.toString()}`,
        "vk-share",
        "width=640,height=480,noopener,noreferrer"
      );
    },
    copyToBuffer() {
      this.stateCopying = true;
      navigator.clipboard.writeText(this.hrefToBackend);
      setTimeout(() => { this.stateCopying = false }, 3000);
    },
  },
};
</script>

<style scoped lang="scss">
.share-vk-icon {
  display: block;
  width: 1.8rem;
  height: 1.8rem;
  background-color: var(--corporate-bg-a);
  mask: var(--share-icon-url) center / contain no-repeat;
  -webkit-mask: var(--share-icon-url) center / contain no-repeat;
}
</style>
