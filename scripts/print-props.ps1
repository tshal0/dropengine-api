$repoName = "_dropengine-api-docs"
$userEmail = "thomas@drop-engine.com"
$userName = "azure-pipelines.build"
$stoplightDir = "./_artifact/stoplight"
$buildNum = ${env:BUILD_BUILDNUMBER}
$workingDir =${env:SYSTEM_DEFAULTWORKINGDIRECTORY}
$stoplightUrl = "https://dropengine.stoplight.io"

$props=@{
  "repoName"="$repoName";
  "userEmail"="$userEmail";
  "userName"="$userName";
  "stoplightDir"="$stoplightDir";
  "buildNum"="$buildNum";
  "workingDir"="$workingDir";
  "stoplightUrl"="$stoplightUrl";
}
$props.GetEnumerator() | ForEach-Object{
  $message = '{0}: "{1}"' -f $_.key, $_.value
  Write-Output $message
}
