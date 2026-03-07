# Add this project to GitHub repo: nitro-delivery-web
# You did NOT create the repo yet — so do STEP 0 first, then run this script.
#
# STEP 0 — Create the repo on GitHub (do this once, before running this script):
#   1. Open: https://github.com/new?name=nitro-delivery-web
#   2. Repository name will be "nitro-delivery-web" (pre-filled).
#   3. Choose Public or Private.
#   4. Do NOT check "Add a README" — leave the repo empty.
#   5. Click "Create repository".
#
# STEP 1 — Edit this script: replace YOUR_GITHUB_USERNAME with your GitHub username
#          in the $remoteUrl line below.
#
# STEP 2 — Run this script in PowerShell from the project folder:
#          .\add-to-github.ps1
#
# STEP 3 — Push to GitHub:
#          git push -u origin main

$repoName = "nitro-delivery-web"
$branch = "main"

# Replace YOUR_GITHUB_USERNAME with your actual GitHub username
$remoteUrl = "https://github.com/Ch1ik/nitro-delivery-web.git"

Write-Host "=== Adding project to GitHub: $repoName ===" -ForegroundColor Cyan
Write-Host ""

if ($remoteUrl -match "YOUR_GITHUB_USERNAME") {
    Write-Host "ERROR: Edit this script and replace YOUR_GITHUB_USERNAME with your GitHub username." -ForegroundColor Red
    Write-Host "Then run the script again." -ForegroundColor Red
    exit 1
}

Write-Host "Make sure you already created the empty repo: https://github.com/new?name=$repoName" -ForegroundColor Yellow
Write-Host ""

if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    git branch -M $branch
} else {
    Write-Host "Git already initialized." -ForegroundColor Green
}

Write-Host "Adding files (respecting .gitignore)..." -ForegroundColor Yellow
git add .

$status = git status --short
if ($status) {
    Write-Host "Creating initial commit..." -ForegroundColor Yellow
    git commit -m "Initial commit: Nitro delivery platform"
} else {
    Write-Host "Nothing to commit (working tree clean)." -ForegroundColor Green
}

if (-not (git remote get-url origin 2>$null)) {
    Write-Host "Adding remote 'origin'..." -ForegroundColor Yellow
    git remote add origin $remoteUrl
    Write-Host "Remote added: $remoteUrl" -ForegroundColor Green
} else {
    Write-Host "Remote 'origin' already exists." -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Next step ===" -ForegroundColor Cyan
Write-Host "Push to GitHub:  git push -u origin $branch" -ForegroundColor White
Write-Host ""
