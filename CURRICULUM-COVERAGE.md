# Elimu AI Curriculum Coverage

This manifest links the learner interface to official Tanzanian Institute of Education syllabus documents. It is a source registry and curriculum navigation layer; it is not a claim that the base language model has been retrained on the PDFs.

| Level | Forms | Official documents |
|---|---|---:|
| O-Level | I–IV | 29 |
| A-Level | V–VI | 30 |

## Category coverage

| Category | O-Level | A-Level | Total |
|---|---:|---:|---:|
| agriculture | 1 | 1 | 2 |
| arts | 3 | 3 | 6 |
| business | 2 | 2 | 4 |
| humanities | 2 | 3 | 5 |
| languages | 7 | 6 | 13 |
| mathematics | 2 | 2 | 4 |
| other | 3 | 4 | 7 |
| religious studies | 1 | 1 | 2 |
| science | 5 | 4 | 9 |
| sport | 1 | 1 | 2 |
| technical and applied | 2 | 3 | 5 |

## Source and model boundary

Every item retains an official TIE PDF URL, publication date, index page, level, and form range. The production retrieval layer should fetch and parse the linked PDF on the server, chunk it by subject/topic/competence, create embeddings or a searchable text index, and cite the originating PDF in each learning answer. The prototype uses the manifest to provide source-linked subject discovery and a safe handoff into a learner session.

## References

[1]: https://www.tie.go.tz/publications/syllabus-for-lower-secondary-academics "TIE lower-secondary academic syllabus index"
[2]: https://www.tie.go.tz/publications/syllabus-for-upper-secondary-education "TIE upper-secondary academic syllabus index"
