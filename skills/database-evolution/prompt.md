# Schema Evolution Skill

Purpose:
Safely propose and apply database schema changes.

When a feature requires DB modification:

1. Analyze existing schema from `/ai/context/database.md`.
2. Determine if the change requires:
   - New table
   - Column addition
   - Constraint update
   - Index addition
   - Migration
3. Explicitly evaluate:
   - Backward compatibility
   - Data migration risk
   - Production impact
4. Generate a migration file.
5. Do not apply destructive changes automatically.
6. Require explicit confirmation before applying changes.

Output:

## Schema Analysis

...

## Proposed Migration

SQL:

...

## Risk Assessment

...

## Rollback Plan

...
