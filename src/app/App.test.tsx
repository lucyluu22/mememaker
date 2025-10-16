import { describe, it, expect, vi, beforeAll } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import { renderWithProviders } from "src/test/test-utils"

import { App } from "./App"

beforeAll(() => {
  vi.stubGlobal("URL", {
    ...URL,
    createObjectURL: vi.fn(() => "blob:http://localhost/fake-url"),
    revokeObjectURL: vi.fn(),
  } as unknown as typeof URL)

  vi.stubGlobal(
    "createImageBitmap",
    vi.fn(() => Promise.resolve({ width: 100, height: 100, close: vi.fn() })),
  )

  // mock the domToPNG function used to render the meme to an image
  vi.mock("modern-screenshot", () => ({
    domToBlob: vi.fn(() =>
      Promise.resolve(
        new Blob(["(⌐□_□)"], {
          type: "image/png",
        }),
      ),
    ),
  }))

  // pointer capture isn't implemented in JSDOM yet
  HTMLElement.prototype.setPointerCapture = vi.fn()
  HTMLElement.prototype.releasePointerCapture = vi.fn()

  return () => {
    vi.unstubAllGlobals()
  }
})

describe("App E2E Tests", () => {
  it("should render buttons to add an image, text or paste on initial load", () => {
    renderWithProviders(<App />)

    // Check that all three action buttons are rendered when app starts with no content
    const imageButton = screen.getByRole("button", { name: /image/i })
    const textButton = screen.getByRole("button", { name: /text/i })
    const pasteButton = screen.getByRole("button", { name: /paste/i })

    expect(imageButton).toBeInTheDocument()
    expect(textButton).toBeInTheDocument()
    expect(pasteButton).toBeInTheDocument()
  })

  it("should open and close the meme menu", async () => {
    const { user } = renderWithProviders(<App />)

    const mainMenuButton = screen.getByRole("button", { name: /meme/i })
    expect(mainMenuButton).toBeInTheDocument()

    // Open the menu
    await user.click(mainMenuButton)
    const menu = screen.queryByRole("menu", { name: /meme menu/i })
    expect(menu).toBeVisible()

    // Close the menu
    await user.click(mainMenuButton)
    expect(screen.queryByRole("menu", { name: /meme menu/i })).not.toBeInTheDocument()
  })

  it("should add an image, move it around, and delete it", async () => {
    const { user } = renderWithProviders(<App />)

    const mainMenuButton = screen.getByRole("button", { name: /meme/i })
    expect(mainMenuButton).toBeInTheDocument()

    // Open the menu
    await user.click(mainMenuButton)
    const menu = screen.getByRole("menu", { name: /meme menu/i })
    expect(menu).toBeVisible()

    // Click the "Add Image" menu item
    const addImageMenuItem = screen.getByRole("menuitem", { name: /add image/i })
    expect(addImageMenuItem).toBeInTheDocument()
    const fileInput = addImageMenuItem.querySelector('input[type="file"]')
    expect(fileInput).toBeInTheDocument()

    // Mock a file to upload
    const file = new File(["(⌐□_□)"], "meme.png", { type: "image/png" })
    const objectUrl = URL.createObjectURL(file)
    await user.upload(fileInput as HTMLInputElement, file)

    const memeContainer = await waitFor(() => screen.getByTestId("meme"))
    const image = memeContainer.querySelector<HTMLImageElement>(`img[src="${objectUrl}"]`)!
    expect(image).toBeInTheDocument()

    // Move the image by simulating pointer events
    await user.pointer([
      { keys: "[MouseLeft>]", target: image, coords: { x: 50, y: 50 } }, // pointerdown
      { coords: { x: 70, y: 70 } }, // pointermove
      { keys: "[/MouseLeft]", target: image, coords: { x: 70, y: 70 } }, // pointerup
    ])
    expect(image.style.top).toEqual("20px")
    expect(image.style.left).toEqual("20px")

    // Select the image (by right clicking on it) and delete it from the menu
    await user.pointer({ keys: "[MouseRight]", target: image }) // right click to select
    const deleteMenuItem = screen.getByRole("menuitem", { name: /delete/i })
    expect(deleteMenuItem).toBeInTheDocument()
    await user.click(deleteMenuItem)
    expect(image).not.toBeInTheDocument()
  })

  it("should add a text box, edit the text, and delete it", async () => {
    const { user } = renderWithProviders(<App />)
    const mainMenuButton = screen.getByRole("button", { name: /meme/i })
    expect(mainMenuButton).toBeInTheDocument()

    // Open the menu
    await user.click(mainMenuButton)
    const menu = screen.getByRole("menu", { name: /meme menu/i })
    expect(menu).toBeVisible()

    // Click the "Add Text" menu item
    const addTextMenuItem = screen.getByRole("menuitem", { name: /add text/i })
    expect(addTextMenuItem).toBeInTheDocument()
    await user.click(addTextMenuItem)

    const memeContainer = await waitFor(() => screen.getByTestId("meme"))
    const textBox = memeContainer.querySelector<HTMLDivElement>(`div[contenteditable="true"]`)! // The text box is a contenteditable div
    expect(textBox).toBeInTheDocument()

    // Edit the text box content
    await user.clear(textBox)
    await user.type(textBox, "Can I Haz Text?")
    expect(textBox).toHaveTextContent("Can I Haz Text?")

    // Delete the text box
    await user.pointer({ keys: "[MouseRight]", target: textBox }) // right click to select
    const deleteMenuItem = screen.getByRole("menuitem", { name: /delete/i })
    expect(deleteMenuItem).toBeInTheDocument()
    await user.click(deleteMenuItem)
    expect(textBox).not.toBeInTheDocument()
  })

  it("should render the meme as a PNG", async () => {
    const { user } = renderWithProviders(<App />)
    const mainMenuButton = screen.getByRole("button", { name: /meme/i })
    expect(mainMenuButton).toBeInTheDocument()

    // Open the menu
    await user.click(mainMenuButton)
    const menu = screen.getByRole("menu", { name: /meme menu/i })
    expect(menu).toBeVisible()
    expect(screen.getByRole("menuitem", { name: /copy/i })).toBeDisabled()
    expect(screen.getByRole("menuitem", { name: /download/i })).toBeDisabled()

    // Add some text to enable the copy and download menu items
    const addTextMenuItem = screen.getByRole("menuitem", { name: /add text/i })
    expect(addTextMenuItem).toBeInTheDocument()
    await user.click(addTextMenuItem)
    const memeContainer = await waitFor(() => screen.getByTestId("meme"))
    const textBox = memeContainer.querySelector<HTMLDivElement>(`div[contenteditable="true"]`)! // The text box is a contenteditable div
    expect(textBox).toBeInTheDocument()

    // Click on something else to deselect the text box
    await user.click(memeContainer)

    // Mock clipboard.write
    const mockClipboardWrite = vi.fn(() => Promise.resolve())
    vi.stubGlobal(
      "navigator",
      Object.assign({}, navigator, {
        clipboard: {
          write: mockClipboardWrite,
        },
      }) as unknown as Navigator,
    )

    vi.stubGlobal(
      "ClipboardItem",
      class {
        constructor(public items: Record<string, Blob | string>) {}
      } as unknown as typeof ClipboardItem,
    )

    // Open the menu again and click "Copy"
    await user.click(screen.getByRole("button", { name: /meme/i }))
    const copyAsPngMenuItem = screen.getByRole("menuitem", { name: /copy/i })
    expect(copyAsPngMenuItem).toBeInTheDocument()
    expect(copyAsPngMenuItem).toBeEnabled()
    await user.click(copyAsPngMenuItem)
    expect(mockClipboardWrite).toHaveBeenCalledWith([
      expect.objectContaining({ items: { "image/png": expect.any(Blob) } }),
    ])

    // Download the meme as a PNG
    await user.click(screen.getByRole("button", { name: /meme/i }))
    const downloadAsPngMenuItem = screen.getByRole("menuitem", { name: /download/i })
    expect(downloadAsPngMenuItem).toBeInTheDocument()
    expect(downloadAsPngMenuItem).toBeEnabled()
    // JSDOM has no way of testing downloads, so we just check the menu item is there and clickable
    await user.click(downloadAsPngMenuItem)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(URL.createObjectURL).toHaveBeenCalled()
  })
})
