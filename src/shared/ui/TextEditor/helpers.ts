// Returns true if the color is light, false if dark
// Accepts hex color string (e.g. "#ffffff" or "ffffff")
export const isColorLight = (hex: string): boolean => {
  let c = hex.replace(/^#/, "")
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2]
  }
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  // Perceived luminance formula (not linearized, approximation good enough for this)
  return 0.299 * r + 0.587 * g + 0.114 * b > 186
}
