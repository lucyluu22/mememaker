/**
 * MemeLayerPropertiesContainer
 * Special layer that refers to the properties of the whole meme (width, height, etc).
 */

import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../../store'

import { LayerProperties } from '../../components/LayerProperties'

const mapState = (state: RootState) => ({
  foo: state.foo,
})

const mapDispatch = {
  toggleFoo: () => ({ type: 'TOGGLE_FOO' }),
}

const connector = connect(mapState, mapDispatch)

type MemeLayerPropertiesContainerProps = ConnectedProps<typeof connector>

export const MemeLayerPropertiesContainer = connector(({
  foo,
}: MemeLayerPropertiesContainerProps) => (
  <LayerProperties />
))
