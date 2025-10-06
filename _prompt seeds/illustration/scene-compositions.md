# Scene Composition Guidelines

## Overall Aesthetic

Curiosity Companion illustrations should evoke:
- **Geometric clarity** - Clean shapes, precise angles
- **Atmospheric depth** - Layered backgrounds with parallax
- **Educational focus** - Visual hierarchy guides attention
- **Kurzgesagt inspiration** - Flat design with dimensional depth

## Layer Structure

### Background Layer (Furthest)
- **Purpose:** Set atmosphere, provide context
- **Style:** Subtle gradients, large geometric shapes
- **Colors:** Darkest tones (slate-950, slate-900)
- **Motion:** Slowest parallax (0.3x scroll speed)
- **Examples:**
  - Abstract geometric patterns
  - Starfield or mathematical grid
  - Subtle radial gradients

### Mid-ground Layer
- **Purpose:** Supporting context, secondary elements
- **Style:** Medium-detail shapes, supporting graphics
- **Colors:** Mid-tone accents (slate-800, subtle colors)
- **Motion:** Medium parallax (0.6x scroll speed)
- **Examples:**
  - Floating geometric shapes
  - Mathematical symbols
  - Decorative frames

### Foreground Layer (Closest)
- **Purpose:** Primary focus, interactive elements
- **Style:** High detail, sharp edges, vibrant colors
- **Colors:** Full accent palette (blues, purples, oranges)
- **Motion:** Standard or faster (1x - 1.2x scroll speed)
- **Examples:**
  - Main puzzle interface
  - Interactive controls
  - Primary illustrations

## Composition Rules

### Rule of Thirds
- Position key elements at intersection points
- Avoid dead-center placement unless intentional symmetry

### Visual Hierarchy
1. **Primary focus** - Largest, brightest, most saturated
2. **Secondary elements** - Support primary, lower saturation
3. **Tertiary details** - Background, atmospheric

### Depth Techniques
- **Scale:** Larger = closer, smaller = farther
- **Overlap:** Front elements overlap back elements
- **Color:** Vibrant foreground, muted background
- **Blur:** Optional subtle blur on far backgrounds
- **Shadows:** Soft, directional, consistent light source

## Desktop Optimization

### Viewport Considerations
- **Target:** 1440x900 minimum, 1920x1080 optimal
- **Aspect ratio:** Wide horizontal (16:9 or wider)
- **Safe zones:** Keep critical elements 80px from edges
- **Breathing room:** Generous whitespace, no cramping

### Cinematic Framing
- **Wide shots** - Establish context, module introductions
- **Medium shots** - Main interactive areas
- **Close-ups** - Detail views, specific concepts

## Mathematical Subject Matter

### Geometric Concepts
- Use precise angles and perfect circles
- Grid-based alignment
- Symmetry where appropriate

### Abstract Concepts
- Visual metaphors (e.g., networks for graph theory)
- Color coding for categories
- Progressive revelation through layers

### Interactive Elements
- Clear affordance (buttons, draggable items)
- Distinct from decorative elements
- Hover states and feedback

## Lighting and Atmosphere

### Light Direction
- **Default:** Top-left at 45° angle
- **Shadows:** Soft, 20-30% opacity
- **Highlights:** Subtle, on geometric edges

### Atmospheric Effects
- **Glow:** Around key elements (10-20px blur)
- **Gradients:** Smooth, multi-stop
- **Particles:** Optional, mathematical (dots, small shapes)

## Prompt Template for Scene Generation

```
Create a scene composition for a desktop mathematical learning app:

Subject: [e.g., "Four-color theorem map visualization"]
Mood: [e.g., "Curious, inviting, intellectually stimulating"]

Layers:
- Background: [Dark gradient, abstract geometric pattern]
- Mid-ground: [Floating mathematical symbols, subtle grid]
- Foreground: [Interactive map with colorful regions]

Style:
- Geometric, flat design with dimensional depth
- Kurzgesagt-inspired visual language
- Wide desktop format (1920x1080)
- Dark background (slate-950) with vibrant accents
- Color palette: Blues (#2563eb), purples (#7c3aed), oranges (#ea580c)

Lighting:
- Top-left 45° light source
- Soft shadows, subtle glows on interactive elements
- Atmospheric depth through layering

Focus: [Primary element or concept to emphasize]
```
