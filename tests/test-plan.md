# MemeMaker Application - Comprehensive Test Plan

## Application Overview

**MemeMaker** is a React-based web application for creating and editing memes interactively. The application provides a drag-and-drop canvas for combining images and text with rich editing capabilities.

### Key Features

- **Image Management**: Upload, position, resize, and adjust opacity of images
- **Text Editing**: Add text boxes with rich formatting (font family, size, color, bold, italic, underline, strikethrough)
- **Layer Management**: Control z-order with "Bring to Front" and "Send to Back" operations
- **Transform Controls**: Drag and resize elements with snap boundaries and aspect ratio locking
- **Canvas Controls**: Pan and zoom the canvas for precise editing
- **Clipboard Operations**: Copy/paste images and text elements, copy entire meme as PNG
- **Background Customization**: Change meme background color
- **Export**: Download meme as PNG image

### Technology Stack

- React 19 with TypeScript
- Redux Toolkit for state management
- Styled Components for styling
- Vitest and React Testing Library for testing
- Playwright for end-to-end testing

---

## Test Scenarios

### 1. Initial Application State

**Seed:** `tests/seed.spec.ts`

#### 1.1 Application Loads Successfully

**Steps:**

1. Navigate to the application URL
2. Wait for page to fully load

**Expected Results:**

- Application title "MemeMakr" is visible with version number
- Three action buttons are displayed: "Image", "Text", and "Paste"
- No content is present on the canvas
- Meme menu button is visible in the toolbar

#### 1.2 Empty State UI Elements

**Steps:**

1. Load the application
2. Verify the presence of all UI elements

**Expected Results:**

- Header contains "MemeMakr" title
- Main canvas area is empty with placeholder buttons
- Menubar that contains the following menu items
  - "Add Image" with file upload input
  - "Add Text" button
  - "Paste" button
- "Meme" menu button in toolbar

---

### 2. Main Menu Operations

**Seed:** `tests/seed.spec.ts`

#### 2.1 Open Meme Menu

**Steps:**

1. Load the application
2. Click the "Meme" button in the toolbar

**Expected Results:**

- Context menu opens with aria-label "meme menu"
- Menu contains following items:
  - "Add Image" (with file input)
  - "Add Text"
  - "Paste"
  - "Background Color" (color picker)
  - "Copy" (disabled when no content)
  - "Download" (disabled when no content)
  - "Delete Meme" (disabled when no content)

#### 2.2 Close Meme Menu

**Steps:**

1. Open the meme menu
2. Click the "Meme" button again

**Expected Results:**

- Menu closes
- No menu is visible in the DOM

#### 2.3 Menu Items Enable After Content Added

**Steps:**

1. Open the meme menu
2. Add a text box or image
3. Click outside to deselect
4. Open the meme menu again

**Expected Results:**

- "Copy" menu item is now enabled
- "Download" menu item is now enabled
- "Delete Meme" menu item is now enabled

---

### 3. Image Management

**Seed:** `tests/seed.spec.ts`

#### 3.1 Add Image via Menu

**Steps:**

1. Open the meme menu
2. Click "Add Image" menu item
3. Upload an image file (PNG, JPG, GIF)

**Expected Results:**

- Menu closes automatically
- Image appears on the canvas at position (0, 0)
- Image displays with original dimensions
- Image has transform controls visible (selection border)
- Image is set as the active element
- Toolbar shows image-specific menu button

#### 3.2 Add Image via Empty State Button

**Steps:**

1. Load application with no content
2. Click the "Image" button in the empty state
3. Upload an image file

**Expected Results:**

- Image appears on the canvas
- Empty state buttons are hidden
- Image is selected and active
- Canvas displays with pan/zoom controls

#### 3.3 Move Image by Dragging

**Steps:**

1. Add an image to the canvas
2. Click and hold on the image
3. Drag to a new position
4. Release mouse button

**Expected Results:**

- Image follows mouse cursor during drag
- Image position updates in real-time
- Transform controls move with the image
- Final position is saved when released

#### 3.4 Resize Image by Corner Handle

**Steps:**

1. Add an image to the canvas
2. Click on image to select it (if not already selected)
3. Click and drag a corner resize handle
4. Release mouse button

**Expected Results:**

- Image resizes in place **without** regard to aspect ratio
- Transform controls update to match new size
- Image quality remains intact
- Final size is saved when released

#### 3.5 Resize Image by Edge Handle

**Steps:**

1. Add an image to the canvas
2. Select the image
3. Click and drag an edge resize handle (top, bottom, left, or right)
4. Release mouse button

**Expected Results:**

- Image resizes along the selected axis
- Transform controls update accordingly
- Final dimensions are saved

#### 3.6 Select Image by Clicking

**Steps:**

1. Add multiple images to the canvas
2. Click outside to deselect all
3. Click on a specific image

**Expected Results:**

- Clicked image becomes active
- Transform controls appear around the selected image
- Toolbar displays for the selected image
- Other images remain unselected

#### 3.7 Deselect Image

**Steps:**

1. Add an image and ensure it is selected
2. Click on an empty area of the canvas

**Expected Results:**

- Image is deselected
- Transform controls disappear
- Toolbar hides
- Only main "Meme" menu button remains visible

#### 3.8 Open Image Context Menu

**Steps:**

1. Add and select an image
2. Right-click on the image

**Expected Results:**

- Image context menu opens at cursor position
- Menu displays with aria-label "image menu"
- Menu header shows "Image" with dimensions
- Natural dimensions shown in parentheses
- Current dimensions shown as bold numbers
- Link/unlink icon indicates aspect ratio lock status

#### 3.9 Adjust Image Opacity

**Steps:**

1. Add and select an image
2. Right-click to open image context menu
3. Adjust the opacity slider

**Expected Results:**

- Image opacity changes in real-time as slider moves
- Values range from 0 (transparent) to 100 (opaque)
- Slider updates image immediately without closing menu

#### 3.10 Reset Image Dimensions

**Steps:**

1. Add an image and resize it
2. Right-click on the image
3. Click the link/unlink icon in the menu header

**Expected Results:**

- Image dimensions reset to natural size
- Aspect ratio is restored
- Menu closes after reset
- Image position remains unchanged

#### 3.11 Copy Image

**Steps:**

1. Add an image to the canvas
2. Right-click on the image
3. Click "Copy" in the menu

**Expected Results:**

- Image data is copied to clipboard as custom MIME type
- Menu closes automatically
- Original image remains on canvas
- Success confirmation (implementation-dependent)

#### 3.12 Paste Copied Image

**Steps:**

1. Copy an image (from step 3.11)
2. Open the meme menu
3. Click "Paste"

**Expected Results:**

- New image appears on canvas with same properties as original
- New image has unique ID (duplicate of original)
- New image is positioned at top left of canvas (0, 0)
- New image is selected as active element

#### 3.13 Bring Image to Front

**Steps:**

1. Add multiple images that overlap
2. Select an image that is behind others
3. Right-click and select "Bring to Front"

**Expected Results:**

- Selected image z-index increases to highest value
- Image appears on top of all other elements
- Menu closes
- Image remains selected

#### 3.14 Send Image to Back

**Steps:**

1. Add multiple images that overlap
2. Select an image that is in front
3. Right-click and select "Send to Back"

**Expected Results:**

- Selected image z-index changes to lowest value
- Image appears behind all other elements
- Menu closes
- Image remains selected

#### 3.15 Delete Image

**Steps:**

1. Add an image to the canvas
2. Right-click on the image
3. Click "Delete" in the menu

**Expected Results:**

- Image is removed from canvas
- Image element is no longer in the DOM
- Object URL is revoked (memory cleanup)
- Menu closes
- No element is selected
- If last element, empty state is shown

#### 3.16 Delete Image Reverts to Empty State

**Steps:**

1. Add a single image to the canvas
2. Delete the image

**Expected Results:**

- Canvas reverts to empty state
- Empty state buttons reappear (Image, Text, Paste)
- Pan/zoom controls are hidden
- Main toolbar remains visible

---

### 4. Text Management

**Seed:** `tests/seed.spec.ts`

#### 4.1 Add Text via Menu

**Steps:**

1. Open the meme menu
2. Click "Add Text"

**Expected Results:**

- Menu closes automatically
- Text box appears on canvas at position (0, 0)
- Default text "Meme Text" is displayed
- Text box is selected with transform controls
- Text box is contenteditable
- Toolbar shows with text formatting controls

#### 4.2 Add Text via Empty State Button

**Steps:**

1. Load application with no content
2. Click "Text" button in empty state

**Expected Results:**

- Text box appears on canvas
- Empty state buttons are hidden
- Text box is selected and active
- Formatting toolbar is visible

#### 4.3 Edit Text Content

**Steps:**

1. Add a text box
2. Click inside the text box (if not already selected)
3. Clear existing text
4. Type new text content

**Expected Results:**

- Cursor appears in text box
- Old text can be selected and deleted
- New text appears as typed
- Text box remains selected
- Text content updates in real-time

#### 4.4 Move Text Box by Dragging

**Steps:**

1. Add a text box to the canvas
2. Click and drag the move handle (crosshair icon)
3. Release at new position

**Expected Results:**

- Text box follows cursor during drag
- Move handle is separate from text content (prevents accidental edits)
- Position updates in real-time
- Final position is saved when released

#### 4.5 Resize Text Box

**Steps:**

1. Add a text box to the canvas
2. Click and drag a corner or edge resize handle
3. Release mouse button

**Expected Results:**

- Text box resizes
- Text reflows within the new dimensions
- Font size remains constant (box size changes, not text size)
- Final dimensions are saved

#### 4.6 Select Text Box by Clicking

**Steps:**

1. Add multiple text boxes
2. Click outside to deselect
3. Click on a specific text box

**Expected Results:**

- Clicked text box becomes active
- Transform controls appear
- Formatting toolbar appears
- Text becomes editable

#### 4.7 Deselect Text Box

**Steps:**

1. Add a text box and ensure it is selected
2. Click on empty canvas area

**Expected Results:**

- Text box is deselected
- Transform controls disappear
- Formatting toolbar hides
- Text is no longer directly editable

#### 4.8 Open Text Context Menu

**Steps:**

1. Add and select a text box
2. Right-click on the text box

**Expected Results:**

- Text context menu opens at cursor position
- Menu displays with aria-label "text menu"
- Menu header shows "Text"
- Menu contains color pickers and layer controls

#### 4.9 Change Text Color

**Steps:**

1. Add a text box
2. Right-click to open context menu
3. Use the "Text Color" color picker to select a new color

**Expected Results:**

- Color picker opens when clicked
- Text color changes immediately upon selection
- All text in the box changes to the new color
- Alpha/transparency can be adjusted
- Menu remains open during color adjustment

#### 4.10 Change Text Background Color

**Steps:**

1. Add a text box
2. Right-click to open context menu
3. Use the "Background Color" picker to select a color

**Expected Results:**

- Background color of text box changes
- Transparency can be set (including fully transparent)
- Text remains visible on new background
- Menu remains open during adjustment

#### 4.11 Toggle Bold Formatting

**Steps:**

1. Add a text box with text content
2. Click the Bold (B) button in the toolbar

**Expected Results:**

- All text becomes bold
- Button shows active/pressed state
- Clicking again removes bold formatting
- Text box dimensions may adjust to accommodate bold text

#### 4.12 Toggle Italic Formatting

**Steps:**

1. Add a text box
2. Click the Italic (I) button in toolbar

**Expected Results:**

- All text becomes italic
- Button shows active state
- Clicking again removes italic formatting

#### 4.13 Toggle Underline Formatting

**Steps:**

1. Add a text box
2. Click the Underline (U) button in toolbar

**Expected Results:**

- All text becomes underlined
- Button shows active state
- Clicking again removes underline

#### 4.14 Toggle Strikethrough Formatting

**Steps:**

1. Add a text box
2. Click the Strikethrough (S) button in toolbar

**Expected Results:**

- Text displays with line through middle
- Button shows active state
- Clicking again removes strikethrough

#### 4.15 Change Font Family

**Steps:**

1. Add a text box
2. Click the font family dropdown in toolbar
3. Select a different font

**Expected Results:**

- Dropdown shows available fonts
- Text updates immediately to selected font
- Text box dimensions adjust if needed
- Font persists after deselection

#### 4.16 Change Font Size

**Steps:**

1. Add a text box
2. Adjust the font size control in toolbar

**Expected Results:**

- Font size changes immediately
- Text box may adjust dimensions automatically
- Size values are reasonable (e.g., 8-200px)
- Larger text remains within or expands the box

#### 4.17 Combine Multiple Text Formats

**Steps:**

1. Add a text box
2. Enable bold, italic, and underline
3. Change font and color

**Expected Results:**

- All formatting applies simultaneously
- Text displays with all selected styles
- Each control can be toggled independently
- Visual appearance is correct for combined styles

#### 4.18 Copy Text Box

**Steps:**

1. Add a text box with custom formatting
2. Right-click and select "Copy"

**Expected Results:**

- Text box data copied to clipboard
- Includes all formatting (font, color, size, styles)
- Menu closes
- Original text box remains

#### 4.19 Paste Copied Text Box

**Steps:**

1. Copy a text box (from step 4.18)
2. Open meme menu and click "Paste"

**Expected Results:**

- New text box appears with identical formatting
- New text box has unique ID
- Positioned offset from original
- New text box is selected

#### 4.20 Bring Text to Front

**Steps:**

1. Add overlapping text boxes and images
2. Select a text box that is behind others
3. Right-click and select "Bring to Front"

**Expected Results:**

- Text box z-index increases to highest
- Appears on top of all other elements
- Menu closes

#### 4.21 Send Text to Back

**Steps:**

1. Add overlapping elements
2. Select a text box in front
3. Right-click and select "Send to Back"

**Expected Results:**

- Text box z-index changes to lowest
- Appears behind all other elements
- Menu closes

#### 4.22 Delete Text Box

**Steps:**

1. Add a text box
2. Right-click and select "Delete"

**Expected Results:**

- Text box is removed from canvas
- Menu closes
- No element is selected
- If last element, empty state returns

---

### 5. Canvas Operations

**Seed:** `tests/seed.spec.ts`

#### 5.1 Pan Canvas by Dragging

**Steps:**

1. Add content to canvas (image or text)
2. Click and drag on empty canvas area
3. Release mouse button

**Expected Results:**

- Canvas content moves with drag motion
- Cursor may change to indicate pan mode
- All elements move together
- Canvas position updates smoothly

#### 5.2 Zoom In Using Scroll Wheel

**Steps:**

1. Add content to canvas
2. Hover over canvas
3. Scroll wheel up (away from user)

**Expected Results:**

- Canvas content zooms in
- Zoom indicator appears showing percentage
- Content remains centered or zooms toward cursor
- Zoom level increases (max 100%)

#### 5.3 Zoom Out Using Scroll Wheel

**Steps:**

1. Add content to canvas (zoom to 100% first)
2. Scroll wheel down (toward user)

**Expected Results:**

- Canvas content zooms out
- Zoom indicator updates with new percentage
- Content remains proportional
- Zoom level decreases (min 10%)

#### 5.4 Zoom Using Trackpad Pinch Gesture

**Steps:**

1. Add content to canvas
2. Use two-finger pinch gesture on trackpad
3. Pinch out to zoom in, pinch in to zoom out

**Expected Results:**

- Canvas zooms smoothly with gesture
- Zoom is centered on gesture point
- Zoom indicator updates
- Gesture is recognized on Mac/Windows trackpads

#### 5.5 Zoom Using Touch Pinch Gesture (Mobile/Tablet)

**Steps:**

1. Load application on touch device
2. Add content to canvas
3. Use two-finger pinch gesture on screen

**Expected Results:**

- Canvas zooms with touch gesture
- Multi-touch is recognized
- Zoom is smooth and responsive
- Works on iOS and Android devices

#### 5.6 Zoom Limits

**Steps:**

1. Add content to canvas
2. Attempt to zoom in beyond 100%
3. Attempt to zoom out beyond 10%

**Expected Results:**

- Maximum zoom is clamped at 100%
- Minimum zoom is clamped at 10%
- Zoom indicator shows min/max values
- Further zoom gestures have no effect at limits

#### 5.7 Pan with Touch Gesture (Mobile/Tablet)

**Steps:**

1. Load on touch device with content
2. Use single finger to drag canvas

**Expected Results:**

- Canvas pans with touch drag
- Single touch is recognized for panning
- Two-touch is reserved for zoom
- Panning is smooth

#### 5.8 Context Menu on Canvas Background

**Steps:**

1. Add content to canvas
2. Right-click on empty canvas area (not on element)

**Expected Results:**

- Meme context menu opens
- Same menu as clicking "Meme" toolbar button
- Contains all global meme operations

---

### 6. Background Customization

**Seed:** `tests/seed.spec.ts`

#### 6.1 Use White Background (Default)

**Steps:**

1. Load fresh application
2. Add content to canvas
3. Observe initial background color

**Expected Results:**

- Default background is white (#ffffff)
- Background is opaque
- Provides good contrast for content

#### 6.2 Change Background Color

**Steps:**

1. Add content to canvas
2. Open meme menu
3. Select "Background Color" option
4. Choose a new color from the color picker

**Expected Results:**

- Color picker opens
- Canvas background updates immediately
- Color change is visible behind all elements
- Menu remains open during color selection

---

### 7. Copy and Export Operations

**Seed:** `tests/seed.spec.ts`

#### 7.1 Copy Meme as PNG

**Steps:**

1. Add content to canvas (images and/or text)
2. Deselect all elements (click on canvas)
3. Open meme menu
4. Click "Copy"

**Expected Results:**

- Meme is rendered to PNG format
- PNG is written to system clipboard
- Menu closes
- Success notification (implementation-dependent)
- Transform controls are excluded from render
- Canvas background is included

#### 7.2 Download Meme as PNG

**Steps:**

1. Add content to canvas
2. Deselect all elements
3. Open meme menu
4. Click "Download"

**Expected Results:**

- PNG file is generated
- Browser download prompt appears
- Default filename is "meme.png"
- Downloaded file contains complete meme
- Transform controls are not in the export
- File can be opened in image viewer

#### 7.3 Copy/Download with No Content Shows Disabled

**Steps:**

1. Load application with no content
2. Open meme menu
3. Observe "Copy" and "Download" menu items

**Expected Results:**

- Both items are visually disabled (grayed out)
- Items have disabled attribute
- Clicking has no effect
- Tooltip or visual indication of why disabled

#### 7.4 Paste Image from System Clipboard

**Steps:**

1. Copy an image to system clipboard (from another app)
2. Open meme menu
3. Click "Paste"

**Expected Results:**

- Image appears on canvas
- Image is loaded from clipboard
- Image is selected
- Menu closes

#### 7.5 Paste Plain Text from System Clipboard

**Steps:**

1. Copy plain text to system clipboard
2. Open meme menu (or use Paste button if no content)
3. Click "Paste"

**Expected Results:**

- New text box is created
- Text box contains the clipboard text
- HTML characters are escaped
- Text box is selected
- Menu closes

#### 7.6 Paste Custom Meme Element (Text)

**Steps:**

1. Add a text box with custom formatting
2. Copy it using the element context menu
3. Click "Paste" from meme menu

**Expected Results:**

- New text box appears
- All formatting is preserved
- Custom MIME type is recognized
- New element has unique ID

#### 7.7 Paste Custom Meme Element (Image)

**Steps:**

1. Add an image with custom sizing/opacity
2. Copy it using element context menu
3. Paste from meme menu

**Expected Results:**

- New image appears
- Dimensions and opacity are preserved
- Image data is recreated
- New element has unique ID

---

### 8. Layer Management and Z-Order

**Seed:** `tests/seed.spec.ts`

#### 8.1 Elements Stack in Order Added

**Steps:**

1. Add first image
2. Add second image overlapping first
3. Add text box overlapping both

**Expected Results:**

- Second image appears in front of first
- Text appears in front of both images
- Z-order matches order of addition
- Layers can be identified by click target

#### 8.2 Bring Element Forward

**Steps:**

1. Add three overlapping elements (A, B, C)
2. Select element A (bottom)
3. Right-click and "Bring to Front"

**Expected Results:**

- Element A now on top of B and C
- Z-index is highest
- Visual stacking order is correct

#### 8.3 Send Element Backward

**Steps:**

1. With three elements (A on top)
2. Select element A
3. Right-click and "Send to Back"

**Expected Results:**

- Element A now behind B and C
- Z-index is lowest
- Element appears at bottom of stack

#### 8.4 Layer Order Persists Through Selection

**Steps:**

1. Create layered elements
2. Select different elements in various orders
3. Verify visual stacking

**Expected Results:**

- Z-order remains stable
- Selecting elements doesn't change layer order
- Only explicit layer commands change z-index

---

### 9. Selection and Interaction

**Seed:** `tests/seed.spec.ts`

#### 9.1 Single Element Selection

**Steps:**

1. Add multiple elements
2. Click on one element

**Expected Results:**

- Clicked element becomes active
- Transform controls appear
- Element-specific toolbar appears
- Other elements remain unselected

#### 9.2 Deselection by Clicking Background

**Steps:**

1. Select an element
2. Click on empty canvas area

**Expected Results:**

- Active element is deselected
- Transform controls disappear
- Toolbar hides (except main Meme button)
- No element is highlighted

#### 9.3 Selection Prevented on Toolbar Click

**Steps:**

1. Select an element
2. Click on toolbar buttons or menu

**Expected Results:**

- Selection is maintained
- Clicking toolbar doesn't deselect element
- Can interact with toolbar while element selected
- PREVENT_DESELECT_CLASS prevents unwanted deselection

#### 9.4 Selection Prevented on Context Menu Click

**Steps:**

1. Select an element and open its context menu
2. Click on menu items

**Expected Results:**

- Element remains selected during menu interaction
- Menu operations complete correctly
- Selection state is preserved

#### 9.5 Click to Toggle Selection

**Steps:**

1. Add an image
2. Click on the image (it selects)
3. Click on the same image again

**Expected Results:**

- First click selects the image
- Second click deselects it
- Transform controls appear and disappear accordingly

---

### 10. Transform Controls and Snap Boundaries

**Seed:** `tests/seed.spec.ts`

#### 10.1 Resize Handles Visible on Selection

**Steps:**

1. Add an image or text box
2. Select it

**Expected Results:**

- Eight resize handles appear (4 corners, 4 edges)
- Handles are positioned at element boundaries
- Handles are clickable/draggable
- Handle size scales with inverse zoom

#### 10.2 Move Handle for Text Box

**Steps:**

1. Add a text box
2. Select it

**Expected Results:**

- Move handle (crosshair icon) appears
- Positioned at top center of text box
- Allows dragging without editing text
- Visually distinct from resize handles

#### 10.3 Snap to Canvas Boundaries

**Steps:**

1. Add an element
2. Drag it toward canvas edge

**Expected Results:**

- Element snaps to canvas boundary
- Visual indication of snap (subtle)
- Prevents element from going off-canvas
- Snap boundaries calculated dynamically

#### 10.4 Snap to Center Lines

**Steps:**

1. Add an element
2. Drag toward horizontal or vertical center

**Expected Results:**

- Element snaps to center alignment
- Both horizontal and vertical centers available
- Visual guide appears during snap
- Helps with centered layouts

#### 10.5 Snap to Other Elements

**Steps:**

1. Add two elements
2. Drag one element near the other

**Expected Results:**

- Element snaps to align with edges of other element
- Alignment works for all four edges
- Visual snap indicator
- Helps create aligned layouts

#### 10.6 Aspect Ratio Lock for Images

**Steps:**

1. Add an image
2. Drag a corner resize handle

**Expected Results:**

- Image maintains aspect ratio
- Width and height scale proportionally
- Natural aspect ratio is preserved
- Prevents image distortion

#### 10.7 Aspect Ratio Unlock for Edge Resize

**Steps:**

1. Add an image
2. Drag an edge handle (not corner)

**Expected Results:**

- Image stretches along one axis
- Aspect ratio can change
- Allows intentional distortion
- Width or height changes independently

#### 10.8 Text Box Free Resize

**Steps:**

1. Add a text box
2. Drag any resize handle

**Expected Results:**

- Text box resizes freely
- No aspect ratio lock
- Text reflows within new dimensions
- All handles allow free sizing

#### 10.9 Transform Controls Scale with Zoom

**Steps:**

1. Add and select an element
2. Zoom canvas in and out

**Expected Results:**

- Transform controls remain visible at all zoom levels
- Control size appears constant (inverse scale applied)
- Handles remain clickable
- Visual consistency across zoom levels

---

### 11. Keyboard and Accessibility

**Seed:** `tests/seed.spec.ts`

#### 11.1 Tab Navigation (Basic)

**Steps:**

1. Load application
2. Press Tab key repeatedly

**Expected Results:**

- Focus moves through interactive elements
- Toolbar button receives focus
- Visual focus indicator is present
- Tab order is logical

#### 11.2 Enter Key in Text Editor

**Steps:**

1. Add a text box
2. Click to edit text
3. Press Enter key

**Expected Results:**

- New line is created in text
- Text box height may adjust
- Cursor moves to new line
- Line breaks are preserved

#### 11.3 Escape Key Behavior

**Steps:**

1. Open a context menu
2. Press Escape key

**Expected Results:**

- Menu closes
- Focus returns to previous element
- No other state changes occur

#### 11.4 Screen Reader Support (Basic)

**Steps:**

1. Enable screen reader
2. Navigate through application

**Expected Results:**

- Menus have proper aria-labels
- Buttons have descriptive labels
- Interactive elements are announced
- Application is navigable without mouse

---

### 12. Mobile and Touch Support

**Seed:** `tests/seed.spec.ts`

#### 12.1 Touch to Select Element

**Steps:**

1. Load on touch device
2. Add content
3. Tap on an element

**Expected Results:**

- Element selects on tap
- Transform controls appear
- Touch targets are appropriately sized
- No accidental selections

#### 12.2 Long Press for Context Menu

**Steps:**

1. Add an element on touch device
2. Long press on the element

**Expected Results:**

- Context menu opens after long press
- Long press duration is reasonable (~500ms)
- Menu positioned near touch point
- Prevents accidental activation

#### 12.3 Touch Drag to Move Element

**Steps:**

1. Select an element on touch device
2. Touch and drag the element

**Expected Results:**

- Element moves with touch
- Touch tracking is accurate
- No page scrolling during element drag
- Touch release completes move

#### 12.4 Pinch Zoom on Touch Device

**Steps:**

1. Add content on touch device
2. Use two-finger pinch gesture

**Expected Results:**

- Canvas zooms with pinch
- Multi-touch recognized
- Zoom is smooth
- Zoom indicator appears

#### 12.5 Touch Pan Canvas

**Steps:**

1. Add content on touch device
2. Touch and drag empty canvas area

**Expected Results:**

- Canvas pans with touch
- Distinguishes from element drag
- No element selection during pan
- Smooth panning motion

#### 12.6 Text Editing on Touch Device

**Steps:**

1. Add text box on touch device
2. Tap to select
3. Tap again to edit

**Expected Results:**

- Text becomes editable
- Virtual keyboard appears
- Text selection handles appear
- Can edit text normally

---

### 13. Delete and Reset Operations

**Seed:** `tests/seed.spec.ts`

#### 13.1 Delete Single Element

**Steps:**

1. Add multiple elements
2. Select one element
3. Delete via context menu

**Expected Results:**

- Selected element is removed
- Other elements remain
- Canvas remains visible
- No element is selected

#### 13.2 Delete All Meme Content

**Steps:**

1. Add multiple elements (images and text)
2. Open meme menu
3. Click "Delete Meme"

**Expected Results:**

- All elements are removed
- Canvas reverts to empty state
- Empty state buttons reappear
- Pan/zoom controls hide
- Background color resets to white

#### 13.3 Delete Meme Confirmation (if implemented)

**Steps:**

1. Add content
2. Click "Delete Meme"

**Expected Results:**

- Confirmation dialog appears (if implemented)
- Can cancel deletion
- Can confirm deletion
- Protects against accidental deletion

#### 13.4 Delete Last Element Returns to Empty State

**Steps:**

1. Add a single element
2. Delete it

**Expected Results:**

- Empty state is restored
- Action buttons (Image, Text, Paste) reappear
- Canvas is cleared
- Application ready for new meme

---

### 14. Error Handling and Edge Cases

**Seed:** `tests/seed.spec.ts`

#### 14.1 Upload Unsupported File Type

**Steps:**

1. Click "Add Image"
2. Attempt to upload a non-image file (PDF, TXT, etc.)

**Expected Results:**

- File picker filters to images only (accept="image/\*")
- Non-image files are not selectable or rejected
- No error occurs
- Application state unchanged

#### 14.2 Upload Very Large Image

**Steps:**

1. Upload an extremely large image (>10MB or >4000px)
2. Wait for processing

**Expected Results:**

- Image loads successfully or shows error
- Browser handles large file appropriately
- No application crash
- Performance remains acceptable or warning shown

#### 14.3 Upload Very Small Image

**Steps:**

1. Upload a tiny image (1x1 pixel)
2. Observe result

**Expected Results:**

- Image appears on canvas
- Can be resized larger
- Transform controls work normally
- No errors occur

#### 14.4 Paste with No Clipboard Access

**Steps:**

1. Load application (no clipboard permission)
2. Click "Paste"

**Expected Results:**

- Operation fails gracefully
- No error thrown to user
- Application remains functional
- Permission prompt may appear (browser-dependent)

#### 14.5 Add Text with Empty Content

**Steps:**

1. Add a text box
2. Delete all text content
3. Click outside

**Expected Results:**

- Empty text box persists
- Can be selected and edited again
- Transform controls work normally
- Can add text back later

#### 14.6 Resize to Zero or Negative Dimensions

**Steps:**

1. Add an element
2. Attempt to resize to zero width/height

**Expected Results:**

- Minimum dimensions are enforced
- Element cannot disappear
- Resize stops at reasonable minimum
- Element remains interactive

#### 14.7 Rapid Element Addition

**Steps:**

1. Quickly add multiple elements in succession
2. Verify all are added correctly

**Expected Results:**

- All elements are added
- Each has unique ID
- No race conditions
- State remains consistent

#### 14.8 Browser Refresh with Content

**Steps:**

1. Add content to canvas
2. Refresh the browser page

**Expected Results:**

- Content is not persisted (by design, no localStorage)
- Fresh application loads
- Empty state is shown
- No errors occur

#### 14.9 Copy/Download with Only White Canvas

**Steps:**

1. Load application with no content
2. Verify Copy/Download are disabled

**Expected Results:**

- Both options are disabled
- Attempting to enable programmatically fails
- No broken state

---

### 15. Performance and Responsiveness

**Seed:** `tests/seed.spec.ts`

#### 15.1 Application Load Time

**Steps:**

1. Measure time from navigation to interactive

**Expected Results:**

- Application loads in under 3 seconds
- JavaScript bundle size is reasonable
- No blocking resources
- Progressive rendering

#### 15.2 Many Elements Performance

**Steps:**

1. Add 20+ elements to canvas
2. Test drag, zoom, and interaction responsiveness

**Expected Results:**

- Interactions remain smooth (60fps ideal)
- No significant lag
- Transform controls update in real-time
- May show performance degradation gracefully

#### 15.3 Zoom/Pan Smoothness

**Steps:**

1. Add content
2. Rapidly zoom in and out
3. Pan canvas in various directions

**Expected Results:**

- Animations are smooth
- No jittering or stuttering
- Debouncing prevents event flooding
- Zoom indicator updates smoothly

#### 15.4 Text Editing Responsiveness

**Steps:**

1. Add text box
2. Type quickly

**Expected Results:**

- Text appears with minimal latency
- No dropped characters
- Cursor position accurate
- Undo/redo works (browser native)

---

## Test Execution Notes

### Prerequisites

- Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Clipboard API support (required for paste operations)
- JavaScript enabled
- Adequate screen resolution (minimum 1024x768 recommended)

### Test Data

- Sample images: PNG, JPG, GIF formats
- Various sizes: small (100x100), medium (800x600), large (2000x2000)
- Text samples: short phrases, long paragraphs, special characters

### Browser Compatibility Testing

Each test scenario should be verified across:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest, desktop and iOS)
- Mobile browsers (Chrome Mobile, Safari iOS)

### Known Limitations

- No server-side persistence (intentional design)
- Clipboard API requires user permission
- Safari has specific gesture event handling
- Touch devices may have different interaction patterns

---

## Automated Test Coverage

The following test scenarios are partially covered by existing Vitest unit tests in `src/app/App.test.tsx`:

- Initial render with empty state buttons
- Meme menu open/close
- Adding image via file input
- Moving and deleting images
- Adding and editing text
- Deleting text boxes
- Copy meme as PNG (mocked)
- Download meme (mocked)

**Additional Playwright E2E tests should cover:**

- Real clipboard operations
- Touch gestures and mobile interactions
- Canvas pan/zoom behavior
- Context menu positioning
- Multiple element interactions
- Performance testing
- Cross-browser compatibility

---

## Regression Test Checklist

After any code changes, verify these critical paths:

✓ Add image and text elements  
✓ Move and resize elements  
✓ Delete elements  
✓ Context menus open correctly  
✓ Copy/paste operations work  
✓ Export to PNG functions  
✓ Layer ordering maintains correctly  
✓ Canvas zoom and pan responsive  
✓ Touch gestures work on mobile  
✓ No console errors on any operation

---

**Document Version:** 1.0  
**Last Updated:** October 21, 2025  
**Application Version:** Based on current dev branch  
**Test Plan Author:** Generated from App.test.tsx analysis
