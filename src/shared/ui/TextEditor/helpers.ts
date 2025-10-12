import { intersection } from "lodash"
import { availableFonts } from "./availableFonts"

export interface TextValue {
  html: string // html of the contenteditable div
  bold: boolean
  italic: boolean
  underline: boolean
  strikethrough: boolean
  fontFamily: string
  fontSize: number
  color: string
}

export const getDefaultTextValue = (text: string): TextValue => {
  return {
    html: `<div>${text}</div>`,
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    fontFamily: intersection(["Impact", "Arial"], availableFonts)[0],
    fontSize: 24,
    color: "#000000",
  }
}
