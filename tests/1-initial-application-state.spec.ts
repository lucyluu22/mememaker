// spec: tests/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "./fixtures"

test.describe("1. Initial Application State", () => {
  test("1.1 Application Loads Successfully", async ({ page, memeMakerPage }) => {
    // 1. Navigate to the application URL
    await memeMakerPage.goto()

    // 2. Wait for page to fully load
    // Verify application title "MemeMakr" is visible with version number
    const title = page.getByRole("heading", { name: /MemeMakr/i })
    await expect(title).toBeVisible()

    // Verify three action buttons are displayed: "Image", "Text", and "Paste"
    const imageButton = page.getByRole("menuitem", { name: /image/i })
    const textButton = page.getByRole("menuitem", { name: /text/i })
    const pasteButton = page.getByRole("menuitem", { name: /paste/i })

    await expect(imageButton).toBeVisible()
    await expect(textButton).toBeVisible()
    await expect(pasteButton).toBeVisible()

    // Verify no content is present on the canvas (empty state)
    await expect(memeMakerPage.memeContainer).not.toBeVisible()

    // Verify meme menu button is visible in the toolbar
    const memeMenuButton = page.getByRole("button", { name: /meme/i })
    await expect(memeMenuButton).toBeVisible()
  })

  test("1.2 Empty State UI Elements", async ({ page, memeMakerPage }) => {
    // 1. Load the application
    await memeMakerPage.goto()

    // 2. Verify the presence of all UI elements
    // Header contains "MemeMakr" title
    const header = page.locator("header")
    await expect(header).toBeVisible()
    const title = header.getByRole("heading", { name: /MemeMakr/i })
    await expect(title).toBeVisible()

    // Main canvas area is empty with placeholder buttons
    const main = page.locator("main")
    await expect(main).toBeVisible()

    // Menu bar with action buttons
    const menuBar = page.getByRole("menubar")
    await expect(menuBar).toBeVisible()

    // "Add Image" button with file upload input
    const imageButton = menuBar.getByRole("menuitem", { name: /image/i })
    await expect(imageButton).toBeVisible()
    const fileInput = imageButton.locator('input[type="file"]')
    await expect(fileInput).toBeAttached()

    // "Add Text" button
    const textButton = menuBar.getByRole("menuitem", { name: /text/i })
    await expect(textButton).toBeVisible()

    // "Paste" button
    const pasteButton = menuBar.getByRole("menuitem", { name: /paste/i })
    await expect(pasteButton).toBeVisible()

    // "Meme" menu button in toolbar
    const memeMenuButton = page.getByRole("button", { name: /meme/i })
    await expect(memeMenuButton).toBeVisible()
  })
})
