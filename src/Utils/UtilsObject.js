//import UtilsData from "./UtilsData";

import UtilsData   from "./UtilsData";
import * as lodash from "lodash";

export default class UtilsObject {
    // ##################################################
    //region Get Set by path.
    /**
     * @link https://stackoverflow.com/a/20240290/3142281
     * */
    static getByPath(o, path = "") {
        if (path === "") {
            return o;
        }
        const pathArr = path.split(".");
        const len     = pathArr.length - 1;
        let ref       = o;
        for (let i = 0; i <= len; i++) {
            let prop = pathArr[i];

            if (UtilsData.isNumber(prop)) {
                prop = parseInt(prop);
            }

            if (typeof ref[prop] !== "undefined") {
                ref = ref[prop];
            } else {
                return undefined;
            }
        }
        return ref;
    }

    static setByPath(o, path = "", value) {
        const pathArr = path.split(".");
        const len     = pathArr.length - 1;
        let ref       = o;
        for (let i = 0; i < len; i++) {
            let prop       = pathArr[i];
            const nextProp = pathArr[i + 1];

            if (UtilsData.isNumber(prop)) {
                prop = parseInt(prop);
            }

            if (prop in ref) {
                ref = ref[prop];
            } else {
                if (UtilsData.isNumber(nextProp)) {
                    ref[prop] = [];
                } else {
                    ref[prop] = {};
                }
                ref = ref[prop];
            }
        }

        let theLastKey = pathArr[len];
        if (UtilsData.isNumber(theLastKey)) {
            theLastKey = parseInt(theLastKey);
        }

        ref[theLastKey] = value;
        return o;
    }

    static setByPathArray(o, pathArr = [], value) {
        const len = pathArr.length - 1;
        let ref   = o;
        for (let i = 0; i < len; i++) {
            let prop = pathArr[i];
            if (prop in ref) {
                ref = ref[prop];
            } else {
                ref[prop] = {};
                ref       = ref[prop];
            }
        }
        ref[pathArr[len]] = value;
        return value;
    }

    //endregion Get Set by path.
    // ##################################################
    static eraseEmpty(o) {
        Object.entries(o).forEach(([p, v]) => {
            if (o[p] === "" || o[p] === null) {
                delete o[p];
            }
        });
        return o;
    }

    /**
     * https://lodash.com/docs/4.17.15#mergeWith
     */
    static mergeRecursively(...objs) {
        const resObj = lodash.mergeWith({}, ...objs, function (oldV, newV) {
            if (lodash.isArray(oldV)) {
                return oldV.concat(newV);
            }
        });
        return resObj;
    }
    // ##################################################
    static hasOwnPropertyCaseInsensitive(obj, prop) {
        let res = false;
        for (const p of Object.keys(obj)) {
            const pLc    = p.toLowerCase();
            const propLc = prop.toLowerCase();
            if (pLc === propLc) {
                res = true;
                return res;
            }
        }
        return res;
    }
    // ##################################################
    static countOwnProps(obj) {
        return Object.keys(obj).length;
    }

    // ##################################################
}
