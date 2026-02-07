<template>
  <figure :class="['file', pFileJson.fType]">
    <video
      v-if="UtilsFS.typeVideo === pFileJson.fType"
      :src="pFileJson.url_path"
      controls
      preload="metadata"
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
      @click="popupOpen"
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
  </figure>
</template>

<script>
import UtilsFS from "@/Utils/UtilsFS";
import PopupObj from "@/services/PopupObj";

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

    popupOpen() {
      PopupObj.item.url = this.pFileJson.url_path;
      PopupObj.item.title = this.pFileJson.name_human;
      PopupObj.item.type = this.pFileJson.fType;
      PopupObj.isOn = true;
    },
  },
};
</script>

<style scoped lang="css">
figure.file {
  height: 40vh;
  min-width: 10vw;
  padding: 2px;
  margin: 0;

  figcaption {
    margin-top: 20px;
    a,
    a:hover {
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

  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }

  audio {
    width: 100%;
    object-fit: contain;
  }

  video {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }

  a.generic,
  a.generic:hover {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 7cm;
    gap: 20px;
    align-items: stretch;
    text-decoration: none;
    color: white;

    .text {
      flex: 0 1 auto;

      background-color: black;
      border-radius: 5px;
      padding: 2px;
    }

    .icon {

      /* Takes remaining vertical space */
      flex: 1 0 auto;
      min-height: 0; /* Critical for shrinkage */

      /* Center the SVG */
      display: flex;
      align-items: center; /* Vertical centering */
      justify-content: center; /* Horizontal centering */

      svg {
        /* Fill the container's height */
        height: 100%;

        /* Maintain aspect ratio while filling height */
        width: auto;

        /* Ensure it doesn't overflow */
        max-width: 100%;
        max-height: 100%;

        /* Remove inline spacing */
        display: block;

        /* Optional: control scaling behavior */
        object-fit: contain;
        object-position: center;
      }
    }
  }
}

figure.audio {
  width: min(90vw, 15cm);
}
</style>
