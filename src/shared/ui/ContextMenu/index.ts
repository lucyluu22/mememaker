import "react-contexify/dist/ReactContexify.css"

import styled from "styled-components"

import {
  Menu as ContextifyMenu,
  Item as ContextifyItem,
  Separator as ContextifySeparator,
  useContextMenu,
} from "react-contexify"
import { Icon } from "src/shared/ui/Icon"

export const Menu = styled(ContextifyMenu).attrs({ animation: "slide" })`
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

export const Item = styled(ContextifyItem)``

export const Separator = styled(ContextifySeparator)``

export const MenuIcon = styled(Icon)`
  margin-right: 0.5rem;
`

export { useContextMenu }
