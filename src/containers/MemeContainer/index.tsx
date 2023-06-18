/**
 * MemeContainer
 * The working area for current meme. Creates a HTML representation of the meme that will be
 * rendered.
 */

import styled from 'styled-components'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../../store'

import { AdjustableView } from '../../components/AdjustableView'

const Container = styled.div`
  height: 100%;
  width: 100%;
  background: repeating-linear-gradient(
    -45deg,
    ${props => props.theme.colors.primary},
    ${props => props.theme.colors.primary} 5px,
    ${props => props.theme.colors.primaryDark} 5px,
    ${props => props.theme.colors.primaryDark} 10px
  );
`

const Meme = styled.div`
  width: 3200px;
  height: 2400px;
  background: white;
`

const mapState = (state: RootState) => ({
  foo: state.foo,
})

const mapDispatch = {
  toggleFoo: () => ({ type: 'TOGGLE_FOO' }),
}

const connector = connect(mapState, mapDispatch)

type MemeContainerProps = ConnectedProps<typeof connector>

export const MemeContainer = connector(({
  foo,
}: MemeContainerProps) => (
  <Container>
    <AdjustableView contentHeight={2400} contentWidth={3200}>
      <Meme />
    </AdjustableView>
  </Container>
))
