/**
 * JavaScript code to detect available availability of a
 * particular font in a browser using JavaScript and CSS.
 *
 * Author : Lalit Patel
 * Website: http://www.lalit.org/lab/javascript-css-font-detect/
 * License: Apache Software License 2.0
 *          http://www.apache.org/licenses/LICENSE-2.0
 * Version: 0.15 (21 Sep 2009)
 *          Changed comparision font to default from sans-default-default,
 *          as in FF3.0 font of child element didn't fallback
 *          to parent element if the font is missing.
 * Version: 0.2 (04 Mar 2012)
 *          Comparing font against all the 3 generic font families ie,
 *          'monospace', 'sans-serif' and 'sans'. If it doesn't match all 3
 *          then that font is 100% not available in the system
 * Version: 0.3 (24 Mar 2012)
 *          Replaced sans with serif in the list of baseFonts
 */

/**
 * Usage: const detector = new FontDetector();
 *        detector.detect('font name');
 */
export class FontDetector {
  private readonly baseFonts: string[] = ["monospace", "sans-serif", "serif"]
  private readonly testString = "mmmmmmmmmmlli"
  private readonly testSize = "72px"
  private defaultWidth: Record<string, number> = {}
  private defaultHeight: Record<string, number> = {}
  private s: HTMLSpanElement
  private h: HTMLElement

  constructor() {
    this.h = document.body
    this.s = document.createElement("span")
    this.s.style.fontSize = this.testSize
    this.s.innerHTML = this.testString

    for (const font of this.baseFonts) {
      this.s.style.fontFamily = font
      this.h.appendChild(this.s)
      this.defaultWidth[font] = this.s.offsetWidth
      this.defaultHeight[font] = this.s.offsetHeight
      this.h.removeChild(this.s)
    }
  }

  detect(font: string): boolean {
    let detected = false
    for (const baseFont of this.baseFonts) {
      this.s.style.fontFamily = `"${font}",${baseFont}`
      this.h.appendChild(this.s)
      const matched =
        this.s.offsetWidth !== this.defaultWidth[baseFont] ||
        this.s.offsetHeight !== this.defaultHeight[baseFont]
      this.h.removeChild(this.s)
      detected = detected || matched
    }
    return detected
  }
}
