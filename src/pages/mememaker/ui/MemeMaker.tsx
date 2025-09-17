import type { JSX } from "react"
import styled from "styled-components"

import { useLongPress } from "src/shared/ui/useLongPress"
import { MemeView } from "src/features/view-meme"
import {
  useMemeContextMenu,
  MemeContextMenu,
} from "src/features/meme-context-menu"

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
  font-size: 2rem;
`

const VersionTag = styled.span`
  font-size: 1rem;
`

export const MemeMaker = (): JSX.Element => {
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches

  const { show: showMemeContextMenu } = useMemeContextMenu()
  const longPressHandlers = useLongPress({
    onLongPress: event => {
      showMemeContextMenu({ event })
    },
  })

  return (
    <Container
      onTouchStart={longPressHandlers.onTouchStart}
      onTouchEnd={longPressHandlers.onTouchEnd}
      onTouchMove={longPressHandlers.onTouchMove}
      onContextMenu={evt => {
        evt.preventDefault()
        if (!isTouchDevice) {
          showMemeContextMenu({ event: evt })
        }
      }}
    >
      <MemeContextMenu />
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
