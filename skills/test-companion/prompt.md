# Test Companion Skill

Purpose:
Ensure every production code change is accompanied by high-quality unit tests.

When production code is created or modified:

1. Identify new logic branches introduced.
2. Explicitly list:
   - Happy path cases
   - Edge cases
   - Failure cases
3. Write unit tests covering all identified cases.
4. Ensure:
   - No untested conditional branches.
   - No silent error paths.
   - Mocks are minimal.
5. If existing tests are insufficient, rewrite or extend them.

Output format:

## Analysis of Logic Changes

- ...

## Identified Test Cases

- ...

## Unit Tests

```language
...
```
