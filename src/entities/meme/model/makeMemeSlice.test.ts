import { describe, it, expect } from "vitest"
import { configureStore } from "@reduxjs/toolkit"
import { getDefaultTextValue } from "src/shared/ui/TextEditor"

import { makeMemeSlice, initialState } from "./makeMemeSlice"

// Create a test slice
const memeSlice = makeMemeSlice("testMeme")

// Helper to create a store with the slice
const createTestStore = () =>
  configureStore({
    reducer: { testMeme: memeSlice.reducer },
  })

interface TestState {
  testMeme: typeof initialState
}

describe("makeMemeSlice", () => {
  describe("actions", () => {
    it("should update background color", () => {
      const store = createTestStore()
      store.dispatch(memeSlice.actions.updateBackgroundColor("#ff0000"))

      const state = store.getState().testMeme
      expect(state.backgroundColor).toBe("#ff0000")
    })

    it("should add image with default values", () => {
      const store = createTestStore()
      store.dispatch(
        memeSlice.actions.addImage({
          url: "test.jpg",
          naturalWidth: 100,
          naturalHeight: 200,
        }),
      )

      const state = store.getState().testMeme
      expect(state.images).toHaveLength(1)
      expect(state.images[0]).toMatchObject({
        url: "test.jpg",
        naturalWidth: 100,
        naturalHeight: 200,
        width: 100,
        height: 200,
        opacity: 1,
        x: 0,
        y: 0,
      })
      expect(state.order).toContain(state.images[0].id)
    })

    it("should add image with custom values", () => {
      const store = createTestStore()
      store.dispatch(
        memeSlice.actions.addImage({
          id: "custom-id",
          url: "test.jpg",
          naturalWidth: 100,
          naturalHeight: 200,
          width: 50,
          height: 100,
          opacity: 0.5,
          x: 10,
          y: 20,
        }),
      )

      const state = store.getState().testMeme
      expect(state.images[0]).toMatchObject({
        id: "custom-id",
        url: "test.jpg",
        naturalWidth: 100,
        naturalHeight: 200,
        width: 50,
        height: 100,
        opacity: 0.5,
        x: 10,
        y: 20,
      })
    })

    it("should remove image", () => {
      const store = createTestStore()
      store.dispatch(
        memeSlice.actions.addImage({
          id: "remove-me",
          url: "test.jpg",
          naturalWidth: 100,
          naturalHeight: 100,
        }),
      )
      store.dispatch(memeSlice.actions.removeImage("remove-me"))

      const state = store.getState().testMeme
      expect(state.images).toHaveLength(0)
      expect(state.order).not.toContain("remove-me")
    })

    it("should update existing image", () => {
      const store = createTestStore()
      store.dispatch(
        memeSlice.actions.addImage({
          id: "update-me",
          url: "test.jpg",
          naturalWidth: 100,
          naturalHeight: 100,
        }),
      )
      store.dispatch(
        memeSlice.actions.updateImage({
          id: "update-me",
          x: 50,
          y: 60,
          opacity: 0.8,
        }),
      )

      const state = store.getState().testMeme
      expect(state.images[0]).toMatchObject({
        id: "update-me",
        x: 50,
        y: 60,
        opacity: 0.8,
        url: "test.jpg", // unchanged
      })
    })

    it("should not update non-existent image", () => {
      const store = createTestStore()
      store.dispatch(
        memeSlice.actions.updateImage({
          id: "does-not-exist",
          x: 50,
        }),
      )

      const state = store.getState().testMeme
      expect(state.images).toHaveLength(0)
    })

    it("should add text with default values", () => {
      const store = createTestStore()
      store.dispatch(memeSlice.actions.addText())

      const state = store.getState().testMeme
      expect(state.texts).toHaveLength(1)
      expect(state.texts[0]).toMatchObject({
        x: 0,
        y: 0,
        width: 200,
        height: 50,
        backgroundColor: "#ffffff00",
      })
      expect(state.order).toContain(state.texts[0].id)
    })

    it("should add text with custom values", () => {
      const store = createTestStore()
      const customTextValue = getDefaultTextValue("Custom Text")
      store.dispatch(
        memeSlice.actions.addText({
          id: "custom-text",
          textEditorValue: customTextValue,
          x: 10,
          y: 20,
          width: 300,
          height: 100,
          backgroundColor: "#ff0000",
        }),
      )

      const state = store.getState().testMeme
      expect(state.texts[0]).toMatchObject({
        id: "custom-text",
        textEditorValue: customTextValue,
        x: 10,
        y: 20,
        width: 300,
        height: 100,
        backgroundColor: "#ff0000",
      })
    })

    it("should remove text", () => {
      const store = createTestStore()
      store.dispatch(memeSlice.actions.addText({ id: "remove-me" }))
      store.dispatch(memeSlice.actions.removeText("remove-me"))

      const state = store.getState().testMeme
      expect(state.texts).toHaveLength(0)
      expect(state.order).not.toContain("remove-me")
    })

    it("should update existing text", () => {
      const store = createTestStore()
      const newTextValue = getDefaultTextValue("Updated Text")
      store.dispatch(memeSlice.actions.addText({ id: "update-me" }))
      store.dispatch(
        memeSlice.actions.updateText({
          id: "update-me",
          textEditorValue: newTextValue,
          backgroundColor: "#00ff00",
        }),
      )

      const state = store.getState().testMeme
      expect(state.texts[0]).toMatchObject({
        id: "update-me",
        textEditorValue: newTextValue,
        backgroundColor: "#00ff00",
      })
    })

    it("should not update non-existent text", () => {
      const store = createTestStore()
      store.dispatch(
        memeSlice.actions.updateText({
          id: "does-not-exist",
          backgroundColor: "#ff0000",
        }),
      )

      const state = store.getState().testMeme
      expect(state.texts).toHaveLength(0)
    })

    it("should update order - move to end", () => {
      const store = createTestStore()
      store.dispatch(
        memeSlice.actions.addImage({
          id: "first",
          url: "1.jpg",
          naturalWidth: 100,
          naturalHeight: 100,
        }),
      )
      store.dispatch(
        memeSlice.actions.addImage({
          id: "second",
          url: "2.jpg",
          naturalWidth: 100,
          naturalHeight: 100,
        }),
      )
      store.dispatch(memeSlice.actions.addText({ id: "third" }))

      // Move first to end
      store.dispatch(memeSlice.actions.updateOrder({ id: "first" }))

      const state = store.getState().testMeme
      expect(state.order).toEqual(["second", "third", "first"])
    })

    it("should update order - move to specific index", () => {
      const store = createTestStore()
      store.dispatch(
        memeSlice.actions.addImage({
          id: "first",
          url: "1.jpg",
          naturalWidth: 100,
          naturalHeight: 100,
        }),
      )
      store.dispatch(
        memeSlice.actions.addImage({
          id: "second",
          url: "2.jpg",
          naturalWidth: 100,
          naturalHeight: 100,
        }),
      )
      store.dispatch(memeSlice.actions.addText({ id: "third" }))

      // Move third to index 0
      store.dispatch(memeSlice.actions.updateOrder({ id: "third", index: 0 }))

      const state = store.getState().testMeme
      expect(state.order).toEqual(["third", "first", "second"])
    })

    it("should reset state", () => {
      const store = createTestStore()
      store.dispatch(memeSlice.actions.updateBackgroundColor("#ff0000"))
      store.dispatch(
        memeSlice.actions.addImage({ url: "test.jpg", naturalWidth: 100, naturalHeight: 100 }),
      )
      store.dispatch(memeSlice.actions.addText())

      store.dispatch(memeSlice.actions.reset())

      const state = store.getState().testMeme
      expect(state).toEqual(initialState)
    })
  })

  describe("selectors", () => {
    const createStateWithContent = (): TestState => ({
      testMeme: {
        backgroundColor: "#ff0000",
        order: ["img1", "text1", "img2"],
        images: [
          {
            id: "img1",
            url: "1.jpg",
            naturalWidth: 100,
            naturalHeight: 100,
            width: 100,
            height: 100,
            opacity: 1,
            x: 0,
            y: 0,
          },
          {
            id: "img2",
            url: "2.jpg",
            naturalWidth: 200,
            naturalHeight: 150,
            width: 200,
            height: 150,
            opacity: 0.8,
            x: 50,
            y: 75,
          },
        ],
        texts: [
          {
            id: "text1",
            textEditorValue: getDefaultTextValue("Test"),
            backgroundColor: "#ffffff",
            width: 150,
            height: 50,
            x: 25,
            y: 25,
          },
        ],
      },
    })

    it("should select meme", () => {
      const state = createStateWithContent()
      const result = memeSlice.selectors.selectMeme(state)
      expect(result).toBe(state.testMeme)
    })

    it("should select meme layers", () => {
      const state = createStateWithContent()
      const result = memeSlice.selectors.selectMemeLayers(state)
      expect(result).toHaveLength(3)
      expect(result.map(l => l.id)).toEqual(["img1", "img2", "text1"])
    })

    it("should select meme width", () => {
      const state = createStateWithContent()
      const result = memeSlice.selectors.selectMemeWidth(state)
      // Max of: img1(0+100=100), img2(50+200=250), text1(25+150=175)
      expect(result).toBe(250)
    })

    it("should select meme width for empty state", () => {
      const state: TestState = { testMeme: initialState }
      const result = memeSlice.selectors.selectMemeWidth(state)
      expect(result).toBe(0)
    })

    it("should select meme height", () => {
      const state = createStateWithContent()
      const result = memeSlice.selectors.selectMemeHeight(state)
      // Max of: img1(0+100=100), img2(75+150=225), text1(25+50=75)
      expect(result).toBe(225)
    })

    it("should select meme height for empty state", () => {
      const state: TestState = { testMeme: initialState }
      const result = memeSlice.selectors.selectMemeHeight(state)
      expect(result).toBe(0)
    })

    it("should select has content", () => {
      const stateWithContent = createStateWithContent()
      const emptyState: TestState = { testMeme: initialState }

      expect(memeSlice.selectors.selectMemeHasContent(stateWithContent)).toBe(true)
      expect(memeSlice.selectors.selectMemeHasContent(emptyState)).toBe(false)
    })

    it("should select background color", () => {
      const state = createStateWithContent()
      const result = memeSlice.selectors.selectMemeBackgroundColor(state)
      expect(result).toBe("#ff0000")
    })

    it("should select image by id", () => {
      const state = createStateWithContent()
      const result = memeSlice.selectors.selectImageById(state, "img2")
      expect(result).toMatchObject({
        id: "img2",
        url: "2.jpg",
        width: 200,
        height: 150,
      })
    })

    it("should return undefined for non-existent image", () => {
      const state = createStateWithContent()
      const result = memeSlice.selectors.selectImageById(state, "does-not-exist")
      expect(result).toBeUndefined()
    })

    it("should select text by id", () => {
      const state = createStateWithContent()
      const result = memeSlice.selectors.selectTextsById(state, "text1")
      expect(result).toMatchObject({
        id: "text1",
        backgroundColor: "#ffffff",
        width: 150,
        height: 50,
      })
    })

    it("should return undefined for non-existent text", () => {
      const state = createStateWithContent()
      const result = memeSlice.selectors.selectTextsById(state, "does-not-exist")
      expect(result).toBeUndefined()
    })

    it("should select order index by id", () => {
      const state = createStateWithContent()
      expect(memeSlice.selectors.selectOrderIndexById(state, "img1")).toBe(0)
      expect(memeSlice.selectors.selectOrderIndexById(state, "text1")).toBe(1)
      expect(memeSlice.selectors.selectOrderIndexById(state, "img2")).toBe(2)
    })

    it("should return -1 for non-existent id in order", () => {
      const state = createStateWithContent()
      const result = memeSlice.selectors.selectOrderIndexById(state, "does-not-exist")
      expect(result).toBe(-1)
    })
  })
})
