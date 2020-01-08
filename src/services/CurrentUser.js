import UtilsData from "@/Utils/UtilsData";

export default class CurrentUser {
    //##################################################
    static inst = null;

    /**
     * @return {CurrentUser}
     * */
    static obj(options = {}) {
        if (null === this.inst) {
            this.inst      = new this();
            //#####
            let attributes = window.localStorage.getItem("CurrentUser");
            if (attributes) {
                attributes           = JSON.parse(attributes);
                this.inst.attributes = attributes;
            }
            //#####
        }
        return this.inst;
    }

    //##################################################
    attributes = {};

    applyAttributes(obj) {
        this.attributes = {}; // :-)
        for (let [key, value] of Object.entries(obj)) {
            this.attributes[key] = value;
        }
        window.localStorage.setItem("CurrentUser", JSON.stringify(this.attributes));
    };

    //##################################################
    isLoggedIn() {
        if (this.attributes.hasOwnProperty("id")) {
            if (!UtilsData.empty(this.attributes.id)) {
                return true;
            }
        }
        return false;
    }

    hasRole(name) {
        let res = false;
        if (this.isLoggedIn()) {
            if (this.attributes.rbac_user_role) {
                Object.values(this.attributes.rbac_user_role).forEach((r) => {
                    if (r.name === name) {
                        res = true;
                    }
                })
            }
        }
        return res;
    }

    hasPerm(name) {
        let res = false;
        if (this.isLoggedIn()) {
            if (this.attributes.rbac_permission) {
                Object.values(this.attributes.rbac_permission).forEach((r) => {
                    if (r.name === name) {
                        res = true;
                    }
                })
            }
        }
        return res;
    }

    isAdmin(name) {
        let res = false;
        if (this.isLoggedIn()) {
            if (this.hasRole("admin")) {
                res = true;
            }
        }
        return res;
    }

    name() {
        const a  = this.attributes;
        let name = a.mail;
        if (UtilsData.empty(name)) {
            name = "Not logged in";
        }
        return name;
    }

    //##################################################
}