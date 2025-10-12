import styled from "styled-components"

export interface HandleProps {
  $top?: boolean
  $left?: boolean
  $right?: boolean
  $bottom?: boolean
  $scale?: number
}

const translateX = ({ $left, $right }: HandleProps): string => {
  let x = -50
  if ($left) x = -100
  if ($right) x = 0
  return `translateX(${String(x)}%)`
}

const translateY = ({ $top, $bottom }: HandleProps): string => {
  let y = -50
  if ($top) y = -100
  if ($bottom) y = 0
  return `translateY(${String(y)}%)`
}

export const Handle = styled.div.attrs<HandleProps>(props => ({
  style: {
    transformOrigin: `${props.$top ? "bottom" : ""} ${props.$bottom ? "top" : ""} ${props.$left ? "right" : ""} ${props.$right ? "left" : ""}`,
    transform: `${translateX(props)} ${translateY(props)} scale(${String(props.$scale)})`,
  },
}))`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: var(--transform-handle-size);
  height: var(--transform-handle-size);
  background: var(--transform-handle-color, black);
  color: var(--transform-handle-border-color, white);
  border: 1px solid var(--transform-handle-border-color, white);
  pointer-events: all;
  top: ${props => (props.$top ? "0" : "")};
  top: ${props => (props.$bottom ? "100%" : "")};
  top: ${props => (!props.$top && !props.$bottom ? "50%" : "")};
  left: ${props => (props.$left ? "0" : "")};
  left: ${props => (props.$right ? "100%" : "")};
  left: ${props => (!props.$left && !props.$right ? "50%" : "")};
`
