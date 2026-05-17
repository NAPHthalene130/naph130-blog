import { countWords, calcReadingTime } from '@/utils/markdown'

export function useReadingTime() {
  function getReadingStats(text: string) {
    const wordCount = countWords(text)
    const readingTime = calcReadingTime(wordCount)
    return { wordCount, readingTime }
  }

  return { getReadingStats }
}
