<template>
  <div class="mt-1 mb-1">
    <div v-if="modeEdit">
      <div class="row">
        <div class="col">
          <span class="text-lg-left">
          <ui-checkbox v-model="item.geo_is_map_shown" :trueValue="1" :false-value="0" :checked="item.geo_is_map_shown==1">{{ $t("Show map") }}</ui-checkbox>
            </span>
        </div>
      </div>
      <div class="row" v-if="item.geo_is_map_shown == 1">
        <div class="col">
          <a href="https://yandex.ru/maps/" target="_blank" class="btn btn-small btn-primary mt-2 mb-2">
            {{ $tc('Pick a point on Yandex Maps.') }}
          </a>
        </div>

      </div>
      <div class="row" v-if="item.geo_is_map_shown == 1">
        <div class="col-lg">
          <div>
            <div class="input-group input-group mb-3">
              <!--dtLatLongCSV-->
              <div class="input-group-prepend">
                <span class="input-group-text bg-dark text-light">{{ $tc('dtLatLongCSV') }}</span>
              </div>
              <input type="text" class="form-control" :placeholder="$tc('dtLatLongCSV')" v-model="dtLatLongCSV">
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-if="item.geo_is_map_shown == 1">
        <div class="col-lg">
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
        <div class="col-lg">
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
        <div class="col-lg">
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
        <div class="col-lg">
          <div>
            <div class="input-group input-group mb-3">
              <!-- item.geo_map_type -->
              <div class="input-group-prepend">
                <span class="input-group-text bg-dark text-light">{{ $tc('Map type') }}</span>
              </div>
              <select class="form-control" v-model="item.geo_map_type" @change="onTypeChange(item.geo_map_type)">
                <option disabled value="">-</option>
                <option>map</option>
                <option>hybrid</option>
                <option>satellite</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <yandex-map
        v-if="item.geo_is_map_shown == 1"
        :settings="ConfigApi.YandexMaps"
        :controls="tagYandexMap.controls"
        :coords="[item.geo_latitude, item.geo_longitude]"
        :zoom="item.geo_zoom"
        :scroll-zoom="false"
        style="width: 95%; height: 500px;"
        :behaviors="['default']"
        :map-type="item.geo_map_type"
        :cluster-options="{
            1: {clusterDisableClickZoom: false}
          }"
    >
      <ymap-marker
          :marker-id="`yandex_map_${item.id}`"
          marker-type="placemark"
          :coords="[item.geo_latitude, item.geo_longitude]"
          :hint-content="item.header"
          :balloon="{header: computedMarkerHeader, body: '', footer: ''}"
          :icon="{color: 'violet', glyph: 'dot'}"
          cluster-name="1"
      ></ymap-marker>
    </yandex-map>
  </div>
</template>

<script>
import UtilsData               from "@/Utils/UtilsData";
import ConfigApi               from "@/configs/ConfigApi";
import AlinaPageGlobalAnalyzer from "@/services/AlinaPageGlobalAnalyzer";

export default {
  name: "AlinaYandexMap",
  created() {
    this.mMapLatLonToCSV();
    this.pageRecalcIframeHeight();
  },
  props: {
    item:      {
      type:    Object,
      default: () => {
        return {
          id:               null,
          header:           'Home',
          body:             '',
          body_txt:         '',
          geo_latitude:     55.798324,
          geo_longitude:    37.618993,
          geo_map_type:     'map',
          geo_zoom:         14,
          geo_is_map_shown: 0,
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
      dtLatLongCSV: '',
      ConfigApi,
      tagYandexMap: {
        controls: ['fullscreenControl', 'geolocationControl', 'trafficControl', 'zoomControl', 'typeSelector',]
      }
    }
  },
  computed: {
    computedMarkerHeader() {
      let res = this.item.header;
      if (!UtilsData.empty(this.markerUrl)) {
        res = `<a href="${this.computedMarkerUrl}">${this.item.header}</a> `;
      }
      return res;
    },
    computedMarkerUrl() {
      let res = '/';
      if (this.markerUrl) {
        res = this.markerUrl;
      }
      if (this.item.id) {
        if (this.item.router_alias) {
          res = `${ConfigApi.url_base}/${this.item.router_alias}`;
        } else {
          res = `${ConfigApi.url_base}/tale/upsert/${this.item.id}`;
        }
      }
      return res;
    }
  },
  watch:    {
    // ##################################################
    // # region Lat Lon Smart
    "item.geo_latitude":  function () {
      this.mMapLatLonToCSV();
    },
    "item.geo_longitude": function () {
      this.mMapLatLonToCSV();
    },
    "dtLatLongCSV":       function (newVal) {
      let arr = newVal.split(',');
      if (arr[0]) {
        this.item.geo_latitude = arr[0].trim();
      } else {
        this.item.geo_latitude = '';
      }
      if (typeof arr[1] !== 'undefined') {
        this.item.geo_longitude = arr[1].trim();
      } else {
        this.item.geo_longitude = '';
      }
    }, // # endregion Lat Lon Smart
    // ##################################################
  },
  methods:  {
    // ##################################################
    // # region Lat Lon Smart
    mMapLatLonToCSV() {
      let geo_latitude  = this.item.geo_latitude;
      let geo_longitude = this.item.geo_longitude;
      if (!UtilsData.isNumber(geo_latitude)) {
        geo_latitude = 0;
      }
      if (!UtilsData.isNumber(geo_longitude)) {
        geo_longitude = 0;
      }
      if (geo_latitude + geo_longitude === 0) {
        this.dtLatLongCSV = '';
      } else {
        this.dtLatLongCSV = `${geo_latitude}, ${geo_longitude}`;
      }
    }, // # endregion Lat Lon Smart
    // ##################################################
    onTypeChange(newValue) {
      this.item.geo_is_map_shown = 0;
      this.item.geo_is_map_shown = 1;
      this.pageRecalcIframeHeight();
      this.$forceUpdate();
    },
    pageRecalcIframeHeight() {
      const iframeClassName = `AlinaIframe-tale-${this.item.id}`;
      const heightRefClassName = `alina-tale-id-${this.item.id}`;
      AlinaPageGlobalAnalyzer.pageRecalcIframeHeight(iframeClassName, heightRefClassName);
    },
  }
};
</script>

<style scoped lang="scss"></style>
