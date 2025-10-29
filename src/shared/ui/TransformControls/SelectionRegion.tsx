import type { JSX, CSSProperties } from "react"
import { useRef } from "react"
import styled from "styled-components"

export interface SelectionRegionProps extends React.HTMLAttributes<HTMLDivElement> {
  active: boolean
  x: number
  y: number
  width: number
  height: number
  scale?: number
  zIndex?: number
  children?: React.ReactNode
}

const Region = styled.div<{ $active: boolean }>`
  position: absolute;
  pointer-events: none;
  z-index: ${props => (props.$active ? `99999` : `var(--z-index)`)};
  box-shadow:
    0 0 0 calc(var(--scale) * 1) var(--transform-region-border-color, white),
    0 0 0 calc(var(--scale) * 3) var(--transform-region-color, black),
    0 0 0 calc(var(--scale) * 4) var(--transform-region-border-color, white);
  box-shadow: ${props => (props.$active ? "" : "none")};
`

export const SelectionRegion = ({
  active,
  x,
  y,
  width,
  height,
  scale = 1,
  zIndex = 0,
  children,
  ...regionProps
}: SelectionRegionProps): JSX.Element | null => {
  const selectionBox = useRef<HTMLDivElement>(null)

  if (!active) return null
  return (
    <Region
      {...regionProps}
      ref={selectionBox}
      style={
        {
          width,
          height,
          top: y,
          left: x,
          "--scale": `${String(scale)}px`,
          "--z-index": zIndex,
          ...regionProps.style,
        } as CSSProperties
      }
      $active={active}
    >
      {children}
    </Region>
  )
}
