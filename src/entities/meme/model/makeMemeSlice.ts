/**
 * A create meme slice factory?
 * At this time of day?
 * At this time of year?
 * Localized entirely within your application?
 *
 * Yes.
 */

import { createSlice, createSelector, nanoid } from "@reduxjs/toolkit"
import type { TextValue } from "src/shared/ui/TextEditor"
import type { TransformableElement } from "src/shared/ui/TransformControls"

import { getDefaultTextValue } from "src/shared/ui/TextEditor"

export interface MemeImage extends TransformableElement {
  id: string // unique identifier
  url: string // The image file URL
  naturalWidth: number // original image width
  naturalHeight: number // original image height
  opacity: number // image opacity between 0 and 1
}

export interface MemeText extends TransformableElement {
  id: string // unique identifier
  textEditorValue: TextValue
  backgroundColor: string
}

export interface MemeState {
  backgroundColor: string
  order: string[]
  images: MemeImage[]
  texts: MemeText[]
}

export const initialState: MemeState = {
  backgroundColor: "#ffffff",
  order: [],
  images: [],
  texts: [],
}

const selectMemeLayers = createSelector(
  (state: MemeState) => state.images,
  (state: MemeState) => state.texts,
  (images, texts) => [...images, ...texts],
)

export const makeMemeSlice = <Name extends string = "meme">(name: Name = "meme" as Name) =>
  createSlice({
    name,
    initialState,
    reducers: create => ({
      updateBackgroundColor: create.reducer((state, action: { payload: string }) => {
        state.backgroundColor = action.payload
      }),
      addImage: create.preparedReducer(
        ({
          id = nanoid(),
          url,
          naturalWidth,
          naturalHeight,
          width = naturalWidth,
          height = naturalHeight,
          opacity = 1,
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
              opacity,
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
          textEditorValue = getDefaultTextValue("Meme Text"),
          x = 0,
          y = 0,
          width = 200,
          height = 50,
          backgroundColor = "#ffffff00",
        }: Partial<MemeText> = {}) => {
          return { payload: { id, textEditorValue, x, y, width, height, backgroundColor } }
        },
        (state, action) => {
          state.texts.push(action.payload)
          state.order.push(action.payload.id)
        },
      ),
      updateText: create.reducer((state, action: { payload: RequireOnly<MemeText, "id"> }) => {
        const index = state.texts.findIndex(t => t.id === action.payload.id)
        if (index !== -1) {
          state.texts[index] = { ...state.texts[index], ...action.payload }
        }
      }),
      removeText: create.reducer((state, action: { payload: string }) => {
        state.texts = state.texts.filter(text => text.id !== action.payload)
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
      selectMemeLayers,
      selectMemeWidth: createSelector(selectMemeLayers, layers =>
        layers.length === 0 ? 0 : Math.max(...layers.map(layer => layer.x + layer.width)),
      ),
      selectMemeHeight: createSelector(selectMemeLayers, layers =>
        layers.length === 0 ? 0 : Math.max(...layers.map(layer => layer.y + layer.height)),
      ),
      selectMemeBackgroundColor: state => state.backgroundColor,
      selectImageById: createSelector(
        (state: MemeState) => state.images,
        (_: MemeState, id: string) => id,
        (images, id) => images.find(img => img.id === id),
      ),
      selectTextsById: createSelector(
        (state: MemeState) => state.texts,
        (_: MemeState, id: string) => id,
        (texts, id) => texts.find(text => text.id === id),
      ),
      selectOrderIndexById: createSelector(
        (state: MemeState) => state.order,
        (_: MemeState, id: string) => id,
        (order, id) => order.indexOf(id),
      ),
    },
  })
