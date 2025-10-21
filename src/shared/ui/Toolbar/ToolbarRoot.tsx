import React, { useState, type JSX } from "react"
import styled from "styled-components"

export type ToolbarPosition = "top" | "bottom"

export interface ToolbarRootContextValue {
  root: HTMLElement
}

export const ToolbarRootContext = React.createContext<ToolbarRootContextValue>({
  root: document.body,
})

export const ToolbarRootContainer = styled.div`
  position: absolute;
  max-width: 100%;
  opacity: 0.6;
  overflow-x: auto;
  transition: opacity 0.2s ease-in-out;
  z-index: var(--toolbar-z-index);
  top: var(--toolbar-position-top, 0);
  bottom: var(--toolbar-position-bottom, auto);

  &:hover,
  &:focus-within {
    opacity: 1;
  }
`
export interface ToolbarRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export const ToolbarRoot = ({ children, ...props }: ToolbarRootProps): JSX.Element => {
  const [root, setRootElement] = useState<HTMLElement>(document.body)

  return (
    <>
      <ToolbarRootContainer
        ref={node => {
          if (node) setRootElement(node)
        }}
        {...props}
      />
      <ToolbarRootContext.Provider value={{ root }}>{children}</ToolbarRootContext.Provider>
    </>
  )
}
