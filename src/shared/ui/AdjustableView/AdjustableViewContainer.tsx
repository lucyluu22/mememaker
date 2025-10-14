import styled from "styled-components"

export const AdjustableViewContainer = styled.div<{ $isPanning: boolean }>`
  position: relative;
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;

  &,
  & * {
    ${props => (props.$isPanning ? "cursor: move !important;" : "")}
  }
`
