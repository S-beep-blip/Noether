export interface WordHistoryItem {
  id: string
  word: string
  definition: string
  timestamp: number
  position?: { x: number; y: number } | null
  isHoverMode: boolean
  chatMessages?: Array<{ sender: string; text: string }>
  documentText?: string
}

export interface ChatMessage {
  sender: string
  text: string
}
