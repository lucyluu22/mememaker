import type { JSX } from "react"
import { BiClipboard, BiImageAlt, BiText, BiExport } from "react-icons/bi"

import {
  Menu,
  Item,
  Separator,
  MenuIcon,
  useContextMenu,
} from "src/shared/ui/ContextMenu"

const CONTEXT_MENU_ID = "meme-context-menu"

export const useMemeContextMenu = () => useContextMenu({ id: CONTEXT_MENU_ID })

export const MemeContextMenu = (): JSX.Element => {
  return (
    <Menu id={CONTEXT_MENU_ID}>
      <Item>
        <MenuIcon>
          <BiClipboard />
        </MenuIcon>
        Paste
      </Item>
      <Item>
        <MenuIcon>
          <BiImageAlt />
        </MenuIcon>
        Add Image
      </Item>
      <Item>
        <MenuIcon>
          <BiText />
        </MenuIcon>
        Add Text
      </Item>
      <Separator />
      <Item>
        <MenuIcon>
          <BiExport />
        </MenuIcon>
        Export To Image
      </Item>
    </Menu>
  )
}
