<template>
  <div class="mt-5 mb-5">
    <div class="row" v-if="modeEdit">
      <div class="col">
        <div>
          <div class="input-group input-group mb-3">
            <!-- item.geo_latitude -->
            <div class="input-group-prepend">
              <span class="input-group-text bg-dark text-light">{{ $tc('Latitude') }}</span>
            </div>
            <input type="text" class="form-control" :placeholder="$tc('Latitude')" v-model="item.geo_latitude">
          </div>
        </div>
      </div>
      <div class="col">
        <div>
          <div class="input-group input-group mb-3">
            <!-- item.geo_longitude -->
            <div class="input-group-prepend">
              <span class="input-group-text bg-dark text-light">{{ $tc('Longitude') }}</span>
            </div>
            <input type="text" class="form-control" :placeholder="$tc('Longitude')" v-model="item.geo_longitude">
          </div>
        </div>
      </div>
      <div class="col">
        <div>
          <div class="input-group input-group mb-3">
            <!-- item.geo_zoom -->
            <div class="input-group-prepend">
              <span class="input-group-text bg-dark text-light">{{ $tc('Zoom') }}</span>
            </div>
            <input type="text" class="form-control" :placeholder="$tc('Zoom')" v-model="item.geo_zoom">
          </div>
        </div>
      </div>
      <div class="col">
        <div>
          <div class="input-group input-group mb-3">
            <!-- item.geo_map_type -->
            <div class="input-group-prepend">
              <span class="input-group-text bg-dark text-light">{{ $tc('Map type') }}</span>
            </div>
            <select class="form-control" v-model="item.geo_map_type">
              <option disabled value="">-</option>
              <option>map</option>
              <option>hybrid</option>
              <option>satellite</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <yandex-map
        :settings="ConfigApi.YandexMaps"
        :controls="tagYandexMap.controls"
        :coords="[item.geo_latitude, item.geo_longitude]"
        :zoom="item.geo_zoom"
        :scroll-zoom="false"
        style="width: 100%; height: 600px;"
        :behaviors="['default']"
        :map-type="item.geo_map_type"
        :cluster-options="{
            1: {clusterDisableClickZoom: false}
          }"
        @typechange="onTypeChange"
    >
      <ymap-marker
          :marker-id="`yandex_map_${item.id}`"
          marker-type="placemark"
          :coords="[item.geo_latitude, item.geo_longitude]"
          :hint-content="item.header"
          :balloon="{header: computedMarkerHeader, body: '', footer: ''}"
          :icon="{color: 'red', glyph: 'cinema'}"
          cluster-name="1"
      ></ymap-marker>
    </yandex-map>
  </div>
</template>

<script>
import UtilsData from "@/Utils/UtilsData";
import ConfigApi from "@/configs/ConfigApi";
export default {
  name:  "AlinaYandexMap",
  props: {
    item:      {
      type:    Object,
      default: () => {
        return {
          id:            null,
          header:        'Home',
          body:          '',
          body_txt:      '',
          geo_latitude:  55.798324,
          geo_longitude: 37.618993,
          //geo_map_type:  'hybrid',
          geo_map_type:  'map',
          geo_zoom:      14,
        }
      },
    },
    modeEdit:  {
      type:    Boolean,
      default: true
    },
    markerUrl: {
      type:    String,
      default: '/'
    },
  },
  data() {
    return {
      ConfigApi,
      tagYandexMap: {
        controls: ['smallMapDefaultSet']
      }
    }
  },
  computed: {
    computedMarkerHeader() {
      let res = this.item.header;
      if (!UtilsData.empty(this.markerUrl)) {
        res = `<a href="${this.markerUrl}">${this.item.header}</a> `;
      }
      return res;
    }
  },
  methods:  {
    onTypeChange(e){
      console.log(">>>>>>>>>>>>>>>>>>>>");
      console.log("onTypeChange");
      console.log(e);
    }
  }
};
</script>

<style scoped lang="scss"></style>
