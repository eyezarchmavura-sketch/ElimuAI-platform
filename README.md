# Elimu AI

Elimu AI is a learner-first, Kiswahili-first learning companion for Tanzania and Africa. The prototype helps learners understand topics, translate learning materials, listen to explanations, practise with self-check questions, and save learning sessions locally.

> **Elewa. Jifunze. Endelea.**

## Current prototype

Open [`elimu-ai.html`](./elimu-ai.html) in a browser, or serve this folder with any static web server. The current prototype is dependency-free and demonstrates:

- Kiswahili-first learning flows with English and bilingual explanation options.
- Learner setup for education level, output language, and content type.
- Explanation, key terms, self-check prompts, answer feedback, and source/limitation notices.
- Local persistence of preferences and saved learning sessions using `localStorage`.
- Accessibility controls for language, text size, high contrast, reduced motion, and data saver mode.
- Honest prototype status labels for AI generation, uploads, downloads, authentication, sharing, and payments.
- A visible Curriculum route with 29 official O-Level and 30 official A-Level TIE syllabus entries, subject search, category filters, official PDF links, and a syllabus-to-learning handoff.
- A compact `curriculum-catalog.json` for low-data discovery, plus a complete `tie-syllabus-manifest.json` and `curriculum-index.json` source registry.
- A versioned service worker (`sw.js`) and IndexedDB facade (`offline-store.js`) for shell/catalog caching, text packs, local sessions, storage estimates, and learner-controlled source pinning.

The prototype does **not** connect to real AI, file processing, authentication, storage, audio generation, or payment services yet. Do not enter sensitive personal, educational, or payment information.

## Specification

Read [`PRODUCT-TECH-SPEC.md`](./PRODUCT-TECH-SPEC.md) for the complete learner-first product and technical specification. It covers target learners, core journeys, information architecture, language rules, accessibility requirements, low-bandwidth strategy, production architecture, data model, API outline, trust and privacy requirements, metrics, roadmap, and acceptance criteria.

Read [`CURRICULUM-INTEGRATION-SPEC.md`](./CURRICULUM-INTEGRATION-SPEC.md) for the syllabus knowledge-layer design, source governance, bilingual retrieval model, page-aware ingestion pipeline, production API additions, and acceptance criteria. [`CURRICULUM-COVERAGE.md`](./CURRICULUM-COVERAGE.md) summarises the official source inventory.

Read [`INGESTION-PIPELINE-SPEC.md`](./INGESTION-PIPELINE-SPEC.md) for the production PDF-to-JSON pipeline, versioning, extraction, OCR, review, quality gates, storage, and curriculum API. Read [`OFFLINE-FIRST-CACHING-STRATEGY.md`](./OFFLINE-FIRST-CACHING-STRATEGY.md) for the offline architecture and rights-aware download policy.

The supporting evidence and design notes are in [`research-notes.md`](./research-notes.md).

## Local preview

From this directory, run:

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/elimu-ai.html`.

## Direction

The next production step is to move long-running AI and media work to a secure server-side API with background jobs, persistent learner accounts, source provenance, real audio/caption services, signed file downloads, rights-aware PDF gateway support, page-aware TIE ingestion, and privacy-preserving observability. The service worker and IndexedDB layer in this repository are a client-side foundation; they intentionally do not bypass source rights or replace the production gateway.
