<template>
  <div class="alina-widget-clock">
    <div class="clock" @click="PageSettings.showMainMenu = !PageSettings.showMainMenu">
      <div class="m-0 p-0 date">
        {{ date }}
      </div>
      <div class="text">
        {{ UtilsDate.doExtractDayOfWeekName(dateObj) }}
      </div>
      <div class="time-wrapper">
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
        <transition name="slide-fade">
          <div
              class="m-0 p-0 time"
              :key="time"
          >
            {{ time }}
          </div>
        </transition>
      </div>
      <div class="text">
        <div class="row">
          <div class="col text-right">
            Quarter
          </div>
          <div class="col text-left">
            {{ UtilsDate.doExtractQuarterNumber(dateObj) }}
          </div>
        </div>
        <div class="row">
          <div class="col text-right">
            Week
          </div>
          <div class="col text-left">
            {{ UtilsDate.doExtractWeekNumber(dateObj) }}
          </div>
        </div>
        <div class="row">
          <div class="col text-right">
            Day of year
          </div>
          <div class="col text-left">
            {{ UtilsDate.doExtractDayOfYearNumber(dateObj) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import UtilsStr     from "@/Utils/UtilsStr";
import UtilsDate    from "@/Utils/UtilsDate";
import PageSettings from "@/services/PageSettings";
export default {
  name: "Clock",
  data() {
    return {
      dateObj:   new Date(),
      time:      '',
      date:      '',
      quarter:   '',
      decade:    '',
      dayOfYear: '',
      week:      ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
      UtilsDate,
      PageSettings
    }
  },
  created() {
    const updateTime = this.updateTime;
    setInterval(updateTime, 1000)
  },
  methods: {
    updateTime() {
      const tzp    = this.zeroPadding;
      const week   = this.week;
      let cd       = new Date();
      this.dateObj = cd;
      this.time    = tzp(cd.getHours(), 2) + ':' + tzp(cd.getMinutes(), 2) + ':' + tzp(cd.getSeconds(), 2);
      this.date    = tzp(cd.getFullYear(), 4) + '-' + tzp(cd.getMonth() + 1, 2) + '-' + tzp(cd.getDate(), 2) + ' ' + week[cd.getDay()];
      this.date    = UtilsDate.dateObjFormat(cd, 'dd MMMM yyyy');
    },
    zeroPadding(num, digit) {
      return UtilsStr.zeroPadding(num, digit)
    }
  }
};
</script>


<style scoped lang="scss">
.alina-widget-clock {
  box-shadow: 0 0 50px 50px #000;
  background-color: #000;
}

.clock {
  font-family: 'Share Tech Mono', monospace;
  color: #fff;
  text-align: center;
  text-shadow: #0AAFE6 0 0 25px;
}

.time-wrapper {
  position: relative;
  font-size: 10vw;
}

.time {
  position: absolute;
  font-size: 10vw;
  left: 0;
  top: 0;
  width: 100%;
  letter-spacing: 0.05em;
}

.date {
  letter-spacing: 0.1em;
  font-size: 4vw;
}

.text {
  letter-spacing: 0.1em;
  font-size: 2.5vw;
}

/* ################################################## */
/* region Animation*/

.slide-fade-enter-active {
  transition: all .8s ease;
}

.slide-fade-leave-active {
  transition: all .8s ease;
}

.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for <2.1.8 */
{
  opacity: 0;
}

/* region Animation*/
/* ################################################## */

</style>