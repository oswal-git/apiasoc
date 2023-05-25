pushd .
set mypath=%cd%
echo %mypath%

pm2 start ../ecosystem.config.js

set mypath=%cd%
echo %mypath%

popd 