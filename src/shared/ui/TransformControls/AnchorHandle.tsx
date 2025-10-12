import type { JSX } from "react"
import { flow } from "lodash/fp"
import styled from "styled-components"
import { useDragIntent } from "./useDragIntent"
import { Handle as BaseHandle } from "./Handle"

import type { PointDelta } from "./useDragIntent"

export interface Anchor {
  top?: boolean
  left?: boolean
  right?: boolean
  bottom?: boolean
}

export type AnchorHandleProps = Anchor & {
  scale?: number
  sensitivity?: number
  onDrag: ({ dX, dY, anchor }: PointDelta & { anchor: Anchor }) => void
  onDragStart: (anchor: Anchor, evt: React.PointerEvent) => void
}

const Handle = styled(BaseHandle)`
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

export const AnchorHandle = ({
  top = false,
  right = false,
  bottom = false,
  left = false,
  scale = 1,
  sensitivity = 1,
  onDrag,
  onDragStart,
}: AnchorHandleProps): JSX.Element => {
  const anchor: Anchor = { top, bottom, left, right }

  const dragHandlers = useDragIntent({
    transform: flow(({ dX, dY }) => ({ dX: dX * scale, dY: dY * scale })),
    sensitivity,
    onDrag: ({ dX, dY }) => {
      onDrag({ dX, dY, anchor })
    },
    onDragStart: evt => {
      if (evt.button !== 0) return false // only primary button
      onDragStart(anchor, evt)
    },
  })

  return (
    <Handle
      $top={top}
      $bottom={bottom}
      $left={left}
      $right={right}
      $scale={scale}
      {...dragHandlers}
    />
  )
}
