"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Volume2 } from "lucide-react"

const videos = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202026-03-17%20at%2010.33.30-ixl5OFgU4CL8vLKgE35FdgwNWnvSiU.mp4",
    title: "Underground Techno Set",
    description: "Performance ao vivo em warehouse party",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202026-03-17%20at%2010.32.56-jp78xvvJf2O4U5Pid2KY6BO6I1oFlq.mp4",
    title: "Industrial Mix Session",
    description: "Set especial de hard techno",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202026-03-17%20at%2010.42.19-lH2QPq8QkfG7n7ijd7Gd39Q1BrxF5L.mp4",
    title: "Live DJ Set",
    description: "Festival performance",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202026-03-17%20at%2010.33.53-aF3GHls0WVXw3onVveqggb8jwg8QKc.mp4",
    title: "Warehouse Techno",
    description: "Rave underground",
  },
]

export function VideosSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleVideoClick = (index: number) => {
    const video = videoRefs.current[index]
    if (!video) return

    if (playingIndex === index) {
      video.pause()
      setPlayingIndex(null)
    } else {
      // Pause any currently playing video
      if (playingIndex !== null && videoRefs.current[playingIndex]) {
        videoRefs.current[playingIndex]?.pause()
      }
      video.play()
      setPlayingIndex(index)
    }
  }

  return (
    <section 
      id="videos" 
      ref={sectionRef}
      className="relative py-24 md:py-32"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Video Container */}
              <div 
                className="relative aspect-video cursor-pointer"
                onClick={() => handleVideoClick(index)}
              >
                <video 
                  ref={(el) => { videoRefs.current[index] = el }}
                  src={video.src}
                  className="w-full h-full object-cover"
                  loop
                  muted={false}
                  playsInline
                  preload="metadata"
                />
                
                {/* Overlay */}
                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
                  playingIndex === index ? 'opacity-0' : 'opacity-100'
                } group-hover:opacity-100`}>
                  <div className={`w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center transform transition-all duration-300 ${
                    playingIndex === index ? 'scale-0' : 'scale-100'
                  } group-hover:scale-110 shadow-lg shadow-primary/50`}>
                    <Play className="w-8 h-8 text-primary-foreground ml-1" />
                  </div>
                </div>

                {/* Playing Indicator */}
                {playingIndex === index && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-primary">
                    <Volume2 className="w-5 h-5 animate-pulse" />
                    <span className="text-sm font-medium">Reproduzindo</span>
                  </div>
                )}

                {/* Border */}
                <div className="absolute inset-0 border border-primary/20 group-hover:border-primary/50 transition-colors duration-300 rounded-xl" />
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
                <p className="text-muted-foreground mt-1">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
