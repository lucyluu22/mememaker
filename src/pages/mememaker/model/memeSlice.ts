import { makeMemeSlice } from "src/entities/meme"

export const memeSlice = makeMemeSlice()

export const { addImage, removeImage, updateImage } = memeSlice.actions

export const { selectImages, selectMeme } = memeSlice.selectors
