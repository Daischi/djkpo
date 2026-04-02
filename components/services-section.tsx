"use client"

import { useEffect, useRef, useState } from "react"
import { Music, Mic2, Radio, Disc3, Sparkles, Waves } from "lucide-react"

const services = [
  {
    icon: Disc3,
    title: "DJ Set",
    description: "Performances ao vivo com os melhores tracks de Techno, Industrial e Underground.",
    features: ["4-8 horas de set", "Equipamento profissional", "Repertório personalizado"],
  },
  {
    icon: Radio,
    title: "Festas & Raves",
    description: "Transforme seu evento em uma experiência única com sets que fazem a pista vibrar.",
    features: ["Clubes e warehouses", "Festivais", "Eventos privados"],
  },
  {
    icon: Mic2,
    title: "Produção Musical",
    description: "Criação de tracks originais e remixes com a assinatura sonora do DJ KPO.",
    features: ["Tracks originais", "Remixes exclusivos", "Edits personalizados"],
  },
  {
    icon: Music,
    title: "Curadoria Musical",
    description: "Seleção e direção musical para eventos que buscam uma identidade sonora marcante.",
    features: ["Line-up completo", "Direção artística", "Consultoria musical"],
  },
]

export function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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

  return (
    <section 
      id="services" 
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-card/30"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 border border-primary/10 rounded-full" />
        <div className="absolute -top-20 -right-20 w-80 h-80 border border-primary/10 rounded-full" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 border border-primary/10 rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 border border-primary/10 rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="text-primary font-mono text-sm tracking-[0.3em] uppercase">
            Serviços
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mt-4">
            <span className="text-foreground">O Que </span>
            <span className="text-primary">Oferecemos</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Experiências sonoras completas para transformar qualquer evento em algo memorável
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`group relative bg-card border border-border/50 rounded-xl p-8 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Hover Glow */}
              <div className="absolute -inset-px bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
            </div>
          ))}
        </div>

        {/* Decorative Element */}
        <div className="flex items-center justify-center mt-16">
          <Waves className="w-8 h-8 text-primary animate-pulse" />
        </div>
      </div>
    </section>
  )
}
