<template>

    <div class="force-inline">
        <div class="input-group mb-2 mr-sm-2">
            <div class="input-group-prepend">
                <div class="input-group-text">{{label}}</div>
            </div>
            <label class="sr-only" :for="`year-${idq}`">year</label>
            <input v-model="year" size="4" type="number" max="9999" class="ch4" :id="`year-${idq}`" placeholder="YEAR">
            <span>&nbsp;&mdash;&nbsp;	</span>
            <label class="sr-only" :for="`month-${idq}`">month</label>
            <input v-model="month" size="2" type="number" max="12" class="ch2" :id="`month-${idq}`" placeholder="MONTH">
            <span>&nbsp;&mdash;&nbsp;	</span>
            <label class="sr-only" :for="`day-${idq}`">day</label>
            <input v-model="day" size="2" type="number" max="31" class="ch2" :id="`day-${idq}`" placeholder="DAT">
            <span>&nbsp;@&nbsp;</span>
            <label class="sr-only" :for="`hour-${idq}`">hour</label>
            <input v-model="hour" size="2" type="number" max="23" class="ch2" :id="`hour-${idq}`" placeholder="HOUR">
            <span>&nbsp;:&nbsp;</span>
            <label class="sr-only" :for="`min-${idq}`">min</label>
            <input v-model="min" size="2" type="number" max="59" class="ch2" :id="`min-${idq}`" placeholder="MIN">
            <span>&nbsp;:&nbsp;</span>
            <label class="sr-only" :for="`sec-${idq}`">sec</label>
            <input v-model="sec" size="2" type="number" max="59" class=" ch2" :id="`sec-${idq}`" placeholder="SEC">
        </div>
        <div>{{unixTimeStampSecs}} {{unixTimeStampSecs | unix_to_date_time}}</div>
    </div>
</template>

<script>
    export default {
        name:     "AlinaDatePicker",
        created() {
            this.convertValueToDate();
        },
        props:    {
            value: {
                /**idq - ID qualifier*/
                type:    Number,
                default: Math.round(new Date().getTime() / 1000),
            },
            idq:   {
                /**idq - ID qualifier*/
                type:    String,
                default: '0',
            },
            label: {
                /**idq - ID qualifier*/
                type:    String,
                default: 'Date',
            }

        },
        data() {
            return {
                year:       1970,
                month:      1,
                day:        1,
                hour:       0,
                min:        0,
                sec:        0,
                dateObf:    new Date(),
                emittedRes: 0,
            }
        },
        methods:  {
            calcDt() {
                this.dateObj = new Date();
                this.dateObj.setFullYear(this.year);
                this.dateObj.setMonth(this.month - 1);
                this.dateObj.setDate(this.day);
                this.dateObj.setHours(this.hour);
                this.dateObj.setMinutes(this.min);
                this.dateObj.setSeconds(this.sec);
                this.emittedRes = Math.round(this.dateObj.getTime() / 1000);
            },
            emitInput: function () {
                this.$emit('input', this.emittedRes)
            },
            convertValueToDate() {
                this.dateObj = new Date(this.value * 1000);
                this.year    = this.dateObj.getFullYear();
                this.month   = this.dateObj.getMonth() + 1;
                this.day     = this.dateObj.getDate();
                this.hour    = this.dateObj.getHours();
                this.min     = this.dateObj.getMinutes();
                this.sec     = this.dateObj.getSeconds();
            }
        },
        computed: {
            unixTimeStampSecs() {
                this.calcDt();
                this.emitInput();
                return this.emittedRes;
            }
        }
    };
</script>

<style scoped lang="scss">
    .ch4 {
        width: 8ch !important;
        text-align: center;
    }
    .ch2 {
        width: 4ch !important;
        text-align: center;
    }
</style>
