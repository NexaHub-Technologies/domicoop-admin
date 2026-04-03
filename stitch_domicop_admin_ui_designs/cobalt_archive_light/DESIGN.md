# Design System Strategy: The Lucid Architect

## 1. Overview & Creative North Star
**Creative North Star: "The Lucid Architect"**
This design system moves beyond the utility of a standard dashboard to create an environment of "High-Information Serenity." While most administrative tools feel cluttered and rigid, this system treats data as an editorial centerpiece. By leveraging **Plus Jakarta Sans** and a "Soft UI" philosophy, we transform a data-heavy archive into a series of layered, breathable surfaces.

The experience is defined by **intentional asymmetry and tonal depth**. We reject the traditional "box-in-a-box" layout. Instead, we use a sophisticated layering of whites and grays to guide the eye. This isn't just a dashboard; it’s a digital workspace designed to reduce cognitive load while maintaining the authoritative punch of Cobalt Blue.

---

## 2. Colors
Our palette is a study in subtle transitions and high-contrast anchors.

### The Palette (Material Design Specification)
- **Primary (The Anchor):** `#003d9a` (High-contrast Cobalt)
- **Primary Container (The Action):** `#1e55be` (Brighter Cobalt for interactivity)
- **Surfaces:** 
  - `surface-container-lowest`: `#ffffff` (Pure White for primary cards)
  - `surface`: `#f7f9fb` (The base canvas)
  - `surface-container`: `#eceef0` (Sectional backgrounds)
- **Accents:** `tertiary`: `#752d00` (Used sparingly for warnings or warm highlights)

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. Traditional borders create visual "noise" that traps data. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` data table should sit on a `surface` background. If you feel the need to draw a line, use a color shift instead.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers.
1. **Level 0 (Base):** `surface` (`#f7f9fb`) — The bottom-most layer.
2. **Level 1 (Sections):** `surface-container-low` — Used for sidebar backgrounds or secondary content zones.
3. **Level 2 (Priority):** `surface-container-lowest` (`#ffffff`) — Used for high-priority cards and data tables. This "lifts" the most important information toward the user.

### The "Glass & Gradient" Rule
To escape the "flat" look, use a **Linear Gradient** for primary CTA buttons: `primary` (#003d9a) to `primary_container` (#1E55BE) at a 135-degree angle. This adds a "soul" to the action items that flat hex codes cannot achieve.

---

## 3. Typography
We use **Plus Jakarta Sans** for its geometric clarity and modern editorial feel. 

- **Display (The Statement):** `display-md` (2.75rem). Use this for high-level dashboard summaries (e.g., Total Revenue). Keep letter-spacing at -0.02em to maintain a premium, tight feel.
- **Headline (The Navigator):** `headline-sm` (1.5rem). Use for page titles.
- **Title (The Sub-header):** `title-sm` (1rem). Bold weight. Use for card titles.
- **Body (The Workhorse):** `body-md` (0.875rem). The standard for all table data and descriptions.
- **Label (The Metadata):** `label-sm` (0.6875rem). All-caps with +0.05em tracking for table headers.

**Typography Strategy:** Use extreme scale contrast. Pair a `display-md` metric with a `label-sm` descriptor to create an "Editorial" hierarchy that feels intentional and high-end.

---

## 4. Elevation & Depth
In this design system, depth is a functional tool, not a decoration.

- **The Layering Principle:** Avoid shadows for static elements. Create "Natural Lift" by placing a `surface-container-lowest` (#FFFFFF) element on top of a `surface` (#f7f9fb) background. 
- **Ambient Shadows:** Only apply shadows to "Floating" elements (Modals, Popovers, Active Hover States). 
  - **Shadow Token:** `0px 12px 32px rgba(25, 28, 30, 0.06)`. 
  - The shadow must be large, diffused, and low-opacity. Never use pure black; use a tint of the `on-surface` color.
- **Glassmorphism:** For top navigation bars or floating action menus, use `surface-container-lowest` with 80% opacity and a `backdrop-blur` of 12px. This makes the UI feel integrated and light.

---

## 5. Components

### Buttons & CTAs
- **Primary:** Gradient fill (`primary` to `primary_container`), `rounded-lg` (8px), white text.
- **Secondary:** `surface-container-high` background with `primary` text. No border.
- **Tertiary/Ghost:** No background. `primary` text. Use for low-emphasis actions like "Cancel."

### Data Tables (The Core)
- **Rule:** Forbid the use of vertical or horizontal divider lines.
- **Structure:** Use `1.5rem` (spacing-6) of vertical padding for rows. Highlight the "Active" row with a subtle `surface-container-highest` background shift and a 4px `primary` cobalt "indicator" pill on the far left.
- **Headers:** Use `label-sm` in `on-surface-variant` color.

### Input Fields
- **Style:** Background should be `surface-container-low`. 
- **States:** On focus, transition the background to `surface-container-lowest` and apply a 2px "Ghost Border" using `primary` at 20% opacity. This creates a soft glow rather than a harsh outline.

### Metric Cards
- Use `xl` (1.5rem) corner radius for large metric cards to differentiate them from standard `lg` (8px) content cards. This adds a "Soft UI" friendliness to the data.

---

## 6. Do’s and Don’ts

### Do
- **Do** use whitespace as a separator. If elements feel too close, increase the spacing token rather than adding a line.
- **Do** use "Plus Jakarta Sans" in Medium weight for body text to ensure legibility against light gray backgrounds.
- **Do** align data to the top-left of containers to embrace the "Architectural" layout style.

### Don't
- **Don't** use 100% opaque borders. They break the "Lucid" feel of the system.
- **Don't** use pure black (#000000) for text. Always use `on-surface` (#191c1e) to keep the contrast soft and readable.
- **Don't** use standard "Drop Shadows." If an element isn't floating, it shouldn't have a shadow. Use Tonal Layering instead.