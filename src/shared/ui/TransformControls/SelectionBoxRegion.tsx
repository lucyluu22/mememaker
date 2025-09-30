import type { JSX, CSSProperties } from "react"
import { useEffect, useRef } from "react"
import styled from "styled-components"

import type { PointDelta } from "./useDragAction"
import useDragAction from "./useDragAction"

export interface SelectionBoxRegionProps {
  active: boolean
  x: number
  y: number
  width: number
  height: number
  scale?: number
  allowMove?: boolean
  sensitivity?: number
  zIndex?: number
  selectionBoxProps?: React.HTMLAttributes<HTMLDivElement>
  onDrag: (delta: PointDelta) => void
  onDragStart: () => void
  children?: React.ReactNode
}

const Region = styled.div<{ $active: boolean; $allowMove: boolean }>`
  position: absolute;
  cursor: ${props => (props.$active && props.$allowMove ? "move" : "auto")};
  pointer-events: ${props => (props.$allowMove ? "auto" : "none")};
  z-index: ${props => (props.$active ? `99999` : `var(--z-index)`)};
  box-shadow:
    0 0 0 calc(var(--scale) * 1) var(--transform-region-border-color, white),
    0 0 0 calc(var(--scale) * 3) var(--transform-region-color, black),
    0 0 0 calc(var(--scale) * 4) var(--transform-region-border-color, white);
  box-shadow: ${props => (props.$active ? "" : "none")};
`

export const SelectionBoxRegion = ({
  active,
  x,
  y,
  width,
  height,
  scale = 1,
  allowMove = true,
  zIndex = 0,
  sensitivity = 1,
  selectionBoxProps = {},
  onDrag,
  onDragStart,
  children,
}: SelectionBoxRegionProps): JSX.Element | null => {
  const hasDragged = useRef(false)
  const selectionBox = useRef<HTMLDivElement>(null)

  useEffect(() => {
    hasDragged.current = false
  }, [active])

  const startDrag = useDragAction({
    sensitivity,
    transform: ({ dX, dY }) => ({ dX: dX * scale, dY: dY * scale }),
    onDrag: delta => {
      hasDragged.current = true
      onDrag(delta)
    },
    onDragStart: () => {
      hasDragged.current = false
      onDragStart()
    },
  })

  if (!active) return null
  return (
    <Region
      {...selectionBoxProps}
      ref={selectionBox}
      style={
        {
          width,
          height,
          top: y,
          left: x,
          "--scale": `${String(scale)}px`,
          "--z-index": zIndex,
          ...selectionBoxProps.style,
        } as CSSProperties
      }
      $active={active}
      $allowMove={allowMove}
      onMouseDown={evt => {
        selectionBoxProps.onMouseDown?.(evt)
        if (allowMove && evt.target === evt.currentTarget && evt.button === 0) {
          startDrag(evt)
        }
      }}
      onTouchStart={evt => {
        selectionBoxProps.onTouchStart?.(evt)
        if (allowMove && evt.target === evt.currentTarget) {
          startDrag(evt)
        }
      }}
    >
      {children}
    </Region>
  )
}
