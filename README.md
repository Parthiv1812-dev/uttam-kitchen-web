
# Tool Manufacturing Company Website

This skeleton now mirrors the `tool-manufacturing-website` layout with a clear split between a React frontend (Vite) and a Python FastAPI backend for the B2B inquiry form.

## Project layout
- `frontend/` — Vite + React app (all previous `src`, `index.html`, `package.json`, and Vite config live here). The B2B inquiry modal posts to the backend at `/api/inquiry` using `VITE_API_URL`.
- `backend/` — FastAPI service with `/api/inquiry`, CORS, and an email helper (logs when SMTP creds are not provided).
- `tool-manufacturing-website/` — Original full project kept untouched for reference.

## Prereqs
- Node 18+ and npm for the frontend.
- Python 3.11+ for the backend.

## Run the frontend
1) `cd frontend`
2) `cp .env.example .env` and update `VITE_API_URL` if the backend runs on a different host/port.
3) `npm install`
4) `npm run dev` then open the shown URL (default `http://localhost:3000`).

## Run the backend
1) `cd backend`
2) Create a venv: `python -m venv .venv`
3) Activate it: `.\.venv\Scripts\activate` (Windows) or `source .venv/bin/activate` (macOS/Linux)
4) `pip install -r requirements.txt`
5) `cp .env.example .env` and set SMTP credentials if you want real email delivery. The API will still respond successfully and log inquiries if SMTP is blank.
6) `uvicorn app.main:app --reload --port 8000`
7) Test: `curl http://localhost:8000/health` or visit Swagger UI at `http://localhost:8000/docs`.

## B2B inquiry flow
The `frontend/src/components/B2BInquiryModal.tsx` posts user details to `${VITE_API_URL}/api/inquiry`. The backend validates fields and sends (or logs) an email. Update `.env` files to point both sides at the same host/port.
