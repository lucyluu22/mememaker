import { useRef, type JSX } from "react"
import styled from "styled-components"

import type { MemeImage } from "src/entities/meme"
import type { SnapBoundaries } from "src/shared/ui/TransformControls"
import { useAppSelector, useAppDispatch } from "src/app/hooks"
import { TransformControls } from "src/shared/ui/TransformControls"
import { Icon } from "src/shared/ui/Icon"
import { BiImageAlt } from "react-icons/bi"

import { updateImage, selectOrderIndexById } from "../model/memeSlice"
import {
  selectIsActiveElement,
  selectInverseZoomScale,
  setActiveElementId,
} from "../model/memeCanvasSlice"

import { MemeCanvasToolbar } from "./MemeCanvasToolbar"
import { MemeImageContextMenu, useMemeImageContextMenu } from "./ContextMenu/MemeImageContextMenu"
import { PREVENT_DESELECT_CLASS } from "./constants"

const Image = styled.img`
  position: absolute;
`

export interface MemeCanvasImageProps {
  snapBoundaries: SnapBoundaries
  image: MemeImage
}

export const MemeCanvasImage = ({
  snapBoundaries,
  image: { id, url, x, y, width, height, naturalWidth, naturalHeight, opacity },
}: MemeCanvasImageProps): JSX.Element => {
  const hasInteracted = useRef(false)

  const isActive = useAppSelector(state => selectIsActiveElement(state, id))
  const inverseZoomScale = useAppSelector(selectInverseZoomScale)
  const orderIndex = useAppSelector(state => selectOrderIndexById(state, id))
  const dispatch = useAppDispatch()

  const [openImageContextMenu, closeImageContextMenu, imageContextMenuProps] =
    useMemeImageContextMenu()

  const moveImageHandler = (x: number, y: number) => {
    hasInteracted.current = true
    dispatch(updateImage({ id, x, y }))
  }

  const resizeImageHandler = (width: number, height: number) => {
    hasInteracted.current = true
    dispatch(updateImage({ id, width, height }))
  }

  return (
    <>
      <MemeImageContextMenu
        {...imageContextMenuProps}
        imageId={id}
        menuContainerProps={{ className: PREVENT_DESELECT_CLASS }}
      />
      <MemeCanvasToolbar
        id={id}
        menuButton={
          <Icon>
            <BiImageAlt />
          </Icon>
        }
        menuProps={imageContextMenuProps}
        onOpenContextMenu={openImageContextMenu}
        onCloseContextMenu={closeImageContextMenu}
      />
      <TransformControls
        active={isActive}
        x={x}
        y={y}
        width={width}
        height={height}
        scale={inverseZoomScale}
        snapBoundaries={snapBoundaries}
        ratio={naturalWidth / naturalHeight}
        zIndex={orderIndex}
        onMove={moveImageHandler}
        onResize={resizeImageHandler}
      >
        <Image
          src={url}
          style={{
            top: y,
            left: x,
            width,
            height,
            opacity,
            zIndex: orderIndex,
          }}
          onClick={() => {
            dispatch(isActive ? setActiveElementId(null) : setActiveElementId(id))
          }}
          onTouchStart={evt => {
            if (isActive) {
              evt.stopPropagation()
            }
          }}
          onContextMenu={evt => {
            evt.preventDefault()
            evt.stopPropagation()
            openImageContextMenu({ x: evt.clientX, y: evt.clientY })
          }}
        />
      </TransformControls>
    </>
  )
}
