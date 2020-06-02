import UtilsObject from "@/Utils/UtilsObject";
export default class UtilsData {
    static isset(ObjectPropertyOrArrayKey) {
        return (
            typeof ObjectPropertyOrArrayKey !== "undefined" &&
            ObjectPropertyOrArrayKey !== null
        );
    }

    static empty(value) {
        //####################
        //region Object
        let isEmptyObject = false;
        if (UtilsData.isObject(value)) {
            isEmptyObject = UtilsObject.countOwnProps(value) === 0;
        }
        //endregion Object
        //####################
        //region Array
        let isEmptyArray = false;
        if (UtilsData.isArray(value)) {
            isEmptyArray = value.length === 0;
        }
        //endregion Array
        //####################
        return (
            value == null
            ||
            typeof value === "undefined"
            ||
            value === 0
            ||
            value === ""
            ||
            // value === '0' || // Doubtful.
            isEmptyObject //JSON.stringify(value) === JSON.stringify({})
            ||
            isEmptyArray //JSON.stringify(value) === JSON.stringify([])
        );
    }

    static isArray(something) {
        return Array.isArray(something);
    }

    static isString(something) {
        const res = (
            !UtilsData.isNumber(something)
            &&
            typeof something === 'string'
        );
        return res;
    }

    static isNull(something) {
        return something === null;
    }

    static isObject(something) {
        return (
            !UtilsData.isNull(something)
            &&
            !UtilsData.isArray(something)
            &&
            typeof something === 'object'
        );
    }

    /**
     * https://stackoverflow.com/a/175787/3142281

     isNaN(num)         // returns true if the variable does NOT contain a valid number
     Examples
     isNaN(123)         // false
     isNaN('123')       // false
     isNaN('1e10000')   // false (This translates to Infinity, which is a number)
     isNaN('foo')       // true
     isNaN('10px')      // true

     * */
    static isNumber(v) {
        if (v === "") {
            return false;
        }
        return !isNaN(v);
    }

    /**
     *  https://stackoverflow.com/a/49388446/3142281
     */
    static getFormData(object) {
        const formData = new FormData();
        Object.keys(object).forEach(key => formData.append(key, object[key]));
        return formData;
    }

    static objectToFormData(obj, rootName, ignoreList) {
        const formData = new FormData();

        function appendFormData(data, root) {
            if (!ignore(root)) {
                root = root || '';
                if (data instanceof File) {
                    formData.append(root, data);
                } else if (Array.isArray(data)) {
                    for (let i = 0; i < data.length; i++) {
                        appendFormData(data[i], root + '[' + i + ']');
                    }
                } else if (typeof data === 'object' && data) {
                    for (let key in data) {
                        if (data.hasOwnProperty(key)) {
                            if (root === '') {
                                appendFormData(data[key], key);
                            } else {
                                let k = UtilsData.isNumber(key)
                                        ? root + '[' + key + ']'
                                        : root + '.' + key;
                                appendFormData(data[key], k);
                            }
                        }
                    }
                } else {
                    if (data !== null && typeof data !== 'undefined') {
                        formData.append(root, data);
                    }
                }
            }
        }

        function ignore(root) {
            return Array.isArray(ignoreList)
                && ignoreList.some(function (x) {
                    return x === root;
                });
        }

        appendFormData(obj, rootName);
        return formData;
    }

    static paginator(objPageInfo) {
        const pg = {
            pageCurrentNumber: objPageInfo.pageCurrentNumber,
            pageSize:          objPageInfo.pageSize,
            rowsTotal:         objPageInfo.rowsTotal,
            pagesTotal:        objPageInfo.pagesTotal,
            pagesArray:        [],
            url:               '',
        };
        return pg;
    }
}
