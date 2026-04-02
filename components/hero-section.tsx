"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Play, Instagram, Youtube, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [glitchText, setGlitchText] = useState("KPO");
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const glitchChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?";
    const originalText = "KPO";

    const interval = setInterval(() => {
      const shouldGlitch = Math.random() > 0.5;
      if (shouldGlitch) {
        setGlitchActive(true);
        let glitched = "";
        for (let i = 0; i < originalText.length; i++) {
          if (Math.random() > 0.5) {
            glitched +=
              glitchChars[Math.floor(Math.random() * glitchChars.length)];
          } else {
            glitched += originalText[i];
          }
        }
        setGlitchText(glitched);
        setTimeout(() => {
          setGlitchText(originalText);
          setGlitchActive(false);
        }, 150);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202026-03-17%20at%2010.42.19-lH2QPq8QkfG7n7ijd7Gd39Q1BrxF5L.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
      </div>

      {/* Animated Scanlines */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-30">
        <div
          className="w-full h-full animate-scanline"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.05) 2px, rgba(0,255,0,0.05) 4px)",
          }}
        />
      </div>

      {/* Glitch overlay */}
      <div
        className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-100 ${glitchActive ? "opacity-30" : "opacity-0"}`}
      >
        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(0,255,0,0.1) 0px, rgba(0,255,0,0.1) 1px, transparent 1px, transparent 3px)",
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div
        className={`relative z-20 text-center px-4 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="mb-4">
          <span className="text-primary font-mono text-sm md:text-base tracking-[0.3em] uppercase animate-pulse">
            Frequency Control
          </span>
        </div>

        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-6 relative">
          <span className="font-[var(--font-orbitron)] tracking-wider text-foreground relative inline-block">
            DJ{" "}
            <span className="text-primary relative">
              {glitchText}
              <span className="absolute -inset-1 blur-xl bg-primary/30 -z-10" />
            </span>
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-2 tracking-widest font-light">
          TECHNO / INDUSTRIAL / UNDERGROUND
        </p>

        <div className="flex items-center justify-center gap-2 text-primary mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary" />
          <Music className="w-5 h-5" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary" />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button
            size="lg"
            className="group relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-bold tracking-wider"
            onClick={() => router.push("/contrato")}
          >
            <span className="relative z-10 flex items-center gap-2">
              CONTRATAR AGORA
              <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-neon-green to-primary bg-[length:200%_100%] animate-shimmer" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="border-primary/50 text-primary hover:bg-primary/10 px-8 py-6 text-lg tracking-wider"
            onClick={() =>
              document
                .getElementById("videos")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            VER PERFORMANCES
          </Button>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-6">
          <a
            href="https://www.instagram.com/leocapovilla/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 transform duration-200"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a
            href="https://www.youtube.com/@DJ-KP0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 transform duration-200"
          >
            <Youtube className="w-6 h-6" />
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-primary animate-bounce cursor-pointer"
        aria-label="Rolar para baixo"
      >
        <ChevronDown className="w-8 h-8" />
      </button>

      {/* Corner Decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/50 z-20" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-primary/50 z-20" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-primary/50 z-20" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary/50 z-20" />
    </section>
  );
}
