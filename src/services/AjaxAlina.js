import Ajax        from "@/services/Ajax";
import MessagesObj from "@/services/MessagesObj";

export default class AjaxAlina extends Ajax {
    hookProcessResponse() {
        let msgs = [];
        if (this.respBody.messages) {
            msgs = msgs.concat(this.respBody.messages)
        }
        if (this.respBody.messages_admin) {
            msgs = msgs.concat(this.respBody.messages_admin)
        }
        msgs.forEach((m) => {
            MessagesObj.store.push(m);
        });
    };
}