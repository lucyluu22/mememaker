import styled from "styled-components"

export const TRANSFORM_CONTROLS_ROOT_ID = "__TRANSFORM_CONTROLS_ROOT__"

// Intended to be rendered as a sibling to any transformable elements
// This allows the UI to inherit the same layout context (position, transforms, etc) as the elements
export const TransformControlsRoot = styled.div.attrs({
  id: TRANSFORM_CONTROLS_ROOT_ID,
})`
  position: relative;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
`
