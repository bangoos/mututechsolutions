import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseService } from "@/lib/supabase";
import { getDatabase, saveDatabase, deleteBlogPost, deletePortfolioItem, deleteProduct, uploadImage } from "@/lib/supabase-database";

export async function GET(request: NextRequest) {
  const debug: any = {
    timestamp: new Date().toISOString(),
    action: "mututech_supabase_full_check",
    project: "MutuTech Solutions",
    steps: [],
  };

  try {
    debug.steps.push("Step 1: Checking environment variables...");
    debug.env_vars = {
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT_SET",
      url_preview: process.env.NEXT_PUBLIC_SUPABASE_URL ? process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + "..." : "NONE",
      anon_key_set: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      service_key_set: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    };

    debug.steps.push("Step 2: Testing Supabase clients...");
    debug.clients = {
      supabase: supabase ? "CREATED" : "FAILED",
      supabaseService: supabaseService ? "CREATED" : "FAILED",
    };

    debug.steps.push("Step 3: Testing database connection...");
    if (supabase) {
      try {
        // Test blog table
        const { data: blogData, error: blogError } = await supabase.from("blog").select("count", { count: "exact", head: true });
        debug.blog_test = {
          success: !blogError,
          error: blogError?.message,
          count: blogData ? blogData[0]?.count : 0,
        };

        // Test portfolio table
        const { data: portfolioData, error: portfolioError } = await supabase.from("portfolio").select("count", { count: "exact", head: true });
        debug.portfolio_test = {
          success: !portfolioError,
          error: portfolioError?.message,
          count: portfolioData ? portfolioData[0]?.count : 0,
        };

        // Test products table
        const { data: productsData, error: productsError } = await supabase.from("products").select("count", { count: "exact", head: true });
        debug.products_test = {
          success: !productsError,
          error: productsError?.message,
          count: productsData ? productsData[0]?.count : 0,
        };
      } catch (connError) {
        debug.connection_test = {
          success: false,
          error: connError instanceof Error ? connError.message : "Connection failed",
        };
      }
    }

    debug.steps.push("Step 4: Testing Supabase Storage...");
    if (supabaseService) {
      try {
        const { data: buckets, error: bucketError } = await supabaseService.storage.listBuckets();
        debug.storage_test = {
          success: !bucketError,
          buckets: buckets || [],
          bucket_count: buckets?.length || 0,
          error: bucketError?.message,
        };

        // Check for images bucket
        if (!bucketError && buckets) {
          const imagesBucket = buckets.find((b) => b.name === "images");
          debug.images_bucket = {
            exists: !!imagesBucket,
            bucket: imagesBucket || null,
          };

          // Create images bucket if not exists
          if (!imagesBucket) {
            const { error: createError } = await supabaseService.storage.createBucket("images", {
              public: true,
              allowedMimeTypes: ["image/*"],
              fileSizeLimit: 5242880, // 5MB
            });

            debug.bucket_creation = {
              success: !createError,
              error: createError?.message,
            };
          }
        }
      } catch (storageError) {
        debug.storage_test = {
          success: false,
          error: storageError instanceof Error ? storageError.message : "Storage test failed",
        };
      }
    }

    debug.steps.push("Step 5: Testing write operations...");
    if (supabaseService) {
      try {
        // Test insert operation
        const testBlog = {
          id: `test-${Date.now()}`,
          title: "Test Blog Entry - MutuTech Solutions",
          slug: `test-blog-${Date.now()}`,
          content: "Test content for database operations - MutuTech Solutions provides professional IT services",
          image: "https://example.com/test.jpg",
          date: new Date().toLocaleDateString("id-ID"),
        };

        const { data: insertData, error: insertError } = await supabaseService.from("blog").insert(testBlog).select();
        debug.insert_test = {
          success: !insertError,
          error: insertError?.message,
          data: insertData,
        };

        // Test delete operation
        if (insertData && insertData.length > 0) {
          const { error: deleteError } = await supabaseService.from("blog").delete().eq("id", testBlog.id);
          debug.delete_test = {
            success: !deleteError,
            error: deleteError?.message,
          };
        }
      } catch (opError) {
        debug.operations_test = {
          success: false,
          error: opError instanceof Error ? opError.message : "Operations failed",
        };
      }
    }

    debug.steps.push("Step 6: Testing new database functions...");
    try {
      const db = await getDatabase();
      debug.get_database_test = {
        success: true,
        blog_count: db.blog.length,
        portfolio_count: db.portfolio.length,
        products_count: db.products.length,
      };

      // Test save function
      const testDb = {
        blog: [
          ...db.blog,
          {
            id: `save-test-${Date.now()}`,
            title: "Save Test Entry - MutuTech",
            slug: `save-test-${Date.now()}`,
            content: "Test content for save function - MutuTech Solutions",
            image: "https://example.com/save-test.jpg",
            date: new Date().toLocaleDateString("id-ID"),
          },
        ],
        portfolio: db.portfolio,
        products: db.products,
      };

      await saveDatabase(testDb);
      debug.save_test = {
        success: true,
        message: "Save function working",
      };

      // Clean up test entry
      await deleteBlogPost(`save-test-${Date.now()}`);
      debug.cleanup_test = {
        success: true,
        message: "Cleanup successful",
      };
    } catch (dbError) {
      debug.database_functions_test = {
        success: false,
        error: dbError instanceof Error ? dbError.message : "Database functions failed",
      };
    }

    debug.steps.push("Step 7: Recommendations...");
    debug.recommendations = [];

    if (debug.env_vars.supabase_url === "NOT_SET") {
      debug.recommendations.push("❌ Supabase URL not configured");
    } else {
      debug.recommendations.push("✅ Supabase URL configured");
    }

    if (debug.clients.supabase === "CREATED") {
      debug.recommendations.push("✅ Supabase client created");
    } else {
      debug.recommendations.push("❌ Supabase client failed");
    }

    if (debug.blog_test?.success && debug.portfolio_test?.success && debug.products_test?.success) {
      debug.recommendations.push("✅ All database tables accessible");
    } else {
      debug.recommendations.push("❌ Some database tables not accessible");
    }

    if (debug.storage_test?.success) {
      debug.recommendations.push("✅ Supabase Storage working");
    } else {
      debug.recommendations.push("❌ Supabase Storage failed");
    }

    if (debug.insert_test?.success && debug.delete_test?.success) {
      debug.recommendations.push("✅ Write operations working");
    } else {
      debug.recommendations.push("❌ Write operations failed");
    }

    if (debug.get_database_test?.success && debug.save_test?.success) {
      debug.recommendations.push("✅ New database functions working");
    } else {
      debug.recommendations.push("❌ Database functions failed");
    }

    debug.success = true;
  } catch (err) {
    debug.error = err instanceof Error ? err.message : "Unknown error";
    debug.success = false;
  }

  return NextResponse.json(debug);
}
