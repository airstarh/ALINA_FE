<template>
  <figure
    :class="[
      'file',
      {
        audio: UtilsFS.typeAudio === pFileJson.fType,
        video: UtilsFS.typeVideo === pFileJson.fType,
        image: UtilsFS.typeImage === pFileJson.fType,
      },
    ]"
  >
    <video
      v-if="UtilsFS.typeVideo === pFileJson.fType"
      :src="pFileJson.url_path"
      controls
      preload="none"
      :title="pFileJson.name_human"
    />

    <audio
      v-else-if="UtilsFS.typeAudio === pFileJson.fType"
      :src="pFileJson.url_path"
      controls
      preload="none"
      class="wrap-extreme"
      :title="pFileJson.name_human"
    />

    <img
      v-else-if="UtilsFS.typeImage === pFileJson.fType"
      :src="pFileJson.url_path"
      :alt="pFileJson.name_human"
      :title="pFileJson.name_human"
      @click="openImagePopup"
    />

    <a
      v-else
      class="generic wrap-extreme"
      :href="pFileJson.url_path"
      :title="pFileJson.name_human"
      target="_blank"
      :download="
        flagShowDownLoad(pFileJson.fType) ? pFileJson.name_human : null
      "
    >
      <div class="text wrap-extreme">{{ pFileJson.name_human }}</div>
      <div class="icon">
        <b-icon
          v-if="UtilsFS.typePdf === pFileJson.fType"
          icon="file-earmark-pdf"
        ></b-icon>
        <b-icon
          v-else
          icon="file-earmark-richtext"
        ></b-icon>
      </div>
    </a>

    <figcaption v-if="UtilsFS.typeAudio === pFileJson.fType">
      <a
        :href="pFileJson.url_path"
        :title="pFileJson.name_human"
        target="_blank"
        :download="
          flagShowDownLoad(pFileJson.fType) ? pFileJson.name_human : null
        "
        class="wrap-extreme"
      >
        {{ pFileJson.name_human }}
      </a>
    </figcaption>

    <!-- # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #  -->

    <!-- region POPUP -->
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
    <!-- endregion POPUP -->
  </figure>
</template>

<script>
import UtilsFS from "@/Utils/UtilsFS";

export default {
  name: "AlinAFile",
  props: {
    pFileJson: {
      type: Object,
      required: true,
      default: () => ({
        url_path: "",
        name_human: "",
        fType: "generic",
      }),
    },
  },
  data() {
    return {
      UtilsFS,
      isImagePopupOpen: false,
      popupStateKey: null,
      savedScrollPosition: 0,
    };
  },
  methods: {
    flagShowDownLoad(fType) {
      return (
        UtilsFS.typeImage !== fType &&
        UtilsFS.typePdf !== fType &&
        UtilsFS.typeAudio !== fType &&
        UtilsFS.typeVideo !== fType &&
        UtilsFS.typeText !== fType &&
        UtilsFS.typeWeb !== fType
      );
    },

    openImagePopup() {
      // 1. Save current scroll position
      this.savedScrollPosition = window.scrollY;

      // 2. Disable background scrolling
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${this.savedScrollPosition}px`;

      // 3. Open popup
      this.isImagePopupOpen = true;

      // 4. Create unique state key and push to history
      this.popupStateKey = `alinaPopup_${Date.now()}`;
      history.pushState({ popupKey: this.popupStateKey }, "");

      // 5. Listeners
      window.addEventListener("popstate", this.handlePopState);
      document.addEventListener("keydown", this.handleEscKey);
    },

    closeImagePopup() {
      if (!this.isImagePopupOpen) return;

      // 1. Close popup
      this.isImagePopupOpen = false;

      // 2. Restore scrolling
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("top");
      window.scrollTo(0, this.savedScrollPosition);

      // 3. Clean history (remove our entry)
      history.replaceState({}, document.title);

      // 4. Remove listeners
      window.removeEventListener("popstate", this.handlePopState);
      document.removeEventListener("keydown", this.handleEscKey);
    },

    handlePopState(event) {
      // Only close if our popup state is active
      if (event.state && event.state.popupKey === this.popupStateKey) {
        this.closeImagePopup();
      }
    },

    handleEscKey(event) {
      if (event.key === "Escape" || event.key === "Backspace") {
        this.closeImagePopup();
      }
    },
  },
  mounted() {
    // Early listener for popstate (catches back button before interaction)
    window.addEventListener("popstate", this.handlePopState);
  },
  beforeDestroy() {
    // Cleanup listeners
    window.removeEventListener("popstate", this.handlePopState);
    document.removeEventListener("keydown", this.handleEscKey);
  },
};
</script>

<style scoped lang="css">
figure.file {
  height: 40vh;
  min-width: 10vw;
  padding: 2px;
  margin: 0;

  & figcaption {
    margin-top: 20px;
    & a,
    & a:hover {
      display: inline-block;
      text-decoration: none;
      color: white;
      background-color: #000000;
      border-radius: 5px;
      padding: 2px;

      text-align: left;
      font-size: 0.9em;
    }
  }

  & img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }

  & audio {
    width: 100%;
    object-fit: contain;
  }

  & video {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }

  & a.generic,
  & a.generic:hover {
    height: 100%;
    width: 7cm;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
    text-decoration: none;
    color: white;

    & .text {
      flex: 1 0 auto;

      background-color: black;
      border-radius: 5px;
      padding: 2px;
    }

    & .icon {
      flex: 0 1 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      & svg {
        display: block;
        height: 100%;
        width: auto;
        object-fit: contain;
      }
    }
  }
}

figure.audio {
  width: 8cm;
}

/* # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #  */

figure {
  & .image-popup-overlay {
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
  }

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
