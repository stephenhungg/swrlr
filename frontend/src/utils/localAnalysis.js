const colorKeywords = {
  // Nature & Environments
  'ocean': ['#006994', '#47b5ff', '#06ffa5'],
  'sea': ['#006994', '#47b5ff', '#06ffa5'],
  'water': ['#4A90E2', '#6BB6FF', '#A8E6CF'],
  'sunset': ['#ff6b6b', '#ffa500', '#ffff66'],
  'sunrise': ['#FFB347', '#FF6B6B', '#FFA500'],
  'forest': ['#2d5016', '#68bb59', '#90ee90'],
  'mountain': ['#8B7355', '#A0522D', '#DEB887'],
  'desert': ['#F4A460', '#D2B48C', '#FFE4B5'],
  'sky': ['#87CEEB', '#4682B4', '#B0E0E6'],
  'storm': ['#2F4F4F', '#708090', '#778899'],
  'fire': ['#FF4500', '#FF6347', '#FF8C00'],
  'ice': ['#B0E0E6', '#E0FFFF', '#F0F8FF'],
  'snow': ['#FFFAFA', '#F0F8FF', '#E6E6FA'],

  // Emotions & Moods
  'love': ['#FF69B4', '#FFB6C1', '#FFC0CB'],
  'passion': ['#DC143C', '#B22222', '#8B0000'],
  'anger': ['#FF0000', '#8B0000', '#B22222'],
  'calm': ['#B0E0E6', '#87CEEB', '#E0FFFF'],
  'peaceful': ['#98FB98', '#90EE90', '#F0FFF0'],
  'sad': ['#4682B4', '#2F4F4F', '#708090'],
  'joy': ['#FFD700', '#FFA500', '#FFFF00'],
  'happy': ['#FFD700', '#FFA500', '#FFFF00'],
  'mysterious': ['#483D8B', '#2F2F4F', '#191970'],
  'dreamy': ['#DDA0DD', '#DA70D6', '#EE82EE'],

  // Colors
  'red': ['#FF0000', '#DC143C', '#B22222'],
  'blue': ['#0000FF', '#4169E1', '#1E90FF'],
  'green': ['#008000', '#32CD32', '#90EE90'],
  'purple': ['#800080', '#9370DB', '#DDA0DD'],
  'orange': ['#FFA500', '#FF8C00', '#FF7F50'],
  'yellow': ['#FFFF00', '#FFD700', '#FFA500'],
  'pink': ['#FFC0CB', '#FFB6C1', '#FF69B4'],
  'black': ['#000000', '#2F2F2F', '#696969'],
  'white': ['#FFFFFF', '#F8F8FF', '#F0F0F0'],

  // Time & Seasons
  'night': ['#191970', '#2F2F4F', '#483D8B'],
  'dawn': ['#FFB347', '#FFA07A', '#F0E68C'],
  'dusk': ['#B8860B', '#DAA520', '#CD853F'],
  'midnight': ['#000000', '#2F2F4F', '#191970'],
  'spring': ['#98FB98', '#90EE90', '#F0FFF0'],
  'summer': ['#FFD700', '#FFA500', '#FF6347'],
  'autumn': ['#D2691E', '#CD853F', '#DEB887'],
  'winter': ['#B0E0E6', '#E0FFFF', '#F0F8FF'],

  // Weather
  'sunny': ['#FFD700', '#FFA500', '#FFFF00'],
  'cloudy': ['#D3D3D3', '#A9A9A9', '#C0C0C0'],
  'rainy': ['#4682B4', '#708090', '#2F4F4F'],
  'foggy': ['#F5F5F5', '#DCDCDC', '#D3D3D3'],
  'windy': ['#87CEEB', '#B0E0E6', '#E0FFFF'],

  // Abstract concepts
  'energy': ['#FF4500', '#FF6347', '#FF8C00'],
  'power': ['#8B0000', '#B22222', '#DC143C'],
  'gentle': ['#F0F8FF', '#E6E6FA', '#FFF8DC'],
  'intense': ['#FF0000', '#FF4500', '#FF6347'],
  'soft': ['#F5F5DC', '#FFF8DC', '#FFFACD'],
  'bold': ['#FF1493', '#FF4500', '#DC143C']
}

const sentimentWords = {
  positive: ['love', 'joy', 'happy', 'beautiful', 'amazing', 'wonderful', 'fantastic', 'great', 'awesome', 'brilliant', 'magnificent', 'peaceful', 'calm', 'bright', 'radiant', 'warm', 'cozy', 'gentle', 'soft', 'light'],
  negative: ['sad', 'angry', 'dark', 'cold', 'harsh', 'stormy', 'gloomy', 'terrible', 'awful', 'horrible', 'nightmare', 'fear', 'scary', 'violent', 'aggressive', 'intense', 'heavy', 'deep', 'shadow', 'black']
}

function analyzeKeywords(text) {
  const words = text.toLowerCase().split(/\s+/)
  let matchedColors = []

  words.forEach(word => {
    if (colorKeywords[word]) {
      matchedColors.push(...colorKeywords[word])
    }
  })

  return matchedColors
}

function analyzeSentiment(text) {
  const words = text.toLowerCase().split(/\s+/)
  let positiveCount = 0
  let negativeCount = 0

  words.forEach(word => {
    if (sentimentWords.positive.includes(word)) positiveCount++
    if (sentimentWords.negative.includes(word)) negativeCount++
  })

  if (positiveCount > negativeCount) {
    return 'warm' // warm colors
  } else if (negativeCount > positiveCount) {
    return 'cool' // cool colors
  }
  return 'neutral'
}

function getDefaultColors(sentiment) {
  const colorPalettes = {
    warm: ['#FF6B6B', '#FFA500', '#FFD700'],
    cool: ['#4A90E2', '#6BB6FF', '#A8E6CF'],
    neutral: ['#9370DB', '#DDA0DD', '#E6E6FA']
  }

  return colorPalettes[sentiment] || colorPalettes.neutral
}

function determineAnimationType(text) {
  const energyWords = ['fast', 'quick', 'rush', 'wild', 'crazy', 'intense', 'explosive', 'dynamic']
  const calmWords = ['slow', 'gentle', 'peaceful', 'calm', 'soft', 'quiet', 'still', 'serene']

  const words = text.toLowerCase().split(/\s+/)
  const hasEnergy = words.some(word => energyWords.includes(word))
  const hasCalm = words.some(word => calmWords.includes(word))

  if (hasEnergy) return 'fast-spin'
  if (hasCalm) return 'slow-pulse'

  // Default based on text length and complexity
  if (text.length > 100) return 'medium-spin'
  return 'slow-pulse'
}

export function generateLocalGradient(text) {
  if (!text.trim()) return null

  // Analyze text for keywords and sentiment
  const keywordColors = analyzeKeywords(text)
  const sentiment = analyzeSentiment(text)
  const animationType = determineAnimationType(text)

  // Use keyword colors if found, otherwise fall back to sentiment-based colors
  const colors = keywordColors.length > 0
    ? keywordColors.slice(0, 4) // Limit to 4 colors
    : getDefaultColors(sentiment)

  // Determine gradient type based on text characteristics
  const gradientType = text.length > 50 ? 'conic' : 'radial'

  // Create CSS gradient
  let gradient
  if (gradientType === 'conic') {
    gradient = `conic-gradient(from 0deg, ${colors.join(', ')})`
  } else {
    gradient = `radial-gradient(circle at center, ${colors.join(', ')})`
  }

  // Add animation class based on type
  const animationDuration = animationType === 'fast-spin' ? '3s' :
                          animationType === 'medium-spin' ? '8s' : '12s'

  return {
    background: gradient,
    animationName: animationType,
    animationDuration: animationDuration
  }
}