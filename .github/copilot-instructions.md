# Copilot Instructions for HASEEB-WEBSITE

## Project Overview
- This is a static website for HASEEB CABLES, a manufacturer and wholesaler of electrical wires and cables.
- The site is built with plain HTML, CSS, and JavaScript. There is no build system or framework.
- All assets (images, videos, styles, scripts) are stored locally in the project directory.

## Key Files & Structure
- `index.html`: Main entry point. Contains all page sections and navigation.
- `styles.css`: Main stylesheet. Includes theming (light/dark mode), responsive design, and custom UI components.
- `script.js`: Handles interactivity (navbar, dark mode, form, etc.).
- `pictures/`: Contains images grouped by feature (services, products, etc.).
- `.vscode/tasks.json`: Defines a task to run a local server for development.

## Developer Workflow
- **Local Development:**
  - Start the site locally using the VS Code task: **Run Live Server** (runs `python3 -m http.server 8000`).
  - Access the site at [http://localhost:8000](http://localhost:8000).
- **No build step**: Edit HTML, CSS, or JS directly and refresh the browser to see changes.
- **No tests or CI/CD**: This project does not use automated tests or continuous integration.

## Project Conventions
- **Styling:**
  - Uses CSS custom properties for theming (e.g., `--primary-color`).
  - Dark mode is toggled by adding/removing the `dark-mode` class on `<body>`.
  - Responsive design is handled with media queries in `styles.css`.
- **JavaScript:**
  - All scripts are in `script.js` and run on page load.
  - Dark mode preference is saved in `localStorage`.
  - DOM elements are selected by class or ID; no frameworks are used.
- **Assets:**
  - Images and videos are referenced with relative paths from `index.html`.

## Patterns & Examples
- **Dark Mode Toggle:**
  - Controlled by a button with ID `darkModeToggle`.
  - Updates icon and saves preference in `localStorage`.
- **Navigation:**
  - Responsive hamburger menu for mobile.
  - Active section highlighting via class toggling.

## Integration & Dependencies
- No external build tools or package managers.
- Uses Google Fonts and Font Awesome via CDN in `index.html`.
- No backend or API integration.

## How to Extend
- Add new sections by editing `index.html` and updating `styles.css` as needed.
- Place new images in the appropriate subfolder under `pictures/`.
- For new interactivity, add code to `script.js`.

---
For questions about project structure or workflow, see the files above for examples. Keep all code simple and framework-free.
