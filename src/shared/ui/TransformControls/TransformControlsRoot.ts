import styled from "styled-components"

export const TRANSFORM_CONTROLS_ROOT_ID = "_transform-controls-root"

// Intended to be rendered as a sibling to any transformable elements
// This allows the UI to inherit the same layout context (position, transforms, etc) as the elements
export const TransformControlsRoot = styled.div.attrs({
  id: TRANSFORM_CONTROLS_ROOT_ID,
})`
  position: relative;
  z-index: var(--z-index-transform-controls);
`
