import { supabase, supabaseService } from "./supabase";
import { Database } from "./types";
import { promises as fs } from "fs";
import path from "path";

export const DB_FILENAME = "db.json";
const LOCAL_DB_PATH = path.join(process.cwd(), DB_FILENAME);

export async function getDatabase(): Promise<Database> {
  // Check if Supabase is available
  if (!supabase) {
    console.warn("Supabase not configured, using fallback data");
    return getFallbackData();
  }

  try {
    // Try Supabase first
    console.log("Fetching database from Supabase...");

    // Fetch all data from Supabase
    const { data: blogData, error: blogError } = await supabase.from("blog").select("*").order("created_at", { ascending: false });

    const { data: portfolioData, error: portfolioError } = await supabase.from("portfolio").select("*").order("created_at", { ascending: false });

    const { data: productsData, error: productsError } = await supabase.from("products").select("*").order("created_at", { ascending: false });

    // Check for errors
    if (blogError || portfolioError || productsError) {
      console.error("Supabase errors:", { blogError, portfolioError, productsError });
      throw new Error("Supabase fetch failed");
    }

    const result = {
      blog: blogData || [],
      portfolio: portfolioData || [],
      products: productsData || [],
    };

    console.log("Database loaded successfully from Supabase, items:", {
      blog: result.blog.length,
      portfolio: result.portfolio.length,
      products: result.products.length,
    });

    // Save to local file as backup
    await saveLocalBackup(result);

    return result;
  } catch (e) {
    console.error("Failed to fetch from Supabase, falling back to local DB", e);
    return getFallbackData();
  }
}

function getFallbackData(): Database {
  // Try local file first
  try {
    const localData = require("fs").readFileSync(LOCAL_DB_PATH, "utf-8");
    const parsed = JSON.parse(localData);
    console.log("Using local database, items:", {
      blog: parsed.blog?.length || 0,
      portfolio: parsed.portfolio?.length || 0,
      products: parsed.products?.length || 0,
    });
    return parsed;
  } catch (localError) {
    console.error("Local DB also failed, using hardcoded fallback data", localError);

    // Ultimate fallback - MutuTech Solutions data
    return {
      blog: [
        {
          id: "blog-1",
          title: "Professional IT Solutions for Modern Business",
          slug: "professional-it-solutions-modern-business",
          content: "MutuTech Solutions provides comprehensive IT services including web development, software solutions, and digital transformation for modern businesses looking to thrive in the digital age.",
          image: "https://images.unsplash.com/photo-1550745165-9bc0b252726a?w=800&h=600&fit=crop",
          date: "28/12/2025",
        },
        {
          id: "blog-2",
          title: "Digital Transformation Strategies 2025",
          slug: "digital-transformation-strategies-2025",
          content: "Explore the latest digital transformation trends and strategies that can help your business stay competitive in 2025. From cloud migration to AI integration.",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
          date: "25/12/2025",
        },
      ],
      portfolio: [
        {
          id: "portfolio-1",
          title: "Enterprise Resource Planning System",
          description: "Complete ERP solution for manufacturing company with inventory management, production planning, and financial reporting.",
          category: "Web Development",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
          slug: "enterprise-resource-planning-system",
        },
        {
          id: "portfolio-2",
          title: "E-commerce Platform Development",
          description: "Modern e-commerce platform with advanced features including real-time inventory, payment processing, and analytics dashboard.",
          category: "Web Development",
          image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
          slug: "e-commerce-platform-development",
        },
        {
          id: "portfolio-3",
          title: "Mobile Banking Application",
          description: "Secure mobile banking application with biometric authentication, real-time transactions, and comprehensive financial management tools.",
          category: "Software Solutions",
          image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
          slug: "mobile-banking-application",
        },
      ],
      products: [
        {
          id: "product-1",
          name: "Starter IT Package",
          price: "Rp 10 Juta",
          features: ["Professional Website Development", "Basic SEO Optimization", "1 Year Maintenance", "Email Integration", "SSL Certificate", "Basic Analytics Setup"],
        },
        {
          id: "product-2",
          name: "Business IT Solutions",
          price: "Rp 25 Juta",
          features: ["Custom Web Application", "Advanced SEO & Marketing", "2 Year Maintenance & Support", "Database Integration", "API Development", "Performance Optimization", "Security Audit"],
        },
        {
          id: "product-3",
          name: "Enterprise IT Package",
          price: "Rp 50 Juta+",
          features: [
            "Full-Stack Software Development",
            "Enterprise Architecture Design",
            "3 Year Premium Support",
            "Cloud Infrastructure Setup",
            "DevOps Implementation",
            "AI/ML Integration",
            "Custom Analytics Dashboard",
            "24/7 Technical Support",
          ],
        },
      ],
    };
  }
}

// Save local backup
async function saveLocalBackup(data: Database): Promise<void> {
  try {
    await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    console.log("Local backup saved:", LOCAL_DB_PATH);
  } catch (e) {
    console.error("Failed to save local backup", e);
  }
}

export async function saveDatabase(data: Database): Promise<void> {
  if (!supabaseService) {
    console.error("Supabase service client not available");
    throw new Error("Supabase service client not available");
  }

  try {
    console.log("Saving database to Supabase...");

    // Save blog data
    if (data.blog && data.blog.length > 0) {
      for (const blog of data.blog) {
        const { error } = await supabaseService.from("blog").upsert(blog, { onConflict: "id" });

        if (error) {
          console.error("Failed to save blog:", error);
          throw error;
        }
      }
    }

    // Save portfolio data
    if (data.portfolio && data.portfolio.length > 0) {
      for (const portfolio of data.portfolio) {
        const { error } = await supabaseService.from("portfolio").upsert(portfolio, { onConflict: "id" });

        if (error) {
          console.error("Failed to save portfolio:", error);
          throw error;
        }
      }
    }

    // Save products data
    if (data.products && data.products.length > 0) {
      for (const product of data.products) {
        const { error } = await supabaseService.from("products").upsert(product, { onConflict: "id" });

        if (error) {
          console.error("Failed to save product:", error);
          throw error;
        }
      }
    }

    console.log("Database saved successfully to Supabase");

    // Save local backup
    await saveLocalBackup(data);
  } catch (e) {
    console.error("Failed to save to Supabase", e);

    // Fallback to local only
    console.log("Falling back to local file only...");
    await saveLocalBackup(data);
  }
}

export async function deleteBlogPost(id: string): Promise<void> {
  if (!supabaseService) {
    throw new Error("Supabase service client not available");
  }

  try {
    const { error } = await supabaseService.from("blog").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete blog post:", error);
      throw error;
    }
    console.log("Blog post deleted successfully from Supabase");
  } catch (e) {
    console.error("Failed to delete blog post from Supabase", e);
    throw e;
  }
}

export async function deletePortfolioItem(id: string): Promise<void> {
  if (!supabaseService) {
    throw new Error("Supabase service client not available");
  }

  try {
    const { error } = await supabaseService.from("portfolio").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete portfolio item:", error);
      throw error;
    }
    console.log("Portfolio item deleted successfully from Supabase");
  } catch (e) {
    console.error("Failed to delete portfolio item from Supabase", e);
    throw e;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  if (!supabaseService) {
    throw new Error("Supabase service client not available");
  }

  try {
    const { error } = await supabaseService.from("products").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete product:", error);
      throw error;
    }
    console.log("Product deleted successfully from Supabase");
  } catch (e) {
    console.error("Failed to delete product from Supabase", e);
    throw e;
  }
}

// Image upload to Supabase Storage
export async function uploadImage(file: File, folder: string = "images"): Promise<string> {
  if (!supabaseService) {
    throw new Error("Supabase service client not available");
  }

  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabaseService.storage.from("images").upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });

    if (error) {
      console.error("Failed to upload image:", error);
      throw error;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseService.storage.from("images").getPublicUrl(fileName);

    console.log("Image uploaded successfully:", publicUrl);
    return publicUrl;
  } catch (e) {
    console.error("Failed to upload image to Supabase", e);
    throw e;
  }
}
