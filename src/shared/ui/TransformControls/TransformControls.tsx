import type { JSX, PropsWithChildren } from "react"
import { flow, clamp } from "lodash/fp"
import { identity } from "lodash"
import ReactDOM from "react-dom"
import { useRef } from "react"

import type { PointDelta } from "./useDragIntent"
import { TRANSFORM_CONTROLS_ROOT_ID } from "./TransformControlsRoot"
import { SelectionRegion } from "./SelectionRegion"
import { type Anchor, AnchorHandle } from "./AnchorHandle"
import { MoveHandle } from "./MoveHandle"
import { useDragIntent } from "./useDragIntent"

import type { SnapBoundaries } from "./helpers"
import { snapTo } from "./helpers"

export interface TransformControlProps {
  active?: boolean // render the selection box UI on the target element
  x?: number // x pos of the element (top left origin)
  y?: number // y pos of the element (top left origin)
  width?: number // width of the element
  height?: number // height of the element
  minX?: number // minimum x pos the element can be moved to
  minY?: number // minimum y pos the element can be moved to
  minWidth?: number // minimum width the element can be scaled to
  minHeight?: number // minimum height the element can be scaled to
  maxX?: number // maximum x pos the element can be moved to
  maxY?: number // maximum y pos the element can be moved to
  maxWidth?: number // maximum width the element can be scaled to
  maxHeight?: number // maxiumum height the element can be scaled to
  scale?: number // scale of the selection box UI (to compensate for scale transforms on the element)
  snapBoundaries?: SnapBoundaries // array of ASCENDING ORDER x and y positions to snap to
  snapThreshold?: number // the margin by which the position/dimensions should snap to the given boundaries
  ratio?: number // width/height ratio to snap to
  hasMoveHandle?: boolean // use a separate move handle (otherwise the whole box is draggable)
  allowMove?: boolean // allow user to move the element
  allowResizeWidth?: boolean // allow user to resize element width
  allowResizeHeight?: boolean // allow user to resize element height
  zIndex?: number // z-index of the selection box region
  selectionRegionProps?: Partial<React.ComponentProps<typeof SelectionRegion>>
  moveHandleProps?: Partial<React.ComponentProps<typeof MoveHandle>>
  onMove: (x: number, y: number) => void
  onResize: (width: number, height: number) => void
  onDeselect?: () => void
}

export const TransformControls = ({
  active = false,
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  minX = 0,
  minY = 0,
  minWidth = 1,
  minHeight = 1,
  maxX = Infinity,
  maxY = Infinity,
  maxWidth = Infinity,
  maxHeight = Infinity,
  scale = 1,
  snapBoundaries = { x: [], y: [] },
  ratio,
  snapThreshold = 10,
  hasMoveHandle = false,
  allowMove = true,
  allowResizeWidth = true,
  allowResizeHeight = true,
  zIndex = 0,
  selectionRegionProps = {},
  moveHandleProps = {},
  onMove,
  onResize,
  children,
}: PropsWithChildren<TransformControlProps>): JSX.Element => {
  // We need to track internal states before any transformations are applied.
  const rawX = useRef(x)
  const rawY = useRef(y)
  const rawW = useRef(width)
  const rawH = useRef(height)

  const snapToThreshold = snapTo(snapThreshold * scale)

  const dragMoveHandlers = useDragIntent({
    transform: flow(({ dX, dY }) => ({ dX: dX * scale, dY: dY * scale })),
    onDrag: ({ dX, dY }: PointDelta) => {
      rawX.current += dX
      rawY.current += dY

      const newX = flow(
        snapToThreshold(snapBoundaries.x)([0, width / 2, width]),
        clamp(minX)(maxX - width),
      )(rawX.current)

      const newY = flow(
        snapToThreshold(snapBoundaries.y)([0, height / 2, height]),
        clamp(minY)(maxY - height),
      )(rawY.current)

      if (newX !== x || newY !== y) {
        onMove(newX, newY)
      }
    },
    onDragStart: evt => {
      if (!active || evt.button !== 0) return false
      rawX.current = x
      rawY.current = y
    },
  })

  const onAnchorDragStart = () => {
    rawX.current = x
    rawY.current = y
    rawW.current = width
    rawH.current = height
  }

  // Resizing the selection box.
  const onAnchorDrag = ({ dX, dY, anchor }: PointDelta & { anchor: Anchor }) => {
    // Origin is top-left of selection box.
    // Resizing from the right and bottom work as expected.
    // However, left and top need to also move the selection to remain fixed while the size changes.
    // This also affects the snap behaviour as top and left need to snap based on their new position.

    let newX = x
    let newY = y
    let newW = width
    let newH = height

    if (anchor.left) {
      // When moving a left handle, adjust the x position so the element remains fixed on the right side.
      // This means the width increases as the x position decreases, and vice versa.
      rawX.current += dX
      newX = flow(
        snapToThreshold(snapBoundaries.x)(),
        ratio ? snapToThreshold([x - (newH * ratio - width)])() : identity,
        clamp(Math.max(minX, x - (maxWidth - width)))(Math.min(maxX, x + (width - minWidth))),
      )(rawX.current)
      rawW.current += x - newX
      newW = rawW.current
    }

    if (anchor.right) {
      // The right handle behaves as expected, with the width increasing as the handle is dragged to the right.
      rawW.current += dX
      newW = flow(
        snapToThreshold(snapBoundaries.x)([x]),
        ratio ? snapToThreshold([newH * ratio])() : identity,
        clamp(minWidth)(maxWidth),
      )(rawW.current)
    }

    if (anchor.top) {
      // When moving a top handle, adjust the y position so the element remains fixed on the bottom side.
      // This means the height increases as the y position decreases, and vice versa.
      rawY.current += dY
      newY = flow(
        snapToThreshold(snapBoundaries.y)(),
        ratio ? snapToThreshold([y - (newW / ratio - height)])() : identity,
        clamp(Math.max(minY, y - (maxHeight - height)))(Math.min(maxY, y + (height - minHeight))),
      )(rawY.current)
      rawH.current += y - newY
      newH = rawH.current
    }

    if (anchor.bottom) {
      // The bottom handle behaves as expected, with the height increasing as the handle is dragged downwards.
      rawH.current += dY
      newH = flow(
        snapToThreshold(snapBoundaries.y)([y]),
        ratio ? snapToThreshold([newW / ratio])() : identity,
        clamp(minHeight)(maxHeight),
      )(rawH.current)
    }

    if (newX !== x || newY !== y) onMove(newX, newY)
    if (newW !== width || newH !== height) onResize(newW, newH)
  }

  const getAnchorHandles = (): Anchor[] => {
    const anchors: Anchor[] = []

    if (allowResizeWidth) {
      anchors.push({ right: true }, { left: true })
    }
    if (allowResizeHeight) {
      anchors.push({ top: true }, { bottom: true })
    }
    if (allowResizeWidth && allowResizeHeight) {
      anchors.push(
        ...[
          // The move handle replaces the top-left anchor.
          ...(hasMoveHandle ? [] : [{ top: true, left: true }]),
          { top: true, right: true },
          { bottom: true, right: true },
          { bottom: true, left: true },
        ],
      )
    }

    return anchors
  }

  return (
    <>
      {ReactDOM.createPortal(
        <SelectionRegion
          active={active}
          x={x}
          y={y}
          width={width}
          height={height}
          scale={scale}
          allowMove={allowMove}
          zIndex={zIndex}
          {...selectionRegionProps}
        >
          {getAnchorHandles().map(anchor => (
            <AnchorHandle
              key={Object.keys(anchor).join("-")}
              {...anchor}
              scale={scale}
              onDrag={onAnchorDrag}
              onDragStart={onAnchorDragStart}
            />
          ))}
          {hasMoveHandle && (
            <MoveHandle $top $left $scale={scale} {...dragMoveHandlers} {...moveHandleProps} />
          )}
        </SelectionRegion>,
        document.getElementById(TRANSFORM_CONTROLS_ROOT_ID) ?? document.body,
      )}
      <div {...(!hasMoveHandle ? dragMoveHandlers : {})}>{children}</div>
    </>
  )
}
