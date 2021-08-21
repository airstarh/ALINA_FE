import UtilsArray from "@/Utils/UtilsArray";
import UtilsData  from "@/Utils/UtilsData";

const MessagesObj = {
	store:         [],
	item:          {
		"text":   "",
		"status": 1,
	},
	statusClasses: [
		'alert alert-success',
		'alert alert-info',
		'alert alert-warning',
		'alert alert-danger',
	],
	set(item, status = null) {
		let res = {
			text:           '',
			templateString: '',
			params:         [],
			status:         0,
			isShown:        0,
		};
		res     = Object.assign(res, this.item);
		if (UtilsData.isString(item)) {
			res.text           = item;
			res.templateString = item;
		} else if (UtilsData.isObject(item)) {
			Object.assign(res, item)
		}
		if (status) {
			res.status = status;
		}
		this.add(res);
	},
	add(message) {
		this.store.push(message);
	},
	deleteAll() {
		UtilsArray.clear(this.store)
	}
};
export default MessagesObj;
