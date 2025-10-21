import type { JSX } from "react"
import React, { useState } from "react"
import styled from "styled-components"

export const TransformControlsRootContext = React.createContext<HTMLElement>(document.body)

// Intended to be rendered as a sibling to any transformable elements
// This allows the UI to inherit the same layout context (position, transforms, etc) as the elements
export const TransformControlsRootContainer = styled.div`
  position: relative;
  z-index: var(--transform-controls-z-index);
`
export interface TransformControlsRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export const TransformControlsRoot = ({
  children,
  ...props
}: TransformControlsRootProps): JSX.Element => {
  const [root, setRootElement] = useState<HTMLElement>(document.body)
  return (
    <>
      <TransformControlsRootContainer
        ref={node => {
          if (node) setRootElement(node)
        }}
        {...props}
      />
      <TransformControlsRootContext.Provider value={root}>
        {children}
      </TransformControlsRootContext.Provider>
    </>
  )
}
