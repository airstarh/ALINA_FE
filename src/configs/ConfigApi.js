import UtilsSys from "@/Utils/UtilsSys";
const ConfigApi = {
    //"url_base":              "https://saysimsim.ru",
    //"url_base":              "https://alinazero",
    "url_base":              "https://host.home",
    //"url_base":              "https://192.168.1.110",
    "ALINA_FILE_UPLOAD_KEY": "userfile[]",
    "vocRedirects":          {
        "default":                     "/auth/login",
        "actionProfile":               "/auth/profile",
        "actionLogin":                 "/auth/login",
        "actionResetPasswordWithCode": "/auth/reset_password_with_code",
    },
    "AjaxAlina":             {
        options: {
            headers: {
                "x-requested-with": "AlinaFetchApi",
                "fgp":              UtilsSys.fgp(),
            }
        }
    },
    // ##################################################
    //region iFrame
    iFrame:                  null,
    pageIsInIframe() {
        if (ConfigApi.iFrame === null && parent && parent.document && parent.document.getElementById) {
            ConfigApi.iFrame = false;
            const iframe     = parent.document.getElementById("AlinaIframe001");
            if (iframe) {
                ConfigApi.iFrame = iframe;
            }
        }
        return ConfigApi.iFrame;
    },
    pageRecalcIframeHeight() {
        const iframe = ConfigApi.pageIsInIframe();
        if (iframe) {
            let el = document.getElementById('alina-body-wrapper');
            if (el) {
                iframe.style.height = el.scrollHeight + 150 + 'px';
            }
        }
    }
    //endregion iFrame
    // ##################################################
};
export default ConfigApi;
