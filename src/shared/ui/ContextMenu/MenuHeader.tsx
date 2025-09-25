import styled from "styled-components"

export interface MenuHeaderProps {
  children: React.ReactNode
  className?: string
}

export const MenuHeader = styled.h2<MenuHeaderProps>`
  display: block;
  flex: 1;
  margin: 0;
  padding: var(--spacing-unit);
  color: var(--on-primary-color);
  font-weight: bold;
  font-size: 1rem;
  letter-spacing: 0.02em;
  white-space: nowrap;
`
