import { type JSX } from "react"
import styled from "styled-components"

import type { MemeImage } from "src/entities/meme"
import type { SnapBoundaries } from "src/shared/ui/TransformControls"
import { useAppSelector, useAppDispatch } from "src/app/hooks"
import { TransformControls } from "src/shared/ui/TransformControls"

import { updateImage } from "../model/memeSlice"
import {
  selectIsActiveElement,
  selectInverseZoomScale,
  setActiveElementId,
} from "../model/memeCanvasSlice"

const Image = styled.img`
  position: absolute;
`

export interface MemeCanvasImageProps {
  snapBoundaries: SnapBoundaries
  image: MemeImage
}

export const MemeCanvasImage = ({
  snapBoundaries,
  image: { id, url, x, y, width, height, naturalWidth, naturalHeight },
}: MemeCanvasImageProps): JSX.Element => {
  const isActive = useAppSelector(state => selectIsActiveElement(state, id))
  const inverseZoomScale = useAppSelector(selectInverseZoomScale)
  const dispatch = useAppDispatch()

  const moveImageHandler = (x: number, y: number) => {
    dispatch(updateImage({ id, x, y }))
  }
  const resizeImageHandler = (width: number, height: number) => {
    dispatch(updateImage({ id, width, height }))
  }

  return (
    <TransformControls
      active={isActive}
      x={x}
      y={y}
      width={width}
      height={height}
      scale={inverseZoomScale}
      snapBoundaries={snapBoundaries}
      ratio={naturalWidth / naturalHeight}
      onMove={moveImageHandler}
      onResize={resizeImageHandler}
      onSelect={() => dispatch(setActiveElementId(id))}
    >
      <Image
        src={url}
        style={{
          top: y,
          left: x,
          width,
          height,
        }}
      />
    </TransformControls>
  )
}
