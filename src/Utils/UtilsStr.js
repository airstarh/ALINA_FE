//import VueCookies          from 'vue-cookies';
export default class UtilsStr {
    static truncate(str, n) {
        return (str.length > n) ? str.substr(0, n - 1) + '&hellip;' : str;
    }

    static truncateSmart(str, n, useWordBoundary) {
        if (str.length <= n) { return str; }
        const subString = str.substr(0, n - 1); // the original check
        return (useWordBoundary
                ? subString.substr(0, subString.lastIndexOf(" "))
                : subString) + "&hellip;";
    }
}