//import VueCookies          from 'vue-cookies';
import UtilsData from "@/Utils/UtilsData";
import UtilsArray from "@/Utils/UtilsArray";

export default class UtilsStr {
    static truncate(str, n) {
        return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
    }

    static truncateSmart(str, n, useWordBoundary) {
        if (str.length <= n) { return str; }
        const subString = str.substr(0, n - 1); // the original check
        return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(" ")) : subString) + "...";
    }

    static fullNameAsArrayFromUserObject(objUser) {
        return UtilsStr.fullNameAsArray(
            objUser.firstname,
            objUser.lastname,
            objUser.id
        );
    }

    static fullNameAsArray(fn = null, ln = null, id = null, def = 'ツ') {
        let res = [];
        res[0] = def;
        res[1] = '   ';

        if (!UtilsData.empty(fn)) {
            res[0] = fn
        }

        if (!UtilsData.empty(ln)) {
            res[1] = ln
        } else {
            if (!UtilsData.empty(id) && res[0] === def) {
                res[1] = id
            }
        }
        return res;
    }

    static fullName(fn = null, ln = null, id = null, def = 'ツ') {
        return UtilsStr.fullNameAsArray(fn, ln, id, def).join(' ');
    }

    static firstName(fn = null, ln = null, id = null, def = 'ツ') {
        return UtilsStr.fullNameAsArray(fn, ln, id, def)[0];
    }

    static lastName(fn = null, ln = null, id = null, def = 'ツ') {
        return UtilsStr.fullNameAsArray(fn, ln, id, def)[1];
    }

    // #####
    //region TRIM
    static trimLeft(str, symb = " ") {
        while (str.indexOf(symb) === 0) {
            str = str.slice(symb.length);
        }
        return str;
    }

    //endregion TRIM
    // #####
    // region Regexes
    static regexHashTagList = /(^|\W)#([a-zA-Zа-яА-Я_]+[0-9\w-]*)/mgi;
    // endregion Regexes
    // #####
    static hashtag(str) {
        if (UtilsData.empty(str)) return '';
        const ht = UtilsStr.regexHashTagList;
        const txt = `$1<a href="#/?txt=%23$2">#$2</a>`;
        let repl = str.replace(ht, txt);
        return repl;
    }

    static content(str) {
        str = UtilsStr.hashtag(str);
        return str;
    }

    static zeroPadding(num, digit) {
        let zero = '';
        for (let i = 0; i < digit; i++) {
            zero += '0';
        }
        return (zero + num).slice(-digit);
    }

    static capFirtsLetter(value) {
        if (!value) return '';
        value = value.toString();
        return value.charAt(0).toUpperCase() + value.slice(1)
    }

    static stripHTML(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        return doc.body.textContent || '';
    }
}