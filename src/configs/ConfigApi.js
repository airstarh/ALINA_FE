const ConfigApi = {
    "url_base":      "http://alinazero:8080",
    "voc-redirects": {
        "default":                     "/auth/login",
        "actionProfile":               "/auth/profile",
        "actionLogin":                 "/auth/login",
        "actionResetPasswordWithCode": "/auth/login",
    },
    "AjaxAlina":     {
        options: {
            headers: {
                "x-requested-with": "AlinaFetchApi",
            }
        }
    },
};
export default ConfigApi;
