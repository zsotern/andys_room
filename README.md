# Andy's Room — Interactive 3D Room (Three.js)

An interactive 3D scene running in the browser, depicting a Toy Story–inspired kid's room. Built with Three.js using native ES modules — no build tool or bundler.

**Live demo:** https://andys-room.vercel.app/

> Note: the on-screen UI (info panel, key hints) is in Hungarian, as this started as a university assignment. The scene itself and all interactions are language-independent.

## Key features

- **Procedurally built scene** — all furniture (bed, desk, dresser, bookshelf, treasure chest) is constructed from individual Three.js geometries and materials, not imported models
- **OBJ/MTL model loading** — a custom sign is loaded from an external model file using `MTLLoader` and `OBJLoader`
- **Day/night toggle** (`N` key) — dynamically changes scene lighting, background color, and light intensities
- **Interactive lighting** — independently toggleable desk lamp (`L`) and ceiling light (`V`)
- **Raycasting-based interaction** — clicking the mini train activates it, then it can be driven around the room with the arrow keys
- **Collision detection** — bounding-box collision checks prevent the train from driving through furniture
- **Animated elements** — a continuously rotating ceiling fan
- **Free camera movement** — `OrbitControls` for freely exploring the scene, resettable to the default view with `R`
## Controls

| Key | Action |
|---|---|
| `I` | Toggle info panel |
| `N` | Toggle day / night |
| `L` | Toggle desk lamp |
| `V` | Toggle ceiling light |
| `R` | Reset camera |
| Click train + arrow keys | Drive the mini train |

## Tech stack

- **Three.js** (r160) — loaded as native ES modules via import maps, no build step
- **OrbitControls, MTLLoader, OBJLoader** — from Three.js's official add-on modules
- No backend or build pipeline — pure client-side static HTML/CSS/JS
## Running locally

Since the project uses native ES modules, a simple local server is required (the `file://` protocol won't work due to CORS restrictions):

```bash
# with Python
python -m http.server 8000
 
# or with Node.js (npx)
npx serve .
```

Then open `http://localhost:8000` in your browser.

## Background

This project started as an individual assignment for a university course. Since then, helper functions have been refactored into separate modules for better readability.