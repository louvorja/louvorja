@echo off
setlocal EnableDelayedExpansion

set c=0
set version=""

for /f "tokens=1,2 delims=:, " %%a in (' find ":" ^< "package.json" ') do (
  if "%%~a"=="version" (
    set version=%%~b
  )
)

set vy=%%a
set vm=%%b
set vv=%%c
for /F "tokens=1,2,3 delims=." %%a in ("%version%") do (
   set vy=%%a
   set vm=%%b
   set vv=%%c
)


set y=%date:~8,4%
set m=%date:~3,2%
set v=0

if %m% LSS 10 (
    set m=%date:~4,1%
)

if %vy% == %y% (
    if %vm% == %m% (
        @set /a "v=%vv%+1"
    )
)

set new_version=%y%.%m%.%v%

npm version %new_version%