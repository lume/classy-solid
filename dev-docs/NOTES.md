# classy-solid Implementation Notes

Central index of developer-facing documentation in `packages/classy-solid/dev-docs/`.
Read this first when starting a coding session in this package — it links to design
docs and plans, and records the conventions this package follows.

These are for devs and agents. User-facing documentation is the package
[`README.md`](../README.md).

---

## Index

### Architecture / Plans

| File                                         | Description                                                                                                                                                                                                                                                                                                                                             |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`1-lazy-memo-plan.md`](1-lazy-memo-plan.md) | Lazy, lifecycle-managed memos. `createLazyMemo` primitive; `Effectful.createMemo`/`createWritableMemo`; `@memo` and `memoify()` rebuilt on one Effectful-owned path; pre-finalization reads throw. **Steps 1–6 implemented and verified.** §6 records what implementation taught us that the plan did not anticipate. Step 7 (downstream Lume) pending. |

---

## Conventions

- Plan docs live here, numbered `<N>-<topic>.md` in creation order. Add each new
  doc to the index above with a one-line description.
- Mark plan Step items `✅` / `- [x]` the moment they land; keep the header
  status line truthful. The doc is the single source of truth for what is done.
- When implementation diverges from a plan, do not silently edit the plan to
  match. Add a dated "Implementation notes" section stating what the plan
  assumed, what turned out to be true, and which test now covers it.
- `npm test` (`lume test`) runs the **built** `dist/` — it does not build first.
  Run `npm run build` before `npm test` or you test stale code.
- Every claim in the README that describes runtime behavior (examples, gotchas,
  "this throws") must have a matching test in `src/**/*.test.ts`.
