/**
 * MemeView
 * The render container for current meme.
 */

import type { JSX } from "react"
import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "src/app/hooks"

import { AdjustableView } from "src/shared/ui/AdjustableView"

import { setZoom, selectZoom } from "../model/memeViewSlice"

const Container = styled.div`
  height: 100%;
  width: 100%;
`

const Meme = styled.div`
  width: 800px;
  height: 600px;
  background: white;
`

export const MemeView = (): JSX.Element => {
  const zoom = useAppSelector(selectZoom)
  const dispatch = useAppDispatch()

  return (
    <Container>
      <AdjustableView
        contentWidth={800}
        contentHeight={600}
        zoom={zoom}
        onZoom={z => dispatch(setZoom(z))}
      >
        <Meme />
      </AdjustableView>
    </Container>
  )
}
