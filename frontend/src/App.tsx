import { useState, useEffect, useCallback } from 'react'
import './App.css'
import TextInput from './components/TextInput'
import ParticleEffects from './components/ParticleEffects'
import { callGeminiAPI } from './utils/api'

function App() {
  const [text, setText] = useState('')
  const [submittedText, setSubmittedText] = useState('')
  const [colors, setColors] = useState<string[] | null>(null)
  const [hideUI, setHideUI] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')

  const loadingMessages = [
    "imagining color",
    "dreaming in hues",
    "painting with light",
    "brewing gradients",
    "mixing wavelengths",
    "conjuring colors",
    "weaving rainbows",
    "distilling essence",
    "capturing vibes",
    "translating feelings",
    "blending emotions",
    "crafting atmosphere",
    "summoning shades",
    "channeling energy",
    "interpreting souls",
    "dancing with photons",
    "composing spectrums",
    "harvesting light"
  ]

  const getRandomLoadingMessage = useCallback(() => {
    return loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
  }, [loadingMessages])

  const handleSubmit = useCallback((inputText: string) => {
    setIsLoading(true)
    setLoadingMessage(getRandomLoadingMessage())
    setSubmittedText(inputText)
  }, [getRandomLoadingMessage])

  // API call for Gemini analysis on submitted text
  useEffect(() => {
    if (submittedText.trim() && submittedText.length > 3) {
      const callAPI = async () => {
        // Add minimum loading time for better UX
        const minLoadingTime = 2000; // 2 seconds minimum
        const startTime = Date.now();

        const result = await callGeminiAPI(submittedText)

        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

        // Wait for remaining time if API was too fast
        setTimeout(() => {
          if (result) {
            setColors(result.colors || null)
          }
          setIsLoading(false)
        }, remainingTime);
      }
      callAPI()
    } else {
      setColors(null)
      setIsLoading(false)
    }
  }, [submittedText])

  return (
    <div className="app">
      {/* Particle Effects Background */}
      <ParticleEffects colors={colors} />

      {/* UI Layer */}
      <div className={`ui-layer ${hideUI ? 'hidden' : ''}`}>
        <h1 className="glassmorphic-title">swrlr</h1>
        <p className="glassmorphic-subtitle">type for color</p>

        {isLoading && (
          <div className="loading-message">
            {loadingMessage}...
          </div>
        )}

        <TextInput
          value={text}
          onChange={setText}
          onSubmit={handleSubmit}
          className="glassmorphic-input"
        />
        <button
          className="hide-ui-btn"
          onClick={() => setHideUI(true)}
        >
          Hide UI
        </button>
      </div>

      {/* Click anywhere to show UI when hidden */}
      {hideUI && (
        <div
          className="show-ui-overlay"
          onClick={() => setHideUI(false)}
        />
      )}
    </div>
  )
}

export default App