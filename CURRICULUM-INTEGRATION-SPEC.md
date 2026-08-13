# Elimu AI Curriculum Integration Specification

**Version:** 1.0
**Prepared by:** Manus AI
**Scope:** Tanzanian O-Level Forms I–IV and A-Level Forms V–VI academic syllabuses

## 1. Purpose and boundary

Elimu AI will provide a curriculum discovery and learning layer linked to official Tanzanian Institute of Education (TIE) syllabus documents. The initial inventory contains **59 official syllabus documents: 29 O-Level entries and 30 A-Level entries** collected from the official TIE lower-secondary and upper-secondary academic syllabus indexes [1] [2].

This is a **source-grounded curriculum knowledge layer**, not a claim that the base language model has been retrained on every PDF. The production system should ingest each official document on the server, extract its structure, index the text, and retrieve only the relevant syllabus passages when generating an explanation, study plan, quiz, or revision note.

## 2. Curriculum scope

| Level | Tanzanian forms | Official inventory | Primary use |
|---|---|---:|---|
| O-Level | Forms I–IV | 29 official documents | Subject discovery, topic revision, competence-based study, Form IV preparation |
| A-Level | Forms V–VI | 30 official documents | Subject combinations, advanced topic study, Form VI preparation, university readiness |

The official source registry stores the direct PDF URL, index-page URL, publication date, level, form range, subject title, category, and ingestion status. The direct source must remain visible to the learner in any curriculum-derived answer.

## 3. Learning taxonomy

The platform must model a syllabus as a hierarchy rather than as a flat PDF:

```text
Level
└── Form range
    └── Subject
        └── Strand / area of learning
            └── Topic
                └── Specific objective or competence
                    └── Learner activity
                        ├── Explanation
                        ├── Worked example
                        ├── Key terms
                        ├── Practice question
                        └── Feedback and revision
```

Each topic should preserve its official wording and a learner-friendly explanation. Kiswahili and English are separate representations of the same objective, not two independent copies of a lesson.

## 4. Curriculum entities

| Entity | Required fields |
|---|---|
| `CurriculumSource` | `id`, `level`, `forms`, `subject`, `category`, `published`, `sourceUrl`, `indexUrl`, `checksum`, `retrievedAt`, `status` |
| `SyllabusDocument` | `sourceId`, `fileType`, `pageCount`, `language`, `rawTextUri`, `extractionVersion` |
| `SyllabusSection` | `sourceId`, `sectionId`, `heading`, `pageStart`, `pageEnd`, `officialText`, `language` |
| `LearningArea` | `sourceId`, `areaId`, `title`, `titleSw`, `order` |
| `Topic` | `areaId`, `topicId`, `title`, `titleSw`, `officialObjective`, `competence`, `order` |
| `LearningRepresentation` | `topicId`, `language`, `summary`, `examples`, `keyTerms`, `modelVersion`, `reviewStatus` |
| `PracticeItem` | `topicId`, `type`, `question`, `answerGuide`, `difficulty`, `languageVariants` |
| `LearnerProgress` | `userId`, `topicId`, `status`, `lastViewedSection`, `quizScore`, `updatedAt` |

## 5. Source governance

The TIE document is the authority for syllabus scope and official wording. Elimu AI may simplify, translate, exemplify, or create practice activities, but it must not silently rewrite an official objective as though the rewrite were the official curriculum.

Every curriculum answer should expose a compact source label such as **Official TIE syllabus · Form V–VI · Physics · 2023**, with a link to the official PDF. When the parser cannot locate a relevant passage, the assistant should say that the answer is a general explanation and invite the learner to open the official source.

The ingestion pipeline should calculate a checksum for each PDF, keep the retrieval timestamp, and re-check the TIE index periodically. A changed source creates a new document version rather than overwriting the old one. Human review is required before a changed or low-confidence extraction is used in exam-preparation content.

## 6. Bilingual and low-data behavior

The curriculum catalog loaded by the prototype is intentionally lightweight metadata. It contains subject names, level, forms, category, publication date, and source links. The full PDFs and extracted topic text must not be loaded on the home page.

When a learner selects a subject, the client sends only the source ID and requested language to the production API. The server retrieves the relevant topic section and returns the requested representation. Switching between Kiswahili and English reuses the same `topicId`, source passage, embeddings, and media assets. Only the missing text variant is requested.

| User action | Client request | Heavy media behavior |
|---|---|---|
| Browse syllabus | Lightweight catalog metadata | None |
| Open subject | Source ID and level | No PDF download unless learner selects the official document |
| Learn a topic | Topic ID, language, level, mode | Text-first response |
| Switch language | Existing topic ID plus missing language | No duplicate audio/video |
| Listen | Existing topic ID plus selected voice/language | Explicit data estimate before generation |
| Download | Selected text or media representation | Never automatic |

## 7. Curriculum learner journey

The learner opens **Mitaala / Curriculum**, selects O-Level or A-Level, searches a subject, filters by category, and opens a subject card. The card shows the form range, official publication date, a source link, and a **Jifunze mada / Study a topic** action.

The study handoff opens the existing learner workspace with the selected subject attached as context. The learner then chooses a topic after structured extraction is available, or can begin with a source-linked subject overview in the prototype. The learning result includes explanation, key terms, an example, practice, progress, and source transparency.

## 8. Production ingestion pipeline

```text
TIE index monitor
      ↓
PDF downloader with checksum and retention policy
      ↓
Text extraction + page/heading detection
      ↓
Structure normalisation: areas → topics → objectives
      ↓
Human review queue for low-confidence sections
      ↓
Search index + embeddings + language representations
      ↓
Retrieval with source citation and learner-level explanation
```

The parser must preserve page references. A retrieval record should include `sourceId`, `pageStart`, `pageEnd`, `officialText`, and `retrievedAt` so that a learner or teacher can verify the answer.

## 9. API additions

| Endpoint | Purpose |
|---|---|
| `GET /v1/curriculum/catalog` | Return filtered lightweight subject metadata |
| `GET /v1/curriculum/subjects/:id` | Return subject overview and available structured sections |
| `GET /v1/curriculum/subjects/:id/topics` | Return topic and objective metadata with pagination |
| `POST /v1/curriculum/topics/:id/learning-session` | Create a text-first learning session grounded in a syllabus topic |
| `POST /v1/curriculum/topics/:id/variant` | Request the missing Kiswahili or English representation |
| `GET /v1/curriculum/sources/:id` | Open source metadata, citation, checksum, and official URL |
| `POST /v1/curriculum/feedback` | Report incorrect extraction, translation, or objective mapping |

## 10. Prototype implementation

The static prototype should first implement the curriculum discovery layer using `curriculum-catalog.json`. It should provide:

- A visible **Mitaala / Curriculum** route outside the settings modal.
- O-Level and A-Level tabs.
- Subject search and category filtering.
- Official source links with publication dates.
- A subject-to-learning-session handoff that preserves the existing bilingual and text-first controls.
- A disclosure that the prototype catalog is source-linked and that full topic extraction will be connected through the production ingestion service.

The prototype must not pretend that every PDF has already been parsed into topic-level training data. This distinction protects learners from false confidence and keeps the implementation legally and technically honest.

## 11. Acceptance criteria

The curriculum capability is ready for the prototype milestone when the catalog loads lazily, displays 29 O-Level and 30 A-Level entries, filters without a network request after loading, opens official TIE links in a new tab, and hands a selected subject into the learner workspace with level and source context preserved.

The production curriculum capability is ready only when each source has a checksum, page-aware extraction, reviewed topic mapping, bilingual representation coverage, source citation, update monitoring, and a safe fallback for missing or uncertain sections.

## References

[1]: https://www.tie.go.tz/publications/syllabus-for-lower-secondary-academics "Tanzania Institute of Education, lower-secondary academic syllabus index"

[2]: https://www.tie.go.tz/publications/syllabus-for-upper-secondary-education "Tanzania Institute of Education, upper-secondary academic syllabus index"
