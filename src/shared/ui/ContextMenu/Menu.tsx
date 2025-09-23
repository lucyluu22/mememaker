import type { JSX, PropsWithChildren } from "react"
import clamp from "lodash/clamp"
import { useRef, useState, useEffect, useLayoutEffect } from "react"
import styled, { keyframes } from "styled-components"

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

export interface MenuProps {
  open: boolean
  x: number
  y: number
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
  padding: 0.25rem;
  z-index: var(--z-index-context-menu);
  animation: ${props => (props.$open ? slideIn : slideOut)} 0.3s;
  animation-fill-mode: forwards;
  transform-origin: top center;
`

export const Menu = ({
  open,
  x,
  y,
  onClose,
  children,
}: PropsWithChildren<MenuProps>): JSX.Element | null => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [menuWidth, setMenuWidth] = useState<number>(0)
  const [menuHeight, setMenuHeight] = useState<number>(0)

  // Measure menu dimensions when it opens
  useLayoutEffect(() => {
    if (open && menuRef.current) {
      menuRef.current.style.display = ""
      setMenuWidth(menuRef.current.offsetWidth)
      setMenuHeight(menuRef.current.offsetHeight)
    }
  }, [open])

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

  // Bound x and y pos so the menu is always fully visible
  const boundX = clamp(x, 0, window.innerWidth - menuWidth)
  const boundY = clamp(y, 0, window.innerHeight - menuHeight)

  return (
    <MenuContainer
      $open={open}
      ref={menuRef}
      style={{ top: boundY, left: boundX }}
      tabIndex={-1}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      onAnimationEnd={() => !open && (menuRef.current!.style.display = "none")}
    >
      {children}
    </MenuContainer>
  )
}
