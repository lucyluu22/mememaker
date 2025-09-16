import type { JSX } from "react"
import styled, { keyframes } from "styled-components"

const fadeAway = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`

const Indicator = styled.div<{ $showFor: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 5rem;
  padding: 1rem;
  font-size: 1rem;
  text-align: center;
  background-color: var(--primary-color-darker);
  border: 1px solid var(--primary-color-border);
  border-radius: var(--border-radius);
  z-index: 1;
  transform: translateX(-50%) translateY(-50%);
  pointer-events: none;
  animation-name: ${fadeAway};
  animation-delay: ${props => props.$showFor}ms;
  animation-duration: 0.5s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
`

interface AdjustableViewScalerProps {
  zoom?: number
  showFor?: number
}

export const AdjustableViewZoomIndicator = ({
  zoom = 100,
  showFor = 1000,
}: AdjustableViewScalerProps): JSX.Element | null => {
  return (
    <Indicator key={zoom} $showFor={showFor}>
      {zoom}%
    </Indicator>
  )
}
