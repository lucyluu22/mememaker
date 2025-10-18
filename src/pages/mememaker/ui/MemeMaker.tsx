import type { JSX } from "react"
import styled from "styled-components"

import { MemeCanvas } from "./MemeCanvas"

declare const __APP_VERSION__: string

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  user-select: none;
`
const Main = styled.main`
  flex: 1;
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
        <Title title="MemeMaker was taken">
          MemeMakr <VersionTag>v{__APP_VERSION__}</VersionTag>
        </Title>
      </header>
      <Main>
        <MemeCanvas />
      </Main>
    </Container>
  )
}
