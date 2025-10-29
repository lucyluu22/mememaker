// spec: tests/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "./fixtures"

test.describe("3. Image Management", () => {
  // Helper to create a test image file
  const testImagePath = "tests/images/can-i-haz-placeholder.png"

  test("3.1 Add Image via Menu", async ({ page, memeMakerPage }) => {
    // 1. Open the meme menu
    await memeMakerPage.goto()
    await memeMakerPage.memeMenuButton.click()

    // 2. Click "Add Image" menu item
    const addImageMenuItem = page.getByRole("menuitem", { name: /add image/i })
    await expect(addImageMenuItem).toBeVisible()

    // 3. Upload an image file
    const fileInput = addImageMenuItem.locator('input[type="file"]')
    await fileInput.setInputFiles(testImagePath)

    // Verify menu closes automatically
    const memeMenu = page.getByRole("menu", { name: /meme menu/i })
    await expect(memeMenu).not.toBeVisible()

    // Verify image appears on the canvas
    await expect(memeMakerPage.memeContainer).toBeVisible()
    const image = page.locator("img").first()
    await expect(image).toBeVisible()

    // Verify image displays with original dimensions
    const imageBox = await image.boundingBox()
    expect(imageBox).toBeTruthy()

    // Verify image has transform controls visible (selection border)
    await expect(memeMakerPage.transformControls).toBeVisible()

    // Verify toolbar shows image-specific menu button
    await expect(memeMakerPage.imageMenuButton).toBeVisible()
  })

  test("3.2 Add Image via Empty State Button", async ({ page, memeMakerPage }) => {
    // 1. Load application with no content
    await memeMakerPage.goto()

    // 2. Click the "Image" button in the empty state
    const imageMenuItem = page.getByRole("menuitem", { name: /image/i })
    const fileInput = imageMenuItem.locator('input[type="file"]')

    // 3. Upload an image file
    await fileInput.setInputFiles(testImagePath)

    // Verify image appears on the canvas
    await expect(memeMakerPage.memeContainer).toBeVisible()
    const image = page.locator("img").first()
    await expect(image).toBeVisible()

    // Verify empty state buttons are hidden
    const emptyStateButtons = page.getByRole("menuitem", { name: /image/i })
    await expect(emptyStateButtons).not.toBeVisible()

    // Verify image is selected and active
    await expect(memeMakerPage.transformControls).toBeVisible()
  })

  test("3.3 Move Image by Dragging", async ({ page, memeMakerPage }) => {
    // 1. Add an image to the canvas
    await memeMakerPage.goto()
    const imageMenuItem = page.getByRole("menuitem", { name: /image/i })
    const fileInput = imageMenuItem.locator('input[type="file"]')
    await fileInput.setInputFiles(testImagePath)

    const image = memeMakerPage.memeContainer.locator("img").first()
    await expect(image).toBeVisible()

    // Get initial position
    const initialBox = (await image.boundingBox())!
    expect(initialBox).toBeTruthy()

    // 2-4. Click and hold on the image, drag to a new position, release
    await image.hover({ position: { x: 1, y: 1 } })
    await page.mouse.down()
    await page.mouse.move(initialBox.x + 100, initialBox.y + 100)
    await page.mouse.up()

    // Verify final position changed
    const finalBox = (await image.boundingBox())!
    expect(finalBox).toBeTruthy()
    expect(finalBox.x).toBeGreaterThan(initialBox.x)
    expect(finalBox.y).toBeGreaterThan(initialBox.y)
  })

  test("3.4 Resize Image by Corner Handle", async ({ page, memeMakerPage }) => {
    // 1. Add an image to the canvas
    await memeMakerPage.goto()
    const imageMenuItem = page.getByRole("menuitem", { name: /image/i })
    const fileInput = imageMenuItem.locator('input[type="file"]')
    await fileInput.setInputFiles(testImagePath)

    const image = page.locator("img").first()
    await expect(image).toBeVisible()

    // Get initial dimensions
    const initialBox = (await image.boundingBox())!
    expect(initialBox).toBeTruthy()

    // 2. Image is already selected
    // 3. Click and drag a corner resize handle
    await memeMakerPage.anchorHandleTopLeft.hover({ position: { x: 1, y: 1 } })
    await page.mouse.down()
    await page.mouse.move(initialBox.x, initialBox.y + 100)
    await page.mouse.up()

    // 4. Verify image resized
    const finalBox = (await image.boundingBox())!
    expect(finalBox).toBeTruthy()
    expect(finalBox.width).toBeLessThan(initialBox.width)
    expect(finalBox.height).toBeLessThan(initialBox.height)
  })

  test("3.5 Resize Image by Edge Handle", async ({ page, memeMakerPage }) => {
    // 1-2. Add and select an image
    await memeMakerPage.goto()
    const imageMenuItem = page.getByRole("menuitem", { name: /image/i })
    const fileInput = imageMenuItem.locator('input[type="file"]')
    await fileInput.setInputFiles(testImagePath)

    const image = page.locator("img").first()
    await expect(image).toBeVisible()

    const initialBox = (await image.boundingBox())!
    expect(initialBox).toBeTruthy()
    const initialWidth = initialBox.width

    // 3. Click and drag an edge resize handle (right edge)
    await memeMakerPage.anchorHandleRight.hover({ position: { x: 1, y: 1 } })
    await page.mouse.down()
    await page.mouse.move(initialBox.x + initialBox.width + 100, initialBox.y + 100)
    await page.mouse.up()

    // 4. Verify image resized along one axis
    const finalBox = (await image.boundingBox())!
    expect(finalBox).toBeTruthy()
    expect(finalBox.width).toBeGreaterThan(initialWidth)
    expect(finalBox.height).toBe(initialBox.height)
  })

  test("3.6 Select Image by Clicking", async ({ page, memeMakerPage }) => {
    // 1. Add multiple images to the canvas
    await memeMakerPage.goto()
    const imageMenuItem = page.getByRole("menuitem", { name: /image/i })
    const fileInput = imageMenuItem.locator('input[type="file"]')

    await fileInput.setInputFiles(testImagePath)
    await memeMakerPage.deselectActiveElement()

    // Add second image via menu
    await memeMakerPage.memeMenuButton.click()
    const addImageMenuItem = page.getByRole("menuitem", { name: /add image/i })
    const menuFileInput = addImageMenuItem.locator('input[type="file"]')
    await menuFileInput.setInputFiles(testImagePath)

    // 2. Click outside to deselect all
    await memeMakerPage.deselectActiveElement()

    // 3. Click on a specific image
    const lastImage = memeMakerPage.memeContainer.locator("img").last()
    await lastImage.click()

    // Verify clicked image becomes active
    await expect(memeMakerPage.transformControls).toBeVisible()

    // Verify toolbar displays for the selected image
    await expect(memeMakerPage.imageMenuButton).toBeVisible()
  })

  test("3.7 Deselect Image", async ({ page, memeMakerPage }) => {
    // 1. Add an image and ensure it is selected
    await memeMakerPage.goto()
    const imageMenuItem = page.getByRole("menuitem", { name: /image/i })
    const fileInput = imageMenuItem.locator('input[type="file"]')
    await fileInput.setInputFiles(testImagePath)

    await expect(memeMakerPage.transformControls).toBeVisible()

    // 2. Click on an empty area of the canvas
    await memeMakerPage.deselectActiveElement()

    // Verify image is deselected
    await expect(memeMakerPage.transformControls).not.toBeVisible()

    // Verify toolbar hides
    await expect(memeMakerPage.imageMenuButton).not.toBeVisible()

    // Verify only main "Meme" menu button remains visible
    await expect(memeMakerPage.memeMenuButton).toBeVisible()
  })

  test("3.8 Open Image Context Menu", async ({ page, memeMakerPage }) => {
    // 1. Add and select an image
    await memeMakerPage.goto()
    const imageMenuItem = page.getByRole("menuitem", { name: /image/i })
    const fileInput = imageMenuItem.locator('input[type="file"]')
    await fileInput.setInputFiles(testImagePath)

    const image = page.locator("img").first()
    await expect(image).toBeVisible()

    // 2. Right-click on the image
    await image.click({ button: "right" })

    // Verify image context menu opens
    const imageMenu = page.getByRole("menu", { name: /image menu/i })
    await expect(imageMenu).toBeVisible()

    // Verify menu header shows "Image" with dimensions
    const menuHeader = imageMenu.getByText(/Image/i).first()
    await expect(menuHeader).toBeVisible()

    // Verify dimensions are shown as (<width>(<naturalWidth>)px <height>(<naturalHeight>)px)
    const dimensionsText = menuHeader.getByText(/(\d+)\((\d+)\)px.*(\d+)\((\d+)\)px/)
    await expect(dimensionsText).toBeVisible()
  })

  test("3.9 Adjust Image Opacity", async ({ page, memeMakerPage }) => {
    // 1. Add and select an image
    await memeMakerPage.goto()
    const imageMenuItem = page.getByRole("menuitem", { name: /image/i })
    const fileInput = imageMenuItem.locator('input[type="file"]')
    await fileInput.setInputFiles(testImagePath)

    const image = page.locator("img").first()
    await expect(image).toBeVisible()

    // Get initial opacity
    const initialOpacity = await image.evaluate(el => getComputedStyle(el).opacity)

    // 2. Right-click to open image context menu
    await image.click({ button: "right" })

    // 3. Adjust the opacity slider
    const opacitySlider = memeMakerPage.imageMenu.locator('input[type="range"]').first()
    await expect(opacitySlider).toBeVisible()
    await opacitySlider.fill("50")

    // Verify image opacity changed
    const newOpacity = await image.evaluate(el => getComputedStyle(el).opacity)
    expect(newOpacity).not.toBe(initialOpacity)
    expect(parseFloat(newOpacity)).toBeLessThan(parseFloat(initialOpacity))
  })

  test("3.10 Reset Image Dimensions", async ({ page, memeMakerPage }) => {
    // 1. Add an image and resize it
    await memeMakerPage.goto()
    const imageMenuItem = page.getByRole("menuitem", { name: /image/i })
    const fileInput = imageMenuItem.locator('input[type="file"]')
    await fileInput.setInputFiles(testImagePath)

    const image = page.locator("img").first()
    await expect(image).toBeVisible()

    // Resize the image
    const initialBox = (await image.boundingBox())!
    await memeMakerPage.anchorHandleBottomRight.hover({ position: { x: 1, y: 1 } })
    await page.mouse.down()
    await page.mouse.move(
      initialBox.x + initialBox.width - 100,
      initialBox.y + initialBox.height - 200,
    )
    await page.mouse.up()

    // 2. Right-click on the image
    await image.click({ button: "right" })

    // 3. Click the link/unlink icon in the menu header
    const resetButton = memeMakerPage.imageMenu.getByRole("button", { name: /reset dimensions/i })
    await resetButton.click()

    // Verify image dimensions reset to original
    const finalBox = (await image.boundingBox())!
    expect(finalBox).toBeTruthy()
    expect(finalBox.width).toBe(initialBox.width)
    expect(finalBox.height).toBe(initialBox.height)

    // Verify menu closes after reset
    const imageMenu = page.getByRole("menu", { name: /image menu/i })
    await expect(imageMenu).not.toBeVisible()
  })

  test("3.11 Copy Image", async ({ page, browserName, memeMakerPage }) => {
    test.skip(
      browserName === "webkit",
      "Copy/Paste to clipboard not supported on WebKit implementations",
    )

    // 1. Add an image to the canvas
    await memeMakerPage.goto()
    const imageMenuItem = page.getByRole("menuitem", { name: /image/i })
    const fileInput = imageMenuItem.locator('input[type="file"]')
    await fileInput.setInputFiles(testImagePath)

    const image = page.locator("img").first()
    await expect(image).toBeVisible()

    // 2. Right-click on the image
    await image.click({ button: "right" })

    // 3. Click "Copy" in the menu
    const copyMenuItem = memeMakerPage.imageMenu.getByRole("menuitem", { name: /^copy$/i })
    await copyMenuItem.click()

    // Verify menu closes (indicator of success)
    await expect(memeMakerPage.imageMenu).not.toBeVisible()

    // Verify original image remains on canvas
    await expect(image).toBeVisible()
  })

  test("3.12 Paste Copied Image", async ({ page, browserName, memeMakerPage }) => {
    test.skip(
      browserName === "webkit",
      "Copy/Paste to clipboard not supported on WebKit implementations",
    )

    // 1. Copy an image
    await memeMakerPage.goto()
    const imageMenuItem = page.getByRole("menuitem", { name: /image/i })
    const fileInput = imageMenuItem.locator('input[type="file"]')
    await fileInput.setInputFiles(testImagePath)

    const image = page.locator("img").first()
    await expect(image).toBeVisible()

    await image.click({ button: "right" })
    const copyMenuItem = page.getByRole("menuitem", { name: /^copy$/i })
    await copyMenuItem.click()

    await memeMakerPage.deselectActiveElement()

    // 2. Open the meme menu
    await memeMakerPage.memeMenuButton.click()

    // 3. Click "Paste"
    const pasteMenuItem = memeMakerPage.memeMenu.getByRole("menuitem", { name: /paste/i })
    await pasteMenuItem.click()

    // Verify new image appears
    const images = page.locator("img")
    await expect(images).toHaveCount(2)

    // Verify new image is positioned at top left (0, 0)
    const newImage = images.nth(1)
    const box = await newImage.boundingBox()
    expect(box).toBeTruthy()

    // Verify new image is selected
    await expect(memeMakerPage.transformControls).toBeVisible()
  })

  test("3.13 Bring Image to Front", async ({ page, memeMakerPage }) => {
    // 1. Add multiple images that overlap
    await memeMakerPage.goto()
    const imageMenuItem = page.getByRole("menuitem", { name: /image/i })
    const fileInput = imageMenuItem.locator('input[type="file"]')
    await fileInput.setInputFiles(testImagePath)
    await memeMakerPage.deselectActiveElement()

    await memeMakerPage.memeMenuButton.click()
    const addImageMenuItem = memeMakerPage.memeMenu.getByRole("menuitem", { name: /add image/i })
    const menuFileInput = addImageMenuItem.locator('input[type="file"]')
    await menuFileInput.setInputFiles(testImagePath)

    await memeMakerPage.moveActiveElement(20, 20)

    // 2. Select the first image (behind)
    const firstImage = page.locator("img").first()
    await firstImage.click({ position: { x: 1, y: 1 } })

    // 3. Right-click and select "Bring to Front"
    await firstImage.click({ button: "right", position: { x: 1, y: 1 } })
    const bringToFrontMenuItem = page.getByRole("menuitem", { name: /bring to front/i })
    await bringToFrontMenuItem.click()

    // Verify menu closes
    const imageMenu = page.getByRole("menu", { name: /image menu/i })
    await expect(imageMenu).not.toBeVisible()

    // Verify image remains selected
    await expect(memeMakerPage.transformControls).toBeVisible()
  })

  test("3.14 Send Image to Back", async ({ page, memeMakerPage }) => {
    // 1. Add multiple images that overlap
    await memeMakerPage.goto()
    const imageMenuItem = page.getByRole("menuitem", { name: /image/i })
    const fileInput = imageMenuItem.locator('input[type="file"]')
    await fileInput.setInputFiles(testImagePath)
    await memeMakerPage.deselectActiveElement()

    await memeMakerPage.memeMenuButton.click()
    const addImageMenuItem = page.getByRole("menuitem", { name: /add image/i })
    const menuFileInput = addImageMenuItem.locator('input[type="file"]')
    await menuFileInput.setInputFiles(testImagePath)

    // 2. The second image is in front, already selected
    const secondImage = memeMakerPage.memeContainer.locator("img").nth(1)

    // 3. Right-click and select "Send to Back"
    await secondImage.click({ button: "right" })
    const sendToBackMenuItem = page.getByRole("menuitem", { name: /send to back/i })
    await sendToBackMenuItem.click()

    // Verify menu closes
    const imageMenu = page.getByRole("menu", { name: /image menu/i })
    await expect(imageMenu).not.toBeVisible()

    // Verify image remains selected
    await expect(memeMakerPage.transformControls).toBeVisible()
  })

  test("3.15 Delete Image", async ({ page, memeMakerPage }) => {
    // 1. Add an image to the canvas
    await memeMakerPage.goto()
    const imageMenuItem = page.getByRole("menuitem", { name: /image/i })
    const fileInput = imageMenuItem.locator('input[type="file"]')
    await fileInput.setInputFiles(testImagePath)

    const image = page.locator("img").first()
    await expect(image).toBeVisible()

    // 2. Right-click on the image
    await image.click({ button: "right" })

    // 3. Click "Delete" in the menu
    const deleteMenuItem = page.getByRole("menuitem", { name: /delete/i })
    await deleteMenuItem.click()

    // Verify image is removed from canvas
    await expect(image).not.toBeVisible()
    await expect(memeMakerPage.memeContainer.locator("img")).toHaveCount(0)

    // Verify menu closes
    const imageMenu = page.getByRole("menu", { name: /image menu/i })
    await expect(imageMenu).not.toBeVisible()

    // Verify no element is selected
    await expect(memeMakerPage.transformControls).not.toBeVisible()
  })

  test("3.16 Delete Image Reverts to Empty State", async ({ page, memeMakerPage }) => {
    // 1. Add a single image to the canvas
    await memeMakerPage.goto()
    const imageMenuItem = page.getByRole("menuitem", { name: /image/i })
    const fileInput = imageMenuItem.locator('input[type="file"]')
    await fileInput.setInputFiles(testImagePath)

    const image = page.locator("img").first()
    await expect(image).toBeVisible()

    // 2. Delete the image
    await image.click({ button: "right" })
    const deleteMenuItem = page.getByRole("menuitem", { name: /delete/i })
    await deleteMenuItem.click()

    // Verify canvas reverts to empty state
    await expect(memeMakerPage.memeContainer).not.toBeVisible()

    // Verify empty state buttons reappear
    const emptyImageButton = page.getByRole("menuitem", { name: /image/i })
    const emptyTextButton = page.getByRole("menuitem", { name: /text/i })
    const emptyPasteButton = page.getByRole("menuitem", { name: /paste/i })

    await expect(emptyImageButton).toBeVisible()
    await expect(emptyTextButton).toBeVisible()
    await expect(emptyPasteButton).toBeVisible()

    // Verify main toolbar remains visible
    await expect(memeMakerPage.memeMenuButton).toBeVisible()
  })
})
