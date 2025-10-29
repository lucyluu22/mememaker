import { type Locator, type Page } from "@playwright/test"

export class PlaywrightMemeMakerPage {
  readonly page: Page
  readonly memeContainer: Locator

  readonly toolbar: Locator
  readonly memeMenu: Locator
  readonly imageMenu: Locator
  readonly textMenu: Locator
  readonly memeMenuButton: Locator
  readonly imageMenuButton: Locator
  readonly textMenuButton: Locator

  readonly transformControls: Locator
  readonly anchorHandleTopLeft: Locator
  readonly anchorHandleTopRight: Locator
  readonly anchorHandleBottomLeft: Locator
  readonly anchorHandleBottomRight: Locator
  readonly anchorHandleTop: Locator
  readonly anchorHandleBottom: Locator
  readonly anchorHandleLeft: Locator
  readonly anchorHandleRight: Locator
  readonly moveHandle: Locator

  constructor(page: Page) {
    this.page = page
    this.memeContainer = page.getByTestId("meme")

    this.toolbar = page.getByRole("toolbar")
    this.memeMenu = page.getByRole("menu", { name: /meme menu/i })
    this.imageMenu = page.getByRole("menu", { name: /image menu/i })
    this.textMenu = page.getByRole("menu", { name: /text menu/i })
    this.memeMenuButton = page.getByRole("button", { name: /meme/i })
    this.imageMenuButton = page.getByRole("button", { name: /image/i })
    this.textMenuButton = page.getByRole("button", { name: /text/i })

    this.transformControls = page.getByTestId("transform-controls")
    this.anchorHandleTopLeft = page.getByTestId("anchor-handle-top-left")
    this.anchorHandleTopRight = page.getByTestId("anchor-handle-top-right")
    this.anchorHandleBottomLeft = page.getByTestId("anchor-handle-bottom-left")
    this.anchorHandleBottomRight = page.getByTestId("anchor-handle-bottom-right")
    this.anchorHandleTop = page.getByTestId("anchor-handle-top")
    this.anchorHandleBottom = page.getByTestId("anchor-handle-bottom")
    this.anchorHandleLeft = page.getByTestId("anchor-handle-left")
    this.anchorHandleRight = page.getByTestId("anchor-handle-right")
    this.moveHandle = page.getByTestId("move-handle")
  }

  async goto() {
    await this.page.goto("/")
  }

  async deselectActiveElement() {
    // title is a guaranteed non-interactive area to click on
    const title = this.page.getByRole("heading", { name: /MemeMakr/i })
    await title.click()
  }

  async moveActiveElement(deltaX: number, deltaY: number) {
    let mouseX
    let mouseY
    if (await this.moveHandle.isVisible()) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const box = (await this.moveHandle.boundingBox())!
      mouseX = box.x + box.width / 2
      mouseY = box.y + box.height / 2
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const box = (await this.transformControls.boundingBox())!
      mouseX = box.x + box.width / 2
      mouseY = box.y + box.height / 2
    }

    await this.page.mouse.move(mouseX, mouseY)
    await this.page.mouse.down()
    await this.page.mouse.move(mouseX + deltaX, mouseY + deltaY)
    await this.page.mouse.up()
  }
}
