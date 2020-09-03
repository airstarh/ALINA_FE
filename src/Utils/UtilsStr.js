//import VueCookies          from 'vue-cookies';
import UtilsData  from "@/Utils/UtilsData";
import UtilsArray from "@/Utils/UtilsArray";
export default class UtilsStr {
    static truncate(str, n) {
        return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
    }

    static truncateSmart(str, n, useWordBoundary) {
        if (str.length <= n) { return str; }
        const subString = str.substr(0, n - 1); // the original check
        return (useWordBoundary
                ? subString.substr(0, subString.lastIndexOf(" "))
                : subString) + "...";
    }

    static fullName(fn = null, ln = null, id = null, def = '¯\\_(ツ)_/¯') {
        let res = [];
        if (UtilsData.empty(fn) && UtilsData.empty(ln)) {
            if (UtilsData.empty(id)) {
                res.push(def);
            } else {
                res.push(def);
                res.push(id);
            }
        } else {
            res.push(fn);
            res.push(ln);
        }
        return res.join(' ');
    }

    // #####
    //region TRIM
    static trimLeft(str, symb = " "){
        while (str.indexOf(symb) === 0){
            str = str.slice(symb.length);
        }
        return str;
    }
    //endregion TRIM
    // #####
}