import type { JSX } from "react"
import styled from "styled-components"

import { MemeCanvas } from "./MemeCanvas"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  user-select: none;
`
const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const Title = styled.h1`
  margin: 0;
  padding: var(--spacing-unit);
  line-height: 1;
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
        <MemeCanvas />
      </Main>
    </Container>
  )
}
