import type { JSX } from "react"
import { useEffect, useMemo, useRef } from "react"

import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "src/app/hooks"

import {
  selectZoom,
  setZoom,
  selectActiveElementId,
  setActiveElementId,
} from "../model/memeCanvasSlice"
import { selectMeme } from "../model/memeSlice"

import { AdjustableView } from "src/shared/ui/AdjustableView"
import { TransformControlsRoot, getSnapBoundaries } from "src/shared/ui/TransformControls"
import { useLongPress } from "src/shared/ui/useLongPress"

import { MemeContextMenu, useMemeContextMenu } from "./MemeContextMenu"
import { MemeImageContextMenu, useMemeImageContextMenu } from "./MemeImageContextMenu"
import { MemeCanvasImage } from "./MemeCanvasImage"

import { calculateMemeDimensions } from "../helpers/calculateMemeDimensions"

const MemeContainer = styled.div`
  position: relative;
  background: white;
`

export const MemeCanvas = (): JSX.Element => {
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches

  const transformControlsRootRef = useRef<HTMLDivElement>(null)
  const contextMenuRootRef = useRef<HTMLDivElement>(null)

  const zoom = useAppSelector(selectZoom)
  const meme = useAppSelector(selectMeme)

  const activeElementId = useAppSelector(selectActiveElementId)
  const dispatch = useAppDispatch()

  const [openMemeContextMenu, , memeContextMenuProps] = useMemeContextMenu()
  const [openImageContextMenu, , imageContextMenuProps] = useMemeImageContextMenu()

  const openContextMenu = (event: React.MouseEvent | React.TouchEvent) => {
    if (activeElementId) {
      openImageContextMenu({
        event,
        context: {
          imageId: activeElementId,
        },
      })
    } else {
      openMemeContextMenu({ event })
    }
  }

  useEffect(() => {
    const handleDeselect = (evt: MouseEvent) => {
      if (
        !transformControlsRootRef.current?.contains(evt.target as Node) &&
        !contextMenuRootRef.current?.contains(evt.target as Node)
      ) {
        dispatch(setActiveElementId(null))
      }
    }

    document.addEventListener("mousedown", handleDeselect)

    return () => {
      document.removeEventListener("mousedown", handleDeselect)
    }
  }, [dispatch])

  const longPressHandlers = useLongPress({
    onLongPress: openContextMenu,
  })

  const { width, height } = calculateMemeDimensions(meme, 800, 600)

  // The snap boundaries should only recalculate when the active element changes.
  // That is, when the user will be moving/resizing something.
  const snapBoundaries = useMemo(
    () =>
      getSnapBoundaries([
        { x: 0, y: 0, width, height },
        ...meme.images.filter(({ id }) => id !== activeElementId),
      ]),
    [activeElementId], // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <>
      <div ref={contextMenuRootRef}>
        <MemeContextMenu {...memeContextMenuProps} />
        <MemeImageContextMenu {...imageContextMenuProps} />
      </div>
      <AdjustableView
        contentWidth={width}
        contentHeight={height}
        zoom={zoom}
        onZoom={z => dispatch(setZoom(z))}
      >
        <TransformControlsRoot ref={transformControlsRootRef} />
        <MemeContainer
          {...longPressHandlers}
          style={{
            width,
            height,
          }}
          onClick={evt => {
            // Deselect any active element if clicking on the canvas background
            if (evt.target === evt.currentTarget) {
              dispatch(setActiveElementId(null))
            }
          }}
          onContextMenu={evt => {
            evt.preventDefault()
            if (!isTouchDevice) openContextMenu(evt)
          }}
        >
          {meme.images.map(image => (
            <MemeCanvasImage key={image.id} image={image} snapBoundaries={snapBoundaries} />
          ))}
        </MemeContainer>
      </AdjustableView>
    </>
  )
}
