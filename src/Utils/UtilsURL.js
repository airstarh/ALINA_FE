export default class UtilsURL {

	/*
	 * ToDo: UnTested. From: https://stackoverflow.com/a/43513777/3142281
	 */
	static getParamsAsObject(query) {

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

	// ToDo: Untested. From: https://stackoverflow.com/a/42604801/3142281
	static parseJsonAsQueryString(obj, prefix, objName) {
		var str = [];
		for (var p in obj) {
			if (obj.hasOwnProperty(p)) {
				var v = obj[p];
				if (typeof v == "object") {
					var k = (objName ? objName + '.' : '') + (prefix ? prefix + "[" + p + "]" : p);
					str.push(parseJsonAsQueryString(v, k));
				} else {
					var k = (objName ? objName + '.' : '') + (prefix ? prefix + '.' + p : p);
					str.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
					//str.push(k + "=" + v);
				}
			}
		}
		return str.join("&");
	};
	// ##################################################
}