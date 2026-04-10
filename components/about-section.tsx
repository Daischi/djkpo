"use client";

import { useEffect, useRef, useState } from "react";
import { Headphones, Music, Users, Calendar } from "lucide-react";

const stats = [
  { icon: Calendar, value: "10+", label: "Anos de Experiência" },
  { icon: Users, value: "500+", label: "Shows Realizados" },
  { icon: Headphones, value: "50+", label: "Tracks Produzidas" },
];

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Neon Glow Effects */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div
            className={`relative transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"}`}
          >
            <div className="relative overflow-hidden rounded-lg group">
              <img
                src="/Capo sobre o Artista.jpeg"
                alt="DJ KPO - Frequency Control"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Content */}
          <div
            className={`transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"}`}
          >
            <span className="text-primary font-mono text-sm tracking-[0.3em] uppercase">
              Sobre o Artista
            </span>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mt-4 mb-6">
              <span className="text-foreground">DJ </span>
              <span className="text-primary">KPO</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Com mais de uma década dedicada à música eletrônica,{" "}
              <strong className="text-foreground">DJ KPO</strong> se consolidou
              como uma das referências do cenário brasileiro.
            </p>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              Especialista em{" "}
              <strong className="text-foreground">open format</strong>, com foco
              em <strong className="text-primary">Tech House</strong>,{" "}
              <strong className="text-primary">Afro House</strong> e{" "}
              <strong className="text-primary">Tech House underground</strong>,
              suas performances são conhecidas pela versatilidade, energia e
              pela criação de mashups que tornam cada set único, proporcionando
              uma experiência sonora envolvente ao público.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`group relative bg-card/50 border border-border/50 rounded-lg p-4 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 overflow-hidden ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute -inset-1 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                  <stat.icon className="w-6 h-6 text-primary mb-2 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-2xl md:text-3xl font-black text-foreground relative z-10 group-hover:text-primary transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground relative z-10">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
