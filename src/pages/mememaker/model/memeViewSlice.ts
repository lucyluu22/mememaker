import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

export interface MemeViewSliceState {
  zoom: number
}

const initialState: MemeViewSliceState = {
  zoom: 100,
}

export const memeViewSlice = createSlice({
  name: "memeView",
  initialState,
  reducers: create => ({
    setZoom: create.reducer((state, action: PayloadAction<number>) => {
      state.zoom = action.payload
    }),
  }),
  selectors: {
    selectZoom: state => state.zoom,
  },
})

export const { setZoom } = memeViewSlice.actions

export const { selectZoom } = memeViewSlice.selectors
