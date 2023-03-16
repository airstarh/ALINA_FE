::
:: SSS
:: Documentation:
:: https://learn.microsoft.com/en-US/troubleshoot/windows-client/deployment/switches-with-xcopy-and-xcopy32-command?ranMID=43674&ranEAID=FE4O7wtxe6g&ranSiteID=FE4O7wtxe6g-S.IT_QZ3nGxJeSPxTJCMGQ&epi=FE4O7wtxe6g-S.IT_QZ3nGxJeSPxTJCMGQ&irgwc=1&OCID=AID2200057_aff_7795_1243925&tduid=(ir__o3dn266zwgkfblmvlgudtjkavu2xcgprnll9o3j900)(7795)(1243925)(FE4O7wtxe6g-S.IT_QZ3nGxJeSPxTJCMGQ)()&irclickid=_o3dn266zwgkfblmvlgudtjkavu2xcgprnll9o3j900
::
::@echo off

::set PROJ=m45a
set PROJ=vov
::set PROJ=sss
::set PROJ=localhost
set FROM=C:\_A001\REPOS\OWN\vuesandbox\sandbox\_DEV_DOCS\batniki\_CFG\%PROJ%
set TOTO=C:\_A001\REPOS\OWN\vuesandbox\sandbox
:: DIRECTORIES
xcopy /i /e /y %FROM%\public %TOTO%\public
xcopy /i /e /y %FROM%\src\assets %TOTO%\src\assets
:: FILES
xcopy /y %FROM%\src\configs\ConfigApi.js %TOTO%\src\configs\
xcopy /y %FROM%\src\components\MenuHorizontalMain.vue %TOTO%\src\components\
xcopy /y %FROM%\src\components\Footer.vue %TOTO%\src\components\

pause