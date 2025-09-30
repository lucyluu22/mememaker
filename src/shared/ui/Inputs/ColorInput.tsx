import type { JSX } from "react"
import styled from "styled-components"

export interface ColorInputProps {
  color: string
  onChange: (color: string) => void
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

export const ColorInputLabel = styled.label`
  position: relative;
  height: var(--input-height);
  width: var(--input-height);
  box-shadow: 0 0 0 1px var(--contrast-color);
  border-radius: var(--border-radius);
  background: var(--current-color);
  cursor: pointer;
`

export const HTMLColorInput = styled.input.attrs({ type: "color" })`
  position: absolute;
  appearance: none;
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
  opacity: 0;
  cursor: pointer;
`

export const ColorInput = ({ color, onChange, inputProps }: ColorInputProps): JSX.Element => {
  return (
    <ColorInputLabel
      style={{ "--current-color": "black", "--contrast-color": "white" } as React.CSSProperties}
    >
      <HTMLColorInput
        value={color}
        onChange={e => {
          onChange(e.target.value)
        }}
        {...inputProps}
      />
    </ColorInputLabel>
  )
}
