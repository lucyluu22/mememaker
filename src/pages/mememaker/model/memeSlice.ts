import { makeMemeSlice } from "src/entities/meme"

export const memeSlice = makeMemeSlice()

export const {
  updateBackgroundColor,
  updateOrder,
  addImage,
  removeImage,
  updateImage,
  addText,
  updateText,
  removeText,
} = memeSlice.actions

export const {
  selectMeme,
  selectMemeBackgroundColor,
  selectImageById,
  selectTextsById,
  selectOrderIndexById,
} = memeSlice.selectors
