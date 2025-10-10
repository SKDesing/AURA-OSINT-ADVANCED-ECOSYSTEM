# Documentation Consolidation System

## Quick Start

**Dry-run** (preview consolidated documents):
```bash
bash scripts/docs/execute-md-consolidation.sh
```

**Apply** (create consolidated docs and archive sources):
```bash
bash scripts/docs/execute-md-consolidation.sh --apply
```

## What it does

1. **Reads mapping** from `docs/_meta/md-consolidation-map.yml`
2. **Consolidates** multiple .md files into domain-specific documents:
   - Architecture → `docs/architecture/AURA-ARCHITECTURE.md`
   - Security Audits → `docs/audits/SECURITY-AUDITS-2024.md`
   - Migration logs → `docs/migration/REORG-MIGRATION-LOG.md`
   - Release planning → `docs/release/RELEASE-PLAN.md`
   - Roadmaps → `docs/roadmap/ROADMAP.md`
   - Technical reports → `docs/reports/TECHNICAL-REPORTS.md`
   - Executive summaries → `docs/marketing/EXECUTIVE-SUMMARY.md`

3. **Preserves provenance** with GitHub links and commit hashes
4. **Archives sources** to `docs/archive/` after consolidation

## Files created

- `docs/architecture/DOCS-CONSOLIDATION-DIRECTIVES.md` - Full methodology
- `docs/_meta/md-consolidation-map.yml` - Source → target mapping
- `scripts/docs/concat-md.sh` - Concatenation script with provenance
- `scripts/docs/execute-md-consolidation.sh` - Main execution script

## Next steps

1. Run dry-run to preview consolidated documents
2. Review generated files in `docs/_build/`
3. Apply consolidation when satisfied
4. Open PR: "docs(consolidation): fusion .md par domaine + archives"