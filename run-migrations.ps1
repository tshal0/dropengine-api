Get-ChildItem -Path "./_artifact" -Recurse | Remove-Item -Force -Recurse
New-Item -Path "./" -Name "_artifact" -ItemType "directory" -Force
New-Item -Path "./_artifact" -Name "src" -ItemType "directory" -Force
New-Item -Path "./_artifact" -Name "postman" -ItemType "directory" -Force
New-Item -Path "./_artifact" -Name "migrations" -ItemType "directory" -Force
New-Item -Path "./_artifact" -Name "azure" -ItemType "directory" -Force
New-Item -Path "./_artifact" -Name "dist" -ItemType "directory" -Force

Copy-Item -Path "./src/*" -Destination "./_artifact/src" -Recurse -Force
Copy-Item -Path "./postman/*" -Destination "./_artifact/postman" -Recurse -Force
Copy-Item -Path "./migrations/*" -Destination "./_artifact/migrations" -Recurse -Force
Copy-Item -Path "./azure/*" -Destination "./_artifact/azure" -Recurse -Force
Copy-Item -Path "./dist/*" -Destination "./_artifact/dist" -Recurse -Force

Copy-Item -Path "./package.json" -Destination "./_artifact"
Copy-Item -Path "./tsconfig.json" -Destination "./_artifact"