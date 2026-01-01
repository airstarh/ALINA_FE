<template>

  <div class="alina-date-picker p-1 rounded">
    <div v-if="modeEdit" class="row no-gutters align-items-center justify-content-between">
      <div class="col-auto p-0 m-0" v-if="label.length">
        <div>{{ $t(label) }}</div>
      </div>
      <div class="col">
        <div class="container">
          <div class="row no-gutters align-items-center justify-content-start">
            <div class="col-auto text-nowrap p-1">
              <div class="form-inline">
                <div class="text-nowrap">
                  &nbsp;
                  <aInput v-model="year" :label='$t("DT_Y")' placeholder="YEAR" :modeEdit="true" :size="4" :max="9999" :min="0" type="number" :idNameKey="`year-${idq}`" />
                  &nbsp;
                  <aInput v-model="month" :label='$t("DT_M")' placeholder="MONTH" :modeEdit="true" :size="2" :max="12" :min="1" type="number" :idNameKey="`month-${idq}`" />
                  &nbsp;
                  <aInput v-model="day" :label='$t("DT_D")' placeholder="DAY" :modeEdit="true" :size="2" :max="31" :min="1" type="number" :idNameKey="`day-${idq}`" />
                </div>
              </div>
            </div>
            <div class="col-auto text-nowrap p-1">
              <div class="form-inline">
                <div class="text-nowrap">
                  &nbsp;
                  <aInput v-model="hour" type="number" placeholder="HOUR" :label='$t("DT_h")' :size="2" :max="23" :min="0" :idNameKey="`hour-${idq}`" :modeEdit="true" />
                  &nbsp;
                  <aInput v-model="min" type="number" placeholder="MIN" :label='$t("DT_m")' :size="2" :max="59" :min="0" :idNameKey="`min-${idq}`" :modeEdit="true" />
                  &nbsp;
                  <aInput v-model="sec" type="number" placeholder="SEC" :label='$t("DT_s")' :size="2" :max="59" :min="0" :idNameKey="`sec-${idq}`" :modeEdit="true" />
                </div>
              </div>
            </div>
            <div class="col-auto text-nowrap p-1">
              <span>
                <strong>{{ UtilsDate.fromUnixToDateTime(emittedRes) }}</strong>
              </span>&nbsp;
              <span @click="setNow" class="btn btn-sm btn-primary">{{ $t("Set now") }}</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import UtilsDate from "@/Utils/UtilsDate";
import aInput from "@/components/elements/form/aInput";

export default {
  name: "AlinaDatePicker",
  computed: {
    UtilsDate() {
      return UtilsDate
    }
  },
  created() {
    this.convertValueToDate();
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
      emittedRes: 0,
    }
  },
  methods: {
    calcDt() {
      if (this.month < 1) this.month = 1;
      if (this.month > 12) this.month = 12;

      this.dateObj = new Date();
      this.dateObj.setFullYear(this.year);
      this.dateObj.setMonth(this.month - 1);
      this.dateObj.setDate(this.day);
      this.dateObj.setHours(this.hour);
      this.dateObj.setMinutes(this.min);
      this.dateObj.setSeconds(this.sec);

      this.emittedRes = Math.floor(this.dateObj.getTime() / 1000);
      this.$emit('input', this.emittedRes);
    },
    convertValueToDate(v = null) {
      if (v === null) v = this.value;
      this.dateObj = new Date(v * 1000);

      this.year = this.dateObj.getFullYear();
      this.month = this.dateObj.getMonth() + 1;
      this.day = this.dateObj.getDate();
      this.hour = this.dateObj.getHours();
      this.min = this.dateObj.getMinutes();
      this.sec = this.dateObj.getSeconds();
    },
    setNow() {
      this.emittedRes = Math.floor((new Date()).getTime() / 1000);
      this.convertValueToDate(this.emittedRes);
      this.$emit('input', this.emittedRes);
    }
  },
  watch: {
    year() { this.calcDt() },
    month() { this.calcDt() },
    day() { this.calcDt() },
    hour() { this.calcDt() },
    min() { this.calcDt() },
    sec() { this.calcDt() },
  },
  components: {
    aInput
  }
};
</script>

<style lang="scss">
.alina-date-picker {
  display: inline-block;

  & input {
      width: 5ch !important;
    }
}
</style>
