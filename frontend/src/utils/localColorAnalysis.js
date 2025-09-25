// Local keyword-to-color mapping for immediate response
const colorKeywords = {
  // Nature & Environments
  'ocean': ['#006994', '#47b5ff', '#06ffa5'],
  'sea': ['#006994', '#47b5ff', '#06ffa5'],
  'water': ['#4A90E2', '#6BB6FF', '#A8E6CF'],
  'sunset': ['#ff6b6b', '#ffa500', '#ffff66'],
  'sunrise': ['#FFB347', '#FF6B6B', '#FFA500'],
  'forest': ['#2d5016', '#68bb59', '#90ee90'],
  'tree': ['#2d5016', '#68bb59', '#90ee90'],
  'mountain': ['#8B7355', '#A0522D', '#DEB887'],
  'desert': ['#F4A460', '#D2B48C', '#FFE4B5'],
  'sky': ['#87CEEB', '#4682B4', '#B0E0E6'],
  'storm': ['#2F4F4F', '#708090', '#778899'],
  'fire': ['#FF4500', '#FF6347', '#FF8C00'],
  'flame': ['#FF4500', '#FF6347', '#FF8C00'],
  'ice': ['#B0E0E6', '#E0FFFF', '#F0F8FF'],
  'snow': ['#FFFAFA', '#F0F8FF', '#E6E6FA'],
  'rain': ['#4682B4', '#708090', '#2F4F4F'],

  // Emotions & Moods
  'love': ['#FF69B4', '#FFB6C1', '#FFC0CB'],
  'romance': ['#FF69B4', '#FFB6C1', '#FFC0CB'],
  'passion': ['#DC143C', '#B22222', '#8B0000'],
  'anger': ['#FF0000', '#8B0000', '#B22222'],
  'calm': ['#B0E0E6', '#87CEEB', '#E0FFFF'],
  'peaceful': ['#98FB98', '#90EE90', '#F0FFF0'],
  'sad': ['#4682B4', '#2F4F4F', '#708090'],
  'melancholy': ['#4682B4', '#2F4F4F', '#708090'],
  'joy': ['#FFD700', '#FFA500', '#FFFF00'],
  'happy': ['#FFD700', '#FFA500', '#FFFF00'],
  'mysterious': ['#483D8B', '#2F2F4F', '#191970'],
  'dreamy': ['#DDA0DD', '#DA70D6', '#EE82EE'],
  'energy': ['#FF4500', '#FF6347', '#FF8C00'],
  'power': ['#8B0000', '#B22222', '#DC143C'],

  // Colors
  'red': ['#FF0000', '#DC143C', '#B22222'],
  'blue': ['#0000FF', '#4169E1', '#1E90FF'],
  'green': ['#008000', '#32CD32', '#90EE90'],
  'purple': ['#800080', '#9370DB', '#DDA0DD'],
  'violet': ['#800080', '#9370DB', '#DDA0DD'],
  'orange': ['#FFA500', '#FF8C00', '#FF7F50'],
  'yellow': ['#FFFF00', '#FFD700', '#FFA500'],
  'pink': ['#FFC0CB', '#FFB6C1', '#FF69B4'],
  'gold': ['#FFD700', '#FFC300', '#DAA520'],
  'golden': ['#FFD700', '#FFC300', '#DAA520'],
  'silver': ['#C0C0C0', '#A9A9A9', '#D3D3D3'],

  // Time & Seasons
  'night': ['#191970', '#2F2F4F', '#483D8B'],
  'midnight': ['#000000', '#2F2F4F', '#191970'],
  'dawn': ['#FFB347', '#FFA07A', '#F0E68C'],
  'dusk': ['#B8860B', '#DAA520', '#CD853F'],
  'spring': ['#98FB98', '#90EE90', '#F0FFF0'],
  'summer': ['#FFD700', '#FFA500', '#FF6347'],
  'autumn': ['#D2691E', '#CD853F', '#DEB887'],
  'fall': ['#D2691E', '#CD853F', '#DEB887'],
  'winter': ['#B0E0E6', '#E0FFFF', '#F0F8FF'],

  // Weather
  'sunny': ['#FFD700', '#FFA500', '#FFFF00'],
  'cloudy': ['#D3D3D3', '#A9A9A9', '#C0C0C0'],
  'rainy': ['#4682B4', '#708090', '#2F4F4F'],
  'foggy': ['#F5F5F5', '#DCDCDC', '#D3D3D3'],
  'windy': ['#87CEEB', '#B0E0E6', '#E0FFFF'],

  // Abstract concepts
  'gentle': ['#F0F8FF', '#E6E6FA', '#FFF8DC'],
  'soft': ['#F5F5DC', '#FFF8DC', '#FFFACD'],
  'bold': ['#FF1493', '#FF4500', '#DC143C'],
  'bright': ['#FFFF00', '#FFD700', '#FFA500'],
  'dark': ['#2F2F2F', '#483D8B', '#191970'],
  'light': ['#FFFAFA', '#F0F8FF', '#E6E6FA']
}

export function getLocalColors(text) {
  if (!text.trim()) return null

  const words = text.toLowerCase().split(/\s+/)
  let matchedColors = []

  // Look for direct keyword matches
  words.forEach(word => {
    if (colorKeywords[word]) {
      matchedColors.push(...colorKeywords[word])
    }
  })

  // If no direct matches, try partial matches
  if (matchedColors.length === 0) {
    words.forEach(word => {
      Object.keys(colorKeywords).forEach(keyword => {
        if (keyword.includes(word) || word.includes(keyword)) {
          matchedColors.push(...colorKeywords[keyword])
        }
      })
    })
  }

  // If still no matches, return default pastels
  if (matchedColors.length === 0) {
    return ['#ff69b4', '#40e0d0', '#8a2be2']
  }

  // Return up to 4 colors, removing duplicates
  const uniqueColors = [...new Set(matchedColors)]
  return uniqueColors.slice(0, 4)
}