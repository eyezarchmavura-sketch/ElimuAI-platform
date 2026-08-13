# Elimu AI Production TIE PDF-to-JSON Ingestion Pipeline

**Version:** 1.0
**Prepared by:** Manus AI
**Scope:** Tanzanian Institute of Education O-Level Forms I–IV and A-Level Forms V–VI syllabus PDFs

## 1. Purpose and boundary

This pipeline converts official Tanzania Institute of Education syllabus documents into **versioned, page-aware, source-linked JSON records** that Elimu AI can use for curriculum discovery, retrieval-grounded explanations, bilingual representations, practice generation, and progress tracking. The official TIE index pages are the source registry for the lower-secondary and upper-secondary syllabus collections [1] [2].

The pipeline creates a structured knowledge layer; it does not silently retrain a language model on the PDFs. The model receives only the relevant, reviewed syllabus sections at learning-session time. Official wording and generated learner support remain separate fields.

## 2. Source inventory and identity

The source collector begins with the two TIE index pages and follows their document links. Each document is assigned a stable `sourceId` derived from level, normalized subject, form range, and a source URL fingerprint. The URL itself is not sufficient as a permanent identity because a source can be replaced at the same URL.

```text
sourceId = tie:{level}:{subjectSlug}:{forms}:{documentFingerprint}
versionId = {sourceId}:{sha256}
```

The registry must retain the original URL, index URL, publication date as shown by TIE, retrieval timestamp, HTTP validators, SHA-256 checksum, content length, document title, level, forms, category, language, and ingestion status.

## 3. End-to-end pipeline

```text
TIE index collector
      ↓
URL normalisation + source registry
      ↓
HTTP fetch with size, type, validator, and checksum capture
      ↓
PDF safety validation and immutable raw-file storage
      ↓
Text extraction with page boundaries
      ↓
OCR fallback for image-only pages
      ↓
Header/footer removal + Unicode normalisation
      ↓
Section, topic, objective, competence, and table detection
      ↓
Structured JSON normalisation
      ↓
Rule checks + schema validation + source-page checks
      ↓
Human review queue for uncertain mappings
      ↓
Search index, embeddings, bilingual representations
      ↓
Published curriculum API and offline manifests
```

Each stage writes an immutable artifact and a machine-readable status event. A failed stage must stop publication for that document version without deleting the previously published version.

## 4. Stage responsibilities

| Stage | Input | Output | Gate |
|---|---|---|---|
| Index collection | TIE HTML index pages | `source-registry.json` | All document links are absolute, deduplicated, and attributable to an index page |
| Fetch | Source URL | Raw PDF, response metadata | HTTPS, expected content type, bounded size, checksum recorded |
| PDF validation | Raw PDF | Validated source record | PDF parses, page count is positive, no unexpected executable payloads |
| Extraction | Validated PDF | Page text and layout hints | Page numbers remain aligned with extracted text |
| OCR fallback | Image-only pages | OCR text with confidence | OCR confidence is recorded and low-confidence pages are reviewable |
| Normalisation | Page text | Clean page blocks | Repeated headers/footers removed without removing syllabus content |
| Structure detection | Clean blocks | Areas, topics, objectives, competences | Each node retains source page start/end |
| JSON build | Structured nodes | Versioned document JSON | JSON Schema validation and referential integrity pass |
| Review | Candidate JSON | Reviewed JSON | Low-confidence nodes and changed versions are approved |
| Publish | Reviewed JSON | API/index/search records | Only `published` versions are queryable by learner sessions |

## 5. Canonical JSON document

The JSON is designed for both provenance and learner retrieval. It keeps official text, learner-facing representations, and generated practice in different namespaces.

```json
{
  "schemaVersion": "1.0",
  "source": {
    "sourceId": "tie:a-level:tourism:v-vi:abc123",
    "versionId": "tie:a-level:tourism:v-vi:abc123:sha256:...",
    "level": "A",
    "forms": "V–VI",
    "subject": "TOURISM",
    "subjectSw": "UTALII",
    "category": "Technology",
    "published": "2025-04-25",
    "sourceUrl": "https://www.tie.go.tz/uploads/documents/…pdf",
    "indexUrl": "https://www.tie.go.tz/publications/syllabus-for-upper-secondary-education",
    "retrievedAt": "2026-08-13T00:00:00Z",
    "sha256": "sha256:…",
    "pageCount": 0,
    "status": "published"
  },
  "document": {
    "title": "TOURISM FOR FORM V–VI",
    "language": "en",
    "extractionVersion": "extractor-1.0.0",
    "rawTextUri": "s3://elimu-raw/tie/…pdf",
    "pageTextUri": "s3://elimu-derived/tie/…/pages.jsonl"
  },
  "learningAreas": [
    {
      "areaId": "area-001",
      "title": "Introduction to Tourism",
      "titleSw": "Utangulizi wa Utalii",
      "order": 1,
      "pageStart": 8,
      "pageEnd": 14,
      "topics": [
        {
          "topicId": "topic-001",
          "title": "Meaning and scope of tourism",
          "titleSw": "Maana na upeo wa utalii",
          "order": 1,
          "officialObjectives": [
            {
              "objectiveId": "obj-001",
              "officialText": "…",
              "competence": "…",
              "pageStart": 9,
              "pageEnd": 10,
              "confidence": 0.94,
              "reviewStatus": "approved"
            }
          ],
          "representations": {
            "sw": {"status": "pending", "summary": null, "keyTerms": []},
            "en": {"status": "pending", "summary": null, "keyTerms": []}
          },
          "practice": []
        }
      ]
    }
  ]
}
```

## 6. Extraction and structure heuristics

The first extractor should use deterministic signals before any language model assistance. It should detect page headings through font size and typography when layout data is available, then fall back to numbered headings and all-caps lines. It should recognise common syllabus labels such as `OBJECTIVES`, `COMPETENCE`, `CONTENT`, `SUBTOPIC`, `TEACHING AND LEARNING STRATEGIES`, `ASSESSMENT`, and `REFERENCES` without assuming that every subject uses the same order.

Tables should be preserved as row/column records where possible. If a table cannot be reliably reconstructed, store its raw page block and create a review item rather than flattening cells into misleading prose. Repeated page headers and footers should be identified using frequency across pages and removed only when the same string appears in a consistent page margin region.

Image-only pages should enter an OCR branch. OCR text must carry `extractionMethod: "ocr"`, page-level confidence, and a review status. The pipeline must not silently treat low-confidence OCR as authoritative curriculum wording.

## 7. LLM-assisted structure mapping

LLM assistance is permitted only after deterministic extraction and only for bounded tasks: classifying a candidate heading, mapping an objective to a topic, proposing Kiswahili labels, or identifying a likely competence. The LLM receives a page-limited block and must return schema-constrained JSON with confidence and evidence spans. It must not invent missing text.

A candidate mapping is publishable only when it passes deterministic checks and either exceeds the configured confidence threshold or is approved by a human reviewer. The original page text remains the source of truth.

## 8. Quality gates

The pipeline must fail closed at publication. Required checks include:

| Check | Required condition |
|---|---|
| Source integrity | SHA-256 of stored bytes matches the registry record |
| PDF integrity | File parses and page count is stable |
| Page provenance | Every official objective and topic has valid page start/end |
| JSON Schema | Entire document validates against the current schema |
| Referential integrity | Every topic points to an existing learning area; every representation points to a topic |
| Coverage | No large extracted page span is silently absent; gaps are reported |
| Duplicate detection | Similar source documents are flagged for review rather than merged automatically |
| Review threshold | Low-confidence mappings and changed source versions are not published automatically |
| Citation readiness | Retrieval records include source ID, version ID, page range, and source URL |

A coverage report should include total pages, pages with text, pages using OCR, headings detected, objectives detected, topics produced, unresolved blocks, average confidence, and review queue count.

## 9. Versioning and update monitoring

A scheduled collector checks TIE index pages for new or changed links. For every URL, the fetcher uses `ETag` or `Last-Modified` when available, then verifies the final SHA-256. A changed checksum creates a new immutable `versionId`. The previously published version remains available for existing learner sessions until the new version passes review.

The source registry should expose `discovered`, `downloaded`, `extracted`, `needs-review`, `approved`, `published`, `superseded`, and `failed` statuses. A failure should include an error code, retry count, last attempted time, and responsible stage.

## 10. Production storage and API

Recommended storage separation:

| Artifact | Store | Retention |
|---|---|---|
| Raw source PDFs | Object storage with immutable version key | Retain all published versions subject to rights policy |
| Page text and extraction artifacts | Object storage or document store | Retain per extraction version |
| Source registry and structured JSON | Relational/document database | Retain published and current review versions |
| Search index and embeddings | Search/vector service | Rebuildable from approved JSON |
| Review tasks | Relational database | Audit trail retained |
| Learner offline packs | Controlled content gateway + client cache | Rights and expiry policy |

The curriculum API should expose lightweight catalog metadata separately from topic retrieval:

```text
GET  /v1/curriculum/catalog
GET  /v1/curriculum/subjects/:subjectId
GET  /v1/curriculum/subjects/:subjectId/topics?page=1
GET  /v1/curriculum/sources/:sourceId
POST /v1/curriculum/topics/:topicId/learning-session
POST /v1/curriculum/topics/:topicId/variant
POST /v1/curriculum/feedback
```

Every learning-session response should include a `provenance` array containing `sourceId`, `versionId`, `pageStart`, `pageEnd`, `officialTextExcerpt` where permitted, `sourceUrl`, and `retrievedAt`.

## 11. Operations and observability

Measure source discovery lag, fetch success rate, extraction success rate, OCR share, review queue age, objective/topic coverage, citation completeness, checksum failures, version supersession rate, and time from TIE update to published learner source. Do not log learner questions or textbook contents by default. Store pipeline logs with document IDs and stage outcomes rather than raw educational text.

## 12. Initial implementation sequence

1. Run the existing TIE collector against both official index pages and freeze the 59-document manifest.
2. Add immutable fetch metadata and SHA-256 checksums to each registry item.
3. Extract page-aware text and generate coverage reports for a representative sample across science, humanities, languages, and practical subjects.
4. Add deterministic heading/table/objective heuristics and JSON Schema validation.
5. Add an OCR branch and review queue for image-only or low-confidence pages.
6. Add bounded LLM-assisted mapping only for candidate structure, translation labels, and confidence-scored suggestions.
7. Publish reviewed JSON to the curriculum API and expose source citations to the learner workspace.
8. Connect the offline manifest to only `published` and rights-approved records.

## References

[1]: https://www.tie.go.tz/publications/syllabus-for-lower-secondary-academics "Tanzania Institute of Education lower-secondary academic syllabus index"

[2]: https://www.tie.go.tz/publications/syllabus-for-upper-secondary-education "Tanzania Institute of Education upper-secondary academic syllabus index"
