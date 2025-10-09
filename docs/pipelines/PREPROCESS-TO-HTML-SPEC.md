# AURA – Spécification pipeline prétraitement → Artefact HTML/CSS/JS

## Entrée
Document brut (texte/HTML), meta source (url, ts, author?), optional tags.

## Étapes
1. **Normalize**(html|txt) → text_clean, sections, headings
2. **MaskPII**(text) → text_masked, entities[]
3. **Segment**(text_masked) → chunks[]
4. **ScoreAndFilter**(chunks) → top_sentences per chunk
5. **Deduplicate**(chunks) → simhash drop rate
6. **SummarizeExtractive**(chunks) → summary per chunk
7. **BuildArtifact**(sections, summary, entities) → index.html, styles.css, app.js, meta.json
8. **Persist**(artifact) → DB

## Artefact (normes)
- **index.html**
  - `<header>` (title, lang, hashes)
  - `<nav>` anchors sections
  - `<main>` cards (section → summary, toggle full text)
- **styles.css**
  - DS tokens: --color-bg, --spacing-*, --radius-*
- **app.js**
  - Toggle, search-in-page, copy entity lists
- **meta.json**
  - `{ version, lang, source_hash, context_hash, entities, chunks, simhashes, build_ms }`

## Stockage (Postgres)
- table `artifacts(id uuid pk, source_url text, version text, lang text, hash text, context_hash text, html bytea, css bytea, js bytea, meta jsonb, created_at timestamptz)`
- index `idx_artifacts_hash(hash)`, `idx_artifacts_context(context_hash)`

## APIs
- `POST /ops/orchestrator/run { task:"build-artifact", source:{url|content} }`
- `GET /ops/orchestrator/artifacts?id`
- `GET /artifacts/:id/index.html` (serve)
- `GET /artifacts/:id/meta.json`