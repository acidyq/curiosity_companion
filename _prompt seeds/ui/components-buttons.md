# Button Component Design

## Visual Style

Buttons in Curiosity Companion should be:
- **Clearly interactive** - Obvious affordance through color and elevation
- **Responsive** - Immediate hover and active states
- **Accessible** - Clear focus indicators and sufficient touch targets

## Variants

### Primary Button
**Purpose:** Main actions, primary CTAs

**Visual:**
- Background: Gradient from Mathematical Blue (#2563eb) to Curiosity Purple (#7c3aed)
- Text: White, bold weight
- Border-radius: 8px (rounded-lg)
- Padding: 12px 24px (md size)

**States:**
- Default: Gradient background
- Hover: Scale(1.05) + enhanced shadow (0 10px 30px rgba(37,99,235,0.3))
- Active: Scale(0.95)
- Focus: 2px ring, blue, with offset
- Disabled: 50% opacity, no hover effects

### Secondary Button
**Purpose:** Alternative actions, less emphasis

**Visual:**
- Background: White at 10% opacity (glass effect)
- Border: 1px solid white at 20% opacity
- Text: White
- Border-radius: 8px

**States:**
- Hover: Background white at 20% opacity
- Active: Background white at 15% opacity
- Focus: Same as primary

### Ghost Button
**Purpose:** Tertiary actions, minimal emphasis

**Visual:**
- Background: Transparent
- Text: White
- Border-radius: 8px

**States:**
- Hover: Background white at 10% opacity
- Active: Background white at 5% opacity

## Sizes

### Small (sm)
- Padding: 6px 12px
- Font-size: 14px
- Height: 32px

### Medium (md) - Default
- Padding: 12px 24px
- Font-size: 16px
- Height: 44px

### Large (lg)
- Padding: 16px 32px
- Font-size: 18px
- Height: 56px

## Icons in Buttons

- Position: Left or right of text, 4px gap
- Size: Match font-size
- Color: Inherit from button text

## Animation Specifications

**Hover:**
```css
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
transform: scale(1.05);
box-shadow: 0 10px 30px rgba(37, 99, 235, 0.3);
```

**Active:**
```css
transform: scale(0.95);
```

**Focus:**
```css
outline: none;
box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.5);
```

## Accessibility

- Minimum touch target: 44x44px
- Focus indicator: Always visible, 3px ring with offset
- Color contrast: 4.5:1 minimum for text
- States announced to screen readers
- Keyboard navigable with clear visual feedback

## Usage Examples

**Primary CTA:**
```
"Start Exploring" - Homepage hero
"Next Module" - Module completion
```

**Secondary:**
```
"Reset" - Puzzle controls
"Skip" - Optional content
```

**Ghost:**
```
"Learn More" - Supplementary links
"Back" - Navigation
```

## Prompt for Generation

```
Create a button component for a desktop mathematical learning app with:
- Variant: [primary/secondary/ghost]
- Size: [sm/md/lg]
- Style: Modern, glass morphism, gradient for primary
- Colors: Blue (#2563eb) to purple (#7c3aed) gradient
- States: Default, hover (scale 1.05), active (scale 0.95), focus (blue ring)
- Animation: Smooth 200ms transitions
- Context: Dark background (slate-950)
- Inspiration: Kurzgesagt, Brilliant.org
```
