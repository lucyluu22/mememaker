import type { JSX, PropsWithChildren } from "react"
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

export interface MenuProps<Context = undefined> {
  open: boolean
  x: number
  y: number
  context?: Context
  menuContainerProps?: React.HTMLAttributes<HTMLDivElement>
  onClose: () => void
}

const MenuContainer = styled.div<{ $open: boolean }>`
  display: flex;
  flex-direction: column;
  position: fixed;
  background: var(--primary-color);
  color: var(--on-primary-color);
  border: 1px solid var(--primary-color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  min-width: 160px;
  padding: var(--spacing-unit);
  z-index: var(--z-index-context-menu);
  animation: ${props => (props.$open ? slideIn : slideOut)} 0.3s;
  animation-fill-mode: forwards;
  transform-origin: top center;
`

export const Menu = ({
  open,
  x,
  y,
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
    boundedElement: menuRef,
    recalcDeps: [open],
  })

  // Handle close on outside interaction
  useEffect(() => {
    if (!open) return
    const handleClose = (e: Event) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClose)
    document.addEventListener("touchstart", handleClose)
    return () => {
      document.removeEventListener("mousedown", handleClose)
      document.removeEventListener("touchstart", handleClose)
    }
  }, [open, onClose])

  return (
    <MenuContainer
      $open={open}
      ref={menuRef}
      style={{ top: boundY, left: boundX }}
      tabIndex={-1}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      onAnimationEnd={() => !open && (menuRef.current!.style.display = "none")}
      {...menuContainerProps}
    >
      {children}
    </MenuContainer>
  )
}
