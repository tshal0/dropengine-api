param ($service = 'dropengine', $env = 'dev')
$kvName = "kv-$service-$env"

$keyVaultEntries = (az keyvault secret list --vault-name $kvName | ConvertFrom-Json) | Select-Object id, name

Write-Host "Secret values for key vault '$($keyVaultName)'"
Write-Host "| key | secret value |"
Write-Host "| --- | ------------ |"
foreach ($entry in $keyVaultEntries) {
    $secretValue = (az keyvault secret show --id $entry.id | ConvertFrom-Json) | Select-Object name, value
    Write-Host "| " $secretValue.name " | " $secretValue.value " |"
}
Write-Host ""
