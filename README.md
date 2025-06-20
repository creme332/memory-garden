# Memory Garden

**Transform your memories into a beautiful 3D world where each emotion has its own unique landscape**

Memory Garden is an immersive 3D journaling experience where your memories come to life as trees in different emotional landscapes. Each journal entry is planted in one of four distinct emotional zones, creating a living, breathing representation of your inner world.

## Application Architecture

### Frontend
- **React** with modern hooks and functional components
- **Three.js + React Three Fiber** for 3D rendering and scene management
- **Rapier Physics** for realistic object interactions and character movement
- **Tailwind CSS** for responsive UI styling
- **IndexedDB (via Dexie)** for privacy-first local data storage

### Backend
- **No Traditional Backend** - Privacy-first architecture with local storage
- **Ollama Integration** - Local AI inference for therapist functionality
- **Face-API.js** - Client-side emotion detection processing

## Models and Libraries

### Core Libraries
- **React Three Fiber** - 3D scene management in React
- **@react-three/drei** - Utility components for Three.js
- **@react-three/rapier** - Physics engine integration
- **face-api.js** - Real-time facial emotion detection
- **Dexie** - IndexedDB wrapper for structured data storage

### AI Models
- **Gemma3:1b** (via Ollama) - Local language model for therapist conversations
- **TinyFaceDetector** - Lightweight face detection model
- **FaceExpressionNet** - Emotion classification model (7 emotions: happy, sad, angry, fearful, disgusted, surprised, neutral)

## Methodology

### Development Approach
1. **Privacy-First Design** - All personal data remains on user's device
2. **Modular Terrain System** - Each emotion zone as independent component
3. **Procedural Generation** - Dynamic object placement using spatial algorithms
4. **Progressive Enhancement** - Core functionality works without AI features
5. Immersive Audio Design – Each terrain features unique background music to reflect the user’s emotion


### Data Flow
```
User Input → Emotion Detection → Zone Selection → 3D Rendering → Local Storage
         ↘ AI Analysis → Therapist Responses → Cached Locally
```

## Model Performance

### Emotion Detection Accuracy
- **Face-API.js TinyFaceDetector**: [99.38% accuracy](https://github.com/justadudewhohacks/face-api.js) in good lighting
- **Expression Recognition**: 6-class emotion classification with confidence scores
- **Limitations**: Performance degrades in poor lighting or extreme angles

### AI Therapist Performance
- **Response Quality**: Context-aware responses using journal history
- **Latency**: 2-5 seconds with local Ollama inference
- **Accuracy**: Dependent on Gemma3:1b model capabilities

### Visual Output Analysis
- **Physics Simulation**: Stable character movement with collision detection
- **Procedural Placement**: Collision-free object distribution using spatial grids
- **Weather Effects**: Dynamic rain/fog systems matching emotional zones

## Limitations

### Technical Constraints
- **Browser Dependency**: Requires modern browser with WebGL support
- **Local Storage**: Data tied to specific browser/device
- **AI Processing**: Requires local Ollama installation for full functionality
- **Mobile Performance**: Limited 3D on mobile devices

### Emotion Detection Limitations
- **Lighting Sensitivity**: Poor performance in low light conditions
- **Single Face**: Only detects primary face in frame
- **Cultural Bias**: Model trained primarily on Western facial expressions
- **Camera Required**: Emotion features unavailable without camera access

### User Experience
- **Learning Curve**: 3D navigation may be challenging for some users
- **Resource Intensive**: High GPU usage during extended sessions
- **No Cross-Device Sync**: Data isolation between devices

## Future Enhancements

### Technical Improvements
- **WebRTC Integration** - Peer-to-peer data synchronization
- **Progressive Web App** - Offline functionality and mobile optimization
- **WebAssembly** - Faster local AI processing
- **Advanced Physics** - More realistic environmental interactions

### Feature Additions
- **Collaborative Gardens** - Shared memory spaces with privacy controls
- **Export Capabilities** - PDF reports and data visualization
- **Accessibility Features** - Screen reader support and keyboard-only navigation
- **Multi-language Support** - Internationalization for global users

### AI Enhancements
- **Improved Emotion Models** - More diverse and accurate detection
- **Personalized Therapy** - Adaptive responses based on user patterns
- **Voice Integration** - Speech-to-text for hands-free journaling
- **Sentiment Analysis** - Automatic emotion classification from text

### Privacy & Security
- **End-to-End Encryption** - Secure data export/import
- **Biometric Authentication** - Optional device-level security

## Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start the development server
npm run dev

# Set up the local AI
# Make sure Ollama is installed, then run:
ollama pull gemma3:1b
ollama serve
```

## Contributors

1. [creme332](https://github.com/creme332)
2. [Naamlas1009](https://github.com/Naamlas1009)
3. [VDNAV](https://github.com/VDNAV)
4. [Divyeshhhh](https://github.com/Divyeshhhh)