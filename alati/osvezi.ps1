# =========================================================
# osvezi.ps1 - ubacuje zajednicki meni i footer u sve strane
#
# Kako se koristi:
#   1. Izmeni _delovi\header.html ili _delovi\footer.html
#   2. Pokreni osvezi.bat (dupli klik) ili:
#        powershell -ExecutionPolicy Bypass -File alati\osvezi.ps1
#
# U svakoj strani meni stoji izmedju oznaka
#   <!-- HEADER:START --> ... <!-- HEADER:END -->
# a footer izmedju
#   <!-- FOOTER:START --> ... <!-- FOOTER:END -->
# Sve izmedju oznaka se pregazi - ne menjaj meni direktno u stranama.
# Aktivna stavka menija se oznacava automatski po imenu fajla.
# =========================================================

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding $false

$header = [IO.File]::ReadAllText((Join-Path $root '_delovi\header.html'), [Text.Encoding]::UTF8).TrimEnd()
$footer = [IO.File]::ReadAllText((Join-Path $root '_delovi\footer.html'), [Text.Encoding]::UTF8).TrimEnd()

function Set-Block([string]$html, [string]$name, [string]$content) {
  $pattern = "(?s)<!-- $name`:START -->.*?<!-- $name`:END -->"
  if ($html -notmatch $pattern) { return $null }
  $replacement = "<!-- $name`:START -->`n$content`n<!-- $name`:END -->"
  return [regex]::Replace($html, $pattern, { param($m) $replacement })
}

$changed = 0
foreach ($file in Get-ChildItem (Join-Path $root '*.html')) {
  $page = $file.Name
  $html = [IO.File]::ReadAllText($file.FullName, [Text.Encoding]::UTF8)

  # Oznaci aktivnu stavku menija za ovu stranu
  $nav = $header
  $esc = [regex]::Escape($page)
  if ($nav -match "<a href=`"$esc`" class=`"nav-cta`">") {
    $nav = $nav -replace "<a href=`"$esc`" class=`"nav-cta`">", "<a href=`"$page`" class=`"nav-cta active`" aria-current=`"page`">"
  } else {
    $nav = $nav -replace "<a href=`"$esc`">", "<a href=`"$page`" class=`"active`" aria-current=`"page`">"
  }

  $new = Set-Block $html 'HEADER' $nav
  if ($null -eq $new) { Write-Host "  preskoceno (nema HEADER oznaka): $page" -ForegroundColor Yellow; continue }
  $new2 = Set-Block $new 'FOOTER' $footer
  if ($null -eq $new2) { Write-Host "  preskoceno (nema FOOTER oznaka): $page" -ForegroundColor Yellow; continue }

  if ($new2 -ne $html) {
    [IO.File]::WriteAllText($file.FullName, $new2, $utf8)
    Write-Host "  osvezeno: $page" -ForegroundColor Green
    $changed++
  } else {
    Write-Host "  bez promena: $page"
  }
}
Write-Host "`nGotovo. Izmenjeno strana: $changed"
