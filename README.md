# Robot Museum

An interactive 3D museum built with Three.js technology, showcasing various exhibitions presented by a robot in a post-apocalyptic world where humanity has practically become extinct. [PLAY NOW]() 

## Features

- Interactive 3D museum environment
- Multiple exhibits and displays
- Sound effects and background music
- Camera controls and navigation
- Responsive design

## Installation and Setup

### Prerequisites

- Node.js (latest LTS version recommended)
- Modern web browser (Chrome recommended)

### Local Development

1. Clone or download the project to your local machine
2. Open a terminal in the project directory
3. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npx vite
   ```
5. Open your browser and navigate to the localhost URL displayed in the terminal

### Production Build

To build the project for production:

```bash
npm run build
```

## Project Structure

```
Robot Museum/
├── index.html          # Main HTML file
├── main.js            # Main application logic
├── style.css          # Styles
├── setup/             # Three.js setup modules
│   ├── camera.js      # Camera configuration
│   ├── controls.js    # Controls setup
│   ├── lights.js      # Lighting setup
│   ├── loader.js      # Asset loading
│   └── skybox.js      # Skybox configuration
├── utils/             # Utility modules
│   ├── animationController.js  # Handles animations and transitions
│   ├── eventManager.js         # Manages user interactions and events
│   ├── flyTo.js               # Camera movement and navigation
│   └── keyboard.js            # Keyboard input handling
└── public/            # Static assets
    ├── models/        # 3D models
    ├── sounds/        # Audio files
    ├── textures/      # Textures and materials
    └── images/        # Images and UI elements
```

## Dependencies

- **Three.js** (^0.172.0) - 3D graphics library
- **dat.GUI** (^0.7.9) - Debug interface
- **Vite** (^6.0.7) - Build tool and dev server

## Resources and Licenses

List of resources used in the project. Thanks to all creators for their kindness.

[modified] - The resource has been modified

### CC BY 4.0 License

- "[Anxiety Monster - Big](https://skfb.ly/onQsT)" model by **[zach.kolman](https://sketchfab.com/zach.kolman)** [modified]

- "[Free Airlock Door](https://skfb.ly/6UtDu)" model by **[michael_grodkowski](https://sketchfab.com/michael_grodkowski)**

- "[Small set of daggers](https://skfb.ly/6XHXI)" model by **[Maksim Batyrev](https://sketchfab.com/c3posw01)** [modified]

- "[Cyberpunk 2077 Police Drone](https://skfb.ly/oGtV7)" model by **[SthaN42](https://sketchfab.com/SthaN42)** based on a [model](https://www.artstation.com/artwork/QrN9AB) created by **[Nigel Kenepa](https://www.artstation.com/nigelkenepa)** [modified]

- "[🌙 Moon Landing](https://skfb.ly/6Rsr7)" model by **[BlackProject](https://sketchfab.com/BlackProject)** [modified]

- "[Dandelion](https://skfb.ly/6SWSN)" model by **[rhcreations](https://sketchfab.com/rhcreations)** [modified]

- "[Prison cell door](https://skfb.ly/6SppY)" model by **[Rivaldragon](https://sketchfab.com/Rivaldragon)** [modified]

- "[Modular brick Wall](https://skfb.ly/6S9uO)" model by **[mc477](https://sketchfab.com/mc477)** [modified]

- "[The Suffering: Horace P. Gage](https://skfb.ly/p8PIP)" model by **[fred346b](https://sketchfab.com/fred346b)** [modified]

- "[Low-poly Papers Set](https://skfb.ly/o8yVS)" model by **[Hox_Lira](https://sketchfab.com/hox_lira)** [modified]

### CC BY-NC 4.0 License

- "[Portal 2 - Employee Stickman](https://skfb.ly/oIDBs)" model by **[ProtoArts](https://sketchfab.com/ProtoArts)**. [modified]

### CC0 License

- "[Xelu_Free_Controller&Key_Prompts](https://thoseawesomeguys.com/prompts/)" by **[Nicolae (Xelu) Berbece](https://thoseawesomeguys.com/about/)**

### CC BY 3.0 License

- "[Stormy days skybox](https://opengameart.org/content/stormy-days-skybox)" by **[Jockum Skoglund (hipshot)](https://www.zfight.com/)**.

### Royalty Free License

- "[Column-02](https://www.blenderkit.com/asset-gallery-detail/72a666c4-f78d-4ff2-8412-3f93da5a7052/)" model by **[Blender Hood](https://www.blenderkit.com/asset-gallery?query=author_id:471049)**

- "[Paving Arch Forest Ground](https://www.blenderkit.com/asset-gallery-detail/4fea87a6-5513-4c7c-b44d-280c10c0339a/)" material by **[Jonathan Ramos](https://jonramos.artstation.com/)**

- "[Tiles 05](https://www.blenderkit.com/asset-gallery-detail/0c4ec5a9-03c2-40d0-8856-e63033b881b8/)" material by **[Andrey Livintsov](https://www.linkedin.com/in/andreylivintsov/)**

### Other Licenses

- [dancing monke](https://pixabay.com/gifs/mono-dancing-happy-monkey-435/) by **[Dantegráfico](https://pixabay.com/users/dantegr%C3%A1fico-15862390/)**
