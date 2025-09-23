import { flatMap, sortBy } from "lodash"

export interface TransformableElement {
  x: number
  y: number
  width: number
  height: number
}

export interface SnapBoundaries {
  x: number[]
  y: number[]
}

/**
 * Calculates snap boundaries from transformable elements.
 * The boundaries are sorted to allow search optimisations as required by transform controls.
 */
export const getSnapBoundaries = (elements: TransformableElement[]): SnapBoundaries => {
  return {
    x: sortBy(flatMap(elements, ({ x, width }) => [x, x + width])),
    y: sortBy(flatMap(elements, ({ y, height }) => [y, y + height])),
  }
}

/**
 * Find element in sorted array that is within given bounds.
 */
const sortedInRange = (array: number[], lower: number, upper: number): number | null => {
  let start = 0
  let end = array.length - 1

  while (start <= end) {
    const mid = Math.floor((start + end) / 2)

    if (lower <= array[mid] && upper >= array[mid]) {
      return array[mid]
    }

    if (lower < array[mid]) {
      end = mid - 1
    } else {
      start = mid + 1
    }
  }

  return null
}

/**
 * Sets a value to a given bound if that value is within the threshold.
 * @curried
 */
export const snapTo =
  (threshold = 10) =>
  (boundaries: number[] = []) =>
  (offsets: number[] = [0]) =>
  (val: number): number => {
    for (const offset of offsets) {
      const lower = val + offset - threshold
      const upper = val + offset + threshold

      const snapPoint = sortedInRange(boundaries, lower, upper)
      if (snapPoint !== null) return snapPoint - offset
    }

    return val
  }
