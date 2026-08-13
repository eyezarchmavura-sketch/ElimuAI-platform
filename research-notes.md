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

## Follow-up browser test: settings controls

The prototype loaded successfully in a browser. The `Aa` button opened the labelled language and accessibility dialog. Switching the interface preference to English triggered the expected confirmation and selected the English option; the prototype correctly states that full interface translation is still planned. Enabling high-contrast mode changed the visible interface to a stronger black, white, and cyan contrast scheme and showed the expected confirmation message.

## Follow-up browser test: motion and data settings

Reduced-motion mode accepted the learner’s selection and returned the expected confirmation. Data-saver mode also activated successfully; the home-screen status changed from “Hali ya kawaida” to “Hali ya kuhifadhi data.” The visual state confirms that the preference is applied while the dialog remains operable.

## Follow-up browser test: persisted state and text scaling

Browser runtime inspection confirmed that the active body classes are `high-contrast`, `reduced-motion`, and `data-saver`. The saved preference object contains `language: "en"`, contrast, motion, data saver, and text-scale values. Increasing text size triggered the expected confirmation message, updating the stored text scale from `1` to `1.05`.

## Follow-up browser test: learner quiz

With high contrast, reduced motion, data saver, and enlarged text still active, the learner workspace remained usable. The tester selected “Maswali ya Mtihani,” entered “Sheria za Newton,” and generated a demo quiz. The result provided four self-test questions, bilingual key terms, a self-explanation prompt, a source/limitations notice, an answer field, feedback action, and actions to save, copy, or send text to audio. The interface correctly labels the output as a demo.

## Follow-up browser test: feedback and refresh persistence

Submitting a written quiz response produced formative feedback in Kiswahili and updated the most recent local learning session to `completed: true`; two saved sessions were present in local storage. After a full browser refresh, the high-contrast visual state and “Hali ya kuhifadhi data” indicator remained active, confirming that the accessibility preferences persist across reloads.

## Bilingual redesign verification

The redesigned prototype now loads with a visible `SW Kiswahili / EN English` language rail, a data-policy control, a session-language dock, four learner pathways, inline accessibility controls, a vocabulary route, and a library/profile navigation structure. Switching the visible interface rail to Kiswahili updated the main home-screen strings in place; the reverse English switch updated navigation, labels, forms, and accessibility copy in place without opening a modal.

The learner workspace exposed session controls for Kiswahili, English, Both, Focus & reveal, and Parallel, plus a text-first data estimate. A bilingual Newton’s Laws session rendered both labelled Kiswahili and English text variants, key-term pairs, a shared-media notice, a source/limitations note, and saved-session actions. The English-only session view was also verified through the live runtime: it hides the Kiswahili result and shows the English variant while preserving the same session.

One browser click attempt did not change the session language because the result control was below the active viewport snapshot; direct runtime state inspection confirmed the control logic itself works and updates `languageMode` plus the hidden/visible result panes correctly. Future UI testing should scroll the control into view before pointer interaction.

## Final English resume verification

After the supporting-text repair, reloading and resuming the saved English session displayed `● Learning session`, English learner prompts, English source-transparency copy, the English source link label, and the English answer placeholder without opening a modal. Runtime inspection confirmed `languageMode: en`, `sessionLanguage: en`, `displayMode: reveal`, with only the English result pane visible (`swHidden: true`, `enHidden: false`, `bothHidden: true`).

## Data policy verification

The visible header data control works outside any modal. It cycles from `Data: Text-first` to `Data: Normal` with a larger estimate (`~45 KB`) and then to `Data: Offline copy` with `Saved text`. The policy label and learner workspace estimate update in place while the current session remains intact.

## Inline accessibility verification

The home page quick-access dock exposes text scaling, contrast, reduced-motion, and data controls without requiring the prior settings modal. High-contrast mode activated and the runtime state reported `contrast: true`; reduced-motion could be toggled from the same dock and the final check reported `motion: false` after it was toggled off. The persisted runtime state also showed `textScale: 1.05` and `dataPolicy: offlineOnly`, confirming accessibility and low-data preferences are stored independently.

## Vocabulary verification

After bringing the result card into view, the `Save terms` control displayed `Terms saved.` and the Vocabulary route then showed four locally stored bilingual term cards. The cards contain only Kiswahili/English terms and short examples, with no media download, supporting the low-data learning model.

## Official Tanzanian syllabus sources

The official Tanzania Institute of Education (TIE) lower-secondary academic syllabus index is https://www.tie.go.tz/publications/syllabus-for-lower-secondary-academics. The page labels the collection as the new lower-secondary academic syllabuses and lists official documents dated 29 June 2023, including Physics, Mathematics, Literature in English, Kiswahili, Arabic, Theatre Arts, Sport Studies, Music, Textile and Garment Construction, Islamic Religious Education, and History of Tanzania and Ethics. The visible list is paginated, so the complete O-Level inventory requires collecting additional pages.

The official TIE upper-secondary academic syllabus index is https://www.tie.go.tz/publications/syllabus-for-upper-secondary-education. The current page lists official Form V–VI documents including Tourism (25 April 2025), Theatre Arts, Sport Studies, Physics, Music, Islamic Religious Education, Literature in English, Kiswahili, History, History of Tanzania and Ethics, Geography, and French. The page is also paginated, and the complete A-Level inventory requires collecting additional pages.

The collection should be integrated as source-linked metadata and structured learning objectives, not copied wholesale into the prototype. Each subject should retain the official TIE document URL, publication date, version, level, and review status.

### A-Level Form V–VI inventory from TIE

The official upper-secondary index contains 29 syllabus documents across three pages. Page 1 lists Tourism (2025), Theatre Arts, Sport Studies, Physics, Music, Islamic Religious Education, Literature in English, Kiswahili, History, History of Tanzania and Ethics, Geography, and French. Page 2 lists Food and Human Nutrition, Fine Art, Fasihi ya Kiswahili, English Language, Economics, Divinity, Computer Science, Chinese Language, Chemistry, Business Studies, Biology, and Basic Applied Mathematics. Page 3 lists Arabic, Agriculture, Textiles and Garment Construction, Mathematics, Accountancy, and Academic Communication. The official URLs and dates are captured on the corresponding TIE pages; these should be stored in a machine-readable manifest with `level: A`, `forms: V–VI`, `source_org: TIE`, and `source_date`.

This inventory is 29 official subject documents, including language, science, business, humanities, arts, vocational, and applied subjects. The 2025 Tourism document should be treated as newer than the 2023 documents and surfaced with its publication date.

### O-Level Form I–IV inventory from TIE

The official lower-secondary index contains 29 academic syllabus documents across three pages. Page 1 includes Kiswahili, Theatre Arts, Sport Studies, Physics, Textile and Garment Construction, Music, Islamic Religious Education, History of Tanzania and Ethics, Mathematics, Literature in English, and Arabic, plus a 2025 Kiswahili document visible on the page. Page 2 includes History, Geography, French, Food and Human Nutrition (listed twice on TIE and requiring deduplication), Fine Art, Fasihi ya Kiswahili, English Language, Computer Science, Chinese Language, Chemistry, and Business Studies. Page 3 includes Book-keeping, Biology, Bible Knowledge, Agriculture, and Additional Mathematics.

The inventory is 29 listed documents before deduplication, or 28 unique subject/document entries if the duplicated Food and Human Nutrition listing is treated as one subject. The prototype should not silently merge distinct religious studies, language, or applied subjects; each should remain a separate selectable subject with its own official source link.

## Curriculum prototype verification

The visible `Mitaala / Curriculum` route loads from the lightweight `curriculum-catalog.json` file without opening the settings modal. The O-Level tab displayed 29 official subjects and the A-Level tab displayed 30 official subjects. Each card showed form range, publication date, category, an `Open syllabus` link to the official TIE PDF, and a `Study this subject` action.

Selecting the A-Level Tourism card handed the learner into the existing learning workspace with the context `TOURISM • A-Level • V–VI • Official TIE syllabus`. The topic field was prefilled with a subject-aware prompt, and a `Back to Curriculum` control was visible. Switching the interface rail to English showed that the new route and handoff support English without opening a modal; the visible page still has a few legacy workspace labels to be translated in a later polish pass if needed.

The selected A-Level Tourism handoff generated a learner result with the existing bilingual text-first content and a source-transparency block linking directly to the official TIE Tourism Form V–VI PDF. The result remained text-first and did not request new media. The English interface rail could be changed while the result was open, and the official TIE source notice remained visible.

## Bilingual curriculum and low-bandwidth test

The browser test loaded the Curriculum route, displayed 29 O-Level subjects and 30 A-Level subjects, switched the interface from Kiswahili to English, selected A-Level, chose the Both-language session mode, and generated a result with Kiswahili and English panes. The source transparency card retained the official TIE PDF link for Tourism Form V–VI. No audio or syllabus PDF was fetched while generating the text-first result.

The browser performance check reported `curriculum-catalog.json` at 16,376 encoded bytes and a cached `transferSize` of 0 for the current session. The browser reported `navigator.connection.downlink` of 0.4 Mbps, `effectiveType` of `4g`, `saveData: false`, and `rtt: 0`. This indicates that the lightweight catalog is suitable for low-data delivery, but it is not evidence of a full offline mode because the current prototype has no service worker or persistent PDF cache yet.

## Offline implementation verification

The local prototype registered `sw.js` successfully under `http://127.0.0.1:4173/`, gained an active service-worker controller, and created IndexedDB database `elimu-ai-offline` version 1. The browser reported caches for `elimu-shell-2026-08-13-1` and `elimu-catalog-2026-08-13-1`; the catalog cache contained `curriculum-catalog.json`, and IndexedDB contained one catalog record with all 59 entries. The storage estimate reported approximately 167,680 bytes in Cache Storage and 19,506 bytes in IndexedDB during the test.

A temporary local fixture was successfully written to the `topicPacks` and `sessions` object stores; the service worker created an `offline-text` cache entry for the topic pack; and the temporary records were removed after verification. JavaScript syntax checks passed for `sw.js`, `offline-store.js`, and the inline prototype script. The current implementation intentionally does not persist opaque cross-origin PDF responses; production PDF downloads must use a rights-aware same-origin gateway with validators, checksums, and resumable range support.
