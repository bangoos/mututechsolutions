import { supabase, supabaseService } from "@/lib/supabase";

export async function GET() {
  const results = {
    supabase_connection: false,
    supabase_service_connection: false,
    blog_table_exists: false,
    portfolio_table_exists: false,
    products_table_exists: false,
    error: null as string | null,
    details: {} as any,
  };

  try {
    // Test basic connection
    if (supabase) {
      const { data, error } = await supabase.from("blog").select("count").single();
      if (!error) {
        results.supabase_connection = true;
        results.blog_table_exists = true;
      } else {
        results.error = error.message;
        results.details.blog_error = error;
      }
    } else {
      results.error = "Supabase client not initialized";
    }

    // Test service role connection
    if (supabaseService) {
      const { data, error } = await supabaseService.from("blog").select("count").single();
      if (!error) {
        results.supabase_service_connection = true;
      } else {
        results.details.service_error = error;
      }

      // Test other tables
      const portfolioTest = await supabaseService.from("portfolio").select("count").single();
      if (!portfolioTest.error) {
        results.portfolio_table_exists = true;
      }

      const productsTest = await supabaseService.from("products").select("count").single();
      if (!productsTest.error) {
        results.products_table_exists = true;
      }
    }

    return Response.json(results);
  } catch (error) {
    results.error = error instanceof Error ? error.message : "Unknown error";
    return Response.json(results, { status: 500 });
  }
}
