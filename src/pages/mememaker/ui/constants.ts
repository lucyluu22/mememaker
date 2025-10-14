export const MEME_ID = "meme" // The DOM ID of the meme container

// Used to blacklist certain clicked elements from triggering a deselect of the active element
// e.g. clicking the context menu for an active element should not be considered an intent to deselect
export const PREVENT_DESELECT_CLASS = "js-prevent-deselect"

// Elements with this class will be excluded when rendering the meme to an image
export const EXCLUDE_RENDER_CLASS = "js-exclude-render"
