$repoName = "_dropengine-api-docs"
  $userEmail = "thomas@drop-engine.com"
  $userName = "azure-pipelines.build"
  $stoplightDir = "./_artifact/stoplight"
  $buildNum = ${env:BUILD_BUILDNUMBER}
  $workingDir =${env:SYSTEM_DEFAULTWORKINGDIRECTORY}
  
  Remove-Item ./$repoName/* -Recurse
  
  Copy-Item $stoplightDir/* -Destination ./$repoName -Recurse
  Set-Location ./$repoName
  Get-ChildItem
  git config user.email "$userEmail"
  git config user.name "$userName"
  git add .
  git status
  git remote -v show
  git commit -m "Updated DropEngine API Docs from Azure Pipelines: $buildNum"
  git status
  git log
  git push origin HEAD:main