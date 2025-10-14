import { noop } from "lodash"
import React from "react"
import { flushSync } from "react-dom"
import { createRoot } from "react-dom/client"
import type { CSSProperties } from "styled-components"

import type { TextValue } from "./getDefaultTextValue"
import { TextEditor } from "./TextEditor"

export interface CalculateTextBoxSizeOptions {
  padding?: CSSProperties["padding"] // extra padding to add to the calculated size
  maxWidth?: CSSProperties["maxWidth"] // max width to constrain the text box
}

/**
 * Renders the TextEditor offscreen and returns the width/height needed to fit the text.
 */
export function calculateTextBoxSize(
  value: TextValue,
  { padding = "0 1rem", maxWidth = window.innerWidth * 0.9 }: CalculateTextBoxSizeOptions = {},
): { width: number; height: number } {
  // Create an offscreen container
  const container = document.createElement("div")
  container.style.position = "absolute"
  container.style.visibility = "hidden"
  container.style.pointerEvents = "none"
  container.style.width = "auto"
  container.style.height = "auto"
  document.body.appendChild(container)
  const root = createRoot(container)

  try {
    const editorRef = React.createRef<HTMLDivElement>()
    flushSync(() => {
      root.render(
        <TextEditor
          ref={editorRef}
          value={value}
          onChange={noop}
          textBoxProps={{ style: { padding, maxWidth } }}
        />,
      )
    })

    const bounds = editorRef.current?.getBoundingClientRect()
    return {
      width: Math.ceil(bounds?.width ?? 0),
      height: Math.ceil(bounds?.height ?? 0),
    }
  } finally {
    // Clean up
    root.unmount()
    document.body.removeChild(container)
  }
}
