import { useState, useCallback } from 'react'
import { ChangeEvent, KeyboardEvent } from 'react'

interface TextInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
  className?: string
  placeholder?: string
}

function TextInput({ value, onChange, onSubmit, className, placeholder = "describe your vision..." }: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }, [onChange])

  const handleKeyPress = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit(value)
    }
  }, [onSubmit, value])

  return (
    <textarea
      value={value}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholder={placeholder}
      className={`${className} ${isFocused ? 'focused' : ''}`}
      rows={3}
      maxLength={500}
    />
  )
}

export default TextInput