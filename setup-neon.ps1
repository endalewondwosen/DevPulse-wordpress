# Setup Neon Database for DevPulse
Write-Host "🚀 Setting up DevPulse with Neon Database" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Create .env file with Neon connection string
$envContent = @"
# Neon Database Connection (Render Production)
DATABASE_URL="postgresql://neondb_owner:npg_y7BrSe1bJFmt@ep-shiny-paper-aiih6ss4-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Environment
NODE_ENV="production"

# Gemini API (add your key)
GEMINI_API_KEY="your_gemini_api_key_here"

# App URL (update for production)
APP_URL="https://your-app-name.onrender.com"
"@

# Create the .env file
if (Test-Path ".env") {
    Remove-Item ".env"
}
$envContent | Set-Content -Path ".env" -Encoding UTF8

Write-Host "✅ .env file created with Neon connection" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Add your Gemini API key to .env file" -ForegroundColor White
Write-Host "2. Run: npm run dev" -ForegroundColor White
Write-Host "3. This will create new tables for skills, experience, messages, etc." -ForegroundColor White
Write-Host "4. Your existing posts/projects data will remain untouched" -ForegroundColor White
Write-Host ""
Write-Host "📊 Neon Database Info:" -ForegroundColor Yellow
Write-Host "  Host: ep-shiny-paper-aiih6ss4-pooler.c-4.us-east-1.aws.neon.tech" -ForegroundColor White
Write-Host "  Database: neondb" -ForegroundColor White
Write-Host "  User: neondb_owner" -ForegroundColor White
Write-Host "  SSL: Required" -ForegroundColor White
Write-Host ""
Write-Host "✨ Ready to connect to your Neon database!" -ForegroundColor Green
