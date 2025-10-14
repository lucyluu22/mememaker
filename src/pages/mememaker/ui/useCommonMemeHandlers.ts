import { useAppDispatch } from "src/app/hooks"
import { setActiveElementId } from "../model/memeCanvasSlice"
import { addImage, addText } from "../model/memeSlice"
import { calculateTextBoxSize } from "src/shared/ui/TextEditor/calculateTextBoxSize"
import { getDefaultTextValue, type TextValue } from "src/shared/ui/TextEditor/getDefaultTextValue"
import { parseCopiedMemeImage, parseCopiedMemeText } from "src/entities/meme"

const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export const useCommonMemeHandlers = () => {
  const dispatch = useAppDispatch()

  const addImageHandler = async (image: Blob) => {
    const bitmap = await createImageBitmap(image)
    const url = URL.createObjectURL(image)
    const naturalWidth = bitmap.width
    const naturalHeight = bitmap.height
    bitmap.close()
    const addImageAction = addImage({
      url,
      naturalWidth,
      naturalHeight,
    })
    dispatch(addImageAction)
    dispatch(setActiveElementId(addImageAction.payload.id))
  }

  const addTextHandler = (text: TextValue = getDefaultTextValue("Meme Text")) => {
    const { width, height } = calculateTextBoxSize(text)
    const addTextAction = addText({ textEditorValue: text, width, height })
    dispatch(addTextAction)
    dispatch(setActiveElementId(addTextAction.payload.id))
  }

  const pasteHandler = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read()
      const mostRecentItem = clipboardItems[0]

      // Pasting image
      const imageType = mostRecentItem.types.find(type => type.startsWith("image/"))
      if (imageType) {
        const image = await mostRecentItem.getType(imageType)
        await addImageHandler(image)
        return
      }

      // Pasting text, which is either actual plain text or a copied meme text or image
      const plaintextType = mostRecentItem.types.find(type => type === "text/plain")
      if (plaintextType) {
        const textBlob = await mostRecentItem.getType(plaintextType)
        const text = await textBlob.text()

        try {
          const parsed = JSON.parse(text)
          if (parsed?.type === "application/x-mememaker.memetext" && parsed?.data) {
            const addTextAction = addText(parseCopiedMemeText(parsed.data))
            dispatch(addTextAction)
            dispatch(setActiveElementId(addTextAction.payload.id))
            return
          }
          if (parsed?.type === "application/x-mememaker.memeimage" && parsed?.data) {
            const addImageAction = addImage(await parseCopiedMemeImage(parsed.data))
            dispatch(addImageAction)
            dispatch(setActiveElementId(addImageAction.payload.id))
            return
          }
          // Not a known custom mime type, treat as plain text
          addTextHandler(getDefaultTextValue(escapeHtml(text)))
          return
        } catch {
          // Not a JSON, treat as plain text
          addTextHandler(getDefaultTextValue(escapeHtml(text)))
          return
        }
      }
    } catch {
      // Rejected clipboard permissions likely, whatcha doin?
    }

    // Pasting neither image nor text into a meme, whatcha doin?
  }

  return {
    addImage: addImageHandler,
    addText: addTextHandler,
    paste: pasteHandler,
  }
}
