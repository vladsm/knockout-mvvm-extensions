@echo off 

set SrcFiles=version-header.js
set SrcFilesForCopy=version-header.js

for /f "eol=] skip=1 delims='	 " %%i in (knockout-mvvm-ext-source-references.js) do (
	set Filename=%%i & call :PrepareSrcFiles
)
goto :CombineIntoSingleFile

:PrepareSrcFiles
    set Filename=%Filename:/=\%
	set SrcFiles=%SrcFiles% ..\%Filename%
	set SrcFilesForCopy=%SrcFilesForCopy%+..\%Filename%
goto :EOF

:CombineIntoSingleFile

copy /Y /A /B %SrcFilesForCopy% output\knockout-mvvm-ext.js

@echo off
tools\ajaxmin\ajaxmin %SrcFiles% -clobber -analyze -o output\knockout-mvvm-ext.min.js
