import styled from "styled-components"
import { ToolbarContainer } from "./Toolbar"
import { TOOLBAR_ROOT_ID } from "./constants"

export const ToolbarRoot = styled.div.attrs({ id: TOOLBAR_ROOT_ID })`
  transition: min-height 0.2s;
  height: 0;
  min-height: 0;
  overflow-x: auto;

  &:has(> ${ToolbarContainer}) {
    min-height: calc(var(--toolbar-height, 0) + var(--spacing-unit) * 2);
  }
`
