/**
 * A create meme slice factory?
 * At this time of day?
 * At this time of year?
 * Localized entirely within your application?
 *
 * Yes.
 */

import { createSlice, createSelector, nanoid } from "@reduxjs/toolkit"
import { remove } from "lodash"
import type { TransformableElement } from "src/shared/ui/TransformControls"

export interface MemeImage extends TransformableElement {
  id: string // unique identifier
  url: string // The image file URL
  naturalWidth: number // original image width
  naturalHeight: number // original image height
}

export interface MemeText extends TransformableElement {
  id: string // unique identifier
  html: string // HTML content of the text
}
export interface MemeState {
  order: string[]
  images: MemeImage[]
  text: MemeText[]
}

export const initialState: MemeState = {
  order: [],
  images: [],
  text: [],
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
      addText: create.preparedReducer(
        ({
          id = nanoid(),
          html,
          x = 0,
          y = 0,
          width = 200,
          height = 50,
        }: RequireOnly<MemeText, "html">) => {
          return { payload: { id, html, x, y, width, height } }
        },
        (state, action) => {
          state.text.push(action.payload)
          state.order.push(action.payload.id)
        },
      ),
      updateText: create.reducer((state, action: { payload: RequireOnly<MemeText, "id"> }) => {
        const index = state.text.findIndex(t => t.id === action.payload.id)
        if (index !== -1) {
          state.text[index] = { ...state.text[index], ...action.payload }
        }
      }),
      removeText: create.reducer((state, action: { payload: string }) => {
        state.text = state.text.filter(text => text.id !== action.payload)
        state.order.splice(state.order.indexOf(action.payload), 1)
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
