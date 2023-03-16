::
:: SSS
:: Documentation:
:: https://learn.microsoft.com/en-US/troubleshoot/windows-client/deployment/switches-with-xcopy-and-xcopy32-command?ranMID=43674&ranEAID=FE4O7wtxe6g&ranSiteID=FE4O7wtxe6g-S.IT_QZ3nGxJeSPxTJCMGQ&epi=FE4O7wtxe6g-S.IT_QZ3nGxJeSPxTJCMGQ&irgwc=1&OCID=AID2200057_aff_7795_1243925&tduid=(ir__o3dn266zwgkfblmvlgudtjkavu2xcgprnll9o3j900)(7795)(1243925)(FE4O7wtxe6g-S.IT_QZ3nGxJeSPxTJCMGQ)()&irclickid=_o3dn266zwgkfblmvlgudtjkavu2xcgprnll9o3j900
::
::@echo off
set FROM=C:\_A001\REPOS\OWN\vuesandbox\sandbox
set TOTO=C:\_A001\REPOS\OWN\vuesandbox\_DEV_DOCS\batniki\_CFG\sss

xcopy /y %FROM%\public\favicon.ico %TOTO%
xcopy /y %FROM%\public\favicon.svg %TOTO%
xcopy /y %FROM%\public\index.html %TOTO%
xcopy /y %FROM%\public\manifest.json %TOTO%
xcopy  /y %FROM%\src\components\Footer.vue %TOTO%
xcopy /y %FROM%\src\components\MenuHorizontalMain.vue %TOTO%
xcopy /y %FROM%\src\configs\ConfigApi.js %TOTO%
xcopy /i /e /y %FROM%\src\assets %TOTO%\assets

pause