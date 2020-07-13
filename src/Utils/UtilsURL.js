import UtilsData   from "@/Utils/UtilsData";
import * as lodash from "lodash";
export default class UtilsURL {
    /*
     * From: https://stackoverflow.com/a/43513777/3142281
     * ToDo: adapted for PHP only! Square Brackets []
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
     * ToDo: Untested. From: https://stackoverflow.com/a/42604801/3142281
     */
    static castGetObjectToString(obj, prefix) {
        const query = Object.keys(obj).map((getParamName) => {
            const getParamValue = obj[getParamName];
            if (UtilsData.isArray(obj))
                getParamName = `${prefix}[]`;
            else if (UtilsData.isObject(obj))
                getParamName = (prefix ? `${prefix}[${getParamName}]` : getParamName);
            // #####
            if (UtilsData.isArray(getParamValue))
                return UtilsURL.castGetObjectToString(getParamValue, getParamName);
            else
                return `${getParamName}=${encodeURIComponent(getParamValue)}`;
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
        const parser           = new URL(url);
        const oUrlSearchParams =
                  UtilsURL
                  .castGetStringToObject(
                      lodash.trimStart(parser.search, '?'
                      ))
        ;
        const oHash            =
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
            searchObject: oUrlSearchParams,
            hash:         parser.hash,
            hashObject:   oHash
        };
    }

    //endregion URL Parsers
    // ##################################################
}