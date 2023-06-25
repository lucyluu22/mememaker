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
`

const Meme = styled.div`
  width: 800px;
  height: 600px;
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
    <AdjustableView contentHeight={600} contentWidth={800}>
      <Meme />
    </AdjustableView>
  </Container>
))
