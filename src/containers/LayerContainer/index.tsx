/**
 * LayerContainer
 * Displays and manages the active image and text layers for the meme.
 */

import styled from 'styled-components'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../../store'

const Container = styled.div`
  width: 100%;
  height: 100%;
`
const mapState = (state: RootState) => ({
  foo: state.foo,
})

const mapDispatch = {
  toggleFoo: () => ({ type: 'TOGGLE_FOO' }),
}

const connector = connect(mapState, mapDispatch)

type LayerContainerProps = ConnectedProps<typeof connector>

export const LayerContainer = connector(({
  foo,
}: LayerContainerProps) => (
  <Container />
))
