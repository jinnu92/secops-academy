# SecOps Academy

**A free, open-source, gamified DevSecOps learning platform.** Take a complete beginner through to production-ready with interactive simulated labs, real-terminal verification, quizzes, a practice terminal, and structured learning paths.

Built for the cybersecurity community. No backend. No signup. Runs entirely in your browser.

---

## What Is This?

SecOps Academy is a single-page React application that teaches DevSecOps through a 5-step hybrid learning system:

1. **Learn** -- Theory with real-world breach examples and key concepts
2. **Simulate** -- Interactive in-browser labs with a file browser, simulated terminal, and follow-up questions that force you to read output and think
3. **Execute** -- Step-by-step instructions to run the real tools on your machine
4. **Verify** -- Prove you actually ran the tools by answering questions only real output can answer
5. **Quiz** -- Knowledge checks (3/5 to pass, 5/5 for bonus XP)

This is not a video course. This is not a slide deck. You type commands, read output, analyze findings, and answer questions. Active learning.

---

## What You'll Learn

### 28 Modules Across 5 Learning Paths

| Path | Topics | Difficulty |
|------|--------|------------|
| **DevSecOps Fundamentals** | DevSecOps concepts, CI/CD pipelines, OWASP Top 10, Docker, Dockerfiles, Git security | Beginner |
| **Security Scanning & Testing** | Gitleaks, TruffleHog, Semgrep (SAST), Trivy/Grype (SCA), Container scanning, OWASP ZAP (DAST), Checkov (IaC) | Beginner-Intermediate |
| **CI/CD Pipeline Security** | Jenkins, GitLab CI, GitHub Actions, security gates, full pipeline design | Intermediate |
| **Advanced DevSecOps** | HashiCorp Vault, Kubernetes security, OPA/Rego, SonarQube, SBOM/SLSA supply chain, Falco runtime security | Advanced |
| **Interview Prep & Scenarios** | 20 interview Q&A, incident response scenarios, architecture frameworks | All Levels |

### 19 Hands-On Labs

Each lab is a guided, multi-step scenario with a realistic simulated environment -- not a dumb fake terminal. You browse files with embedded vulnerabilities, type commands, see realistic output that references the actual files, and answer follow-up questions.

### Tools Covered

Gitleaks, TruffleHog, Semgrep, Trivy, Grype, Hadolint, OWASP ZAP, Checkov, KICS, HashiCorp Vault, OPA/Rego, Conftest, SonarQube, Docker, kubectl, Kind, Jenkins, GitLab CI, GitHub Actions

---

## Features

- **56 terminal commands** with realistic mock output in the practice terminal
- **15 terminal challenges** with hints and explanations
- **140 quiz questions** with explanations for every answer
- **XP and ranking system** (Recruit to Elite across 8 ranks)
- **10 unlockable badges** (First Scan, Secret Keeper, Academy Graduate, etc.)
- **Streak tracking** with daily login tracking
- **Intel reference** -- searchable tool cheat sheets, comparison tables, framework summaries, interview quick reference
- **Dark hacker terminal theme** -- monospace everything, terminal green on black
- **Progress saved locally** -- uses localStorage, no account needed
- **Path gating** -- complete fundamentals before advancing to intermediate/advanced
- **Fully offline** -- no API calls, no backend, no telemetry

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- npm (comes with Node.js)

### Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/secops-academy.git
cd secops-academy

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Production Build

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

The production build outputs to `dist/` -- deploy it to any static hosting (GitHub Pages, Netlify, Vercel, Cloudflare Pages).

---

## Deploy to GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

Or use GitHub Actions -- push to `main` and deploy `dist/` to Pages.

---

## Project Structure

```
secops-academy/
├── src/
│   ├── main.jsx              # Entry point + localStorage polyfill
│   └── index.css             # Tailwind base styles
├── secops-academy.jsx        # Entire application (single-file React component)
├── index.html                # HTML shell
├── vite.config.js            # Vite config
├── tailwind.config.js        # Tailwind config
├── postcss.config.js         # PostCSS config
├── package.json              # Dependencies and scripts
├── LICENSE                   # MIT License
└── README.md                 # This file
```

The entire app lives in `secops-academy.jsx` -- one file containing all 28 modules, 19 labs, 140 quiz questions, 56 terminal commands, 15 challenges, the Intel reference, gamification system, and all UI components.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [React 18](https://react.dev/) | UI framework |
| [Vite](https://vitejs.dev/) | Build tool and dev server |
| [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first styling |
| [Lucide React](https://lucide.dev/) | Icons |
| localStorage | Progress persistence (no backend) |

Zero backend. Zero API calls. Zero tracking. Everything runs in the browser.

---

## How It Works

### Learning Flow

```
Path 1 (Fundamentals) --> Path 2 (Scanning) --> Path 3 (CI/CD) --> Path 4 (Advanced)
                                                                          |
Path 5 (Interview Prep) -- always unlocked, do in parallel ---------------+
```

Paths unlock sequentially. Complete all modules in Path 1 to unlock Path 2, and so on. Path 5 (Interview Prep) is always available.

### Gamification

| Action | XP |
|--------|---:|
| Complete simulation (Path 1 module) | 80 |
| Complete simulation (Path 2 module) | 120 |
| Complete simulation (Path 3 module) | 150 |
| Complete simulation (Path 4 module) | 200 |
| Complete simulation (Path 5 module) | 100 |
| Real execution verified | +30% bonus |
| Quiz passed (3/5+) | +20% bonus |
| Quiz perfect (5/5) | +50 bonus |
| Terminal command mastered | +5 |
| Terminal challenge completed | +30 |

### Ranks

| XP | Rank |
|---:|------|
| 0 | Recruit |
| 200 | Cadet |
| 500 | Analyst |
| 1000 | Operator |
| 2000 | Specialist |
| 3500 | Engineer |
| 5000 | Architect |
| 6500+ | Elite |

---

## Screens

| Screen | Description |
|--------|-------------|
| **Dashboard** | Progress overview, stats, recommended next module, badges |
| **Paths** | 5 learning paths with expandable module lists and completion tracking |
| **Labs** | Filterable gallery of all 19 hands-on labs by difficulty, tool, and category |
| **Terminal** | Practice terminal with 56 commands (free practice) and 15 challenges |
| **Intel** | Searchable tool reference, SAST/DAST/SCA comparison tables, framework summaries, interview cheat sheet |
| **Profile** | Callsign, rank, XP breakdown, badge showcase, stats, reset option |

---

## Contributing

Contributions are welcome. Some ideas:

- **Add modules** -- More tools (Snyk, Dependabot, Falco rules, Terraform), more scenarios
- **Add quiz questions** -- Expand beyond 5 per module
- **Add terminal commands** -- More tools and flags
- **Improve simulations** -- More realistic output, more steps, branching scenarios
- **Add themes** -- Light mode, different color schemes
- **Add i18n** -- Translations for non-English speakers
- **Mobile improvements** -- Better responsive layout for phones

### How to Add a Module

Modules are defined in the `MODULES` object in `secops-academy.jsx`. Each module has:

```javascript
'X.Y': {
  id: 'X.Y',
  pathId: N,           // Which path (1-5)
  title: 'Module Title',
  baseXP: 100,
  hasSim: true,        // Has simulation?
  hasExecute: true,    // Has real execution steps?
  hasVerify: true,     // Has verification questions?
  theory: {
    sections: [
      { heading: 'Section Title', content: 'Text...', highlight: false }
    ]
  },
  simulation: {
    title: 'Lab Title',
    scenario: 'Description...',
    files: { /* file tree */ },
    steps: [
      { objective: '...', command: '...', output: '...', followUp: '...', answer: '...', hint: '...' }
    ]
  },
  execute: {
    intro: 'Instructions...',
    commands: [
      { cmd: 'command here', desc: 'What it does' }
    ]
  },
  verify: ['Question 1?', 'Question 2?'],
  quiz: [
    { q: 'Question?', opts: ['A', 'B', 'C', 'D'], answer: 1, explanation: 'Why B is correct.' }
  ]
}
```

---

## License

MIT -- free to use, modify, and distribute. See [LICENSE](LICENSE).

---

## Credits

Built by **the SecOps Academy community** for the cybersecurity community.

If this helped you learn DevSecOps or prepare for a security role, star the repo and share it with your team.

---

**Start learning:** `npm install && npm run dev`
