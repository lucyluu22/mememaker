import styled from 'styled-components'
import { MemeContainer } from './containers/MemeContainer'
import { LayerContainer } from './containers/LayerContainer'

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

const LayerSidebar = styled.div`
  flex: 0 0 480px;
  border-left: 1px solid ${props => props.theme.colors.primaryBorder}
`

function App() {
  return (
    <Container>
      <MemeContainer />
      <LayerSidebar>
        <LayerContainer />
      </LayerSidebar>
    </Container>
  )
}

export default App
