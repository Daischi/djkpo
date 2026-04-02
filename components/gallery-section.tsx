"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

const galleryItems = [
  {
    type: "video",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202026-03-19%20at%2016.16.19-CWzepZHx8KegYgKr5G9jjGvDWbxqlm.mp4",
    alt: "DJ KPO Live Mix",
    title: "Live Mix Session",
    description: "Energia em cada beat",
    span: "col-span-2 row-span-2",
  },
  {
    type: "image",
    src: "/gallery/dj-mixer.jpg",
    alt: "DJ KPO Mixer Performance",
    title: "Frequency Control",
    description: "Total domínio dos controles",
    span: "col-span-1 row-span-2",
  },
  {
    type: "video",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202026-03-19%20at%2016.18.19-K4DjMxvuuU4ABQzZPa7SMkapYJwZif.mp4",
    alt: "DJ KPO Underground Set",
    title: "Underground Session",
    description: "Pura adrenalina",
    span: "col-span-1 row-span-1",
  },
  {
    type: "image",
    src: "/gallery/dj-hands.jpg",
    alt: "DJ KPO Hands on Deck",
    title: "Hands on Techno",
    description: "Precisão absoluta",
    span: "col-span-1 row-span-1",
  },
];

function VideoItem({
  item,
  isVisible,
  index,
}: {
  item: (typeof galleryItems)[0];
  isVisible: boolean;
  index: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Autoplay quando o vídeo fica visível
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && videoRef.current) {
          videoRef.current.play();
          setIsPlaying(true);
        } else if (!entry.isIntersecting && videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative group overflow-hidden rounded-xl cursor-pointer ${item.span} transition-all duration-700 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={item.src}
        muted={isMuted}
        loop
        playsInline
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
      />

      {/* Overlay with enhanced gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

      {/* Play/Pause Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center transition-all duration-300 ${isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"} group-hover:scale-110`}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-primary-foreground" />
          ) : (
            <Play className="w-8 h-8 text-primary-foreground ml-1" />
          )}
        </div>
      </div>

      {/* Mute Button */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary/50"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-foreground" />
        ) : (
          <Volume2 className="w-5 h-5 text-foreground" />
        )}
      </button>

      {/* Content */}
      <div className="absolute inset-0 flex items-end p-6">
        <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <span className="text-xs font-mono text-primary uppercase tracking-wider">
            Video
          </span>
          <h3 className="text-lg font-bold text-foreground mt-1">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {item.description}
            </p>
          )}
          <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/50 mt-2" />
        </div>
      </div>

      {/* Border Glow */}
      <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 transition-colors duration-300 rounded-xl" />

      {/* Enhanced Neon glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-xl shadow-[0_0_40px_rgba(0,255,100,0.4),inset_0_0_20px_rgba(0,255,100,0.1)]" />
      </div>
    </div>
  );
}

export function GallerySection() {
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
    <section
      id="gallery"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-card/30"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <span className="text-primary font-mono text-sm tracking-[0.3em] uppercase">
            Galeria
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mt-4">
            <span className="text-foreground">Momentos </span>
            <span className="text-primary relative">
              Epicos
              <span className="absolute -inset-2 blur-lg bg-primary/20 -z-10" />
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Registros das performances mais marcantes e da energia que so o DJ
            KPO consegue criar
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[310px]">
          {galleryItems.map((item, index) =>
            item.type === "video" ? (
              <VideoItem
                key={index}
                item={item}
                isVisible={isVisible}
                index={index}
              />
            ) : (
              <div
                key={index}
                className={`relative group overflow-hidden rounded-xl cursor-pointer ${item.span} transition-all duration-700 ${
                  isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                />

                {/* Overlay with enhanced gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Content */}
                <div className="absolute inset-0 flex items-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-xs font-mono text-primary uppercase tracking-wider">
                      Performance
                    </span>
                    <h3 className="text-lg font-bold text-foreground mt-1">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    )}
                    <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/50 mt-2" />
                  </div>
                </div>

                {/* Border Glow */}
                <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 transition-colors duration-300 rounded-xl" />

                {/* Enhanced Neon glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 rounded-xl shadow-[0_0_40px_rgba(0,255,100,0.4),inset_0_0_20px_rgba(0,255,100,0.1)]" />
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
