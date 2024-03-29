/**
 * MemeLayerPropertiesContainer
 * Special layer that refers to the properties of the whole meme (width, height, etc).
 */

import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../../store'

import { LayerProperties } from '../../components/LayerProperties'
import { Grid, GridItem } from '../../components/Grid'
import { Input } from '../../components/Input'

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
  <LayerProperties>
    <Grid columns={['1fr', '1fr', '4rem']}>
      <GridItem>
        <Input
          label="Width"
          type="number"
          addonRight="px"
        />
      </GridItem>
      <GridItem>
        <Input
          label="Height"
          type="number"
          addonRight="px"
        />
      </GridItem>
      <GridItem>
        <Input
          label="Zoom"
          type="number"
          addonRight="%"
        />
      </GridItem>
    </Grid>
  </LayerProperties>
))
