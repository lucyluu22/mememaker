import styled from 'styled-components'

export default styled.hr`
  margin: 16px;
  padding: 0;
  border: none;
  border-bottom: 1px solid ${props => props.theme.colors.onPrimaryDark};
`
