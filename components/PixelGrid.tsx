import React, { useEffect, useRef, useState } from "react";

interface PixelGridProps {
  bgColor?: string
  pixelColor?: string
  numPixelsX?: number
  numPixelsY?: number
  pixelSize?: number
  pixelSpacing?: number
  pixelDeathFade?: number
  pixelBornFade?: number
  pixelMaxLife?: number
  pixelMinLife?: number
  pixelMaxOffLife?: number
  pixelMinOffLife?: number
  className?: string
  glow?: boolean
}

interface Pixel {
  xPos: number
  yPos: number
  alpha: number
  maxAlpha: number
  life: number
  offLife: number
  isLit: boolean
  dying: boolean
  deathFade: number
  bornFade: number
  randomizeSelf: () => void
}

export function PixelGrid({
  bgColor = "transparent",
  pixelColor = "#0000ff",
  numPixelsX = 10,
  numPixelsY = 10,
  pixelSize = 6,
  pixelSpacing = 4,
  pixelDeathFade = 15,
  pixelBornFade = 15,
  pixelMaxLife = 300,
  pixelMinLife = 150,
  pixelMaxOffLife = 300,
  pixelMinOffLife = 100,
  glow = false,
  className = "",
}: PixelGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pixelsRef = useRef<Pixel[]>([])
  const [isAppeared, setIsAppeared] = useState(false)

  const hexToRgb = (hex: string) => {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const c2d = canvas.getContext("2d", { alpha: true })
    if (!c2d) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initPixels()
    }

    window.addEventListener("resize", resizeCanvas)
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const randomAlpha = () => {
      const rand = Math.random() * 100
      if (rand > 90) return 1
      if (rand > 75) return 0.6
      return 0.2
    }

    const randomizePixelAttrs = (x: number, y: number): Pixel => {
      const alpha = randomAlpha()
      const lit = alpha > 0.1
      return {
        xPos: x * (pixelSize + pixelSpacing),
        yPos: y * (pixelSize + pixelSpacing),
        alpha: 0,
        maxAlpha: alpha,
        life: Math.floor(Math.random() * (pixelMaxLife - pixelMinLife + 1)) + pixelMinLife,
        offLife: Math.floor(Math.random() * (pixelMaxOffLife - pixelMinOffLife + 1)) + pixelMinOffLife,
        isLit: lit,
        dying: false,
        deathFade: pixelDeathFade,
        bornFade: pixelBornFade,
        randomizeSelf() {
          const newAlpha = randomAlpha()
          this.alpha = 0
          this.maxAlpha = newAlpha
          this.life = Math.floor(Math.random() * (pixelMaxLife - pixelMinLife + 1)) + pixelMinLife
          this.offLife = Math.floor(Math.random() * (pixelMaxOffLife - pixelMinOffLife + 1)) + pixelMinOffLife
          this.isLit = newAlpha > 0.1
          this.dying = false
          this.deathFade = pixelDeathFade
          this.bornFade = pixelBornFade
        },
      }
    }

    const initPixels = () => {
      const cols = Math.ceil(window.innerWidth / (pixelSize + pixelSpacing))
      const rows = Math.ceil(window.innerHeight / (pixelSize + pixelSpacing))
      pixelsRef.current = []
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          pixelsRef.current.push(randomizePixelAttrs(x, y))
        }
      }
    }

    initPixels()
    setIsAppeared(true)

    const rgb = hexToRgb(pixelColor) || { r: 255, g: 255, b: 255 };

    const drawPixel = (pixel: Pixel) => {
      if (pixel.isLit) {
        if (pixel.bornFade > 0) {
          pixel.alpha = pixel.maxAlpha - (pixel.bornFade / pixelBornFade) * pixel.maxAlpha
          pixel.bornFade--
        } else {
          if (pixel.life <= 0) {
            pixel.dying = true
            if (pixel.deathFade <= 0) {
              pixel.randomizeSelf()
            } else {
              pixel.alpha = (pixel.deathFade / pixelDeathFade) * pixel.maxAlpha
              pixel.deathFade--
            }
          } else {
            pixel.alpha = pixel.maxAlpha
            pixel.life--
          }
        }
      } else {
        if (pixel.offLife <= 0) {
           pixel.isLit = true
           pixel.bornFade = pixelBornFade
        }
        pixel.offLife--
        pixel.alpha = 0;
      }

      if (pixel.alpha > 0.01) {
        c2d.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${pixel.alpha})`
        c2d.fillRect(pixel.xPos, pixel.yPos, pixelSize, pixelSize)
      }
    }

    const renderLoop = () => {
      if (!canvasRef.current) return;
      
      if (bgColor === "transparent") {
        c2d.clearRect(0, 0, canvas.width, canvas.height)
      } else {
        c2d.fillStyle = bgColor
        c2d.fillRect(0, 0, canvas.width, canvas.height)
      }

      if (glow) {
        c2d.shadowBlur = 10
        c2d.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`
      } else {
        c2d.shadowBlur = 0
      }

      for (const pixel of pixelsRef.current) {
        drawPixel(pixel)
      }
      requestAnimationFrame(renderLoop)
    }

    const animationId = requestAnimationFrame(renderLoop)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [bgColor, pixelColor, pixelSize, pixelSpacing, pixelDeathFade, pixelBornFade, pixelMaxLife, pixelMinLife, pixelMaxOffLife, pixelMinOffLife, glow])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${className}`}
      style={{
        display: "block",
        backgroundColor: bgColor,
        width: "100vw",
        height: "100vh",
      }}
    />
  )
}