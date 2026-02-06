<template>
  <div
    v-if="isPopupOpen"
    class="popup-overlay"
    @click.self="popupClose"
    role="dialog"
    aria-modal="true"
  >
    <div class="popup-content">
      <button
        class="popup-close"
        @click="popupClose"
        aria-label="Close image popup"
        tabindex="0"
      >
        {{ $t("i_close") }}
      </button>
      <img
        class="popup-subject"
        :src="pFileJson.url_path"
        :alt="pFileJson.name_human"
        @click.self="popupClose"
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
      PopupObj,
      isPopupOpen: false,
      popupStateKey: null,
      savedScrollPosition: 0,
    };
  },

  components: {},

  methods: {
    popupOpen() {
      // 1. Save current scroll position
      this.savedScrollPosition = window.scrollY;

      // 2. Disable background scrolling
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${this.savedScrollPosition}px`;

      // 3. Open popup
      this.isPopupOpen = true;

      // 4. Create unique state key and push to history
      this.popupStateKey = `alinaPopup_${Date.now()}`;
      history.pushState({ popupKey: this.popupStateKey }, "");

      // 5. Listeners
      window.addEventListener("popstate", this.popupStateHandle);
      document.addEventListener("keydown", this.popupHandleCloseByKeyboard);
    },

    popupClose() {
      if (!this.isPopupOpen) return;

      // 1. Close popup
      this.isPopupOpen = false;

      // 2. Restore scrolling
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("top");
      window.scrollTo(0, this.savedScrollPosition);

      // 3. Clean history (remove our entry)
      history.replaceState({}, document.title);

      // 4. Remove listeners
      window.removeEventListener("popstate", this.popupStateHandle);
      document.removeEventListener("keydown", this.popupHandleCloseByKeyboard);
    },

    popupStateHandle(event) {
      // Only close if our popup state is active
      if (event.state && event.state.popupKey === this.popupStateKey) {
        this.popupClose();
      }
    },

    popupHandleCloseByKeyboard(event) {
      if (event.key === "Escape" || event.key === "Backspace") {
        this.popupClose();
      }
    },
  },

  mounted() {
    // Early listener for popstate (catches back button before interaction)
    window.addEventListener("popstate", this.popupStateHandle);
  },

  beforeDestroy() {
    // Cleanup listeners
    window.removeEventListener("popstate", this.popupStateHandle);
    document.removeEventListener("keydown", this.popupHandleCloseByKeyboard);
  },

  computed: {},
};
</script>

<style scoped lang="css">
.popup-overlay {
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

  & .popup-content {
    position: relative;
    height: 99vh;
    display: flex;
    justify-content: center;
    align-items: center;

    & .popup-close {
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

    & .popup-subject {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>
