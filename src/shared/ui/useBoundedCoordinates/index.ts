import type { RefObject } from "react"
import { clamp } from "lodash"
import { useLayoutEffect, useState } from "react"

export interface UseBoundedCoordinatesInput {
  x: number
  y: number
  boundedElement: RefObject<HTMLElement | null>
  bounds?: { left: number; right: number; top: number; bottom: number }
  recalcDeps?: React.DependencyList
}

export interface UseBoundedCoordinatesOutput {
  x: number
  y: number
}

/**
 * Bound the x and y coordinates such that the given element does not overflow the bounds.
 */
export const useBoundedCoordinates = ({
  x,
  y,
  boundedElement,
  bounds = { left: 0, right: window.innerWidth, top: 0, bottom: window.innerHeight },
  recalcDeps = [],
}: UseBoundedCoordinatesInput): UseBoundedCoordinatesOutput => {
  const [elemWidth, setElemWidth] = useState(0)
  const [elemHeight, setElemHeight] = useState(0)

  useLayoutEffect(() => {
    if (boundedElement.current) {
      setElemWidth(boundedElement.current.offsetWidth)
      setElemHeight(boundedElement.current.offsetHeight)
    }
  }, [boundedElement.current, ...recalcDeps]) // eslint-disable-line react-hooks/exhaustive-deps

  const boundX = clamp(x, bounds.left, bounds.right - elemWidth)
  const boundY = clamp(y, bounds.top, bounds.bottom - elemHeight)

  return { x: boundX, y: boundY }
}
