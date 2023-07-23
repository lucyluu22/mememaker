import { uniqueId as uid } from 'lodash'
import { useRef, ReactNode } from 'react'
import styled from 'styled-components'

const InputContainer = styled.div`
  display: block;
`
const InputLabel = styled.label`
  display: block;
  height: 0.75rem;
  margin: 0 0 0.5rem 6px;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.onPrimary};
`

const InputControlContainer = styled.div`
  display: flex;
  overflow: hidden;
  border-radius: 6px;
`

const InputControl = styled.input<{ hasLeftAddon: boolean, hasRightAddon: boolean }>`
  flex: 1;
  flex-basis: auto;
  width: 0%;
  height: 2rem;
  margin: 0;
  padding: 0 0.5rem;
  padding-left: ${props => (props.hasLeftAddon ? '0' : '')};
  padding-right: ${props => (props.hasRightAddon ? '0' : '')};
  text-align: right;
  font-size: 1rem;
  font-family: inherit;
  color: ${props => props.theme.colors.onPrimary};
  background-color: ${props => props.theme.colors.primaryLight};
  border: none;

  &:focus,
  &:invalid {
    outline: none;
    box-shadow: none;
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }
  &[type='number']::-webkit-inner-spin-button,
  &[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

const InputAddon = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0 0.5rem;
  color: ${props => props.theme.colors.onPrimary};
  background-color: ${props => props.theme.colors.primaryLight};
  user-select: none;
  white-space: nowrap;

  &:first-child {
    padding-right: 0.25rem;
  }

  &:last-child {
    padding-left: 0.25rem;
  }
`

type InputProps = {
  label: string,
  type?: string,
  addonLeft?: ReactNode,
  addonRight?: ReactNode,
}

export function Input({
  label,
  type = 'text',
  addonLeft = null,
  addonRight = null,
}: InputProps) {
  const inputId = useRef(uid('input-'))

  return (
    <InputContainer>
      <InputLabel htmlFor={inputId.current}>{label}</InputLabel>
      <InputControlContainer>
        {addonLeft && <InputAddon htmlFor={inputId.current}>{addonLeft}</InputAddon>}
        <InputControl
          id={inputId.current}
          type={type}
          hasLeftAddon={!!addonLeft}
          hasRightAddon={!!addonRight}
        />
        {addonRight && <InputAddon htmlFor={inputId.current}>{addonRight}</InputAddon>}
      </InputControlContainer>
    </InputContainer>
  )
}
