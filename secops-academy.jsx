import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Shield, Terminal, BookOpen, Trophy, ChevronRight, ChevronDown, Copy, Check,
  Lock, Unlock, Star, Flame, User, Search, ExternalLink, Play, Award, Target,
  Zap, Database, Server, GitBranch, FileCode, AlertTriangle, CheckCircle,
  XCircle, BarChart3, Clock, ArrowRight, RefreshCw, Menu, X, Eye, EyeOff,
  Folder, File, Hash, Brain, Map, Layers
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
    color: '#00ff41', desc: 'Build your foundation — Docker, Git, CI/CD concepts, and the security mindset.',
    moduleIds: ['1.1','1.2','1.3','1.4','1.5','1.6'], prerequisite: null,
  },
  {
    id: 2, name: 'Security Scanning & Testing', icon: '🎯', difficulty: 'Beginner-Intermediate',
    color: '#00d4ff', desc: 'Master the tools — secrets detection, SAST, SCA, container scanning, DAST, IaC.',
    moduleIds: ['2.1','2.2','2.3','2.4','2.5','2.6'], prerequisite: 1,
  },
  {
    id: 3, name: 'CI/CD Pipeline Security', icon: '🔀', difficulty: 'Intermediate',
    color: '#00d4ff', desc: 'Build secure pipelines — Jenkins, GitLab CI, GitHub Actions, full pipeline design.',
    moduleIds: ['3.1','3.2','3.3','3.4','3.5'], prerequisite: 2,
  },
  {
    id: 4, name: 'Advanced DevSecOps', icon: '⚡', difficulty: 'Advanced',
    color: '#ffb800', desc: 'Go deep — Vault, Kubernetes, OPA, SonarQube, supply chain, runtime security.',
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
    id: '1.1', pathId: 1, title: 'What is DevSecOps?', baseXP: 80,
    hasSim: false, hasExecute: false, hasVerify: false,
    theory: {
      sections: [
        { heading: 'The Evolution', content: 'Waterfall → Agile → DevOps → DevSecOps. Each solved a problem but security kept being an afterthought. DevSecOps makes security a first-class citizen embedded into every stage of the software development lifecycle.' },
        { heading: 'Shift Left', content: '"Shift Left" means moving security testing earlier in the development lifecycle. Finding a bug in design costs 1x, in development 6x, in testing 15x, in production 100x. The earlier you find and fix security issues, the cheaper and easier they are to address.', highlight: true },
        { heading: 'Three Pillars', content: 'People (security champions, shared responsibility), Process (automated gates, blameless postmortems), Technology (scanning tools, policy-as-code). All three must work together — you cannot buy your way to security with tools alone.' },
        { heading: 'DevSecOps Lifecycle', content: 'Plan → Code → Build → Test → Release → Deploy → Operate → Monitor. Security touchpoints exist at every single stage. Planning includes threat modeling. Coding includes IDE security plugins. Building includes SAST/SCA. Testing includes DAST. And so on.' },
        { heading: 'Why This Matters', content: 'Culture change is the hardest part. Tools are easy to install; getting developers to care about security is the real challenge. DevSecOps succeeds when security becomes everyone\'s job, not just the security team\'s.', callout: true },
        { heading: 'Real-World Example', content: 'The Equifax breach (2017) exposed 147 million records because a known vulnerability in Apache Struts went unpatched for months. An automated DevSecOps pipeline with SCA scanning would have flagged this dependency as vulnerable before deployment.', breach: true },
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
    id: '1.2', pathId: 1, title: 'Understanding CI/CD Pipelines', baseXP: 80,
    hasSim: false, hasExecute: false, hasVerify: false,
    theory: {
      sections: [
        { heading: 'Continuous Integration (CI)', content: 'Developers merge code to the main branch frequently. Each merge triggers automated build + tests. This catches integration issues early before they compound. The key rule: never leave the build broken.' },
        { heading: 'Continuous Delivery vs Deployment', content: 'Continuous Delivery: code is always in a deployable state, but deployment to production requires manual approval. Continuous Deployment: every passing build auto-deploys to production. Most teams start with Delivery and graduate to Deployment.', highlight: true },
        { heading: 'Pipeline Stages', content: 'Source (git push triggers) → Build (compile, Docker build) → Test (unit, integration) → Security Scan (this is where DevSecOps lives!) → Deploy (staging then production). Each stage is a quality gate.' },
        { heading: 'Pipeline as Code', content: 'Defining your pipeline in a file (Jenkinsfile, .gitlab-ci.yml, workflow YAML) that\'s version-controlled alongside your app code. This is critical — your pipeline IS code and should be reviewed like code.', highlight: true },
        { heading: 'Artifacts', content: 'Files produced by one stage and consumed by another — JARs, Docker images, test reports, security scan results. Artifacts make pipelines reproducible and auditable.' },
        { heading: 'Popular Tools', content: 'Jenkins (self-hosted, most flexible), GitLab CI (built-in if using GitLab), GitHub Actions (built-in if using GitHub). Each has tradeoffs in flexibility, ease of use, and ecosystem.' },
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
    id: '1.3', pathId: 1, title: 'Security Threats in Software Development', baseXP: 80,
    hasSim: false, hasExecute: false, hasVerify: false,
    theory: {
      sections: [
        { heading: 'OWASP Top 10 (2021)', content: 'A01 Broken Access Control — A02 Cryptographic Failures — A03 Injection — A04 Insecure Design — A05 Security Misconfiguration — A06 Vulnerable Components — A07 Authentication Failures — A08 Software & Data Integrity Failures — A09 Security Logging Failures — A10 Server-Side Request Forgery (SSRF). These are the most critical web application security risks.', highlight: true },
        { heading: 'Supply Chain Attacks', content: 'SolarWinds (2020): backdoor injected into build pipeline, 18,000 organizations affected including US government agencies. Log4Shell (2021): critical RCE in a logging library used by millions of Java apps. Codecov (2021): bash uploader modified to steal environment variables from CI systems.', breach: true },
        { heading: 'Secrets Leakage', content: 'Uber 2016: AWS keys committed to GitHub, 57 million records exposed. Samsung 2022: source code and credentials leaked. A single committed secret can compromise entire infrastructure within minutes — bots scan GitHub in real-time.', breach: true },
        { heading: 'Container Misconfigurations', content: 'Running as root, using the "latest" tag, exposed Docker socket, no resource limits, privileged mode enabled. These are the low-hanging fruit attackers check first when targeting containerized environments.' },
        { heading: 'Why This Matters', content: 'Understanding threats is the foundation of defense. You can\'t protect against what you don\'t understand. DevSecOps tools are designed to catch these specific categories of vulnerabilities automatically.', callout: true },
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
    id: '1.4', pathId: 1, title: 'Docker Fundamentals', baseXP: 80,
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'Containers vs VMs', content: 'Containers share the host OS kernel (lighter, faster startup) but have weaker isolation than VMs. Docker provides process isolation using Linux namespaces (what a process can see) and cgroups (what a process can use).' },
        { heading: 'Docker Architecture', content: 'Docker daemon (background service), Docker client (CLI you interact with), images (read-only templates built from Dockerfiles), containers (running instances of images), registries (Docker Hub, ECR, GCR — where images are stored and shared).', highlight: true },
        { heading: 'Image Layers', content: 'Each Dockerfile instruction creates a layer. Layers are cached and reused. Order matters for build speed — put rarely-changing instructions (like installing OS packages) before frequently-changing ones (like copying your source code).' },
        { heading: 'Base Image Security', content: 'python:3.12 (900MB, hundreds of packages, large attack surface) vs python:3.12-slim (150MB, minimal packages) vs python:3.12-alpine (50MB, musl libc, smallest attack surface). Smaller images = fewer vulnerabilities = easier to scan and secure.', highlight: true },
        { heading: 'Key Security Basics', content: 'Use specific version tags (never "latest" in production). Run as non-root user. Don\'t store secrets in images. Use .dockerignore. Set resource limits (memory and CPU). These are the basics every developer should know.' },
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
    id: '1.5', pathId: 1, title: 'Writing Secure Dockerfiles', baseXP: 80,
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'Dockerfile Instructions', content: 'FROM (base image), RUN (execute command during build), COPY (add files from host), WORKDIR (set working directory), EXPOSE (document port), USER (set runtime user), CMD/ENTRYPOINT (default command when container starts).' },
        { heading: 'Multi-Stage Builds', content: 'Use a large image to build your app (with compilers, dev tools), then copy only the compiled artifact into a tiny runtime image. This dramatically reduces image size and attack surface. A Go binary built in golang:1.22 can run in scratch (0 base packages).', highlight: true },
        { heading: 'Security Best Practices', content: '(1) Pin specific base image versions. (2) Use slim/distroless images. (3) Create and switch to a non-root user. (4) Never COPY secrets or .env files. (5) Use .dockerignore. (6) Minimize RUN layers. (7) Add HEALTHCHECK. (8) Don\'t install unnecessary packages with --no-install-recommends.', highlight: true },
        { heading: 'Bad vs Good Example', content: 'BAD: FROM ubuntu:latest, no USER directive, COPY . . (copies everything including .env), RUN chmod 777, no HEALTHCHECK.\nGOOD: FROM python:3.12-slim, RUN useradd -r appuser, COPY only needed files, USER appuser, HEALTHCHECK CMD curl -f http://localhost:5000/health.' },
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
    id: '1.6', pathId: 1, title: 'Git Security Basics', baseXP: 80,
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'Git and Security', content: 'Git remembers everything. Even "deleted" files exist in git history forever unless you rewrite history (which is complex and dangerous). This means secrets committed even once are permanently accessible to anyone who clones the repo.' },
        { heading: '.gitignore', content: 'Your first line of defense. Always create a .gitignore BEFORE your first commit. Include: .env, *.key, *.pem, credentials.json, config/secrets.*, node_modules/, __pycache__/. If a file was already tracked, .gitignore alone won\'t help — you must also remove it from tracking.', highlight: true },
        { heading: 'Git Hooks for Prevention', content: 'Git hooks are scripts that run automatically at specific points. Pre-commit hooks run before every commit and can block commits containing secrets. Tools like Gitleaks and pre-commit framework make this easy to set up.', highlight: true },
        { heading: 'Branching Strategies', content: 'Protected branches (main/develop) should require pull request reviews, passing CI checks, and no direct pushes. Branch protection rules are your enforcement mechanism.' },
        { heading: 'Why History Matters', content: 'Tools like TruffleHog scan the ENTIRE git history, not just current files. A secret committed 1000 commits ago and then deleted is still findable. This is why prevention (pre-commit hooks) is better than detection (scanning after the fact).', callout: true },
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
    id: '2.1', pathId: 2, title: 'Secrets Detection', baseXP: 120,
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'Types of Secrets', content: 'API keys, database passwords, JWT signing keys, private SSH keys, OAuth tokens, cloud credentials (AWS/GCP/Azure), encryption keys, service account tokens. Each type has different formats that scanners can pattern-match.' },
        { heading: 'How Secrets Leak', content: 'Committed to code repositories (most common), hardcoded in configuration files, embedded in Docker images, left in CI/CD logs, shared in Slack/email, stored in browser local storage. Each leak vector needs a different prevention strategy.', highlight: true },
        { heading: 'Prevention vs Detection', content: 'Prevention (pre-commit hooks, .gitignore) is always better than detection (scanning after commit). But detection is essential as a safety net — secrets still slip through. Defense in depth: both prevention AND detection.', callout: true },
        { heading: 'Tool Comparison', content: 'Gitleaks: fast, regex-based, great for CI/CD, pre-commit hooks. TruffleHog: entropy-based + regex, verified credentials (checks if secrets are still active), git history scanning. Both are essential in a complete secrets management strategy.' },
        { heading: 'Real-World Breach', content: 'Uber (2016): Two developers committed AWS credentials to a private GitHub repo. Attackers found the keys, accessed an S3 bucket containing 57 million rider/driver records. Uber paid the attackers $100K to delete the data and hide the breach. Later fined millions.', breach: true },
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
    id: '2.2', pathId: 2, title: 'SAST — Static Application Security Testing', baseXP: 120,
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'What is SAST?', content: 'Static Application Security Testing analyzes source code WITHOUT executing it. It reads your code like a very thorough code reviewer, looking for patterns that indicate vulnerabilities — SQL injection, command injection, XSS, insecure cryptography, and more.' },
        { heading: 'How SAST Works', content: 'AST (Abstract Syntax Tree) parsing to understand code structure, pattern matching against known vulnerability signatures, taint analysis to track user input flowing into dangerous functions. Different tools use different combinations of these techniques.', highlight: true },
        { heading: 'Strengths & Weaknesses', content: 'Strengths: finds code-level vulnerabilities, full coverage of codebase, runs early in pipeline, language-specific deep analysis.\nWeaknesses: high false positive rate, can\'t find runtime issues (misconfigurations, auth bypass), needs tuning per project.' },
        { heading: 'Semgrep vs Others', content: 'Semgrep: open-source, fast, custom rules in YAML, 30+ languages. SonarQube: enterprise, quality + security, dashboards. CodeQL: GitHub-native, semantic queries, deep analysis but slower. For DevSecOps pipelines, Semgrep is the go-to for its speed and flexibility.', highlight: true },
        { heading: 'SARIF Format', content: 'Static Analysis Results Interchange Format — the standard for exchanging security findings between tools. Upload SARIF to GitHub, GitLab, or VS Code to see findings inline with your code.' },
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
    id: '2.3', pathId: 2, title: 'SCA — Software Composition Analysis', baseXP: 120,
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'What is SCA?', content: 'Software Composition Analysis scans your project\'s dependencies — the open-source libraries and packages you use. It checks if any have known vulnerabilities (CVEs) listed in vulnerability databases like the National Vulnerability Database (NVD).' },
        { heading: 'Why SCA Matters', content: '80-90% of modern application code comes from open-source dependencies. You might write 10% of the code, but you\'re responsible for 100% of the security. One vulnerable dependency can compromise your entire application. Log4Shell affected millions of apps through a single library.', highlight: true },
        { heading: 'CVEs, CVSS, and NVD', content: 'CVE = Common Vulnerabilities and Exposures (unique IDs like CVE-2021-44228). CVSS = Common Vulnerability Scoring System (0-10 severity score). NVD = National Vulnerability Database (central registry). These are the standards that SCA tools use.', highlight: true },
        { heading: 'Direct vs Transitive Dependencies', content: 'Direct: packages you explicitly install (in package.json). Transitive: packages your dependencies depend on. You might have 20 direct dependencies but 500+ transitive ones. Vulnerabilities in transitive deps are just as dangerous but harder to spot.' },
        { heading: 'Tool Comparison', content: 'Trivy: fast, multi-target (fs, image, IaC), free. Grype: fast, Anchore-backed, good output. Snyk: commercial, fix PRs, IDE integration. npm audit: built-in for Node.js, basic but free.' },
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
    id: '2.4', pathId: 2, title: 'Container Image Scanning', baseXP: 120,
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'Why Scan Container Images?', content: 'Container images bundle your app with an OS and libraries. Each package can have vulnerabilities. An nginx image might have 40+ CVEs just from its base OS packages. Scanning images before deployment catches these before they reach production.' },
        { heading: 'Build-time vs Registry vs Runtime', content: 'Build-time: scan in CI/CD pipeline during image build. Registry: scan when pushed to container registry. Runtime: scan running containers for new CVEs. A complete strategy uses all three, but build-time is most critical for DevSecOps.', highlight: true },
        { heading: 'Base Image Selection', content: 'Your base image choice determines your vulnerability baseline. Full images (ubuntu, python:3.12) have hundreds of packages. Slim images (python:3.12-slim) have far fewer. Alpine images are smallest but use musl libc. Distroless images contain only your app runtime.', highlight: true },
        { heading: 'Dockerfile Linting vs Image Scanning', content: 'Hadolint checks your Dockerfile for best practice violations BEFORE building. Trivy scans the built IMAGE for known CVEs in installed packages. Both are needed — Hadolint catches process issues, Trivy catches vulnerability issues.' },
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
    id: '2.5', pathId: 2, title: 'DAST — Dynamic Application Security Testing', baseXP: 120,
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'What is DAST?', content: 'Dynamic Application Security Testing attacks a RUNNING application from the outside, just like a real attacker would. It sends malicious requests and observes responses to find vulnerabilities that only manifest at runtime.' },
        { heading: 'Passive vs Active Scanning', content: 'Passive: observes traffic and responses without modifying requests. Finds missing headers, information disclosure, cookie issues. Safe for production.\nActive: sends attack payloads (SQLi, XSS, fuzzing). Finds deeper vulnerabilities but can be destructive. Only use on test environments.', highlight: true },
        { heading: 'SAST vs DAST', content: 'SAST reads code, DAST tests the running app. SAST has full code visibility but high false positives. DAST has low false positives (it proves the vuln exists) but can\'t see code. SAST runs early (build time), DAST runs late (after deployment). Use both.', highlight: true },
        { heading: 'OWASP ZAP', content: 'The most popular open-source DAST tool. Three scan modes: Baseline (passive, 1 min), Full Scan (active, 10+ min), API Scan (targets API specs). Docker-based, CI/CD friendly, generates HTML/JSON/XML reports.' },
        { heading: 'When to Use DAST', content: 'After deploying to staging/QA environment. In CI/CD: run baseline (passive) on every build, full scan nightly or before release. Never run active scans against production or systems you don\'t own.' },
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
    id: '2.6', pathId: 2, title: 'IaC Security Scanning', baseXP: 120,
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'What is IaC?', content: 'Infrastructure as Code defines your cloud infrastructure in files — Terraform (.tf), CloudFormation (YAML/JSON), Kubernetes manifests (YAML), Ansible playbooks. If your infrastructure is code, it can be scanned for security issues just like application code.' },
        { heading: 'Common Misconfigurations', content: 'Public S3 buckets, overly permissive security groups (0.0.0.0/0), unencrypted databases, missing logging, no MFA, default credentials, privileged containers, missing network policies. These are the #1 cause of cloud breaches.', highlight: true },
        { heading: 'Compliance Frameworks', content: 'CIS Benchmarks (specific configuration baselines), SOC 2 (security controls), PCI DSS (payment card data), HIPAA (health data). IaC scanners can map findings to these frameworks for compliance reporting.', highlight: true },
        { heading: 'Tool Comparison', content: 'Checkov: comprehensive, 1000+ policies, multi-framework, free. KICS: Checkmarx-backed, good Dockerfile support. tfsec: Terraform-specific, fast, Aqua-backed. All three are excellent; Checkov is the most popular for multi-cloud.' },
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
    id: '3.1', pathId: 3, title: 'Jenkins Pipeline Fundamentals', baseXP: 150,
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'Jenkins Architecture', content: 'Jenkins is the most popular open-source CI/CD server. It uses a controller-agent architecture: the controller schedules jobs, the agents execute them. Plugins extend functionality (2000+ available). Jenkins can run almost anything.' },
        { heading: 'Jenkinsfile Structure', content: 'Declarative Pipeline: structured format with pipeline{}, agent{}, stages{}, steps{} blocks. Scripted Pipeline: full Groovy scripting, more flexible but harder to maintain. For DevSecOps, declarative is preferred for its readability and maintainability.', highlight: true },
        { heading: 'Key Concepts', content: 'Stages: logical groupings (Build, Test, Security, Deploy). Steps: individual commands within stages. Post: actions after stage/pipeline (success, failure, always). Environment: variables available to all stages. Credentials: secure storage for secrets.', highlight: true },
        { heading: 'Credentials Management', content: 'NEVER put credentials in Jenkinsfile. Use Jenkins credentials store: credentials("secret-id") injects at runtime. Types: Secret text, Username/Password, SSH key, Certificate. Reference in environment{} block with credentials() helper.' },
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
    id: '3.2', pathId: 3, title: 'Adding Security Gates to Jenkins', baseXP: 150,
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'Security Gates', content: 'A security gate is a checkpoint in your pipeline that evaluates security scan results and decides: pass or fail? Gates transform security scans from informational to actionable — the pipeline stops if quality standards aren\'t met.' },
        { heading: 'Hard Fail vs Soft Fail', content: 'Hard fail: pipeline stops and build is marked FAILED. Use for CRITICAL/HIGH findings. Soft fail: warning is logged but pipeline continues. Use for MEDIUM/LOW findings or during initial adoption when you want visibility without blocking.', highlight: true },
        { heading: 'Quality Gate Design', content: 'Start permissive, tighten over time. Month 1: log everything, fail on nothing. Month 2: fail on CRITICAL only. Month 3: fail on CRITICAL + HIGH. This lets teams adapt gradually without feeling blocked.', highlight: true },
        { heading: 'Maturity Model', content: 'Level 1: Manual security reviews. Level 2: Automated scans, results logged. Level 3: Automated scans with soft gates (warnings). Level 4: Hard gates on Critical/High. Level 5: Custom policies, SLA-based gates, exception workflow.' },
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
    id: '3.3', pathId: 3, title: 'GitLab CI/CD', baseXP: 150,
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'GitLab CI Architecture', content: 'GitLab CI is built into GitLab — no separate server needed. Pipelines are defined in .gitlab-ci.yml at the repo root. GitLab Runners execute jobs. Runners can be shared (GitLab-managed) or self-hosted (your servers).' },
        { heading: '.gitlab-ci.yml Structure', content: 'Define stages (ordered list), then jobs (belong to stages). Each job has: stage, script, artifacts, rules/only/except, image (Docker image to use). Jobs in the same stage run in parallel.', highlight: true },
        { heading: 'Built-in Security', content: 'GitLab has built-in security scanning templates: SAST, DAST, SCA, container scanning, secrets detection, license compliance. Include them with: `include: template: Security/SAST.gitlab-ci.yml`. Results show in Merge Request security widget.', highlight: true },
        { heading: 'Key Directives', content: 'artifacts:reports:sast — uploads SAST results to MR widget. allow_failure: true — soft gate (warning). when: manual — requires human click. needs: [job] — dependency between jobs. rules: — conditional execution.' },
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
    id: '3.4', pathId: 3, title: 'GitHub Actions', baseXP: 150,
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'GitHub Actions Concepts', content: 'Workflow: a YAML file in .github/workflows/. Triggered by events (push, pull_request, schedule). Contains jobs, which contain steps. Steps use actions (reusable packages from the Marketplace) or run shell commands.' },
        { heading: 'Key Features', content: 'Marketplace: 15,000+ pre-built actions. Matrix builds: test across OS/language versions. SARIF upload: native security findings display. Environments: approval gates for deployment. Secrets: encrypted storage.', highlight: true },
        { heading: 'SARIF Integration', content: 'Upload SARIF files with github/codeql-action/upload-sarif. Findings appear in the Security tab of your repo. PRs show security alerts inline. This is the native way to integrate security tools with GitHub.', highlight: true },
        { heading: 'Comparison', content: 'vs Jenkins: simpler YAML, less flexible, huge marketplace. vs GitLab CI: similar YAML approach, GitHub-native, slightly different semantics (needs vs stages). Best for: open-source projects, GitHub-centric teams.' },
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
    id: '3.5', pathId: 3, title: 'Building a Complete Pipeline', baseXP: 150,
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'End-to-End Architecture', content: 'A complete DevSecOps pipeline: Pre-commit (secrets) → Build (SAST, SCA, Dockerfile lint) → Test (unit, integration) → Image Build (container scan) → Staging (DAST) → Policy Gate → Production. Each stage adds a security layer.' },
        { heading: 'Tool Selection', content: 'Secrets: Gitleaks (pre-commit + CI). SAST: Semgrep (fast, multi-language). SCA: Trivy (multi-target). Container: Trivy + Hadolint. DAST: ZAP (after staging deploy). IaC: Checkov. This covers all attack vectors.', highlight: true },
        { heading: 'Scan Ordering', content: 'Fast scans first, slow scans later. Secrets detection (seconds) → SAST (minutes) → SCA (minutes) → Image scan (minutes) → DAST (5-30 min). This gives fast feedback on easy-to-fix issues.', highlight: true },
        { heading: 'Metrics', content: 'Track: MTTR (Mean Time to Remediate by severity), scan coverage (% of repos with scans), false positive rate (% findings that are noise), developer adoption (% using pre-commit hooks). These prove ROI.' },
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
    id: '4.1', pathId: 4, title: 'Secrets Management with Vault', baseXP: 200,
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'Why Secrets Management', content: 'Hardcoded secrets in code, environment variables, and config files are the #1 cause of breaches. A secrets manager provides centralized, audited, access-controlled storage for credentials.' },
        { heading: 'Vault Architecture', content: 'HashiCorp Vault: a secrets management tool that stores, generates, encrypts, and audits access to secrets. Core components: Storage Backend (where encrypted data lives), Barrier (encryption layer), Secrets Engines (generate/store secrets), Auth Methods (verify identity), Audit Devices (log all access).', highlight: true },
        { heading: 'Static vs Dynamic Secrets', content: 'Static secrets: stored values you put in (API keys, passwords). Dynamic secrets: generated on-demand with a TTL (database credentials, cloud tokens). Dynamic secrets are more secure — each consumer gets unique, short-lived credentials.' },
        { heading: 'Auth Methods & Policies', content: 'Auth methods verify identity: Token, AppRole (for machines), LDAP, OIDC, Kubernetes. Policies define what paths a token can access and what operations are allowed (read, write, list, delete). Principle of least privilege.', highlight: true },
        { heading: 'Secret Rotation', content: 'Secrets should be rotated regularly. Vault can auto-rotate dynamic secrets via TTLs. For static secrets, establish rotation schedules. Leaked secrets must be rotated immediately — revoke first, then rotate.' },
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
    id: '4.2', pathId: 4, title: 'Kubernetes Security', baseXP: 200,
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'The 4C Model of Cloud-Native Security', content: 'Code → Container → Cluster → Cloud. Each layer builds on the one below. If cloud infrastructure is compromised, all layers above are at risk. Security must be addressed at every level.' },
        { heading: 'Pod Security Standards', content: 'Three levels: Privileged (unrestricted, for system-level workloads), Baseline (prevents known privilege escalations), Restricted (heavily restricted, follows hardening best practices). Apply via namespace labels in K8s 1.25+.', highlight: true },
        { heading: 'RBAC — Role-Based Access Control', content: 'Control who can do what in the cluster. Roles define permissions (verbs on resources). RoleBindings attach roles to users/service accounts. Use ClusterRole/ClusterRoleBinding for cluster-wide permissions. Always follow least privilege.' },
        { heading: 'NetworkPolicies', content: 'By default, all pods can talk to all pods. NetworkPolicies restrict traffic: define ingress/egress rules per namespace/pod label. Essential for micro-segmentation and limiting blast radius.', highlight: true },
        { heading: 'Admission Controllers', content: 'Intercept requests to the K8s API before persistence. OPA Gatekeeper and Kyverno are popular policy engines. They can enforce: no privileged containers, approved image registries only, resource limits required, no host networking.' },
        { heading: 'CIS Benchmarks', content: 'CIS Kubernetes Benchmark provides a comprehensive security configuration guide. Tools like kube-bench and kubeaudit automate checks against these benchmarks.' },
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
    id: '4.3', pathId: 4, title: 'Policy as Code with OPA', baseXP: 200,
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'What is Policy as Code?', content: 'Writing security and compliance rules as code that can be version-controlled, tested, and automatically enforced. Instead of manual checklists, policies are executable and integrated into CI/CD pipelines.' },
        { heading: 'OPA & Rego', content: 'Open Policy Agent (OPA) is a general-purpose policy engine. Policies are written in Rego, a declarative query language. OPA takes JSON input, evaluates against policies, and returns decisions. Used for K8s admission, API authorization, Terraform validation, and more.', highlight: true },
        { heading: 'Gatekeeper', content: 'OPA Gatekeeper integrates OPA with Kubernetes as an admission controller. Uses ConstraintTemplates (define the policy logic) and Constraints (apply it to specific resources). Blocks non-compliant resources from being created.' },
        { heading: 'Conftest', content: 'Conftest uses OPA/Rego to test structured configuration files: Dockerfiles, Kubernetes YAML, Terraform HCL, CI configs. Run conftest test in CI to catch misconfigurations before deployment.', highlight: true },
        { heading: 'Use Cases', content: 'Common policies: only approved base images, no privileged containers, all resources must have labels, S3 buckets must be encrypted, no public security groups, Dockerfiles must use non-root USER. Each rule prevents a class of misconfiguration.' },
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
    id: '4.4', pathId: 4, title: 'SonarQube Deep Dive', baseXP: 200,
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'SonarQube vs Semgrep', content: 'SonarQube: full-featured code quality platform with a web dashboard, quality gates, and historical tracking. Semgrep: fast CLI-first scanner focused on security patterns. SonarQube excels at long-term code health tracking; Semgrep excels at fast CI security scans.' },
        { heading: 'Quality Profiles & Gates', content: 'Quality Profile: a set of rules activated for a language. Quality Gate: pass/fail conditions (e.g., 0 new critical bugs, 80% coverage on new code, < 3% duplication). Gates block merges if thresholds are not met.', highlight: true },
        { heading: 'Finding Categories', content: 'Bugs: code that is objectively wrong (null dereference, resource leak). Vulnerabilities: security-sensitive code (SQL injection, XSS). Code Smells: maintainability issues (long methods, deep nesting). Security Hotspots: security-sensitive code that needs manual review.', highlight: true },
        { heading: 'CI Integration', content: 'Integrate via sonar-scanner CLI or build plugins (Maven, Gradle, npm). Scanner sends analysis to SonarQube server. Results appear on dashboard. Use quality gates in CI to block PRs that introduce issues.' },
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
    id: '4.5', pathId: 4, title: 'Supply Chain Security', baseXP: 200,
    hasSim: true, hasExecute: true, hasVerify: true,
    theory: {
      sections: [
        { heading: 'Supply Chain Attacks', content: 'Attackers target upstream: SolarWinds (backdoored build pipeline, 18K orgs), Log4Shell (critical RCE in ubiquitous library), Codecov (modified bash uploader to steal env vars), ua-parser-js (npm package hijacked). One compromised dependency affects thousands.' },
        { heading: 'SBOM — Software Bill of Materials', content: 'An SBOM lists every component in your software: direct deps, transitive deps, OS packages, libraries. Formats: CycloneDX (OWASP, JSON/XML) and SPDX (Linux Foundation, widely adopted). Executive Order 14028 requires SBOMs for government software.', highlight: true },
        { heading: 'SLSA Framework', content: 'Supply-chain Levels for Software Artifacts. Levels: L0 (no guarantees), L1 (build process documented), L2 (signed provenance, hosted build service), L3 (hardened build platform, non-falsifiable provenance). Goal: ensure artifacts were built from the expected source by the expected process.', highlight: true },
        { heading: 'Image Signing', content: 'Sign container images to verify they haven\'t been tampered with. Cosign (from Sigstore) is the standard tool. Sign in CI after build, verify before deploy. Combined with admission controllers, only signed images can run in your cluster.' },
        { heading: 'Dependency Pinning & Reproducible Builds', content: 'Pin dependency versions exactly (lock files). Use hash verification. Reproducible builds ensure the same source always produces the same binary. This makes it possible to verify that a binary matches its source code.' },
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
    id: '4.6', pathId: 4, title: 'Runtime Security & Monitoring', baseXP: 200,
    hasSim: false, hasExecute: false, hasVerify: false,
    theory: {
      sections: [
        { heading: 'Shift Right — Runtime Security', content: 'Shift Left catches issues early; Shift Right detects threats at runtime. Both are needed. Runtime security monitors running containers, processes, network connections, and file access for suspicious behavior.' },
        { heading: 'Falco', content: 'Cloud-native runtime security tool. Uses kernel-level system call monitoring to detect anomalous behavior: unexpected process execution, file access outside allowed paths, network connections to unexpected destinations, privilege escalation attempts, container escape attempts.', highlight: true },
        { heading: 'Container Security Configs', content: 'Seccomp: restricts which system calls a container can make. AppArmor: restricts file access, network access, and capabilities. These are Linux kernel security modules that add defense-in-depth layers.', highlight: true },
        { heading: 'Security Logging', content: 'Log: authentication events, authorization decisions, privilege changes, network connections, file modifications, API calls. Ship logs to SIEM (Splunk, ELK, Datadog). Set alerts for anomalous patterns.' },
        { heading: 'Incident Response', content: 'NIST framework: Preparation → Detection → Containment → Eradication → Recovery → Post-Incident. Key: contain first (isolate affected systems), then investigate. Document everything. Blameless postmortem.' },
        { heading: 'Observability Stack', content: 'Metrics (Prometheus), Logs (Loki/ELK), Traces (Jaeger/Zipkin), Alerts (Alertmanager/PagerDuty). Combine with security-specific tools (Falco, audit logs) for a complete picture.' },
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
    id: '5.1', pathId: 5, title: 'Core Interview Questions', baseXP: 100,
    hasSim: false, hasExecute: false, hasVerify: false,
    theory: {
      sections: [
        { heading: 'Conceptual Questions', content: '1. What is DevSecOps? → DevOps with security embedded at every stage. Culture + automation, not a tool.\n\n2. Explain "Shift Left" → Moving security testing earlier (IDE, pre-commit, CI). Bugs cost 100x more in production.\n\n3. SAST vs DAST vs SCA vs IAST → SAST=static code, DAST=running app, SCA=dependencies, IAST=instrumented runtime.\n\n4. How do you measure success? → MTTR, scan coverage %, false positive rate, developer adoption rate.\n\n5. What is Policy as Code? → Security rules as executable code (OPA/Rego), version-controlled, automatically enforced.' },
        { heading: 'Technical Questions', content: '6. Design a pipeline → Pre-commit (secrets) → CI (SAST, SCA) → Build (image scan) → Staging (DAST) → Policy gate → Prod + monitoring.\n\n7. Handle critical CVE in prod → Assess exploitability → scope blast radius → patch + rebuild → deploy → monitor → postmortem.\n\n8. Choose between tools → Coverage, FP rate, language support, CI integration, speed, cost, community.\n\n9. Manage secrets in CI/CD → Never in code. Use Vault/cloud KMS → inject at runtime → short-lived tokens → rotate.\n\n10. Handle false positives → Tune rules, allowlists, severity-based filtering, track FP rate, custom org rules.', highlight: true },
        { heading: 'Behavioral Questions', content: '11. "Security slows us down" → Fast scans (parallel, incremental), IDE plugins, show prevented breaches, only block on critical.\n\n12. No security culture → Start small (secrets detection), security champions, lunch-and-learns, gamification, gradual enforcement.\n\n13. Prioritize 500 findings → Severity + exploitability + exposure + fix availability. Critical/High externally-facing first.\n\n14. Security vs deadline → Risk assessment, temporary compensating controls, documented exception with fix timeline.\n\n15. Staying current → Advisory feeds (NVD, GitHub), communities, tool mailing lists, periodic reassessment.', highlight: true },
        { heading: 'Your Unique Angle', content: '"I approach DevSecOps from an attacker\'s perspective. I know what adversaries look for — exposed secrets, vulnerable dependencies, misconfigured infrastructure — because I\'ve studied and tested for these. My pipelines are designed to catch what I would target as an attacker."' },
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
    id: '5.2', pathId: 5, title: 'Scenario — Secrets Leaked to GitHub', baseXP: 100,
    hasSim: false, hasExecute: false, hasVerify: false,
    theory: {
      sections: [
        { heading: 'The Scenario', content: 'A developer accidentally pushed AWS access keys to a public GitHub repository. Bots scan GitHub in real-time for credentials. You have minutes, not hours.' },
        { heading: 'Step 1: IMMEDIATE (Minutes)', content: '• Revoke the exposed AWS credentials in the AWS console immediately\n• Generate new credentials\n• Update any systems using the old credentials\n• Do NOT waste time trying to delete the commit first — bots already have it', highlight: true },
        { heading: 'Step 2: ASSESS (Hours)', content: '• Check CloudTrail for unauthorized API calls using the compromised keys\n• Check for new IAM users, roles, or policies created\n• Check for running EC2 instances, Lambda functions, or S3 access\n• Determine blast radius: what could these keys access?' },
        { heading: 'Step 3: SCAN (Same Day)', content: '• Run Gitleaks/TruffleHog on the entire repository history\n• Scan all other repos the developer has access to\n• Check if other secrets are embedded in the codebase' },
        { heading: 'Step 4: PREVENT (Week)', content: '• Install pre-commit hooks with Gitleaks\n• Add Gitleaks/TruffleHog to CI pipeline\n• Implement GitHub push protection\n• Move all secrets to Vault or AWS Secrets Manager\n• Establish secret rotation policy' },
        { heading: 'Step 5: PROCESS (Ongoing)', content: '• Blameless postmortem with the team\n• Document the incident and response\n• Create runbook for future secret leaks\n• Train team on secrets management\n• Review and update security policies' },
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
    id: '5.3', pathId: 5, title: 'Scenario — Critical CVE in Production', baseXP: 100,
    hasSim: false, hasExecute: false, hasVerify: false,
    theory: {
      sections: [
        { heading: 'The Scenario', content: 'A CVSS 9.8 critical RCE vulnerability is announced in a library your production services depend on. Multiple services are affected. Exploit code is public.' },
        { heading: 'Step 1: ASSESS (First Hour)', content: '• Identify all affected services using SBOM or dependency scanning\n• Determine if the vulnerability is exploitable in your deployment\n• Check if a patch/updated version is available\n• Classify blast radius: internet-facing services are highest priority', highlight: true },
        { heading: 'Step 2: SCOPE (Hours 1-4)', content: '• Run Trivy/Grype against all container images and repositories\n• Map affected services to business criticality\n• Check if any compensating controls exist (WAF rules, network policies)\n• Brief leadership on scope and response plan' },
        { heading: 'Step 3: FIX (Hours 4-24)', content: '• Update the vulnerable dependency to the patched version\n• Run full test suite to verify no regressions\n• Build and scan new container images\n• Deploy through your normal pipeline (don\'t skip security gates!)\n• Internet-facing critical services first, internal services next', highlight: true },
        { heading: 'Step 4: VERIFY (Day 2)', content: '• Confirm all affected services are running the patched version\n• Re-scan with Trivy/Grype to verify the CVE no longer appears\n• Check runtime monitoring for any exploitation attempts during the window\n• Update SBOM records' },
        { heading: 'Step 5: IMPROVE (Week)', content: '• Postmortem: how long did detection → fix take (MTTR)?\n• Could SCA scanning have caught this earlier?\n• Add the CVE to your monitoring/alerting if not already covered\n• Review dependency update cadence and automation' },
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
    id: '5.4', pathId: 5, title: 'Scenario — DevSecOps from Zero', baseXP: 100,
    hasSim: false, hasExecute: false, hasVerify: false,
    theory: {
      sections: [
        { heading: 'The Scenario', content: 'You\'re hired to implement DevSecOps at a company that has never done it. 50 developers, 20 microservices, no security scanning, secrets in config files, manual deployments.' },
        { heading: 'Month 1: Quick Wins', content: '• Install pre-commit hooks with Gitleaks (blocks secrets before they enter git)\n• Add Trivy container scanning to CI (catches vulnerable base images)\n• Audit and rotate any known exposed secrets\n• Create a shared #security Slack channel for awareness\n• Identify 2-3 Security Champions (developers who are interested in security)', highlight: true },
        { heading: 'Month 2: Foundation', content: '• Add Semgrep SAST scanning to all CI pipelines\n• Set up a secrets manager (Vault) — migrate 5 highest-risk secrets first\n• Establish severity-based SLAs: Critical=24h, High=7d, Medium=30d\n• Run a lunch-and-learn on OWASP Top 10\n• Start tracking metrics: scan coverage, open vulnerabilities by severity' },
        { heading: 'Month 3-4: Maturity', content: '• Add SCA scanning (Trivy fs for dependency vulnerabilities)\n• Set up DAST scanning on staging environments\n• Implement quality gates: block PRs with critical findings\n• Start IaC scanning with Checkov if using Terraform/K8s\n• Regular security champion meetups (biweekly)' },
        { heading: 'Month 5-6: Advanced', content: '• SonarQube for code quality tracking and historical trends\n• SBOM generation for all production images\n• Policy-as-Code with OPA for K8s admission control\n• Runtime monitoring with Falco (if K8s)\n• Full metrics dashboard: MTTR, coverage, FP rate, adoption', highlight: true },
        { heading: 'Key Principles', content: '• Start with LOW friction tools (pre-commit hooks, not blocking CI gates)\n• Gradually increase enforcement (warn → soft block → hard block)\n• Never blame developers — make secure = easy\n• Show value: "we caught X secrets this month that would have been breaches"\n• Get executive sponsorship for budget and mandate' },
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
    id: '5.5', pathId: 5, title: 'Scenario — Developer Resistance', baseXP: 100,
    hasSim: false, hasExecute: false, hasVerify: false,
    theory: {
      sections: [
        { heading: 'The Scenario', content: 'Developers are pushing back on security scanning. Common complaints: "It slows us down," "Too many false positives," "Security is not my job," "We have deadlines."' },
        { heading: 'Strategy 1: Empathy First', content: '• Listen to specific complaints — they\'re often valid\n• If scans are slow: optimize (parallel execution, incremental scanning, caching)\n• If too many false positives: tune rules, create allowlists, prioritize by severity\n• If blocking deploys: switch to warnings first, block only on critical\n• Acknowledge that bad tooling IS a legitimate problem', highlight: true },
        { heading: 'Strategy 2: Make Security Invisible', content: '• IDE plugins (Semgrep, Snyk) give instant feedback while coding — no pipeline wait\n• Pre-commit hooks catch issues before they even enter git\n• Fast scans in CI (Gitleaks: 2s, Semgrep: 30s) don\'t meaningfully slow pipelines\n• Auto-fix suggestions where possible (dependabot, npm audit fix)' },
        { heading: 'Strategy 3: Show the Value', content: '• Monthly report: "X secrets caught, Y critical CVEs blocked, Z misconfigs prevented"\n• Translate to business impact: "That AWS key we caught? It had admin access to all production data"\n• Reference real breaches with costs: Uber ($148M), Equifax ($575M), Capital One ($80M)\n• Demonstrate an attack path: "With this misconfiguration, an attacker could..."', highlight: true },
        { heading: 'Strategy 4: Gamification & Recognition', content: '• Security Champion of the Month\n• Fix-rate leaderboards (positive framing, not shame boards)\n• Lunch-and-learns where developers present security wins\n• CTF events and bug bounty programs' },
        { heading: 'Strategy 5: Executive Sponsorship', content: '• Get leadership to mandate security as a non-negotiable\n• Frame as risk management, not developer burden\n• Compliance requirements (SOC2, ISO 27001, PCI-DSS) often require these controls\n• Security incidents are far more expensive than prevention' },
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
    id: '5.6', pathId: 5, title: 'Architecture & Frameworks', baseXP: 100,
    hasSim: false, hasExecute: false, hasVerify: false,
    theory: {
      sections: [
        { heading: 'Key Diagrams to Draw in Interviews', content: 'Be ready to whiteboard:\n\n1. DevSecOps Pipeline: Source → Secrets Scan → Build → SAST/SCA → Image Build → Image Scan → Staging → DAST → Policy Gate → Production → Runtime Monitoring\n\n2. Secrets Flow: App → Vault API → Auth (AppRole/K8s) → Policy Check → Secret Delivery → Short TTL → Auto-Rotation\n\n3. Container Lifecycle: Dockerfile → Build → Lint (Hadolint) → Scan (Trivy) → Sign (Cosign) → Registry → Admission Control → Deploy → Runtime Monitor' },
        { heading: 'OWASP', content: 'OWASP Top 10 (2021): The ten most critical web application security risks. A01 Broken Access Control, A02 Cryptographic Failures, A03 Injection. OWASP also publishes the DevSecOps Guideline — best practices for integrating security into every DevOps stage.', highlight: true },
        { heading: 'NIST SSDF', content: 'NIST Secure Software Development Framework (SP 800-218): A set of recommended practices for secure software development. Groups: Prepare the Organization, Protect the Software, Produce Well-Secured Software, Respond to Vulnerabilities.' },
        { heading: 'SLSA', content: 'Supply-chain Levels for Software Artifacts: a framework for ensuring the integrity of software artifacts. L0 (no guarantees) → L1 (documented build) → L2 (signed provenance) → L3 (hardened build platform). Focuses on build integrity and provenance.', highlight: true },
        { heading: 'CIS Benchmarks', content: 'Center for Internet Security Benchmarks: detailed configuration guidelines for securing systems. Available for Docker, Kubernetes, AWS, Azure, GCP, Linux, Windows. Tools like kube-bench and Docker Bench automate CIS checks.' },
        { heading: 'MITRE ATT&CK', content: 'A knowledge base of adversary tactics and techniques based on real-world observations. Tactics: Initial Access, Execution, Persistence, Privilege Escalation, Defense Evasion, Credential Access, Discovery, Lateral Movement, Collection, Exfiltration, Impact. Use it to understand what attackers do and design defenses accordingly.' },
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
  { name: 'OWASP Top 10 (2021)', desc: 'The ten most critical web application security risks. Industry-standard awareness document covering Broken Access Control, Injection, Cryptographic Failures, and more.' },
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
    <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg border border-[#00ff41] bg-[#0d1117] text-[#00ff41] font-mono text-sm shadow-lg animate-pulse" style={{ boxShadow: '0 0 20px rgba(0,255,65,0.2)' }}>
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
    <button onClick={handleCopy} className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs border border-[#1a1a2e] hover:border-[#00ff41] text-[#8b949e] hover:text-[#00ff41] transition-colors" title="Copy">
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
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1a1a2e" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#00ff41" strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} strokeLinecap="round" />
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
            <button onClick={() => toggle(path)} className="flex items-center gap-1 w-full px-2 py-1 text-left text-[#c9d1d9] hover:bg-[#1a1a2e] rounded text-xs font-mono">
              {expanded[path] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              <Folder size={12} className="text-[#00d4ff]" />
              <span>{name}</span>
            </button>
            {expanded[path] && <div className="ml-3">{renderTree(content, path)}</div>}
          </div>
        );
      }
      return (
        <button key={path} onClick={() => onSelectFile({ name: path, content })} className={`flex items-center gap-1 w-full px-2 py-1 text-left rounded text-xs font-mono ${selectedFile?.name === path ? 'bg-[#1a1a2e] text-[#00ff41]' : 'text-[#8b949e] hover:bg-[#1a1a2e] hover:text-[#c9d1d9]'}`}>
          <File size={12} />
          <span>{name}</span>
        </button>
      );
    });
  };

  return (
    <div className="bg-[#0a0a0f] border-r border-[#1a1a2e] p-2 overflow-y-auto" style={{ minWidth: 180, maxWidth: 220 }}>
      <div className="text-[#00d4ff] text-xs font-bold mb-2 uppercase tracking-wider">Files</div>
      {renderTree(files)}
    </div>
  );
}

function FileViewer({ file }) {
  if (!file) return <div className="flex-1 flex items-center justify-center text-[#8b949e] text-sm font-mono">Select a file to view</div>;
  const lines = file.content.split('\n');
  return (
    <div className="flex-1 overflow-auto bg-[#0a0a0f] p-3">
      <div className="text-[#00d4ff] text-xs mb-2 font-mono">{file.name}</div>
      <pre className="text-xs font-mono leading-relaxed">
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="text-[#3a3a4e] select-none w-8 text-right mr-3 shrink-0">{i + 1}</span>
            <span className="text-[#c9d1d9]">{line}</span>
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
      <div className="bg-[#0d1117] border-b border-[#1a1a2e] px-4 py-2 flex items-center justify-between">
        <div className="text-[#00ff41] text-xs font-mono">Step {currentStep + 1}/{steps.length}: {step.objective}</div>
        <button onClick={() => setShowHint(true)} className="text-xs px-2 py-1 rounded border border-[#1a1a2e] text-[#ffb800] hover:border-[#ffb800] font-mono">
          {showHint ? step.command : 'Hint'}
        </button>
      </div>
      <div className="flex-1 bg-black p-3 overflow-y-auto font-mono text-sm">
        {history.map((entry, i) => (
          <div key={i} className={`mb-1 ${entry.type === 'input' ? 'text-[#00ff41]' : entry.type === 'error' ? 'text-[#ff3366]' : entry.type === 'success' ? 'text-[#00ff41] font-bold' : entry.type === 'followup-q' ? 'text-[#00d4ff]' : entry.type === 'followup-a' ? 'text-[#00ff41]' : 'text-[#c9d1d9]'}`}>
            {entry.type === 'input' && <span className="text-[#00d4ff]">secops&gt; </span>}
            <span className="whitespace-pre-wrap">{entry.text}</span>
          </div>
        ))}
        {awaitingAnswer ? (
          <div className="mt-2">
            <div className="text-[#00d4ff] mb-1">{step.followUp}</div>
            <div className="flex items-center gap-2">
              <span className="text-[#ffb800]">answer&gt;</span>
              <input
                value={followUpInput}
                onChange={e => setFollowUpInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleFollowUp()}
                className="flex-1 bg-transparent text-[#00ff41] outline-none font-mono text-sm"
                autoFocus
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <span className="text-[#00d4ff]">secops&gt; </span>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCommand()}
              className="flex-1 bg-transparent text-[#00ff41] outline-none font-mono text-sm"
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
        <div key={qi} className={`p-4 rounded-lg border ${submitted ? (answers[qi] === q.answer ? 'border-[#00ff41] bg-[rgba(0,255,65,0.05)]' : 'border-[#ff3366] bg-[rgba(255,51,102,0.05)]') : 'border-[#1a1a2e] bg-[#0d1117]'}`}>
          <div className="text-[#c9d1d9] font-mono text-sm mb-3">{qi + 1}. {q.q}</div>
          <div className="space-y-2">
            {q.opts.map((opt, oi) => (
              <label key={oi} className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer font-mono text-xs ${submitted ? (oi === q.answer ? 'bg-[rgba(0,255,65,0.1)] text-[#00ff41]' : answers[qi] === oi ? 'bg-[rgba(255,51,102,0.1)] text-[#ff3366]' : 'text-[#8b949e]') : answers[qi] === oi ? 'bg-[#1a1a2e] text-[#00ff41]' : 'text-[#8b949e] hover:bg-[#1a1a2e]'}`}>
                <input
                  type="radio"
                  name={`q-${qi}`}
                  checked={answers[qi] === oi}
                  onChange={() => !submitted && setAnswers(a => { const n = [...a]; n[qi] = oi; return n; })}
                  disabled={submitted}
                  className="accent-[#00ff41]"
                />
                {opt}
                {submitted && oi === q.answer && <CheckCircle size={14} className="ml-auto text-[#00ff41]" />}
                {submitted && answers[qi] === oi && oi !== q.answer && <XCircle size={14} className="ml-auto text-[#ff3366]" />}
              </label>
            ))}
          </div>
          {submitted && <div className="mt-2 text-xs text-[#8b949e] font-mono border-t border-[#1a1a2e] pt-2">{q.explanation}</div>}
        </div>
      ))}
      <div className="flex items-center gap-4">
        {!submitted ? (
          <button onClick={handleSubmit} disabled={answers.includes(-1)} className="px-4 py-2 rounded border border-[#00ff41] text-[#00ff41] font-mono text-sm hover:bg-[rgba(0,255,65,0.1)] disabled:opacity-30 disabled:cursor-not-allowed">Submit Quiz</button>
        ) : (
          <>
            <div className={`font-mono text-lg ${score >= 3 ? 'text-[#00ff41]' : 'text-[#ff3366]'}`}>{score}/{questions.length} {score >= 3 ? '— Passed!' : '— Need 3/5 to pass'}</div>
            {score < 5 && <button onClick={handleRetake} className="px-4 py-2 rounded border border-[#00d4ff] text-[#00d4ff] font-mono text-sm hover:bg-[rgba(0,212,255,0.1)]">Retake</button>}
            {score === 5 && <div className="text-[#ffb800] font-mono text-sm">Perfect score! +50 bonus XP</div>}
            {bestScore > 0 && <div className="text-[#8b949e] font-mono text-xs">Best: {bestScore}/5</div>}
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
  const mp = progress?.modules?.[moduleId] || {};

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
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1a1a2e] bg-[#0d1117]">
        <button onClick={onBack} className="text-[#8b949e] hover:text-[#00ff41]"><ChevronRight size={16} className="transform rotate-180" /></button>
        <div>
          <div className="text-[#00ff41] font-mono text-sm font-bold">{mod.id}: {mod.title}</div>
          <div className="text-[#8b949e] font-mono text-xs">{mod.baseXP} XP</div>
        </div>
        <div className="ml-auto flex gap-1">
          {mp.simulationComplete && <span className="text-xs px-2 py-0.5 rounded bg-[rgba(0,255,65,0.1)] text-[#00ff41]">Sim ✓</span>}
          {mp.verified && <span className="text-xs px-2 py-0.5 rounded bg-[rgba(0,212,255,0.1)] text-[#00d4ff]">Verified ✓</span>}
          {(mp.quizBestScore || 0) >= 3 && <span className="text-xs px-2 py-0.5 rounded bg-[rgba(255,184,0,0.1)] text-[#ffb800]">Quiz {mp.quizBestScore}/5</span>}
        </div>
      </div>
      <div className="flex border-b border-[#1a1a2e] bg-[#0a0a0f]">
        {tabs.map(t => {
          const Icon = tabIcons[t];
          return (
            <button key={t} onClick={() => setActiveTab(t)} className={`flex items-center gap-1.5 px-4 py-2 font-mono text-xs border-b-2 transition-colors ${activeTab === t ? 'border-[#00ff41] text-[#00ff41]' : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'}`}>
              <Icon size={14} /> {tabLabels[t]}
            </button>
          );
        })}
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'learn' && (
          <div className="max-w-3xl space-y-6">
            {mod.theory.sections.map((s, i) => (
              <div key={i} className={`${s.highlight ? 'border-l-2 border-[#00ff41] pl-4' : ''}`}>
                <h3 className="text-[#00ff41] font-mono font-bold text-sm uppercase tracking-wider mb-2">{s.heading}</h3>
                <div className="text-[#c9d1d9] font-mono text-sm leading-relaxed whitespace-pre-wrap">{s.content}</div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'simulate' && mod.simulation && (
          <div className="flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
            <div className="bg-[#0d1117] border border-[#1a1a2e] rounded-lg p-3 mb-3">
              <div className="text-[#ffb800] font-mono text-xs uppercase tracking-wider mb-1">Scenario</div>
              <div className="text-[#c9d1d9] font-mono text-sm">{mod.simulation.scenario}</div>
            </div>
            <div className="flex flex-1 border border-[#1a1a2e] rounded-lg overflow-hidden" style={{ minHeight: 400 }}>
              {mod.simulation.files && (
                <>
                  <FileBrowser files={mod.simulation.files} selectedFile={selectedFile} onSelectFile={setSelectedFile} />
                  <FileViewer file={selectedFile} />
                  <div className="w-px bg-[#1a1a2e]" />
                </>
              )}
              <div className="flex-1">
                <SimulatedTerminal steps={mod.simulation.steps} onComplete={handleSimComplete} />
              </div>
            </div>
            {mp.simulationComplete && <div className="mt-3 text-[#00ff41] font-mono text-sm">✅ Simulation complete — {mod.baseXP} XP earned!</div>}
          </div>
        )}
        {activeTab === 'execute' && mod.execute && (
          <div className="max-w-3xl space-y-4">
            <div className="text-[#c9d1d9] font-mono text-sm mb-4">{mod.execute.intro}</div>
            <div className="bg-[#0d1117] border border-[#1a1a2e] rounded-lg divide-y divide-[#1a1a2e]">
              {mod.execute.commands.map((c, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="text-[#8b949e] font-mono text-xs mb-1">{c.desc}</div>
                  <div className="flex items-center gap-2">
                    <code className="text-[#00ff41] font-mono text-sm flex-1">{c.cmd}</code>
                    <CopyButton text={c.cmd} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'verify' && mod.verify && (
          <div className="max-w-3xl space-y-4">
            <div className="text-[#c9d1d9] font-mono text-sm mb-2">Answer these questions from your real tool output to verify you ran the commands.</div>
            <div className="bg-[#0d1117] border border-[#1a1a2e] rounded-lg p-4 space-y-4">
              {mod.verify.map((q, i) => (
                <div key={i}>
                  <label className="text-[#00d4ff] font-mono text-sm block mb-1">{q}</label>
                  <input
                    value={verifyAnswers[i] || ''}
                    onChange={e => setVerifyAnswers(a => ({ ...a, [i]: e.target.value }))}
                    disabled={verifySubmitted}
                    className="w-full bg-[#0a0a0f] border border-[#1a1a2e] rounded px-3 py-2 text-[#c9d1d9] font-mono text-sm focus:border-[#00ff41] outline-none"
                    placeholder="Your answer..."
                  />
                </div>
              ))}
              {!verifySubmitted ? (
                <button onClick={handleVerifySubmit} disabled={Object.keys(verifyAnswers).length < mod.verify.length || Object.values(verifyAnswers).some(v => !v.trim())} className="px-4 py-2 rounded border border-[#00d4ff] text-[#00d4ff] font-mono text-sm hover:bg-[rgba(0,212,255,0.1)] disabled:opacity-30 disabled:cursor-not-allowed">Submit Verification</button>
              ) : (
                <div className="text-[#00ff41] font-mono text-sm">✅ Self-verified! +{Math.round(mod.baseXP * 0.3)} bonus XP earned. Be honest — the only person you're cheating is yourself.</div>
              )}
            </div>
          </div>
        )}
        {activeTab === 'quiz' && mod.quiz && (
          <div className="max-w-3xl">
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
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="bg-[#0d1117] border border-[#1a1a2e] rounded-lg p-6" style={{ boxShadow: '0 0 30px rgba(0,255,65,0.05)' }}>
        <div className="text-[#00ff41] font-mono text-lg font-bold">
          {profile.callsign ? `Welcome back, ${profile.callsign}` : 'Welcome to SecOps Academy'}
        </div>
        <div className="text-[#8b949e] font-mono text-sm mt-1">
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
          <div key={i} className="bg-[#0d1117] border border-[#1a1a2e] rounded-lg p-4">
            <div className="text-[#8b949e] font-mono text-xs uppercase tracking-wider">{stat.label}</div>
            <div className="text-[#00ff41] font-mono text-xl font-bold mt-1">{stat.value}</div>
            <div className="text-[#8b949e] font-mono text-xs mt-1">{stat.sub}</div>
            <div className="w-full h-1 bg-[#1a1a2e] rounded mt-2">
              <div className="h-full bg-[#00ff41] rounded transition-all" style={{ width: `${Math.min(stat.pct, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="text-[#00ff41] font-mono text-sm font-bold uppercase tracking-wider mb-3">Learning Paths</div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
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
              <div key={p.id} onClick={() => unlocked && onNavigate('paths', p.id)} className={`bg-[#0d1117] border rounded-lg p-3 cursor-pointer transition-all ${unlocked ? 'border-[#1a1a2e] hover:border-[#00ff41]' : 'border-[#1a1a2e] opacity-50 cursor-not-allowed'}`} style={unlocked ? { boxShadow: '0 0 15px rgba(0,255,65,0.05)' } : {}}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{p.icon}</span>
                  {!unlocked && <Lock size={12} className="text-[#8b949e]" />}
                </div>
                <div className="text-[#c9d1d9] font-mono text-xs font-bold">{p.name}</div>
                <div className="text-[#8b949e] font-mono text-[10px] mt-1">{done}/{pathMods.length} modules</div>
                <div className="w-full h-1 bg-[#1a1a2e] rounded mt-2">
                  <div className="h-full bg-[#00ff41] rounded" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {nextMod && (
        <div className="bg-[#0d1117] border border-[#00ff41] rounded-lg p-4 flex items-center justify-between" style={{ boxShadow: '0 0 20px rgba(0,255,65,0.1)' }}>
          <div>
            <div className="text-[#8b949e] font-mono text-xs uppercase">Recommended Next</div>
            <div className="text-[#00ff41] font-mono text-sm font-bold mt-1">{MODULES[nextMod].id}: {MODULES[nextMod].title}</div>
            <div className="text-[#8b949e] font-mono text-xs mt-1">Path {MODULES[nextMod].pathId} — {MODULES[nextMod].baseXP} XP</div>
          </div>
          <button onClick={() => onOpenModule(nextMod)} className="px-4 py-2 rounded border border-[#00ff41] text-[#00ff41] font-mono text-sm hover:bg-[rgba(0,255,65,0.1)] flex items-center gap-1">
            Start <ArrowRight size={14} />
          </button>
        </div>
      )}

      {Object.values(badges).some(b => b.unlocked) && (
        <div>
          <div className="text-[#00ff41] font-mono text-sm font-bold uppercase tracking-wider mb-3">Badges</div>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(badges).filter(([, b]) => b.unlocked).map(([id]) => {
              const badge = BADGES.find(b => b.id === id);
              return badge ? (
                <span key={id} className="px-2 py-1 rounded text-xs font-mono bg-[rgba(255,184,0,0.1)] text-[#ffb800] border border-[rgba(255,184,0,0.2)]">{badge.icon} {badge.name}</span>
              ) : null;
            })}
          </div>
        </div>
      )}
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
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      {PATHS.map(p => {
        const unlocked = isPathUnlocked(p.id);
        const pathMods = Object.keys(MODULES).filter(k => MODULES[k].pathId === p.id).sort();
        const done = pathMods.filter(k => progress.modules?.[k]?.simulationComplete || (!MODULES[k].hasSim && progress.modules?.[k]?.quizBestScore >= 3)).length;
        const pct = pathMods.length ? Math.round((done / pathMods.length) * 100) : 0;

        return (
          <div key={p.id} className={`bg-[#0d1117] border rounded-lg overflow-hidden ${unlocked ? 'border-[#1a1a2e]' : 'border-[#1a1a2e] opacity-60'}`}>
            <button onClick={() => unlocked && setOpenPath(openPath === p.id ? null : p.id)} className="w-full flex items-center gap-4 p-4 text-left">
              <span className="text-2xl">{p.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[#c9d1d9] font-mono font-bold text-sm">{p.name}</span>
                  {!unlocked && <Lock size={14} className="text-[#8b949e]" />}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${p.difficulty === 'Beginner' ? 'bg-[rgba(0,255,65,0.1)] text-[#00ff41]' : p.difficulty === 'Intermediate' ? 'bg-[rgba(0,212,255,0.1)] text-[#00d4ff]' : p.difficulty === 'Advanced' ? 'bg-[rgba(255,184,0,0.1)] text-[#ffb800]' : 'bg-[rgba(128,0,255,0.1)] text-[#a855f7]'}`}>{p.difficulty}</span>
                </div>
                <div className="text-[#8b949e] font-mono text-xs mt-1">{p.desc}</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1 bg-[#1a1a2e] rounded"><div className="h-full bg-[#00ff41] rounded" style={{ width: `${pct}%` }} /></div>
                  <span className="text-[#8b949e] font-mono text-xs">{done}/{pathMods.length}</span>
                </div>
              </div>
              {unlocked && (openPath === p.id ? <ChevronDown size={16} className="text-[#8b949e]" /> : <ChevronRight size={16} className="text-[#8b949e]" />)}
            </button>
            {openPath === p.id && unlocked && (
              <div className="border-t border-[#1a1a2e] divide-y divide-[#1a1a2e]">
                {pathMods.map(mid => {
                  const mod = MODULES[mid];
                  const mp = progress.modules?.[mid] || {};
                  const isDone = mp.simulationComplete || (!mod.hasSim && mp.quizBestScore >= 3);
                  return (
                    <button key={mid} onClick={() => onOpenModule(mid)} className="w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-[#1a1a2e] transition-colors">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${isDone ? 'bg-[rgba(0,255,65,0.1)] text-[#00ff41]' : 'bg-[#1a1a2e] text-[#8b949e]'}`}>
                        {isDone ? <Check size={12} /> : mod.id.split('.')[1]}
                      </div>
                      <div className="flex-1">
                        <div className={`font-mono text-sm ${isDone ? 'text-[#00ff41]' : 'text-[#c9d1d9]'}`}>{mod.title}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[#8b949e] font-mono text-xs">{mod.baseXP} XP</span>
                          {mod.hasSim && <span className="text-[10px] px-1 rounded bg-[rgba(0,212,255,0.1)] text-[#00d4ff]">Lab</span>}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {mp.simulationComplete && <span className="text-[10px] text-[#00ff41]">Sim✓</span>}
                        {mp.verified && <span className="text-[10px] text-[#00d4ff]">Ver✓</span>}
                        {mp.quizBestScore >= 3 && <span className="text-[10px] text-[#ffb800]">Q{mp.quizBestScore}/5</span>}
                      </div>
                      <ChevronRight size={14} className="text-[#8b949e]" />
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
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-4">
        {diffs.map(d => (
          <button key={d} onClick={() => setDiffFilter(diffFilter === d ? null : d)} className={`px-3 py-1 rounded font-mono text-xs border ${diffFilter === d ? (d === 'beginner' ? 'border-[#00ff41] text-[#00ff41] bg-[rgba(0,255,65,0.1)]' : d === 'intermediate' ? 'border-[#00d4ff] text-[#00d4ff] bg-[rgba(0,212,255,0.1)]' : 'border-[#ffb800] text-[#ffb800] bg-[rgba(255,184,0,0.1)]') : 'border-[#1a1a2e] text-[#8b949e] hover:border-[#8b949e]'}`}>
            {d}
          </button>
        ))}
        <span className="mx-2 text-[#1a1a2e]">|</span>
        {cats.map(c => (
          <button key={c} onClick={() => setCatFilter(catFilter === c ? null : c)} className={`px-3 py-1 rounded font-mono text-xs border ${catFilter === c ? 'border-[#00d4ff] text-[#00d4ff] bg-[rgba(0,212,255,0.1)]' : 'border-[#1a1a2e] text-[#8b949e] hover:border-[#8b949e]'}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(lab => {
          const mp = progress.modules?.[lab.moduleId] || {};
          const done = mp.simulationComplete;
          return (
            <button key={lab.id} onClick={() => onOpenModule(lab.moduleId)} className={`bg-[#0d1117] border rounded-lg p-4 text-left transition-all hover:border-[#00ff41] ${done ? 'border-[#00ff41]' : 'border-[#1a1a2e]'}`} style={{ boxShadow: done ? '0 0 15px rgba(0,255,65,0.08)' : 'none' }}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${lab.difficulty === 'beginner' ? 'bg-[rgba(0,255,65,0.1)] text-[#00ff41]' : lab.difficulty === 'intermediate' ? 'bg-[rgba(0,212,255,0.1)] text-[#00d4ff]' : 'bg-[rgba(255,184,0,0.1)] text-[#ffb800]'}`}>{lab.difficulty}</span>
                {done && <CheckCircle size={14} className="text-[#00ff41]" />}
              </div>
              <div className="text-[#c9d1d9] font-mono text-sm font-bold mb-1">{lab.title}</div>
              <div className="flex flex-wrap gap-1 mb-2">
                {lab.tools.map(t => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-[#1a1a2e] text-[#8b949e] font-mono">{t}</span>)}
              </div>
              <div className="flex items-center gap-2 text-[#8b949e] font-mono text-xs">
                <Clock size={10} /> {lab.time}
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
      if (!mastered.includes(trimmed)) onMasterCommand(trimmed);
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
      <div className="flex items-center gap-3 px-4 py-2 bg-[#0d1117] border-b border-[#1a1a2e]">
        <button onClick={() => { setMode('free'); setHistory([{ type: 'system', text: 'Free practice mode. Type any command.' }]); }} className={`px-3 py-1 rounded font-mono text-xs border ${mode === 'free' ? 'border-[#00ff41] text-[#00ff41]' : 'border-[#1a1a2e] text-[#8b949e]'}`}>Free Practice</button>
        <button onClick={() => { setMode('challenge'); setHistory([{ type: 'system', text: 'Challenge mode. Complete objectives to earn XP.' }]); setCurrentChallenge(0); }} className={`px-3 py-1 rounded font-mono text-xs border ${mode === 'challenge' ? 'border-[#00ff41] text-[#00ff41]' : 'border-[#1a1a2e] text-[#8b949e]'}`}>Challenges</button>
        <span className="ml-auto text-[#8b949e] font-mono text-xs">Commands mastered: {mastered.length}/{Object.keys(TERMINAL_COMMANDS).length - 2}</span>
      </div>
      {mode === 'challenge' && challenge && (
        <div className="px-4 py-2 bg-[rgba(255,184,0,0.05)] border-b border-[#1a1a2e] flex items-center justify-between">
          <div>
            <span className="text-[#ffb800] font-mono text-xs">Challenge {currentChallenge + 1}/{TERMINAL_CHALLENGES.length}: {challenge.objective}</span>
            {challengesDone.includes(challenge.id) && <span className="text-[#00ff41] font-mono text-xs ml-2">✓ Completed</span>}
          </div>
          <button onClick={() => setHistory(h => [...h, { type: 'system', text: `Hint: ${challenge.hint}` }])} className="text-xs px-2 py-1 rounded border border-[#1a1a2e] text-[#ffb800] hover:border-[#ffb800] font-mono">Hint</button>
        </div>
      )}
      <div className="flex-1 bg-black p-4 overflow-y-auto font-mono text-sm cursor-text" onClick={() => inputRef.current?.focus()}>
        {history.map((entry, i) => (
          <div key={i} className={`mb-1 ${entry.type === 'input' ? 'text-[#00ff41]' : entry.type === 'error' ? 'text-[#ff3366]' : entry.type === 'success' ? 'text-[#00ff41]' : entry.type === 'system' ? 'text-[#00d4ff]' : 'text-[#c9d1d9]'}`}>
            {entry.type === 'input' && <span className="text-[#00d4ff]">secops&gt; </span>}
            <span className="whitespace-pre-wrap">{entry.text}</span>
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-[#00d4ff]">secops&gt; </span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (mode === 'free' ? handleFreeCommand() : handleChallengeCommand())}
            className="flex-1 bg-transparent text-[#00ff41] outline-none font-mono text-sm"
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
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-2.5 text-[#8b949e]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tools, commands, frameworks..." className="w-full bg-[#0d1117] border border-[#1a1a2e] rounded-lg pl-10 pr-4 py-2 text-[#c9d1d9] font-mono text-sm focus:border-[#00ff41] outline-none" />
      </div>

      <div>
        <div className="text-[#00ff41] font-mono text-sm font-bold uppercase tracking-wider mb-3">Tool Quick Reference</div>
        <div className="space-y-2">
          {filteredTools.map((t, i) => {
            const isOpen = effectiveOpen === 'all' || openSection === t.origIdx;
            return (
            <div key={t.origIdx} className="bg-[#0d1117] border border-[#1a1a2e] rounded-lg overflow-hidden">
              <button onClick={() => setOpenSection(openSection === t.origIdx ? null : t.origIdx)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
                <div className="flex-1">
                  <span className="text-[#00ff41] font-mono text-sm font-bold">{t.name}</span>
                  <span className="text-[#8b949e] font-mono text-xs ml-2">{t.tools}</span>
                </div>
                {isOpen ? <ChevronDown size={14} className="text-[#8b949e]" /> : <ChevronRight size={14} className="text-[#8b949e]" />}
              </button>
              {isOpen && (
                <div className="border-t border-[#1a1a2e] divide-y divide-[#1a1a2e]">
                  {t.commands.map((c, j) => (
                    <div key={j} className="px-4 py-2 flex items-center gap-2">
                      <code className="text-[#00ff41] font-mono text-xs flex-1">{c.cmd}</code>
                      <span className="text-[#8b949e] font-mono text-xs shrink-0 max-w-[200px] truncate">{c.desc}</span>
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
        <div className="text-[#00ff41] font-mono text-sm font-bold uppercase tracking-wider mb-3">SAST vs DAST vs SCA vs IAST</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead><tr>{INTEL_COMPARISON_SAST.headers.map((h, i) => <th key={i} className="text-left px-3 py-2 text-[#00d4ff] border-b border-[#1a1a2e]">{h}</th>)}</tr></thead>
            <tbody>{INTEL_COMPARISON_SAST.rows.map((row, i) => <tr key={i} className="border-b border-[#1a1a2e]">{row.map((cell, j) => <td key={j} className={`px-3 py-2 ${j === 0 ? 'text-[#00ff41] font-bold' : 'text-[#c9d1d9]'}`}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="text-[#00ff41] font-mono text-sm font-bold uppercase tracking-wider mb-3">CI/CD Platform Comparison</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead><tr>{INTEL_COMPARISON_CICD.headers.map((h, i) => <th key={i} className="text-left px-3 py-2 text-[#00d4ff] border-b border-[#1a1a2e]">{h}</th>)}</tr></thead>
            <tbody>{INTEL_COMPARISON_CICD.rows.map((row, i) => <tr key={i} className="border-b border-[#1a1a2e]">{row.map((cell, j) => <td key={j} className={`px-3 py-2 ${j === 0 ? 'text-[#00ff41] font-bold' : 'text-[#c9d1d9]'}`}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="text-[#00ff41] font-mono text-sm font-bold uppercase tracking-wider mb-3">Frameworks Reference</div>
        <div className="space-y-2">
          {INTEL_FRAMEWORKS.filter(f => !s || f.name.toLowerCase().includes(s) || f.desc.toLowerCase().includes(s)).map((f, i) => (
            <div key={i} className="bg-[#0d1117] border border-[#1a1a2e] rounded-lg px-4 py-3">
              <div className="text-[#00d4ff] font-mono text-sm font-bold">{f.name}</div>
              <div className="text-[#c9d1d9] font-mono text-xs mt-1">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[#00ff41] font-mono text-sm font-bold uppercase tracking-wider mb-3">Interview Quick Reference</div>
        <div className="bg-[#0d1117] border border-[#ffb800] rounded-lg p-4 mb-4" style={{ boxShadow: '0 0 15px rgba(255,184,0,0.08)' }}>
          <div className="text-[#ffb800] font-mono text-xs uppercase tracking-wider mb-1">Your Unique Angle</div>
          <div className="text-[#c9d1d9] font-mono text-xs italic">"I approach DevSecOps from an attacker's perspective. I know what adversaries look for — exposed secrets, vulnerable dependencies, misconfigured infrastructure — because I've studied and tested for these. My pipelines are designed to catch what I would target as an attacker."</div>
        </div>
        <div className="space-y-1">
          {INTEL_INTERVIEW_QUICK.filter(q => !s || q.q.toLowerCase().includes(s) || q.a.toLowerCase().includes(s)).map((q, i) => (
            <div key={i} className="bg-[#0d1117] border border-[#1a1a2e] rounded px-4 py-2 flex gap-4">
              <div className="text-[#00d4ff] font-mono text-xs font-bold shrink-0 w-48">{q.q}</div>
              <div className="text-[#c9d1d9] font-mono text-xs">{q.a}</div>
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
function ProfileScreen({ profile, progress, badges, terminal, onUpdateProfile, onReset }) {
  const [callsign, setCallsign] = useState(profile.callsign || '');
  const [showReset, setShowReset] = useState(false);
  const [resetConfirm, setResetConfirm] = useState('');
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
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="bg-[#0d1117] border border-[#1a1a2e] rounded-lg p-6">
        <div className="text-[#8b949e] font-mono text-xs uppercase tracking-wider mb-2">Callsign</div>
        <div className="flex items-center gap-2">
          <input value={callsign} onChange={e => setCallsign(e.target.value.replace(/\s/g, ''))} maxLength={20} className="bg-[#0a0a0f] border border-[#1a1a2e] rounded px-3 py-2 text-[#00ff41] font-mono text-lg focus:border-[#00ff41] outline-none w-64" placeholder="Enter callsign..." />
          <button onClick={handleSaveCallsign} className="px-3 py-2 rounded border border-[#00ff41] text-[#00ff41] font-mono text-sm hover:bg-[rgba(0,255,65,0.1)]">Save</button>
        </div>
      </div>

      <div className="bg-[#0d1117] border border-[#1a1a2e] rounded-lg p-6 text-center">
        <div className="text-5xl mb-2">{rank.icon}</div>
        <div className="text-[#00ff41] font-mono text-xl font-bold">{rank.name}</div>
        <div className="text-[#8b949e] font-mono text-sm mt-1">{rank.tagline}</div>
        <div className="text-[#00d4ff] font-mono text-lg mt-2">{profile.totalXP.toLocaleString()} XP</div>
        {nextRank && (
          <div className="mt-3">
            <div className="w-64 h-2 bg-[#1a1a2e] rounded mx-auto">
              <div className="h-full bg-[#00ff41] rounded" style={{ width: `${((profile.totalXP - rank.minXP) / (nextRank.minXP - rank.minXP)) * 100}%` }} />
            </div>
            <div className="text-[#8b949e] font-mono text-xs mt-1">{nextRank.minXP - profile.totalXP} XP to {nextRank.name}</div>
          </div>
        )}
      </div>

      <div className="bg-[#0d1117] border border-[#1a1a2e] rounded-lg p-6">
        <div className="text-[#00ff41] font-mono text-sm font-bold uppercase tracking-wider mb-4">Stats</div>
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
              <div className="text-[#8b949e] font-mono text-xs">{s.label}</div>
              <div className="text-[#c9d1d9] font-mono text-lg font-bold">{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#0d1117] border border-[#1a1a2e] rounded-lg p-6">
        <div className="text-[#00ff41] font-mono text-sm font-bold uppercase tracking-wider mb-4">Badges</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {BADGES.map(b => {
            const state = badges[b.id] || {};
            return (
              <div key={b.id} className={`p-3 rounded-lg border ${state.unlocked ? 'border-[#ffb800] bg-[rgba(255,184,0,0.05)]' : 'border-[#1a1a2e] opacity-40'}`}>
                <div className="text-lg mb-1">{b.icon}</div>
                <div className={`font-mono text-xs font-bold ${state.unlocked ? 'text-[#ffb800]' : 'text-[#8b949e]'}`}>{b.name}</div>
                <div className="text-[#8b949e] font-mono text-[10px] mt-1">{state.unlocked ? `Unlocked ${new Date(state.unlockedAt).toLocaleDateString()}` : b.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#0d1117] border border-[#1a1a2e] rounded-lg p-6">
        <button onClick={() => setShowReset(!showReset)} className="text-[#ff3366] font-mono text-sm hover:underline">Reset All Progress</button>
        {showReset && (
          <div className="mt-3 p-3 bg-[rgba(255,51,102,0.05)] border border-[#ff3366] rounded-lg">
            <div className="text-[#ff3366] font-mono text-xs mb-2">This will erase ALL progress. Type "RESET" to confirm.</div>
            <div className="flex gap-2">
              <input value={resetConfirm} onChange={e => setResetConfirm(e.target.value)} className="bg-[#0a0a0f] border border-[#1a1a2e] rounded px-3 py-1 text-[#ff3366] font-mono text-sm focus:border-[#ff3366] outline-none w-32" placeholder="Type RESET" />
              <button onClick={() => { if (resetConfirm === 'RESET') onReset(); }} disabled={resetConfirm !== 'RESET'} className="px-3 py-1 rounded border border-[#ff3366] text-[#ff3366] font-mono text-sm hover:bg-[rgba(255,51,102,0.1)] disabled:opacity-30 disabled:cursor-not-allowed">Confirm Reset</button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-[#8b949e] font-mono text-xs">SecOps Academy — Built by Fractal AI Security Team. A free, open community platform for learning DevSecOps from zero to interview-ready.</div>
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
    setScreen(scr);
    setActiveModule(null);
    if (scr === 'paths' && data) setFocusPath(data);
  }, []);

  const handleOpenModule = useCallback((moduleId) => {
    setActiveModule(moduleId);
    setScreen('paths');
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-[#00ff41] font-mono text-lg animate-pulse">Initializing SecOps Academy...</div>
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
    <div className="min-h-screen bg-[#0a0a0f] text-[#c9d1d9] flex flex-col" style={{ fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', 'Courier New', monospace" }}>
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* NAV */}
      <nav className="bg-[#0d1117] border-b border-[#1a1a2e] px-4 py-2 flex items-center gap-6 sticky top-0 z-40" style={{ boxShadow: '0 2px 10px rgba(0,255,65,0.05)' }}>
        <div className="text-[#00ff41] font-mono font-bold text-sm flex items-center gap-2">
          <Shield size={16} /> SecOps Academy
        </div>
        <div className="flex gap-1 flex-1 justify-center">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = screen === item.id && !activeModule;
            return (
              <button key={item.id} onClick={() => { setScreen(item.id); setActiveModule(null); setFocusPath(null); }} className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs transition-colors ${active ? 'bg-[rgba(0,255,65,0.1)] text-[#00ff41]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}>
                <Icon size={14} /> {item.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 text-[#8b949e] font-mono text-xs">
          <span className="text-[#00d4ff]">{profile.totalXP} XP</span>
          <span>{getRank(profile.totalXP).icon}</span>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto">
        {activeModule ? (
          <ModuleView
            moduleId={activeModule}
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onBack={() => setActiveModule(null)}
          />
        ) : (
          <>
            {screen === 'dashboard' && <DashboardScreen profile={profile} progress={progress} badges={badges} terminal={terminal} onNavigate={handleNavigate} onOpenModule={handleOpenModule} />}
            {screen === 'paths' && <PathsScreen progress={progress} onOpenModule={handleOpenModule} focusPath={focusPath} />}
            {screen === 'labs' && <LabsScreen progress={progress} onOpenModule={handleOpenModule} />}
            {screen === 'terminal' && <TerminalScreen profile={profile} terminal={terminal} onMasterCommand={handleMasterCommand} onCompleteChallenge={handleCompleteChallenge} />}
            {screen === 'intel' && <IntelScreen />}
            {screen === 'profile' && <ProfileScreen profile={profile} progress={progress} badges={badges} terminal={terminal} onUpdateProfile={saveProfile} onReset={handleReset} />}
          </>
        )}
      </main>
    </div>
  );
}
