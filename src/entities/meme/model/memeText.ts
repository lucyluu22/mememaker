import type { MemeLayer } from "./memeLayer"
import type { TextValue } from "src/shared/ui/TextEditor"

export interface MemeText extends MemeLayer {
  textEditorValue: TextValue
  backgroundColor: string
}

export interface CopiedMemeText {
  textEditorValue: TextValue
  backgroundColor: string
  width: number
  height: number
}

export const copyMemeText = (text: MemeText): CopiedMemeText => {
  return {
    textEditorValue: text.textEditorValue,
    backgroundColor: text.backgroundColor,
    width: text.width,
    height: text.height,
  }
}

export const parseCopiedMemeText = (copiedText: CopiedMemeText) => {
  return {
    textEditorValue: copiedText.textEditorValue,
    backgroundColor: copiedText.backgroundColor,
    width: copiedText.width,
    height: copiedText.height,
  }
}
