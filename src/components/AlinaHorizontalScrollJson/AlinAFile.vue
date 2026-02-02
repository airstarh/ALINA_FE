<template>
  <div class="alina-file">
    <!-- Video -->
    <div v-if="UtilsFS.typeVideo === pFileJson.fType">
      <figure>
        <video
          :src="pFileJson.url_path"
          controls
          preload="none"
        ></video>
      </figure>
    </div>

    <!-- Audio -->
    <div v-if="UtilsFS.typeAudio === pFileJson.fType">
      <figure>
        <audio
          :src="pFileJson.url_path"
          controls
          preload="none"
        ></audio>
      </figure>
    </div>

    <!-- Image (now with popup) -->
    <div
      v-if="UtilsFS.typeImage === pFileJson.fType"
      class="alina-file-image-container"
      @click="openImagePopup"
    >
      <figure class="alina-file-image">
        <img
          :src="pFileJson.url_path"
          :alt="pFileJson.name_human"
          :title="pFileJson.name_human"
        />
      </figure>
    </div>

    <!-- Other file types (icons + name) -->
    <a
      v-else
      :href="pFileJson.url_path"
      :title="pFileJson.name_human"
      target="_blank"
      :download="
        flagShowDownLoad(pFileJson.fType) ? pFileJson.name_human : null
      "
    >
      <div class="alina-file-icon">
        <!-- icons as before -->
        <b-icon
          v-if="UtilsFS.typeGeneric === pFileJson.fType"
          icon="file-earmark-richtext"
        ></b-icon>
        <!-- ... other icons ... -->
      </div>
      <div class="alina-file-name">
        {{ pFileJson.name_human }}
      </div>
    </a>

    <!-- Image Popup Modal -->
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
  </div>
</template>

<script>
import UtilsFS from "@/Utils/UtilsFS";

export default {
  name: "AlinAFile",
  props: {
    pFileJson: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      UtilsFS,
      isImagePopupOpen: false,
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
      this.isImagePopupOpen = true;

      history.pushState({ popup: true }, "");

      window.addEventListener("popstate", this.handlePopState);
      document.addEventListener("keydown", this.handleEscKey);
    },

    closeImagePopup() {
      this.isImagePopupOpen = false;

      history.replaceState({}, document.title);

      window.removeEventListener("popstate", this.handlePopState);
      document.removeEventListener("keydown", this.handleEscKey);
    },

    handlePopState(event) {
      if (event.state && event.state.popup) {
        this.closeImagePopup();
      }
    },

    handleEscKey(event) {
      if (event.key === "Escape") {
        this.closeImagePopup();
      }
    },
  },
  mounted() {
    // Handle focus trap
    if (this.isImagePopupOpen) {
      document.body.setAttribute("aria-hidden", "true");
    }
  },
  updated() {
    if (this.isImagePopupOpen) {
      // Focus close button when opened
      this.$nextTick(() => {
        const closeBtn = this.$el.querySelector(".image-popup-close");
        if (closeBtn) closeBtn.focus();
      });
    }
  },
  beforeDestroy() {
    window.removeEventListener("popstate", this.handlePopState);
    document.removeEventListener("keydown", this.handleEscKey);
  },
};
</script>

<style scoped lang="scss">
.alina-file {
  & .alina-file-icon {
    font-size: 10vmin;
  }

  & .alina-file-name {
    text-align: left;
    font-size: 3vmin;
  }

  & figure.alina-file-image {
    height: 35vmin;
    width: 100%;
    overflow: hidden;

    & img {
      width: 100%;
    }
  }

  figure {
    & audio {
      display: block;
      margin: 0;
      padding: 0;
      width: 99%;
    }

    & video {
      display: block;
      margin: 0;
      padding: 0;
      width: 99%;
      max-height: 35vmin;
    }
  }
}

.alina-file {
  & .image-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1111;
    overflow: auto;

    // Force viewport-relative, ignore any scrollable ancestors
    contain: layout size style;
  }

  & .image-popup-content {
    position: relative;
    max-width: 100vw;
    max-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

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
    // Key: force 100% of viewport in one dimension
    width: 100vw;
    height: 100vh;

    // Preserve aspect ratio — scale down if needed, never stretch
    object-fit: contain;

    // Center the image inside the box
    object-position: center;

    // Visual polish
    border-radius: 6px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  }
}
</style>
