# Design System Documentation: Nocturnal Cobalt

## 1. Overview & Creative North Star: "The Luminescent Archive"
This design system is a sophisticated evolution into the dark mode spectrum. Our Creative North Star is **"The Luminescent Archive."** We are moving away from the "flat web" by treating the UI as a physical space—a deep, obsidian environment where information is illuminated by soft, internal glows rather than harsh external lights.

To move beyond the "template" look, this system rejects the rigid 12-column grid in favor of **Intentional Asymmetry**. We utilize generous white space (negative space) and overlapping layers to create a high-end, editorial feel. The goal is a digital experience that feels curated, quiet, and premium, where the cobalt accents act as "energy sources" within a deep-sea architectural space.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
The palette is built on deep navy and slate foundations, layered to create perceived depth without the use of distracting borders.

### The Color Logic
*   **Background & Surface (`#0b1326`):** The absolute base. It is the void upon which everything else sits.
*   **Primary Accent (`#1e55be`):** The "Cobalt Pulse." Use this sparingly for high-intent actions and critical brand moments.
*   **The "No-Line" Rule:** Standard 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section sitting directly on a `surface` background creates a sophisticated, "borderless" division.
*   **The "Glass & Gradient" Rule:** To achieve a signature look, primary CTAs should not be flat. Use a subtle linear gradient from `primary` (#b2c5ff) to `primary_container` (#1e55be) at a 135-degree angle. This adds "soul" and a liquid-like quality to interactive elements.

### Surface Hierarchy & Nesting
Instead of a flat grid, treat the UI as a series of physical layers.
*   **Base Layer:** `surface` (#0b1326)
*   **Recessed Content:** `surface_container_lowest` (#060e20)
*   **Standard Cards:** `surface_container` (#171f33)
*   **Elevated Overlays:** `surface_bright` (#31394d) with 20px backdrop-blur.

---

## 3. Typography: Editorial Authority
We utilize **Plus Jakarta Sans** for its modern, geometric clarity. The hierarchy is designed to feel like a high-end print magazine.

*   **Display & Headlines:** Use `display-lg` and `headline-lg` to create focal points. Don't be afraid to let headlines overlap with image containers slightly (using negative margins) to break the "box" layout.
*   **Body & Labels:** `body-md` is your workhorse. Use `on_surface_variant` (#c3c6d5) for secondary body text to reduce visual noise and maintain the dark-mode "comfort" level.
*   **Visual Rhythm:** Always pair a massive `display-sm` headline with a tight, uppercase `label-md` for sub-headers. This high-contrast scale creates an immediate sense of premium design.

---

## 4. Elevation & Depth: Tonal Layering
In "The Luminescent Archive," shadows are not dark; they are ambient light.

*   **The Layering Principle:** Depth is achieved by stacking. Place a `surface_container_high` card on top of a `surface_container` background. The subtle shift in hex code provides enough contrast to signify hierarchy without a single line being drawn.
*   **Ambient Shadows:** For floating elements (Modals/Popovers), use a highly diffused shadow: `0px 20px 40px rgba(0, 0, 0, 0.4)`. To add the signature "Cobalt" feel, add a secondary, very faint glow: `0px 0px 15px rgba(30, 85, 190, 0.15)`.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` (#434653) at **15% opacity**. It should be felt, not seen.
*   **Glassmorphism:** For top navigation bars and floating action menus, use `surface_container` at 70% opacity with a `blur(12px)`. This integrates the UI with the content scrolling beneath it.

---

## 5. Components: The Signature Building Blocks

### Buttons
*   **Primary:** Cobalt gradient (`primary_container` to `primary`). Rounded at `md` (0.75rem). No border.
*   **Secondary:** Ghost style. No background, `outline_variant` at 20% opacity. Text in `primary`.
*   **Interaction:** On hover, primary buttons should emit a soft cobalt outer glow (`box-shadow: 0 0 20px rgba(30, 85, 190, 0.4)`).

### Cards & Lists
*   **Rule:** Forbid the use of divider lines.
*   **Implementation:** Separate list items using the spacing scale (e.g., `spacing-3` / 1rem). For cards, use `surface_container_low` for the card body and `surface_container_highest` for a "header" area within the card—defining areas through tone alone.

### Input Fields
*   **Resting State:** `surface_container_lowest` background, `md` roundness.
*   **Focus State:** The background remains dark, but a 1px "Ghost Border" appears using `primary` at 40% opacity, accompanied by a soft inner glow.

### Signature Component: The "Archive Chip"
Used for tagging and metadata. These should use `secondary_container` backgrounds with `label-sm` typography. They should feel like small, inset tactile buttons (Neumorphism-lite), achieved by a 1px top-highlight using `outline_variant` at 10% opacity.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical layouts where the left margin is wider than the right to create an editorial feel.
*   **Do** use `spacing-12` and `spacing-16` to let content "breathe." Luxury is defined by wasted space.
*   **Do** use the `tertiary` (#ffb694) accent for "Success" or "Notification" moments to provide a warm, sophisticated contrast to the cold cobalt.

### Don't:
*   **Don't** use 100% white (#ffffff) for text. Always use `on_surface` (#dae2fd) to prevent eye strain and "blooming" on dark backgrounds.
*   **Don't** use standard Material Design drop shadows. They look "dirty" in dark mode. Use tonal shifts and glows.
*   **Don't** use dividers. If you feel the need to "separate" something, increase the vertical spacing (`spacing-6` or higher) or change the background tone.