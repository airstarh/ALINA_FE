const ConfigApi = {
    "url_base":              import.meta.env.VITE_APP_ALINA_DOMAIN || new URL(window.location.href).origin,
    "ALINA_FILE_UPLOAD_KEY": "userfile[]",
    "YandexMaps":            {
        apiKey:     import.meta.env.VITE_APP_ALINA_API_KEY_YANDEX,
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
            headers:   {
                "x-requested-with": "AlinaFetchApi",
                "fgp":              window?.navigator?.userAgent,
            },
            getParams: {
                isAjax: 1
            }
        }
    },
};
export default ConfigApi;
