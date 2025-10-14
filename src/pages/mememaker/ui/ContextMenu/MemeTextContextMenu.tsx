import type { JSX } from "react"
import { useAppDispatch, useAppSelector } from "src/app/hooks"
import { BiMinusFront, BiMinusBack, BiCopy, BiTrash } from "react-icons/bi"

import { copyMemeText, type MemeText } from "src/entities/meme"
import type { MenuProps } from "src/shared/ui/ContextMenu"
import { Menu, MenuItem, useContextMenu, MenuHeader, Separator } from "src/shared/ui/ContextMenu"
import { ColorInput } from "src/shared/ui/Inputs"
import { Icon } from "src/shared/ui/Icon"

import { setActiveElementId } from "../../model/memeCanvasSlice"
import { updateText, removeText, updateOrder, selectTextsById } from "../../model/memeSlice"

export interface MemeTextContextMenuProps extends MenuProps {
  textId: MemeText["id"]
}

export const useMemeTextContextMenu = useContextMenu

export const MemeTextContextMenu = ({
  textId,
  ...contextMenuProps
}: MemeTextContextMenuProps): JSX.Element | null => {
  const text = useAppSelector(state => selectTextsById(state, textId))
  const dispatch = useAppDispatch()

  if (!text) return null

  const onCopyText = async () => {
    await navigator.clipboard.write([
      new ClipboardItem({
        // text/plain is guaranteed to be supported across all browsers that support ClipboardItem
        "text/plain": JSON.stringify({
          type: "application/x-mememaker.memetext",
          data: copyMemeText(text),
        }),
      }),
    ])
    contextMenuProps.onClose()
  }

  const onRemove = () => {
    dispatch(setActiveElementId(null))
    dispatch(removeText(textId))
    contextMenuProps.onClose()
  }

  const onSendToFront = () => {
    dispatch(updateOrder({ id: textId }))
    contextMenuProps.onClose()
  }

  const onSendToBack = () => {
    dispatch(updateOrder({ id: textId, index: 0 }))
    contextMenuProps.onClose()
  }

  return (
    <Menu {...contextMenuProps}>
      <MenuHeader>Text</MenuHeader>
      <MenuItem as="div">
        <ColorInput
          alpha
          color={text.textEditorValue.color}
          label="Text Color"
          onChange={color => {
            dispatch(
              updateText({ id: textId, textEditorValue: { ...text.textEditorValue, color } }),
            )
          }}
        />
      </MenuItem>
      <MenuItem as="div">
        <ColorInput
          alpha
          color={text.backgroundColor}
          label="Background Color"
          onChange={color => {
            dispatch(updateText({ id: textId, backgroundColor: color }))
          }}
        />
      </MenuItem>
      <MenuItem onClick={() => void onCopyText()}>
        <Icon>
          <BiCopy />
        </Icon>
        Copy
      </MenuItem>
      <MenuItem onClick={onSendToFront}>
        <Icon>
          <BiMinusFront />
        </Icon>
        Bring to Front
      </MenuItem>
      <MenuItem onClick={onSendToBack}>
        <Icon>
          <BiMinusBack />
        </Icon>
        Send to Back
      </MenuItem>
      <Separator />
      <MenuItem $danger onClick={onRemove}>
        <Icon>
          <BiTrash />
        </Icon>
        Delete
      </MenuItem>
    </Menu>
  )
}
