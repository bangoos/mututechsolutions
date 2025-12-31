@echo off
echo 🚀 MutuTech Solutions - Supabase Full Setup
echo.

echo 📊 Step 1: Testing Supabase Full Integration...
curl -X GET http://localhost:3000/api/debug/mututech-supabase-full
echo.
echo.

echo 🎯 Expected Results:
echo    ✅ supabase_url: SET
echo    ✅ supabase: CREATED
echo    ✅ supabaseService: CREATED
echo    ✅ blog_test: success
echo    ✅ portfolio_test: success
echo    ✅ products_test: success
echo    ✅ storage_test: success
echo    ✅ images_bucket: exists
echo    ✅ insert_test: success
echo    ✅ delete_test: success
echo    ✅ get_database_test: success
echo    ✅ save_test: success
echo    ✅ cleanup_test: success
echo.

echo 🔍 What This Checks:
echo    ✅ Environment variables configuration
echo    ✅ Supabase client creation
echo    ✅ Database table access
echo    ✅ Supabase Storage setup
echo    ✅ Images bucket creation
echo    ✅ Write operations (insert/delete)
echo    ✅ New database functions
echo    ✅ Save operations to Supabase
echo    ✅ Delete operations from Supabase
echo.

echo 🚀 After Success:
echo    1. Update imports to use supabase-database.ts
echo    2. Remove Vercel Blob dependency
echo    3. Test admin panel functionality
echo    4. Verify image upload to Supabase Storage
echo.

echo 📋 Architecture:
echo    ✅ Supabase Database (blog, portfolio, products)
echo    ✅ Supabase Storage (images)
echo    ✅ Local file backup (fallback)
echo    ✅ Vercel (deploy only)
echo.

echo 🎯 MutuTech Features:
echo    ✅ Professional IT services data
echo    ✅ Web Development portfolio
echo    ✅ Software Solutions showcase
echo    ✅ Enterprise IT packages
echo.

pause
