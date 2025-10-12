import type React from "react"
import { noop, identity } from "lodash"
import { useCallback, useRef } from "react"

export interface PointDelta {
  dX: number
  dY: number
}

export interface UseDragIntentOptions {
  sensitivity?: number // min px the pointer must move between events to be considered a drag
  transform?: (delta: PointDelta) => PointDelta // transform func for drag distance calculation
  onDrag?: (delta: PointDelta) => void
  onDragStart?: (evt: React.PointerEvent) => boolean | undefined // return false to prevent drag
  onDragEnd?: (evt: React.PointerEvent) => void
}

export interface DragActionHandlers {
  onPointerDown: (evt: React.PointerEvent) => void
  onPointerMove: (evt: React.PointerEvent) => void
  onPointerUp: (evt: React.PointerEvent) => void
}

export const useDragIntent = ({
  sensitivity = 1,
  transform = identity,
  onDrag = noop,
  onDragStart = () => true,
  onDragEnd = noop,
}: UseDragIntentOptions): DragActionHandlers => {
  const isDragging = useRef(false)
  const hasCaptured = useRef(false)
  const prevCoords = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const handleDragAction = useCallback(
    (evt: React.PointerEvent) => {
      const x = evt.clientX
      const y = evt.clientY
      const { dX, dY } = transform({
        dX: x - prevCoords.current.x,
        dY: y - prevCoords.current.y,
      })

      const xThreshold = Math.abs(dX) >= sensitivity
      const yThreshold = Math.abs(dY) >= sensitivity

      if (xThreshold || yThreshold) {
        if (!hasCaptured.current) {
          evt.currentTarget.setPointerCapture(evt.pointerId)
          hasCaptured.current = true
        }
        prevCoords.current.x = x
        prevCoords.current.y = y
        onDrag({ dX, dY })
      }
    },
    [sensitivity, transform, onDrag],
  )

  const onPointerDown = useCallback(
    (evt: React.PointerEvent) => {
      const shouldDrag = onDragStart(evt)
      if (shouldDrag !== false) {
        evt.preventDefault()
        isDragging.current = true
        hasCaptured.current = false
        prevCoords.current.x = evt.clientX
        prevCoords.current.y = evt.clientY
      }
    },
    [onDragStart],
  )

  const onPointerMove = useCallback(
    (evt: React.PointerEvent) => {
      if (isDragging.current) {
        handleDragAction(evt)
      }
    },
    [handleDragAction],
  )

  const onPointerUp = useCallback(
    (evt: React.PointerEvent) => {
      isDragging.current = false
      if (hasCaptured.current) {
        evt.currentTarget.releasePointerCapture(evt.pointerId)
        hasCaptured.current = false
      }
      onDragEnd(evt)
    },
    [onDragEnd],
  )

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
  }
}
