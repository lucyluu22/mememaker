import styled from "styled-components"

export const MenuItem = styled.button<{ disabled?: boolean }>`
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

  &:hover:not(:disabled) {
    background: var(--secondary-color);
    color: var(--on-secondary-color);
  }
`
