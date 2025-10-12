import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice, createSelector } from "@reduxjs/toolkit"

export interface MemeCanvasSliceState {
  zoom: number
  activeElementId: string | null
}

const initialState: MemeCanvasSliceState = {
  zoom: 100,
  activeElementId: null,
}

export const memeCanvasSlice = createSlice({
  name: "memeCanvas",
  initialState,
  reducers: create => ({
    setZoom: create.reducer((state, action: PayloadAction<number>) => {
      state.zoom = action.payload
    }),
    setActiveElementId: create.reducer(
      (state, action: PayloadAction<MemeCanvasSliceState["activeElementId"]>) => {
        state.activeElementId = action.payload
      },
    ),
  }),
  selectors: {
    selectZoom: state => state.zoom,
    // The inverse scale is so UI (e.g. resize control handles) are aware of canvas zoom and adjust accordingly
    selectInverseZoomScale: createSelector(
      (state: MemeCanvasSliceState) => state.zoom,
      zoom => 100 / zoom,
    ),
    selectActiveElementId: state => state.activeElementId,
    selectIsActiveElement: createSelector(
      (state: MemeCanvasSliceState) => state.activeElementId,
      (_, id: string | null) => id,
      (activeId: string | null, id: string | null) => activeId === id,
    ),
  },
})

export const { setZoom, setActiveElementId } = memeCanvasSlice.actions

export const { selectZoom, selectInverseZoomScale, selectActiveElementId, selectIsActiveElement } =
  memeCanvasSlice.selectors
