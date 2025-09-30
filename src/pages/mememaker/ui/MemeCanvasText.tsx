import { useRef, useState, type JSX } from "react"
import styled from "styled-components"

import type { MemeText } from "src/entities/meme"
import type { SnapBoundaries } from "src/shared/ui/TransformControls"
import { useAppSelector, useAppDispatch } from "src/app/hooks"

import { BiMove } from "react-icons/bi"
import { TransformControls } from "src/shared/ui/TransformControls"
import { TextEditor, TextEditorInputs } from "src/shared/ui/TextEditor"
import { Toolbar } from "src/shared/ui/Toolbar"
import { ToggleButton } from "src/shared/ui/Inputs"

import { updateText, selectOrderIndexById } from "../model/memeSlice"
import {
  selectIsActiveElement,
  selectInverseZoomScale,
  setActiveElementId,
} from "../model/memeCanvasSlice"

const MemeTextEditor = styled(TextEditor)`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`

export interface MemeCanvasTextProps {
  snapBoundaries: SnapBoundaries
  text: MemeText
}

export const MemeCanvasText = ({
  snapBoundaries,
  text: { id, html, x, y, width, height },
}: MemeCanvasTextProps): JSX.Element => {
  const hasInteracted = useRef(false)

  const isActive = useAppSelector(state => selectIsActiveElement(state, id))
  const inverseZoomScale = useAppSelector(selectInverseZoomScale)
  const orderIndex = useAppSelector(state => selectOrderIndexById(state, id))
  const dispatch = useAppDispatch()

  const [isMoving, setIsMoving] = useState(false)

  const moveTextHandler = (x: number, y: number) => {
    hasInteracted.current = true
    dispatch(updateText({ id, x, y }))
  }
  const resizeTextHandler = (width: number, height: number) => {
    hasInteracted.current = true
    dispatch(updateText({ id, width, height }))
  }
  const handleChange = (newHtml: string) => {
    dispatch(updateText({ id, html: newHtml }))
  }

  return (
    <>
      {isActive && (
        <Toolbar
          toolbarProps={{
            onTouchStart: evt => {
              // Yucky but React will propagate this to the parent component and enable panning on the canvas
              // So we have to break encapsulation a bit here
              evt.stopPropagation()
            },
          }}
        >
          <TextEditorInputs />
          <ToggleButton
            labelProps={{ title: "Move" }}
            checked={isMoving}
            onChange={() => {
              setIsMoving(!isMoving)
            }}
          >
            <BiMove />
          </ToggleButton>
        </Toolbar>
      )}
      <TransformControls
        active={isActive}
        x={x}
        y={y}
        width={width}
        height={height}
        scale={inverseZoomScale}
        snapBoundaries={snapBoundaries}
        zIndex={orderIndex}
        onMove={moveTextHandler}
        onResize={resizeTextHandler}
        allowMove={isMoving}
        selectionBoxProps={{
          onMouseDown: () => {
            hasInteracted.current = false
          },
          onTouchStart: () => {
            hasInteracted.current = false
          },
          onClick: () => {
            if (!hasInteracted.current) {
              dispatch(setActiveElementId(null))
            }
          },
        }}
      >
        <MemeTextEditor
          value={html}
          onChange={handleChange}
          textBoxProps={{
            style: {
              top: y,
              left: x,
              width,
              height,
              zIndex: orderIndex,
            },
            onMouseDown: evt => {
              evt.stopPropagation()
            },
            onTouchStart: evt => {
              evt.stopPropagation()
            },
            onClick: () => {
              dispatch(setActiveElementId(id))
            },
          }}
        />
      </TransformControls>
    </>
  )
}
