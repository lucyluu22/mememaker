import type { JSX, CSSProperties, UIEvent } from "react"
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
  onDrag: (delta: PointDelta) => void
  onDragStart: () => void
  onSelect: (evt: UIEvent) => void
  children?: React.ReactNode
}

const Region = styled.div<{ $active: boolean; $allowMove: boolean }>`
  position: absolute;
  cursor: ${props => (props.$active && props.$allowMove ? "move" : "auto")};
  z-index: calc(var(--z-index-transform-controls) + ${props => (props.$active ? 1 : 0)});
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
  sensitivity = 1,
  onDrag,
  onDragStart,
  onSelect,
  children,
}: SelectionBoxRegionProps): JSX.Element => {
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

  return (
    <Region
      ref={selectionBox}
      style={
        {
          width,
          height,
          top: y,
          left: x,
          "--scale": `${String(scale)}px`,
        } as CSSProperties
      }
      $active={active}
      $allowMove={allowMove}
      onClick={evt => {
        if (evt.target === evt.currentTarget && !hasDragged.current) {
          onSelect(evt)
        }
      }}
      onMouseDown={evt => {
        if (active && evt.target === evt.currentTarget && evt.button === 0) {
          startDrag(evt)
        }
      }}
      onTouchStart={evt => {
        if (active && evt.target === evt.currentTarget) {
          evt.stopPropagation()
          startDrag(evt)
        }
      }}
    >
      {active && children}
    </Region>
  )
}
