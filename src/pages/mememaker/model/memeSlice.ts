import { makeMemeSlice } from "src/entities/meme"

export const memeSlice = makeMemeSlice()

export const { addImage, removeImage, updateImage, updateOrder } = memeSlice.actions

export const { selectImages, selectMeme, selectById, selectOrderIndexById } = memeSlice.selectors
