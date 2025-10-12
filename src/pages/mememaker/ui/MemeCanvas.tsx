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

import { MemeContextMenu, useMemeContextMenu } from "./ContextMenu/MemeContextMenu"
import { MemeCanvasImage } from "./MemeCanvasImage"
import { MemeCanvasText } from "./MemeCanvasText"

import { calculateMemeDimensions } from "../helpers/calculateMemeDimensions"
import { PREVENT_DESELECT_CLASS } from "./constants"
import { MemeCanvasToolbar, MemeCanvasToolbarRoot } from "./MemeCanvasToolbar"

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const MemeContainer = styled.div`
  position: relative;
  background: white;
`

export const MemeCanvas = (): JSX.Element => {
  const zoom = useAppSelector(selectZoom)
  const meme = useAppSelector(selectMeme)

  const activeElementId = useAppSelector(selectActiveElementId)
  const dispatch = useAppDispatch()

  const [openMemeContextMenu, closeMemeContextMenu, memeContextMenuProps] = useMemeContextMenu()

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

  const { width, height } = calculateMemeDimensions(meme, 800, 600)

  // The snap boundaries should only recalculate when the active element changes.
  // That is, when the user will be moving/resizing something.
  const memeLayers = useMemo(() => [...meme.images, ...meme.texts], [meme.images, meme.texts])
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
    <CanvasContainer
      onContextMenu={evt => {
        evt.preventDefault()
        openMemeContextMenu({ x: evt.clientX, y: evt.clientY })
      }}
    >
      <MemeContextMenu
        {...memeContextMenuProps}
        menuContainerProps={{ className: PREVENT_DESELECT_CLASS }}
      />
      <MemeCanvasToolbarRoot>
        <MemeCanvasToolbar
          id={null}
          menuProps={memeContextMenuProps}
          onOpenContextMenu={openMemeContextMenu}
          onCloseContextMenu={closeMemeContextMenu}
        />
        <AdjustableView
          contentWidth={width}
          contentHeight={height}
          zoom={zoom}
          onZoom={z => dispatch(setZoom(z))}
        >
          <TransformControlsRoot className={PREVENT_DESELECT_CLASS} />
          <MemeContainer
            style={{
              width,
              height,
              background: meme.backgroundColor,
            }}
          >
            {meme.images.map(image => (
              <MemeCanvasImage key={image.id} image={image} snapBoundaries={snapBoundaries} />
            ))}
            {meme.texts.map(text => (
              <MemeCanvasText key={text.id} text={text} snapBoundaries={snapBoundaries} />
            ))}
          </MemeContainer>
        </AdjustableView>
      </MemeCanvasToolbarRoot>
    </CanvasContainer>
  )
}
