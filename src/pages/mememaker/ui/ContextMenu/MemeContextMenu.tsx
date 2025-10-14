import type { JSX } from "react"
import { BiClipboard, BiImageAdd, BiText, BiExport, BiCopy } from "react-icons/bi"
import { useAppDispatch, useAppSelector } from "src/app/hooks"

import { selectMemeBackgroundColor, updateBackgroundColor } from "../../model/memeSlice"

import type { MenuProps } from "src/shared/ui/ContextMenu"
import { Menu, MenuHeader, MenuItem, Separator, useContextMenu } from "src/shared/ui/ContextMenu"
import { Icon } from "src/shared/ui/Icon"
import { ColorInput } from "src/shared/ui/Inputs"
import { useCommonMemeHandlers } from "../useCommonMemeHandlers"

export const useMemeContextMenu = useContextMenu

export const MemeContextMenu = (contextMenuProps: MenuProps): JSX.Element => {
  const dispatch = useAppDispatch()
  const { addImage, addText, paste } = useCommonMemeHandlers()
  const backgroundColor = useAppSelector(selectMemeBackgroundColor)

  const onAddImage = async (image: Blob) => {
    await addImage(image)
    contextMenuProps.onClose()
  }

  const onAddText = () => {
    addText()
    contextMenuProps.onClose()
  }

  const onPaste = async () => {
    await paste()
    contextMenuProps.onClose()
  }

  return (
    <Menu {...contextMenuProps}>
      <MenuHeader>Meme</MenuHeader>
      <MenuItem as="label">
        <Icon>
          <BiImageAdd />
        </Icon>
        Add Image
        <input
          key={String(contextMenuProps.open)} // rerender when context menu opens
          onChange={e => {
            if (e.target.files) {
              const image = e.target.files[0]
              void onAddImage(image)
            }
          }}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
        />
      </MenuItem>
      <MenuItem
        onClick={() => {
          onAddText()
        }}
      >
        <Icon>
          <BiText />
        </Icon>
        Add Text
      </MenuItem>
      <MenuItem
        onClick={() => {
          void onPaste()
        }}
      >
        <Icon>
          <BiClipboard />
        </Icon>
        Paste
      </MenuItem>
      <MenuItem as="div">
        <ColorInput
          label="Background Color"
          color={backgroundColor}
          onChange={color => dispatch(updateBackgroundColor(color))}
        />
      </MenuItem>
      <Separator />
      <MenuItem>
        <Icon>
          <BiCopy />
        </Icon>
        Copy to Clipboard
      </MenuItem>
      <MenuItem>
        <Icon>
          <BiExport />
        </Icon>
        Save As
      </MenuItem>
    </Menu>
  )
}
