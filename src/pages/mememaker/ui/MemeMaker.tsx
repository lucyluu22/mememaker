import type { JSX } from "react"
import styled from "styled-components"

import { MemeView } from "src/features/view-meme/ui/MemeView"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
const Main = styled.main`
  flex: 1;
  overflow: hidden;
`

const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
`

const VersionTag = styled.span`
  font-size: 1rem;
`

export const MemeMaker = (): JSX.Element => {
  return (
    <Container>
      <header>
        <Title>
          MemeMaker <VersionTag>v1.0.0</VersionTag>
        </Title>
      </header>
      <Main>
        <MemeView />
      </Main>
    </Container>
  )
}
