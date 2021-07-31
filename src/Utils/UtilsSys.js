//import VueCookies          from 'vue-cookies';
import MessagesObj from "@/services/MessagesObj";
import ConfigApi   from "@/configs/ConfigApi";
import UtilsData   from "@/Utils/UtilsData";
export default class UtilsSys {
    static fgp() {
        //return window.$cookies.get('fgp');
        return window.navigator.userAgent;
    }

    static processMessages(respBody) {
        let msgs = [];
        if (respBody["messages"]) {
            msgs = msgs.concat(respBody["messages"])
        }
        if (respBody["messages_admin"]) {
            msgs = msgs.concat(respBody["messages_admin"])
        }
        msgs.forEach((item) => {
            MessagesObj.add(item);
        });
    }

    static hrefToBackend(o, defaultTailPart = 'tale/upsert') {
        const url = ConfigApi.url_base;
        let tail  = `${defaultTailPart}/${o.id}`;
        if (!UtilsData.empty(o.router_alias)) {
            tail = o.router_alias;
        }
        return `${url}/${tail}`;
    }
}