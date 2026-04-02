"use client";

import { Music, Instagram, Youtube, Music2, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-card/50 border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Logo */}
          <div className="text-center md:text-left">
            <a
              href="#"
              className="inline-flex items-center gap-2 text-2xl font-black tracking-wider"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <Music className="w-7 h-7 text-primary" />
              <span className="text-foreground">DJ</span>
              <span className="text-primary">KPO</span>
            </a>
            <p className="text-muted-foreground text-sm mt-2">
              Frequency Control
            </p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4">
            <a
              href="https://www.instagram.com/leocapovilla/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all text-muted-foreground hover:text-primary"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.youtube.com/@DJ-KP0"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all text-muted-foreground hover:text-primary"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="https://soundcloud.com/djkpo"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all text-muted-foreground hover:text-primary"
              aria-label="SoundCloud"
            >
              <Music2 className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-muted-foreground text-sm">
              © {currentYear} DJ KPO. Todos os direitos reservados.
            </p>
            <p className="text-muted-foreground/70 text-xs mt-1 flex items-center justify-center md:justify-end gap-1">
              Feito com <Heart className="w-3 h-3 text-primary" /> para a cena
              techno
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </footer>
  );
}
