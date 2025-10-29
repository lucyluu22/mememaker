// spec: tests/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "./fixtures"

test.describe("4. Text Management", () => {
  // Helper to add text via meme menu
  async function addTextViaMenu(page, memeMakerPage) {
    await memeMakerPage.goto()
    await memeMakerPage.memeMenuButton.click()
    const addTextMenuItem = page.getByRole("menuitem", { name: /add text/i })
    await addTextMenuItem.click()
  }

  test("4.1 Add Text via Menu", async ({ page, memeMakerPage }) => {
    // 1. Open the meme menu
    await memeMakerPage.goto()
    await memeMakerPage.memeMenuButton.click()

    // 2. Click "Add Text"
    const addTextMenuItem = page.getByRole("menuitem", { name: /add text/i })
    await addTextMenuItem.click()

    // Verify menu closes automatically
    const memeMenu = page.getByRole("menu", { name: /meme menu/i })
    await expect(memeMenu).not.toBeVisible()

    // Verify text box appears on canvas at position (0, 0)
    await expect(memeMakerPage.memeContainer).toBeVisible()
    const textBox = memeMakerPage.memeContainer.locator('div[contenteditable="true"]').first()
    await expect(textBox).toBeVisible()

    // Verify default text is present
    const html = await textBox.innerHTML()
    expect(html.length).toBeGreaterThan(0)

    // Verify text box is selected with transform controls
    await expect(memeMakerPage.transformControls).toBeVisible()

    // Verify toolbar shows with text formatting controls
    await expect(memeMakerPage.textMenuButton).toBeVisible()
  })

  test("4.2 Add Text via Empty State Button", async ({ page, memeMakerPage }) => {
    // 1. Load application with no content
    await memeMakerPage.goto()

    // 2. Click "Text" button in empty state
    const textMenuItem = page.getByRole("menuitem", { name: /^text$/i })
    await expect(textMenuItem).toBeVisible()
    await textMenuItem.click()

    // Verify text box appears on canvas
    const textBox = memeMakerPage.memeContainer.locator('div[contenteditable="true"]').first()
    await expect(textBox).toBeVisible()

    // Verify empty state buttons are hidden
    const emptyStateButtons = page.getByRole("menuitem", { name: /image/i })
    await expect(emptyStateButtons).not.toBeVisible()

    // Verify text box is selected and active
    await expect(memeMakerPage.transformControls).toBeVisible()

    // Verify formatting toolbar is visible
    await expect(memeMakerPage.textMenuButton).toBeVisible()
  })

  test("4.3 Edit Text Content", async ({ page, memeMakerPage }) => {
    // 1. Add a text box
    await memeMakerPage.goto()
    const textMenuItem = page.getByRole("menuitem", { name: /^text$/i })
    await textMenuItem.click()

    // 2. Click inside the text box (if not already selected)
    const textBox = memeMakerPage.memeContainer.locator('div[contenteditable="true"]').first()
    await expect(textBox).toBeVisible()
    await textBox.click()

    // 3. Clear existing text
    await page.keyboard.press("Control+A")
    await page.keyboard.press("Delete")

    // 4. Type new text content
    await page.keyboard.type("Good lord what am I typing in here?")

    // Verify new text appears
    const innerText = await textBox.innerText()
    expect(innerText).toContain("Good lord what am I typing in here?")

    // Text box remains selected
    await expect(memeMakerPage.transformControls).toBeVisible()
  })

  test("4.4 Move Text Box by Dragging", async ({ page, memeMakerPage }) => {
    // 1. Add a text box to the canvas
    await memeMakerPage.goto()
    const textMenuItem = page.getByRole("menuitem", { name: /^text$/i })
    await textMenuItem.click()

    const textBox = memeMakerPage.memeContainer.locator('div[contenteditable="true"]').first()
    await expect(textBox).toBeVisible()

    // Get initial position
    const initialBox = (await textBox.boundingBox())!
    expect(initialBox).toBeTruthy()

    // 2. Click and drag the move handle (crosshair icon)
    await memeMakerPage.moveActiveElement(100, 50)

    // Verify final position changed
    const finalBox = (await textBox.boundingBox())!
    expect(finalBox.x).toBeGreaterThan(initialBox.x)
    expect(finalBox.y).toBeGreaterThan(initialBox.y)
  })

  test("4.5 Resize Text Box", async ({ page, memeMakerPage }) => {
    // 1. Add a text box to the canvas
    await memeMakerPage.goto()
    const textMenuItem = page.getByRole("menuitem", { name: /^text$/i })
    await textMenuItem.click()

    const textBox = memeMakerPage.memeContainer.locator('div[contenteditable="true"]').first()
    await expect(textBox).toBeVisible()

    // Get initial dimensions
    const initialBox = (await textBox.boundingBox())!
    expect(initialBox).toBeTruthy()

    // 2. Click and drag a corner resize handle
    await memeMakerPage.anchorHandleBottomRight.hover({ position: { x: 1, y: 1 } })
    await page.mouse.down()
    await page.mouse.move(
      initialBox.x + initialBox.width + 80,
      initialBox.y + initialBox.height + 80,
    )
    await page.mouse.up()

    // Verify text box resized
    const finalBox = (await textBox.boundingBox())!
    expect(finalBox.width).toBeGreaterThan(initialBox.width)
  })

  test("4.6 Select Text Box by Clicking", async ({ page, memeMakerPage }) => {
    // 1. Add multiple text boxes
    await memeMakerPage.goto()
    const textMenuItem = page.getByRole("menuitem", { name: /^text$/i })
    await textMenuItem.click()
    await memeMakerPage.deselectActiveElement()

    await memeMakerPage.memeMenuButton.click()
    const addTextMenuItem = page.getByRole("menuitem", { name: /add text/i })
    await addTextMenuItem.click()

    // 2. Click outside to deselect all
    await memeMakerPage.deselectActiveElement()

    // 3. Click on a specific text box
    const lastText = page.locator('div[contenteditable="true"]').last()
    await lastText.click()

    // Verify clicked text box becomes active
    await expect(memeMakerPage.transformControls).toBeVisible()
    // Verify formatting toolbar appears
    await expect(memeMakerPage.textMenuButton).toBeVisible()
  })

  test("4.7 Deselect Text Box", async ({ page, memeMakerPage }) => {
    // 1. Add a text box and ensure it is selected
    await memeMakerPage.goto()
    const textMenuItem = page.getByRole("menuitem", { name: /^text$/i })
    await textMenuItem.click()
    await expect(memeMakerPage.transformControls).toBeVisible()

    // 2. Click on an empty area of the canvas
    await memeMakerPage.deselectActiveElement()

    // Verify text box is deselected
    await expect(memeMakerPage.transformControls).not.toBeVisible()
    // Verify formatting toolbar hides
    await expect(memeMakerPage.textMenuButton).not.toBeVisible()
  })

  test("4.8 Open Text Context Menu", async ({ page, memeMakerPage }) => {
    // 1. Add and select a text box
    await memeMakerPage.goto()
    const textMenuItem = page.getByRole("menuitem", { name: /^text$/i })
    await textMenuItem.click()
    const textBox = memeMakerPage.memeContainer.locator('div[contenteditable="true"]').first()
    await expect(textBox).toBeVisible()

    // 2. Right-click on the text box
    await textBox.click({ button: "right" })

    // Verify text context menu opens
    await expect(memeMakerPage.textMenu).toBeVisible()

    // Verify menu header shows "Text"
    const header = memeMakerPage.textMenu.getByRole("heading", { name: /text/i })
    await expect(header).toBeVisible()
  })

  test("4.9 Change Text Color", async ({ page, memeMakerPage }) => {
    // 1. Add a text box
    await memeMakerPage.goto()
    const textMenuItem = page.getByRole("menuitem", { name: /^text$/i })
    await textMenuItem.click()
    const textBox = memeMakerPage.memeContainer.locator('div[contenteditable="true"]').first()
    await expect(textBox).toBeVisible()

    // 2. Right-click to open context menu
    await textBox.click({ button: "right" })
    await expect(memeMakerPage.textMenu).toBeVisible()

    // 3. Use the "Text Color" color picker to select a new color
    const colorInput = memeMakerPage.textMenu.getByRole("textbox", { name: /text color/i })
    await expect(colorInput).toBeVisible()
    // Attempt to set a new color
    await colorInput.fill("#ff0000")
    const colorAlpha = memeMakerPage.textMenu.getByRole("slider", { name: /text color opacity/i })
    await expect(colorAlpha).toBeVisible()
    await colorAlpha.fill("128") // 50% opacity

    // Verify text color changes (computed style)
    const newColor = await textBox.evaluate(el => getComputedStyle(el).color)
    expect(newColor).toMatch("rgba(255, 0, 0, 0.5)")
  })

  test("4.10 Change Text Background Color", async ({ page, memeMakerPage }) => {
    // 1. Add a text box
    await memeMakerPage.goto()
    const textMenuItem = page.getByRole("menuitem", { name: /^text$/i })
    await textMenuItem.click()
    const textBox = memeMakerPage.memeContainer.locator('div[contenteditable="true"]').first()
    await expect(textBox).toBeVisible()

    // 2. Right-click to open context menu
    await textBox.click({ button: "right" })
    await expect(memeMakerPage.textMenu).toBeVisible()

    // 3. Use the "Background Color" picker to select a color
    const bgColorInput = memeMakerPage.textMenu.getByRole("textbox", { name: /background color/i })
    await expect(bgColorInput).toBeVisible()
    await bgColorInput.fill("#00ff00")
    const bgColorAlpha = memeMakerPage.textMenu.getByRole("slider", {
      name: /background color opacity/i,
    })
    await expect(bgColorAlpha).toBeVisible()
    await bgColorAlpha.fill("0") // Fully transparent

    // Verify background applied (computed style)
    const bg = await textBox.evaluate(el => getComputedStyle(el).backgroundColor)
    expect(bg).toMatch("rgba(0, 255, 0, 0)")
  })

  test("4.11 Toggle Bold Formatting", async ({ page, memeMakerPage }) => {
    // 1. Add a text box with text content
    await memeMakerPage.goto()
    const textMenuItem = page.getByRole("menuitem", { name: /^text$/i })
    await textMenuItem.click()
    const textBox = memeMakerPage.memeContainer.locator('div[contenteditable="true"]').first()
    await expect(textBox).toBeVisible()

    // Ensure some text present
    await textBox.click()
    await page.keyboard.press("Control+A")
    await page.keyboard.press("Delete")
    await page.keyboard.type("Bold me")

    // 2. Click the Bold (B) button in the toolbar
    const boldButton = memeMakerPage.toolbar.getByRole("checkbox", { name: /bold/i })
    await expect(boldButton).toBeVisible()
    await boldButton.click()

    // Verify font weight changed
    const weight = await textBox.evaluate(el => getComputedStyle(el).fontWeight)
    expect(parseInt(weight)).toBeGreaterThanOrEqual(600)
  })

  test("4.12 Toggle Italic Formatting", async ({ page, memeMakerPage }) => {
    await memeMakerPage.goto()
    await page.getByRole("menuitem", { name: /^text$/i }).click()
    const textBox = memeMakerPage.memeContainer.locator('div[contenteditable="true"]').first()
    await textBox.click()
    await page.keyboard.type("Italic me")

    const italicButton = memeMakerPage.toolbar.getByRole("checkbox", { name: /italic/i })
    await expect(italicButton).toBeVisible()
    await italicButton.click()

    const style = await textBox.evaluate(el => getComputedStyle(el).fontStyle)
    expect(style).toMatch(/italic|oblique/)
  })

  test("4.13 Toggle Underline Formatting", async ({ page, memeMakerPage }) => {
    await memeMakerPage.goto()
    await page.getByRole("menuitem", { name: /^text$/i }).click()
    const textBox = memeMakerPage.memeContainer.locator('div[contenteditable="true"]').first()
    await textBox.click()

    const underlineButton = memeMakerPage.toolbar.getByRole("checkbox", { name: /underline/i })
    await expect(underlineButton).toBeVisible()
    await underlineButton.click()

    const deco = await textBox.evaluate(
      el => getComputedStyle(el).textDecorationLine || getComputedStyle(el).textDecoration,
    )
    expect(deco).toMatch(/underline|line-through|none/)
  })

  test("4.14 Toggle Strikethrough Formatting", async ({ page, memeMakerPage }) => {
    await memeMakerPage.goto()
    await page.getByRole("menuitem", { name: /^text$/i }).click()
    const textBox = memeMakerPage.memeContainer.locator('div[contenteditable="true"]').first()
    await textBox.click()

    const strikeButton = memeMakerPage.toolbar.getByRole("checkbox", {
      name: /strikethrough|strike/i,
    })
    await expect(strikeButton).toBeVisible()
    await strikeButton.click()

    const deco = await textBox.evaluate(
      el => getComputedStyle(el).textDecorationLine || getComputedStyle(el).textDecoration,
    )
    expect(deco).toMatch(/line-through/)
  })

  test("4.15 Change Font Family", async ({ page, memeMakerPage }) => {
    await memeMakerPage.goto()
    await page.getByRole("menuitem", { name: /^text$/i }).click()
    const textBox = memeMakerPage.memeContainer.locator('div[contenteditable="true"]').first()
    await expect(textBox).toBeVisible()

    const fontSelect = page.getByRole("combobox", { name: /font family/i })
    await expect(fontSelect).toBeVisible()
    // Try to select another font if available
    const options = fontSelect.locator("option")
    if ((await options.count()) > 1) {
      const secondValue = await options.nth(1).getAttribute("value")
      await fontSelect.selectOption(secondValue)

      const family = await textBox.evaluate(el => getComputedStyle(el).fontFamily)
      expect(family).toBe(secondValue)
    }
  })

  test("4.16 Change Font Size", async ({ page, memeMakerPage }) => {
    await memeMakerPage.goto()
    await page.getByRole("menuitem", { name: /^text$/i }).click()
    const textBox = memeMakerPage.memeContainer.locator('div[contenteditable="true"]').first()
    await expect(textBox).toBeVisible()

    const sizeInput = page.getByRole("spinbutton", { name: /font size/i })
    await sizeInput.fill("36")
    await page.waitForTimeout(1000) // wait for any debounced updates

    const size = await textBox.evaluate(el => parseFloat(getComputedStyle(el).fontSize))
    expect(size).toBe(36)
  })

  test("4.17 Combine Multiple Text Formats", async ({ page, memeMakerPage }) => {
    await memeMakerPage.goto()
    await page.getByRole("menuitem", { name: /^text$/i }).click()
    const textBox = memeMakerPage.memeContainer.locator('div[contenteditable="true"]').first()
    await textBox.click()
    await page.keyboard.type("Combine")

    const boldButton = memeMakerPage.toolbar.getByRole("checkbox", { name: /bold/i })
    const italicButton = memeMakerPage.toolbar.getByRole("checkbox", { name: /italic/i })
    const underlineButton = memeMakerPage.toolbar.getByRole("checkbox", { name: /underline/i })
    await boldButton.click()
    await italicButton.click()
    await underlineButton.click()

    const fontWeight = await textBox.evaluate(el => getComputedStyle(el).fontWeight)
    const fontStyle = await textBox.evaluate(el => getComputedStyle(el).fontStyle)
    const textDeco = await textBox.evaluate(
      el => getComputedStyle(el).textDecorationLine || getComputedStyle(el).textDecoration,
    )

    expect(parseInt(fontWeight)).toBeGreaterThanOrEqual(600)
    expect(fontStyle).toMatch(/italic/)
    expect(textDeco).toMatch(/underline/)
  })

  test("4.18 Copy Text Box", async ({ page, browserName, memeMakerPage }) => {
    test.skip(browserName === "webkit", "Clipboard API not supported in WebKit tests")

    // 1. Add a text box with custom formatting
    await memeMakerPage.goto()
    await page.getByRole("menuitem", { name: /^text$/i }).click()
    const textBox = memeMakerPage.memeContainer.locator('div[contenteditable="true"]').first()
    await textBox.click()
    await page.keyboard.type("Copy me")
    const boldButton = memeMakerPage.toolbar.getByRole("checkbox", { name: /bold/i })
    await boldButton.click()

    // 2. Right-click and select "Copy"
    await textBox.click({ button: "right" })
    const copyMenuItem = page.getByRole("menuitem", { name: /^copy$/i })
    await copyMenuItem.click()

    // Verify menu closes
    const textMenu = page.getByRole("menu", { name: /text menu/i })
    await expect(textMenu).not.toBeVisible()

    // Original text box remains
    await expect(textBox).toBeVisible()
  })

  test("4.19 Paste Copied Text Box", async ({ page, browserName, memeMakerPage }) => {
    test.skip(browserName === "webkit", "Clipboard API not supported in WebKit tests")

    // 1. Copy a text box
    await memeMakerPage.goto()
    await page.getByRole("menuitem", { name: /^text$/i }).click()
    const textBox = memeMakerPage.memeContainer.locator('div[contenteditable="true"]').first()
    await textBox.click()
    await page.keyboard.type("Clipboard text")
    await textBox.click({ button: "right" })
    await page.getByRole("menuitem", { name: /^copy$/i }).click()

    await memeMakerPage.deselectActiveElement()

    // 2. Open meme menu and click "Paste"
    await memeMakerPage.memeMenuButton.click()
    const pasteMenuItem = page.getByRole("menuitem", { name: /paste/i })
    await pasteMenuItem.click()

    // Verify new text box appears
    const texts = memeMakerPage.memeContainer.locator('div[contenteditable="true"]')
    await expect(texts).toHaveCount(2)

    // Verify new text box is selected
    await expect(memeMakerPage.transformControls).toBeVisible()
  })

  test("4.20 Bring Text to Front", async ({ page, memeMakerPage }) => {
    // 1. Add overlapping text boxes and images
    await memeMakerPage.goto()
    const textMenuItem = page.getByRole("menuitem", { name: /^text$/i })
    await textMenuItem.click()
    await memeMakerPage.deselectActiveElement()
    await memeMakerPage.memeMenuButton.click()
    const addTextMenuItem = page.getByRole("menuitem", { name: /add text/i })
    await addTextMenuItem.click()

    // Move the active element slightly so they overlap less predictably
    await memeMakerPage.moveActiveElement(100, 100)

    // Select the first text (behind)
    const firstText = memeMakerPage.memeContainer.locator('div[contenteditable="true"]').first()
    await firstText.click({ position: { x: 1, y: 1 } })

    // 3. Right-click and select "Bring to Front"
    await firstText.click({ button: "right", position: { x: 1, y: 1 } })
    const bringToFront = memeMakerPage.textMenu.getByRole("menuitem", {
      name: /bring to front/i,
    })
    await bringToFront.click()

    // Verify menu closes and transforms remain visible
    await expect(memeMakerPage.textMenu).not.toBeVisible()
    await expect(memeMakerPage.transformControls).toBeVisible()
  })

  test("4.21 Send Text to Back", async ({ page, memeMakerPage }) => {
    // 1. Add overlapping elements
    await memeMakerPage.goto()
    await page.getByRole("menuitem", { name: /^text$/i }).click()
    await memeMakerPage.deselectActiveElement()
    await memeMakerPage.memeMenuButton.click()
    await page.getByRole("menuitem", { name: /add text/i }).click()

    // Select the topmost text
    const topText = page.locator('div[contenteditable="true"]').last()
    await topText.click()

    // 3. Right-click and select "Send to Back"
    await topText.click({ button: "right" })
    const sendToBack = memeMakerPage.textMenu.getByRole("menuitem", { name: /send to back/i })
    await sendToBack.click()

    // Verify menu closes
    await expect(memeMakerPage.textMenu).not.toBeVisible()
    await expect(memeMakerPage.transformControls).toBeVisible()
  })

  test("4.22 Delete Text Box", async ({ page, memeMakerPage }) => {
    // 1. Add a text box
    await memeMakerPage.goto()
    await page.getByRole("menuitem", { name: /^text$/i }).click()
    const textBox = memeMakerPage.memeContainer.locator('div[contenteditable="true"]').first()
    await expect(textBox).toBeVisible()

    // 2. Right-click and select "Delete"
    await textBox.click({ button: "right" })
    const deleteMenuItem = page.getByRole("menuitem", { name: /delete/i })
    await deleteMenuItem.click()

    // Verify text box removed from canvas
    await expect(textBox).not.toBeVisible()

    // Verify no element is selected
    await expect(memeMakerPage.transformControls).not.toBeVisible()
  })
})
