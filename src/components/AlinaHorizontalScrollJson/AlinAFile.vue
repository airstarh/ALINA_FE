<template>
  <div :class="['alina-file', pFileJson.fType, displayMode]">
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

    <div
      v-if="showCaption"
      class="text wrap-extreme">
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
      <span class="file-meta">
        <small v-if="fileSize" class="file-size">{{ fileSize }}</small>
        <button type="button" class="file-copy-button" :title="$t('Copy URL')" :aria-label="$t('Copy URL')" @click="copyFileUrl">
          {{ $t(copied ? 'i_ok' : 'i_copy') }}
        </button>
      </span>
      <router-link v-if="pFileJson.source_path" :to="pFileJson.source_path" class="file-source-link">
        {{ sourceLabel }}
      </router-link>
      <span v-else-if="pFileJson.source_type" class="file-source-link">{{ sourceLabel }}</span>
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
    displayMode: {
      type: String,
      default: "horizontal",
      validator: (value) => ["horizontal", "vertical"].includes(value),
    },
    showCaption: {
      type: Boolean,
      default: true,
    },
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
      copied: false,
      copyTimer: null,
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
    fileSize() {
      return UtilsFS.formatFileSize(this.pFileJson.size);
    },
    sourceLabel() {
      const labels = {tale: 'Tale', comment: 'Comment', user: 'Profile'};
      const label = this.$t(labels[this.pFileJson.source_type] || this.pFileJson.source_type);
      return `${label} #${this.pFileJson.entity_id}`;
    },
  },

  beforeUnmount() {
    clearTimeout(this.copyTimer);
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
    async copyFileUrl() {
      try {
        await navigator.clipboard.writeText(this.fileUrl);
        this.copied = true;
        clearTimeout(this.copyTimer);
        this.copyTimer = setTimeout(() => {
          this.copied = false;
        }, 3000);
      } catch {
        this.copied = false;
      }
    },
  },
};
</script>

<style scoped lang="css">
.alina-file.horizontal {
  height: 40vh;
  max-height: 400px;
}

.text {
  display: flex;
  flex-direction: column;
}

.file-meta { display: flex; align-items: center; gap: .4rem; }
.file-size { display: inline-block; }
.file-copy-button { min-width: 2rem; padding: 0 .35rem; border: 1px solid #777; border-radius: .25rem; color: inherit; background: transparent; }
.file-copy-button:hover { background: #444; }
.file-source-link { display: block; color: #8fc7ff; font-size: .85rem; }

.alina-file.horizontal.audio,
.alina-file.horizontal.video {
  width: min(90vw, 10cm);
}

.alina-file.vertical {
  box-sizing: border-box;
  width: 17mm;
  min-width: 17mm;
  padding: 2px 2px;
  gap: 0;
  background-color: transparent;
}

.alina-file.vertical.audio,
.alina-file.vertical.video,
.alina-file.vertical.image {
  width: min(98vw, 150mm);
}

.alina-file.vertical .icon {
  width: 100%;
  height: 15mm;
  flex: 0 0 auto;
}

.alina-file.vertical.image .icon,
.alina-file.vertical.video .icon {
  height: auto;
}

.alina-file.vertical audio {
  width: 100%;
  height: 100%;
}

.alina-file.vertical.image img,
.alina-file.vertical video {
  width: 100%;
  height: auto;
  border-radius: 30px;
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
