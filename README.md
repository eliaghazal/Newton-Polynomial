# Newton Polynomial Interpolation Visualizer

[![Deploy to GitHub Pages](https://github.com/eliaghazal/Newton-Polynomial/actions/workflows/deploy.yml/badge.svg)](https://github.com/eliaghazal/Newton-Polynomial/actions/workflows/deploy.yml)

🎓 **Advanced Interactive Visualization Tool for Numerical Methods**

A stunning, production-ready React application for visualizing Newton Polynomial Interpolation. Built with modern web technologies and designed to wow audiences in mathematical presentations.

![Newton Polynomial Visualizer](https://github.com/user-attachments/assets/0518c271-22ff-4d5e-9aed-21c1f7c02e3c)

## ✨ Features

### 🎨 **Modern UI/UX**
- Glassmorphism design with dark theme
- Smooth animations powered by Framer Motion
- Responsive three-column layout
- Professional gradient styling

### 📊 **Interactive Graph**
- Click to add interpolation points
- Real-time polynomial curve updates
- Plotly.js integration with zoom, pan, and export
- Smooth animated rendering

### 🔢 **Divided Differences Table**
- Animated triangular table construction
- Color-coded calculation levels
- Green-highlighted Newton coefficients
- Hover tooltips with formulas

### 📐 **Mathematical Display**
- Newton's Forward Difference Formula
- Expanded polynomial form
- Individual coefficients display
- Polynomial degree indicator

### 🎬 **Animation Controls**
- Play/Pause step-by-step visualization
- Speed control slider (0.5x - 3.0x)
- Reset functionality
- Progressive point revelation

### 🔄 **Comparison Mode**
- Lagrange interpolation overlay
- Visual proof both methods are equivalent
- Toggle comparison on/off

### 📚 **Preset Functions**
9 built-in examples including:
- Trigonometric (sin, cos)
- Exponential and logarithmic
- Polynomials (quadratic, cubic)
- Runge's Phenomenon
- Random point generator

### 💾 **Data Management**
- Export/import points as JSON
- Clear all points
- Point count tracking

### 🎓 **Educational Features**
- Tutorial mode with comprehensive guide
- Quick reference panel
- Warning system for numerical issues
- Hover tooltips explaining calculations

## 🚀 Live Demo

**Visit:** [https://eliaghazal.github.io/Newton-Polynomial/](https://eliaghazal.github.io/Newton-Polynomial/)

## 🛠️ Tech Stack

- **React 19** with TypeScript
- **Vite 7** - Lightning-fast builds
- **Tailwind CSS 4** - Modern styling
- **Framer Motion 12** - Smooth animations
- **Plotly.js 3** - Interactive graphs
- **KaTeX 0.16** - Mathematical notation
- **Lucide React** - Beautiful icons

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/eliaghazal/Newton-Polynomial.git
cd Newton-Polynomial

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Usage

### Adding Points
1. Click anywhere on the graph to add interpolation points
2. Points automatically sort by x-coordinate
3. Polynomial updates in real-time

### Exploring Presets
1. Select from 9 preset functions in the control panel
2. Try "Runge's Phenomenon" to see interpolation challenges
3. Use "Random Points" for experimentation

### Animation Mode
1. Click "Play" to see step-by-step construction
2. Adjust speed with the slider
3. Watch the polynomial build term by term

### Comparison Mode
1. Enable "Show Lagrange Comparison"
2. See both Newton and Lagrange polynomials overlay
3. Verify they produce identical results

### Data Export/Import
1. Export current points as JSON
2. Import previously saved configurations
3. Share interesting examples with others

## 📐 Mathematical Implementation

### Newton Polynomial Form
```
P(x) = f[x₀] + f[x₀,x₁](x-x₀) + f[x₀,x₁,x₂](x-x₀)(x-x₁) + ...
```

### Divided Differences
```
f[xᵢ,...,xⱼ] = (f[xᵢ₊₁,...,xⱼ] - f[xᵢ,...,xⱼ₋₁]) / (xⱼ - xᵢ)
```

### Key Algorithms
- **Divided Differences**: O(n²) time complexity
- **Polynomial Evaluation**: Horner's method for efficiency
- **Lagrange Form**: Basis polynomials for comparison
- **Numerical Stability**: Checks for ill-conditioned cases

## 🏗️ Project Structure

```
src/
├── components/
│   ├── InteractiveGraph.tsx      # Plotly graph component
│   ├── DividedDifferencesTable.tsx # Animated table
│   ├── MathDisplay.tsx            # Formula rendering
│   └── ControlPanel.tsx           # UI controls
├── utils/
│   ├── math.ts                    # Interpolation algorithms
│   └── presets.ts                 # Example functions
├── types.ts                       # TypeScript interfaces
├── App.tsx                        # Main application
└── index.css                      # Tailwind styles
```

## 🚢 Deployment

The application automatically deploys to GitHub Pages when changes are pushed to the main branch.

### Manual Deployment
```bash
npm run build
# Upload the dist/ folder to your hosting service
```

### GitHub Pages Configuration
- Base path: `/Newton-Polynomial/`
- Build directory: `dist/`
- GitHub Actions workflow handles automatic deployment

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📝 License

This project is open source and available under the MIT License.

## 🎓 Educational Use

Perfect for:
- Numerical Analysis courses
- Mathematical presentations
- Teaching interpolation concepts
- Demonstrating polynomial approximation
- Interactive learning environments

## 🙏 Acknowledgments

Built with modern web technologies to demonstrate the beauty of numerical methods through interactive visualization.

---

**Made with ❤️ for Mathematics Education**
