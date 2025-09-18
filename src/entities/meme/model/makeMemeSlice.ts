/**
 * A create meme slice factory?
 * At this time of day?
 * At this time of year?
 * Localized entirely within your application?
 *
 * Yes.
 */

import { createSlice } from "@reduxjs/toolkit"

export interface MemeImage {
  id: string // unique identifier
  file: File // The image file
  naturalWidth: number // original image width
  naturalHeight: number // original image height
  scaledWidth: number // user scaled width
  scaledHeight: number // user scaled height
  x: number // x position on the meme canvas
  y: number // y position on the meme canvas
}

export interface MemeState {
  images: MemeImage[]
}

export const initialState: MemeState = {
  images: [],
}

export const makeMemeSlice = <Name extends string = "meme">(
  name: Name = "meme" as Name,
) =>
  createSlice({
    name,
    initialState,
    reducers: create => ({
      addImage: create.preparedReducer(
        ({
          id = crypto.randomUUID(),
          file,
          naturalWidth,
          naturalHeight,
          scaledWidth = naturalWidth,
          scaledHeight = naturalHeight,
          x = 0,
          y = 0,
        }: MemeImage) => {
          return {
            payload: {
              id,
              file,
              naturalWidth,
              naturalHeight,
              scaledWidth,
              scaledHeight,
              x,
              y,
            },
          }
        },
        (state, action) => {
          state.images.push(action.payload)
        },
      ),
      removeImage: create.reducer((state, action: { payload: string }) => {
        state.images = state.images.filter(image => image.id !== action.payload)
      }),
      updateImage: create.reducer(
        (state, action: { payload: Partial<MemeImage> & { id: string } }) => {
          const index = state.images.findIndex(
            img => img.id === action.payload.id,
          )
          if (index !== -1) {
            state.images[index] = { ...state.images[index], ...action.payload }
          }
        },
      ),
    }),
    selectors: {
      selectMeme: state => state,
      selectImages: state => state.images,
    },
  })
