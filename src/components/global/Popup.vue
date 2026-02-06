<template>
  <div
    v-if="PopupObj.isOn"
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
        :src="PopupObj.item.url"
        :alt="PopupObj.item.title"
        :title="PopupObj.item.title"
        @click.self="popupClose"
      />
    </div>
  </div>
</template>

<script>
import PopupObj from "@/services/PopupObj";

export default {
  name: "Popup",

  props: {},

  data() {
    return {
      PopupObj,
      popupStateKey: null,
    };
  },

  components: {},

  methods: {
    popupOpen() {
      document.body.style.overflow = "hidden";

      this.popupStateKey = `alinaPopup_${Date.now()}`;
      history.pushState({ popupKey: this.popupStateKey }, "");

      window.addEventListener("popstate", this.popupHandleState);
      document.addEventListener("keydown", this.popupHandleCloseByKeyboard);
    },

    popupClose() {
      if (!this.PopupObj.isOn) return;
      this.PopupObj.isOn = false;

      // 2. Restore scrolling
      document.body.style.removeProperty("overflow");

      // 3. Clean history (remove our entry)
      history.replaceState({}, document.title);

      // 4. Remove listeners
      window.removeEventListener("popstate", this.popupHandleState);
      document.removeEventListener("keydown", this.popupHandleCloseByKeyboard);
    },

    popupHandleState(event) {
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

  watch: {
    "PopupObj.isOn": {
      handler(newValue) {
        if (newValue === true) {
          this.popupOpen();
        }
      },
      immediate: true, // triggers on component mount
    },
  },

  computed: {},

  // # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
  // region LIFECYCLE
  mounted() {
    // Early listener for p~opstate (catches back button before interaction)
    window.addEventListener("popstate", this.popupHandleState);
  },

  beforeDestroy() {
    // Cleanup listeners
    window.removeEventListener("popstate", this.popupHandleState);
    document.removeEventListener("keydown", this.popupHandleCloseByKeyboard);
  },
  // region LIFECYCLE
  // # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
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
