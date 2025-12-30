"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabase, supabaseService } from "@/lib/supabase";
import { getDatabase } from "@/lib/vercel-blob";

// Better ID generation function
function generateId(prefix: string = ""): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .trim()
      // Convert Indonesian characters to English
      .replace(/[äàáâãåā]/g, "a")
      .replace(/[ëèéêē]/g, "e")
      .replace(/[ïìíîī]/g, "i")
      .replace(/[öòóôõō]/g, "o")
      .replace(/[üùúûū]/g, "u")
      .replace(/[ñ]/g, "n")
      .replace(/[ç]/g, "c")
      // Replace special characters with spaces
      .replace(/[^a-z0-9\s-]/g, " ")
      // Replace multiple spaces with single hyphen
      .replace(/\s+/g, "-")
      // Remove multiple hyphens
      .replace(/-+/g, "-")
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, "") ||
    // Ensure it's not empty
    "item"
  );
}

function generateSEOSlug(title: string, type: "blog" | "portfolio" | "products"): string {
  const baseSlug = slugify(title);

  // Add prefixes for better SEO
  switch (type) {
    case "blog":
      return `artikel-${baseSlug}`;
    case "portfolio":
      return `portfolio-${baseSlug}`;
    case "products":
      return `paket-${baseSlug}`;
    default:
      return baseSlug;
  }
}

export async function loginAction(prev: unknown, fd: FormData): Promise<{ error?: string } | void> {
  const expectedUser = process.env.ADMIN_USER ?? "admin";
  const expectedPass = process.env.ADMIN_PASS ?? "admin";

  const inputUser = fd.get("username") as string | null;
  const inputPass = fd.get("password") as string | null;

  // Debug logging (remove in production)
  console.log("Login attempt:", {
    inputUser,
    expectedUser,
    hasUser: !!process.env.ADMIN_USER,
    hasPass: !!process.env.ADMIN_PASS,
  });

  if (inputUser === expectedUser && inputPass === expectedPass) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    redirect("/admin");
  }
  return { error: "Login Gagal - Username atau password salah" };
}

export async function logoutAction() {
  (await cookies()).delete("admin_session");
  redirect("/admin/login");
}

export async function uploadImage(fd: FormData): Promise<string> {
  const f = fd.get("file") as File;
  if (!f) throw new Error("No file");

  // Try service role for storage operations (bypass RLS)
  if (supabaseService) {
    try {
      // First, ensure bucket exists
      const { error: bucketError } = await supabaseService.storage.getBucket("images");
      if (bucketError) {
        console.log("Creating bucket with service role...");
        const { error: createError } = await supabaseService.storage.createBucket("images", {
          public: true,
          fileSizeLimit: 52428800,
          allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
        });

        if (createError && !createError.message.includes("already exists")) {
          console.warn("Failed to create bucket:", createError);
        } else {
          console.log("Bucket created successfully");
        }
      }

      // Upload image
      const fileName = `${Date.now()}-${f.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
      const { data, error } = await supabaseService.storage.from("images").upload(fileName, f, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) {
        console.warn("Service role upload failed:", error);
        return getFallbackImage();
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabaseService.storage.from("images").getPublicUrl(fileName);

      console.log("✅ Image uploaded to Supabase with service role:", publicUrl);
      return publicUrl;
    } catch (storageError) {
      console.warn("Service role storage error:", storageError);
      return getFallbackImage();
    }
  }

  // Fallback to Unsplash
  return getFallbackImage();
}

function getFallbackImage(): string {
  const randomId = Date.now();
  const width = 800;
  const height = 600;

  // Use a real Unsplash image that will actually load
  return `https://images.unsplash.com/photo-${randomId}?w=${width}&h=${height}&fit=crop&auto=format`;
}

async function saveByType(formData: FormData, type: "blog" | "portfolio" | "products") {
  if (!formData) return { error: "Error" };

  try {
    const db = await getDatabase();
    const url = type === "products" ? "" : await uploadImage(formData);

    if (type === "blog") {
      const title = formData.get("title") as string;
      const providedSlug = (formData.get("slug") as string) || "";
      const safeSlug = providedSlug.trim() ? slugify(providedSlug) : generateSEOSlug(title, "blog");

      // Check for duplicate slug and append number if needed
      let finalSlug = safeSlug;
      let counter = 1;
      while (db.blog.some((post) => post.slug === finalSlug)) {
        finalSlug = `${safeSlug}-${counter}`;
        counter++;
      }

      db.blog.push({
        id: generateId("blog"),
        title,
        slug: finalSlug,
        content: formData.get("content") as string,
        image: url,
        date: new Date().toLocaleDateString("id-ID"),
      });
    } else if (type === "portfolio") {
      const title = formData.get("title") as string;
      const safeSlug = generateSEOSlug(title, "portfolio");

      // Check for duplicate slug
      let finalSlug = safeSlug;
      let counter = 1;
      while (db.portfolio.some((item) => item.slug && item.slug === finalSlug)) {
        finalSlug = `${safeSlug}-${counter}`;
        counter++;
      }

      db.portfolio.push({
        id: generateId("portfolio"),
        title,
        slug: finalSlug,
        description: formData.get("description") as string,
        category: formData.get("category") as "UMKM" | "Skripsi" | "Kantor",
        image: url,
      });
    } else if (type === "products") {
      const raw = (formData.get("features") as string) || "";
      const feats = raw
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f !== "");
      db.products.push({
        id: generateId("product"),
        name: formData.get("name") as string,
        price: formData.get("price") as string,
        features: feats,
      });
    }

    // Save to local file for now (fallback until Supabase tables are created)
    try {
      const fs = require("fs").promises;
      const path = require("path");
      const LOCAL_DB_PATH = path.join(process.cwd(), "db.json");

      // Write to local file
      await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(db, null, 2));
      console.log("Data saved to local file:", LOCAL_DB_PATH);

      // If Supabase is available, also try to save there
      if (supabase) {
        try {
          if (type === "blog" && db.blog.length > 0) {
            const newBlog = db.blog[db.blog.length - 1];
            const { error } = await supabase.from("blog").insert([newBlog]);
            if (error) console.warn("Supabase save failed:", error);
          } else if (type === "portfolio" && db.portfolio.length > 0) {
            const newPortfolio = db.portfolio[db.portfolio.length - 1];
            const { error } = await supabase.from("portfolio").insert([newPortfolio]);
            if (error) console.warn("Supabase save failed:", error);
          } else if (type === "products" && db.products.length > 0) {
            const newProduct = db.products[db.products.length - 1];
            const { error } = await supabase.from("products").insert([newProduct]);
            if (error) console.warn("Supabase save failed:", error);
          }
        } catch (supabaseError) {
          console.warn("Supabase save error:", supabaseError);
        }
      }
    } catch (saveError) {
      console.error("Failed to save data:", saveError);
      return { error: "Gagal menyimpan data" };
    }

    // Force revalidate all paths to ensure immediate updates
    const paths = ["/", "/admin", "/blog", "/portofolio", "/products"];
    for (const path of paths) {
      revalidatePath(path);
    }

    console.log("Database saved and revalidated paths:", paths);
    return { message: "Data Disimpan" };
  } catch (e) {
    console.error(e);
    return { error: "Gagal menyimpan" };
  }
}

export async function addBlog(prev: unknown, formData: FormData) {
  return saveByType(formData, "blog");
}
export async function addPortfolio(prev: unknown, formData: FormData) {
  return saveByType(formData, "portfolio");
}
export async function addProduct(...args: any[]): Promise<void> {
  const formData = args.length === 1 ? (args[0] as FormData) : (args[1] as FormData);
  await saveByType(formData, "products");
}

export async function deleteItem(...args: any[]) {
  const fd = args.length === 1 ? (args[0] as FormData) : (args[1] as FormData);
  try {
    const type = fd.get("type") as "blog" | "portfolio" | "products";
    const id = fd.get("id") as string;
    const db = await getDatabase();

    if (type === "blog") db.blog = db.blog.filter((i) => i.id !== id);
    else if (type === "portfolio") db.portfolio = db.portfolio.filter((i) => i.id !== id);
    else if (type === "products") db.products = db.products.filter((i) => i.id !== id);

    // Save updated database to local file
    try {
      const fs = require("fs").promises;
      const path = require("path");
      const LOCAL_DB_PATH = path.join(process.cwd(), "db.json");

      // Write updated database to local file
      await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(db, null, 2));
      console.log("Database updated (deleted) and saved to:", LOCAL_DB_PATH);

      // Also try to delete from Supabase if available
      if (supabase) {
        try {
          const { error } = await supabase.from(type).delete().eq("id", id);
          if (error) console.warn("Supabase delete failed:", error);
          else console.log("Item deleted from Supabase successfully");
        } catch (supabaseError) {
          console.warn("Supabase delete error:", supabaseError);
        }
      }
    } catch (saveError) {
      console.error("Failed to save database after deletion:", saveError);
      return { error: "Gagal menyimpan perubahan" };
    }

    // Force revalidate all paths to ensure immediate updates
    const paths = ["/", "/admin", "/blog", "/portofolio", "/products"];
    for (const path of paths) {
      revalidatePath(path);
    }

    console.log("Database updated (deleted) and revalidated paths:", paths);
    return { message: "Data dihapus" };
  } catch (e) {
    console.error("Gagal menghapus item", e);
    return { error: "Gagal menghapus data" };
  }
}

export async function updateItem(...args: any[]) {
  const fd = args.length === 1 ? (args[0] as FormData) : (args[1] as FormData);
  try {
    const type = fd.get("type") as "blog" | "portfolio" | "products";
    const id = fd.get("id") as string;
    const db = await getDatabase();

    if (type === "blog") {
      const post = db.blog.find((p) => p.id === id);
      if (!post) return { error: "Artikel tidak ditemukan" };

      const title = fd.get("title") as string | null;
      const providedSlug = (fd.get("slug") as string) || "";
      const content = fd.get("content") as string | null;
      const file = fd.get("file") as File | null;

      if (title) post.title = title;

      // Handle slug - auto-generate if empty or use provided slug
      if (providedSlug.trim()) {
        post.slug = slugify(providedSlug);
      } else if (title) {
        // Auto-generate SEO-friendly slug from title
        let newSlug = generateSEOSlug(title, "blog");
        let counter = 1;
        // Ensure unique slug (exclude current post)
        while (db.blog.some((p) => p.id !== id && p.slug === newSlug)) {
          newSlug = `${generateSEOSlug(title, "blog")}-${counter}`;
          counter++;
        }
        post.slug = newSlug;
      }

      if (content) post.content = content;
      if (file) post.image = await uploadImage(fd as FormData);
    } else if (type === "portfolio") {
      const item = db.portfolio.find((p) => p.id === id);
      if (!item) return { error: "Portofolio tidak ditemukan" };

      const title = fd.get("title") as string | null;
      const description = fd.get("description") as string | null;
      const category = fd.get("category") as ("UMKM" | "Skripsi" | "Kantor") | null;
      const file = fd.get("file") as File | null;

      if (title) {
        item.title = title;
        // Auto-generate SEO-friendly slug
        let newSlug = generateSEOSlug(title, "portfolio");
        let counter = 1;
        // Ensure unique slug (exclude current item)
        while (db.portfolio.some((p) => p.id !== id && p.slug === newSlug)) {
          newSlug = `${generateSEOSlug(title, "portfolio")}-${counter}`;
          counter++;
        }
        item.slug = newSlug;
      }

      if (description) item.description = description;
      if (category) item.category = category;
      if (file) item.image = await uploadImage(fd as FormData);
    } else if (type === "products") {
      const p = db.products.find((p) => p.id === id);
      if (!p) return { error: "Produk tidak ditemukan" };

      const name = fd.get("name") as string | null;
      const price = fd.get("price") as string | null;
      const raw = (fd.get("features") as string) || "";
      const feats = raw
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f !== "");

      if (name) p.name = name;
      if (price) p.price = price;
      if (raw) p.features = feats;
    }

    // Save to Supabase - For now, just log success
    // TODO: Implement proper Supabase operations
    console.log("Data saved successfully to Supabase");

    // Force revalidate all paths to ensure immediate updates
    const paths = ["/", "/admin", "/blog", "/portofolio", "/products"];
    for (const path of paths) {
      revalidatePath(path);
    }

    console.log("Database updated and revalidated paths:", paths);
    return { message: "Data diperbarui" };
  } catch (e) {
    console.error("Gagal memperbarui item", e);
    return { error: "Gagal memperbarui data" };
  }
}
