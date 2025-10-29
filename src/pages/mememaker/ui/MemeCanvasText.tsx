import { type JSX } from "react"
import styled from "styled-components"

import type { MemeText } from "src/entities/meme"
import type { SnapBoundaries } from "src/shared/ui/TransformControls"
import { useAppSelector, useAppDispatch } from "src/app/hooks"

import { TransformControls } from "src/shared/ui/TransformControls"
import { TextEditor, TextEditorInputs, type TextValue } from "src/shared/ui/TextEditor"
import { Icon } from "src/shared/ui/Icon"
import { BiText } from "react-icons/bi"
import { MemeCanvasToolbar } from "./MemeCanvasToolbar"
import { MemeTextContextMenu, useMemeTextContextMenu } from "./ContextMenu/MemeTextContextMenu"

import { updateText, selectOrderIndexById } from "../model/memeSlice"
import {
  selectIsActiveElement,
  selectInverseZoomScale,
  setActiveElementId,
} from "../model/memeCanvasSlice"

import { PREVENT_DESELECT_CLASS } from "./constants"

const MemeTextEditor = styled(TextEditor)`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  overflow: hidden;
`

export interface MemeCanvasTextProps {
  snapBoundaries: SnapBoundaries
  text: MemeText
}

export const MemeCanvasText = ({
  snapBoundaries,
  text: { id, textEditorValue, x, y, width, height, backgroundColor },
}: MemeCanvasTextProps): JSX.Element => {
  const isActive = useAppSelector(state => selectIsActiveElement(state, id))
  const inverseZoomScale = useAppSelector(selectInverseZoomScale)
  const orderIndex = useAppSelector(state => selectOrderIndexById(state, id))
  const dispatch = useAppDispatch()

  const [openTextContextMenu, closeTextContextMenu, textContextMenuProps] = useMemeTextContextMenu()

  const moveTextHandler = (x: number, y: number) => {
    dispatch(updateText({ id, x, y }))
  }
  const resizeTextHandler = (width: number, height: number) => {
    dispatch(updateText({ id, width, height }))
  }
  const handleTextChange = (newTextEditorValue: TextValue) => {
    dispatch(updateText({ id, textEditorValue: newTextEditorValue }))
  }

  return (
    <>
      <MemeTextContextMenu {...textContextMenuProps} textId={id} />
      <MemeCanvasToolbar
        id={id}
        name="Text"
        menuButtonContent={
          <Icon>
            <BiText />
          </Icon>
        }
        menuProps={textContextMenuProps}
        onOpenContextMenu={openTextContextMenu}
        onCloseContextMenu={closeTextContextMenu}
      >
        <TextEditorInputs
          bold={textEditorValue.bold}
          italic={textEditorValue.italic}
          underline={textEditorValue.underline}
          strikethrough={textEditorValue.strikethrough}
          fontFamily={textEditorValue.fontFamily}
          fontSize={textEditorValue.fontSize}
          onBoldChange={bold => {
            handleTextChange({ ...textEditorValue, bold })
          }}
          onItalicChange={italic => {
            handleTextChange({ ...textEditorValue, italic })
          }}
          onUnderlineChange={underline => {
            handleTextChange({ ...textEditorValue, underline })
          }}
          onStrikethroughChange={strikethrough => {
            handleTextChange({ ...textEditorValue, strikethrough })
          }}
          onFontFamilyChange={fontFamily => {
            handleTextChange({ ...textEditorValue, fontFamily })
          }}
          onFontSizeChange={fontSize => {
            handleTextChange({ ...textEditorValue, fontSize })
          }}
        />
      </MemeCanvasToolbar>
      <TransformControls
        active={isActive}
        x={x}
        y={y}
        width={width}
        height={height}
        scale={inverseZoomScale}
        snapBoundaries={snapBoundaries}
        zIndex={orderIndex}
        hasMoveHandle={true}
        onMove={moveTextHandler}
        onResize={resizeTextHandler}
        moveHandleProps={{
          onTouchStart: evt => {
            if (isActive) {
              // Stop propagation to prevent canvas panning while moving the text
              evt.stopPropagation()
            }
          },
        }}
      >
        <MemeTextEditor
          value={textEditorValue}
          className={PREVENT_DESELECT_CLASS}
          onChange={handleTextChange}
          textBoxProps={{
            style: {
              top: y,
              left: x,
              width,
              height,
              background: backgroundColor,
              zIndex: orderIndex,
            },
            onClick: () => {
              dispatch(setActiveElementId(id))
            },
            onContextMenu: evt => {
              if (isActive) {
                evt.preventDefault()
                evt.stopPropagation()
                openTextContextMenu({ x: evt.clientX, y: evt.clientY })
              }
            },
          }}
        />
      </TransformControls>
    </>
  )
}
