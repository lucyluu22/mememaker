import type { JSX } from "react"
import { BiBold, BiItalic, BiUnderline, BiStrikethrough } from "react-icons/bi"
import { Input, ColorInput, Select, ToggleButton, InputGroup } from "../Inputs"

export interface TextEditorToolbarProps {
  onBold: () => void
  onItalic: () => void
  onUnderline: () => void
  onStrikethrough: () => void
  fontFamily: string
  onFontFamilyChange: (font: string) => void
  fontSize: string | number
  onFontSizeChange: (size: string | number) => void
  color: string
  onColorChange: (color: string) => void
  backgroundColor: string
  onBackgroundColorChange: (color: string) => void
}

const FONT_FAMILIES = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Verdana",
  "Tahoma",
  "Trebuchet MS",
  "Impact",
]

export const TextEditorInputs = ({
  onBold,
  onItalic,
  onUnderline,
  onStrikethrough,
  fontFamily,
  onFontFamilyChange,
  fontSize,
  onFontSizeChange,
  color,
  onColorChange,
}: TextEditorToolbarProps): JSX.Element => {
  return (
    <>
      <InputGroup>
        <ToggleButton labelProps={{ title: "Bold" }} onChange={onBold}>
          <BiBold />
        </ToggleButton>
        <ToggleButton labelProps={{ title: "Italic" }} onChange={onItalic}>
          <BiItalic />
        </ToggleButton>
        <ToggleButton labelProps={{ title: "Underline" }} onChange={onUnderline}>
          <BiUnderline />
        </ToggleButton>
        <ToggleButton labelProps={{ title: "Strikethrough" }} onChange={onStrikethrough}>
          <BiStrikethrough />
        </ToggleButton>
      </InputGroup>
      <ColorInput inputProps={{ title: "Text Color" }} color={color} onChange={onColorChange} />
      <Select
        name="font-family"
        value={fontFamily}
        onChange={e => {
          onFontFamilyChange(e.target.value)
        }}
        title="Font Family"
      >
        {FONT_FAMILIES.map(f => (
          <option key={f} value={f} style={{ fontFamily: f }}>
            {f}
          </option>
        ))}
      </Select>
      <Input
        type="number"
        name="font-size"
        min={1}
        value={fontSize}
        style={{ width: "5rem" }}
        onChange={e => {
          onFontSizeChange(e.target.value)
        }}
        title="Font Size"
      />
    </>
  )
}
