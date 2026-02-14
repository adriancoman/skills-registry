# Skills Registry

Platform-managed skill registry for coding agents.

## What this is

This repository hosts versioned skills in a standalone source of truth. A runtime can query the registry API, resolve a skill by name/version, verify checksums, and load the instructions.

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
