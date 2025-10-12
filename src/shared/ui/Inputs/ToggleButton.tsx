// AKA a checkbox

import type { JSX } from "react"
import { styled } from "styled-components"
import { InputGroup } from "./InputGroup"
import { Button } from "./Button"

export interface ToggleButtonProps {
  checked: boolean
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
  onChange: (value: boolean) => void
  children: React.ReactNode
}

const CheckboxLabel = styled(Button).attrs({ as: "label" })`
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
