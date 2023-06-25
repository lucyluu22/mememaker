import styled from 'styled-components'

export type ExtraPaddingProp = {
  top?: number,
  right?: number,
  bottom?: number,
  left?: number,
}

const applyPadding = ({
  top = 0, right = 0, bottom = 0, left = 0,
}) => `calc(2rem + ${top}px) calc(2rem + ${right}px) calc(2rem + ${bottom}px) calc(2rem + ${left}px)`

export default styled.div<{ extraPadding: ExtraPaddingProp }>`
  margin: auto;
  padding: ${props => applyPadding(props.extraPadding)};
  transition: padding 0.5s;
`
