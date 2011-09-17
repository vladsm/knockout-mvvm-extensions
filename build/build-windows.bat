@echo off 

set SrcFiles=version-header.js
set SrcFilesForDebug=version-header.js

for /f "eol=] skip=1 delims='	 " %%i in (knockout-mvvm-ext-source-references.js) do (
	set Filename=%%i & call :PrepareSrcFiles
)
goto :CombineIntoSingleFile

:PrepareSrcFiles
	set Filename=%Filename:/=\%
	set SrcFiles=%SrcFiles% ..\%Filename%
	set SrcFilesForDebug=%SrcFilesForDebug%+..\%Filename%
goto :EOF

:CombineIntoSingleFile

rem debug version
copy /Y /A /B %SrcFilesForDebug% output\knockout-mvvm-ext.js

rem minified version
tools\ajaxmin\ajaxmin %SrcFiles% -clobber -analyze -o output\knockout-mvvm-ext.min.temp.js
copy /Y /A /B version-header.js+output\knockout-mvvm-ext.min.temp.js output\knockout-mvvm-ext.min.js
del /F /Q output\knockout-mvvm-ext.min.temp.js
