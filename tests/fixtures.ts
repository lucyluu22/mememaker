import { test as base } from "@playwright/test"
import { PlaywrightMemeMakerPage } from "./PlaywrightMemeMakerPage"

export interface MemeMakerTestFixtures {
  memeMakerPage: PlaywrightMemeMakerPage
}

export const test = base.extend<MemeMakerTestFixtures>({
  memeMakerPage: async ({ page }, run) => {
    await run(new PlaywrightMemeMakerPage(page))
  },
})

export { expect } from "@playwright/test"
