import type { JSX } from "react"
import styled from "styled-components"
import { Button } from "src/shared/ui/Inputs"
import { Icon } from "src/shared/ui/Icon"
import { BiImageAdd, BiText, BiClipboard } from "react-icons/bi"
import { useCommonMemeHandlers } from "./useCommonMemeHandlers"

const NoContentContainer = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const ActionsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-unit);
  padding: 0 var(--spacing-unit);
`

export const MemeCanvasNoContent = (): JSX.Element => {
  const { addImage, addText, paste } = useCommonMemeHandlers()
  return (
    <NoContentContainer>
      <ActionsRow>
        <Button as="label" title="Add Image" role="button">
          <Icon>
            <BiImageAdd />
          </Icon>
          Image
          <input
            onChange={e => {
              if (e.target.files) {
                const image = e.target.files[0]
                void addImage(image)
              }
            }}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
          />
        </Button>
        <Button
          onClick={() => {
            addText()
          }}
          title="Add Text"
        >
          <Icon>
            <BiText />
          </Icon>
          Text
        </Button>
        <Button
          onClick={() => {
            void paste()
          }}
          title="Paste from Clipboard"
        >
          <Icon>
            <BiClipboard />
          </Icon>
          Paste
        </Button>
      </ActionsRow>
    </NoContentContainer>
  )
}
