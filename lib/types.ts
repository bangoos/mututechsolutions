export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  date: string;
}
export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: "Web Development" | "Software Solutions" | "IT Consulting" | "Mobile Development" | "Cloud Solutions";
  image: string;
  slug: string;
}
export interface Product {
  id: string;
  name: string;
  price: string;
  features: string[];
}
export interface Database {
  blog: BlogPost[];
  portfolio: PortfolioItem[];
  products: Product[];
}
