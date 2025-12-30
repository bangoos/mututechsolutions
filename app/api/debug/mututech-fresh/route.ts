import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseService } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const debug: any = {
    timestamp: new Date().toISOString(),
    action: "mututech_fresh_supabase_check",
    project: "MutuTech Fresh",
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
        // Test basic connection
        const { data, error } = await supabase.from("blog").select("count", { count: "exact", head: true });
        debug.connection_test = {
          success: !error,
          error: error?.message,
          blog_table_exists: !error,
          blog_count: data ? data[0]?.count : 0,
        };
      } catch (connError) {
        debug.connection_test = {
          success: false,
          error: connError instanceof Error ? connError.message : "Connection failed",
          blog_table_exists: false,
          blog_count: 0,
        };
      }
    }

    debug.steps.push("Step 4: Checking all tables...");
    if (supabase) {
      const tables = ["blog", "portfolio", "products"];
      debug.table_status = {};

      for (const table of tables) {
        try {
          const { data, error } = await supabase.from(table).select("count", { count: "exact", head: true });
          debug.table_status[table] = {
            exists: !error,
            count: data ? data[0]?.count : 0,
            error: error?.message,
          };
        } catch (tableError) {
          debug.table_status[table] = {
            exists: false,
            count: 0,
            error: tableError instanceof Error ? tableError.message : "Table check failed",
          };
        }
      }
    }

    debug.steps.push("Step 5: Testing storage connection...");
    if (supabaseService) {
      try {
        const { data: buckets, error: bucketError } = await supabaseService.storage.listBuckets();
        debug.storage_check = {
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
        }
      } catch (storageError) {
        debug.storage_check = {
          success: false,
          error: storageError instanceof Error ? storageError.message : "Storage check failed",
          buckets: [],
          bucket_count: 0,
        };
      }
    }

    debug.steps.push("Step 6: Project verification...");
    debug.project_info = {
      expected_url: "https://yqvfcuwfusfoiggayrfm.supabase.co",
      actual_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      url_match: process.env.NEXT_PUBLIC_SUPABASE_URL === "https://yqvfcuwfusfoiggayrfm.supabase.co",
      project_name: "MutuTech Solutions",
    };

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

    if (debug.connection_test?.success) {
      debug.recommendations.push("✅ Database connection successful");
    } else {
      debug.recommendations.push("❌ Database connection failed");
    }

    const tablesExist = Object.values(debug.table_status || {}).some((status: any) => status.exists);
    if (tablesExist) {
      debug.recommendations.push("✅ Tables exist");
    } else {
      debug.recommendations.push("❌ No tables found - need to create tables");
    }

    if (debug.storage_check?.success) {
      debug.recommendations.push("✅ Storage access successful");
    } else {
      debug.recommendations.push("❌ Storage access failed");
    }

    if (debug.project_info?.url_match) {
      debug.recommendations.push("✅ Connected to correct MutuTech project");
    } else {
      debug.recommendations.push("❌ Connected to wrong project");
    }

    debug.success = true;
  } catch (err) {
    debug.error = err instanceof Error ? err.message : "Unknown error";
    debug.success = false;
  }

  return NextResponse.json(debug);
}
