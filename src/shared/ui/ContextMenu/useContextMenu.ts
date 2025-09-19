import type { MouseEvent, TouchEvent } from "react"
import { useState } from "react"
import type { MenuProps } from "./Menu"

export interface UseContextMenuOptions {
  contextMenuProps?: Partial<MenuProps>
}

export type ContextMenuOpenHandler = ({
  event,
}: {
  event: MouseEvent | TouchEvent
}) => void

export type ContextMenuCloseHandler = () => void

export type UseContextMenuReturn = [
  ContextMenuOpenHandler,
  ContextMenuCloseHandler,
  MenuProps,
]

export const useContextMenu = ({
  contextMenuProps,
}: UseContextMenuOptions = {}): UseContextMenuReturn => {
  const [openState, setOpenState] = useState<boolean>(false)
  const [x, setX] = useState<number>(0)
  const [y, setY] = useState<number>(0)

  return [
    ({ event }) => {
      if ("clientX" in event && "clientY" in event) {
        setX(event.clientX)
        setY(event.clientY)
      } else if ("touches" in event) {
        setX(event.touches[0].clientX)
        setY(event.touches[0].clientY)
      }
      setOpenState(true)
    },
    () => {
      setOpenState(false)
    },
    {
      onClose: () => {
        setOpenState(false)
      },
      open: openState,
      x,
      y,
      ...contextMenuProps,
    },
  ]
}
