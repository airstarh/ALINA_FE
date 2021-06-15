//import VueCookies          from 'vue-cookies';
import MessagesObj from "@/services/MessagesObj";
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

}