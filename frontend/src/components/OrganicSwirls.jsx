import { useEffect } from 'react'
import './OrganicSwirls.css'

function OrganicSwirls({ colors = null }) {
  useEffect(() => {
    if (colors && colors.length >= 3) {
      // Update CSS custom properties for dynamic color changes
      const root = document.documentElement
      root.style.setProperty('--swirl-color-1', colors[0] || '#ff69b4')
      root.style.setProperty('--swirl-color-2', colors[1] || '#40e0d0')
      root.style.setProperty('--swirl-color-3', colors[2] || '#8a2be2')
      root.style.setProperty('--swirl-color-4', colors[3] || '#ff69b4')
    } else {
      // Reset to default pastels
      const root = document.documentElement
      root.style.setProperty('--swirl-color-1', '#ff69b4')
      root.style.setProperty('--swirl-color-2', '#40e0d0')
      root.style.setProperty('--swirl-color-3', '#8a2be2')
      root.style.setProperty('--swirl-color-4', '#ff69b4')
    }
  }, [colors])

  return (
    <div className="organic-swirls-container">
      <div className="swirl-layer swirl-1"></div>
      <div className="swirl-layer swirl-2"></div>
      <div className="swirl-layer swirl-3"></div>
      <div className="swirl-layer swirl-4"></div>
      <div className="swirl-layer swirl-5"></div>
    </div>
  )
}

export default OrganicSwirls