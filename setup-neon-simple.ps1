# Setup Neon Database for DevPulse
Write-Host "Setting up DevPulse with Neon Database..." -ForegroundColor Cyan

$content = @"
DATABASE_URL=postgresql://neondb_owner:npg_y7BrSe1bJFmt@ep-shiny-paper-aiih6ss4-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NODE_ENV=production
GEMINI_API_KEY=your_gemini_api_key_here
APP_URL=https://your-app-name.onrender.com
"@

# Create the .env file
if (Test-Path ".env") {
    Remove-Item ".env"
}
$content | Set-Content -Path ".env" -Encoding UTF8

Write-Host "✅ .env file created with Neon connection" -ForegroundColor Green
Write-Host "Now run: npm run dev" -ForegroundColor Yellow
