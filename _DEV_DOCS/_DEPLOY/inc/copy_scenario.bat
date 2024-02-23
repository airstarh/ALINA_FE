::##################################################
:: DIRECTORIES
xcopy /i /e /y %FROM%\src\assets %TOTO%\src\assets

::##################################################
:: FILES
xcopy /y %FROM%\src\configs\ConfigApi.js %TOTO%\src\configs\

xcopy /y %FROM%\src\components\MenuHorizontalMain.vue %TOTO%\src\components\
xcopy /y %FROM%\src\components\Footer.vue %TOTO%\src\components\

xcopy /y %FROM%\public\favicon.ico %TOTO%\public\
xcopy /y %FROM%\public\favicon.svg %TOTO%\public\
xcopy /y %FROM%\public\manifest.json %TOTO%\public\
xcopy /y %FROM%\public\index.html %TOTO%\public\
