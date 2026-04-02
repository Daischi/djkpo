"use client";

import { useEffect, useRef, useState } from "react";
import {
  Mail,
  MapPin,
  Instagram,
  Youtube,
  Music2,
  MessageCircle,
} from "lucide-react";

export function ContactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="relative py-24 md:py-32">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <span className="text-primary font-mono text-sm tracking-[0.3em] uppercase">
            Contato
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mt-4">
            <span className="text-foreground">Vamos </span>
            <span className="text-primary">Conversar</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Interessado em levar a energia do DJ KPO para o seu evento? Entre em
            contato!
          </p>
        </div>

        <div className="flex justify-center">
          {/* Contact Info */}
          <div
            className={`w-full max-w-2xl transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"}`}
          >
            <h3 className="text-2xl font-bold text-foreground mb-8">
              Entre em Contato
            </h3>

            <div className="space-y-6">
              <a
                href="mailto:contato@djkpo.com"
                className="flex items-center gap-4 p-4 bg-card/50 border border-border/50 rounded-lg hover:border-primary/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="text-foreground font-medium">
                    contato@djkpo.com
                  </div>
                </div>
              </a>

              <a
                href="https://wa.me/5511964438044"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-card/50 border border-border/50 rounded-lg hover:border-primary/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">WhatsApp</div>
                  <div className="text-foreground font-medium">
                    +55 (11) 96443-8044
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 bg-card/50 border border-border/50 rounded-lg">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Localização
                  </div>
                  <div className="text-foreground font-medium">
                    São Paulo, Brasil
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-foreground mb-4">
                Redes Sociais
              </h4>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/leocapovilla/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-lg bg-card border border-border/50 flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all text-muted-foreground hover:text-primary"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.youtube.com/@DJ-KP0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-lg bg-card border border-border/50 flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all text-muted-foreground hover:text-primary"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a
                  href="https://soundcloud.com/djkpo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-lg bg-card border border-border/50 flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all text-muted-foreground hover:text-primary"
                >
                  <Music2 className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
