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
    hookResponseNotOk(resp) {
        SpinnerObj.isOn = false;
        MessagesObj.set(`Server error. Status ${resp.status}`, 3);
    }

    hookNetworkError(e) {
        SpinnerObj.isOn = false;
        MessagesObj.set(`Unexpected error.`, 3);
        console.log(">>>>>>>>>>>>>>>>>>>>");
        console.error(e);
        console.log("<<<<<<<<<<<<<<<<<<<<");
    }

    //##################################################
    hookProcessResponse() {
        if (this.respType === 'json') {
            if (this.resp.redirected) {
                if (this.respBody["data"] && this.respBody["data"]["form_id"]) {
                    const formId       = this.respBody["data"]["form_id"];
                    const vocRedirects = ConfigApi.vocRedirects;
                    if (UtilsObject.hasOwnPropertyCaseInsensitive(vocRedirects, formId)) {
                        if (this.classBehaviour.followRedirects) {
                            Router.push(vocRedirects[formId]);
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
        }
        //##########
        if (this.respType === 'text') {
            MessagesObj.set(this.respBody, 3);
            this.options.onDone = () => {};
        }
        //##########
        SpinnerObj.isOn = false;
        //##########
    }
}