import UtilsSys from "@/Utils/UtilsSys";
const ConfigApi = {
    //"url_base":              "http://alinazero:8080",
    //"url_base":              "http://192.168.0.105:8080",
    "url_base":              "https://saysimsim.ru",
    //"url_base":              "https://alinazero",
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
};
export default ConfigApi;
