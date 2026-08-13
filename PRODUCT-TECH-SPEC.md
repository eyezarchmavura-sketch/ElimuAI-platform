# Elimu AI: Learner-First Product and Technical Specification

**Version:** 1.0  
**Prepared by:** Manus AI  
**Audience:** Learners in Tanzania and other African contexts who need clearer, more accessible ways to understand English and other languages while studying and researching.

## 1. Product vision

Elimu AI is a Kiswahili-first learning companion that helps learners understand, practise, listen to, and research educational content in the language and format that works best for them. It should not merely translate words. It should explain ideas in clear language, preserve important English terminology, connect claims to sources, generate practice questions, provide feedback, and allow learners to continue when connectivity is limited.

> **Product promise:** “Elewa. Jifunze. Endelea.” — Understand the idea, practise it, and continue learning wherever you are.

The prototype and future product should treat language choice as part of the learning experience. UNESCO guidance recommends developing learning materials in learners’ languages, aligning assessment with multilingual education, preparing bilingual educators, and involving communities in programme design [1]. Tanzania-focused research similarly identifies English-heavy ICT materials, unexplained technical language, device and connectivity limitations, and accessibility needs as barriers to digital inclusion [2].

## 2. Target learners and initial assumptions

The first release is for **learners**, with a broad Tanzania-first scope rather than a school-administration product. It should serve secondary students, university learners, vocational learners, independent adult learners, and anyone researching a topic in English who prefers to understand it in Kiswahili. The interface should avoid assuming a particular age, school, device, network quality, or English proficiency.

| Learner need | Product response | Initial success signal |
|---|---|---|
| Understand English learning content | Side-by-side Kiswahili explanation, English term, pronunciation, and example | Learner completes an explanation and marks it understood |
| Study a topic independently | Explain, summarize, notes, quiz, and answer feedback flow | Learner completes a learning session rather than only generating text |
| Learn through listening | Audio playback, captions, speed control, and downloadable output | Learner resumes or completes an audio session |
| Use a low-cost mobile connection | Lightweight UI, staged processing, text-first fallback, and save-for-later | Learner can open and save content under constrained connectivity |
| Trust research results | Source links, date, source type, and limitations shown near outputs | Learner opens or saves at least one source |
| Use the platform with different abilities | Semantic controls, focus states, adjustable text, contrast mode, captions, reduced motion | Core flows are usable with keyboard, screen reader, and enlarged text |

## 3. Core learner journeys

### 3.1 First visit and language setup

The first visit presents Kiswahili as the default and explains that the learner can switch between Kiswahili and English at any time. The learner chooses an optional learning level, preferred formats, and whether they want more Kiswahili explanation or more English terminology. These choices must be skippable and editable later.

The product should use a persistent language preference rather than placing language controls only inside a profile screen. Future releases can add other African languages when quality, terminology, and community review are available.

### 3.2 Learn from a topic or pasted material

The learner enters a question, topic, paragraph, URL, or uploaded file. They choose an output such as **Eleza kwa urahisi**, **Fupisha**, **Tengeneza madokezo**, **Nipe maswali**, or **Tafsiri kwa kujifunza**. The system shows the selected language, level, and output format before processing.

The result is a learning card with a short explanation, key terms, an example, a “jaribu mwenyewe” prompt, and optional audio. If the content is research-oriented, the result includes sources, publication dates when available, and a notice that AI output may require verification.

### 3.3 Practice and feedback

When the learner requests a quiz, the system generates a small set of questions with one question per screen on mobile. After each answer, it explains why the answer is correct or incorrect in clear Kiswahili and optionally shows the English term. Progress is saved locally in the prototype and should be stored per learner account in the production service.

### 3.4 Learn from audio or video

The learner supplies a YouTube URL, file, or supported URL. The product first offers a text transcript and summary before optional dubbing. This text-first fallback is important for speed, bandwidth, and accessibility. Captions should be time-aligned where the source allows it. The learner can save the transcript, audio, or a study note.

### 3.5 Resume and library

The library is organized around learning sessions rather than only generated files. Each saved item has a title, topic, source, language pair, format, date, progress, and available actions. The learner can resume a quiz, replay audio, view the explanation, or delete the item.

## 4. Product information architecture

| Area | Purpose | Prototype state | Production direction |
|---|---|---|---|
| Nyumbani | Start a learning session and discover supported workflows | Existing home page | Add “endelea kujifunza,” recent topics, and explicit low-data mode |
| Jifunze | Topic, text, URL, and file input | Existing text generation and translation pages | Consolidate into a guided learning workspace |
| Sauti | Read text or translated content aloud | Existing audiobook page | Add real TTS, captions, download, resume position, and speed control |
| Mazoezi | Quiz, answer, feedback, and progress | Not yet present | Add a dedicated learning session flow |
| Maktaba | Saved learning sessions and downloads | Existing history page | Persist metadata, progress, source, and offline cache status |
| Wasifu na mipangilio | Language, accessibility, privacy, and account preferences | Existing profile page | Add display, language, reduced motion, data usage, and consent settings |
| Kuhusu / Msaada | Explain limitations, safety, support, and reporting | Not yet present | Add visible trust and help content |

## 5. Language and content rules

Kiswahili is the default interface language. Educational outputs should use clear, ordinary Kiswahili before introducing technical vocabulary. Where an English term is important for exams, research, or future study, show it as a labelled term, for example: **msuguano (friction)**, with pronunciation and a short example. The system should not silently replace technical terminology with a potentially confusing direct translation.

Every generated learning output should expose the language pair, learner level, and output type. Translation and explanation must be distinct modes. Explanation may restructure and simplify an idea, while translation should preserve meaning and signal uncertainty where the source is ambiguous.

Community and educator review should be supported in a later phase for terminology, pronunciation, and culturally relevant examples. African-language expansion should follow a quality gate requiring reviewed vocabulary, representative voice samples, and clear disclosure of supported domains.

## 6. Accessibility and inclusive design requirements

The interface must use semantic HTML, labelled controls, keyboard navigation, visible focus states, sufficient contrast, and status announcements for progress and errors. Interactive cards should be real buttons or links rather than clickable generic `div` elements. Emoji may support recognition but must never be the only label or meaning.

| Requirement | Acceptance criterion |
|---|---|
| Text resizing | Content remains usable at 200% browser zoom without horizontal clipping in core flows |
| Keyboard access | Every primary action and modal can be reached and operated without a pointer |
| Screen readers | Inputs have associated labels; progress and result updates use an appropriate live region |
| Contrast | Text and controls meet WCAG AA contrast targets in default and contrast modes |
| Motion | Reduced-motion preference disables non-essential animations |
| Captions | Audio/video results provide captions or a transcript when available |
| Cognitive clarity | Forms use plain-language labels, one primary action, and visible error guidance |
| Audio alternatives | Important learning content is available as readable text, not audio only |

## 7. Low-bandwidth and offline-friendly requirements

The prototype should demonstrate a **Data saver** setting that hides decorative elements, prioritizes text, disables autoplay, and makes audio/video optional. Processing states should explain what is happening and offer a text-only fallback. Generated results should be saved in local storage so a learner can revisit a completed session after a refresh or temporary network loss.

The production architecture should use resumable uploads, background jobs, small JSON responses, compressed audio, signed download URLs, and a service worker or installable web app for cached learning sessions. No feature should imply that offline functionality is complete until it has been tested on an actual low-connectivity device.

## 8. Prototype implementation scope

The current repository is a single static HTML file. The next prototype increment should remain dependency-free and should implement the following foundations without pretending that external services already work:

1. Add a persistent language and accessibility settings panel with Kiswahili/English selection, text-size controls, contrast mode, reduced motion, and data-saver mode.
2. Add a learner-focused “session setup” panel with learning level, explanation style, output type, and source/language metadata.
3. Add a real learning-session result model in the browser with explanation, key terms, example, self-check question, feedback, source metadata, and saved progress.
4. Add local-storage persistence for preferences and saved learning sessions.
5. Add explicit prototype labels and honest status copy for simulated AI, uploads, downloads, authentication, and payments.
6. Improve semantic markup, focus behavior, keyboard access, live progress announcements, and accessible labels.
7. Replace inflated or unverifiable usage statistics with product capability statements or clearly labelled demo data.
8. Add a visible “Jinsi ya kujifunza” section explaining the learner workflow in plain Kiswahili.

## 9. Production technical architecture

The production service should use a mobile-first web application with a secure server-side API. A static prototype is suitable for validating the learner experience, but it must not handle secret API keys, private uploads, authentication tokens, or payment logic in browser JavaScript.

| Layer | Responsibility | Suggested implementation direction |
|---|---|---|
| Web client | Responsive learner UI, preferences, local cache, accessible interactions | React/TypeScript or equivalent web application after prototype validation |
| API | Authenticated sessions, learning requests, library, feedback, quotas | Server-side REST or typed RPC endpoints |
| Job worker | Transcript extraction, translation, summarization, TTS, file conversion | Queue-backed background jobs with idempotent status updates |
| LLM gateway | Prompt templates, model selection, moderation, structured outputs | Server-side provider abstraction with logging and budget limits |
| Speech layer | Speech-to-text, translation, Kiswahili TTS, captions | Provider abstraction with language/voice capability checks |
| Storage | Source files, generated text/audio, metadata, retention policies | Object storage with signed URLs and lifecycle cleanup |
| Database | Users, preferences, sessions, outputs, sources, progress, feedback | Relational database with migrations and audit fields |
| Observability | Job status, errors, latency, cost, abuse signals | Structured logs, metrics, tracing, and admin alerts |

## 10. Core production data model

| Entity | Important fields |
|---|---|
| User | `id`, `email_or_phone`, `display_name`, `created_at`, `consent_version` |
| LearnerPreference | `user_id`, `ui_language`, `output_language`, `education_level`, `text_scale`, `contrast_mode`, `reduced_motion`, `data_saver` |
| LearningSession | `id`, `user_id`, `title`, `input_type`, `source_uri`, `source_language`, `output_language`, `level`, `status`, `created_at` |
| LearningOutput | `id`, `session_id`, `output_type`, `content_json`, `audio_uri`, `caption_uri`, `model_version`, `confidence_note` |
| QuizAttempt | `id`, `session_id`, `question_index`, `answer`, `is_correct`, `feedback`, `created_at` |
| Source | `id`, `session_id`, `url`, `title`, `publisher`, `published_at`, `retrieved_at`, `citation_text` |
| SavedProgress | `user_id`, `session_id`, `position`, `completed_steps`, `updated_at` |
| Feedback | `id`, `user_id`, `session_id`, `category`, `comment`, `created_at` |

## 11. API contract outline

The initial API should expose `POST /v1/learning-sessions` to create a session, `GET /v1/learning-sessions/:id` to retrieve status and outputs, `POST /v1/learning-sessions/:id/quiz-attempts` to record answers, `PATCH /v1/learners/me/preferences` to update language and accessibility preferences, `GET /v1/library` to list saved sessions, and `DELETE /v1/library/:id` to remove saved content.

Long-running tasks should return a session identifier and status such as `queued`, `processing`, `ready`, `partial`, `failed`, or `needs_review`. The client should poll or subscribe to status updates. Every generated result should include its model version, source metadata when available, and a clear limitation note.

## 12. Trust, safety, privacy, and research quality

Elimu AI should distinguish between **learning assistance** and verified research. It should show links to sources used, state when no source was provided, and encourage verification for medical, legal, financial, and safety-critical topics. Learners should be able to report a harmful, incorrect, or culturally inappropriate result.

Uploads and generated files should have a stated retention period. The product should request only necessary personal information, avoid exposing private content through public links by default, and require explicit consent before using learner content for improvement. Payment and account functionality must remain disabled or clearly marked as a demonstration until connected to secure services.

## 13. Metrics for the learner-first release

The first release should measure understanding and continued learning, not only generated volume. Useful metrics include first-session completion, percentage of learners who open a source, quiz completion rate, answer improvement after feedback, audio completion or resume rate, saved-session return rate, language preference distribution, low-data mode usage, error rate, and accessibility-setting usage. Metrics must be aggregated and privacy-preserving.

## 14. Delivery roadmap

| Phase | Deliverable | Exit criteria |
|---|---|---|
| Prototype foundation | Language, accessibility, session setup, demo learning result, local persistence, honest status labels | Core flows work without external services and pass manual keyboard/mobile checks |
| Learner MVP | Real auth, saved library, AI text workflow, structured quiz feedback, source capture | Learner can complete and resume a real session end to end |
| Media learning | Transcription, captions, TTS, audio downloads, resumable jobs | Text-first fallback works when media processing fails |
| Trust and scale | Source provenance, moderation, feedback, observability, quotas, privacy controls | Operations can detect failures and learners can report issues |
| Regional expansion | Reviewed African-language terminology and voices | Each added language passes community and quality review |

## 15. Prototype acceptance checklist

The updated prototype is ready for review when a learner can set Kiswahili or English, adjust text size and contrast, enable data saver, choose a learning level, generate a demo explanation or quiz, receive answer feedback, save the session, reload the page, and find the saved session in the library. The prototype must visibly disclose that generated AI content, uploads, authentication, downloads, sharing, and payments are demonstrations unless they are actually connected.

## References

[1]: https://www.unesco.org/en/articles/new-unesco-report-calls-multilingual-education-unlock-learning-and-inclusion "UNESCO, New UNESCO report calls for multilingual education to unlock learning and inclusion"
[2]: https://www.hamk.fi/en/publications/from-swahili-to-screens-overcoming-digital-literacy-obstacles-in-tanzania/ "Emma Nkonoki and Wilberforce Meena, From Swahili to Screens: Overcoming Digital Literacy Obstacles in Tanzania"
[3]: https://data.unicef.org/topic/education/remote-learning-and-digital-connectivity/ "UNICEF Data, Remote learning and digital connectivity"
