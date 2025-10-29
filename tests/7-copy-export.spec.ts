// spec: tests/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "./fixtures"

test.describe("7. Copy and Export Operations", () => {
  test("7.1 Copy Meme as PNG", async ({ page, browserName, memeMakerPage }) => {
    test.skip(
      browserName === "webkit",
      "Clipboard copy to system clipboard not supported on WebKit tests",
    )

    // 1. Add content to canvas
    await memeMakerPage.goto()
    await page.getByRole("menuitem", { name: /^text$/i }).click()

    // 2. Deselect all elements (click on canvas)
    await memeMakerPage.deselectActiveElement()

    // 3. Open meme menu and click "Copy"
    await memeMakerPage.memeMenuButton.click()
    const copyMenuItem = page.getByRole("menuitem", { name: /^copy$/i })
    await expect(copyMenuItem).toBeEnabled()
    await copyMenuItem.click()

    // Expected: menu closes and copy succeeded (we treat menu close as success indicator)
    const memeMenu = page.getByRole("menu", { name: /meme menu/i })
    await expect(memeMenu).not.toBeVisible()
  })

  test("7.2 Download Meme as PNG", async ({ page, memeMakerPage }) => {
    // 1. Add content to canvas
    await memeMakerPage.goto()
    await page.getByRole("menuitem", { name: /^text$/i }).click()

    // 2. Deselect all elements
    await memeMakerPage.deselectActiveElement()

    // 3. Open meme menu and click "Download"
    await memeMakerPage.memeMenuButton.click()

    const downloadMenuItem = page.getByRole("menuitem", { name: /download/i })
    await expect(downloadMenuItem).toBeEnabled()

    // Wait for download event triggered by the click
    const [download] = await Promise.all([page.waitForEvent("download"), downloadMenuItem.click()])

    // Verify download has a suggested filename (if provided)
    const suggested = download.suggestedFilename()
    expect(suggested).toBeTruthy()
  })

  test("7.3 Copy/Download with No Content Shows Disabled", async ({ page, memeMakerPage }) => {
    // 1. Load application with no content
    await memeMakerPage.goto()

    // 2. Open meme menu
    await memeMakerPage.memeMenuButton.click()

    // Verify Copy and Download are disabled
    const copyMenuItem = page.getByRole("menuitem", { name: /^copy$/i })
    const downloadMenuItem = page.getByRole("menuitem", { name: /download/i })
    await expect(copyMenuItem).toBeDisabled()
    await expect(downloadMenuItem).toBeDisabled()
  })

  test("7.4 Paste Image from System Clipboard", async ({ page, browserName, memeMakerPage }) => {
    // This test requires system clipboard image support and may be flaky in CI. Skip on WebKit.
    test.skip(browserName === "webkit", "Clipboard not supported on WebKit")
    test.skip(
      browserName === "firefox",
      "Firefox requires further interaction via popup prompt with cross-origin clipboard paste",
    )

    // Setup: attempt to write an image to the clipboard (best-effort) — may require local run / permissions.
    // If the environment does not support navigator.clipboard.write, this test will be skipped by the runner.

    await memeMakerPage.goto()

    // Try to write a sample image into the clipboard using the page context (best-effort)
    const ok = await page.evaluate(async () => {
      try {
        // Mystery URI!
        const dataUri =
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAGCAYAAAAc2cSCAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAsSURBVChTY0zR2vWfgUzA9PfffwZyMRO6aaQAijQzpuvtIdvPjAWmB8nWDADbUDOs3IbQGwAAAABJRU5ErkJggg=="
        const res = await fetch(dataUri)
        const blob = await res.blob()
        await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
        return true
      } catch {
        return false
      }
    })

    test.skip(
      !ok,
      "Unable to write image to clipboard in this environment — run manually with clipboard permission",
    )

    // Open meme menu and click Paste
    await memeMakerPage.memeMenuButton.click()
    const paste = memeMakerPage.memeMenu.getByRole("menuitem", { name: /paste/i })
    await paste.click()

    // Verify image appears on canvas
    const images = memeMakerPage.memeContainer.locator("img")
    await expect(images).toHaveCount(1)
  })

  test("7.5 Paste Plain Text from System Clipboard", async ({
    page,
    browserName,
    memeMakerPage,
  }) => {
    test.skip(browserName === "webkit", "Clipboard not supported on WebKit")
    test.skip(
      browserName === "firefox",
      "Firefox requires further interaction via popup prompt with cross-origin clipboard paste",
    )

    await memeMakerPage.goto()

    // write plain text to clipboard
    const wrote = await page.evaluate(async () => {
      try {
        await navigator.clipboard.writeText("Mmm, Pasty!")
        return true
      } catch {
        return false
      }
    })

    test.skip(
      !wrote,
      "Cannot write to navigator.clipboard in this environment — run manually with permissions",
    )

    // Open meme menu and click Paste
    await memeMakerPage.memeMenuButton.click()
    const paste = memeMakerPage.memeMenu.getByRole("menuitem", { name: /paste/i })
    await paste.click()

    // Verify new text box is created with clipboard contents
    const texts = memeMakerPage.memeContainer.locator('div[contenteditable="true"]')
    await expect(texts).toHaveCount(1)
    const inner = await texts.first().innerText()
    expect(inner).toContain("Mmm, Pasty!")
  })

  test("7.6 Paste Custom Meme Element (Text)", async ({ page, browserName, memeMakerPage }) => {
    test.skip(browserName === "webkit")

    // 1. Add a text box with custom formatting
    await memeMakerPage.goto()
    await page.getByRole("menuitem", { name: /^text$/i }).click()
    const textBox = page.locator('div[contenteditable="true"]').first()
    await textBox.click()
    await page.keyboard.type("Custom formatted text")

    // e.g., toggle bold via toolbar
    const boldButton = memeMakerPage.toolbar.getByRole("checkbox", { name: /bold/i })
    if (await boldButton.isVisible()) {
      await boldButton.click()
    }

    // 2. Right-click and select "Copy"
    await textBox.click({ button: "right" })
    const copyMenuItem = memeMakerPage.textMenu.getByRole("menuitem", { name: /^copy$/i })
    await copyMenuItem.click()

    // 3. Paste via meme menu
    await memeMakerPage.deselectActiveElement()
    await memeMakerPage.memeMenuButton.click()
    const paste = memeMakerPage.memeMenu.getByRole("menuitem", { name: /paste/i })
    await paste.click()

    // Verify new text box appears and is selected
    const texts = memeMakerPage.memeContainer.locator('div[contenteditable="true"]')
    await expect(texts).toHaveCount(2)
    await expect(memeMakerPage.transformControls).toBeVisible()
    await expect(memeMakerPage.toolbar.getByRole("checkbox", { name: /bold/i })).toBeChecked()
  })

  test("7.7 Paste Custom Meme Element (Image)", async ({ page, browserName, memeMakerPage }) => {
    test.skip(browserName === "webkit")

    const testImagePath = "tests/images/can-i-haz-placeholder.png"

    // 1. Add an image and copy it using the image context menu
    await memeMakerPage.goto()
    const imageMenuItem = page.getByRole("menuitem", { name: /image/i })
    const fileInput = imageMenuItem.locator('input[type="file"]')
    await fileInput.setInputFiles(testImagePath)

    const image = page.locator("img").first()
    await expect(image).toBeVisible()

    await image.click({ button: "right" })
    const copyMenuItem = page.getByRole("menuitem", { name: /^copy$/i })
    await copyMenuItem.click()

    // 2. Paste via meme menu
    await memeMakerPage.deselectActiveElement()
    await memeMakerPage.memeMenuButton.click()
    const paste = page.getByRole("menuitem", { name: /paste/i })
    await paste.click()

    // Verify new image appears
    const images = page.locator("img")
    await expect(images).toHaveCount(2)
  })
})
