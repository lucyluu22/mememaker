import { pick } from "lodash"
import type { MemeLayer } from "./memeLayer"

export interface MemeImage extends MemeLayer {
  url: string // The image file URL
  naturalWidth: number // original image width
  naturalHeight: number // original image height
  opacity: number // image opacity between 0 and 1
}

export interface CopiedMemeImage {
  base64Image: string
  naturalWidth: number
  naturalHeight: number
  width: number
  height: number
  opacity: number
}

export const copyMemeImage = async (image: MemeImage): Promise<CopiedMemeImage> => {
  // Get image blob from url
  const imageBlob = await fetch(image.url).then(res => res.blob())
  const base64Image = await new Promise<string>(resolve => {
    const reader = new FileReader()
    reader.onloadend = () => {
      resolve(reader.result as string)
    }
    reader.readAsDataURL(imageBlob)
  })

  return {
    base64Image,
    ...pick(image, ["naturalWidth", "naturalHeight", "width", "height", "opacity"]),
  }
}

export const parseCopiedMemeImage = async (copiedMemeImage: CopiedMemeImage) => {
  const imageBlob = await fetch(copiedMemeImage.base64Image).then(res => res.blob())
  // Create a new object url from the blob
  const url = URL.createObjectURL(imageBlob)

  return {
    url,
    naturalWidth: copiedMemeImage.naturalWidth,
    naturalHeight: copiedMemeImage.naturalHeight,
    width: copiedMemeImage.width,
    height: copiedMemeImage.height,
    opacity: copiedMemeImage.opacity,
  }
}
