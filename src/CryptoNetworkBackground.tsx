import React, { useEffect, useRef } from "react"

const NODES = 28
const COIN_NODES = 6
const COLORS = ["#002868", "#bf0a30", "#fff"]
const COIN_SYMBOLS = ["$", "T"]

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a)
}

const CryptoNetworkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Regular nodes
  const nodes = useRef(
    Array.from({ length: NODES }, () => ({
      x: randomBetween(0, 1),
      y: randomBetween(0, 1),
      vx: randomBetween(-0.01, 0.01),
      vy: randomBetween(-0.01, 0.01),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      radius: randomBetween(2, 4),
      pulse: Math.random() > 0.7,
    }))
  )
  // Coin nodes (orbiting)
  const coins = useRef(
    Array.from({ length: COIN_NODES }, (_, i) => ({
      angle: randomBetween(0, Math.PI * 2),
      radius: randomBetween(60, 120),
      centerX: 0.5 + randomBetween(-0.1, 0.1),
      centerY: 0.5 + randomBetween(-0.1, 0.1),
      color: COLORS[i % COLORS.length],
      symbol: COIN_SYMBOLS[i % COIN_SYMBOLS.length],
      size: randomBetween(18, 28),
      speed: randomBetween(0.003, 0.008),
    }))
  )
  // Sparkles
  const sparkles = useRef<{ x: number; y: number; alpha: number; t: number }[]>(
    []
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    let width = window.innerWidth
    let height = window.innerHeight
    let animationId: number

    function resize() {
      if (!canvas) return
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    window.addEventListener("resize", resize)
    resize()

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      // Draw network lines
      for (let i = 0; i < NODES; i++) {
        for (let j = i + 1; j < NODES; j++) {
          const a = nodes.current[i]
          const b = nodes.current[j]
          const dx = (a.x - b.x) * width
          const dy = (a.y - b.y) * height
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 160) {
            ctx.save()
            ctx.globalAlpha = 0.13 + 0.22 * (1 - dist / 160)
            ctx.strokeStyle = a.color === b.color ? a.color : "#fff"
            ctx.lineWidth = 2
            if ((i + j) % 3 === 0) {
              ctx.setLineDash([8, 8]) // Dashed for "tariff" effect
            } else {
              ctx.setLineDash([])
            }
            ctx.beginPath()
            ctx.moveTo(a.x * width, a.y * height)
            ctx.lineTo(b.x * width, b.y * height)
            ctx.stroke()
            ctx.setLineDash([])
            ctx.restore()
          }
        }
      }
      // Draw regular nodes (some pulsing)
      for (const node of nodes.current) {
        ctx.save()
        ctx.beginPath()
        let r = node.radius
        if (node.pulse) {
          r = r + Math.sin(Date.now() / 400 + r * 10) * 1.2
        }
        ctx.arc(node.x * width, node.y * height, r, 0, 2 * Math.PI)
        ctx.shadowColor = node.color
        ctx.shadowBlur = 14
        ctx.fillStyle = node.color
        ctx.globalAlpha = 0.8
        ctx.fill()
        ctx.restore()
      }
      // Draw orbiting coin nodes
      for (const coin of coins.current) {
        const x = coin.centerX * width + Math.cos(coin.angle) * coin.radius
        const y = coin.centerY * height + Math.sin(coin.angle) * coin.radius
        ctx.save()
        ctx.beginPath()
        ctx.arc(x, y, coin.size, 0, 2 * Math.PI)
        ctx.shadowColor = coin.color
        ctx.shadowBlur = 32
        ctx.fillStyle = coin.color
        ctx.globalAlpha = 0.92
        ctx.fill()
        // Draw coin symbol
        ctx.font = `${coin.size * 1.1}px Arial Black, Arial, sans-serif`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.globalAlpha = 1
        ctx.fillStyle = "#fff"
        ctx.strokeStyle = "#002868"
        ctx.lineWidth = 2
        ctx.strokeText(coin.symbol, x, y)
        ctx.fillText(coin.symbol, x, y)
        ctx.restore()
      }
      // Draw sparkles
      for (const s of sparkles.current) {
        ctx.save()
        ctx.globalAlpha = s.alpha
        ctx.beginPath()
        ctx.arc(
          s.x * width,
          s.y * height,
          2 + Math.sin(s.t * 8) * 1.2,
          0,
          2 * Math.PI
        )
        ctx.fillStyle = "#fff"
        ctx.shadowColor = "#fff"
        ctx.shadowBlur = 12
        ctx.fill()
        ctx.restore()
      }
    }

    function animate() {
      // Move nodes
      for (const node of nodes.current) {
        node.x += node.vx * 0.5
        node.y += node.vy * 0.5
        if (node.x < 0 || node.x > 1) node.vx *= -1
        if (node.y < 0 || node.y > 1) node.vy *= -1
        node.x = Math.max(0, Math.min(1, node.x))
        node.y = Math.max(0, Math.min(1, node.y))
      }
      // Move coins in orbits
      for (const coin of coins.current) {
        coin.angle += coin.speed
      }
      // Sparkles: randomly add, animate, and remove
      if (Math.random() < 0.07 && sparkles.current.length < 18) {
        sparkles.current.push({
          x: randomBetween(0.05, 0.95),
          y: randomBetween(0.05, 0.95),
          alpha: 1,
          t: Math.random() * Math.PI * 2,
        })
      }
      for (const s of sparkles.current) {
        s.alpha -= 0.012
        s.t += 0.04
      }
      sparkles.current = sparkles.current.filter((s) => s.alpha > 0)
      draw()
      animationId = requestAnimationFrame(animate)
    }
    animate()
    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className='fixed inset-0 w-full h-full -z-50'
      style={{ pointerEvents: "none" }}
    />
  )
}

export default CryptoNetworkBackground
