# ADLgo Backend - Installation & Setup Script

Write-Host "🚀 ADLgo Backend - Installation & Setup" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if we're in the correct directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from apps/backend directory." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Step 1: Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "`n📦 Step 2: Installing new security & testing packages..." -ForegroundColor Yellow
npm install bcrypt @types/bcrypt @nestjs/swagger @nestjs/throttler

Write-Host "`n📦 Step 3: Installing testing dependencies..." -ForegroundColor Yellow
npm install --save-dev @nestjs/testing supertest @types/supertest

Write-Host "`n📄 Step 4: Setting up environment file..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Created .env file from .env.example" -ForegroundColor Green
    Write-Host "⚠️  Please edit .env with your actual values!" -ForegroundColor Yellow
} else {
    Write-Host "ℹ️  .env file already exists, skipping..." -ForegroundColor Blue
}

Write-Host "`n🧪 Step 5: Running tests..." -ForegroundColor Yellow
npm test

Write-Host "`n✅ Installation Complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env file with your database and API credentials" -ForegroundColor White
Write-Host "2. Run 'npm run start:dev' to start the development server" -ForegroundColor White
Write-Host "3. Visit http://localhost:3000/api/docs for Swagger documentation" -ForegroundColor White
Write-Host "4. Visit http://localhost:3000/health for health check" -ForegroundColor White
Write-Host "`n🎉 Happy coding!" -ForegroundColor Green
