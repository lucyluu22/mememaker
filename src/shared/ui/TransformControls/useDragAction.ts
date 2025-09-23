import type React from "react"
import { noop, identity } from "lodash"
import { useCallback, useRef, useEffect } from "react"

export interface PointDelta {
  dX: number
  dY: number
}

export interface UseDragActionOptions {
  sensitivity?: number // min px the pointer must move between events to be considered a drag
  transform?: (delta: PointDelta) => PointDelta // transform func for drag distance calculation
  onDrag?: (delta: PointDelta) => void
  onDragStart?: () => void
  onDragEnd?: () => void
}

export type StartDragCallback = (evt: React.UIEvent) => void

export default function useDragAction({
  sensitivity = 1,
  transform = identity,
  onDrag = noop,
  onDragStart = noop,
  onDragEnd = noop,
}: UseDragActionOptions): StartDragCallback {
  const isDragging = useRef(false)
  const prevCoords = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const transformRef = useRef(transform)
  const onDragRef = useRef(onDrag)
  const onDragEndRef = useRef(onDragEnd)

  // Function references for useEffect efficiency.
  transformRef.current = transform
  onDragRef.current = onDrag
  onDragEndRef.current = onDragEnd

  const handleDragAction = useCallback(
    (x: number, y: number) => {
      const { dX, dY } = transformRef.current({
        dX: x - prevCoords.current.x,
        dY: y - prevCoords.current.y,
      })

      const xThreshold = Math.abs(dX) >= sensitivity
      const yThreshold = Math.abs(dY) >= sensitivity

      if (xThreshold) {
        prevCoords.current.x = x
      }

      if (yThreshold) {
        prevCoords.current.y = y
      }

      if (xThreshold || yThreshold) {
        onDragRef.current({ dX, dY })
      }
    },
    [sensitivity],
  )

  const onMouseMove = useCallback(
    (evt: MouseEvent) => {
      if (isDragging.current) {
        handleDragAction(evt.clientX, evt.clientY)
      }
    },
    [handleDragAction],
  )

  const onTouchMove = useCallback(
    (evt: TouchEvent) => {
      if (isDragging.current && evt.touches.length === 1) {
        const [touch] = evt.touches
        handleDragAction(touch.clientX, touch.clientY)
      }
    },
    [handleDragAction],
  )

  const onMouseEnd = useCallback(() => {
    isDragging.current = false
    onDragEndRef.current()
  }, [])

  const onTouchEnd = useCallback(() => {
    isDragging.current = false
    onDragEndRef.current()
  }, [])

  // Global event handlers.
  // This should rerun as little as possible!
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: true })
    window.addEventListener("mouseup", onMouseEnd)
    window.addEventListener("mouseleave", onMouseEnd)
    window.addEventListener("touchend", onTouchEnd)
    window.addEventListener("touchcancel", onTouchEnd)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("mouseup", onMouseEnd)
      window.removeEventListener("mouseleave", onMouseEnd)
      window.removeEventListener("touchend", onTouchEnd)
      window.removeEventListener("touchend", onTouchEnd)
    }
  }, [onMouseMove, onTouchMove, onMouseEnd, onTouchEnd])

  return useCallback(
    (evt: React.UIEvent) => {
      if ("clientX" in evt && "clientY" in evt) {
        prevCoords.current.x = evt.clientX as number
        prevCoords.current.y = evt.clientY as number
      } else if ("touches" in evt) {
        const [touch] = evt.touches as TouchList
        prevCoords.current.x = touch.clientX
        prevCoords.current.y = touch.clientY
      }

      isDragging.current = true

      onDragStart()
    },
    [onDragStart],
  )
}
