<template>
  <div class="container">
    <div class="row">
      <div class="col">

        <!--  -->
        <div class="alina-widget-clock">
          <div class="clock" @click="PageSettings.showMainMenu = !PageSettings.showMainMenu">
            <div class="m-0 p-0 date">
              {{ date }}
            </div>
            <div class="text">
              {{ UtilsDate.doExtractDayOfWeekName(dateObj) }}
            </div>
            <div class="m-0 p-0 time">{{ time }}</div>
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
          <!--  -->

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


<style>
.alina-widget-clock {
  background: #0f3854;
  background: radial-gradient(ellipse at center, #0a2e38 0%, #000000 70%);
  background-size: 100%;
}

.clock {
  font-family: 'Share Tech Mono', monospace;
  color: #fff;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-shadow: 0 0 20px rgba(10, 175, 230, 1), 0 0 20px rgba(10, 175, 230, 0);
}

.time {
  letter-spacing: 0.05em;
  font-size: 10vw;
  padding: 0;
  margin: 0;
}

.date {
  letter-spacing: 0.1em;
  font-size: 4vw;
}

.text {
  letter-spacing: 0.1em;
  font-size: 2.5vw;
  padding: 20px 0 0;
}

</style>