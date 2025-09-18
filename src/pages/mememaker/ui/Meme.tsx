import type { JSX, CSSProperties } from "react"

import styled from "styled-components"

import type { MemeState } from "src/entities/meme"

interface MemeProps {
  meme: MemeState
  defaultWidth?: number
  defaultHeight?: number
}

interface MemeContainerVars {
  "--meme-width": string
  "--meme-height": string
}

const MemeContainer = styled.div`
  width: var(--meme-width);
  height: var(--meme-height);
  background: white;
`

export const Meme = ({
  meme,
  defaultWidth = 800,
  defaultHeight = 600,
}: MemeProps): JSX.Element => {
  // Calculate width as the max x position plus the image's width
  const width =
    meme.images.length > 0
      ? Math.max(...meme.images.map(img => img.x + img.scaledWidth))
      : defaultWidth
  // Calculate height as the max y position plus the image's height
  const height =
    meme.images.length > 0
      ? Math.max(...meme.images.map(img => img.y + img.scaledHeight)) -
        Math.min(...meme.images.map(img => img.y))
      : defaultHeight

  return (
    <MemeContainer
      style={
        {
          "--meme-width": `${String(width)}px`,
          "--meme-height": `${String(height)}px`,
        } satisfies MemeContainerVars as CSSProperties
      }
    />
  )
}
