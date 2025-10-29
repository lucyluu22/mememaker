// spec: tests/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "./fixtures"

test.describe("6. Background Customization", () => {
  test("6.1 Use White Background (Default)", async ({ page, memeMakerPage }) => {
    // 1. Load fresh application
    await memeMakerPage.goto()

    // 2. Add content to canvas
    await page.getByRole("menuitem", { name: /^text$/i }).click()

    // 3. Observe initial background color
    const container = memeMakerPage.memeContainer
    await expect(container).toBeVisible()

    const bg = await container.evaluate(el => getComputedStyle(el).backgroundColor)
    // Accept rgb or rgba for white
    expect(bg === "rgb(255, 255, 255)" || bg === "rgba(255, 255, 255, 1)").toBeTruthy()
  })

  test("6.2 Change Background Color", async ({ page, memeMakerPage }) => {
    // 1. Add content to canvas
    await memeMakerPage.goto()
    await page.getByRole("menuitem", { name: /^text$/i }).click()
    await memeMakerPage.deselectActiveElement()

    // 2. Open meme menu
    await memeMakerPage.memeMenuButton.click()
    const memeMenu = page.getByRole("menu", { name: /meme menu/i })
    await expect(memeMenu).toBeVisible()

    // 3. Select "Background Color" option
    const bgLabel = memeMenu.getByText(/background color/i)
    await expect(bgLabel).toBeVisible()
    // There should be a color input somewhere in the menu
    const colorInput = memeMenu.getByRole("textbox", { name: /background color/i })
    await expect(colorInput).toBeVisible()

    // 4. Choose a new color from the color picker
    await colorInput.fill("#ff0000")

    // Expected: Canvas background updates immediately
    const container = memeMakerPage.memeContainer
    const newBg = await container.evaluate(el => getComputedStyle(el).backgroundColor)
    expect(newBg).not.toBe("rgb(255, 255, 255)")
  })
})
