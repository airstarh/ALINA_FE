import {dateFilter} from "vue-date-fns";
import UtilsData    from "@/Utils/UtilsData";

export default class UtilsDate {
    //##################################################
    //region Date Obj
    static dateObjFormat(dateObj, format = "YYYY-MM-DD H:m:s") {
        return dateFilter(dateObj, format);
    }
    //endregion Date Obj
    //##################################################
    //region Unix Time Stamp
    static toUnixTimeSecs(d) {
        let v = UtilsDate.toDateObj(d);
        return Math.floor(v.getTime() / 1000);
    }

    static UnixSecsToFormat(tmstmp, format = "Do MMM YYYY dddd") {
        let date = UtilsDate.toDateObj(tmstmp, true);
        return UtilsDate.dateObjFormat(date, format);
    }

    static fromUnixToDateNoTime(tmstmp, format = "YYYY-MM-DD") {
        return UtilsDate.UnixSecsToFormat(tmstmp, format);
    }

    static fromUnixToDateTime(tmstmp, format = "YYYY-MM-DD H:m:s") {
        return UtilsDate.UnixSecsToFormat(tmstmp, format);
    }
    //endregion Unix Time Stamp
    //##################################################
    static toDateObj(d, isUnixSecs = false) {
        let v;
        if (d instanceof Date) {
            v = d;
        } else if (UtilsData.isNumber(d)) {
            if (isUnixSecs) {
                d = d * 1000;
            }
            v = new Date(d)
        }

        return v;
    }

    //##################################################
}