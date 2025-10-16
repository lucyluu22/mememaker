import { type JSX } from "react"
import { useAppSelector } from "src/app/hooks"
import { Toolbar, type ToolbarProps } from "src/shared/ui/Toolbar"
import { Button } from "src/shared/ui/Inputs"
import { Icon } from "src/shared/ui/Icon"
import { BiMenu } from "react-icons/bi"
import type {
  ContextMenuOpenHandler,
  ContextMenuCloseHandler,
  MenuProps,
} from "src/shared/ui/ContextMenu"

import { selectIsActiveElement } from "../model/memeCanvasSlice"
import { PREVENT_DESELECT_CLASS } from "./constants"

export {
  ToolbarRoot as MemeCanvasToolbarRoot,
  ToolbarRootContext as MemeCanvasToolbarRootContext,
} from "src/shared/ui/Toolbar"

export interface MemeCanvasToolbarProps {
  id: string | null
  menuButtonContent?: JSX.Element
  menuButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
  menuProps: MenuProps
  onOpenContextMenu: ContextMenuOpenHandler
  onCloseContextMenu: ContextMenuCloseHandler
  toolbarProps?: ToolbarProps
  children?: React.ReactNode
}

export const MemeCanvasToolbar = ({
  id,
  menuButtonProps = {},
  menuButtonContent = (
    <Icon>
      <BiMenu />
    </Icon>
  ),
  menuProps,
  onOpenContextMenu,
  onCloseContextMenu,
  toolbarProps,
  children,
}: MemeCanvasToolbarProps): JSX.Element | null => {
  const isActive = useAppSelector(state => selectIsActiveElement(state, id))
  if (!isActive) return null
  return (
    <Toolbar className={PREVENT_DESELECT_CLASS} {...toolbarProps}>
      <Button
        onClick={evt => {
          if (menuProps.open) {
            onCloseContextMenu()
          } else {
            onOpenContextMenu({
              parentElement: evt.currentTarget,
            })
          }
        }}
        {...menuButtonProps}
      >
        {menuButtonContent}
      </Button>
      {children}
    </Toolbar>
  )
}
