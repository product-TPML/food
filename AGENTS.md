# Project instructions

- Keep shared project instructions in this file. `CLAUDE.md` imports it using `@AGENTS.md`; update this file instead of maintaining duplicate instructions.
- Use subagents when necessary for independent research, implementation, or review. Give each a bounded task, avoid conflicting edits, and review their results before integrating them.
- Write modular, maintainable code with clear responsibilities. Reuse existing patterns and helpers; avoid unnecessary abstractions, dependencies, or frameworks.
- Fix root causes in the owning code. Do not layer patchwork overrides, duplicate CSS rules, replacement functions, or wholesale file overwrites over existing behavior. Read the affected code and callers first, then make focused edits and remove superseded logic.
- Follow the sibling Dasara and Deepawali projects' plain HTML, JavaScript, and CSS setup, publisher configuration, fonts, logos, and CMS integration patterns.
- Preserve DH and PV identities and use native Kannada content for PV. Do not invent recipe quantities, timings, yields, or missing instructions.
- Keep fetched source content separate from editorial selections and recipe transformations. Record source URLs, story IDs, retrieval dates, and unresolved editorial questions.
- Current scope: implementation of the local preview was requested on 2026-11-16 (DH and PV landing pages plus one tabular-recipe page, static JSON data). Do not deploy or publish pages without user authorization.
- Verify changes with checks appropriate to their impact. Never push, publish, or change external content without user authorization.
