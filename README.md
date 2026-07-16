# CGPA Calculator — Frontend

Plain HTML/CSS/JS frontend that consumes the backend REST API for full CRUD.

## Files
```
frontend/
├── index.html
├── style.css
└── script.js
```

## Setup
No build step needed — pure HTML/CSS/JS.

1. Make sure the backend is running at `http://localhost:5000` (see backend/README.md).
2. Open `index.html` directly in a browser, or serve it with a simple static server:
   ```
   npx serve .
   ```
   or the VS Code "Live Server" extension.

## What it does
- Add subjects dynamically (name, credit, grade point) and submit to create a record — CGPA is calculated by the backend.
- View all saved records with their calculated CGPA.
- Edit a record (loads it back into the form, PUT on submit).
- Delete a record.

## Config
If your backend runs on a different port/host, update `API_BASE` at the top of `script.js`:
```js
const API_BASE = "http://localhost:5000/api/records";
```

## Notes for teammate
- This folder is self-contained; push it as its own repo/folder.
- No dependencies, no node_modules — nothing to gitignore.
