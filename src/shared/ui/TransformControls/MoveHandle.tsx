import type { JSX } from "react"
import styled from "styled-components"
import { Handle as BaseHandle } from "./Handle"
import { BiMove } from "react-icons/bi"

const Handle = styled(BaseHandle)`
  font-size: calc(var(--transform-handle-size) * 1.5);
  width: calc(var(--transform-handle-size) * 2);
  height: calc(var(--transform-handle-size) * 2);
  cursor: move;
`

export const MoveHandle = (handleProps: React.ComponentProps<typeof Handle>): JSX.Element => {
  return (
    <Handle {...handleProps}>
      <BiMove />
    </Handle>
  )
}
