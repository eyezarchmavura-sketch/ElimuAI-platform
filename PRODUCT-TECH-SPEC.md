# Elimu AI — Complete Product and Technical Specification

**Version:** 2.0
**Prepared by:** Manus AI  
**Product direction:** Learner-first, Kiswahili-first, fully bilingual, low-data, accessible, and research-aware
**Primary market:** Tanzania, with a design that can expand across Africa

## 1. Executive summary

Elimu AI is a learning and research companion for people who want to understand educational material without being blocked by English proficiency, expensive data, limited device storage, or inaccessible interfaces. It combines **Kiswahili explanation**, **full English access**, optional side-by-side terminology, audio and transcript support, source-aware research assistance, practice questions, feedback, and saved progress.

The product must be different from a basic translation app. A translation app changes words from one language to another. Elimu AI should help a learner **understand an idea, practise it, verify it, remember it, and continue later**. The main unit of the product is therefore a **learning session**, not a translated file.

> **Product promise:** *Elewa. Jifunze. Endelea.* — Understand the idea, practise it, and keep learning.

The revised product uses three independent language choices:

| Language choice | Meaning | Example |
|---|---|---|
| Interface language | The language used for buttons, navigation, instructions, and system messages | Kiswahili or English |
| Learning explanation language | The language used to explain the topic | Kiswahili, English, or bilingual |
| Source language | The language of the learner’s input or source material | English, Kiswahili, Arabic, French, or detected language |

This separation is essential. A learner may want English navigation, a Kiswahili explanation, and an English source. The product should never force one language decision to control the entire experience.

## 2. Why Elimu AI is needed

UNESCO recommends multilingual education that develops learning materials in learners’ languages, aligns assessment with multilingual principles, supports bilingual educators, and involves local communities [1]. Tanzania-focused research reports that many ICT materials and digital tools remain English-heavy even though Kiswahili is the primary language of instruction in public primary education. It also identifies mixed-language terminology, device limitations, connectivity barriers, and accessibility needs as obstacles to digital inclusion [2]. UNICEF reports that home internet access remains sharply unequal across regions and income groups, reinforcing the need for learning experiences that do not assume stable broadband [3].

These conditions imply five non-negotiable product principles:

1. **Language must be visible and reversible.** A learner should change languages without losing their place.
2. **English access must be complete.** English should not be an afterthought or a placeholder option.
3. **Bilingual content must not mean duplicate downloads.** The same source, media, and session should support multiple text variants.
4. **Text must come before heavy media.** Audio, video, and images should be optional enhancements rather than the only path to learning.
5. **The product must teach, not only translate.** Outputs need examples, practice, feedback, and source context.

## 3. Vision, mission, and positioning

### Vision

A learner in Tanzania or anywhere in Africa can understand useful knowledge, regardless of whether the original material is written or spoken in English or another language, and can continue learning on an affordable mobile connection.

### Mission

To make high-quality learning and research assistance understandable, affordable, accessible, and culturally relevant through Kiswahili, English, audio, text, and learner-controlled study tools.

### Positioning

Elimu AI is a **bilingual learning companion**, not a generic chatbot, a video dubbing service, or a school administration system. Its differentiators are:

| Differentiator | Product expression |
|---|---|
| Concept-first learning | Every important output includes explanation, key terms, an example, and a self-check activity |
| Full bilingual access | Kiswahili and English are complete product languages, with a quick switch that preserves context |
| One-source, many-language delivery | One learning session and one media source can expose multiple text variants without duplicating downloads |
| Low-data by design | Text-first processing, optional media, compressed responses, local caching, and explicit data estimates |
| Local relevance | Kiswahili terminology, Tanzanian examples, regional research sources, and a future community review process |
| Trustworthy research | Sources, dates, source type, limitations, and report controls appear next to research-oriented outputs |
| Inclusive learning | Adjustable text, contrast, reduced motion, captions, audio alternatives, plain-language explanations, and keyboard support |

## 4. Target learners

The primary audience is **learners**, not institutions. The first release should be useful to secondary students, university and vocational learners, adult learners, self-taught professionals, and independent researchers. The experience should work for a first-time smartphone user as well as a confident internet user.

| Learner group | Typical need | Priority experience |
|---|---|---|
| Secondary learner | Understand a difficult English topic and practise for an exam | Explain, key terms, example, quiz, feedback, save progress |
| University learner | Read research or lecture material across languages | Source-aware summary, bilingual terminology, notes, citation links |
| Vocational learner | Learn practical concepts with limited data | Short lessons, audio option, downloadable text, local examples |
| Adult learner | Build confidence in English and digital learning | Simple language, pronunciation, side-by-side mode, guided steps |
| Independent researcher | Compare sources and understand unfamiliar terms | Search, source panel, evidence notes, limitations, report incorrect output |

## 5. Product principles

### 5.1 Learner control

The learner controls language, level, output type, media, text size, contrast, and data usage. Defaults should be helpful, but no language or media decision should be irreversible.

### 5.2 One concept, multiple representations

The product stores a learning concept once and supplies language variants, audio, captions, notes, and quiz feedback as representations of that concept. This reduces duplicate storage and makes it possible to switch language without starting again.

### 5.3 Explain before embellish

The first response should be readable and useful even when images, audio, or video cannot load. Decorative visuals, waveform animations, background music, and autoplay must never be prerequisites for understanding.

### 5.4 Honest capability states

The interface must distinguish **ready**, **processing**, **partial**, **needs review**, **offline copy**, and **not connected**. Prototype functions must never appear to be live payments, real authentication, or real AI processing when they are not.

### 5.5 Local language quality

Kiswahili should be clear and natural, not a word-for-word machine translation. English technical terms should remain available where they help exams, research, and future study. New African-language support should be added only after terminology, pronunciation, and community review.

## 6. Bilingual experience design

### 6.1 Replace the settings modal with a language rail

Language should no longer be hidden inside a settings modal. The main interface should contain a visible **Language Rail** in the top header:

```text
[ ElimuAI ]       [ SW Kiswahili | EN English ]       [ Data: Text-first ]
```

On small screens, this becomes a compact segmented control directly below the header:

```text
Lugha ya interface:  [ SW ] [ EN ]
Maelezo ya kipindi:  [ Kiswahili ] [ English ] [ Pande zote ]
```

The language rail is not a destructive action. Switching language changes labels and the chosen explanation view while preserving the current route, topic, result, quiz position, and saved progress.

The existing accessibility modal may remain as a secondary settings surface, but it must no longer be the primary way to discover or change language.

### 6.2 Home language dock

The home page should include a prominent **Chagua namna ya kujifunza / Choose how to learn** dock with three options:

| Option | Kiswahili label | English label | Result |
|---|---|---|---|
| Kiswahili | Jifunze kwa Kiswahili | Learn in Kiswahili | Kiswahili interface and explanation |
| English | Learn in English | Learn in English | English interface and explanation |
| Pande zote | Kiswahili + English | Kiswahili + English | Bilingual explanation with labelled terms |

The learner can select one option for the current session without changing the global interface preference.

### 6.3 Bilingual result view

A learning result should not download two independent copies. The client receives one structured learning object containing a concept identifier and the requested text variants. The interface renders one of three views:

- **Single language:** only the selected language is visible.
- **Parallel:** Kiswahili and English paragraphs appear together, using the same section structure.
- **Focus and reveal:** one language is shown first; the learner taps a sentence or term to reveal the other language on demand.

The recommended default for mobile and low-data use is **Focus and reveal**. It gives the learner bilingual access without placing two full blocks of text on screen or requesting both variants at the start.

### 6.4 Term bridge

Technical terms appear as a compact bridge rather than repeated translations:

```text
msuguano  →  friction
Pronunciation: /frik-shən/
Mfano / Example: The friction between the tyre and road helps the vehicle stop.
```

Term cards are stored and cached independently from long media. A learner can save a term to a personal vocabulary list.

### 6.5 English completeness requirement

The English mode must translate all learner-facing product strings, including navigation, empty states, errors, progress states, source notices, accessibility controls, library metadata, quiz feedback, and prototype disclosures. English must not be implemented as a dropdown that only changes the document language attribute.

Every user-facing string belongs in a translation catalog with a stable key. Missing translations fall back to Kiswahili only in development; production must show a monitored missing-translation error rather than silently mixing languages.

## 7. Core learner journeys

### 7.1 Start a session

The learner taps **Jifunze / Learn** from the home page. A single guided workspace asks for a topic, question, pasted text, URL, or file. The learner chooses level, explanation language, output type, and data mode. The product displays a small data estimate such as **Text result: low data** or **Audio: larger download** before processing.

### 7.2 Understand a concept

The result begins with a one-paragraph explanation, then shows key terms, a local or practical example, a short self-check question, and source information where relevant. A language rail lets the learner change from Kiswahili to English or bilingual view without creating a second session.

### 7.3 Practise

Quiz mode shows one question at a time on mobile, supports both language views, and returns feedback after each answer. The learner can choose **Nionyeshe kwa Kiswahili / Explain in Kiswahili** or **Explain in English** for feedback without resetting the quiz.

### 7.4 Learn from a URL, video, or file

The product first creates a compact transcript, summary, and key terms. Dubbing, full audio, and visual previews are optional. If processing is incomplete, the learner can use the available text and return later for media.

### 7.5 Save and resume

A saved session contains the topic, source, selected language mode, current section, quiz progress, vocabulary terms, and cache status. Resuming the session does not require downloading content that is already stored locally.

## 8. Product information architecture

| Surface | Purpose | Major change from current prototype |
|---|---|---|
| Home | Start learning and resume recent sessions | Add language dock, learner path cards, data estimate, and resume strip |
| Learn workspace | One place for topic, text, URL, and file input | Replace fragmented generation controls with a guided session builder |
| Result view | Understand and switch language without losing context | Add single/parallel/focus-and-reveal views, term bridge, examples, sources |
| Practice | Quiz and formative feedback | Add dedicated practice state and bilingual feedback toggle |
| Listen | Audio and transcript | Text-first by default, optional TTS, captions, download estimate |
| Vocabulary | Saved technical terms | New lightweight learning surface for English-Kiswahili term pairs |
| Library | Resume learning sessions | Show progress, language mode, cache status, and storage size |
| Header language rail | Change interface and session language | New persistent visible control; not modal-dependent |
| Accessibility dock | Quick text and contrast controls | Add inline quick actions; keep deeper settings secondary |
| Profile | Account and privacy settings | Remove misleading live-service claims and add privacy/retention copy |
| Help and trust | Explain limitations and report issues | New surface for source quality, AI limitations, and feedback |

## 9. Low-data and no-duplicate-download strategy

### 9.1 Core rule

Switching from Kiswahili to English must not automatically download a second audio file, video file, image set, or complete duplicate document. The client should reuse the canonical source and request only the missing text variant or term translation.

### 9.2 Request strategy

The client sends a learning-session request with language and representation preferences. The server returns a structured response with the smallest useful payload:

```json
{
  "sessionId": "ls_123",
  "conceptId": "concept_newton_1",
  "source": {"kind": "text", "language": "en", "hash": "sha256:..."},
  "availableVariants": ["sw", "en"],
  "selectedVariant": "sw",
  "sections": [
    {"id": "explanation", "sw": "...", "en": "..."},
    {"id": "example", "sw": "...", "en": "..."}
  ],
  "terms": [
    {"id": "term_friction", "sw": "msuguano", "en": "friction"}
  ],
  "media": {
    "canonicalSourceUri": "...",
    "audio": {"sw": null, "en": null},
    "captions": {"sw": "...", "en": "..."}
  },
  "dataEstimate": {"textBytes": 18000, "audioBytes": null}
}
```

The server may return both short text variants if they fit the response budget, but audio and video are generated or fetched only when the learner requests them.

### 9.3 Cache layers

| Cache | Stored item | Policy |
|---|---|---|
| Memory cache | Current session and current language view | Cleared when the page closes |
| IndexedDB | Saved text sessions, quiz progress, term list | User-controlled retention and size budget |
| Service worker cache | App shell and critical translation catalog | Versioned, small, refreshed in the background |
| Object storage | Source files and generated media | Server retention rules, signed URLs, lifecycle cleanup |
| HTTP cache | Versioned translation catalogs and public assets | ETags, immutable hashes, compressed responses |

### 9.4 Data saver behavior

When data saver is active, the product should:

- Request text before audio or video.
- Avoid autoplay and decorative remote images.
- Use compact JSON and compressed responses.
- Delay the second language variant until the learner requests it, unless the content is a short term card.
- Show a data estimate before an audio or video action.
- Store completed text locally for offline reopening.
- Offer a **Download text only** action.
- Allow the learner to clear cached media separately from cached text.

### 9.5 Data budget targets

These are design targets for the MVP, not promises until measured on real devices.

| Action | Target |
|---|---:|
| App shell after first load | Under 250 KB compressed excluding fonts |
| Text learning response | Under 50 KB compressed for a standard lesson |
| Language switch for existing session | Under 20 KB when the second text variant is not already cached |
| Term card | Under 5 KB |
| Text-only saved session | Under 100 KB each |
| Audio preview | Explicit estimate shown before request |
| Video or dubbing | Never requested automatically in data saver mode |

## 10. Accessibility and inclusive design

The product must use semantic HTML, labelled controls, visible focus states, keyboard operation, live status announcements, readable error messages, and screen-reader-friendly language switching. Language controls must expose the current language through text, not colour alone.

| Requirement | Acceptance criterion |
|---|---|
| Language switching | User can switch interface and session language from the visible language rail without losing route or progress |
| English completeness | All navigation, system, error, source, quiz, and accessibility strings exist in English and Kiswahili |
| Text scaling | Core flows remain usable at 200% zoom and with the in-app text scale at 1.25 |
| Contrast | Default and high-contrast themes meet WCAG AA targets for normal text and controls |
| Keyboard | Language rail, learning actions, result tabs, quiz controls, and library items are keyboard operable |
| Screen reader | Current language, loading status, result changes, and feedback are announced appropriately |
| Motion | Non-essential animation is disabled when reduced motion is enabled or preferred by the OS |
| Captions | Audio/video content provides captions or a text transcript when available |
| Cognitive load | One primary action per step, plain-language labels, clear progress, and reversible choices |
| Touch | Interactive controls provide a minimum 44 CSS pixel target and adequate spacing |

## 11. Learner safety, trust, and research quality

Elimu AI should clearly separate **AI learning assistance** from verified research. Research-oriented outputs must show sources used, publisher or source type when available, retrieval date, and a limitation note. For high-stakes medical, legal, financial, safety, and civic information, the product should encourage verification and should not present generated content as professional advice.

Learners should be able to report an output as incorrect, harmful, culturally inappropriate, poorly translated, or missing a source. A report must record the session and output version without exposing the learner’s private material publicly.

## 12. Technical architecture

A static HTML prototype is appropriate for validating interaction and content hierarchy. Production must move secrets, private uploads, authentication, AI calls, media processing, and payments to a secure server-side application.

| Layer | Responsibility | Implementation direction |
|---|---|---|
| Web client | Responsive bilingual interface, language rail, local state, accessibility | React/TypeScript or equivalent after prototype validation |
| Translation catalog | Product strings and language coverage | Versioned JSON catalogs with build-time missing-key checks |
| Session state | Current topic, language view, result, quiz, cache state | Client state store plus IndexedDB persistence |
| Service worker | App shell and selected offline text sessions | Cache-first shell, network-first session sync, explicit media policy |
| API gateway | Auth, rate limits, session requests, library, feedback | Server-side REST or typed RPC |
| Learning orchestrator | Prompt templates, structured output, language variants, validation | Server-side provider abstraction and schema validation |
| Job queue | Transcription, translation, TTS, captioning, conversion | Idempotent background jobs with status updates |
| Media service | Speech-to-text, Kiswahili/English TTS, captions | Provider abstraction with capability checks and fallbacks |
| Storage | Source files, generated outputs, media, cache metadata | Object storage with signed URLs and lifecycle rules |
| Database | Learners, preferences, sessions, variants, progress, sources | Relational database with migrations and audit fields |
| Search and sources | Research retrieval, source metadata, deduplication | Search provider plus source normalization and citation records |
| Observability | Latency, errors, usage, costs, language quality reports | Structured logs, metrics, traces, privacy-preserving analytics |

## 13. Canonical content model

The production content model must avoid duplicating the same lesson for every language. A canonical session contains a stable concept and language-specific representations.

| Entity | Key fields |
|---|---|
| User | `id`, `email_or_phone`, `display_name`, `created_at`, `consent_version` |
| LearnerPreference | `user_id`, `interface_language`, `default_explanation_language`, `display_mode`, `text_scale`, `contrast_mode`, `reduced_motion`, `data_saver`, `cache_budget_bytes` |
| LearningSession | `id`, `user_id`, `topic`, `input_type`, `source_id`, `level`, `status`, `created_at`, `updated_at` |
| CanonicalConcept | `id`, `fingerprint`, `source_hash`, `source_language`, `normalized_sections`, `created_at` |
| ConceptVariant | `id`, `concept_id`, `language`, `sections_json`, `model_version`, `review_status`, `created_at` |
| TermBridge | `id`, `concept_id`, `source_term`, `sw_term`, `en_term`, `pronunciation`, `example_json`, `review_status` |
| LearningOutput | `id`, `session_id`, `concept_id`, `output_type`, `selected_language`, `display_mode`, `limitations`, `created_at` |
| QuizQuestion | `id`, `concept_id`, `language_variants_json`, `answer_key`, `explanation_json` |
| QuizAttempt | `id`, `session_id`, `question_id`, `answer`, `is_correct`, `feedback_language`, `created_at` |
| MediaAsset | `id`, `concept_id`, `kind`, `language`, `codec`, `bytes`, `uri`, `retention_until` |
| SavedProgress | `user_id`, `session_id`, `section_id`, `quiz_position`, `cached_bytes`, `updated_at` |
| Source | `id`, `session_id`, `url`, `title`, `publisher`, `published_at`, `retrieved_at`, `citation_text` |
| Feedback | `id`, `user_id`, `session_id`, `category`, `language`, `comment`, `created_at` |

## 14. API contract

| Endpoint | Purpose |
|---|---|
| `POST /v1/learning-sessions` | Create a session with topic, source, level, language, display mode, and data policy |
| `GET /v1/learning-sessions/:id` | Retrieve session status and currently available output variants |
| `POST /v1/learning-sessions/:id/variants` | Request a missing language variant for an existing concept |
| `POST /v1/learning-sessions/:id/media` | Request a selected audio, caption, or video representation with estimate |
| `POST /v1/learning-sessions/:id/quiz-attempts` | Record an answer and return feedback in the chosen language |
| `PATCH /v1/learners/me/preferences` | Update interface, language, accessibility, and data preferences |
| `GET /v1/library` | List saved sessions, cache status, and progress |
| `DELETE /v1/library/:id` | Delete a saved session and associated cached data |
| `POST /v1/feedback` | Report incorrect, harmful, culturally inappropriate, or untranslated content |
| `GET /v1/translation-catalog/:locale` | Retrieve a versioned UI translation catalog |

Long-running operations return `queued`, `processing`, `ready`, `partial`, `failed`, or `needs_review`. Every output includes a model version, language, source metadata when available, and a limitation note.

## 15. Front-end state model

The client should maintain separate state for interface language, session language, content availability, cache state, and accessibility preferences.

```text
app
├── interfaceLocale: sw | en
├── sessionLanguage: sw | en | both
├── displayMode: single | parallel | reveal
├── accessibility: textScale, contrast, reducedMotion
├── dataPolicy: normal | textFirst | offlineOnly
├── session: topic, level, source, status
├── variants: sw?, en?
├── currentSection
├── quiz: questions, position, attempts
└── cache: textBytes, mediaBytes, budgetBytes
```

A language switch must update only the necessary state. It must not reset `session`, `currentSection`, or `quiz`.

## 16. Prototype redesign scope

The prototype should be changed substantially rather than only adding another modal. The implementation increment should include:

1. A visible bilingual **Language Rail** in the header with `SW` and `EN` controls.
2. A home-page language dock with **Kiswahili**, **English**, and **Pande zote / Both** session choices.
3. A visible data policy rail showing **Text-first**, **Normal**, or **Offline copy**.
4. A new “Choose how to learn” section with text, practice, listen, research, and vocabulary routes.
5. A bilingual result header with single-language, parallel, and focus-and-reveal display modes.
6. A complete English translation catalog for prototype-visible navigation, controls, empty states, progress, feedback, and disclosures.
7. A term bridge and bilingual vocabulary cards.
8. A clear data estimate on audio, video, and language-variant actions.
9. A text-first fallback for translation and audiobook flows.
10. An inline accessibility quick dock on the home and learner pages, while preserving the deeper settings surface for detailed preferences.
11. A “resume learning” strip and a lightweight vocabulary view.
12. Honest product labels that remove misleading claims about real payments, app-store availability, live user counts, and connected AI services.

## 17. Metrics and quality gates

Success should be measured by learning continuity and understanding rather than only generation volume.

| Metric | Why it matters |
|---|---|
| First-session completion | Indicates whether the learner can understand the workflow |
| Language switch completion | Shows whether bilingual access works without losing context |
| Second-variant request size | Measures the cost of switching language |
| Text-only completion rate | Measures low-data viability |
| Quiz completion and improvement | Measures learning rather than passive reading |
| Source-open rate | Measures research trust and verification behaviour |
| Saved-session return rate | Measures continuity across connectivity gaps |
| Cache size per learner | Helps prevent storage and data surprises |
| English string coverage | Prevents incomplete bilingual delivery |
| Kiswahili quality reports | Supports terminology and cultural review |
| Accessibility setting usage | Identifies which inclusive controls provide value |

## 18. Delivery roadmap

| Phase | Deliverable | Exit criteria |
|---|---|---|
| A — Bilingual prototype | Language rail, home language dock, English catalog, bilingual result states, data policy rail | Learner can switch interface and session language without losing the current session |
| B — Learning MVP | Real AI text workflow, source capture, structured explanations, quiz feedback, local session cache | Learner can complete and resume a real text learning session |
| C — Offline text and vocabulary | Service worker, IndexedDB session cache, vocabulary, cache budget, text-only downloads | Saved text sessions reopen without network and without duplicate content |
| D — Media learning | Transcription, captions, TTS, optional audio, resumable media jobs | Media is optional and text-first fallback always works |
| E — Trust and scale | Source provenance, moderation, reports, observability, quotas, privacy controls | Operators can detect errors and learners can report them safely |
| F — African language expansion | Reviewed terminology, voices, examples, and catalog coverage | Each new language passes community and quality review |

## 19. Revised prototype acceptance checklist

The revised prototype is ready for review when:

- The header shows a visible `SW / EN` language rail without opening a modal.
- Switching the interface language updates the major visible learner-facing strings, not only the HTML language attribute.
- The home page lets the learner choose Kiswahili, English, or bilingual mode for the current session.
- The learner can switch a generated result between single-language, parallel, and reveal views.
- Switching language preserves the topic, result, quiz position, and saved progress.
- The interface displays a text-first/data-saver policy outside the settings modal.
- A language switch requests or simulates only the missing text variant; it does not duplicate media.
- English and Kiswahili controls have accessible labels and visible active states.
- Quiz feedback can be requested in either language.
- A term bridge exposes Kiswahili and English technical vocabulary.
- Data estimates appear before heavy media actions.
- The prototype clearly discloses which services are not connected.
- The product remains usable with high contrast, reduced motion, enlarged text, keyboard navigation, and screen readers.

## References

[1]: https://www.unesco.org/en/articles/new-unesco-report-calls-multilingual-education-unlock-learning-and-inclusion "UNESCO, New UNESCO report calls for multilingual education to unlock learning and inclusion"
[2]: https://www.hamk.fi/en/publications/from-swahili-to-screens-overcoming-digital-literacy-obstacles-in-tanzania/ "Emma Nkonoki and Wilberforce Meena, From Swahili to Screens: Overcoming Digital Literacy Obstacles in Tanzania"
[3]: https://data.unicef.org/topic/education/remote-learning-and-digital-connectivity/ "UNICEF Data, Remote learning and digital connectivity"
