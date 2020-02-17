const ConfigApi = {
    "url_base":              "http://alinazero:8080",
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
            }
        }
    },
};
export default ConfigApi;
