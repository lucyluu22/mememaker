import type { JSX, PropsWithChildren, HTMLAttributes } from "react"
import ReactDom from "react-dom"
import { useRef, useEffect } from "react"
import styled, { keyframes } from "styled-components"

import { useBoundedCoordinates } from "../useBoundedCoordinates"

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: scale3d(1, 0.3, 1);
  }

  to {
    opacity: 1;
  }
`

const slideOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: scale3d(1, 0.3, 1);
  }
`

export type OpenDirection = "bottom" | "top"
export interface MenuProps<Context = undefined> {
  open: boolean
  x: number
  y: number
  openFrom?: OpenDirection
  context?: Context
  menuContainerProps?: HTMLAttributes<HTMLDivElement>
  onClose: (e?: Event) => void
}

const MenuContainer = styled.div<{ $open: boolean; $openFrom: OpenDirection }>`
  display: flex;
  flex-direction: column;
  position: fixed;
  background: var(--primary-color);
  color: var(--on-primary-color);
  border: 1px solid var(--primary-color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  min-width: 160px;
  padding: 0.25rem;
  z-index: var(--z-index-context-menu);
  animation: ${props => (props.$open ? slideIn : slideOut)} 0.3s;
  animation-fill-mode: forwards;
  transform-origin: ${props => props.$openFrom} center;
`

export const Menu = ({
  open,
  x,
  y,
  openFrom = "bottom",
  menuContainerProps,
  onClose,
  children,
}: PropsWithChildren<MenuProps>): JSX.Element | null => {
  const menuRef = useRef<HTMLDivElement>(null)

  if (open && menuRef.current?.style.display === "none") {
    menuRef.current.style.display = ""
  }

  const { x: boundX, y: boundY } = useBoundedCoordinates({
    x,
    y,
    origin: openFrom,
    boundedElement: menuRef,
    recalcDeps: [open],
  })

  // Handle close on outside interaction
  useEffect(() => {
    if (!open) return
    const handleClose = (e: Event) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose(e)
      }
    }

    document.addEventListener("mousedown", handleClose)
    document.addEventListener("touchstart", handleClose)
    return () => {
      document.removeEventListener("mousedown", handleClose)
      document.removeEventListener("touchstart", handleClose)
    }
  }, [open, onClose])

  return ReactDom.createPortal(
    <MenuContainer
      $open={open}
      $openFrom={openFrom}
      ref={menuRef}
      style={{ top: boundY, left: boundX }}
      tabIndex={-1}
      role="menu"
      aria-hidden={!open}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      onAnimationEnd={() => !open && (menuRef.current!.style.display = "none")}
      {...menuContainerProps}
    >
      {children}
    </MenuContainer>,
    document.body,
  )
}
