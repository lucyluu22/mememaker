/**
 * Meme Entity (ᵕ—ᴗ—)
 * The representation of a singular certified high grade meme
 */

export { makeMemeSlice } from "./model/makeMemeSlice"
export {
  type MemeImage,
  type CopiedMemeImage,
  copyMemeImage,
  parseCopiedMemeImage,
} from "./model/memeImage"
export {
  type MemeText,
  type CopiedMemeText,
  copyMemeText,
  parseCopiedMemeText,
} from "./model/memeText"
export type { MemeState } from "./model/makeMemeSlice"
