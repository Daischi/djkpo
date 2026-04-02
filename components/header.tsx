"use client";

import { useState, useEffect } from "react";
import { Menu, X, Music } from "lucide-react";
import Link from "next/link";

interface NavLink {
  href: string;
  label: string;
  isPage?: boolean;
}

const navLinks: NavLink[] = [
  { href: "#about", label: "Sobre" },
  { href: "#gallery", label: "Galeria" },
  { href: "#videos", label: "Vídeos" },
  { href: "#services", label: "Serviços" },
  { href: "#contact", label: "Contato" },
  { href: "/contrato", label: "Contrato", isPage: true },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="#"
            className="group flex items-center gap-2 text-xl md:text-2xl font-black tracking-wider"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <Music className="w-6 h-6 md:w-7 md:h-7 text-primary group-hover:animate-pulse" />
            <span className="text-foreground">DJ</span>
            <span className="text-primary relative">
              KPO
              <span className="absolute -inset-1 bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.isPage ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-medium text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </Link>
              ) : (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="relative text-sm font-medium text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </button>
              ),
            )}
          </nav>

          {/* CTA Button */}
          <Link
            href="/contrato"
            className="hidden md:flex bg-primary text-primary-foreground hover:bg-primary/90 font-bold tracking-wider relative overflow-hidden group animate-pulse-glow px-4 py-2 rounded-md"
          >
            <span className="relative z-10">CONTRATAR</span>
            <span className="absolute inset-0 bg-gradient-to-r from-primary via-green-400 to-primary bg-[length:200%_100%] opacity-0 group-hover:opacity-100 animate-shimmer transition-opacity duration-300" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border/50 transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
          {navLinks.map((link) =>
            link.isPage ? (
              <Link
                key={link.href}
                href={link.href}
                className="text-left text-lg font-medium text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-left text-lg font-medium text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase py-2"
              >
                {link.label}
              </button>
            ),
          )}
          <Link
            href="/contrato"
            className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 font-bold tracking-wider w-full block text-center py-2 rounded-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            CONTRATAR AGORA
          </Link>
        </nav>
      </div>
    </header>
  );
}
