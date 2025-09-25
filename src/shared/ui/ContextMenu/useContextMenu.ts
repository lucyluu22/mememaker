import type { MouseEvent, TouchEvent } from "react"
import { useCallback, useState } from "react"
import type { MenuProps } from "./Menu"

export type ContextMenuOpenHandlerParams<Context = undefined> = Context extends undefined
  ? {
      event: MouseEvent | TouchEvent
    }
  : {
      event: MouseEvent | TouchEvent
      context: Context
    }

export type ContextMenuOpenHandler<Context = undefined> = (
  args: ContextMenuOpenHandlerParams<Context>,
) => void

export type ContextMenuCloseHandler = () => void

export interface UseContextMenuOptions {
  contextMenuProps?: Partial<MenuProps>
}

export type UseContextMenuReturn<Context = undefined> = [
  ContextMenuOpenHandler<Context>,
  ContextMenuCloseHandler,
  MenuProps<Context>,
]

export const useContextMenu = <Context = undefined>({
  contextMenuProps,
}: UseContextMenuOptions = {}): UseContextMenuReturn<Context> => {
  const [openState, setOpenState] = useState<boolean>(false)
  const [x, setX] = useState<number>(0)
  const [y, setY] = useState<number>(0)
  const [currentContext, setCurrentContext] = useState<Context>()

  return [
    contextMenuOpenParams => {
      const { event } = contextMenuOpenParams
      if ("clientX" in event && "clientY" in event) {
        setX(event.clientX)
        setY(event.clientY)
      } else if ("touches" in event) {
        setX(event.touches[0].clientX)
        setY(event.touches[0].clientY)
      }

      if ("context" in contextMenuOpenParams) {
        setCurrentContext(contextMenuOpenParams.context)
      }

      setOpenState(true)
    },
    () => {
      setOpenState(false)
    },
    {
      onClose: useCallback(() => {
        setOpenState(false)
      }, []),
      open: openState,
      x,
      y,
      context: currentContext,
      ...contextMenuProps,
    },
  ]
}
