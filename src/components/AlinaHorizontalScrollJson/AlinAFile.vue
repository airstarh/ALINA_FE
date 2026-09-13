<template>
  <div :class="['alina-file', pFileJson.fType]">
    <div class="icon">
      <video
        v-if="UtilsFS.typeVideo === pFileJson.fType"
        :src="fileUrl"
        controls
        preload="metadata"
        :title="pFileJson.name_human"
      />

      <audio
        v-else-if="UtilsFS.typeAudio === pFileJson.fType"
        :src="fileUrl"
        controls
        preload="none"
        :title="pFileJson.name_human"
      />

      <img
        v-else-if="UtilsFS.typeImage === pFileJson.fType"
        :src="fileUrl"
        :alt="pFileJson.name_human"
        :title="pFileJson.name_human"
        @click="popupOpen"
      />

      <a
        v-else
        class="thumbnail"
        :href="fileUrl"
        :title="pFileJson.name_human"
        target="_blank"
        :download="
          flagShowDownLoad(pFileJson.fType) ? pFileJson.name_human : null
        "
      >
        <img
          v-if="UtilsFS.typePdf === pFileJson.fType"
          :src="iconFilePdf"
          class="file-type-icon file-type-icon-pdf"
          alt=""
        />
        <img
          v-else
          :src="iconFileGeneric"
          class="file-type-icon"
          alt=""
        />
      </a>
    </div>

    <div class="text wrap-extreme">
      <a
        :href="fileUrl"
        :title="pFileJson.name_human"
        target="_blank"
        :download="
          flagShowDownLoad(pFileJson.fType) ? pFileJson.name_human : null
        "
      >
        {{ pFileJson.name_human }}
      </a>
    </div>
  </div>
</template>

<script>
import UtilsFS from "@/Utils/UtilsFS";
import PopupObj from "@/services/PopupObj";
import iconFilePdf from "bootstrap-icons/icons/file-earmark-pdf.svg?url&no-inline";
import iconFileGeneric from "bootstrap-icons/icons/file-earmark-richtext.svg?url&no-inline";

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
      iconFilePdf,
      iconFileGeneric,
    };
  },

  computed: {
    fileUrl() {
      const path = this.pFileJson.url_path;

      if (!path) {
        return "";
      }

      const baseUrl = import.meta.env.VITE_APP_ALINA_DOMAIN || window.location.origin;

      try {
        return new URL(path, baseUrl).href;
      } catch {
        return path;
      }
    },
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
      PopupObj.item.id = this.pFileJson.id;
      PopupObj.item.url = this.fileUrl;
      PopupObj.item.title = this.pFileJson.name_human;
      PopupObj.item.type = this.pFileJson.fType;
      PopupObj.isOn = true;
    },
  },
};
</script>

<style scoped lang="css">
.alina-file {
  height: 40vh;
}

.alina-file.audio,
.alina-file.video {
  width: min(90vw, 10cm);
}

.thumbnail {
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
}

.thumbnail .file-type-icon {
  object-position: left center;
  filter: invert(1);
}

.thumbnail .file-type-icon-pdf {
  filter: invert(22%) sepia(99%) saturate(5400%) hue-rotate(355deg)
    brightness(92%) contrast(118%);
}
</style>
