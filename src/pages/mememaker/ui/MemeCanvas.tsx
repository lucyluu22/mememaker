import type { JSX } from "react"
import { useEffect, useMemo } from "react"

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
import { MemeCanvasText } from "./MemeCanvasText"

import { calculateMemeDimensions } from "../helpers/calculateMemeDimensions"
import { PREVENT_DESELECT_CLASS } from "./constants"
import { ToolbarRoot } from "src/shared/ui/Toolbar"

const MemeContainer = styled.div`
  position: relative;
  background: white;
`

export const MemeCanvas = (): JSX.Element => {
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches

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
      const blacklist = document.getElementsByClassName(PREVENT_DESELECT_CLASS)

      if (evt.button === 0 && Array.from(blacklist).every(el => !el.contains(evt.target as Node))) {
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
  const memeLayers = useMemo(() => [...meme.images, ...meme.text], [meme.images, meme.text])
  const snapBoundaries = useMemo(
    () =>
      getSnapBoundaries([
        { x: 0, y: 0, width, height },
        { x: width / 2, y: height / 2, width: 0, height: 0 }, // center point
        ...memeLayers.filter(({ id }) => id !== activeElementId),
      ]),
    [activeElementId], // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <>
      <MemeContextMenu
        {...memeContextMenuProps}
        menuContainerProps={{ className: PREVENT_DESELECT_CLASS }}
      />
      <MemeImageContextMenu
        {...imageContextMenuProps}
        menuContainerProps={{ className: PREVENT_DESELECT_CLASS }}
      />
      <ToolbarRoot className={PREVENT_DESELECT_CLASS} />
      <AdjustableView
        contentWidth={width}
        contentHeight={height}
        zoom={zoom}
        onZoom={z => dispatch(setZoom(z))}
      >
        <TransformControlsRoot className={PREVENT_DESELECT_CLASS} />
        <MemeContainer
          {...longPressHandlers}
          style={{
            width,
            height,
          }}
          onContextMenu={evt => {
            evt.preventDefault()
            if (!isTouchDevice) openContextMenu(evt)
          }}
        >
          {meme.images.map(image => (
            <MemeCanvasImage key={image.id} image={image} snapBoundaries={snapBoundaries} />
          ))}
          {meme.text.map(text => (
            <MemeCanvasText key={text.id} text={text} snapBoundaries={snapBoundaries} />
          ))}
        </MemeContainer>
      </AdjustableView>
    </>
  )
}
