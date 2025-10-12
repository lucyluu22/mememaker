import type { MemeState } from "src/entities/meme"
import type { TransformableElement } from "src/shared/ui/TransformControls"

export const calculateMemeDimensions = (
  meme: MemeState,
  defaultWidth: number,
  defaultHeight: number,
): { width: number; height: number } => {
  const memeLayers: TransformableElement[] = [...meme.images, ...meme.texts]
  if (memeLayers.length === 0) {
    return {
      width: defaultWidth,
      height: defaultHeight,
    }
  }
  // Calculate width as the max x position plus the layers's width
  const width = Math.max(...memeLayers.map(layer => layer.x + layer.width))
  // Calculate height as the max y position plus the layers's height
  const height = Math.max(...memeLayers.map(layer => layer.y + layer.height))

  return {
    width,
    height,
  }
}
