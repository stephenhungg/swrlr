/**
 * Mathematical utility functions for particle systems
 */

// Constants
export const TAU = Math.PI * 2
export const PI = Math.PI

// Basic math functions
export const cos = Math.cos
export const sin = Math.sin
export const sqrt = Math.sqrt
export const abs = Math.abs
export const floor = Math.floor
export const ceil = Math.ceil
export const round = Math.round
export const min = Math.min
export const max = Math.max

// Random number utilities
export function rand(max = 1): number {
  return Math.random() * max
}

export function randRange(range: number): number {
  return Math.random() * range
}

export function randIn(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

export function randInt(max: number): number {
  return Math.floor(Math.random() * max)
}

export function randIntIn(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min))
}

// Interpolation
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

// Easing functions
export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

export function easeIn(t: number): number {
  return t * t
}

export function easeOut(t: number): number {
  return t * (2 - t)
}

// Fade functions for particles
export function fadeIn(life: number, totalLife: number): number {
  const t = life / totalLife
  return Math.min(1, t * 4) // Fade in over first 25% of life
}

export function fadeOut(life: number, totalLife: number): number {
  const t = life / totalLife
  return Math.max(0, 1 - Math.pow(t, 2)) // Fade out with quadratic curve
}

export function fadeInOut(life: number, totalLife: number): number {
  const t = life / totalLife
  if (t < 0.1) {
    return t / 0.1 // Fade in over first 10%
  } else if (t > 0.7) {
    return (1 - t) / 0.3 // Fade out over last 30%
  } else {
    return 1 // Full opacity in middle
  }
}

// Distance and vector utilities
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.sqrt(dx * dx + dy * dy)
}

export function distanceSquared(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1
  const dy = y2 - y1
  return dx * dx + dy * dy
}

export function normalize(x: number, y: number): [number, number] {
  const length = Math.sqrt(x * x + y * y)
  if (length === 0) return [0, 0]
  return [x / length, y / length]
}

export function magnitude(x: number, y: number): number {
  return Math.sqrt(x * x + y * y)
}

// Angle utilities
export function angleFromVector(x: number, y: number): number {
  return Math.atan2(y, x)
}

export function vectorFromAngle(angle: number): [number, number] {
  return [Math.cos(angle), Math.sin(angle)]
}

// Clamping and mapping
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function map(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin))
}

// Canvas utilities
export function createRenderingContext(): { buffer: CanvasRenderingContext2D; ctx: CanvasRenderingContext2D } {
  // Create main canvas
  const canvas = document.createElement('canvas')
  canvas.style.position = 'fixed'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.zIndex = '-1'
  canvas.style.background = 'transparent'
  
  // Create buffer canvas
  const bufferCanvas = document.createElement('canvas')
  
  // Get contexts
  const ctx = canvas.getContext('2d')!
  const buffer = bufferCanvas.getContext('2d')!
  
  // Add main canvas to DOM
  document.body.appendChild(canvas)
  
  return { buffer, ctx }
}
