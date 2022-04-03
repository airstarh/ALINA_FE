import UtilsSys from "@/Utils/UtilsSys";
const ConfigApi = {
    "url_base": "https://saysimsim.ru",
    //"url_base":              "https://borg-001.private",
    //"url_base": "https://alinazero",
    //"url_base":              "https://host.home",
    //"url_base":              "https://192.168.1.110",
    //"url_base":              "https://vov",
    //"url_base":               "http://ospl1942.ru",
    //"url_base":              "https://ospl1942.ru",
    "ALINA_FILE_UPLOAD_KEY": "userfile[]",
    "modeSocialNetwork":     false,
    "YandexMaps":            {
        apiKey:     '716acc81-eeeb-4db9-a3d6-eb1d1c5f7b55',
        lang:       'ru_RU',
        coordorder: 'latlong',
        version:    '2.1',
    },
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
    iFrame: null,
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
                iframe.style.height = el.scrollHeight + 500 + 'px';
            }
        }
    }
    //endregion iFrame
    // ##################################################
};
export default ConfigApi;
