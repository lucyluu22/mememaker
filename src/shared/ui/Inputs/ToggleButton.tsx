// AKA a checkbox

import type { JSX } from "react"
import { styled } from "styled-components"
import { Icon } from "../Icon"
import { InputGroup } from "./InputGroup"

export interface ToggleButtonProps {
  checked: boolean
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
  onChange: (value: boolean) => void
  children: React.ReactNode
}

const CheckboxLabel = styled(Icon).attrs({ as: "label" })`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--input-height);
  width: var(--input-height);
  background: var(--primary-color);
  padding: 0;
  border: 1px solid var(--primary-color-border);
  border-radius: var(--border-radius);
  cursor: pointer;

  &:has(input[type="checkbox"]:checked) {
    background: var(--secondary-color);
    color: var(--on-secondary-color);
    border-color: var(--secondary-color-border);
  }

  ${InputGroup} & {
    border-radius: 0;
    &:first-child {
      border-top-left-radius: var(--border-radius);
      border-bottom-left-radius: var(--border-radius);
    }
    &:last-child {
      border-top-right-radius: var(--border-radius);
      border-bottom-right-radius: var(--border-radius);
    }
  }
`

export const ToggleButton = ({
  children,
  checked,
  onChange,
  labelProps,
}: ToggleButtonProps): JSX.Element => {
  return (
    <CheckboxLabel {...labelProps}>
      <input
        type="checkbox"
        style={{ display: "none" }}
        checked={checked}
        onChange={() => {
          onChange(!checked)
        }}
      />
      {children}
    </CheckboxLabel>
  )
}
