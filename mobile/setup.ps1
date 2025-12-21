# Sugaries Mobile App Setup

# Step 1: Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

# Step 2: Check Expo CLI
Write-Host "`n🔧 Checking Expo CLI..." -ForegroundColor Cyan
if (-not (Get-Command "expo" -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Expo CLI globally..." -ForegroundColor Yellow
    npm install -g expo-cli
}

# Step 3: Check EAS CLI
Write-Host "`n🏗️ Checking EAS CLI..." -ForegroundColor Cyan
if (-not (Get-Command "eas" -ErrorAction SilentlyContinue)) {
    Write-Host "Installing EAS CLI globally..." -ForegroundColor Yellow
    npm install -g eas-cli
}

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Update the API URL in app.json (extra.apiUrl)"
Write-Host "2. Run 'npm start' to start the development server"
Write-Host "3. Scan the QR code with Expo Go app on your phone"
Write-Host "`nFor production builds:"
Write-Host "1. Run 'eas login' to login to Expo"
Write-Host "2. Run 'npm run build:android' or 'npm run build:ios'"
Write-Host "`n🍬 Happy coding!" -ForegroundColor Magenta
