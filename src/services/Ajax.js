import UtilsData from "../Utils/UtilsData";
import ConfigApi from "../configs/ConfigApi";
import UtilsURL  from "../Utils/UtilsURL";
import * as _    from "lodash";

export class Ajax {
	options = {};
	// ##################################################
	//url         = 'http://alinazero/alinaRestAccept?cmd=model&m=user&ps=2&p=1';
	url         = "";
	urlProtocol = ""; //http://';
	urlDomain   = ""; //'alinazero';
	urlPort     = ""; //':8080';
	urlPath     = ""; //'/alinaRestAccept';
	// ##################################################
	headers = {};
	// {
	// "Content-Type": "application/x-www-form-urlencoded",
	// };
	getParams   = {};
	postParams  = {};
	method      = "GET"; // *GET, POST, PUT, DELETE, etc.
	mode        = "cors"; //"cors"; // no-cors, cors, *same-origin
	cache       = "no-cache"; //"no-cache"; // *default, no-cache, reload, force-cache, only-if-cached
	credentials = "include"; //"omit"; //"same-origin"; // include, same-origin, *omit
	redirect    = "follow"; //"follow"; // manual, *follow, error
	referrer    = ""; //"no-referrer"; // no-referrer, *client
	// ##################################################
	respType                = null; // json, text, blob, ...others
	onDone                  = null;
	respBody                = "";
	respHeadersStructurized = {};

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
		//ToDo: Smart Extend of:
		//ToDO: ConfigApi.headers;
		//ToDO: ConfigApi.getParams;
		//ToDO: ConfigApi.postParams;
		options      = Object.assign({}, ConfigApi, options);
		this.options = options;
		for (let p in options) {
			if (options.hasOwnProperty(p)) {
				this[p] = options[p];
			}
		}
		return this;
	}

	// ##################################################
	go() {
		// ##################################################
		const h = new Headers();
		for (let hp in this.headers) {
			if (this.headers.hasOwnProperty(hp)) {
				h.append(hp, this.headers[hp]);
			}
		}
		// ##################################################
		const p = {
			method:      this.method,
			mode:        this.mode,
			cache:       this.cache,
			credentials: this.credentials,
			headers:     h,
			redirect:    this.redirect,
			referrer:    this.referrer
		};
		if (this.method !== "GET") {
			p.body = JSON.stringify(this.postParams);
		}
		const myRequest = new Request(this.urlBuild(), p);

		// ##################################################
		// ##################################################
		// ##################################################
		const _t = this;
		let resp = fetch(myRequest)
			.then(resp => {
				if (!resp.ok) {
					throw new Error(`${resp.status} ||| ${resp.statusText}`);
				}
				// ##################################################
				//Line below does not work: ...
				//console.log(resp.headers);
				// ...instead:
				resp.headers.forEach((value, name) => {
					_t.respHeadersStructurized[name] = value;
				});
				// ##################################################
				return _t.handleResponse(resp);
				// ##################################################
			})
			.then(data => {
				_t.respBody = data;
				if (_t.onDone) {
					_t.onDone(_t);
				}
				return _t;
			})
			.catch(error => console.error(error));
		// ##################################################
		return resp;
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
		const _t    = this;
		let urlFull = "";
		if (!UtilsData.empty(this.url)) {
			urlFull = this.url;
		} else {
			const urlProtocol = this.urlProtocol;
			const urlDomain   = this.urlDomain;
			const urlPort     = this.urlPort;
			const urlPath     = this.urlPath;
			urlFull           = `${urlProtocol}${urlDomain}${urlPort}${urlPath}`;
		}
		const url = new URL(urlFull);
		// ##################################################
		// Extract GET params which already in URL

		const oldGetStr = url.search;
		const oldGetObj = UtilsURL.getParamsAsObject(oldGetStr);
		const newGetObj = _.mergeWith(oldGetObj, this.getParams, function (objValue, srcValue) {
			if (_.isArray(objValue)) {
				return objValue.concat(srcValue);
			}
		});
		this.getParams  = newGetObj;
		const newGetStr = UtilsURL.serializeQuery(newGetObj);
		url.search      = newGetStr;
		//url.searchParams = new URLSearchParams(newGetStr);
		console.log("url ++++++++++");
		console.log(url);
		// ##################################################
		Object.keys(this.getParams).forEach(key =>
			url.searchParams.append(key, this.getParams[key])
		);
		return url.toString();
	}

	//endregion Data Processing
	// ##################################################
}
