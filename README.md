# Workout Visualizer

A minimal React workout visualizer that lists warm-up, strength/core, and cool-down exercises and can fetch a short motivational message from a generative language API.

Note: The repository currently contains a single file named `index.html` which actually contains a React component (JSX). This README explains how to run the component in a proper React project, how to supply your own API key (for you or anyone working on the repo), and recommended next steps.

## Table of contents

- Overview
- What’s included
- Quick start (recommended: Vite)
- Alternative: quick static/demo approach
- API key configuration (how you — a maintainer — can use your own key)
- How to use the app (end-user steps)
- Developer notes (contract, edge cases)
- Troubleshooting
- Next steps & improvements
- License

## Overview

The app shows a compact workout plan (warm-up, strength/circuit, cool-down). Each exercise has guidance, sets/reps where applicable, and a placeholder image. A button fetches a motivational message from an external generative language API.

## What’s included

- `index.html` — currently contains a React component (JSX) exporting `App`. There is no full React project structure in this repo yet.

Because the file contains JSX and uses `export default App;`, you need a React build environment (Vite, CRA, etc.) to run it directly.

## Quick start (recommended) — scaffold a Vite React project

This creates a minimal, modern dev environment and is the recommended way to work on the component.

1. Create a Vite React project and install deps:

```bash
# from the repo root or a parent directory
npm create vite@latest workout-visualizer -- --template react
cd workout-visualizer
npm install
```

2. Copy the React component into the Vite project:

- Open the `index.html` file in this repo and copy the React component code (from `import React, ...` down to `export default App;`).
- Replace the contents of `src/App.jsx` in the Vite project with that component.

3. Wire up environment variables (see API key section below).

4. Run the dev server:

```bash
npm run dev
```

5. Open the URL from the terminal (usually `http://localhost:5173`).

Notes:
- If you prefer Create React App, the same idea applies: paste the component into `src/App.jsx` and run `npm start`.

## Alternative: quick static/demo approach (not recommended)

The component currently uses JSX and modern imports, so a browser can't run it directly. To produce a quick static demo you must either:
- Convert the JSX to vanilla JS/HTML (manual work), or
- Bundle/transpile with a tool (Vite, Parcel, webpack). The Vite option above is simplest.

## API key configuration — use your own key (for you or any contributor)

The component makes a request to a generative language API using a hard-coded placeholder for an API key. Do NOT commit real API keys. Here are two safe approaches you can use depending on your needs.

1) Local dev using environment variables (good for local development)

- Create a `.env.local` file in the root of the Vite project (not this repo root unless you copied files there):

```bash
# .env.local (Vite uses the VITE_ prefix)
VITE_GEMINI_API_KEY=your_api_key_here
```

- In the React code, read the key like this:

```js
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
```

- Add `.env.local` (and `.env*`) to `.gitignore` so keys are never committed.

2) Production / secure — use a backend proxy (strongly recommended for production)

- Why: client-side keys are visible to anyone. Store your API key on a server and proxy requests.
- Example flow:
  - Client POST /api/motivation -> server
  - Server (Node/Express, serverless function) reads stored API key (from server env), calls the external API, and returns the response to the client

Simple Node/Express example (server-side):

```js
// server/index.js (very small example)
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

app.post('/api/motivation', async (req, res) => {
  const prompt = req.body.prompt || 'Give me a short motivational message for a workout.';
  try {
    const apiKey = process.env.GEMINI_API_KEY; // set on server
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const payload = { contents: [{ role: 'user', parts: [{ text: prompt }] }] };
    const r = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await r.json();
    res.json(body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

app.listen(3000, () => console.log('server listening on :3000'));
```

Then from the React client call `/api/motivation` instead of the public API and you never expose the key.

## How to use the app (for users)

- Open the app in your browser.
- Click "Get a Motivational Message ✨" to request a short inspirational line.
- Expand any exercise card's "How-to & Details" section to view instructions and sets/reps.

Placeholder images are powered by `https://placehold.co/` and are generated from the exercise's `imagePrompt` field.

## Developer notes

Contract for the motivational endpoint (client-side behavior):
- Input: none (component uses a fixed internal prompt by default)
- Output: a short string shown in the UI
- Errors: network errors, 4xx/5xx from API, rate-limiting 429

Edge cases to consider and suggestions:
- No API key available: detect and show a clear message telling the user/contributor how to set `VITE_GEMINI_API_KEY` or use a proxy.
- Malformed/empty API response: show a friendly fallback message and log the response for debugging.
- Rate-limiting: the component uses a 3-attempt exponential backoff; consider exposing retry state in the UI or increasing attempts.

## Troubleshooting

- JSX or import errors in the browser: ensure you're building/transpiling the component with a React toolchain (Vite, CRA).
- 401/403 errors when requesting the API: check the API key and whether it's being passed properly (env vs client).
- Frequent 429 (rate limit): use a server proxy, cache results, or reduce the frequency of requests.

## Next steps & recommended improvements

- Convert this repo into a full Vite project and commit `src/` files.
- Add a small Node/Express or serverless proxy to keep the API key secret in production.
- Add tests (Jest + React Testing Library) for components.
- Add TypeScript for stronger type safety.
- Improve accessibility (aria attributes, keyboard navigation).

If you'd like I can:
- Create the Vite project in this repository and wire the component and `.env` setup for you, or
- Add a small example Express proxy (server) and example `.env` and `.gitignore` entries.

## License

Add a `LICENSE` file (e.g., MIT) if you want permissive open-source terms.

---

Checklist — your request coverage

- "write a detailed readme file for it": Done — README updated with setup and dev guidance.
- "give instruction for using your own ( me who every working of the repo )": Done — local env and server-proxy approaches included with examples.