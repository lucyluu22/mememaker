import styled from "styled-components"

export const AdjustableViewContent = styled.div`
  margin: auto;
  padding-top: var(--adjustable-view-content-padding-top, 1rem);
  padding-right: var(--adjustable-view-content-padding-right, 1rem);
  padding-bottom: var(--adjustable-view-content-padding-bottom, 1rem);
  padding-left: var(--adjustable-view-content-padding-left, 1rem);
  transition: padding 0.5s;
`
