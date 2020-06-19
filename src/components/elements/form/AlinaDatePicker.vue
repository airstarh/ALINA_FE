<template>

    <div class="input-group mb-2 ">
        <div class="row no-gutters align-items-center">
            <div class="col-auto mt-2" v-if="label.length">
                <div class="input-group-text">{{label}}</div>
            </div>
            <div class="col">
                <div class="row no-gutters">
                    <div class="col-lg text-nowrap mt-2 pl-3 pr-3">
                        <div class="form-row">
                            <div class="col-6 p-0"><input v-model="year" size="4" type="text" max="9999" class="form-control text-right" :id="`year-${idq}`" placeholder="YEAR"></div>
                            <div class="col-3 p-0"><input v-model="month" size="2" type="text" max="12" class="form-control text-right" :id="`month-${idq}`" placeholder="MONTH"></div>
                            <div class="col-3 p-0"><input v-model="day" size="2" type="text" max="31" class="form-control text-right" :id="`day-${idq}`" placeholder="DAT"></div>
                        </div>
                    </div>
                    <div class="col-lg text-nowrap mt-2 pl-3 pr-3">
                        <div class="form-row ">
                            <div class="col-4 p-0"><input v-model="hour" size="2" type="text" max="23" class="ch2 form-control" :id="`hour-${idq}`" placeholder="HOUR"></div>
                            <div class="col-4 p-0"><input v-model="min" size="2" type="text" max="59" class="ch2 form-control" :id="`min-${idq}`" placeholder="MIN"></div>
                            <div class="col-4 p-0"><input v-model="sec" size="2" type="text" max="59" class="ch2 form-control" :id="`sec-${idq}`" placeholder="SEC"></div>
                        </div>
                    </div>
                    <div class="col-lg text-nowrap mt-2">
                        <div class="input-group-text">
                            <i>{{emittedRes | unix_to_date_time}}</i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:    "AlinaDatePicker",
        created() {
            this.convertValueToDate();
        },
        props:   {
            value: {
                /**idq - ID qualifier*/
                type:    Number,
                default: Math.floor(new Date().getTime() / 1000),
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
        methods: {
            calcDt() {
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
        watch:   {
            year() {this.calcDt()},
            month() {this.calcDt()},
            day() {this.calcDt()},
            hour() {this.calcDt()},
            min() {this.calcDt()},
            sec() {this.calcDt()},
        }
    };
</script>

<style scoped lang="scss">

</style>
