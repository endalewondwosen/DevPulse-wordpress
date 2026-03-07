# Neon Database Migration Script
Write-Host "🔧 Running Neon Database Migration..." -ForegroundColor Cyan

# Read the Neon connection string from .env file
$envContent = Get-Content ".env" -ErrorAction SilentlyContinue
$databaseUrl = ""

foreach ($line in $envContent) {
    if ($line.StartsWith("DATABASE_URL=")) {
        $databaseUrl = $line.Substring(13)
        break
    }
}

if (-not $databaseUrl) {
    Write-Host "❌ DATABASE_URL not found in .env file!" -ForegroundColor Red
    Write-Host "Please run 'npm run setup:neon' first." -ForegroundColor Yellow
    exit 1
}

Write-Host "📡 Connecting to Neon database..." -ForegroundColor Green
Write-Host "🔍 Checking and adding missing columns..." -ForegroundColor Yellow

# Check if psql is available
$psqlCmd = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlCmd) {
    Write-Host "❌ PostgreSQL client (psql) not found!" -ForegroundColor Red
    Write-Host "Please install PostgreSQL or use the Neon dashboard to run the migration." -ForegroundColor Yellow
    Write-Host "📄 Migration file: migrate-neon.sql" -ForegroundColor Cyan
    exit 1
}

# Run the migration
try {
    $result = psql "$databaseUrl" -f "migrate-neon.sql"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Migration completed successfully!" -ForegroundColor Green
        Write-Host "🎉 All database columns are now available!" -ForegroundColor Green
    } else {
        Write-Host "❌ Migration failed!" -ForegroundColor Red
        Write-Host "Please check the error messages above." -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error running migration: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Alternative: Run migrate-neon.sql manually in Neon dashboard" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 Now try updating your projects again!" -ForegroundColor Cyan
