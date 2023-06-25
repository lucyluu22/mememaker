import styled from 'styled-components'
import { MemeContainer } from './containers/MemeContainer'
import { LayerContainer } from './containers/LayerContainer'

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    -45deg,
    ${props => props.theme.colors.primary},
    ${props => props.theme.colors.primary} 5px,
    ${props => props.theme.colors.primaryDark} 5px,
    ${props => props.theme.colors.primaryDark} 10px
  );
`

const MainContent = styled.div`
  flex: 1;
  max-width: calc(100% - 420px);
`

const Sidebar = styled.div`
  flex: 0 0 420px;
  background: transparent;
`

const Title = styled.h1`
  margin: 0;
  padding: 0;
  font-size: 1.25rem;
`

const VersionTag = styled.span`
  font-size: 50%;
`

function App() {
  return (
    <Container>
      <MainContent>
        <MemeContainer />
      </MainContent>
      <Sidebar>
        <Title>
          MemeMaker
          {' '}
          <VersionTag>v1.0.0</VersionTag>
        </Title>
        <LayerContainer />
      </Sidebar>
    </Container>
  )
}

export default App
