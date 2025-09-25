/**
 * A create meme slice factory?
 * At this time of day?
 * At this time of year?
 * Localized entirely within your application?
 *
 * Yes.
 */

import { createSlice, createSelector, nanoid } from "@reduxjs/toolkit"

export interface MemeImage {
  id: string // unique identifier
  url: string // The image file URL
  width: number // user scaled width
  height: number // user scaled height
  naturalWidth: number // original image width
  naturalHeight: number // original image height
  x: number // x position on the meme canvas
  y: number // y position on the meme canvas
}

export interface MemeState {
  order: string[]
  images: MemeImage[]
}

export const initialState: MemeState = {
  order: [],
  images: [],
}

export const makeMemeSlice = <Name extends string = "meme">(name: Name = "meme" as Name) =>
  createSlice({
    name,
    initialState,
    reducers: create => ({
      addImage: create.preparedReducer(
        ({
          id = nanoid(),
          url,
          naturalWidth,
          naturalHeight,
          width = naturalWidth,
          height = naturalHeight,
          x = 0,
          y = 0,
        }: RequireOnly<MemeImage, "url" | "naturalWidth" | "naturalHeight">) => {
          return {
            payload: {
              id,
              url,
              naturalWidth,
              naturalHeight,
              width,
              height,
              x,
              y,
            },
          }
        },
        (state, action) => {
          state.images.push(action.payload)
          state.order.push(action.payload.id)
        },
      ),
      removeImage: create.reducer((state, action: { payload: string }) => {
        state.images = state.images.filter(image => image.id !== action.payload)
        state.order.splice(state.order.indexOf(action.payload), 1)
      }),
      updateImage: create.reducer((state, action: { payload: RequireOnly<MemeImage, "id"> }) => {
        const index = state.images.findIndex(img => img.id === action.payload.id)
        if (index !== -1) {
          state.images[index] = { ...state.images[index], ...action.payload }
        }
      }),
      updateOrder: create.reducer((state, action: { payload: { id: string; index?: number } }) => {
        const { id, index } = action.payload
        const currentIndex = state.order.indexOf(id)
        state.order.splice(currentIndex, 1)
        state.order.splice(index ?? state.order.length, 0, id)
      }),
    }),
    selectors: {
      selectMeme: state => state,
      selectImages: state => state.images,
      selectById: createSelector(
        (state: MemeState) => state.images,
        (_: MemeState, id: string) => id,
        (images, id) => images.find(img => img.id === id) ?? null,
      ),
      selectOrderIndexById: createSelector(
        (state: MemeState) => state.order,
        (_: MemeState, id: string) => id,
        (order, id) => order.indexOf(id),
      ),
    },
  })
