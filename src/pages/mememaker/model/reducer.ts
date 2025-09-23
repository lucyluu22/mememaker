import { combineSlices } from "@reduxjs/toolkit"

import { memeSlice } from "./memeSlice"
import { memeCanvasSlice } from "./memeCanvasSlice"

export const reducer = combineSlices(memeSlice, memeCanvasSlice)
