// spec: tests/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "./fixtures"

test.describe("2. Main Menu Operations", () => {
  test("2.1 Open Meme Menu", async ({ page, memeMakerPage }) => {
    // 1. Load the application
    await memeMakerPage.goto()

    // 2. Click the "Meme" button in the toolbar
    await memeMakerPage.memeMenuButton.click()

    // Verify context menu opens with aria-label "meme menu"
    const memeMenu = page.getByRole("menu", { name: /meme menu/i })
    await expect(memeMenu).toBeVisible()

    // Verify menu contains "Add Image" (with file input)
    const addImageMenuItem = memeMenu.getByRole("menuitem", { name: /add image/i })
    await expect(addImageMenuItem).toBeVisible()
    const fileInput = addImageMenuItem.locator('input[type="file"]')
    await expect(fileInput).toBeAttached()

    // Verify menu contains "Add Text"
    const addTextMenuItem = memeMenu.getByRole("menuitem", { name: /add text/i })
    await expect(addTextMenuItem).toBeVisible()

    // Verify menu contains "Paste"
    const pasteMenuItem = memeMenu.getByRole("menuitem", { name: /paste/i })
    await expect(pasteMenuItem).toBeVisible()

    // Verify menu contains "Background Color" (color picker)
    const backgroundColorLabel = memeMenu.getByText(/background color/i)
    await expect(backgroundColorLabel).toBeVisible()

    // Verify "Copy" menu item is disabled when no content
    const copyMenuItem = memeMenu.getByRole("menuitem", { name: /^copy$/i })
    await expect(copyMenuItem).toBeDisabled()

    // Verify "Download" menu item is disabled when no content
    const downloadMenuItem = memeMenu.getByRole("menuitem", { name: /download/i })
    await expect(downloadMenuItem).toBeDisabled()

    // Verify "Delete Meme" menu item is disabled when no content
    const deleteMenuItem = memeMenu.getByRole("menuitem", { name: /delete meme/i })
    await expect(deleteMenuItem).toBeDisabled()
  })

  test("2.2 Close Meme Menu", async ({ page, memeMakerPage }) => {
    // 1. Open the meme menu
    await memeMakerPage.goto()
    await memeMakerPage.memeMenuButton.click()

    // Verify menu is open
    const memeMenu = page.getByRole("menu", { name: /meme menu/i })
    await expect(memeMenu).toBeVisible()

    // 2. Click the "Meme" button again
    await memeMakerPage.memeMenuButton.click()

    // Verify menu closes
    await expect(memeMenu).not.toBeVisible()

    // Verify no menu is visible in the DOM
    const allMenus = page.getByRole("menu")
    await expect(allMenus).toHaveCount(0)
  })

  test("2.3 Menu Items Enable After Content Added", async ({ page, memeMakerPage }) => {
    // 1. Open the meme menu
    await memeMakerPage.goto()
    await memeMakerPage.memeMenuButton.click()

    // 2. Add a text box
    const addTextMenuItem = page.getByRole("menuitem", { name: /add text/i })
    await addTextMenuItem.click()

    // Verify text box was added
    await expect(memeMakerPage.memeContainer).toBeVisible()
    const textBox = page.locator('div[contenteditable="true"]')
    await expect(textBox).toBeVisible()

    // 3. Click outside to deselect
    await memeMakerPage.deselectActiveElement()

    // Verify text box is deselected (no toolbar visible except main Meme button)
    await expect(memeMakerPage.textMenuButton).not.toBeVisible()

    // 4. Open the meme menu again
    await memeMakerPage.memeMenuButton.click()

    // Verify "Copy" menu item is now enabled
    const copyMenuItem = page.getByRole("menuitem", { name: /^copy$/i })
    await expect(copyMenuItem).toBeEnabled()

    // Verify "Download" menu item is now enabled
    const downloadMenuItem = page.getByRole("menuitem", { name: /download/i })
    await expect(downloadMenuItem).toBeEnabled()

    // Verify "Delete Meme" menu item is now enabled
    const deleteMenuItem = page.getByRole("menuitem", { name: /delete meme/i })
    await expect(deleteMenuItem).toBeEnabled()
  })
})
