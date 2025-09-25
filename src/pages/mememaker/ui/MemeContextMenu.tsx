import type { JSX } from "react"
import { BiClipboard, BiImageAlt, BiText, BiExport } from "react-icons/bi"
import { useAppDispatch } from "src/app/hooks"

import { setActiveElementId } from "../model/memeCanvasSlice"
import { addImage } from "../model/memeSlice"

import type { MenuProps } from "src/shared/ui/ContextMenu"
import {
  Menu,
  MenuHeader,
  MenuItem,
  Separator,
  MenuIcon,
  useContextMenu,
} from "src/shared/ui/ContextMenu"

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

  return (
    <Menu {...contextMenuProps}>
      <MenuHeader>Meme</MenuHeader>
      <MenuItem>
        <MenuIcon>
          <BiClipboard />
        </MenuIcon>
        Paste
      </MenuItem>
      <MenuItem as="label">
        <MenuIcon>
          <BiImageAlt />
        </MenuIcon>
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
      <MenuItem>
        <MenuIcon>
          <BiText />
        </MenuIcon>
        Add Text
      </MenuItem>
      <Separator />
      <MenuItem>
        <MenuIcon>
          <BiExport />
        </MenuIcon>
        Export To Image
      </MenuItem>
    </Menu>
  )
}
