# Halftone Pattern Editor Guide

This guide explains how to find, edit, and apply dynamic halftone patterns to images in the WordPress Block Editor and Site Editor.

---

## 1. Where Are the Halftone Controls?

The halftone pattern generator is integrated directly into the native **WordPress Image Block (`core/image`)**.

Any photograph on the site that uses an Image block can have dynamic concentric halftone patterns applied and customized in the editor UI.

> [!NOTE]
> Pre-styled photos on the site (such as the About "Our Story" photo, Impact "Community Projects" photo, and "Meet Malika" portfolio photo) already have halftone enabled by default. You can select them at any time to adjust their template, spread, dot size, shrink rate, or color.

---

## 2. Step-by-Step Navigation in the WordPress UI

### Step 1: Open the Page or Post in the Editor
- In the WordPress Admin dashboard, navigate to **Pages → All Pages** (or **Appearance → Editor** for site templates).
- Click on the page you want to edit (e.g., **About**, **Impact**, or **Home**).

### Step 2: Select the Image Block
- Click directly on the photograph you wish to customize.
- Check the breadcrumb bar at the bottom left of the editor canvas to confirm that you have selected the **Image** block:
  ```
  Document > Group > Image
  ```
  *(If you clicked a surrounding container such as a Group or Column, click the image itself to select the `core/image` block).*

> [!TIP]
> **If the section is content-locked (e.g. "About · Our Story"):**
> Pre-assembled sections use WordPress content-locking to protect layout structure. When selecting an image inside one of these sections, the sidebar will display the section container with an **"Edit pattern"** button at the top and a simplified "Content" / "Media" list.
> 
> Simply click the **"Edit pattern"** button in the sidebar (or toolbar). This temporarily unlocks full block settings and displays the **Halftone Pattern Settings** panel for the image. When finished, click the back arrow or "Done" to return to standard page editing.

### Step 3: Open the Settings Sidebar
- In the top-right corner of the editor toolbar, click the **Settings** icon (the gear / sidebar toggle icon).
- At the top of the sidebar, make sure the **Block** tab is active (not the "Page" tab).

```
+-------------------------------------------------------------+
|  WordPress Toolbar                        [Save] [⚙ Settings] |
+-------------------------------------------------------+-----+
|                                                       |Block|
|                                                       +-----+
|  Editor Canvas                                        |Image|
|                                                       |     |
|   [ Selected Image ]                                  |▼ Halftone
|                                                       |  Pattern
|                                                       |  Settings
+-------------------------------------------------------+-----+
```

### Step 4: Locate "Halftone Pattern Settings"
- In the Block settings sidebar, you will see the **Halftone Pattern Settings** panel.
- This panel is **open by default** whenever an Image block is selected.

---

## 3. Available Controls & What They Do

Inside the **Halftone Pattern Settings** panel, you will find eight controls:

### 1. Halftone Pattern Template (Dropdown)
Choose the pattern geometry:
- **Default (Inherit from photo style)**: Uses the recommended pattern if the image has a LakeHub style class (`rectangular` for story, community, and portfolio photos).
- **Rectangular Concentric Rings**: Dots form concentric rectangular rings expanding outward from the center. All dots along the same perimeter loop have the exact same radius.
- **Circular Concentric Rings**: Dots form concentric circular rings expanding radially. All dots along the same circular ring circumference have the exact same radius.
- **None / Disabled**: Disables halftone generation completely on this image.

### 2. Pattern Placement / Corner Offset (Dropdown & Sliders)
Offset the placement of the halftone pattern relative to the image frame:
- **Default (Inherit from photo style)**: Automatically applies the design corner offset if using a pre-styled photo (`Bottom-Left` for Our Story, `Top-Left` for Community Projects, `Bottom-Right` for Inspiring Portfolios).
- **Centered (0px, 0px)**: Centers the halftone pattern symmetrically behind the photo.
- **Bottom-Left (-35px, +35px)**: Shifts pattern down and left (matches the About "Our Story" layout).
- **Top-Left (-35px, -35px)**: Shifts pattern up and left (matches the Impact "Community Projects" layout).
- **Bottom-Right (+35px, +25px)**: Shifts pattern down and right (matches the Impact "Inspiring Portfolios" layout).
- **Top-Right (+35px, -35px)**: Shifts pattern up and right.
- **Custom (Manual Sliders)**:
  - **Horizontal Offset (X)**: Slider from `-120px` to `+120px` (shifts left/right).
  - **Vertical Offset (Y)**: Slider from `-120px` to `+120px` (shifts up/down).

### 3. Pattern Container Size (Scale) (Slider)
- **Range**: `0.60` to `2.50` (Default: `1.25`).
- **Function**: Adjusts the cut-off boundary (the length of the diagonals for rectangular patterns, or the circle diameter for circular patterns) while strictly maintaining the container aspect ratio.
- **Isolation Guarantee**: This control scales **only the background dots layer**. It does not scale, resize, or alter the photo image or any text/content on top of the pattern.

### 4. Dot Spacing (px) (Slider)
- **Range**: `10px` to `32px` (Default: `16px`).
- **Function**: Configures the distance (pitch) between dots across all rings.

### 5. Center Max Dot Size (px) (Slider)
- **Range**: `2px` to `20px` (Default: `7.5px`).
- **Function**: Sets the diameter of the innermost dots at the center of the image.

### 6. Ring Shrink Factor (Slider)
- **Range**: `0.60` to `0.98` (Default: `0.88`).
- **Function**: Controls how fast dot sizes shrink as they radiate outward towards the perimeter. All dots on the same concentric ring/perimeter share the identical size, reducing ring-by-ring outward.
  - Lower values (e.g. `0.75`): Faster vignette fade; dots shrink quickly.
  - Higher values (e.g. `0.92`): Gentler vignette fade; dots remain larger near the edges.

### 7. Dot Color (Color Palette & Custom Picker)
- Choose a branded color preset or pick any custom HEX color:
  - **LakeHub Teal**: `#00676B` *(Theme default)*
  - **Deep Teal**: `#004F52`
  - **LakeHub Orange**: `#F15A24`
  - **Dark Charcoal**: `#1E1E1E`
  - **Light Gray**: `#E0E0E0`
  - **White**: `#FFFFFF`
- You can also click the custom color indicator to enter any HEX code.

---

## 4. Key Design Properties

- **Perimeter-Uniform Dot Sizing**: Dots along any given concentric ring or perimeter (both rectangular and circular) have identical diameter, ensuring smooth, symmetrical vignette fading.
- **Configurable Dot Spacing**: Dot spacing is adjustable from `10px` to `32px` directly within the Block Inspector.
- **Interactive Mouse Repel**: On fine-pointer devices (desktop mice/trackpads), dots smoothly repel away from the cursor as you hover near the photo frame, resetting cleanly on pointer leave.
- **Responsive Layout**: Patterns automatically scale and recalculate via `ResizeObserver` across mobile, tablet, and desktop viewports.
- **Accessibility**: Under `prefers-reduced-motion: reduce`, cursor repulsion is automatically disabled and patterns remain statically positioned.

---

## 5. Troubleshooting

| Issue | Solution |
|---|---|
| **I see "Edit pattern" and only Content/Media in the sidebar** | The image is inside a content-locked section (such as `About · Our Story`). Click the **"Edit pattern"** button at the top of the sidebar. This unlocks individual block settings and reveals the **Halftone Pattern Settings** panel. |
| **I don't see the "Halftone Pattern Settings" panel in the sidebar** | Make sure you have selected an **Image block** (`core/image`) and that the **Block** tab (not Page tab) is selected in the right sidebar. |
| **I clicked a hero section image, but the panel isn't there** | Hero sections use the **Cover block** (`core/cover`), which does not use halftone decoration. Halftone controls are designed for **Image blocks**. |
| **I changed the color or spread, but I don't see it on the frontend** | Click **Update / Save** in the top right of the editor to persist the block attributes to the page. |
| **I want to remove the halftone pattern from an image** | In the "Halftone Pattern Template" dropdown, select **None / Disabled**. |
