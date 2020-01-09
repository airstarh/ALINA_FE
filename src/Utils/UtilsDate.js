import {AppAlina} from "@/main";

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

    /**
     * https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
     * */
    static fromUnixTimeSecs(tmstmp, format = "Do MMM YYYY dddd") {
        let date = new Date(tmstmp * 1000);
        return AppAlina.$date(date, format);
    }
}