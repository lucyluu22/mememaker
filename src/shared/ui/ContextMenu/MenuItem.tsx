import type React from "react"
import styled from "styled-components"
export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean
  $danger?: boolean
}

export const MenuItem = styled.button<MenuItemProps>`
  display: block;
  flex: 1;
  padding: var(--button-padding);
  background: none;
  border: none;
  border-radius: var(--border-radius);
  text-align: left;
  color: inherit;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  font: inherit;
  white-space: nowrap;

  ${props =>
    props.$danger &&
    `
    color: var(--context-color-danger);
  `}

  &:hover:not(:disabled) {
    background: var(--secondary-color);
    color: var(--on-secondary-color);

    ${props =>
      props.$danger &&
      `
      background: var(--context-color-danger);
      color: var(--on-context-color-danger);
    `}
  }
`
