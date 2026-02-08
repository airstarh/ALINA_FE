<template>
  <div :class="['alina-file', pFileJson.fType]">
    <div class="icon">
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
        class="thumbnail"
        :href="pFileJson.url_path"
        :title="pFileJson.name_human"
        target="_blank"
        :download="
          flagShowDownLoad(pFileJson.fType) ? pFileJson.name_human : null
        "
      >
        <b-icon
          v-if="UtilsFS.typePdf === pFileJson.fType"
          icon="file-earmark-pdf"
        ></b-icon>
        <b-icon
          v-else
          icon="file-earmark-richtext"
        ></b-icon>
      </a>
    </div>

    <div class="text wrap-extreme">
      <a
        :href="pFileJson.url_path"
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
      PopupObj.item.id = this.pFileJson.id;
      PopupObj.item.url = this.pFileJson.url_path;
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
  width: min(35ch, 90vw);
}

.alina-file.audio,
.alina-file.video {
  width: min(90vw, 10cm);
}
</style>
