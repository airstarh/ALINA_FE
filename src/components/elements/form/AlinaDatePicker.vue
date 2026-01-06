<template>

  <div class="alina-date-picker">
    <div v-if="modeEdit" class="row no-gutters align-items-center justify-content-between">
      <div class="col p-0 m-0" v-if="label.length">
        <div>{{ $t(label) }}</div>
      </div>
      <div class="col">
        <div class="row no-gutters align-items-center justify-content-start">
          <div class="col text-nowrap mb-1" v-if="['date', 'dateTime'].includes(format)">
            &nbsp;
            <aInput v-model="year" :label='$t("DT_Y")' :placeholder="$t('YEAR')" :modeEdit="true" :maxLength="4" :max="9999" :min="0" type="number" :idNameKey="`year-${idq}`" inputWidth="7ch" labelWidth="3ch" labelAlign="right" />
            &nbsp;
            <aInput v-model="month" :label='$t("DT_M")' :placeholder="$t('MONTH')" :modeEdit="true" :maxLength="2" :max="12" :min="1" type="number" :idNameKey="`month-${idq}`" inputWidth="7ch" labelWidth="3ch" labelAlign="right" />
            &nbsp;
            <aInput v-model="day" :label='$t("DT_D")' :placeholder="$t('DAY')" :modeEdit="true" :maxLength="2" :max="31" :min="1" type="number" :idNameKey="`day-${idq}`" inputWidth="7ch" labelWidth="3ch" labelAlign="right" />
          </div>
          <div class="col text-nowrap mb-1" v-if="['time', 'dateTime'].includes(format)">
            &nbsp;
            <aInput v-model="hour" type="number" :placeholder="$t('HOUR')" :label='$t("DT_h")' :maxLength="2" :max="23" :min="0" :idNameKey="`hour-${idq}`" :modeEdit="true" inputWidth="7ch" labelWidth="3ch" labelAlign="right" />
            &nbsp;
            <aInput v-model="min" type="number" :placeholder="$t('MINUTE')" :label='$t("DT_m")' :maxLength="2" :max="59" :min="0" :idNameKey="`min-${idq}`" :modeEdit="true" inputWidth="7ch" labelWidth="3ch" labelAlign="right" />
            &nbsp;
            <aInput v-model="sec" type="number" :placeholder="$t('SECOND')" :label='$t("DT_s")' :maxLength="2" :max="59" :min="0" :idNameKey="`sec-${idq}`" :modeEdit="true" inputWidth="7ch" labelWidth="3ch" labelAlign="right" />
          </div>
          <div class="col text-nowrap mb-1">
            &nbsp;
            <strong>{{ UtilsDate.fromUnixToDateTime(valueData) }}</strong>
            &nbsp;
            <span @click="setNow" class="btn btn-xs btn-primary">{{ $t("Set now") }}</span>
          </div>

        </div>
      </div>
    </div>
    <template v-if="!modeEdit">
      {{ doFormat(value) }}
    </template>
  </div>
</template>

<script>

import UtilsDate from "@/Utils/UtilsDate";
import aInput from "@/components/elements/form/aInput.vue";

export default {
  name: "AlinaDatePicker",
  created() {
    this.valueToDateObj();
  },
  updated() {
    this.valueToDateObj();
  },
  emits: ['input'],
  props: {
    value: {
      /**idq - ID qualifier*/
      type: Number,
      default: Math.floor(new Date().getTime() / 1000),
    },
    idq: {
      /**idq - ID qualifier*/
      type: String,
      default: '0',
    },
    label: {
      /**idq - ID qualifier*/
      type: String,
      default: 'Date',
    },
    modeEdit: {
      type: Boolean,
      default: true
    },
    format: {
      type: String,
      default: 'dateTime',
      validator: function (f) {
        return ['dateTime', 'date', 'time'].indexOf(f) !== -1;
      }
    }
  },
  data() {
    return {
      year: 1970,
      month: 1,
      day: 1,
      hour: 0,
      min: 0,
      sec: 0,
      dateObj: new Date(),
      valueData: 0,
      UtilsDate,
    }
  },
  methods: {

    valueToDateObj(v = null) {
      if (v === null) v = this.value;

      this.dateObj = new Date(v * 1000);
      this.year = this.dateObj.getFullYear();
      this.month = this.dateObj.getMonth() + 1;
      this.day = this.dateObj.getDate();
      this.hour = this.dateObj.getHours();
      this.min = this.dateObj.getMinutes();
      this.sec = this.dateObj.getSeconds();
    },

    valueDataCalculate: function () {
      this.dateObj = new Date();
      this.dateObj.setFullYear(this.year);
      this.dateObj.setMonth(this.month - 1);
      this.dateObj.setDate(this.day);
      this.dateObj.setHours(this.hour);
      this.dateObj.setMinutes(this.min);
      this.dateObj.setSeconds(this.sec);
      this.valueData = Math.floor(this.dateObj.getTime() / 1000);
      return this.valueData;
    },

    onChangeDate() {
      if (this.month < 1) this.month = 1;
      if (this.month > 12) this.month = 12;

      this.valueDataCalculate();

      this.$emit('input', this.valueData);
    },

    setNow() {
      this.valueData = Math.floor((new Date()).getTime() / 1000);
      this.valueToDateObj(this.valueData);
      this.$emit('input', this.valueData);
    },

    doFormat(value) {
      switch (this.format) {
        case 'time':
          return this.UtilsDate.fromUnixToTimeNoDate(value);
        case 'date':
          return this.UtilsDate.fromUnixToDateNoTime(value);
        case 'dateTime':
        default:
          return this.UtilsDate.fromUnixToDateTime(value);
      }
    }
  },
  computed: {

  },
  watch: {
    year() { this.onChangeDate() },
    month() { this.onChangeDate() },
    day() { this.onChangeDate() },
    hour() { this.onChangeDate() },
    min() { this.onChangeDate() },
    sec() { this.onChangeDate() },
  },
  components: {
    aInput
  }
};
</script>

<style lang="scss">
.alina-date-picker {
  display: inline-block;
}
</style>
