import type { JSX } from "react"
import styled, { css } from "styled-components"

export interface RangeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  min?: number
  max?: number
  value: number
}

const RangeInputLabel = styled.label`
  width: 100%;
  display: inline-flex;
  align-items: center;
  gap: calc(var(--spacing-unit) * 2);
  height: var(--thumb-size);
`

const track = css`
  box-sizing: border-box;
  border: none;
  border-radius: var(--border-radius);
  width: 100%;
  height: calc(var(--thumb-size) * 0.25);
  background: var(--on-primary-color);
`

const thumb = css`
  box-sizing: border-box;
  border: none;
  width: var(--thumb-size);
  height: var(--thumb-size);
  border-radius: 50%;
  background: var(--secondary-color);
`

const fill = css`
  height: calc(var(--thumb-size) * 0.25);
  background: var(--secondary-color);
  border-radius: var(--border-radius);
`

const HTMLRangeInput = styled.input.attrs({ type: "range" })`
  --range: calc(var(--max) - var(--min));
  --ratio: calc((var(--val) - var(--min)) / var(--range));
  --sx: calc(0.5 * var(--thumb-size) + var(--ratio) * (100% - var(--thumb-size)));
  width: 100%;
  background: transparent;
  margin: 0;
  padding: 0;

  &,
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
  }

  &::-webkit-slider-runnable-track {
    ${track}
    background: linear-gradient(var(--secondary-color), var(--secondary-color)) 0/var(--sx) 100% no-repeat var(--on-primary-color);
  }
  &::-moz-range-track {
    ${track}
  }
  &::-ms-track {
    ${track}
  }

  &::-moz-range-progress {
    ${fill}
  }
  &::-ms-fill-lower {
    ${fill}
  }

  &::-webkit-slider-thumb {
    margin-top: calc(
      (var(--spacing-unit) - var(--thumb-size)) / 2
    ); /* Centers the thumb on the track */
    ${thumb}
  }
  &::-moz-range-thumb {
    ${thumb}
  }
  &::-ms-thumb {
    ${thumb}
  }
`

export const RangeInput = ({
  label,
  className,
  min = 0,
  max = 100,
  value,
  ...props
}: RangeInputProps): JSX.Element => (
  <RangeInputLabel className={className}>
    {label}
    <HTMLRangeInput
      min={min}
      max={max}
      value={value}
      style={{ "--min": min, "--max": max, "--val": value } as React.CSSProperties}
      {...props}
    />
  </RangeInputLabel>
)
