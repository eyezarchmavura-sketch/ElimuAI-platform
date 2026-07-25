# ElimuAI Platform

ElimuAI is a Kiswahili-first educational app for Tanzanian learners. The product vision is to help students understand difficult topics through AI-powered summaries, simple explanations, exam-style questions, notes, essays, translation, audio, and eventually video dubbing.

## What is implemented now

This repository now contains a launchable MVP foundation:

- A preserved mobile-first ElimuAI frontend in `index.html`.
- Frontend styles split into `src/styles.css`.
- Frontend interactions split into `src/app.js`.
- API helper functions in `src/api.js`.
- A minimal Node/Express backend in `server/src/index.js`.
- A health endpoint at `GET /api/health`.
- An AI-ready education endpoint at `POST /api/ai/generate`.
- A safe local fallback response when no OpenAI API key is configured.

## MVP focus

The first real feature is the **Andika** tool. It sends a learner's topic or text to the backend and can generate:

- Muhtasari
- Maelezo rahisi
- Maswali ya mazoezi
- Insha
- Madokezo ya somo
- Tafsiri ya Kiswahili

The backend prompt is designed for Tanzanian learners and asks the AI to answer in clear Kiswahili with locally relevant examples.

## Requirements

- Node.js 18 or newer
- npm

## Setup

```bash
npm install
cp .env.example .env
```

The app works without an AI key by returning local demo learning content. To enable live AI generation, edit `.env` and set:

```bash
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4.1-mini
```

## Run locally

```bash
npm run dev
```

Then open:

```txt
http://localhost:3000
```

## API endpoints

### Health check

```bash
curl http://localhost:3000/api/health
```

### Generate study content

```bash
curl -X POST http://localhost:3000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"type":"summary","level":"secondary","length":"medium","input":"Eleza Sheria za Newton"}'
```

Valid `type` values:

- `summary`
- `explain`
- `quiz`
- `essay`
- `notes`
- `translate`

Valid `level` values:

- `primary`
- `secondary`
- `university`
- `adult`

Valid `length` values:

- `short`
- `medium`
- `long`

## Next priorities

1. Add real authentication for students, teachers, parents, and schools.
2. Save generated notes and quizzes to a user library.
3. Add curriculum fields for class/form, subject, topic, and exam type.
4. Add usage limits for free and paid plans.
5. Connect real mobile-money payment providers.
6. Build a teacher dashboard for assignments and progress reports.
7. Add video/audio processing after the text-learning flow is stable.
