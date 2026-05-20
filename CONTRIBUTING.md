# Contributing to AI Against Parkinson's

Thank you for your interest in contributing! This is a public benefit project built and maintained by a caregiver for families navigating Parkinson's disease.

## Development Setup

```bash
git clone https://github.com/tylerdotai/parkinson-research.git
cd parkinson-research
npm install
npm run dev
```

Visit http://localhost:3000

## Development Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Local dev server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm test` | Jest tests |
| `npm run build` | Production build |

CI runs: lint → typecheck → test → build

## How to Contribute

### Bug Reports
Open a GitHub issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your environment (Node version, OS)

### Feature Requests
Open a GitHub issue labeled "enhancement". Describe:
- The problem you're solving
- Who it helps
- How you envision it working

### Pull Requests

1. Fork the repo
2. Create a branch: `git checkout -b fix/your-bug` or `git checkout -b feat/your-feature`
3. Make your changes
4. Run checks: `npm run lint && npm run typecheck && npm test && npm run build`
5. Commit with a clear message: `git commit -m "fix: resolve subscribe form validation bug"`
6. Push and open a PR

**PR titles** follow [Conventional Commits](https://www.conventionalcommits.org/):
- `fix:` — bug fix
- `feat:` — new feature
- `docs:` — documentation only
- `refactor:` — code refactoring
- `test:` — adding or updating tests
- `chore:` — maintenance tasks

### What We're Looking For

**Welcome contributions**:
- Content improvements (clearer writing, fewer jargon)
- New research source additions (must be credible: PubMed, NIH, FDA, major universities, MJFF)
- Translation improvements (EN + ES)
- UI/UX refinements
- Accessibility improvements
- Test coverage

**Not this**:
- Adding new dependencies without discussion
- Changing the report format (4 sections is intentional)
- Medical claims or advice (we don't do that)
- Unverified sources or "alternative medicine" claims

## Content Standards

- No invented facts — cite every claim
- Plain language — write for families, not researchers
- No cure/reversal/guarantee language
- Credible sources only: PubMed, NIH, FDA, MJFF, major universities

## Questions?

Open a GitHub issue or contact: tyler@aiagainstparkinson.com
