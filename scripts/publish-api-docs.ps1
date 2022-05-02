$repoName = "dropengine-api-docs"
$userEmail = "thomas@drop-engine.com"
$userName = "azure-pipelines.build"
$stoplightDir = "stoplight"
$buildNum = ${env:BUILD_BUILDNUMBER}
$docRepo = "https://github.com/dropEngineLead/$repoName.git"

git clone $docRepo
Remove-Item ./$repoName/* -Recurse
git config user.email "$userEmail"
git config user.name "$userName"
Copy-Item $stoplightDir/* -Destination $repoName -Recurse
cd .\$repoName
ls
git add .
git status
git remote -v show
git commit -m "Updated DropEngine API Docs from Azure Pipelines: $buildNum"
git status
git log
git push origin HEAD:main