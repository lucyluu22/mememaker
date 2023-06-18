import { useRef } from 'react'
import { usePrevious, useTimeout } from 'react-use'
import styled, { keyframes } from 'styled-components'

const fadeAway = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`

const Indicator = styled.div<{ hide: boolean | null }>`
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 5rem;
  padding: 1rem;
  font-size: 1rem;
  text-align: center;
  background-color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primaryBorder};
  z-index: 1;
  transform: translateX(-50%) translateY(-50%);
  pointer-events: none;
  animation-name: ${props => (props.hide ? fadeAway : 'none')};
  animation-duration: 0.5s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
`

type AdjustableViewScalerProps = {
  zoom?: number,
  showFor?: number,
}

function AdjustableViewZoomIndicator({ zoom = 100, showFor = 1000 }: AdjustableViewScalerProps) {
  const renderIndicator = useRef(false)
  const prevZoom = usePrevious(zoom) || zoom
  const [hideIndicator, , restartHideTimer] = useTimeout(showFor)

  if (zoom !== prevZoom) {
    restartHideTimer()
    // This is to prevent the indicator briefly showing up on first load.
    // Only render the indicator once the zoom changes.
    renderIndicator.current = true
  }

  if (renderIndicator.current) {
    return (
      <Indicator hide={hideIndicator()}>
        {zoom}
        %
      </Indicator>
    )
  }

  return null
}

export default AdjustableViewZoomIndicator
