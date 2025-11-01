# Open in IDE – Developer Notes

Internal reference for building, testing, and releasing the plugin. Keep the public README focused on user-facing documentation.

## Environment & tooling

- Node.js: current LTS (Node 18+ recommended).
- npm for dependency management.
- esbuild for bundling (`esbuild.config.mjs`).
- TypeScript 4.7.x, `obsidian` type definitions, Vitest 0.34 for unit coverage.

## Local development

```bash
npm install
npm run dev        # watch mode (esbuild)
```

Reload the plugin in Obsidian via **Settings → Community plugins** whenever `main.js` changes.

### Unit tests

Vitest 0.34 (compatible with the Node 16 type definitions shipped here).

```bash
npm run test
```

Tests live in `__tests__/launcher/commandBuilder.test.ts` and verify the Cursor CLI argument construction helper.

## Manual QA checklist

- With a Cursor window already open on the vault, run the command → window remains and the target note is focused.
- With Cursor closed, run the command → new window opens, vault loads, note is focused.
- Paths containing spaces or iCloud-style prefixes resolve correctly.
- Toggle **Open vault before file** off → command still opens the current note.
- Set an invalid executable path → notice appears and no crash occurs.
- Disable **Allow system fallback** → command fails gracefully when the CLI is missing.
- When possible, test fallbacks on macOS (`open`), Windows (`start`), and Linux (`xdg-open`).

## Release workflow

1. Update version numbers in `manifest.json`, `package.json`, and `versions.json`.
2. Run `npm run build` to produce `main.js`.
3. Package `main.js`, `manifest.json`, and `styles.css` (if present) as release artifacts.
4. Update `CHANGELOG.md` and README screenshots/usage notes.
5. Tag the release (`git tag <version>`), push the tag, and create the GitHub release with the artifacts attached.

## Planned CI/CD pipeline

1. **Branch strategy** – use feature branches; merge to a staging branch (e.g., `develop`), then promote to `main` for releases.
2. **GitHub Actions** – on push/tag:
   - `npm install`
   - `npm run test`
   - `npm run build`
   - Upload artifacts as workflow outputs.
3. **Release automation** – on tag:
   - Create GitHub release, attach artifacts.
   - Optionally open/update PR against `obsidianmd/obsidian-releases` with the new `manifest.json`.
4. **Secrets** – store GitHub tokens needed for releases and community plugin submissions.

## Additional references

- Obsidian sample plugin: <https://github.com/obsidianmd/obsidian-sample-plugin>
- API documentation: <https://docs.obsidian.md>
- Developer policies & plugin guidelines: <https://docs.obsidian.md/Developer+policies>
- Plugin submission workflow: <https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines>
