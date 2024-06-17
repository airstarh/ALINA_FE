import UtilsSys from "@/Utils/UtilsSys";

const ConfigApi = {
    "url_base":              process.env.VUE_APP_ALINA_DOMAIN,
    "ALINA_FILE_UPLOAD_KEY": "userfile[]",
    "YandexMaps": {
        apiKey:     process.env.VUE_APP_ALINA_API_KEY_YANDEX,
        lang: 'ru_RU',
        coordorder: 'latlong',
        version: '2.1',
    },
    "vocRedirects": {
        "default": "/auth/login",
        "actionProfile": "/auth/profile",
        "actionLogin": "/auth/login",
        "actionResetPasswordWithCode": "/auth/reset_password_with_code",
    },
    "AjaxAlina": {
        options: {
            headers: {
                "x-requested-with": "AlinaFetchApi",
                "fgp": UtilsSys.fgp(),
            },
            getParams: {
                isAjax: 1
            }
        }
    },
};
export default ConfigApi;
