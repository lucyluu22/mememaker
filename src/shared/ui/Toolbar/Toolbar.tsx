import { useContext, type JSX } from "react"
import ReactDOM from "react-dom"
import styled from "styled-components"
import { ToolbarRootContext } from "./ToolbarRoot"

export interface ToolbarProps {
  className?: string
  toolbarProps?: React.HTMLAttributes<HTMLDivElement>
  children: React.ReactNode
}

export const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: flex-start;
  width: fit-content;
  gap: var(--spacing-unit);
  color: var(--on-primary-color);
  background: transparent;
  padding: var(--spacing-unit);
`

export const Toolbar = ({ className, toolbarProps, children }: ToolbarProps): JSX.Element => {
  const { root } = useContext(ToolbarRootContext)
  return ReactDOM.createPortal(
    <ToolbarContainer className={className} {...toolbarProps}>
      {children}
    </ToolbarContainer>,
    root,
  )
}
