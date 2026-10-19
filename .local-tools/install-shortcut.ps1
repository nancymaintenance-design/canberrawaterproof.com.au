$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$desktopDirectory = [Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktopDirectory 'Canberra Waterproof 本地后台.lnk'
$shellObject = New-Object -ComObject WScript.Shell
$shortcut = $shellObject.CreateShortcut($shortcutPath)
$shortcut.TargetPath = Join-Path $env:WINDIR 'System32/wscript.exe'
$shortcut.Arguments = '"' + (Join-Path $PSScriptRoot 'open-editor.vbs') + '"'
$shortcut.WorkingDirectory = $projectRoot
$shortcut.Description = 'Canberra Waterproof 本地内容编辑；不自动发布'
$shortcut.IconLocation = (Get-Command node.exe).Source + ',0'
$shortcut.Save()
Write-Output $shortcutPath
