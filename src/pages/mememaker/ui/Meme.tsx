import type { JSX, CSSProperties } from "react"

import styled from "styled-components"

import type { MemeState } from "src/entities/meme"

interface MemeProps {
  meme: MemeState
  width?: number
  height?: number
}
interface MemeContainerVars {
  "--meme-width": string
  "--meme-height": string
}

interface MemeImageVars {
  "--image-width": string
  "--image-height": string
  "--image-x": string
  "--image-y": string
}

const MemeContainer = styled.div`
  position: relative;
  width: var(--meme-width);
  height: var(--meme-height);
  background: white;
`

const MemeImage = styled.img`
  position: absolute;
  top: var(--image-x);
  left: var(--image-y);
  width: var(--image-width);
  height: var(--image-height);
`

export const Meme = ({ meme, width = 800, height = 600 }: MemeProps): JSX.Element => {
  return (
    <MemeContainer
      style={
        {
          "--meme-width": `${String(width)}px`,
          "--meme-height": `${String(height)}px`,
        } satisfies MemeContainerVars as CSSProperties
      }
    >
      {meme.images.map(image => {
        return (
          <MemeImage
            style={
              {
                "--image-width": `${String(image.scaledWidth)}px`,
                "--image-height": `${String(image.scaledHeight)}px`,
                "--image-x": `${String(image.x)}px`,
                "--image-y": `${String(image.y)}px`,
              } satisfies MemeImageVars as CSSProperties
            }
            src={image.url}
          />
        )
      })}
    </MemeContainer>
  )
}
