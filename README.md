# UretimZeka Frontend

A modern web application for OPEX, Lean Manufacturing and Continuous Improvement analysis.

## Features
- LM Studio integration for local LLM inference
- Automatic Excel aggregation to keep token usage low
- File upload UI with status badges
- Fallback to Groq when LM Studio is unavailable

## Setup
1. Clone the repository (or extract the provided ZIP).
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in `backend/` (see example below):
   ```
   AI_PROVIDER=lmstudio
   LM_STUDIO_URL=http://127.0.0.1:1234/v1
   LM_STUDIO_MODEL=google/gemma-4-e4b
   ```
4. Start the dev server:
   ```
   npm run dev
   ```
5. Open http://localhost:5000 in a browser.

## Deployment
- Build the production bundle with `npm run build`.
- Deploy the `frontend` and `backend` directories to a Node‑compatible host.

## License
MIT
