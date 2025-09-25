const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function callGeminiAPI(text) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        use_gemini: true
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('🔍 API Response:', data)
    return data

  } catch (error) {
    console.error('Error calling Gemini API:', error)
    return null
  }
}

export async function testAPIConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`)
    return response.ok
  } catch (error) {
    console.error('API connection test failed:', error)
    return false
  }
}