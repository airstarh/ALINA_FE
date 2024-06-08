<template>
  <div class="alina-file">

    <div v-if="UtilsFS.typeVideo === pFileJson.fType">
      <figure>
        <video
            :src="pFileJson.url_path"
            controls
        ></video>
      </figure>
    </div>

    <div v-if="UtilsFS.typeAudio === pFileJson.fType">
      <figure>
        <audio
            :src="pFileJson.url_path"
            controls
        ></audio>
      </figure>
    </div>

    <a
        :href="pFileJson.url_path"
        :title="pFileJson.name_human"
        target="_blank"
        :download="flagShowDownLoad(pFileJson.fType) ? pFileJson.name_human : null"
    >
      <img
          v-if="UtilsFS.typeImage === pFileJson.fType"
          :src="pFileJson.url_path"
          :alt="pFileJson.name_human"
          :title="pFileJson.name_human"
          class="alina-file-image"
      >
      <div class="alina-file-icon">
        <b-icon v-if="UtilsFS.typeGeneric === pFileJson.fType" icon="file-earmark-richtext"></b-icon>
        <b-icon v-if="UtilsFS.typeText === pFileJson.fType" icon="card-text"></b-icon>
        <b-icon v-if="UtilsFS.typeTextVector === pFileJson.fType" icon="file-word-fill"></b-icon>
        <b-icon v-if="UtilsFS.typeTable === pFileJson.fType" icon="file-excel-fill"></b-icon>
        <b-icon v-if="UtilsFS.typePresentation === pFileJson.fType" icon="file-ppt-fill"></b-icon>
        <b-icon v-if="UtilsFS.typeEmail === pFileJson.fType" icon="chat-dots-fill"></b-icon>
        <b-icon v-if="UtilsFS.typePdf === pFileJson.fType" icon="file-pdf-fill"></b-icon>
        <b-icon v-if="UtilsFS.typeArchive === pFileJson.fType" icon="folder-fill"></b-icon>
        <b-icon v-if="UtilsFS.typeWeb === pFileJson.fType" icon="file-earmark-code"></b-icon>
        <!--        <b-icon v-if="UtilsFS.typeVideo === pFileJson.fType" icon="play-circle-fill"></b-icon>-->
        <!--        <b-icon v-if="UtilsFS.typeAudio === pFileJson.fType" icon="music-note-beamed"></b-icon>-->
      </div>
      <div class="alina-file-name">
        {{ pFileJson.name_human }}
      </div>
    </a>
  </div>
</template>

<script>
import UtilsFS from "@/Utils/UtilsFS";

export default {
  name:     "AlinAFile",
  computed: {},
  props:    {
    pFileJson: {
      default: {}
    },
  },

  data() {
    return {
      UtilsFS
    }
  },
  methods: {
    flagShowDownLoad(fType) {
      return (
          UtilsFS.typeImage !== fType
          &&
          UtilsFS.typePdf !== fType
          &&
          UtilsFS.typeAudio !== fType
          &&
          UtilsFS.typeVideo !== fType
          &&
          UtilsFS.typeText !== fType
          &&
          UtilsFS.typeWeb !== fType
      )
    }
  }
};
</script>
<style scoped lang="scss">

.alina-file-icon {
  font-size: 10vmin;
}

.alina-file-name {
  text-align: left;
  font-size: 3vmin;
}

.alina-file-image {
  width: 100%;
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
</style>
