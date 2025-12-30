"use client";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed w-full z-50 bg-[#0B1220]/80 backdrop-blur-lg py-4 border-b border-white/10">
      <div className="container mx-auto px-6 max-w-6xl flex justify-between items-center">
        <div className="text-3xl font-black tracking-tight">
          <span className="text-white font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">MutuTech</span>
          <span className="text-cyan-400 font-extrabold">Solutions</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <a href="#beranda" className="text-base font-medium text-gray-300 hover:text-cyan-400 transition-all duration-300 hover:scale-105">
            Beranda
          </a>
          <a href="#layanan" className="text-base font-medium text-gray-300 hover:text-cyan-400 transition-all duration-300 hover:scale-105">
            Layanan
          </a>
          <a href="#pricing" className="text-base font-medium text-gray-300 hover:text-cyan-400 transition-all duration-300 hover:scale-105">
            Harga
          </a>
          <a href="#portofolio" className="text-base font-medium text-gray-300 hover:text-cyan-400 transition-all duration-300 hover:scale-105">
            Portofolio
          </a>
          <a href="#blog" className="text-base font-medium text-gray-300 hover:text-cyan-400 transition-all duration-300 hover:scale-105">
            Blog
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-gray-300 hover:text-cyan-400 transition-colors">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-[#0B1220]/95 backdrop-blur-lg z-40 pt-20">
          <nav className="flex flex-col items-center gap-6 px-6">
            <a href="#beranda" className="text-xl font-medium text-gray-300 hover:text-cyan-400 transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>
              Beranda
            </a>
            <a href="#layanan" className="text-xl font-medium text-gray-300 hover:text-cyan-400 transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>
              Layanan
            </a>
            <a href="#pricing" className="text-xl font-medium text-gray-300 hover:text-cyan-400 transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>
              Harga
            </a>
            <a href="#portofolio" className="text-xl font-medium text-gray-300 hover:text-cyan-400 transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>
              Portofolio
            </a>
            <a href="#blog" className="text-xl font-medium text-gray-300 hover:text-cyan-400 transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>
              Blog
            </a>
            <a
              href="https://wa.me/6281234567890"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg shadow-blue-500/20 hover:scale-105 transition-all duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Konsultasi
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
