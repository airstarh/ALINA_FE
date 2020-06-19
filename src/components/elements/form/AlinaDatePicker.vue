<template>

    <div class="alina-date-picker mb-2 ">
        <div class="row no-gutters align-items-center justify-content-between">
            <div class="col-auto" v-if="label.length">
                <div class="input-group-text">{{label}}</div>
            </div>
            <div class="col">
                <div class="container">
                    <div class="row no-gutters align-items-center justify-content-start">
                        <div class="col-auto text-nowrap p-3">
                            <div class="form-inline">
                                <div class="text-nowrap">
                                    Y:<input v-model="year" size="4" type="text" max="9999" class="form-control d-inline-block w-25" :id="`year-${idq}`" placeholder="YEAR">
                                    M:<input v-model="month" size="2" type="text" max="12" class="form-control d-inline-block w-25" :id="`month-${idq}`" placeholder="MONTH">
                                    D:<input v-model="day" size="2" type="text" max="31" class="form-control d-inline-block w-25" :id="`day-${idq}`" placeholder="DAT"></div>
                            </div>
                        </div>
                        <div class="col-auto text-nowrap p-3">
                            <div class="form-inline">
                                <div class="text-nowrap">
                                    h:<input v-model="hour" size="2" type="text" max="23" class="ch2 form-control d-inline w-25" :id="`hour-${idq}`" placeholder="HOUR">
                                    m:<input v-model="min" size="2" type="text" max="59" class="ch2 form-control d-inline w-25" :id="`min-${idq}`" placeholder="MIN">
                                    s:<input v-model="sec" size="2" type="text" max="59" class="ch2 form-control d-inline w-25" :id="`sec-${idq}`" placeholder="SEC">
                                </div>
                            </div>
                        </div>
                        <div class="col-auto text-nowrap p-3">
                            <div class="input-group-text">
                                <i>{{emittedRes | unix_to_date_time}}</i>
                            </div>
                            <span @click="setNow" class="btn btn-sm btn-primary">SET NOW</span>
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
            convertValueToDate(v = null) {
                if (v === null) {
                    v = this.value;
                }
                this.dateObj = new Date(v * 1000);
                this.year    = this.dateObj.getFullYear();
                this.month   = this.dateObj.getMonth() + 1;
                this.day     = this.dateObj.getDate();
                this.hour    = this.dateObj.getHours();
                this.min     = this.dateObj.getMinutes();
                this.sec     = this.dateObj.getSeconds();
            },
            setNow(){
                this.emittedRes = Math.floor((new Date()).getTime() / 1000);
                this.convertValueToDate(this.emittedRes);
                this.$emit('input', this.emittedRes);
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
