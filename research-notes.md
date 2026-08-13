# Elimu AI research notes

## UNESCO multilingual education guidance
Source: https://www.unesco.org/en/articles/new-unesco-report-calls-multilingual-education-unlock-learning-and-inclusion

UNESCO guidance recommends collecting sociolinguistic and educational data, integrating multilingual education from early grades, developing learning materials in learners’ languages, aligning assessment with multilingual principles, training teachers fluent in both local and official languages, and involving parents, caregivers, and local communities. The page states that multilingual education supports inclusion, cultural identity, and preservation of indigenous knowledge systems.

Implications for Elimu AI: make language choice a first-class product feature; provide learner-language explanations alongside English terminology; support local/community contributions and feedback; include multilingual assessments and teacher-oriented materials; avoid treating translation as the only language feature.

## Tanzania digital literacy and language barriers
Source: https://www.hamk.fi/en/publications/from-swahili-to-screens-overcoming-digital-literacy-obstacles-in-tanzania/

The 2026 HAMK article reports that Kiswahili is Tanzania’s national language and primary language of instruction in public primary schools, while many ICT learning materials, textbooks, and digital tools remain available only in English. It highlights mixed-language ICT textbooks, English-based keyboards, direct translations of English terminology, device/access constraints, limited digital skills, economic barriers, and accessibility needs for learners with physical, neurological, cognitive, and learning differences. It argues for contextually relevant and linguistically accessible ICT materials.

Implications for Elimu AI: use plain Kiswahili by default; show English technical terms with pronunciation and examples rather than unexplained direct translations; design for low-bandwidth and mobile use; provide audio and downloadable/offline learning; support accessibility settings such as text size, contrast, and screen-reader-friendly markup; include digital-literacy onboarding.

## Current repository observations
Repository: https://github.com/eyezarchmavura-sketch/ElimuAI-platform

The repository is a small static prototype centered on `elimu-ai.html`. The UI is mobile-first, in Kiswahili, and includes pages/features for YouTube translation, file/URL translation, audiobook generation, text generation (summaries, explanations, quizzes, essays, notes, translation), pricing with Tanzanian payment methods, history, profile, login/signup modals, and a bottom navigation bar. Most interactions are simulated with toast messages and timed progress bars; upload, authentication, AI generation, audio playback, downloads, sharing, and payments are not connected to real services.

Potential product strengths: clear Kiswahili-first positioning, mobile layout, audio/video/text learning modes, and locally relevant payment labels.

Potential product risks: emoji-based controls and mock buttons may reduce accessibility and trust; no evident language switcher or dialect/local-language strategy; no visible low-bandwidth/offline mode; no citations or source provenance for research; no real persistence/authentication; no learning progression or quiz feedback; no visible privacy, consent, or content-safety guidance; pricing/payment UI appears to imply functionality that is not implemented.

## Rendered prototype review

The rendered home screen presents a Kiswahili-first mobile experience with top-right login/signup controls, a hero CTA, cards for YouTube translation, audiobook creation, AI writing, and a personal library, plus bottom navigation for Home, Translation, Audio, Writing, Library, and Profile. The current browser interaction snapshot confirms these are visible and discoverable, but the repository code shows the workflows are largely demonstrative rather than connected to back-end services.

## Prototype verification checkpoint

The updated prototype rendered successfully at `http://127.0.0.1:4173/elimu-ai.html`. The home screen now shows a learner-first promise, a visible prototype disclosure, capability-oriented stats, a persistent `Aa` accessibility entry point, and the existing mobile navigation. Opening `Aa` exposes Kiswahili/English interface preference, text-size controls, high-contrast mode, reduced motion, and data saver controls. Browser markup inspection confirmed the settings dialog is labelled, its inputs are discoverable, and the page has no duplicate IDs.

## Learning workflow verification

The browser opened the updated text-learning workflow and exposed the new learner setup controls for level and explanation language. Entering “Eleza Sheria za Newton kwa lugha rahisi” and generating a result displayed a demo learning session with a Kiswahili explanation, key terms including English terminology, a self-check prompt, source/limitations notice, answer field, feedback action, audio handoff, and local save action. This confirms the main learner-first workflow is interactive in the static prototype.

## Persistence test

Browser runtime verification confirmed that a generated learning session can be saved to `localStorage` (`sessions: 1`), the learning result is visible, and the answer-feedback control exists. The settings preference store is initially empty until a learner changes a preference, after which the prototype writes it locally.
