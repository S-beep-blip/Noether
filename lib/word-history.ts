import type { WordHistoryItem } from "./types"

const STORAGE_KEY = "word-history"
const MAX_HISTORY_ITEMS = 50

export function saveWordHistory(wordHistory: WordHistoryItem[]): void {
  try {
    // Limit the number of items to prevent excessive storage usage
    const limitedHistory = wordHistory.slice(0, MAX_HISTORY_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory))
  } catch (error) {
    console.error("Error saving word history:", error)
  }
}

export function loadWordHistory(): WordHistoryItem[] {
  try {
    const storedHistory = localStorage.getItem(STORAGE_KEY)
    if (storedHistory) {
      return JSON.parse(storedHistory)
    }
  } catch (error) {
    console.error("Error loading word history:", error)
  }
  return []
}

export function addWordToHistory(wordHistory: WordHistoryItem[], newItem: WordHistoryItem): WordHistoryItem[] {
  const existingItemIndex = wordHistory.findIndex((item) => item.word === newItem.word)

  if (existingItemIndex !== -1) {
    const updatedHistory = [...wordHistory]
    updatedHistory[existingItemIndex] = {
      ...updatedHistory[existingItemIndex],
      ...newItem,
      chatMessages: [
        ...(updatedHistory[existingItemIndex].chatMessages || []),
        ...(newItem.chatMessages || []),
      ],
      // Keep original timestamp
      timestamp: updatedHistory[existingItemIndex].timestamp,
    }
    return updatedHistory
  }

  // Add new item to the beginning of the array
  return [newItem, ...wordHistory]
}

export function updateWordChatHistory(
  wordHistory: WordHistoryItem[],
  wordId: string,
  chatMessages: Array<{ sender: string; text: string }>
): WordHistoryItem[] {
  return wordHistory.map((item) => {
    if (item.id === wordId) {
      return {
        ...item,
        chatMessages: chatMessages,
        // Preserve the original timestamp
        timestamp: item.timestamp,
      }
    }
    return item
  })
}

export function removeWordFromHistory(wordHistory: WordHistoryItem[], wordId: string): WordHistoryItem[] {
  return wordHistory.filter((item) => item.id !== wordId)
}

export function clearWordHistory(): WordHistoryItem[] {
  localStorage.removeItem(STORAGE_KEY)
  return []
}
