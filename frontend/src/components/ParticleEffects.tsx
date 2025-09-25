import { useEffect, useRef } from 'react'
import { SimplexNoise } from '../utils/SimplexNoise'
import { PropsArray } from '../utils/PropsArray'
import { 
  TAU, 
  cos, 
  sin, 
  rand, 
  randRange, 
  randIn, 
  lerp, 
  fadeInOut
} from '../utils/mathUtils'

interface ParticleEffectsProps {
  colors: string[] | null;
}

const defaultColors = ['#ff9999', '#ffc999', '#fff999', '#c9ff99', '#99ffc9', '#99c9ff', '#c999ff']

const ParticleEffects: React.FC<ParticleEffectsProps> = ({ colors }) => {
  const animationFrameRef = useRef<number | undefined>(undefined)
  const particlesRef = useRef<PropsArray | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const bufferCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const bufferCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const imageBufferRef = useRef<ImageData | null>(null)
  const simplexRef = useRef<SimplexNoise>(new SimplexNoise())
  const tickRef = useRef<number>(0)
  const modeRef = useRef<number>(0)
  const modeStartTimeRef = useRef<number>(Date.now())
  const attractorsRef = useRef<Array<{x: number, y: number, strength: number}>>([])
  const statsRef = useRef<{ fps: number; lastTime: number; frameCount: number }>({
    fps: 0,
    lastTime: performance.now(),
    frameCount: 0
  })

  // Particle system configuration
  const particleCount = 20000
  const particleProps = ['x', 'y', 'vx', 'vy', 'a', 'l', 'ttl', 'vc', 'r', 'g', 'b']
  const noiseSteps = 6

  // Default colors when no colors are provided
  const activeColors = colors && colors.length > 0 ? colors : defaultColors

  // Helper functions
  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [255, 255, 255]
  }

  const outOfBounds = (x: number, y: number, width: number, height: number): boolean => {
    return y < 0 || y >= height || x < 0 || x >= width
  }

  const fillPixel = (imageData: ImageData, i: number, [r, g, b, a]: [number, number, number, number]): void => {
    imageData.data.set([r, g, b, a], i)
  }


  const createParticle = (): number[] => {
    const centerx = window.innerWidth * 0.5
    const centery = window.innerHeight * 0.5
    
    const theta = rand(TAU)
    const rdist = randRange(250)
    const x = centerx + rdist * cos(theta)
    const y = centery + rdist * sin(theta)
    const vx = 0
    const vy = 0
    const l = 0
    const ttl = 100 + rand(200)
    const vc = randIn(1, 10)
    const a = 0

    // Get color from active colors and make it VIVID AF! 🔥
    const colorHex = activeColors[Math.floor(Math.random() * activeColors.length)]
    let [r, g, b] = hexToRgb(colorHex)
    
    // BOOST THE VIVID FACTOR! 
    // Increase saturation and brightness for more POP
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const saturationBoost = 2.2 // MEGA saturation boost
    const brightnessBoost = 1.4 // Brightness boost
    
    // Apply saturation boost - make colors way more intense
    if (max > min) {
      r = min + (r - min) * saturationBoost
      g = min + (g - min) * saturationBoost  
      b = min + (b - min) * saturationBoost
    }
    
    // Apply brightness boost
    r = Math.min(255, r * brightnessBoost)
    g = Math.min(255, g * brightnessBoost)
    b = Math.min(255, b * brightnessBoost)
    
    // Clamp values to valid range
    r = Math.max(0, Math.min(255, r))
    g = Math.max(0, Math.min(255, g))
    b = Math.max(0, Math.min(255, b))

    return [x, y, vx, vy, a, l, ttl, vc, r, g, b]
  }

  const resetParticle = (particles: PropsArray, i: number): void => {
    particles.set(createParticle(), i)
  }

  // Vector field modes - cycles every 15 seconds! 🔥
  const getVectorField = (mode: number, x: number, y: number, tick: number, width: number, height: number): [number, number] => {
    const centerX = width * 0.5
    const centerY = height * 0.5
    const t = tick * 0.01
    
    switch(mode % 8) {
      case 0: // CURL NOISE - Gorgeous swirling turbulence
        const curl1 = simplexRef.current.noise3D(x * 0.003, y * 0.003, t * 0.5) * TAU
        const curl2 = simplexRef.current.noise3D(x * 0.001, y * 0.001, t * 0.2) * TAU * 0.5
        return [cos(curl1 + curl2) * 0.5, sin(curl1 + curl2) * 0.5]
        
      case 1: // GRAVITATIONAL WELLS - Galaxy spiral madness
        const attractors = attractorsRef.current
        if (attractors.length === 0) {
          // Initialize 3 attractors
          for (let i = 0; i < 3; i++) {
            attractors.push({
              x: centerX + cos(i * TAU / 3) * 200,
              y: centerY + sin(i * TAU / 3) * 200,
              strength: 5000
            })
          }
        }
        let gx = 0, gy = 0
        attractors.forEach(attractor => {
          const dx = attractor.x - x
          const dy = attractor.y - y
          const dist = Math.sqrt(dx * dx + dy * dy) + 50
          const force = attractor.strength / (dist * dist)
          gx += (dx / dist) * force * 0.001
          gy += (dy / dist) * force * 0.001
        })
        return [Math.max(-2, Math.min(2, gx)), Math.max(-2, Math.min(2, gy))]
        
      case 2: // STRANGE ATTRACTOR - Lorenz system vibes
        const lorenzX = (x - centerX) * 0.01
        const lorenzY = (y - centerY) * 0.01
        const sigma = 10, rho = 28, beta = 8/3
        const scale = 0.1
        // Balanced Lorenz equations - no systematic bias
        const lx = sigma * (lorenzY - lorenzX) * scale
        const ly = (lorenzX * (rho - 0) - lorenzY) * scale  // Removed lorenzX from rho term to reduce bias
        return [Math.max(-1, Math.min(1, lx)), Math.max(-1, Math.min(1, ly))]
        
      case 3: // VORTEX FLOW - Hypnotic whirlpools
        const vx = x - centerX
        const vy = y - centerY
        const vortexStrength = 0.0005
        const radialPull = -0.0001
        return [
          Math.max(-1, Math.min(1, -vy * vortexStrength + vx * radialPull)),
          Math.max(-1, Math.min(1, vx * vortexStrength + vy * radialPull))
        ]
        
      case 4: // FLOCKING/BOIDS - Organic swarming
        const flockNoise = simplexRef.current.noise3D(x * 0.002, y * 0.002, t * 0.3) * TAU
        const cohesion = [(centerX - x) * 0.0001, (centerY - y) * 0.0001]
        const alignment = [cos(flockNoise) * 0.3, sin(flockNoise) * 0.3]
        const fx = cohesion[0] + alignment[0]
        const fy = cohesion[1] + alignment[1]
        return [Math.max(-1, Math.min(1, fx)), Math.max(-1, Math.min(1, fy))]
        
      case 5: // ELECTROMAGNETIC FIELD - Electric field lines
        const charge1X = centerX - 150, charge1Y = centerY
        const charge2X = centerX + 150, charge2Y = centerY
        const d1x = x - charge1X, d1y = y - charge1Y
        const d2x = x - charge2X, d2y = y - charge2Y
        const dist1 = Math.sqrt(d1x * d1x + d1y * d1y) + 50
        const dist2 = Math.sqrt(d2x * d2x + d2y * d2y) + 50
        const field1 = 500 / (dist1 * dist1)
        const field2 = -500 / (dist2 * dist2)
        const ex = (d1x / dist1) * field1 * 0.01 + (d2x / dist2) * field2 * 0.01
        const ey = (d1y / dist1) * field1 * 0.01 + (d2y / dist2) * field2 * 0.01
        return [Math.max(-1, Math.min(1, ex)), Math.max(-1, Math.min(1, ey))]
        
      case 6: // REACTION-DIFFUSION - Turing patterns
        const rdScale = 0.005
        const u = simplexRef.current.noise3D(x * rdScale, y * rdScale, t * 0.1)
        const v = simplexRef.current.noise3D(x * rdScale * 2, y * rdScale * 2, t * 0.1)
        const Du = 0.16, Dv = 0.08, f = 0.035, k = 0.065
        const laplacianU = simplexRef.current.noise3D(x * rdScale * 1.1, y * rdScale * 1.1, t * 0.1) - u
        const laplacianV = simplexRef.current.noise3D(x * rdScale * 2.1, y * rdScale * 2.1, t * 0.1) - v
        const dudt = Du * laplacianU - u * v * v + f * (1 - u)
        const dvdt = Dv * laplacianV + u * v * v - (f + k) * v
        return [Math.max(-1, Math.min(1, dudt * 5)), Math.max(-1, Math.min(1, dvdt * 5))]
        
      case 7: // POLAR MANDALA - Rose curves and spirals
        const polarX = x - centerX
        const polarY = y - centerY
        const r = Math.sqrt(polarX * polarX + polarY * polarY)
        const theta = Math.atan2(polarY, polarX)
        const petals = 5 // number of petals
        const roseR = cos(petals * theta) * 100
        const targetX = centerX + roseR * cos(theta)
        const targetY = centerY + roseR * sin(theta)
        const mx = (targetX - x) * 0.0005
        const my = (targetY - y) * 0.0005
        return [Math.max(-1, Math.min(1, mx)), Math.max(-1, Math.min(1, my))]
        
      default:
        return [0, 0]
    }
  }

  const updatePixelCoords = (x: number, y: number, vx: number, vy: number, vc: number, tick: number, width: number, height: number): [number, number, number, number] => {
    // Check if we should switch modes (every 15 seconds)
    const now = Date.now()
    if (now - modeStartTimeRef.current > 15000) {
      modeRef.current = (modeRef.current + 1) % 8
      modeStartTimeRef.current = now
      // Reset attractors when switching modes
      attractorsRef.current = []
      console.log(`🎨 Switching to mode ${modeRef.current}`)
    }
    
    // Get vector field for current mode
    const [fieldX, fieldY] = getVectorField(modeRef.current, x, y, tick, width, height)
    
    // Add some base noise for organic feel
    const baseNoise = simplexRef.current.noise3D(x * 0.002, y * 0.002, tick * 0.0003) * TAU
    const noiseX = cos(baseNoise) * vc * 0.1
    const noiseY = sin(baseNoise) * vc * 0.1
    
    // Combine field with noise - increased responsiveness
    const newVx = lerp(vx, fieldX + noiseX, 0.08)
    const newVy = lerp(vy, fieldY + noiseY, 0.08)
    
    return [x + newVx, y + newVy, newVx, newVy]
  }

  const updatePixelAlpha = (l: number, ttl: number): [number, number] => {
    const newL = l + 1
    // Boost alpha for more vivid, intense colors
    const baseAlpha = fadeInOut(newL, ttl) * 255
    const boostedAlpha = Math.min(255, baseAlpha * 1.6) // More intense alpha
    return [newL, boostedAlpha]
  }

  const updateParticles = (particles: PropsArray, imageBuffer: ImageData, width: number, height: number, tick: number): void => {
    imageBuffer.data.fill(0)

    particles.forEach(([x, y, vx, vy, , l, ttl, vc, r, g, b], index) => {
      const [newL, newA] = updatePixelAlpha(l, ttl)

      if (newL < ttl && !outOfBounds(x, y, width, height)) {
        const [newX, newY, newVx, newVy] = updatePixelCoords(x, y, vx, vy, vc, tick, width, height)
        
        // Clamp coordinates to valid bounds
        const clampedX = Math.max(0, Math.min(width - 1, newX))
        const clampedY = Math.max(0, Math.min(height - 1, newY))
        
        particles.set([clampedX, clampedY, newVx, newVy, newA, newL], index)
        
        // Safe pixel index calculation
        const pixelX = Math.floor(clampedX)
        const pixelY = Math.floor(clampedY)
        if (pixelX >= 0 && pixelX < width && pixelY >= 0 && pixelY < height) {
          const i = 4 * (pixelX + pixelY * width)
          fillPixel(imageBuffer, i, [r, g, b, newA])
        }
      } else {
        resetParticle(particles, index)
      }
    })
  }

  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, width, height)
  }

  const renderFrame = (ctx: CanvasRenderingContext2D, bufferCanvas: HTMLCanvasElement): void => {
    ctx.save()

    // First pass: blur and brighten
    ctx.filter = 'blur(4px) brightness(150%)'
    ctx.drawImage(bufferCanvas, 0, 0)

    // Second pass: additive blend with saturation
    ctx.globalCompositeOperation = 'lighter'
    ctx.filter = 'saturate(200%)'
    ctx.drawImage(bufferCanvas, 0, 0)

    ctx.restore()
  }

  useEffect(() => {
    // Create canvases
    const mainCanvas = document.createElement('canvas')
    const bufferCanvas = document.createElement('canvas')
    
    mainCanvas.style.position = 'fixed'
    mainCanvas.style.top = '0'
    mainCanvas.style.left = '0'
    mainCanvas.style.width = '100%'
    mainCanvas.style.height = '100%'
    mainCanvas.style.zIndex = '-1'
    mainCanvas.style.background = 'transparent'
    
    const ctx = mainCanvas.getContext('2d')
    const bufferCtx = bufferCanvas.getContext('2d')
    
    if (!ctx || !bufferCtx) return

    canvasRef.current = mainCanvas
    bufferCanvasRef.current = bufferCanvas
    ctxRef.current = ctx
    bufferCtxRef.current = bufferCtx

    // Add main canvas to DOM
    document.body.appendChild(mainCanvas)

    const resize = (): void => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      mainCanvas.width = width
      mainCanvas.height = height
      bufferCanvas.width = width
      bufferCanvas.height = height
      
      imageBufferRef.current = bufferCtx.createImageData(width, height)
    }

    const setup = (): void => {
      resize()
      
      // Create particles
      const particles = new PropsArray(particleCount, particleProps)
      particles.map(() => createParticle())
      particlesRef.current = particles
    }

    const animate = (): void => {
      const particles = particlesRef.current
      const imageBuffer = imageBufferRef.current
      
      if (!particles || !imageBuffer || !ctx || !bufferCtx) return

      try {
        // Update stats
        const now = performance.now()
        const stats = statsRef.current
        stats.frameCount++
        if (now - stats.lastTime >= 1000) {
          stats.fps = stats.frameCount
          stats.frameCount = 0
          stats.lastTime = now
          console.log(`FPS: ${stats.fps}`)
        }

        tickRef.current++
        
        // Update particles
        updateParticles(particles, imageBuffer, mainCanvas.width, mainCanvas.height, tickRef.current)
        
        // Draw to buffer
        bufferCtx.putImageData(imageBuffer, 0, 0)
        
        // Clear main canvas
        drawBackground(ctx, mainCanvas.width, mainCanvas.height)
        
        // Render with effects
        renderFrame(ctx, bufferCanvas)

      animationFrameRef.current = requestAnimationFrame(animate)
      } catch (error) {
        console.error('Animation error:', error)
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }

    const handleResize = (): void => {
      resize()
    }

    // Initialize
    setup()

    // Set up event listeners
    window.addEventListener('resize', handleResize)

    // Start animation
    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      window.removeEventListener('resize', handleResize)
      
      // Clean up canvas
      if (mainCanvas && mainCanvas.parentNode) {
        mainCanvas.parentNode.removeChild(mainCanvas)
      }
    }
  }, [activeColors])

  return null // Canvas is created and managed in useEffect
}

export default ParticleEffects