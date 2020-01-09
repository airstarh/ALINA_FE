import {dateFilter} from "vue-date-fns";


export default class UtilsDate {
    static toUnixTimeSecs(d) {
        let v;
        if (d instanceof Date) {
            v = d;
        } else {
            v = new Date(d);
        }

        return v.getTime() / 1000;
    }

    static fromUnixTimeSecs(tmstmp, format = "Do MMM YYYY dddd") {
        let date = new Date(tmstmp * 1000);
        return dateFilter(date, format);
    }
}