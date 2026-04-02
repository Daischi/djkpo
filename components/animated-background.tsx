"use client"

import { useEffect, useRef } from "react"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []
    let waveOffset = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      pulse: number
      pulseSpeed: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.opacity = Math.random() * 0.5 + 0.2
        this.pulse = 0
        this.pulseSpeed = Math.random() * 0.02 + 0.01
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        this.pulse += this.pulseSpeed

        if (this.x < 0) this.x = canvas.width
        if (this.x > canvas.width) this.x = 0
        if (this.y < 0) this.y = canvas.height
        if (this.y > canvas.height) this.y = 0
      }

      draw() {
        if (!ctx) return
        const pulseFactor = Math.sin(this.pulse) * 0.3 + 0.7
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size * pulseFactor, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 255, 100, ${this.opacity * pulseFactor})`
        ctx.fill()

        // Glow effect
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size * 3 * pulseFactor, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 255, 100, ${this.opacity * 0.1 * pulseFactor})`
        ctx.fill()
      }
    }

    // Initialize particles
    for (let i = 0; i < 80; i++) {
      particles.push(new Particle())
    }

    const drawWaveform = () => {
      if (!ctx) return
      
      ctx.beginPath()
      ctx.strokeStyle = "rgba(0, 255, 100, 0.3)"
      ctx.lineWidth = 2

      const centerY = canvas.height / 2
      const amplitude = 50
      const frequency = 0.02

      for (let x = 0; x < canvas.width; x++) {
        const y = centerY + 
          Math.sin(x * frequency + waveOffset) * amplitude +
          Math.sin(x * frequency * 2 + waveOffset * 1.5) * (amplitude * 0.5) +
          Math.sin(x * frequency * 0.5 + waveOffset * 0.5) * (amplitude * 0.3)
        
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()

      // Second waveform
      ctx.beginPath()
      ctx.strokeStyle = "rgba(0, 255, 100, 0.15)"
      for (let x = 0; x < canvas.width; x++) {
        const y = centerY + 
          Math.sin(x * frequency * 1.5 - waveOffset) * (amplitude * 0.7) +
          Math.sin(x * frequency * 3 - waveOffset * 2) * (amplitude * 0.3)
        
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
    }

    const drawGrid = () => {
      if (!ctx) return
      
      ctx.strokeStyle = "rgba(0, 255, 100, 0.05)"
      ctx.lineWidth = 1

      const gridSize = 50
      const offsetX = (waveOffset * 10) % gridSize
      const offsetY = (waveOffset * 5) % gridSize

      // Vertical lines
      for (let x = -gridSize + offsetX; x < canvas.width + gridSize; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = -gridSize + offsetY; y < canvas.height + gridSize; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    const drawEqualizer = () => {
      if (!ctx) return
      
      const barCount = 64
      const barWidth = canvas.width / barCount
      const maxHeight = 100

      for (let i = 0; i < barCount; i++) {
        const height = Math.abs(Math.sin(i * 0.3 + waveOffset * 3)) * maxHeight
        const x = i * barWidth
        
        const gradient = ctx.createLinearGradient(x, canvas.height, x, canvas.height - height)
        gradient.addColorStop(0, "rgba(0, 255, 100, 0.4)")
        gradient.addColorStop(1, "rgba(0, 255, 100, 0)")
        
        ctx.fillStyle = gradient
        ctx.fillRect(x, canvas.height - height, barWidth - 2, height)
      }

      // Top equalizer
      for (let i = 0; i < barCount; i++) {
        const height = Math.abs(Math.sin(i * 0.3 + waveOffset * 2 + Math.PI)) * (maxHeight * 0.5)
        const x = i * barWidth
        
        const gradient = ctx.createLinearGradient(x, 0, x, height)
        gradient.addColorStop(0, "rgba(0, 255, 100, 0.3)")
        gradient.addColorStop(1, "rgba(0, 255, 100, 0)")
        
        ctx.fillStyle = gradient
        ctx.fillRect(x, 0, barWidth - 2, height)
      }
    }

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      drawGrid()
      drawWaveform()
      drawEqualizer()

      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      // Draw connections between close particles
      ctx.strokeStyle = "rgba(0, 255, 100, 0.1)"
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      waveOffset += 0.02
      animationFrameId = requestAnimationFrame(animate)
    }

    // Clear canvas once at start
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-60"
      style={{ background: "transparent" }}
    />
  )
}
