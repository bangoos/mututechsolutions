@echo off
echo 🔍 MutuTech Fresh - Supabase Connection Check
echo.

echo 📊 Step 1: Testing Supabase connection...
curl -X GET http://localhost:3000/api/debug/mututech-fresh
echo.
echo.

echo 🎯 Expected Results for MutuTech Fresh:
echo    ✅ supabase_url: SET
echo    ✅ url_preview: https://yqvfcuwfusfoiggayrfm.supabase.co
echo    ✅ supabase: CREATED
echo    ✅ supabaseService: CREATED
echo    ✅ url_match: true
echo.

echo 📋 Table Status Expected:
echo    ❌ blog_table_exists: false (belum ada tabel)
echo    ❌ portfolio_table_exists: false (belum ada tabel)
echo    ❌ products_table_exists: false (belum ada tabel)
echo.

echo 🔍 Storage Status Expected:
echo    ❌ storage_check: success false (belum ada bucket)
echo    ❌ images_bucket: exists false
echo.

echo 📋 What This Checks:
echo    ✅ Environment variables configuration
echo    ✅ Supabase client creation
echo    ✅ Database connection to MutuTech project
echo    ✅ Table existence (should be false initially)
echo    ✅ Storage access (should be false initially)
echo    ✅ Project URL verification
echo.

echo 🚀 Next Steps After Check:
echo    1. If connection OK → Create tables
echo    2. If tables missing → Run create-tables-only.sql
echo    3. If storage missing → Create storage bucket
echo    4. Test admin panel functionality
echo.

pause
