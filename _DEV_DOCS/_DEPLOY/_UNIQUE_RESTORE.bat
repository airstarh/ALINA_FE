@echo off
::##################################################
:: ALINA_FE
:: Documentation:
:: https://learn.microsoft.com/en-US/troubleshoot/windows-client/deployment/switches-with-xcopy-and-xcopy32-command?ranMID=43674&ranEAID=FE4O7wtxe6g&ranSiteID=FE4O7wtxe6g-S.IT_QZ3nGxJeSPxTJCMGQ&epi=FE4O7wtxe6g-S.IT_QZ3nGxJeSPxTJCMGQ&irgwc=1&OCID=AID2200057_aff_7795_1243925&tduid=(ir__o3dn266zwgkfblmvlgudtjkavu2xcgprnll9o3j900)(7795)(1243925)(FE4O7wtxe6g-S.IT_QZ3nGxJeSPxTJCMGQ)()&irclickid=_o3dn266zwgkfblmvlgudtjkavu2xcgprnll9o3j900

set __DIR__=%~dp0

set FROM=%__DIR__%_STORAGE
set TOTO=%__DIR__%..\..
call %__DIR__%inc\copy_scenario.bat
pause