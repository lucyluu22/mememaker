import "react-contexify/dist/ReactContexify.css"

import type { JSX } from "react"
import styled from "styled-components"

import { Menu, Item, Separator, useContextMenu } from "react-contexify"
import { Icon } from "src/shared/ui/Icon"
import { BiClipboard, BiImageAlt, BiText, BiExport } from "react-icons/bi"

const CONTEXT_MENU_ID = "meme-context-menu"

export const useMemeContextMenu = () =>
  useContextMenu({
    id: CONTEXT_MENU_ID,
  })

export const ThemedMenu = styled(Menu)`
  --contexify-zIndex: 666;
  --contexify-menu-minWidth: 220px;
  --contexify-menu-padding: 6px;
  --contexify-menu-radius: var(--border-radius);
  --contexify-menu-bgColor: var(--primary-color);
  --contexify-menu-shadow: var(--shadow);
  --contexify-menu-negatePadding: var(--contexify-menu-padding);

  --contexify-separator-color: var(--on-primary-color);
  --contexify-separator-margin: 0.2rem;
  --contexify-itemContent-padding: var(--button-padding);
  --contexify-activeItem-radius: var(--border-radius);
  --contexify-item-color: var(--on-primary-color);
  --contexify-activeItem-color: var(--on-secondary-color);
  --contexify-activeItem-bgColor: var(--secondary-color);
  --contexify-rightSlot-color: var(--on-primary-color);
  --contexify-activeRightSlot-color: var(--on-secondary-color);
  --contexify-arrow-color: var(--on-primary-color);
  --contexify-activeArrow-color: var(--on-secondary-color);

  &,
  .contexify {
    border: 1px solid var(--primary-color-border);
  }
`

const MenuIcon = styled(Icon)`
  margin-right: 0.5rem;
`

export interface ContextMenuProps {
  id?: string
  open: boolean
}

export const MemeContextMenu = (): JSX.Element => {
  return (
    <ThemedMenu id={CONTEXT_MENU_ID} animation="slide">
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
    </ThemedMenu>
  )
}
