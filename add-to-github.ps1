# Add this project to GitHub repo: nitro-delivery-web
# Run this in PowerShell from the project folder (where this script lives).
# Prerequisites: Git installed, GitHub repo "nitro-delivery-web" already created (empty or not).

$repoName = "nitro-delivery-web"
$branch = "main"

# Replace YOUR_GITHUB_USERNAME with your actual GitHub username, e.g.:
# $remoteUrl = "https://github.com/johndoe/nitro-delivery-web.git"
$remoteUrl = "https://github.com/YOUR_GITHUB_USERNAME/$repoName.git"

Write-Host "=== Adding project to GitHub: $repoName ===" -ForegroundColor Cyan

if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    git branch -M $branch
} else {
    Write-Host "Git already initialized." -ForegroundColor Green
}

Write-Host "Adding files (respecting .gitignore)..." -ForegroundColor Yellow
git add .

Write-Host "Checking status..." -ForegroundColor Yellow
git status

$commit = git status --short
if ($commit) {
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
Write-Host "=== Next steps ===" -ForegroundColor Cyan
Write-Host "1. Edit this script and replace YOUR_GITHUB_USERNAME with your GitHub username."
Write-Host "2. Create the repo on GitHub if you haven't: https://github.com/new?name=$repoName"
Write-Host "3. Run: git push -u origin $branch"
Write-Host ""
