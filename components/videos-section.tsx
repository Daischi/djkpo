"use client";

import { useEffect, useRef, useState } from "react";

const videos = [
  {
    id: "udtGzbblnMw",
    title: "Botled Beats Dog - 128 BPM",
    description: "Performance ao vivo em warehouse party",
  },
  {
    id: "C91rM8wemns",
    title: "AFRO HOUSE SET 2 123BPM",
    description: "Set especial de hard techno",
  },
  {
    id: "3YbnPIzKRTg",
    title: "CAPO BEATS SET 5 130 BPM",
    description: "Festival performance",
  },
  {
    id: "Ldxp81hn5l4",
    title: "SEXY MIX TAPE SET 2 100BPM",
    description: "Rave underground",
  },
];

export function VideosSection() {
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
    <section id="videos" ref={sectionRef} className="relative py-24 md:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <span className="text-primary font-mono text-sm tracking-[0.3em] uppercase">
            Performances
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mt-4">
            <span className="text-foreground">Em </span>
            <span className="text-primary">Ação</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Confira alguns momentos das performances mais intensas do DJ KPO
          </p>
        </div>

        {/* Videos Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {videos.map((video, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-xl bg-card transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* YouTube iframe */}
              <div className="relative aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}?rel=0`}
                  title={video.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                {/* Border */}
                <div className="absolute inset-0 border border-primary/20 group-hover:border-primary/50 transition-colors duration-300 rounded-xl pointer-events-none" />
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
