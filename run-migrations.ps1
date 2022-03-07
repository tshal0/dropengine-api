
New-Item -Path "./" -Name "_migrations" -ItemType "directory" -Force
New-Item -Path "./_migrations" -Name "dist" -ItemType "directory" -Force

Copy-Item -Path "./dist/migrations/*" -Destination "./_migrations/dist" -Recurse -Force
Copy-Item -Path "./package.json" -Destination "./_migrations"
