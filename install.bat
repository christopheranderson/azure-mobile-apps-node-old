for /d %%m in (node_modules/*) do (
  cd node_modules/%%m
  npm install
  for /d %%f in (node_modules\azure-mobile-apps*) do rd /s /q %%f
  cd ..\..
)