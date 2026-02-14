# Skills Registry

Platform-managed skill registry for coding agents.

> Status: experimental v0.1. APIs and manifest fields may evolve.

## What this is

This repository is a standalone source of truth for reusable agent skills. A runtime can discover skills, resolve a specific version, verify checksums, and load the instruction payload.

## Why this exists

- Keep skill authoring separate from product repositories.
- Version and validate skills consistently.
- Expose a simple API that any runtime can consume.
- Make behavior reproducible via explicit version pinning.

## Quick start

1. Install dependencies

```bash
npm install
```

2. Validate manifests

```bash
npm run validate
```

3. Build index

```bash
npm run build:index
```

4. Start local API

```bash
npm run start
```

Server defaults to `http://localhost:8787`.

## API

- `GET /health`
- `GET /skills`
- `GET /skills/:name`
- `GET /skills/:name/:version`

### Example

```bash
curl http://localhost:8787/skills
curl http://localhost:8787/skills/react-performance
curl http://localhost:8787/skills/react-performance/1.0.0
```

## Getting started for consumers

### 1) Resolve latest skill metadata

```bash
curl -s http://localhost:8787/skills/react-performance | jq
```

### 2) Resolve a pinned version

```bash
curl -s http://localhost:8787/skills/react-performance/1.0.0 | jq
```

### 3) Verify integrity (example flow)

```bash
SKILL_JSON="$(curl -s http://localhost:8787/skills/react-performance/1.0.0)"
CHECKSUM="$(printf '%s' "$SKILL_JSON" | jq -r '.checksumSha256')"
echo "Expected checksum: $CHECKSUM"
```

Clients should recompute and compare checksums for the canonical payload they load.

## Add a new skill

1. Create a new folder: `skills/<skill-name>/`
2. Add `skill.json`, `prompt.md`, and `README.md`
3. Ensure `skill.json.name` matches the folder name
4. Run validation and rebuild the index

```bash
npm run validate
npm run build:index
```

5. Commit the changes

## Folder structure

```text
skills-registry/
  skills/
    api-hardening/
      skill.json
      prompt.md
      README.md
    react-performance/
      skill.json
      prompt.md
      README.md
  schemas/
    skill.schema.json
  scripts/
    build-index.mjs
    validate-skills.mjs
  registry/
    server.mjs
  index.json
```

## Publishing model

- Skills are authored in `skills/*`.
- CI validates manifests and rebuilds `index.json`.
- `index.json` acts as the canonical catalog for runtime discovery.

## Security model (current)

- Each published version includes a SHA-256 checksum in `index.json`.
- Clients should verify downloaded manifest + instruction content against this checksum.
- Signature-based verification can be layered on top in a future release.
