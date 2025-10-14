/**
 * TextEditor
 * A simple rich text editor component using a contenteditable div.
 * Formats are applied to the entire text content as this component is intended to contain only small text chunks (as typically seen in memes).
 */

import type { JSX, RefObject } from "react"
import { useRef, useEffect } from "react"
import styled from "styled-components"

import type { TextValue } from "./getDefaultTextValue"

export interface TextEditorProps {
  ref?: RefObject<HTMLDivElement | null>
  value: TextValue
  className?: string
  textBoxProps?: React.HTMLAttributes<HTMLDivElement>
  onChange: (text: TextValue) => void
}

const TextBox = styled.div.attrs({ contentEditable: true, suppressContentEditableWarning: true })`
  width: 100%;
  height: 100%;
  font-size: 1rem;
  user-select: text;
  -webkit-user-select: text;
  -webkit-touch-callout: default;

  p {
    margin: 0;
    padding: 0;
  }
`

export const TextEditor = ({
  ref,
  value,
  className,
  textBoxProps = {},
  onChange,
}: TextEditorProps): JSX.Element => {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref && editorRef.current) {
      // forward the ref
      ref.current = editorRef.current
    }
  }, [ref, editorRef])

  // Keep the content of the contenteditable div in sync with the value prop
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value.html) {
      editorRef.current.innerHTML = value.html
    }
  }, [value])

  // Handle user edits
  const handleInput = () => {
    if (editorRef.current) {
      onChange({
        ...value,
        html: editorRef.current.innerHTML,
      })
    }
  }

  return (
    <TextBox
      {...textBoxProps}
      ref={editorRef}
      className={className}
      onInput={handleInput}
      style={{
        fontFamily: value.fontFamily,
        fontSize: value.fontSize,
        color: value.color,
        fontWeight: value.bold ? "bold" : "normal",
        fontStyle: value.italic ? "italic" : "normal",
        textDecoration:
          `${value.underline ? "underline" : ""} ${value.strikethrough ? "line-through" : ""}`.trim() ||
          "none",
        ...textBoxProps.style,
      }}
    />
  )
}
