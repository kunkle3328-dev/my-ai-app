# Nebula Mind 2.0

Nebula Mind 2.0 is a notebook‑oriented research assistant inspired by NotebookLM. It allows you to collect sources from the web, chat with a retrieval‑augmented model, generate study artefacts and listen to a human‑like two‑host audio overview. The app is built with Vite, React and TypeScript and deploys to Vercel using serverless functions for AI calls.

## How to run locally

1. **Install dependencies**: `npm install`
2. **Create `.env`**: Copy `.env.example` to `.env` and populate your API keys (Gemini, Tavily, optional TTS). Without keys the app will still run but some server functions will return messages that deployment is required.
3. **Start development server**: `npm run dev` then open `http://localhost:5173` in your browser. The app persists notebooks and sources in your browser localStorage.
4. **Run unit tests**: Not provided in v1.

## Deploy on Vercel

1. Push this repository to GitHub and connect it in your Vercel dashboard.
2. Set environment variables in Vercel: `GEMINI_API_KEY`, `TAVILY_API_KEY` and optional `GOOGLE_CLOUD_TTS_KEY` (or your chosen TTS provider).
3. Deploy the project. The Vercel build will run `npm run build` and serve the built SPA along with the serverless functions in `api/`.
4. After deployment, features such as Discover, Chat and Audio Overview will automatically use the configured API keys.

## Testing checklist

* Create, rename and delete notebooks; refresh the page and verify they persist.
* Add a pasted text source and ensure the source list updates.
* Chat with the assistant; answers should cite sources and identify when information is missing.
* When deployed with API keys, the Discover feature should return at least five usable web sources for common topics.
* Audio Overview should generate a script and render the dialogue with the two hosts. If credentials are missing, the UI will show a warning instead of hanging.
* Refresh routes on Vercel and confirm they do not 404 thanks to the rewrites defined in `vercel.json`.
