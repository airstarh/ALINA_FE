<template v-if="PopupObj.isOn">
  <div
    v-if="isImagePopupOpen"
    class="image-popup-overlay"
    @click.self="closeImagePopup"
    role="dialog"
    aria-modal="true"
  >
    <div class="image-popup-content">
      <button
        class="image-popup-close"
        @click="closeImagePopup"
        aria-label="Close image popup"
        tabindex="0"
      >
        {{ $t("i_close") }}
      </button>
      <img
        :src="pFileJson.url_path"
        :alt="pFileJson.name_human"
        class="image-popup-img"
        @click.self="closeImagePopup"
      />
    </div>
  </div>
</template>

<script>
import PopupObj from "@/services/PopupObj";

export default {
  name: "Spinner",

  props: {},

  data() {
    return {
      PopupObj: PopupObj,
      isImagePopupOpen: false,
      popupStateKey: null,
      savedScrollPosition: 0,
    };
  },

  components: {},

  methods: {},

  computed: {},
};
</script>

<style scoped lang="css">
.image-popup-overlay {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000000cc;
  z-index: 1111;
  overflow: hidden;

  & .image-popup-content {
    position: relative;
    height: 99vh;
    display: flex;
    justify-content: center;
    align-items: center;

    & .image-popup-close {
      position: absolute;
      top: 15px;
      right: 15px;
      background: var(--corporate-bg);
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      font-size: 24px;
      line-height: 36px;
      text-align: center;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
      z-index: 1111;
    }

    & .image-popup-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>
