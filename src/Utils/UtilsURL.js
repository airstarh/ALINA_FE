import UtilsData   from "@/Utils/UtilsData";
import * as lodash from "lodash";
export default class UtilsURL {
    /*
     * From: https://stackoverflow.com/a/43513777/3142281
     * ToDo: adapted for PHP only! Square Brackets []
     *  ToDo: Support JAVA array notation
     */
    static castGetStringToObject(query) {
        query        = query.substring(query.indexOf('?') + 1);
        let re       = /([^&=]+)=?([^&]*)/g;
        let decodeRE = /\+/g;
        let decode   = function (str) {
            return decodeURIComponent(str.replace(decodeRE, " "));
        };
        let params   = {}, e;
        while (e = re.exec(query)) {
            let k = decode(e[1]), v = decode(e[2]);
            if (k.substring(k.length - 2) === '[]') {
                k = k.substring(0, k.length - 2);
                (params[k] || (params[k] = [])).push(v);
            } else {
                params[k] = v;
            }
        }
        let assign = function (obj, keyPath, value) {
            let lastKeyIndex = keyPath.length - 1;
            for (let i = 0; i < lastKeyIndex; ++i) {
                let key = keyPath[i];
                if (!(key in obj)) {
                    obj[key] = {}
                }
                obj = obj[key];
            }
            obj[keyPath[lastKeyIndex]] = value;
        };
        for (let prop in params) {
            let structure = prop.split('[');
            if (structure.length > 1) {
                let levels = [];
                structure.forEach(function (item, i) {
                    let key = item.replace(/[?[\]\\ ]/g, '');
                    levels.push(key);
                });
                assign(params, levels, params[prop]);
                delete (params[prop]);
            }
        }
        return params;
    }

    // ##################################################
    /**
     * From: https://stackoverflow.com/a/42604801/3142281
     * ToDo: Support JAVA array notation
     *  ToDo: Support Simple string for HASH
     */
    static castObjectToGetQueryString(obj, prefix, doUrlEncode = true) {
        // #####
        //region For simple strings
        if (
            (UtilsData.isString(obj) || UtilsData.isNumber(obj))
            &&
            UtilsData.empty(prefix)
        ) {
            return obj;
        }
        //endregion For simple strings
        // #####
        const query = Object.keys(obj).map((getParamName) => {
            let getParamValue = obj[getParamName];
            if (UtilsData.isArray(obj))
                getParamName = `${prefix}[]`;
            else if (UtilsData.isObject(obj))
                getParamName = (prefix ? `${prefix}[${getParamName}]` : getParamName);
            // #####
            if (UtilsData.isArray(getParamValue))
                return UtilsURL.castObjectToGetQueryString(getParamValue, getParamName, doUrlEncode);
            else {
                getParamValue = doUrlEncode ? encodeURIComponent(getParamValue) : getParamValue;
                return `${getParamName}=${getParamValue}`;
            }
        });
        return [].concat.apply([], query).join('&');
    }

    // ##################################################
    //region URL Parsers
    /**
     * https://www.abeautifulsite.net/parsing-urls-in-javascript
     * */
    static parseURL(url) {
        const parser       = document.createElement('a');
        const searchObject = {};
        let queries, split, i;
        // Let the browser do the work
        parser.href        = url;
        // Convert query string to object
        queries            = parser.search.replace(/^\?/, '').split('&');
        for (i = 0; i < queries.length; i++) {
            split                  = queries[i].split('=');
            searchObject[split[0]] = split[1];
        }
        return {
            protocol:     parser.protocol,
            host:         parser.host,
            hostname:     parser.hostname,
            port:         parser.port,
            pathname:     parser.pathname,
            search:       parser.search,
            searchObject: searchObject,
            hash:         parser.hash
        };
    }

    static parse(url) {
        const parser = new URL(url);
        console.log(">>>>>>>>>>>>>>>>>>>>");
        console.log("parser");
        console.log(parser);
        console.log("<<<<<<<<<<<<<<<<<<<<");
        const oSearch =
                  UtilsURL
                  .castGetStringToObject(
                      lodash.trimStart(parser.search, '?'
                      ))
        ;
        const oHash   =
                  UtilsURL
                  .castGetStringToObject(
                      lodash.trimStart(parser.hash, '#'
                      ))
        ;
        return {
            protocol:     parser.protocol,
            username:     parser.username,
            password:     parser.password,
            host:         parser.host, //domain + port
            hostname:     parser.hostname, //domain name only
            port:         parser.port,
            pathname:     parser.pathname,
            search:       parser.search,
            searchObject: oSearch,
            hash:         parser.hash,
            hashObject:   oHash
        };
    }

    static unparse(parser, exclude = []) {
        let str = '';
        if (parser.protocol && !exclude.includes('protocol')) {
            str += `${parser.protocol}//`;
        }
        if (parser.username && !exclude.includes('username')) {
            str += `${parser.username}`;
            if (parser.password && !exclude.includes('password')) {
                str += `:${parser.password}`;
            }
            str += `@`;
        }
        if (parser.hostname && !exclude.includes('hostname')) {
            str += `${parser.hostname}`;
        }
        if (parser.port && !exclude.includes('port')) {
            str += `:${parser.port}`;
        }
        if (parser.pathname && !exclude.includes('pathname')) {
            str += `?${parser.pathname}`;
        }
        if (parser.hash && !exclude.includes('hash')) {
            str += `#${parser.hash}`;
        }
        return str;
    }

    //endregion URL Parsers
    // ##################################################
}