import UtilsData from "@/Utils/UtilsData";

export default class CurrentUser {
    //##################################################
    /**@type {CurrentUser}*/
    static inst = null;
    attributes  = {
        "id":               null,
        "mail":             null,
        "password":         null,
        "firstname":        null,
        "lastname":         null,
        "emblem":           null,
        "birth":            null,
        "language":         null,
        "timezone":         null,
        "is_verified":      null,
        "banned_till":      null,
        "created_at":       null,
        "is_deleted":       null,
        "last_time":        null,
        "last_browser_enc": null,
        "last_ip":          null,
        "fingerprint":      null,
        "about_myself":     null,
        "reset_code":       null,
        "reset_required":   null,
        "rbac_user_role":   [],
    };
    //##################################################
    /**
     * @return {CurrentUser}
     * */
    static obj() {
        const _static = this;
        if (null === _static.inst) {
            _static.inst   = new _static();
            let attributes = window.localStorage.getItem("CurrentUser");
            if (attributes) {
                attributes = JSON.parse(attributes);
                _static.inst.applyAttributes(attributes);
            }
        }
        return _static.inst;
    }
    //##################################################
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
    //##################################################
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

    isModerator(name) {
        let res = false;
        if (this.isLoggedIn()) {
            if (this.hasRole("moderator")) {
                res = true;
            }
        }
        return res;
    }

    owns(id) {
        let res = false;
        if (this.isLoggedIn()) {
            if (this.attributes.id == id) {
                res = true;
            }
        }
        return res;
    }

    ownsOrAdminOrModerator(id) {
        return this.owns(id) || this.isAdmin() || this.isModerator();
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