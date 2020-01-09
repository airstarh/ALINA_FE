import UtilsURL    from "../Utils/UtilsURL";
import UtilsObject from "../Utils/UtilsObject";
import UtilsData   from "../Utils/UtilsData";

export default class Ajax {
    options     = {
        url:            "",
        method:         "GET", // *GET, POST, PUT, DELETE, etc.
        headers:        {},
        getParams:      {},
        postParams:     {},
        reqFlagPostRaw: false,
        enctype:        "application/json",
        mode:           "cors", // no-cors, cors, *same-origin
        cache:          "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials:    "include", //"same-origin", include, *omit
        redirect:       "follow", // manual, *follow, error
        referrer:       "", // no-referrer, *client
        onDone:         () => {
        }
    };
    // ##################################################
    urlClean    = "";
    urlRes      = "";
    respType    = null; // json, text, blob, ...others
    respBody    = "";
    respHeaders = {};

    // ##################################################

    constructor() {
    }

    // ##################################################
    // ##################################################
    // ##################################################

    /**
     * @return Ajax instance
     */
    static newInst(options = {}) {
        const _this = new this();
        _this.setOptions(options);
        return _this;
    }

    setOptions(options = {}) {
        this.options = UtilsObject.mergeRecursively(this.options, options);
        return this;
    }

    // ##################################################
    // ##################################################
    // ##################################################
    go() {
        const _t   = this;
        const opts = this.options;

        // Headers
        const h = new Headers();
        for (let hp in opts.headers) {
            if (opts.headers.hasOwnProperty(hp)) {
                h.append(hp, opts.headers[hp]);
            }
        }
        // Fetch params
        const p = {
            method:      opts.method,
            mode:        opts.mode,
            cache:       opts.cache,
            credentials: opts.credentials,
            headers:     h,
            redirect:    opts.redirect,
            referrer:    opts.referrer,
            enctype:     opts.enctype
        };

        // POST
        if (opts.method !== "GET") {
            if (opts.reqFlagPostRaw) {
                h.append("Content-Type", "text/plain");
                p.body = opts.postParams;
            } else {
                //h.append("Content-Type", opts.enctype);
                switch (opts.enctype) {
                    case "application/json":
                        p.body = JSON.stringify(opts.postParams);
                        break;
                    case "multipart/form-data":
                        p.body = UtilsData.objectToFormData(opts.postParams);
                        break;
                    case "application/x-www-form-urlencoded":
                        h.append("Content-Type", opts.enctype);
                        p.body = UtilsURL.castGetObjectToString(opts.postParams);
                        break;
                    case "text/plain":
                    default:
                        p.body = opts.postParams;
                        break;
                }
            }
        }

        // ##################################################
        // ##################################################
        // ##################################################
        //Go
        if (typeof _t['hookBeforeAjaxStarted'] === 'function') {
            _t.hookBeforeAjaxStarted();
        }

        const myRequest = new Request(this.urlBuild(), p);
        return fetch(myRequest)
            .then(resp => {

                // Extract Response Headers
                resp.headers.forEach((value, name) => {
                    _t.respHeaders[name] = value;
                });

                if (!resp.ok) {
                    if (typeof _t['hookResponseNotOk'] === 'function') {
                        _t.hookResponseNotOk();
                    }
                    console.error(">>>____________________________");
                    console.error("RESPONSE NOT OK");
                    console.error(resp);
                    console.error("<<<____________________________");
                    throw new Error('RESPONSE NOT OK');
                }

                return _t.handleResponse(resp);
            })
            .then(data => {
                _t.respBody = data;
                if (typeof _t['hookProcessResponse'] === 'function') {
                    _t.hookProcessResponse();
                }
                if (opts.onDone) {
                    opts.onDone(_t);
                }
                return _t;
            })
            .catch(error => {
                console.error(">>>____________________________");
                console.error("COMMON REQUEST ERROR");
                console.error(error);
                console.error("<<<____________________________");
            });
    }

    // ##################################################
    handleResponse(resp) {
        let _t          = this;
        let contentType = resp.headers.get("content-type");
        if (contentType.includes("application/json")) {
            return resp.json()
                .then(json => {
                    _t.respType = 'json';
                    return json;
                });
        } else if (
            contentType.includes("text/html")
            ||
            contentType.includes("text/plain")
        ) {
            return resp.text()
                .then(text => {
                    _t.respType = 'text';
                    return text;
                });
        } else if (contentType.includes("image")) {
            return resp.blob()
                .then(blob => {
                    _t.respType = 'blob';
                    return blob;
                });

        } else {
            return resp.blob()
                .then(blob => {
                    _t.respType = 'blob';
                    return blob;
                });
        }
    }

    // ##################################################
    // ##################################################
    // ##################################################
    //region Data Processing
    /**
     * @return String
     */
    urlBuild() {
        const opts  = this.options;
        let urlFull = opts.url;
        const url   = new URL(urlFull);
        // ##################################################
        // region Process GET
        const oldGetStr = url.search;
        const oldGetObj = UtilsURL.castGetStringToObject(oldGetStr);
        const newGetObj = UtilsObject.mergeRecursively(oldGetObj, opts.getParams);
        const newGetStr = UtilsURL.castGetObjectToString(newGetObj);
        opts.getParams  = newGetObj;
        //region Erase initial GET
        url.search      = '';
        Object.keys(url.searchParams).forEach(key =>
            url.searchParams.delete(key)
        );
        this.urlClean = url.toString();
        //endregion Erase initial GET
        url.search    = newGetStr;
        //endregion Process GET
        // ##################################################
        this.urlRes = url.toString();
        return this.urlRes;
    }

    //endregion Data Processing
    // ##################################################
}
