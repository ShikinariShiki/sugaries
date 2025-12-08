export type LetterState = 
  | 'NAME_CHECK'
  | 'LOCKED_ENVELOPE'
  | 'PIN_CHECK'
  | 'READING'

export interface LetterStateData {
  state: LetterState
  recipientName?: string
  content?: string
  error?: string
  isLoading?: boolean
  musicUrl?: string
  imageUrl?: string
  letterColor?: string
  letterFont?: string
}

export type LetterAction =
  | { type: 'VERIFY_NAME'; payload: { name: string } }
  | { type: 'NAME_VERIFIED'; payload: { recipientName: string } }
  | { type: 'NAME_FAILED'; payload: { error: string } }
  | { type: 'OPEN_ENVELOPE' }
  | { type: 'VERIFY_PIN'; payload: { pin: string } }
  | { type: 'PIN_VERIFIED'; payload: { content: string; musicUrl?: string; imageUrl?: string; letterColor?: string; letterFont?: string } }
  | { type: 'PIN_FAILED'; payload: { error: string } }
  | { type: 'RESET' }
