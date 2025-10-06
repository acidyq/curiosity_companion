# Typography System

## Font Families

### Display Font: Space Grotesk
- **Usage:** Headings, titles, module names
- **Characteristics:** Geometric, modern, slightly quirky
- **Weights:** 500 (Medium), 700 (Bold)
- **Why:** Distinctive personality while maintaining clarity

### Body Font: Inter
- **Usage:** Body text, UI labels, descriptions
- **Characteristics:** Highly legible, optimized for screens
- **Weights:** 400 (Regular), 500 (Medium), 600 (Semibold)
- **Why:** Exceptional readability at all sizes

### Monospace Font: JetBrains Mono (optional, for code)
- **Usage:** Mathematical notation, code snippets
- **Weights:** 400 (Regular), 700 (Bold)

## Type Scale

### Desktop Scale (1440px+)

**Hero Title (h1)**
- Font: Space Grotesk Bold (700)
- Size: 60px (3.75rem)
- Line-height: 1.1
- Letter-spacing: -0.02em
- Usage: Homepage hero, major section headers

**Section Title (h2)**
- Font: Space Grotesk Bold (700)
- Size: 40px (2.5rem)
- Line-height: 1.2
- Letter-spacing: -0.01em
- Usage: Module titles, major sections

**Subsection Title (h3)**
- Font: Space Grotesk Medium (500)
- Size: 28px (1.75rem)
- Line-height: 1.3
- Letter-spacing: 0
- Usage: Panel headers, subsections

**Body Large**
- Font: Inter Regular (400)
- Size: 20px (1.25rem)
- Line-height: 1.6
- Letter-spacing: 0
- Usage: Introductory paragraphs, emphasis

**Body Regular**
- Font: Inter Regular (400)
- Size: 16px (1rem)
- Line-height: 1.6
- Letter-spacing: 0
- Usage: Main content, descriptions

**Body Small**
- Font: Inter Regular (400)
- Size: 14px (0.875rem)
- Line-height: 1.5
- Letter-spacing: 0
- Usage: Metadata, captions, hints

**Caption**
- Font: Inter Medium (500)
- Size: 12px (0.75rem)
- Line-height: 1.4
- Letter-spacing: 0.01em
- Usage: Labels, tags, timestamps

## Color Combinations

### Text on Dark Background
- **Primary:** `#f8fafc` (slate-50) - Main text
- **Secondary:** `#cbd5e1` (slate-300) - Supporting text
- **Tertiary:** `#94a3b8` (slate-400) - Metadata, de-emphasized

### Text on Light Elements
- **Primary:** `#0f172a` (slate-950) - Main text
- **Secondary:** `#475569` (slate-600) - Supporting text

### Accent Text
- **Gradient text:** Blue to purple for hero elements
- **Link text:** `#3b82f6` (blue-500) with underline on hover
- **Success:** `#22c55e` (green-500)
- **Warning:** `#eab308` (yellow-500)
- **Error:** `#ef4444` (red-500)

## Hierarchy Guidelines

### Establish Clear Levels
1. **Primary** - What you want users to notice first (hero titles)
2. **Secondary** - Supporting context (section headers)
3. **Tertiary** - Details and metadata (captions)

### Use Size and Weight Together
- Large + Bold = Maximum emphasis
- Large + Regular = Soft emphasis
- Small + Bold = Labels, tags
- Small + Regular = De-emphasized

### Spacing
- **Heading margins:** 2-3x the line-height above, 1x below
- **Paragraph spacing:** 1.5em between paragraphs
- **List spacing:** 0.5em between items

## Special Typography

### Mathematical Expressions
- Use larger size than surrounding text (1.2x)
- Consider slight background highlight
- Monospace or serif font for clarity

### Code Snippets
- JetBrains Mono or system monospace
- Background: Dark panel with syntax highlighting
- Slightly smaller than body text (0.9x)

### Quotes
- Italic style
- Left border accent (4px, accent color)
- Slightly larger than body (1.1x)
- Padding: 1em left

## Responsive Adjustments

While desktop-focused, ensure readability:
- Maintain minimum 16px body text
- Scale headings proportionally
- Preserve line-height ratios

## Accessibility

- **Contrast ratio:** Minimum 4.5:1 for body text, 3:1 for large text
- **Line length:** 60-80 characters optimal for readability
- **Text spacing:** Allow user overrides for line-height and letter-spacing
- **Font sizes:** Allow browser zoom without breaking layout

## Prompt for Typography in Assets

```
Typography for a desktop mathematical learning app:

Display Font: Space Grotesk (geometric, modern)
Body Font: Inter (clean, highly legible)

Text hierarchy:
- Hero: 60px Space Grotesk Bold, slate-50
- Section: 40px Space Grotesk Bold, slate-50
- Body: 16px Inter Regular, slate-300
- Caption: 12px Inter Medium, slate-400

Dark background (slate-950)
Gradient text for hero elements (blue #2563eb to purple #7c3aed)
Clear visual hierarchy, generous spacing
Inspiration: Kurzgesagt, Brilliant.org
```
