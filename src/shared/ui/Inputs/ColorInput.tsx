import type { JSX } from "react"
import styled from "styled-components"
import { RangeInput } from "./RangeInput"

export interface ColorInputProps {
  color?: string
  label?: string
  alpha?: boolean
  alphaLabel?: string
  onChange: (color: string) => void
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

export const ColorInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(var(--spacing-unit) * 2);
  width: 100%;
`

export const ColorInputSwatch = styled.span`
  display: inline-block;
  position: relative;
  height: 1.5rem;
  width: 1.5rem;
  border: 1px solid var(--primary-color-contrast);
  border-radius: var(--border-radius);
  background: var(--current-color);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    border-radius: var(--border-radius);
    background: repeating-linear-gradient(45deg, #bbb 0 25%, #fff 0 50%);
    background-size: 1rem 1rem;
  }
`

export const ColorInputLabel = styled.label`
  position: relative;
  display: inline-flex;
  gap: calc(var(--spacing-unit) * 2);
  align-items: center;
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

export const AlphaRangeInput = styled(RangeInput)``

export const ColorInput = ({
  color = "#000000",
  label,
  onChange,
  inputProps,
  alpha = false,
  alphaLabel = `${label ?? ""} Opacity`.trim(),
}: ColorInputProps): JSX.Element => {
  return (
    <ColorInputContainer>
      <ColorInputLabel>
        <HTMLColorInput
          value={color.slice(0, 7)}
          onChange={e => {
            if (alpha) {
              const alphaHex = color.slice(7, 9) || "ff"
              onChange(e.target.value + alphaHex)
            } else {
              onChange(e.target.value)
            }
          }}
          {...inputProps}
        />
        <ColorInputSwatch
          style={
            {
              "--current-color": color,
            } as React.CSSProperties
          }
        />
        {label}
      </ColorInputLabel>
      {alpha && (
        <AlphaRangeInput
          title="Opacity"
          aria-label={alphaLabel}
          min={0}
          max={255}
          step={1}
          value={parseInt(color.slice(7, 9) || "ff", 16)}
          onChange={evt => {
            const alphaHex = Number(evt.target.value).toString(16).padStart(2, "0")
            onChange(color.slice(0, 7) + alphaHex)
          }}
        />
      )}
    </ColorInputContainer>
  )
}
