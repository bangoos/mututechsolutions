"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Rocket, PlayCircle, Zap, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Database } from "@/lib/types";
import PageLayout from "@/components/PageLayout";
import BlogModal from "@/components/modals/BlogModal";
import PortfolioModal from "@/components/modals/PortfolioModal";
import ProductModal from "@/components/modals/ProductModal";

export default function HomeClient({ db }: { db: Database }) {
  const [scrolled, setScrolled] = useState(false);
  const [modalType, setModalType] = useState<"blog" | "portfolio" | "product" | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const contentWrapper = "container mx-auto px-6 max-w-6xl w-full";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <PageLayout>
      <section id="beranda" className="relative min-h-[60vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ y: [0, -50, 0], opacity: [0.18, 0.45, 0.18] }} transition={{ duration: 7, repeat: Infinity }} className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl mix-blend-screen" />
          <motion.div animate={{ y: [0, 50, 0], opacity: [0.18, 0.45, 0.18] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-40 right-10 w-96 h-96 bg-red-200 rounded-full blur-3xl mix-blend-screen" />
        </div>
        <div className={contentWrapper + " relative z-10 grid md:grid-cols-2 gap-8 items-center"}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 text-blue-400 font-bold tracking-widest text-xs uppercase mb-4 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">#1 MutuTech Solutions</span>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-white">
              MutuTech <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-red-600">IT Solutions</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8">Solusi teknologi terdepan untuk transformasi digital bisnis Anda. Website super cepat, SEO optimal, dan sistem manajemen konten profesional.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://wa.me/6281234567890" className="btn btn-primary px-8 py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-3">
                <Rocket size={20} /> Mulai Sekarang
              </a>
              <a href="#portofolio" className="btn btn-ghost px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2">
                <PlayCircle size={20} /> Lihat Portofolio
              </a>
            </div>
            <div className="flex items-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2 text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-400" /> Gratis Hosting
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-400" /> Garansi SEO
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.5 }} className="hidden md:block relative">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="bg-gradient-to-br from-blue-600/20 to-red-600/20 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8 shadow-2xl shadow-blue-500/10">
                <div className="text-center">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-xl font-bold text-white mb-2">Siap Launch!</h3>
                  <p className="text-blue-300 text-sm">Website profesional Anda siap dalam 24 jam</p>
                  <div className="flex justify-center gap-2 mt-4">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" style={{ animationDelay: "1s" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="layanan" className="py-8">
        <div className={contentWrapper}>
          <h2 className="text-3xl font-bold mb-8 text-center">
            Jasa <span className="text-cyan-400">Website Profesional</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, t: "Website UMKM", d: "Toko Online & Company Profile" },
              { icon: MapPin, t: "SEO Karawang", d: "Optimasi Lokal #1 Karawang" },
              { icon: CheckCircle2, t: "Web Skripsi", d: "Tugas Akhir & Kampus" },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="cloud-panel p-8 rounded-2xl text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 mx-auto bg-cyan-50 rounded-2xl flex items-center justify-center mb-6 text-cyan-500">
                  <f.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{f.t}</h3>
                <p className="text-gray-300">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-8">
        <div className={contentWrapper}>
          <h2 className="text-3xl font-bold mb-8 text-center">
            Paket <span className="text-cyan-400">Harga Website</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {db.products.length > 0
              ? db.products.map((p, i) => (
                  <div
                    key={p.id}
                    className={`rounded-2xl ${
                      i === 1 ? "p-8 bg-gradient-to-b from-blue-900/30 to-[#0F1628] border-2 border-blue-500/50 shadow-2xl shadow-blue-900/30 scale-105 relative" : "bg-gradient-to-b from-[#1a2332] to-[#0F1628] border border-gray-700/50 p-8"
                    }`}
                  >
                    {i === 1 && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold px-4 py-2 rounded-full">Paling Laris</div>
                      </div>
                    )}
                    <h3 className={`text-xl font-bold mb-2 ${i === 1 ? "text-white" : "text-gray-300"}`}>{p.name}</h3>
                    <div className="text-3xl font-bold mb-6 text-white">{p.price}</div>
                    <ul className="space-y-3 mb-8 text-gray-400 text-sm">
                      {p.features.map((f, fi) => (
                        <li key={fi} className="flex gap-3 items-start">
                          <CheckCircle2 size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => {
                        if (i === 2) {
                          window.open("https://wa.me/6281234567890", "_blank");
                        } else {
                          setModalType("product");
                          setSelectedItem(p);
                        }
                      }}
                      className={`block w-full text-center py-3 rounded-xl font-bold transition-all ${
                        i === 1 ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700" : i === 2 ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-700 text-white hover:bg-gray-600"
                      }`}
                    >
                      {i === 1 ? "Paling Laris" : i === 2 ? "Kontak Kami" : "Pilih Paket"}
                    </button>
                  </div>
                ))
              : // Fallback data saat database kosong
                [
                  { id: "1", name: "Starter", price: "Rp 1,5 Juta", features: ["Landing Page 1 Section", "Desain Modern", "Free Domain .my.id", "Gratis Meeting Selamanya", "Revisi 2x"] },
                  { id: "2", name: "Bisnis", price: "Rp 3 Juta", features: ["Hingga 5 Halaman", "SEO Basic Karawang", "Integrasi WhatsApp", "Analitik Google", "Revisi 3x", "Support Prioritas"] },
                  { id: "3", name: "Custom / Skripsi", price: "Rp 5 Juta", features: ["Full Sistem Database", "Fitur Komplet (Login/Admin)", "Source Code Lengkap (Skripsi)", "Dokumentasi", "Revisi 5x", "Guidance Bimbingan"] },
                ].map((p, i) => (
                  <div
                    key={p.id}
                    className={`rounded-2xl ${
                      i === 1 ? "p-8 bg-gradient-to-b from-blue-900/30 to-[#0F1628] border-2 border-blue-500/50 shadow-2xl shadow-blue-900/30 scale-105 relative" : "bg-gradient-to-b from-[#1a2332] to-[#0F1628] border border-gray-700/50 p-8"
                    }`}
                  >
                    {i === 1 && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold px-4 py-2 rounded-full">Paling Laris</div>
                      </div>
                    )}
                    <h3 className={`text-xl font-bold mb-2 ${i === 1 ? "text-white" : "text-gray-300"}`}>{p.name}</h3>
                    <div className="text-3xl font-bold mb-6 text-white">{p.price}</div>
                    <ul className="space-y-3 mb-8 text-gray-400 text-sm">
                      {p.features.map((f, fi) => (
                        <li key={fi} className="flex gap-3 items-start">
                          <CheckCircle2 size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => {
                        if (i === 2) {
                          window.open("https://wa.me/6281234567890", "_blank");
                        } else {
                          setModalType("product");
                          setSelectedItem(p);
                        }
                      }}
                      className={`block w-full text-center py-3 rounded-xl font-bold transition-all ${
                        i === 1 ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700" : i === 2 ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-700 text-white hover:bg-gray-600"
                      }`}
                    >
                      {i === 1 ? "Paling Laris" : i === 2 ? "Kontak Kami" : "Pilih Paket"}
                    </button>
                  </div>
                ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all">
              Lihat Semua Produk <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section id="portofolio" className="py-8">
        <div className={contentWrapper}>
          <div className="flex justify-between items-end mb-8">
            <div className={contentWrapper}>
              <h2 className="text-3xl font-bold">
                Portfolio <span className="text-cyan-400">Website</span>
              </h2>
              <p className="text-gray-400 mt-2">Hasil kerja nyata untuk client di Karawang.</p>
            </div>
            <Link href="/portofolio" className="hidden md:flex items-center text-sm text-blue-400 hover:text-blue-300 font-semibold">
              Lihat Semua <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {db.portfolio.length > 0
              ? db.portfolio.slice(0, 3).map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setModalType("portfolio");
                      setSelectedItem(item);
                    }}
                    className="group bg-gradient-to-b from-[#1a2332] to-[#0F1628] border border-gray-700/50 rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 text-left w-full hover:shadow-xl hover:shadow-blue-900/20"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" decoding="async" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-cyan-600/20 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl mb-2">
                              {item.category === "Web Development" && "🛒"}
                              {item.category === "Software Solutions" && "💻"}
                              {item.category === "IT Consulting" && "👔"}
                              {item.category === "Mobile Development" && "📱"}
                              {item.category === "Cloud Solutions" && "☁️"}
                            </div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">
                              {item.category === "Web Development" && "🛒"}
                              {item.category === "Software Solutions" && "💻"}
                              {item.category === "IT Consulting" && "👔"}
                              {item.category === "Mobile Development" && "📱"}
                              {item.category === "Cloud Solutions" && "☁️"}
                            </div>
                          </div>
                        </div>
                    </div>
                  </button>
                ))
              : // Fallback data saat database kosong
                [
                  { id: "1", title: "Toko Online UMKM Karawang", description: "Platform e-commerce lengkap untuk UMKM lokal", category: "UMKM", image: null },
                  { id: "2", title: "Sistem Informasi Skripsi", description: "Aplikasi web untuk manajemen data skripsi", category: "Skripsi", image: null },
                  { id: "3", title: "Company Profile PT. Karawang", description: "Website profil perusahaan profesional", category: "Kantor", image: null },
                ].map((item, i) => (
                  <div key={i} className="bg-gradient-to-b from-[#1a2332] to-[#0F1628] border border-gray-700/50 rounded-2xl overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-cyan-600/20 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">
                            {item.category === "UMKM" && "🛒"}
                            {item.category === "Skripsi" && "🎓"}
                            {item.category === "Kantor" && "🏢"}
                          </div>
                          <div className="text-xs text-gray-400 uppercase tracking-wider">{item.category}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      <p className="text-gray-400 text-sm mt-2">{item.description}</p>
                    </div>
                  </div>
                ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/portofolio" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all">
              Lihat Semua <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section id="blog" className="py-8">
        <div className={contentWrapper}>
          <div className="flex justify-between items-end mb-8">
            <div className={contentWrapper}>
              <h2 className="text-3xl font-bold">
                Artikel <span className="text-cyan-400">Website</span>
              </h2>
              <p className="text-gray-400 mt-2">Wawasan terbaru seputar Web & Bisnis.</p>
            </div>
            <Link href="/blog" className="hidden md:flex items-center text-sm text-blue-400 hover:text-blue-300 font-semibold">
              Lihat Semua <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {db.blog.length > 0
              ? db.blog.slice(0, 2).map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group bg-gradient-to-b from-[#1a2332] to-[#0F1628] border border-gray-700/50 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-blue-900/20 transition-all hover:-translate-y-1 cursor-pointer"
                    onClick={() => {
                      setModalType("blog");
                      setSelectedItem(item);
                    }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" decoding="async" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                          <div className="text-6xl">
                            {item.title.includes("SEO") && "🔍"}
                            {item.title.includes("Skripsi") && "📚"}
                            {!item.title.includes("SEO") && !item.title.includes("Skripsi") && "📝"}
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">{item.date}</div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-400 transition-colors text-white">{item.title}</h3>
                      <p className="text-gray-400 leading-relaxed line-clamp-3 mb-6">{item.content}</p>
                      <button className="inline-flex items-center text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                        Baca Selengkapnya <ArrowRight size={16} className="ml-2" />
                      </button>
                    </div>
                  </motion.div>
                ))
              : // Fallback data saat database kosong
                [
                  { id: "1", title: "Pentingnya SEO Lokal untuk UMKM", content: "SEO lokal sangat penting untuk UMKM di Karawang. Dengan optimasi yang tepat, bisnis Anda bisa muncul di pencarian Google.", date: "15 Des 2024", image: null },
                  { id: "2", title: "Tips Judul Skripsi IT yang Mudah Diterima", content: "Memilih judul skripsi IT yang tepat sangat krusial. Pilih tema yang relevan dengan industri saat ini.", date: "12 Des 2024", image: null },
                ].map((item, i) => (
                  <div key={i} className="bg-gradient-to-b from-[#1a2332] to-[#0F1628] border border-gray-700/50 rounded-2xl overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                        <div className="text-6xl">
                          {item.title.includes("SEO") && "🔍"}
                          {item.title.includes("Skripsi") && "📚"}
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">{item.date}</div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                      <p className="text-gray-400 leading-relaxed line-clamp-3 mb-6">{item.content}</p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Modals */}
      <BlogModal
        open={modalType === "blog"}
        onClose={() => {
          setModalType(null);
          setSelectedItem(null);
        }}
        item={modalType === "blog" ? selectedItem : null}
      />
      <PortfolioModal
        open={modalType === "portfolio"}
        onClose={() => {
          setModalType(null);
          setSelectedItem(null);
        }}
        item={modalType === "portfolio" ? selectedItem : null}
      />
      <ProductModal
        open={modalType === "product"}
        onClose={() => {
          setModalType(null);
          setSelectedItem(null);
        }}
        item={modalType === "product" ? selectedItem : null}
      />
    </PageLayout>
  );
}
