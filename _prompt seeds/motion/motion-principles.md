# Motion Design Principles

## Core Philosophy

Motion in Curiosity Companion should feel:
- **Purposeful** - Every animation explains or guides
- **Physics-aware** - Easing that feels natural, not robotic
- **Delightful** - Subtle surprises that reward attention
- **Efficient** - Fast enough to never feel slow, slow enough to comprehend

## Animation Principles

### 1. Ease and Timing

**Standard Easing**
```
cubic-bezier(0.4, 0.0, 0.2, 1) - Smooth, natural motion
```

**Bouncy Easing (for playful elements)**
```
cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

**Duration Guidelines**
- Micro-interactions: 150-200ms
- UI transitions: 300-400ms
- Page transitions: 500-600ms
- Complex animations: 800-1200ms

### 2. Staging and Choreography

**Stagger Effects**
- Grid items: 50-100ms delay between items
- Sequential reveals: Build anticipation with cascading motion

**Enter/Exit Patterns**
- Enter: Fade in + slight upward motion (translateY: 20px → 0)
- Exit: Fade out + slight downward motion (translateY: 0 → 10px)

### 3. Anticipation and Follow-Through

**Hover States**
- Scale up slightly: `transform: scale(1.05)`
- Add shadow or glow
- Duration: 200ms

**Click/Tap Feedback**
- Brief scale down: `transform: scale(0.95)`
- Immediate visual response
- Duration: 100ms

### 4. Parallax and Depth

**Layer Speeds** (scrolling at 1x)
- Background: 0.3x
- Mid-ground: 0.6x
- Foreground: 1x
- Interactive elements: 1.2x

**3D Transforms**
- Subtle rotation on hover: `rotateY(5deg)`
- Preserve 3D context with `transform-style: preserve-3d`

## Specific Animations

### Page Transitions
```typescript
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }
```

### Card Reveals
```typescript
whileHover: { scale: 1.05, boxShadow: "0 20px 50px rgba(37, 99, 235, 0.2)" }
transition: { type: "spring", stiffness: 300, damping: 20 }
```

### Number Counters
- Animate value changes with smooth interpolation
- Duration: 800ms
- Easing: easeOut

### Interactive Puzzles
- Immediate feedback (< 50ms)
- Clear state changes
- Success animations: scale pulse + color shift

## Performance Guidelines

- Use `transform` and `opacity` for smooth 60fps animations
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly for complex animations
- Disable non-essential animations on low-power devices

## Accessibility

- Respect `prefers-reduced-motion` media query
- Provide instant alternatives for critical interactions
- Never rely solely on animation to convey information

## Examples from References

**Kurzgesagt Style**
- Smooth, continuous motion
- Geometric shapes morphing and transforming
- Layered parallax creating depth

**Brilliant.org Style**
- Responsive micro-interactions
- Guided focus through motion
- Celebratory moments for correct answers
