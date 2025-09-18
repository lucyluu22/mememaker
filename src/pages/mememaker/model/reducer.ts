import { combineSlices } from "@reduxjs/toolkit"

import { memeSlice } from "./memeSlice"
import { memeViewSlice } from "./memeViewSlice"

export const reducer = combineSlices(memeSlice, memeViewSlice)
