import { makeMemeSlice } from "src/entities/meme"

export const memeSlice = makeMemeSlice()

export const { updateOrder, addImage, removeImage, updateImage, addText, updateText, removeText } =
  memeSlice.actions

export const { selectImages, selectMeme, selectById, selectOrderIndexById } = memeSlice.selectors
