import {dateFilter} from "vue-date-fns";
import UtilsData    from "@/Utils/UtilsData";
export default class UtilsDate {
	//##################################################
	//region Date Obj
	static FORMAT_DB_DATE_TIME    = "yyyy-MM-dd H:m:s";
	static FORMAT_DB_DATE_NO_TIME = "yyyy-MM-dd";
	static FORMAT_DB_TIME_NO_DATE = "H:m:s";

	static dateObjFormat(dateObj, format = UtilsDate.FORMAT_DB_DATE_TIME) {
		return dateFilter(dateObj, format);
	}

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

	static doExtractWeekNumber(dateObj) {
		return UtilsDate.dateObjFormat(dateObj, 'w');
	}

	static doExtractQuarterNumber(dateObj) {
		return UtilsDate.dateObjFormat(dateObj, 'Q');
	}

	static doExtractDayOfWeekName(dateObj) {
		return UtilsDate.dateObjFormat(dateObj, 'EEEE');
	}

	static doExtractDayOfYearNumber(dateObj) {
		return UtilsDate.dateObjFormat(dateObj, 'DDD');
	}
	//endregion Date Obj
	//##################################################
	//region Unix Time Stamp
	static toUnixTimeSecs(d) {
		let v = UtilsDate.toDateObj(d);
		return Math.floor(v.getTime() / 1000);
	}

	static UnixSecsToFormat(tmstmp, format = "Do MMM yyyy dddd") {
		if (UtilsData.empty(tmstmp)) {return '';}
		let date = UtilsDate.toDateObj(tmstmp, true);
		return UtilsDate.dateObjFormat(date, format);
	}

	static fromUnixToTimeNoDate(tmstmp, format = UtilsDate.FORMAT_DB_TIME_NO_DATE) {
		return UtilsDate.UnixSecsToFormat(tmstmp, format);
	}

	static fromUnixToDateNoTime(tmstmp, format = UtilsDate.FORMAT_DB_DATE_NO_TIME) {
		return UtilsDate.UnixSecsToFormat(tmstmp, format);
	}

	static fromUnixToDateTime(tmstmp, format = UtilsDate.FORMAT_DB_DATE_TIME) {
		return UtilsDate.UnixSecsToFormat(tmstmp, format);
	}
	//endregion Unix Time Stamp
	//##################################################
}