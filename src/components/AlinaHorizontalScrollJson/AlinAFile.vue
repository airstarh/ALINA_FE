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
      PopupObj,
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
      this.PopupObj.item.url = this.pFileJson.url_path;
      this.PopupObj.item.title = this.pFileJson.name_human;
      this.PopupObj.item.type = this.pFileJson.fType;
      this.PopupObj.isOn = true;
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
</style>
