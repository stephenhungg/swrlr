/**
 * SVG Path Parser for Particle Force Vectors
 * Converts SVG paths into points for particle attraction
 */

export interface PathPoint {
  x: number
  y: number
}

export class SVGPathParser {
  /**
   * Parse SVG path string into array of points
   */
  static parsePathToPoints(pathString: string, numPoints: number = 50): PathPoint[] {
    if (!pathString || pathString.trim() === '') {
      console.log('⚠️ Empty SVG path string')
      return []
    }

    try {
      console.log('🔧 Parsing SVG path:', pathString)
      
      // Create a temporary SVG element to use browser's path parsing
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('width', '100')
      svg.setAttribute('height', '100')
      svg.style.position = 'absolute'
      svg.style.top = '-1000px'
      svg.style.left = '-1000px'
      
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', pathString)
      svg.appendChild(path)
      document.body.appendChild(svg)

      const pathLength = path.getTotalLength()
      console.log('📏 Path length:', pathLength)
      
      const points: PathPoint[] = []

      // Sample points along the path
      for (let i = 0; i <= numPoints; i++) {
        const distance = (i / numPoints) * pathLength
        const point = path.getPointAtLength(distance)
        points.push({ x: point.x, y: point.y })
      }

      console.log('✅ Generated', points.length, 'points from SVG path')
      console.log('🎯 First few points:', points.slice(0, 3))

      // Clean up
      document.body.removeChild(svg)
      return points

    } catch (error) {
      console.error('❌ Failed to parse SVG path:', pathString, error)
      return []
    }
  }

  /**
   * Get force vector towards the nearest point on the SVG path
   */
  static getForceVector(
    particleX: number, 
    particleY: number, 
    pathPoints: PathPoint[], 
    canvasWidth: number, 
    canvasHeight: number,
    forceStrength: number = 0.5
  ): [number, number] {
    if (pathPoints.length === 0) {
      return [0, 0]
    }

    // Convert particle position to SVG coordinate system (0-100)
    const svgX = (particleX / canvasWidth) * 100
    const svgY = (particleY / canvasHeight) * 100

    // Find closest point on path
    let closestPoint = pathPoints[0]
    let minDistance = Infinity

    for (const point of pathPoints) {
      const dx = point.x - svgX
      const dy = point.y - svgY
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < minDistance) {
        minDistance = distance
        closestPoint = point
      }
    }

    // Calculate force vector
    const dx = closestPoint.x - svgX
    const dy = closestPoint.y - svgY
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance === 0) {
      return [0, 0]
    }

    // Stronger force with better scaling
    const forceMagnitude = Math.min(forceStrength / Math.max(distance, 1), 2.0)
    const forceX = (dx / distance) * forceMagnitude
    const forceY = (dy / distance) * forceMagnitude

    // Convert back to canvas coordinates with proper scaling
    return [forceX * 0.1, forceY * 0.1]
  }

  /**
   * Create simple fallback shapes if SVG parsing fails
   */
  static createFallbackShape(type: 'circle' | 'square' | 'triangle' = 'circle'): PathPoint[] {
    const points: PathPoint[] = []
    const numPoints = 20

    switch (type) {
      case 'circle':
        for (let i = 0; i < numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2
          points.push({
            x: 50 + Math.cos(angle) * 30,
            y: 50 + Math.sin(angle) * 30
          })
        }
        break

      case 'square':
        // Square perimeter
        const sideLength = 60
        const pointsPerSide = numPoints / 4
        
        // Top side
        for (let i = 0; i < pointsPerSide; i++) {
          points.push({ x: 20 + (i / pointsPerSide) * sideLength, y: 20 })
        }
        // Right side
        for (let i = 0; i < pointsPerSide; i++) {
          points.push({ x: 80, y: 20 + (i / pointsPerSide) * sideLength })
        }
        // Bottom side
        for (let i = 0; i < pointsPerSide; i++) {
          points.push({ x: 80 - (i / pointsPerSide) * sideLength, y: 80 })
        }
        // Left side
        for (let i = 0; i < pointsPerSide; i++) {
          points.push({ x: 20, y: 80 - (i / pointsPerSide) * sideLength })
        }
        break

      case 'triangle':
        const trianglePoints = [
          { x: 50, y: 20 },
          { x: 80, y: 80 },
          { x: 20, y: 80 }
        ]
        
        for (let i = 0; i < numPoints; i++) {
          const segment = Math.floor(i / (numPoints / 3))
          const t = (i % (numPoints / 3)) / (numPoints / 3)
          const start = trianglePoints[segment]
          const end = trianglePoints[(segment + 1) % 3]
          
          points.push({
            x: start.x + (end.x - start.x) * t,
            y: start.y + (end.y - start.y) * t
          })
        }
        break
    }

    return points
  }
}
