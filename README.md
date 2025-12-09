# Modelnaya Interactive Map

An interactive React application featuring a zoomable and pannable map with layer controls, clickable elements, and export functionality.

## Features

- **Interactive Map**: Zoom and pan functionality with mouse wheel, drag, and touch gestures
- **Layer Controls**: Toggle visibility of multiple layers:
  - Stop limits (Места для остановки)
  - Speed limits (Разрешенная скорость)
  - Bus stops (Остановки транспорта)
  - Left turns (Левые повороты)
  - Right turns (Правые повороты)
  - U-turns (Развороты)
- **Hover Effects**: Interactive elements highlight on hover
- **Video Popups**: Click on interactive elements to see related video links with timecodes
- **Export Functionality**: Export the map as PNG or PDF
- **Feedback Button**: Contact form and links to Telegram group
- **Responsive Design**: Works on desktop and mobile devices with touch support

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd modelnaya
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Deployment to GitHub Pages

The project is automatically deployed to GitHub Pages using GitHub Actions workflows. When you push changes to the main branch, the workflow will:

1. Build the project
2. Deploy the built files to GitHub Pages

No manual deployment steps are required. The deployment happens automatically on every push to the main branch.

## Usage

- **Zoom**: Use mouse wheel to zoom in/out (desktop) or pinch gesture (mobile)
- **Pan**: Click and drag to move the map around
- **Layer Controls**: Use the controls panel at the bottom (mobile) or left side (desktop) to show/hide layers
- **Turn Controls**: Toggle visibility of left turns, right turns, and U-turns separately
- **Interactive Elements**: Click on interactive elements to see video links with timecodes
- **Hover**: Hover over interactive elements to see highlighting effects
- **Export**: Use the export buttons to download the map as PNG or PDF
- **Feedback**: Click the question mark button in the top-right corner to contact the developers

## Customization

### Adding Video Links

Edit `src/assets/VideoData.json` to add your own video links:

```json
{
  "element-id": {
    "title": "Your Title",
    "videos": [
      {
        "url": "https://your-video-url",
        "title": "Video Title",
        "time": "2:30",
        "date": "2024-01-01"
      }
    ]
  }
}
```

The element ID should match the `id` attribute of the SVG element you want to make interactive.

### Styling

The project uses Tailwind CSS for styling. Configuration is in `tailwind.config.js`. Styles are applied using Tailwind utility classes directly in components.

## Project Structure

```
src/
├── components/
│   ├── InteractiveMap.js      # Main map component with zoom/pan logic
│   ├── ControlPanel.js        # Container for all control panels
│   ├── LayerControls.js       # Layer toggle controls (stop, speed, bus stops)
│   ├── TurnsToggle.js         # Turn visibility toggles (left, right, U-turns)
│   ├── CustomToggle.js        # Reusable toggle component
│   ├── VideoPopup.js          # Video popup component with Floating UI
│   ├── ExportSection.js       # PNG/PDF export functionality
│   └── FeedbackButton.js      # Feedback modal with contact info
├── assets/
│   ├── modelnaya-raw.svg      # Main SVG map file
│   ├── VideoData.json         # Video links data for interactive elements
│   └── *.svg                  # Icon assets
├── App.js                     # Main app component
├── App.css                    # App styles
├── index.js                   # React entry point
└── index.css                  # Global styles
```

## Technologies Used

- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **@floating-ui/react** - Popup positioning
- **html2canvas** - Canvas rendering for exports
- **jspdf** - PDF generation
- **react-icons** - Icon library
- **react-app-rewired** - Build configuration override
