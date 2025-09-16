import styled from "styled-components"

export const AdjustableViewContainer = styled.div<{ $isPanning: boolean }>`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: none;

  &,
  & * {
    ${props => (props.$isPanning ? "cursor: move !important;" : "")}
  }
`
