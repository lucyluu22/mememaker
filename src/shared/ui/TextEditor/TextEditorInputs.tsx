import { useState, type JSX } from "react"
import { useDebounce } from "react-use"
import { BiBold, BiItalic, BiUnderline, BiStrikethrough } from "react-icons/bi"
import { Icon } from "../Icon"
import { Input, Select, ToggleButton, InputGroup } from "../Inputs"
import { availableFonts } from "./availableFonts"

export interface TextEditorInputProps {
  fontFamily: string
  fontSize: number
  bold: boolean
  italic: boolean
  underline: boolean
  strikethrough: boolean
  onBoldChange: (bold: boolean) => void
  onItalicChange: (italic: boolean) => void
  onUnderlineChange: (underline: boolean) => void
  onStrikethroughChange: (strikethrough: boolean) => void
  onFontFamilyChange: (font: string) => void
  onFontSizeChange: (size: number) => void
}

export const TextEditorInputs = ({
  fontFamily,
  fontSize,
  bold,
  italic,
  underline,
  strikethrough,
  onBoldChange,
  onItalicChange,
  onUnderlineChange,
  onStrikethroughChange,
  onFontFamilyChange,
  onFontSizeChange,
}: TextEditorInputProps): JSX.Element => {
  const [currentFontSizeValue, setCurrentFontSizeValue] = useState(String(fontSize))
  useDebounce(
    () => {
      if (currentFontSizeValue !== "") {
        onFontSizeChange(Number(currentFontSizeValue))
        setCurrentFontSizeValue(currentFontSizeValue)
      }
    },
    200,
    [currentFontSizeValue],
  )

  return (
    <>
      <Select
        name="font-family"
        value={fontFamily}
        title="Font Family"
        style={{
          width: "12rem",
          fontFamily: fontFamily,
        }}
        onChange={e => {
          onFontFamilyChange(e.target.value)
        }}
      >
        {availableFonts.map(f => (
          <option key={f} value={f} style={{ fontFamily: f }}>
            {f}
          </option>
        ))}
      </Select>
      <Input
        type="number"
        inputMode="numeric"
        min={1}
        value={currentFontSizeValue}
        style={{ width: "5rem" }}
        title="Font Size"
        onChange={e => {
          setCurrentFontSizeValue(e.target.value)
        }}
      />
      <InputGroup>
        <ToggleButton checked={bold} labelProps={{ title: "Bold" }} onChange={onBoldChange}>
          <Icon>
            <BiBold />
          </Icon>
        </ToggleButton>
        <ToggleButton checked={italic} labelProps={{ title: "Italic" }} onChange={onItalicChange}>
          <Icon>
            <BiItalic />
          </Icon>
        </ToggleButton>
        <ToggleButton
          checked={underline}
          labelProps={{ title: "Underline" }}
          onChange={onUnderlineChange}
        >
          <Icon>
            <BiUnderline />
          </Icon>
        </ToggleButton>
        <ToggleButton
          checked={strikethrough}
          labelProps={{ title: "Strikethrough" }}
          onChange={onStrikethroughChange}
        >
          <Icon>
            <BiStrikethrough />
          </Icon>
        </ToggleButton>
      </InputGroup>
    </>
  )
}
