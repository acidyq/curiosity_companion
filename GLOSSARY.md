# Glossary System Documentation

## ✨ Overview

The Curiosity Companion now features an **interactive glossary system** that automatically highlights mathematical and technical terms with hoverable tooltips providing definitions and context.

## 🎯 Features

### **Automatic Term Detection**
- Mathematical and technical terms are automatically detected in reading content
- Terms are styled with a dotted blue underline
- Hover to reveal instant definitions

### **Beautiful Tooltips**
- Smooth fade-in animations
- Dark themed with glass morphism
- Positioned above terms to avoid overlap
- Shows:
  - **Term name** (in blue)
  - **Definition** (clear explanation)
  - **Related terms** (when applicable)

### **Visual Feedback**
- Dotted underline turns solid on hover
- Text color changes to blue
- Cursor changes to help icon
- Smooth transitions

---

## 📚 Current Glossary Terms

### **Graph Theory** (6 terms)
- **Adjacent** - Two regions or vertices that share a common boundary or edge
- **Vertex** - A point or node in a graph
- **Edge** - A connection between two vertices
- **Planar** - A graph that can be drawn without edges crossing
- **Chromatic Number** - Minimum colors needed for valid coloring
- **Hamiltonian Path** - A path visiting every vertex exactly once

### **Topology** (4 terms)
- **Topology** - Study of properties preserved under continuous deformations
- **Orientable** - Surface with consistent notion of "clockwise"
- **Non-orientable** - Surface with no consistent up/down direction
- **Manifold** - Topological space resembling Euclidean space locally

### **Number Theory** (3 terms)
- **Prime Number** - Number with no divisors except 1 and itself
- **Factorial** - Product of all positive integers up to a number (n!)
- **Combinatorics** - Mathematics of counting and arrangement

### **General Math** (6 terms)
- **Euclidean** - Geometry of flat space
- **Theorem** - Proven mathematical statement
- **Conjecture** - Statement believed true but not yet proven
- **Algorithm** - Step-by-step problem-solving procedure
- **Heuristic** - Practical method for finding good-enough solutions
- **Isomorphic** - Essentially the same mathematical structure

---

## 🔧 Implementation

### **Core Files**

1. **[src/utils/glossary.ts](src/utils/glossary.ts)**
   - Central glossary database
   - Helper functions (`getGlossaryEntry`, `searchGlossary`)
   - Category organization

2. **[src/components/ui/Tooltip.tsx](src/components/ui/Tooltip.tsx)**
   - Reusable tooltip component
   - Positioning (top/bottom/left/right)
   - Smooth animations with Framer Motion

3. **[src/components/ui/GlossaryTerm.tsx](src/components/ui/GlossaryTerm.tsx)**
   - Wrapper for individual terms
   - `wrapGlossaryTerms()` function for auto-wrapping
   - Styled with hover effects

4. **[src/components/panels/ReadingPane.tsx](src/components/panels/ReadingPane.tsx)**
   - Updated to process content
   - Automatically wraps glossary terms
   - Attaches interactive tooltips

5. **[src/styles/tailwind.css](src/styles/tailwind.css)**
   - `.glossary-term` class styling
   - Hover effects and transitions

---

## 📖 How It Works

### **Automatic Processing**

1. **Content is loaded** into ReadingPane
2. **`wrapGlossaryTerms()`** scans HTML for known terms
3. **Terms are wrapped** in `<span class="glossary-term">` tags
4. **useEffect hook** attaches tooltips to wrapped terms
5. **User hovers** → Tooltip appears with definition

### **Example Flow**

**Original content:**
```html
<p>The Four-Color Theorem states that any planar map can be
colored using at most four colors in such a way that no two
adjacent regions share the same color.</p>
```

**After processing:**
```html
<p>The Four-Color Theorem states that any
<span class="glossary-term" data-term="planar">planar</span> map can be
colored using at most four colors in such a way that no two
<span class="glossary-term" data-term="adjacent">adjacent</span>
regions share the same color.</p>
```

**On hover:**
- Tooltip appears above "planar"
- Shows: "Planar - A graph that can be drawn on a flat plane without any edges crossing each other."

---

## ➕ Adding New Terms

### **Step 1: Add to Glossary**

Edit [src/utils/glossary.ts](src/utils/glossary.ts):

```typescript
export const glossary: Record<string, GlossaryEntry> = {
  // ... existing terms

  'your-term': {
    term: 'Your Term',
    definition: 'Clear, concise explanation of the term.',
    category: 'graph-theory', // or topology, number-theory, etc.
    relatedTerms: ['related-term-1', 'related-term-2'], // optional
  },
}
```

### **Step 2: Add to Auto-Wrap List**

Edit [src/components/ui/GlossaryTerm.tsx](src/components/ui/GlossaryTerm.tsx):

```typescript
const termsToWrap = [
  'adjacent',
  'vertex',
  // ... existing terms
  'your-term', // Add here
]
```

### **Step 3: Test**

1. Use the term in module content
2. Check that it's underlined
3. Hover to verify tooltip appears
4. Ensure definition is clear

---

## 🎨 Styling

### **Term Appearance**
```css
.glossary-term {
  color: #ea580c; /* cabinet-orange - eye-catching! */
  font-weight: 500; /* Medium weight for emphasis */
  border-bottom: 2px dotted rgba(234, 88, 12, 0.6);
  cursor: help;
}

.glossary-term:hover {
  color: #f97316; /* Brighter orange on hover */
  border-bottom-style: solid;
  text-shadow: 0 0 8px rgba(249, 115, 22, 0.3); /* Subtle glow */
}
```

### **Tooltip Appearance**
- Background: `slate-800`
- Border: `white/10`
- Text: White with blue heading
- Max width: `300px`
- Padding: `12px`
- Shadow: `xl` with border glow

---

## 🌟 Usage Examples

### **In Module Content**

```typescript
export const yourModule: ModuleDefinition = {
  content: {
    readingContent: `
      <p>A planar graph has vertices connected by edges.
      Two vertices are adjacent if they share an edge.</p>
    `,
    // Terms "planar", "vertices", "edges", and "adjacent"
    // will automatically be interactive!
  },
}
```

### **Manual Usage (React Components)**

```tsx
import { GlossaryTerm } from '@/components/ui/GlossaryTerm'

function MyComponent() {
  return (
    <p>
      This is a <GlossaryTerm term="planar">planar graph</GlossaryTerm>
      with multiple <GlossaryTerm term="vertex">vertices</GlossaryTerm>.
    </p>
  )
}
```

---

## 📊 Current Coverage

| Module | Terms Detected | Categories |
|--------|---------------|------------|
| **Four-Color Theorem** | 8 terms | Graph theory, general |
| **Knight's Tour** | 5 terms | Graph theory, combinatorics |
| **Möbius Band** | 4 terms | Topology, geometry |

### **Terms by Category**

- **Graph Theory**: 32% of glossary
- **Topology**: 21%
- **Number Theory**: 16%
- **General Math**: 31%

---

## 🚀 Future Enhancements

Potential additions:

- [ ] **Search glossary** - Dedicated glossary page with search
- [ ] **User contributions** - Allow users to suggest definitions
- [ ] **Pronunciation guides** - Audio clips for complex terms
- [ ] **Examples** - Visual examples in tooltips
- [ ] **Multiple languages** - i18n support for definitions
- [ ] **Glossary quiz** - Test understanding of terms
- [ ] **Context-aware definitions** - Different meanings in different contexts
- [ ] **Related articles** - Link to Wikipedia or other resources
- [ ] **Term highlighting** - Toggle to show/hide all terms at once

---

## 🎯 Best Practices

### **Writing Definitions**

1. **Keep it concise** - 1-2 sentences maximum
2. **Use plain language** - Avoid circular definitions
3. **Provide context** - Explain why it matters
4. **Link related terms** - Help users discover connections

### **Term Selection**

- Focus on **uncommon** technical terms
- Include **domain-specific** vocabulary
- Avoid **trivial** or **widely known** terms
- Prioritize **confusing** terminology

### **Categories**

- Use existing categories when possible
- Create new categories only for 3+ related terms
- Keep category names broad and intuitive

---

## 📝 Example Tooltips

### **Adjacent** (Hover to see)
```
Adjacent
Two regions or vertices that share a common boundary or edge.
In graph theory, adjacent nodes are directly connected.

Related: edge, vertex
```

### **Planar** (Hover to see)
```
Planar
A graph that can be drawn on a flat plane without any edges
crossing each other.
```

### **Non-orientable** (Hover to see)
```
Non-orientable
A surface where there is no consistent "up" or "down" direction.
Walking along the surface can flip your orientation.

Related: orientable, möbius band
```

---

## 🎨 Visual Design

- **Eye-catching orange color** (#ea580c) - Stands out from regular text
- **Medium font weight** - Emphasized but not bold
- **Dotted orange underline** - Clear indicator of interactivity
- **Hover glow effect** - Subtle text-shadow on hover
- **Smooth transitions** - 200ms ease
- **Help cursor** - Clear affordance
- **Dark tooltips** - High contrast
- **Glass morphism** - Consistent with app aesthetic

---

## ✅ Testing Checklist

- [x] Terms are automatically detected
- [x] Tooltips appear on hover
- [x] Definitions are clear and accurate
- [x] Related terms are shown
- [x] Styling matches app theme
- [x] No layout shifts on hover
- [x] Mobile-friendly (cursor fallback)
- [x] Performance optimized (no lag)

---

**The glossary system is live!** 🎉

Visit any module's reading pane and hover over underlined terms to see instant definitions.

**Try it:** Go to the Four-Color Theorem module and hover over "adjacent", "planar", or "chromatic"!
