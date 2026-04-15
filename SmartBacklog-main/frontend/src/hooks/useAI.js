import { useState } from 'react'
import { aiService } from '../services/api'

export function useAI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const analyze = async ({ title, description }) => {
    if (!title.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await aiService.analyze({ title, description })
      setResult(data)
      return data
    } catch (err) {
      const msg = err.response?.data?.error || 'AI analysis failed. Make sure the backend is running.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setResult(null)
    setError(null)
  }

  return { analyze, loading, error, result, reset }
}