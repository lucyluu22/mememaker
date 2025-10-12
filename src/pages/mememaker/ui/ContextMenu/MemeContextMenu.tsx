import type { JSX } from "react"
import { BiClipboard, BiImageAlt, BiText, BiExport } from "react-icons/bi"
import { useAppDispatch } from "src/app/hooks"

import { setActiveElementId } from "../../model/memeCanvasSlice"
import { addImage, addText } from "../../model/memeSlice"

import type { MenuProps } from "src/shared/ui/ContextMenu"
import { Menu, MenuHeader, MenuItem, Separator, useContextMenu } from "src/shared/ui/ContextMenu"
import { Icon } from "src/shared/ui/Icon"

export const useMemeContextMenu = useContextMenu

export const MemeContextMenu = (contextMenuProps: MenuProps): JSX.Element => {
  const dispatch = useAppDispatch()

  const onAddImage = (url: string, naturalWidth: number, naturalHeight: number) => {
    const addImageAction = addImage({
      url,
      naturalWidth,
      naturalHeight,
    })
    dispatch(addImageAction)
    dispatch(setActiveElementId(addImageAction.payload.id))
    contextMenuProps.onClose()
  }

  const onAddText = () => {
    const addTextAction = addText()
    dispatch(addTextAction)
    dispatch(setActiveElementId(addTextAction.payload.id))
    contextMenuProps.onClose()
  }

  return (
    <Menu {...contextMenuProps}>
      <MenuHeader>Meme</MenuHeader>
      <MenuItem>
        <Icon>
          <BiClipboard />
        </Icon>
        Paste
      </MenuItem>
      <MenuItem as="label">
        <Icon>
          <BiImageAlt />
        </Icon>
        Add Image
        <input
          key={String(contextMenuProps.open)} // rerender when context menu opens
          onChange={e => {
            if (e.target.files) {
              const image = e.target.files[0]
              void (async () => {
                const bitmap = await createImageBitmap(image)
                const fileUrl = URL.createObjectURL(image)
                onAddImage(fileUrl, bitmap.width, bitmap.height)
                bitmap.close()
              })()
            }
          }}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
        />
      </MenuItem>
      <MenuItem onClick={onAddText}>
        <Icon>
          <BiText />
        </Icon>
        Add Text
      </MenuItem>
      <Separator />
      <MenuItem>
        <Icon>
          <BiExport />
        </Icon>
        Export To Image
      </MenuItem>
    </Menu>
  )
}
