import type { JSX } from "react"
import { useRef, useEffect } from "react"
import styled from "styled-components"

export interface TextEditorProps {
  value: string // HTML string
  className?: string
  textBoxProps?: React.HTMLAttributes<HTMLDivElement>
  onChange: (html: string) => void
}

const TextBox = styled.div.attrs({ contentEditable: true, suppressContentEditableWarning: true })`
  width: 100%;
  height: 100%;
  font-size: 1rem;
  color: black;
  user-select: text;
  -webkit-user-select: text;
  -webkit-touch-callout: default;

  p {
    margin: 0;
    padding: 0;
  }
`

export const TextEditor = ({
  value,
  className,
  textBoxProps,
  onChange,
}: TextEditorProps): JSX.Element => {
  const editorRef = useRef<HTMLDivElement>(null)

  // Keep the content in sync with the value prop
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  // Handle user edits
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  return <TextBox ref={editorRef} className={className} onInput={handleInput} {...textBoxProps} />
}
