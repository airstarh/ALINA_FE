import UtilsArray from "@/Utils/UtilsArray";
import UtilsData  from "@/Utils/UtilsData";

const MessagesObj = {
    store: [],
    item:  {
        "text":   "",
        "status": "alert alert-info",
    },

    set(item) {
        const res = Object.assign({}, this.item);
        if (UtilsData.isString(item)) {
            res.text = item;
        } else if (UtilsData.isObject(item)) {
            Object.assign(res, item)
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
