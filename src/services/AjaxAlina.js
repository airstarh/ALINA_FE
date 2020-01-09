import Ajax        from "@/services/Ajax";
import MessagesObj from "@/services/MessagesObj";
import CurrentUser from "@/services/CurrentUser";
import UtilsObject from "@/Utils/UtilsObject";
import ConfigApi   from "@/configs/ConfigApi";
import SpinnerObj  from "@/services/SpinnerObj";

export default class AjaxAlina extends Ajax {
    //##################################################
    setOptions(options = {}) {
        const setup  = ConfigApi.AjaxAlina.options;
        this.options = UtilsObject.mergeRecursively(setup, this.options, options);
        return this;
    }

    //##################################################
    hookBeforeAjaxStarted() {
        SpinnerObj.isOn = true;
    }

    //##################################################
    hookProcessResponse() {
        //##########
        //region Messages
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
        //endregion Messages
        //##########
        //region CurrentUser
        if (this.respBody.CurrentUser) {
            const CU = CurrentUser.obj();
            CU.applyAttributes(this.respBody.CurrentUser);
            ConfigApi.AjaxAlina.options.headers.uid   = CU.attributes.id;
            ConfigApi.AjaxAlina.options.headers.token = CU.attributes.token;
        }
        //endregion CurrentUser
        //##########
        SpinnerObj.isOn = false;
        //##########

    };
}