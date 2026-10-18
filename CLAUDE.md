# Project rules

You are an expert in Quasar, VueJS, Typescript.
For the api we use LiteAPI by Nuitee (https://docs.liteapi.travel, sandbox) for hotel content, rates and bookings; a LiteAPI-shaped mock adapter backs tests. The api key is in .env.development file (`LITEAPI_KEY`).

## Conventions

- Use atomic design to project scaffolding combined with Feature-Sliced Design (FSD) for Frontend. For the UI shared components, use `ui/atoms` and `ui/molecules` (domain-agnostic).
- Use Onion and Ports & Adapters architecture for the data layer: domain types and repository interfaces (ports) stay free of Supabase; Supabase-backed adapters implement them. Same applies to any future backend (edge functions).
- Use arrow functions from and latest features of ECMAScript language specification for typescript and Javascript. If some methods are not compatible or recommended for arrow functions, use ordinary method declararion.

## Frontend structure (FSD + atomic design)

Layers in `src/`, each one imports only from the layers below it (enforced by ESLint `no-restricted-imports`):

- `app/` — App.vue, boot files, router, Pinia setup, layouts (templates), global styles. Wired via `sourceFiles`, `boot` and `css` (with `~` prefix) in `quasar.config.ts`.
- `pages/<slice>/ui/` — route pages.
- `widgets/<slice>/ui/` — organisms (header, hero, cart drawer, audit panel…).
- `features/<slice>/{ui,model}/` — user actions (switch locale, admin product form, bulk price…).
- `entities/<slice>/{ui,model,api}/` — business entities: product, cart, order, customer, session.
- `shared/` — `ui/atoms`, `ui/molecules` (domain-agnostic components), `lib/`, `api/` (Supabase client + generated types), `i18n/`.

## Data layer (Ports & Adapters)

- Port: interface + `InjectionKey` + `useXRepository()` in `entities/<slice>/model/ports.ts`. Domain types live in `model/`, never DB rows.
- Adapter: `entities/<slice>/api/supabase-*.ts`, a `createSupabaseX(client)` factory. Row types, column lists and row↔domain mappers live in `api/*-rows.ts`.
- Composition root: `src/app/boot/repositories.ts` provides every adapter (first boot file).
- Consumers call `useXRepository()` inside `setup` (components or Pinia setup stores). Tests pass in-memory fakes via `setupPiniaWith(provision(KEY, fake))` from `shared/lib/testing`, and adapter tests pass a fake client to the factory.
- Enforced by ESLint: `model/`, `ui/`, features, widgets, pages and shared (except `shared/api`) cannot import `entities/*/api`, `shared/api` or `@supabase/*`. Adapters cannot import the `supabase` instance.

# Code Quality

- Write self-documenting code — names over comments
- Keep functions under 30 lines
- Co-locate tests next to the files they test
- Use JSDoc for documentation frontend
- Use Prettier for code formatting
- Use ESLint for code linting
- Use Playwright for testing

## Testing

- Unit: Vitest, `*.test.ts` next to the file (`pnpm test`).
- E2E: Playwright, `*.e2e.ts` next to the page or feature they cover; shared support (data, sessions, Mailpit, seed/cleanup) in `e2e/` (`pnpm test:e2e`, needs `supabase start`).
- E2E data is self-contained: users `e2e-*@example.test`, products `E2E-*`, categories `e2e-*`, created by global setup with the service role and deleted in setup and teardown. Never reset or touch other local data.
- Sessions are minted without email (`generateLink` + `verifyOtp`) into `e2e/.auth/*.json`; only the login spec uses the real OTP email via Mailpit.

## Git & GitHub
- Feature branch workflow: feature branches merge into `develop` via PR; `develop` merges into `main` once verified.
- Always use conventional commit messages.
- Never commit .env files.
- Never commit secrets.
