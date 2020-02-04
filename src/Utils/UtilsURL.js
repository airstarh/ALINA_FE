export default class UtilsURL {

    /*
     * ToDo: UnTested. From: https://stackoverflow.com/a/43513777/3142281
     */
    static castGetStringToObject(query) {

        query = query.substring(query.indexOf('?') + 1);

        let re       = /([^&=]+)=?([^&]*)/g;
        let decodeRE = /\+/g;

        let decode = function (str) {
            return decodeURIComponent(str.replace(decodeRE, " "));
        };

        let params = {}, e;
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
    };

    // ##################################################
    /**
     * ToDo: Untested. From: https://stackoverflow.com/a/42604801/3142281
     */
    static castGetObjectToString(params, prefix) {
        const query = Object.keys(params).map((key) => {
            const value = params[key];

            if (params.constructor === Array)
                key = `${prefix}[]`;
            else if (params.constructor === Object)
                key = (prefix ? `${prefix}[${key}]` : key);

            if (typeof value === 'object')
                return UtilsURL.castGetObjectToString(value, key);
            else
                return `${key}=${encodeURIComponent(value)}`;
        });

        return [].concat.apply([], query).join('&');
    }

    // ##################################################
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
}