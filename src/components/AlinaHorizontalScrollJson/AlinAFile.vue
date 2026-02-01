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
    >
      <div class="image-popup-content">
        <button
          class="image-popup-close"
          @click="closeImagePopup"
          aria-label="Close"
        >
          ×
        </button>
        <img
          :src="pFileJson.url_path"
          :alt="pFileJson.name_human"
          class="image-popup-img"
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
      isImagePopupOpen: false, // Track popup state
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
    },
    closeImagePopup() {
      this.isImagePopupOpen = false;
    },
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
  position: relative;

  & .alina-file-image-container {
    cursor: pointer;
    &:hover {
      opacity: 0.9;
    }
  }

  /* Popup overlay (full screen, dark background) */
  & .image-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  /* Popup content (image + close button) */
  & .image-popup-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
  }

  /* Close button */
  & .image-popup-close {
    position: absolute;
    top: -10px;
    right: -10px;
    background: rgb(153, 0, 0);
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 3 Newton;
    font-size: 20px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
    z-index: 1001;
  }

  /* Image inside popup */
  & .image-popup-img {
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 4px;
  }
}
</style>
