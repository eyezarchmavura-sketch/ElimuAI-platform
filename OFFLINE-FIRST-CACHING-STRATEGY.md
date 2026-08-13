# Elimu AI Offline-First Caching Strategy

**Version:** 1.0
**Prepared by:** Manus AI
**Scope:** Tanzanian O-Level and A-Level syllabus documents, licensed textbook content, bilingual learning text, and low-connectivity learner workflows

## 1. Executive design

Elimu AI should use a **text-first, user-controlled offline model**. The application shell and lightweight curriculum catalog are cached automatically. Official syllabus PDFs and textbook packages are **not** downloaded automatically; a learner or teacher explicitly selects **Save for offline** for a subject, topic, or book. This protects mobile data, limits storage pressure, and avoids implying that every document is available for offline use.

A service worker provides the offline application shell and cache-first navigation for versioned static assets [1]. IndexedDB stores searchable metadata, learner progress, extracted text blocks, language variants, download manifests, and sync queues because it is intended for significant structured data and files/blobs [2]. The Cache API stores HTTP request/response pairs, while large user-selected files may be stored as blobs in IndexedDB or OPFS depending on the production browser support target [3].

> **Core rule:** Cache the smallest useful unit first: catalog metadata, then a topic text block, then a chapter, and only then an entire PDF when the learner explicitly requests it.

## 2. Content classes and cache policy

| Content class | Default behavior | Offline store | Refresh policy | Data policy |
|---|---|---|---|---|
| App shell: HTML, CSS, JS, icons | Precache on install | Cache Storage | Versioned deploy; activate new cache after validation | Automatic, small |
| Curriculum catalog | Precache or stale-while-revalidate | Cache Storage plus IndexedDB index | Check manifest version on launch | Automatic, about 16 KB in current prototype |
| TIE source metadata | Cache with catalog | IndexedDB | Refresh weekly or when manifest version changes | Automatic, tiny |
| Syllabus topic text | Cache after learner opens or pins a topic | IndexedDB | Revalidate by source checksum | User-driven, text-first |
| Full syllabus PDF | Never automatic | IndexedDB/OPFS or controlled Cache Storage | Revalidate with ETag/checksum | User-driven, show size first |
| Licensed textbook chapter | Never automatic | IndexedDB/OPFS | Revalidate by book edition and chapter hash | User-driven, rights-controlled |
| Bilingual representation | Cache selected language first; add second language on request | IndexedDB | Version by topic, language, model, and source checksum | Text-only variant; no duplicate media |
| Audio | Never automatic | IndexedDB/OPFS | Replace only when voice or language changes | Explicit opt-in with size estimate |
| Learner progress and notes | Write locally first | IndexedDB | Queue encrypted sync when online | Very small; no media required |

Cross-origin PDF links should not be cached directly from the browser unless the origin supplies the required CORS headers and stable validators. Production should expose a same-origin, rights-aware document gateway such as `/v1/content/sources/:id/file`, which verifies the TIE URL, records the source checksum, enforces access policy, and returns `ETag`, `Last-Modified`, `Accept-Ranges: bytes`, and a size header.

## 3. Service-worker architecture

The service worker should use separate versioned caches so that application updates do not invalidate learner-selected documents:

```text
elimu-shell-v{release}      HTML, CSS, JS, icons, offline fallback
elimu-catalog-v{manifest}   curriculum-catalog.json and source metadata
elimu-text-v{content}       small text responses and topic summaries
elimu-media-v{policy}       explicitly pinned PDFs, books, and audio only
```

The installation phase should precache only the shell and catalog. The activation phase should delete obsolete shell/catalog caches while preserving the media cache unless its content manifest has expired or the learner chooses **Clear downloaded content**. Navigation requests use cache-first with a network fallback. Catalog requests use stale-while-revalidate so that the learner sees the existing catalog immediately while a new manifest is downloaded in the background.

The service worker must never make a cross-origin request for every card in the subject catalog. The catalog contains source metadata and a link; the PDF is fetched only when the learner opens or pins it. This keeps the current 16 KB catalog behavior intact.

## 4. Offline content manifest

Every downloaded item receives a manifest entry:

```json
{
  "contentId": "a-tourism-2025",
  "sourceId": "tie-tourism-form-v-vi-2025",
  "type": "syllabus-pdf",
  "level": "A",
  "forms": "V–VI",
  "language": "en",
  "edition": "2025",
  "url": "/v1/content/sources/tie-tourism-form-v-vi-2025/file",
  "etag": "\"source-etag\"",
  "sha256": "sha256:...",
  "sizeBytes": 0,
  "downloadedBytes": 0,
  "status": "not-started",
  "lastVerifiedAt": null,
  "lastUsedAt": null,
  "licenseStatus": "verified",
  "pinned": false
}
```

The actual byte count should be filled from the server before download. The UI should show **estimated size**, available storage, download progress, pause/resume, and a clear warning when a source is not licensed for offline copying. The learner can keep a text-only offline pack even when the original PDF cannot be redistributed.

## 5. Syllabus PDF and textbook download flow

The preferred flow is:

1. The learner opens a subject or topic and sees a **Save for offline** control.
2. Elimu AI requests a small manifest containing size, checksum, edition, language, rights, and whether range requests are supported.
3. The learner chooses **Text only**, **Selected chapter/topic**, or **Full PDF/book**.
4. The server sends a resumable download. If the response advertises `Accept-Ranges: bytes`, the client saves chunks and resumes with `Range` and `If-Range`; a successful partial response is `206 Partial Content` [4].
5. The client verifies the final SHA-256 checksum before marking the content `ready`.
6. The learner sees the content in the offline library with source title, edition, date, and storage size.
7. The next online check uses ETag or checksum. If the source changed, Elimu AI keeps the old copy available until the learner accepts the new version.

If the server does not support ranges, the UI must disable pause/resume for that item and offer a smaller text-only or chapter package. The client must never concatenate chunks from different document versions; `ETag` or checksum validation prevents this.

## 6. Bilingual content without duplicate downloads

Kiswahili and English should share one canonical content identity:

```text
sourceId + sectionId + edition + representationVersion
```

A topic record can contain two language fields, but the app only downloads the requested language representation. When a learner switches from Kiswahili to English, the app checks IndexedDB for the English variant. If it is absent, it requests the small text variant while retaining the same source passage, PDF, and audio asset. The app must not download a second PDF or a second copy of the same textbook chapter merely because the learner changed interface language.

A bilingual offline pack should therefore contain one source reference, one extracted text block, and zero or more language representations. A media asset is shared by default; translated audio is treated as a separate, explicit asset only when the learner requests it.

## 7. Textbook rights and safety controls

Textbook caching is conditional on distribution rights. Elimu AI may cache full textbook files only when the publisher, school, government programme, or rights holder permits local offline storage. Otherwise, the platform should cache licensed excerpts, topic embeddings, learner notes, or a server-issued encrypted package with an expiry policy.

The content manifest must include `licenseStatus`, `rightsHolder`, `allowedOffline`, `maximumOfflineDays`, and `attribution`. The offline library should visibly distinguish **Official source**, **Licensed textbook**, **Teacher-provided content**, and **Learner notes**. The model must not present generated explanations as the textbook itself.

## 8. Storage budgets and eviction

Browser storage quotas and eviction differ by browser and device. Browser data is generally best-effort unless persistent storage is requested, and storage can be evicted under pressure [3]. Elimu AI should therefore expose a storage manager instead of assuming that a downloaded file will remain forever.

| Budget tier | Suggested default | Allowed content |
|---|---:|---|
| Minimal | 25 MB | Shell, catalog, progress, notes, selected topic text |
| Standard | 250 MB | Minimal tier plus several chapter text packs and one or two small PDFs |
| Extended | 1 GB, after explicit consent | Multiple subject packs and selected full documents |

Before an offline download, the app should call `navigator.storage.estimate()` and display used and available estimates. It should request persistent storage only after the learner explicitly pins content and understands the storage request. When space is low, the app should remove unpinned least-recently-used media first, then expired text variants, while preserving progress, notes, and the catalog. The learner must be able to see and undo deletion only while the file remains in the browser's recycle window; otherwise the app should clearly state that deletion requires re-download.

## 9. Sync and connectivity states

The app should represent four states rather than a binary online/offline label:

| State | Learner experience |
|---|---|
| Connected | Full catalog refresh, source validation, AI requests, and optional downloads |
| Limited | Text-first requests, no automatic media, resumable downloads only after confirmation |
| Offline with cache | Open cached subjects, topic text, saved sessions, notes, and pinned content |
| Offline without cache | Show catalog shell and explain what can be opened after reconnecting; never show a false result |

Progress, notes, quiz attempts, and feedback reports should be written locally first and queued in an IndexedDB `syncQueue`. When connectivity returns, the app sends small JSON batches. Conflicts use a last-write-wins policy for preferences and append-only events for learner activity. PDF or textbook data must never be reuploaded as part of progress sync.

## 10. Observability and acceptance tests

The production team should measure shell cache hit rate, catalog bytes, topic text bytes, median time to first text, download pause/resume success, checksum failures, offline open success, storage eviction rate, and data consumed per completed study session. Metrics must avoid recording sensitive learner text by default.

The offline milestone is accepted when a first-time learner can load the shell and catalog under a 0.4 Mbps connection, select a subject without fetching any PDF, pin a topic text pack, close the browser, reopen without connectivity, read the pinned text, switch to an already-cached language without network access, and resume a partially downloaded document after reconnecting. The current prototype already demonstrates the lightweight catalog and bilingual text path; the service-worker, IndexedDB, rights gateway, and resumable file layers remain production work.

## References

[1]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers "MDN: Using Service Workers"

[2]: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API "MDN: IndexedDB API"

[3]: https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria "MDN: Storage quotas and eviction criteria"

[4]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Range_requests "MDN: HTTP range requests"
