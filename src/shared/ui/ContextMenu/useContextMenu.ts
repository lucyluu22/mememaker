import { useCallback, useState, useRef } from "react"
import type { MenuProps, OpenDirection } from "./Menu"

export type ContextMenuOpenOptions =
  | { x: number; y: number; parentElement?: undefined; openFrom?: OpenDirection }
  | { parentElement: HTMLElement; x?: undefined; y?: undefined; openFrom?: OpenDirection }

export type ContextMenuOpenHandler = (options: ContextMenuOpenOptions) => void

export type ContextMenuCloseHandler = () => void

export interface UseContextMenuOptions {
  contextMenuProps?: Partial<MenuProps>
}

export type UseContextMenuReturn = [ContextMenuOpenHandler, ContextMenuCloseHandler, MenuProps]

export const useContextMenu = ({
  contextMenuProps,
}: UseContextMenuOptions = {}): UseContextMenuReturn => {
  const [openState, setOpenState] = useState<boolean>(false)
  const [x, setX] = useState<number>(0)
  const [y, setY] = useState<number>(0)
  const [openFrom, setOpenFrom] = useState<OpenDirection>("top")
  const parentElementRef = useRef<HTMLElement | null>(null)

  return [
    options => {
      if (options.parentElement) {
        parentElementRef.current = options.parentElement
        const rect = options.parentElement.getBoundingClientRect()
        setX(rect.left)
        if (options.openFrom === "bottom") {
          setY(rect.top)
        } else {
          setY(rect.bottom)
        }
      } else {
        parentElementRef.current = null
        setX(options.x)
        setY(options.y)
      }

      if (options.openFrom) {
        setOpenFrom(options.openFrom)
      }

      setOpenState(true)
    },
    () => {
      setOpenState(false)
    },
    {
      onClose: useCallback(evt => {
        if (evt && parentElementRef.current) {
          // ignore clicks on the parent element that opened the menu
          if (parentElementRef.current.contains(evt.target as Node)) return
        }
        setOpenState(false)
      }, []),
      open: openState,
      x,
      y,
      openFrom,
      ...contextMenuProps,
    },
  ]
}
