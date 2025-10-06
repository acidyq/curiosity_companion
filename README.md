# 🧮 Curiosity Companion

An interactive, desktop-first learning companion to **Professor Stewart's Cabinet of Mathematical Curiosities**. Transform mathematical concepts into hands-on modules with puzzles, simulations, and visual explanations.

## ✨ Features

- **Interactive Modules** - Hands-on exploration of mathematical concepts
- **Visual Learning** - SVG and Canvas-based visualizations
- **Three-Panel Layout** - Read, Interact, Reflect for comprehensive learning
- **Puzzle Verification** - Detailed feedback with hints and achievements
- **Interactive Glossary** - Hover over technical terms for instant definitions
- **Expandable Reflections** - Deep explanations with external learning resources
- **Desktop Optimized** - Designed for 1440x900+ viewports
- **Beautiful UI** - Kurzgesagt-inspired geometric design with Framer Motion animations

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Visit [http://localhost:3000](http://localhost:3000) to explore the app.

## 📚 Current Modules

### 1. The Four-Colour Theorem
- **Difficulty:** Intermediate
- **Topics:** Graph theory, topology, proofs
- **Interactive:** Click regions to color a map with 4 colors
- **Time:** ~15 minutes

### 2. The Knight's Tour
- **Difficulty:** Intermediate
- **Topics:** Graph theory, combinatorics, chess
- **Interactive:** Guide a chess knight to visit every square
- **Time:** ~20 minutes

### 3. The Möbius Band
- **Difficulty:** Beginner
- **Topics:** Topology, geometry, surfaces
- **Interactive:** 3D visualization with rotation controls
- **Time:** ~10 minutes

## 🏗️ Architecture

### Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **State:** Zustand (when needed)
- **Routing:** React Router v6

### Project Structure

```
src/
├── components/
│   ├── layout/          # AppShell, navigation
│   ├── ui/              # Button, Card, Progress
│   ├── visuals/         # Canvas, SVG, Grid, Graph
│   ├── panels/          # ReadingPane, InteractPane, ReflectPane
│   └── puzzles/         # Puzzle-specific components
├── modules/             # Module definitions
│   ├── types.ts         # Module interfaces
│   ├── registry.ts      # Module registry
│   └── [module-name]/   # Individual modules
├── routes/              # Page components
├── utils/               # Math utilities, helpers
└── styles/              # Global styles

_prompt seeds/           # Asset generation guides
├── brand/              # Mission, voice, branding
├── visual-language/    # Colors, typography, motifs
├── illustration/       # Scene composition guides
├── motion/             # Animation principles
└── ui/                 # Component design specs
```

### Adding New Modules

1. Create module directory: `src/modules/your-module/`
2. Define module in `your-module.module.tsx`:
   ```typescript
   export const yourModule: ModuleDefinition = {
     metadata: { /* ... */ },
     content: { /* ... */ },
     InteractiveComponent: YourInteractive,
   }
   ```
3. Register in `src/modules/registry.ts`
4. Module appears automatically on homepage

## 🎨 Design System

### Color Palette

- **Mathematical Blue:** `#2563eb` - Primary actions
- **Curiosity Purple:** `#7c3aed` - Accents, gradients
- **Discovery Orange:** `#ea580c` - Alerts, emphasis
- **Logic Teal:** `#0d9488` - Success states
- **Insight Yellow:** `#eab308` - Highlights, hints

### Typography

- **Display:** Space Grotesk (headings)
- **Body:** Inter (content)
- **Monospace:** JetBrains Mono (code/math)

### Motion

- **Standard timing:** 200-400ms
- **Easing:** `cubic-bezier(0.4, 0.0, 0.2, 1)`
- **Hover:** Scale 1.05, enhanced shadow
- **Active:** Scale 0.95

## 📐 Visual Engine

### Components

- **CanvasStage** - Hardware-accelerated rendering
- **SvgStage** - Scalable vector graphics
- **Grid2D** - Coordinate systems
- **GraphPlot** - Network visualizations
- **NumberLine** - Mathematical ranges

### Math Utilities

- Number theory (primes, GCD, LCM)
- Geometry (distance, rotation, vectors)
- Graph operations (neighbors, edges)
- Random utilities (shuffle, pick)

## 🎯 Development Guidelines

### Component Conventions

- Use TypeScript strict mode
- Functional components with hooks
- Props interfaces for all components
- Tailwind for styling (no CSS modules)

### State Management

- Local state with `useState`
- URL params for sharable states
- Zustand for global app state (when needed)

### Performance

- Use `transform` and `opacity` for animations
- Lazy load modules when possible
- Optimize Canvas renders with RAF
- Desktop-first, no mobile optimization needed

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui
```

Tests use Vitest + Testing Library.

## 📦 Building

```bash
# Production build
npm run build

# Preview build locally
npm run preview
```

Outputs to `dist/` directory.

## 🚀 Deployment

- **GitHub Pages (Vite + Actions):** [docs/deployment/github-pages.md](docs/deployment/github-pages.md)

## 🎨 Prompt Seeds

The `_prompt seeds/` directory contains detailed guides for generating visual assets that maintain brand consistency:

- **Brand guidelines** - Mission, tone, voice
- **Visual language** - Colors, typography, shapes
- **Illustration guides** - Scene composition, character design
- **Motion specs** - Animation principles, transitions
- **UI components** - Detailed component specifications

Use these when generating new assets with AI tools or working with designers.

## 📖 Content Structure

Book sections are in `extracted/sections/` as `.txt` files. Each module maps to one or more sections.

## 🤝 Contributing

This is a personal learning project, but suggestions are welcome!

## 📄 License

Educational project based on Professor Stewart's Cabinet of Mathematical Curiosities.

## 🙏 Inspiration

- **Kurzgesagt** - Visual language and geometric style
- **Brilliant.org** - Interactive learning approach
- **3Blue1Brown** - Mathematical animation principles
- **Professor Stewart** - Source material and mathematical curiosities

---

Built with ❤️ and mathematics
