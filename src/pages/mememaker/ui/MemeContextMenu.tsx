import type { JSX } from "react"
import { BiClipboard, BiImageAlt, BiText, BiExport } from "react-icons/bi"

import type { MenuProps } from "src/shared/ui/ContextMenu"
import { Menu, MenuItem, Separator, MenuIcon, useContextMenu } from "src/shared/ui/ContextMenu"

export interface MemeContextMenuProps {
  contextMenuProps: MenuProps
  onAddImage: (file: string, naturalWidth: number, naturalHeight: number) => void
}

export const useMemeContextMenu = useContextMenu

export const MemeContextMenu = ({
  contextMenuProps,
  onAddImage,
}: MemeContextMenuProps): JSX.Element => {
  return (
    <Menu {...contextMenuProps}>
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
