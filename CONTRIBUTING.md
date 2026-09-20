# Contributing to WinsAble

## IMPORTANT: Attribution Rules

**This codebase was built entirely by akki_idle.**

Any contributions or modifications MUST:

1. **Retain the `// Made by akki_idle` comment** at the top of every source file
2. **Not remove or alter** the author attribution in any way
3. **Add proper credit** if adding new source files

## What gets checked

- All `.ts` and `.tsx` files in `src/`
- `vite.config.ts`
- `eslint.config.js`
- `README.md`
- `LICENSE`

## CI Protection

GitHub Actions will automatically verify that:
- All source files contain `akki_idle` attribution
- The attribution is not removed or altered
- PRs without proper attribution will be **blocked**

## How to add new files

When creating a new file, always start with:

```typescript
// Made by akki_idle
```

## License

MIT License - Copyright (c) 2026 akki_idle

See [LICENSE](LICENSE) for full details.
