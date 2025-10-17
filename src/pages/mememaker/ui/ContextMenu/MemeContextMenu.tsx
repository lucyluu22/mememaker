import type { JSX } from "react"
import { BiClipboard, BiImageAdd, BiText, BiDownload, BiCopy, BiTrash } from "react-icons/bi"
import { useAppDispatch, useAppSelector } from "src/app/hooks"
import { domToBlob, createContext } from "modern-screenshot"
import workerUrl from "modern-screenshot/worker?url"

import {
  selectMemeBackgroundColor,
  selectMemeHasContent,
  updateBackgroundColor,
  reset as resetMeme,
} from "../../model/memeSlice"

import { MEME_ID, EXCLUDE_RENDER_CLASS } from "../constants"

import type { MenuProps } from "src/shared/ui/ContextMenu"
import { Menu, MenuHeader, MenuItem, Separator, useContextMenu } from "src/shared/ui/ContextMenu"
import { Icon } from "src/shared/ui/Icon"
import { ColorInput } from "src/shared/ui/Inputs"
import { useCommonMemeHandlers } from "../useCommonMemeHandlers"

export const useMemeContextMenu = useContextMenu

export const MemeContextMenu = (contextMenuProps: MenuProps): JSX.Element => {
  const dispatch = useAppDispatch()
  const { addImage, addText, paste } = useCommonMemeHandlers()
  const backgroundColor = useAppSelector(selectMemeBackgroundColor)
  const memeHasContent = useAppSelector(selectMemeHasContent)

  const renderMemeToImage = async () => {
    const memeElement = document.getElementById(MEME_ID)
    if (!memeElement) throw new Error("Meme container not found")
    const context = await createContext(memeElement, {
      workerUrl,
      workerNumber: 1,
      width: memeElement.clientWidth,
      height: memeElement.clientHeight,
      type: "image/png",
      filter: node =>
        !(node instanceof HTMLElement && node.classList.contains(EXCLUDE_RENDER_CLASS)),
    })

    // drawImageCount is used by the "fixSvgXmlDecode" feature in modern-screenshot as a hacky way
    // to get around webkit bugs with rendering images inside canvas.
    // Initialising this to 1 instead of 0 seems to fix safari issues with blank images upon first render.
    // It's a hacky solution to an already hacky solution!
    context.drawImageCount = 1

    return await domToBlob(context)
  }

  const onAddImage = async (image: Blob) => {
    await addImage(image)
    contextMenuProps.onClose()
  }

  const onAddText = () => {
    addText()
    contextMenuProps.onClose()
  }

  const onPaste = async () => {
    await paste()
    contextMenuProps.onClose()
  }

  const onCopyToClipboard = async () => {
    const imageBlob = await renderMemeToImage()
    await navigator.clipboard.write([
      new ClipboardItem({
        // image/png is guaranteed to be supported across all browsers that support ClipboardItem
        "image/png": imageBlob,
      }),
    ])
    contextMenuProps.onClose()
  }

  const onDownload = async () => {
    const imageBlob = await renderMemeToImage()
    const url = URL.createObjectURL(imageBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "meme.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    contextMenuProps.onClose()
  }

  return (
    <Menu {...contextMenuProps} menuContainerProps={{ "aria-label": "meme menu" }}>
      <MenuHeader>Meme</MenuHeader>
      <MenuItem as="label">
        <Icon>
          <BiImageAdd />
        </Icon>
        Add Image
        <input
          key={String(contextMenuProps.open)} // rerender when context menu opens
          onChange={e => {
            if (e.target.files) {
              const image = e.target.files[0]
              void onAddImage(image)
            }
          }}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
        />
      </MenuItem>
      <MenuItem
        onClick={() => {
          onAddText()
        }}
      >
        <Icon>
          <BiText />
        </Icon>
        Add Text
      </MenuItem>
      <MenuItem
        onClick={() => {
          void onPaste()
        }}
      >
        <Icon>
          <BiClipboard />
        </Icon>
        Paste
      </MenuItem>
      <MenuItem as="div">
        <ColorInput
          label="Background Color"
          color={backgroundColor}
          onChange={color => dispatch(updateBackgroundColor(color))}
        />
      </MenuItem>
      <Separator />
      <MenuItem disabled={!memeHasContent} onClick={() => void onCopyToClipboard()}>
        <Icon>
          <BiCopy />
        </Icon>
        Copy
      </MenuItem>
      <MenuItem disabled={!memeHasContent} onClick={() => void onDownload()}>
        <Icon>
          <BiDownload />
        </Icon>
        Download
      </MenuItem>
      <Separator />
      <MenuItem
        $danger
        disabled={!memeHasContent}
        onClick={() => {
          dispatch(resetMeme())
          contextMenuProps.onClose()
        }}
      >
        <Icon>
          <BiTrash />
        </Icon>
        Delete Meme
      </MenuItem>
    </Menu>
  )
}
