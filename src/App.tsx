import styled from 'styled-components'
import { MemeContainer } from './containers/MemeContainer'
import { LayerContainer } from './containers/LayerContainer'

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`
const MainContent = styled.div`
  flex: 1;
  max-width: calc(100% - 480px);
`

const Sidebar = styled.div`
  flex: 0 0 480px;
  border-left: 1px solid ${props => props.theme.colors.primaryBorder};
`

function App() {
  return (
    <Container>
      <MainContent>
        <MemeContainer />
      </MainContent>
      <Sidebar>
        <LayerContainer />
      </Sidebar>
    </Container>
  )
}

export default App
