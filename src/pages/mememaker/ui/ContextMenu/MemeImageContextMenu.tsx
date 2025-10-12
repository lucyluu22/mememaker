import type { JSX } from "react"
import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "src/app/hooks"
import { BiLink, BiUnlink, BiMinusFront, BiMinusBack, BiCopy, BiTrash } from "react-icons/bi"

import type { MemeImage } from "src/entities/meme"
import type { MenuProps } from "src/shared/ui/ContextMenu"
import { Menu, MenuItem, useContextMenu, MenuHeader, Separator } from "src/shared/ui/ContextMenu"
import { Icon } from "src/shared/ui/Icon"

import { setActiveElementId } from "../../model/memeCanvasSlice"
import { removeImage, updateOrder, selectImageById, updateImage } from "../../model/memeSlice"

export interface MemeImageContextMenuProps extends MenuProps {
  imageId: MemeImage["id"]
}

const ImageDimensions = styled.span`
  display: block;
  margin-top: var(--spacing-unit);
  font-size: 0.8em;
  font-weight: normal;
`

const ImageDimensionRatioButton = styled(Icon).attrs({
  as: "button",
  title: "Reset Dimensions",
})`
  cursor: pointer;
`

export const useMemeImageContextMenu = useContextMenu

export const MemeImageContextMenu = ({
  imageId,
  ...contextMenuProps
}: MemeImageContextMenuProps): JSX.Element => {
  const image = useAppSelector(state => selectImageById(state, imageId))

  const dispatch = useAppDispatch()

  const onResetDimensions = () => {
    if (image) {
      dispatch(
        updateImage({ id: image.id, width: image.naturalWidth, height: image.naturalHeight }),
      )
      contextMenuProps.onClose()
    }
  }

  const onRemove = () => {
    dispatch(setActiveElementId(null))
    dispatch(removeImage(imageId))
    contextMenuProps.onClose()
  }

  const onSendToFront = () => {
    dispatch(updateOrder({ id: imageId }))
    contextMenuProps.onClose()
  }

  const onSendToBack = () => {
    dispatch(updateOrder({ id: imageId, index: 0 }))
    contextMenuProps.onClose()
  }

  return (
    <Menu {...contextMenuProps}>
      <MenuHeader>
        Image
        {image &&
          (() => {
            const ratio = image.width / image.height
            const naturalRatio = image.naturalWidth / image.naturalHeight
            return (
              <ImageDimensions>
                <strong>{Math.round(image.width)}</strong>({image.naturalWidth})px
                <ImageDimensionRatioButton onClick={onResetDimensions}>
                  {ratio === naturalRatio ? <BiLink /> : <BiUnlink />}
                </ImageDimensionRatioButton>
                <strong>{Math.round(image.height)}</strong>({image.naturalHeight})px
              </ImageDimensions>
            )
          })()}
      </MenuHeader>
      <MenuItem>
        <Icon>
          <BiCopy />
        </Icon>
        Copy
      </MenuItem>
      <MenuItem onClick={onSendToFront}>
        <Icon>
          <BiMinusFront />
        </Icon>
        Bring to Front
      </MenuItem>
      <MenuItem onClick={onSendToBack}>
        <Icon>
          <BiMinusBack />
        </Icon>
        Send to Back
      </MenuItem>
      <Separator />
      <MenuItem $danger onClick={onRemove}>
        <Icon>
          <BiTrash />
        </Icon>
        Delete
      </MenuItem>
    </Menu>
  )
}
