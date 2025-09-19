import type { MemeState } from "src/entities/meme"

export const calculateMemeDimensions = (
  meme: MemeState,
  defaultWidth: number,
  defaultHeight: number,
): { width: number; height: number } => {
  // Calculate width as the max x position plus the image's width
  const width =
    meme.images.length > 0
      ? Math.max(...meme.images.map(img => img.x + img.scaledWidth))
      : defaultWidth
  // Calculate height as the max y position plus the image's height
  const height =
    meme.images.length > 0
      ? Math.max(...meme.images.map(img => img.y + img.scaledHeight)) -
        Math.min(...meme.images.map(img => img.y))
      : defaultHeight

  return {
    width,
    height,
  }
}
