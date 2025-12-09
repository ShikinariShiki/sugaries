'use client'

import { useReducer, useCallback, useEffect } from 'react'
import { LetterState, LetterStateData, LetterAction } from '@/types/letter'

const initialState: LetterStateData = {
  state: 'NAME_CHECK',
  isLoading: false,
}

function letterReducer(state: LetterStateData, action: LetterAction): LetterStateData {
  switch (action.type) {
    case 'VERIFY_NAME':
      return { ...state, isLoading: true, error: undefined }
    
    case 'NAME_VERIFIED':
      return {
        ...state,
        state: 'LOCKED_ENVELOPE',
        recipientName: action.payload.recipientName,
        isLoading: false,
        error: undefined,
      }
    
    case 'NAME_FAILED':
      return {
        ...state,
        state: 'NAME_CHECK',
        isLoading: false,
        error: action.payload.error,
      }
    
    case 'OPEN_ENVELOPE':
      return {
        ...state,
        state: 'PIN_CHECK',
      }
    
    case 'VERIFY_PIN':
      return { ...state, isLoading: true, error: undefined }
    
    case 'PIN_VERIFIED':
      return {
        ...state,
        state: 'READING',
        content: action.payload.content,
        musicUrl: action.payload.musicUrl,
        imageUrl: action.payload.imageUrl,
        letterColor: action.payload.letterColor,
        letterFont: action.payload.letterFont,
        senderName: action.payload.senderName,
        pinHash: action.payload.pinHash,
        recipientName: action.payload.recipientName || state.recipientName,
        isLoading: false,
        error: undefined,
      }
    
    case 'PIN_FAILED':
      return {
        ...state,
        state: 'PIN_CHECK',
        isLoading: false,
        error: action.payload.error,
      }
    
    case 'RESET':
      return initialState
    
    default:
      return state
  }
}

export function useLetterReveal(letterId: string, isAdminView = false) {
  const [state, dispatch] = useReducer(letterReducer, initialState)

  // Skip verification for admin view
  const skipToContent = useCallback(async () => {
    try {
      const response = await fetch(`/api/letter/${letterId}?admin=true`)
      const data = await response.json()

      if (response.ok) {
        dispatch({ 
          type: 'PIN_VERIFIED', 
          payload: { 
            content: data.content,
            musicUrl: data.musicUrl,
            imageUrl: data.imageUrl,
            letterColor: data.letterColor,
            letterFont: data.letterFont,
            senderName: data.senderName,
            pinHash: data.pinHash,
            recipientName: data.recipientName,
          } 
        })
      }
    } catch (error) {
      console.error('Failed to load letter:', error)
    }
  }, [letterId])

  // Auto-load for admin view
  useEffect(() => {
    if (isAdminView) {
      skipToContent()
    }
  }, [isAdminView, skipToContent])

  const verifyName = useCallback(async (name: string) => {
    dispatch({ type: 'VERIFY_NAME', payload: { name } })

    try {
      const response = await fetch(`/api/letter/verify-name`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ letterId, name }),
      })

      const data = await response.json()

      if (response.ok) {
        dispatch({ 
          type: 'NAME_VERIFIED', 
          payload: { recipientName: data.correctName } 
        })
      } else {
        dispatch({ 
          type: 'NAME_FAILED', 
          payload: { error: data.error || 'Name does not match' } 
        })
      }
    } catch (error) {
      dispatch({ 
        type: 'NAME_FAILED', 
        payload: { error: 'Failed to verify name' } 
      })
    }
  }, [letterId])

  const openEnvelope = useCallback(async () => {
    // First, try to open without PIN (for non-protected letters)
    try {
      const response = await fetch(`/api/letter/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ letterId, pin: '' }), // Empty PIN for non-protected letters
      })

      const data = await response.json()

      if (response.ok) {
        // Letter is not PIN protected, go straight to reading
        dispatch({ 
          type: 'PIN_VERIFIED', 
          payload: { 
            content: data.content,
            musicUrl: data.musicUrl,
            imageUrl: data.imageUrl,
            letterColor: data.letterColor,
            letterFont: data.letterFont,
            senderName: data.senderName,
            pinHash: data.pinHash,
            recipientName: data.recipientName,
          } 
        })
      } else {
        // Letter is PIN protected, go to PIN check
        dispatch({ type: 'OPEN_ENVELOPE' })
      }
    } catch (error) {
      // If there's an error, assume PIN is required
      dispatch({ type: 'OPEN_ENVELOPE' })
    }
  }, [letterId])

  const verifyPin = useCallback(async (pin: string) => {
    dispatch({ type: 'VERIFY_PIN', payload: { pin } })

    try {
      const response = await fetch(`/api/letter/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ letterId, pin }),
      })

      const data = await response.json()

      if (response.ok) {
        dispatch({ 
          type: 'PIN_VERIFIED', 
          payload: { 
            content: data.content,
            musicUrl: data.musicUrl,
            imageUrl: data.imageUrl,
            letterColor: data.letterColor,
            letterFont: data.letterFont,
          } 
        })
      } else {
        dispatch({ 
          type: 'PIN_FAILED', 
          payload: { error: data.error || 'Incorrect PIN' } 
        })
      }
    } catch (error) {
      dispatch({ 
        type: 'PIN_FAILED', 
        payload: { error: 'Failed to verify PIN' } 
      })
    }
  }, [letterId])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  return {
    state,
    verifyName,
    openEnvelope,
    verifyPin,
    reset,
  }
}
