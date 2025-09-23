import type { JSX } from "react"
import { useMemo } from "react"

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

import { MemeCanvasImage } from "./MemeCanvasImage"

import { calculateMemeDimensions } from "../helpers/calculateMemeDimensions"

const MemeContainer = styled.div`
  position: relative;
  background: white;
`

export const MemeCanvas = (): JSX.Element => {
  const zoom = useAppSelector(selectZoom)
  const meme = useAppSelector(selectMeme)

  const activeElementId = useAppSelector(selectActiveElementId)
  const dispatch = useAppDispatch()

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
    <AdjustableView
      contentWidth={width}
      contentHeight={height}
      zoom={zoom}
      onZoom={z => dispatch(setZoom(z))}
    >
      <TransformControlsRoot />
      <MemeContainer
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
      >
        {meme.images.map(image => (
          <MemeCanvasImage key={image.id} image={image} snapBoundaries={snapBoundaries} />
        ))}
      </MemeContainer>
    </AdjustableView>
  )
}
