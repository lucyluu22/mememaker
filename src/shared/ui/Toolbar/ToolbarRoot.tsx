import React, { useState, type JSX } from "react"
import styled from "styled-components"

export const ToolbarRootContext = React.createContext<HTMLElement>(document.body)

export const ToolbarRootContainer = styled.div`
  overflow-x: auto;
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
      <ToolbarRootContext.Provider value={root}>{children}</ToolbarRootContext.Provider>
    </>
  )
}
