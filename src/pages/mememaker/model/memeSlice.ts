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
  selectMemeLayers,
  selectMemeWidth,
  selectMemeHeight,
  selectMemeHasContent,
  selectMemeBackgroundColor,
  selectImageById,
  selectTextsById,
  selectOrderIndexById,
} = memeSlice.selectors
