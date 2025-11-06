# Modelnaya Interactive Map

An interactive React application featuring a zoomable and pannable map with layer controls and clickable elements.

## Features

- **Interactive Map**: Zoom and pan functionality with mouse wheel and drag
- **Layer Controls**: Toggle visibility of "stops" and "speed" layers
- **Hover Effects**: Interactive elements highlight on hover
- **Video Popups**: Click on U-turn elements to see related video links with timecodes
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
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

1. Build the project:
```bash
npm run build
```

2. Deploy to GitHub Pages:
```bash
npm run deploy
```

Make sure to update the `homepage` field in `package.json` with your GitHub username and repository name.

## Usage

- **Zoom**: Use mouse wheel to zoom in/out
- **Pan**: Click and drag to move the map around
- **Layer Controls**: Use the controls in the top-left to show/hide layers
- **Interactive Elements**: Click on the U-turn elements to see video links
- **Hover**: Hover over interactive elements to see highlighting effects

## Customization

### Adding Video Links

Edit the `videoData` object in `src/components/InteractiveMap.js` to add your own video links:

```javascript
const videoData = {
  'tul-ava-uturn': {
    title: 'Your Title',
    videos: [
      { url: 'https://your-video-url', title: 'Video Title', timecode: '2:30' }
    ]
  }
};
```

### Styling

- Map styles: `src/components/InteractiveMap.css`
- Layer controls: `src/components/LayerControls.css`
- Popup styles: `src/components/Popup.css`

## Project Structure

```
src/
├── components/
│   ├── InteractiveMap.js      # Main map component
│   ├── InteractiveMap.css     # Map styles
│   ├── LayerControls.js      # Layer toggle controls
│   ├── LayerControls.css     # Control styles
│   ├── Popup.js              # Video popup component
│   └── Popup.css             # Popup styles
├── App.js                    # Main app component
├── App.css                   # App styles
├── index.js                  # React entry point
└── index.css                # Global styles
```
