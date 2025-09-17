import { useRef } from "react"

export interface UseLongPressOptions {
  onLongPress: (event: React.MouseEvent | React.TouchEvent) => void
  thresholdMs?: number
  vibrateMs?: number
}

export interface UseLongPressHandlers {
  onTouchStart: (e: React.TouchEvent) => void
  onTouchEnd: () => void
  onTouchMove: () => void
}

/**
 * Detect long press on touch devices.
 * @param {UseLongPressOptions} options
 * @returns {UseLongPressHandlers}
 */
export const useLongPress = ({
  onLongPress,
  thresholdMs = 500,
  vibrateMs = 200,
}: UseLongPressOptions): UseLongPressHandlers => {
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  return {
    onTouchStart: (e: React.TouchEvent) => {
      if (e.touches.length !== 1) return
      longPressTimer.current = setTimeout(() => {
        // The vibration API is not defined in all browsers and will throw if called
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        navigator.vibrate?.(vibrateMs)
        onLongPress(e)
      }, thresholdMs)
    },
    onTouchEnd: () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
        longPressTimer.current = null
      }
    },
    onTouchMove: () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
        longPressTimer.current = null
      }
    },
  }
}
