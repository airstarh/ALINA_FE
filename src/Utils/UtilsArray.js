export default class UtilsArray {
    //region Elements Manipulations
    static elsSwap(arr, i1, i2) {
        /**Wrong approach. See below. */
        // let valTemp  = arr[i2];
        // arr[i2]   = arr[i1];
        // arr[i1]   = valTemp;
        /**
         * In order to make framework react on Array changes,
         * it is used more complicated way to change order of properties.
         * @see https://vuejs.org/v2/guide/list.html#Caveats
         */
        arr[i1] = arr.splice(i2, 1, arr[i1])[0];
        return arr;
    }

    static elSetEarlier(arr, i) {
        if (UtilsArray.isFirst(arr, i)) {
            return arr;
        }
        UtilsArray.elsSwap(arr, i, i - 1);
        return arr;
    }

    static elSetLater(arr, i) {
        if (UtilsArray.isLast(arr, i)) {
            return arr;
        }
        UtilsArray.elsSwap(arr, i, i + 1);
        return arr;
    }

    static elRemoveByIndex(arr, i) {
        return arr.splice(i, 1);
    }

    static elRemoveByValue(arr, v) {
        if (arr.includes(v)) {
            const i = arr.indexOf(v);
            UtilsArray.elRemoveByIndex(arr, i);
        }
        return arr;
    }

    static clear(arr) {
        return arr.splice(0, arr.length);
    }

    /**
     * Why: https://ru.vuejs.org/v2/guide/list.html
     * Approach: https://stackoverflow.com/a/1348196/3142281
     * In short: Vue does not react on .concat() function
     * */
    static vueSensitiveConcat(arr1, arr2) {
        //return [].splice.apply(arr1, [arr1.length+1, 0].concat(arr2));
        return arr1.splice(arr1.length + 1, 0, ...arr2);
    }

    static pushIfNotAlready(arr, val) {
        if (!arr.includes(val)) {
            arr.push(val);
        }
        return arr;
    }

    //endregion Elements Manipulations
    //##################################################
    //region Helpers
    static isFirst(arr, i) {
        return i === 0;
    }

    static isLast(arr, i) {
        return arr.length - 1 === i;
    }

    //endregion Helpers
}
