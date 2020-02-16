import Ajax        from "@/services/Ajax";
import MessagesObj from "@/services/MessagesObj";
import CurrentUser from "@/services/CurrentUser";
import UtilsObject from "@/Utils/UtilsObject";
import ConfigApi   from "@/configs/ConfigApi";
import SpinnerObj  from "@/services/SpinnerObj";
import Router      from '@/router';

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
    hookResponseNotOk() {
        SpinnerObj.isOn = false;
        MessagesObj.set('Bad response');
    }
    //##################################################
    hookProcessResponse() {
        //##########
        if (this.resp.redirected) {
            if (this.respBody["data"] && this.respBody["data"]["form_id"]) {
                const formId       = this.respBody["data"]["form_id"];
                const vocRedirects = ConfigApi.vocRedirects;
                if (UtilsObject.hasOwnPropertyCaseInsensitive(vocRedirects, formId)) {
                    console.log(">>>____________________________");
                    console.log("Redirected!");
                    console.log(formId);
                    console.log("<<<____________________________");
                    if (this.classBehaviour.followRedirects) {
                        Router.replace(vocRedirects[formId]);
                    }
                }
            }
        }
        //##########
        //region Messages
        let msgs = [];
        if (this.respBody["messages"]) {
            msgs = msgs.concat(this.respBody["messages"])
        }
        if (this.respBody["messages_admin"]) {
            msgs = msgs.concat(this.respBody["messages_admin"])
        }
        msgs.forEach((item) => {
            MessagesObj.add(item);
        });
        //endregion Messages
        //##########
        //region CurrentUser
        if (this.respBody["CurrentUser"]) {
            const CU = CurrentUser.obj();
            CU.applyAttributes(this.respBody["CurrentUser"]);
            ConfigApi.AjaxAlina.options.headers.uid   = CU.attributes.id;
            ConfigApi.AjaxAlina.options.headers.token = CU.attributes.token;
        }
        //endregion CurrentUser
        //##########
        SpinnerObj.isOn = false;
        //##########

    };
}