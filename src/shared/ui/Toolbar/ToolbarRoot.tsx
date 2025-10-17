import React, { useState, useMemo, type JSX } from "react"
import styled from "styled-components"

export type ToolbarPosition = "top" | "bottom"

export interface ToolbarRootContextValue {
  root: HTMLElement
  toolbarPosition: ToolbarPosition
}

export const ToolbarRootContext = React.createContext<ToolbarRootContextValue>({
  root: document.body,
  toolbarPosition: "top",
})

export const ToolbarRootContainer = styled.div`
  overflow-x: auto;
`
export interface ToolbarRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export const ToolbarRoot = ({ children, ...props }: ToolbarRootProps): JSX.Element => {
  const toolbarPosition = useMemo(
    () =>
      getComputedStyle(document.documentElement).getPropertyValue("--toolbar-position") || "top",
    [],
  ) as ToolbarPosition
  const [root, setRootElement] = useState<HTMLElement>(document.body)
  const toolbarRootContainer = (
    <ToolbarRootContainer
      ref={node => {
        if (node) setRootElement(node)
      }}
      {...props}
    />
  )

  return (
    <>
      {toolbarPosition === "top" && toolbarRootContainer}
      <ToolbarRootContext.Provider value={{ root, toolbarPosition }}>
        {children}
      </ToolbarRootContext.Provider>
      {toolbarPosition === "bottom" && toolbarRootContainer}
    </>
  )
}
