import type { JSX } from "react"
import { flow } from "lodash/fp"
import styled from "styled-components"
import useDragAction from "./useDragAction"

import type { PointDelta } from "./useDragAction"

export interface SelectionBoxAnchor {
  top?: boolean
  left?: boolean
  right?: boolean
  bottom?: boolean
}

export type SelectionBoxHandleProps = SelectionBoxAnchor & {
  scale?: number
  sensitivity?: number
  onDrag: ({ dX, dY, anchor }: PointDelta & { anchor: SelectionBoxAnchor }) => void
  onDragStart: (anchor: SelectionBoxAnchor) => void
}

const translateX = ({ left, right }: SelectionBoxAnchor): string => {
  let x = -50
  if (left) x = -100
  if (right) x = 0
  return `translateX(${String(x)}%)`
}

const translateY = ({ top, bottom }: SelectionBoxAnchor): string => {
  let y = -50
  if (top) y = -100
  if (bottom) y = 0
  return `translateY(${String(y)}%)`
}

const Handle = styled.div<{
  $top: boolean
  $bottom: boolean
  $left: boolean
  $right: boolean
}>`
  position: absolute;
  width: var(--transform-handle-size, 14px);
  height: var(--transform-handle-size, 14px);
  top: ${props => (props.$top ? "0" : "")};
  top: ${props => (props.$bottom ? "100%" : "")};
  top: ${props => (!props.$top && !props.$bottom ? "50%" : "")};
  left: ${props => (props.$left ? "0" : "")};
  left: ${props => (props.$right ? "100%" : "")};
  left: ${props => (!props.$left && !props.$right ? "50%" : "")};
  background: var(--transform-handle-color, black);
  border: 1px solid var(--transform-handle-border-color, white);
  pointer-events: auto;
  cursor: ${props => {
    if ((props.$top && props.$left) || (props.$bottom && props.$right)) {
      return "nwse-resize"
    }
    if ((props.$top && props.$right) || (props.$bottom && props.$left)) {
      return "nesw-resize"
    }
    if (props.$top || props.$bottom) {
      return "ns-resize"
    }
    if (props.$left || props.$right) {
      return "ew-resize"
    }
    return "auto"
  }};
`

export const SelectionBoxHandle = ({
  top = false,
  right = false,
  bottom = false,
  left = false,
  scale = 1,
  sensitivity = 1,
  onDrag,
  onDragStart,
}: SelectionBoxHandleProps): JSX.Element => {
  const anchor: SelectionBoxAnchor = { top, bottom, left, right }

  const startDrag = useDragAction({
    transform: flow(({ dX, dY }) => ({ dX: dX * scale, dY: dY * scale })),
    sensitivity,
    onDrag: ({ dX, dY }) => {
      onDrag({ dX, dY, anchor })
    },
    onDragStart: () => {
      onDragStart(anchor)
    },
  })

  return (
    <Handle
      style={{
        transformOrigin: `${top ? "bottom" : ""} ${bottom ? "top" : ""} ${left ? "right" : ""} ${right ? "left" : ""}`,
        transform: `${translateX(anchor)} ${translateY(anchor)} scale(${String(scale)})`,
      }}
      $top={top}
      $bottom={bottom}
      $left={left}
      $right={right}
      onMouseDown={evt => {
        if (evt.button === 0) startDrag(evt)
      }}
      onTouchStart={evt => {
        if (evt.target === evt.currentTarget) {
          evt.stopPropagation()
          startDrag(evt)
        }
      }}
    />
  )
}

export default SelectionBoxHandle
