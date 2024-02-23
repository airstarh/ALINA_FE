import UtilsSys from "@/Utils/UtilsSys";

const ConfigApi = {

  "url_base":              "https://ospl1942.ru",

  "ALINA_FILE_UPLOAD_KEY": "userfile[]",
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
            },
            getParams: {
                isAjax: 1
      }
    }
  },
};
export default ConfigApi;
