const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5173';
const SCREENSHOTS_DIR = '/Users/praveenkumar/Documents/studdy/dev-sec-ops/secops-academy/e2e-screenshots/tour';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function shot(page, name, fullPage = true) {
  const filePath = path.join(SCREENSHOTS_DIR, `${name}.png`);
  await page.screenshot({ path: filePath, fullPage });
  console.log(`  [screenshot] ${name}.png`);
  return filePath;
}

async function waitAndShot(page, name, fullPage = true) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(800);
  return shot(page, name, fullPage);
}

async function scrollAndShot(page, namePrefix) {
  // Scroll to top first
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await shot(page, `${namePrefix}-top`);

  // Get total page height
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportHeight = 900;
  let scrollY = 0;
  let part = 1;

  while (scrollY < totalHeight - viewportHeight) {
    scrollY = Math.min(scrollY + viewportHeight, totalHeight - viewportHeight);
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await page.waitForTimeout(400);
    await shot(page, `${namePrefix}-scroll${part}`, false);
    part++;
    if (part > 10) break; // safety limit
  }

  // Full page shot at end
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await shot(page, `${namePrefix}-fullpage`, true);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  console.log('\n========================================');
  console.log('  SecOps Academy - Full Visual Tour');
  console.log('========================================\n');

  // =====================================================
  // SCREEN 1: DASHBOARD
  // =====================================================
  console.log('--- SCREEN 1: Dashboard ---');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await scrollAndShot(page, '01-dashboard');
  console.log('  Dashboard captured\n');

  // =====================================================
  // SCREEN 2: PATHS - expand Path 1
  // =====================================================
  console.log('--- SCREEN 2: Paths Screen ---');
  await page.click('button:has-text("Paths")');
  await page.waitForTimeout(800);
  await shot(page, '02-paths-collapsed');

  // Expand Path 1
  const path1Btn = page.locator('button').filter({ hasText: 'DevSecOps Fundamentals' }).first();
  if (await path1Btn.count() > 0) {
    await path1Btn.click();
    await page.waitForTimeout(600);
    await scrollAndShot(page, '02-paths-path1-expanded');
    console.log('  Path 1 expanded\n');
  } else {
    // try generic approach: click first path card
    const firstPath = page.locator('[class*="cursor-pointer"]').first();
    if (await firstPath.count() > 0) {
      await firstPath.click();
      await page.waitForTimeout(600);
      await shot(page, '02-paths-path1-expanded-generic');
    }
    console.log('  Path 1 button not found by text, tried generic\n');
  }

  // =====================================================
  // SCREEN 3: MODULE 1.1 - Learn Tab (all content)
  // =====================================================
  console.log('--- SCREEN 3: Module 1.1 - Learn Tab ---');

  // Navigate to paths if not already there
  await page.click('button:has-text("Paths")');
  await page.waitForTimeout(500);

  // Expand Path 1 if needed
  const mod11Visible = await page.locator('button').filter({ hasText: 'What is DevSecOps' }).count();
  if (mod11Visible === 0) {
    const p1 = page.locator('button').filter({ hasText: 'DevSecOps Fundamentals' }).first();
    if (await p1.count() > 0) {
      await p1.click();
      await page.waitForTimeout(600);
    }
  }

  // Click Module 1.1
  const mod11 = page.locator('button').filter({ hasText: 'What is DevSecOps' }).first();
  if (await mod11.count() > 0) {
    await mod11.click();
    await page.waitForTimeout(800);
    await shot(page, '03-module11-initial', false);

    // Click Learn tab
    const learnTab = page.locator('button').filter({ hasText: 'Learn' }).first();
    if (await learnTab.count() > 0) {
      await learnTab.click();
      await page.waitForTimeout(600);
    }

    // Scroll through entire Learn tab content
    await scrollAndShot(page, '03-module11-learn-tab');
    console.log('  Module 1.1 Learn tab captured with all content\n');
  } else {
    console.log('  WARNING: Module 1.1 not found\n');
  }

  // =====================================================
  // SCREEN 4: MODULE 1.1 - Quiz Tab
  // =====================================================
  console.log('--- SCREEN 4: Module 1.1 - Quiz Tab ---');

  const quizTab = page.locator('button').filter({ hasText: 'Quiz' }).first();
  if (await quizTab.count() > 0) {
    await quizTab.click();
    await page.waitForTimeout(600);
    await shot(page, '04-module11-quiz-empty', false);

    // Select answers for each question
    const questions = await page.locator('input[type="radio"]').all();
    console.log(`  Found ${questions.length} radio inputs`);

    // Group by name attribute and select first of each group
    const answeredGroups = new Set();
    for (const radio of questions) {
      const name = await radio.getAttribute('name');
      if (name && !answeredGroups.has(name)) {
        await radio.click().catch(() => {});
        answeredGroups.add(name);
        await page.waitForTimeout(150);
      }
    }

    await page.waitForTimeout(400);
    await shot(page, '04-module11-quiz-answered', false);

    // Try submitting
    const submitBtn = page.locator('button').filter({ hasText: 'Submit Quiz' }).first();
    if (await submitBtn.count() > 0) {
      const isDisabled = await submitBtn.isDisabled();
      console.log(`  Submit button disabled: ${isDisabled}`);
      if (!isDisabled) {
        await submitBtn.click();
        await page.waitForTimeout(600);
        await shot(page, '04-module11-quiz-results', false);
      }
    }

    await scrollAndShot(page, '04-module11-quiz-tab');
    console.log('  Module 1.1 Quiz tab captured\n');
  } else {
    console.log('  WARNING: Quiz tab not found\n');
  }

  // =====================================================
  // SCREEN 5: MODULE 1.4 - Simulate Tab (file browser)
  // =====================================================
  console.log('--- SCREEN 5: Module 1.4 - Simulate Tab ---');

  // Go to Paths and find module 1.4
  await page.click('button:has-text("Paths")');
  await page.waitForTimeout(600);

  // Check if Path 1 is expanded
  const dockerVisible = await page.locator('button').filter({ hasText: 'Docker Fundamentals' }).count();
  if (dockerVisible === 0) {
    const p1again = page.locator('button').filter({ hasText: 'DevSecOps Fundamentals' }).first();
    if (await p1again.count() > 0) {
      await p1again.click();
      await page.waitForTimeout(600);
    }
  }

  // Look for module 1.4 - Docker or similar
  const mod14Names = ['Docker Fundamentals', 'CI/CD Pipeline', 'Secret Management', '1.4'];
  let mod14Found = false;
  for (const name of mod14Names) {
    const btn = page.locator('button').filter({ hasText: name }).first();
    if (await btn.count() > 0) {
      await btn.click();
      await page.waitForTimeout(800);
      await shot(page, '05-module14-initial', false);
      console.log(`  Opened module: ${name}`);
      mod14Found = true;

      // Look for Simulate tab
      const simTab = page.locator('button').filter({ hasText: 'Simulate' }).first();
      if (await simTab.count() > 0) {
        await simTab.click();
        await page.waitForTimeout(800);
        await shot(page, '05-module14-simulate-initial', false);

        // Take full viewport shot showing file browser
        await scrollAndShot(page, '05-module14-simulate-tab');

        // Try typing a command in the terminal
        const termInput = page.locator('input').filter({ hasAttribute: 'placeholder' }).first();
        const altTermInput = page.locator('input[class*="bg-transparent"]').first();
        const anyInput = (await termInput.count() > 0) ? termInput : altTermInput;

        if (await anyInput.count() > 0) {
          await anyInput.click();
          await anyInput.fill('docker --version');
          await page.keyboard.press('Enter');
          await page.waitForTimeout(500);
          await shot(page, '05-module14-simulate-command', false);
        } else {
          // Try clicking terminal area
          const termArea = page.locator('[class*="font-mono"]').first();
          if (await termArea.count() > 0) {
            await termArea.click();
            await page.keyboard.type('docker --version');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(500);
            await shot(page, '05-module14-simulate-command-typed', false);
          }
        }

        // Try clicking a file in the file browser
        const fileBtn = page.locator('button').filter({ hasText: 'Dockerfile' }).first();
        const appPyBtn = page.locator('button').filter({ hasText: 'app.py' }).first();
        const anyFile = (await fileBtn.count() > 0) ? fileBtn : appPyBtn;
        if (await anyFile.count() > 0) {
          await anyFile.click();
          await page.waitForTimeout(400);
          await shot(page, '05-module14-simulate-file-viewer', false);
        }
      } else {
        console.log('  Simulate tab not found in this module');
      }
      break;
    }
  }

  if (!mod14Found) {
    console.log('  WARNING: Module 1.4 (Docker/CI-CD) not found');
    // Take a screenshot of whatever is visible
    await shot(page, '05-module14-not-found', false);
  }
  console.log('  Module 1.4 Simulate tab captured\n');

  // =====================================================
  // SCREEN 6: MODULE 1.4 - Execute Tab
  // =====================================================
  console.log('--- SCREEN 6: Module 1.4 - Execute Tab ---');

  const execTab = page.locator('button').filter({ hasText: 'Execute' }).first();
  if (await execTab.count() > 0) {
    await execTab.click();
    await page.waitForTimeout(800);
    await scrollAndShot(page, '06-module14-execute-tab');
    console.log('  Execute tab captured\n');
  } else {
    console.log('  WARNING: Execute tab not found\n');
    await shot(page, '06-module14-execute-not-found', false);
  }

  // =====================================================
  // SCREEN 7: TERMINAL - Free Practice (type "help")
  // =====================================================
  console.log('--- SCREEN 7: Terminal - Free Practice ---');
  await page.click('button:has-text("Terminal")');
  await page.waitForTimeout(1000);
  await shot(page, '07-terminal-initial', false);

  // Make sure we're in free practice mode (not challenge mode)
  const freePracticeBtn = page.locator('button').filter({ hasText: 'Free Practice' }).first();
  if (await freePracticeBtn.count() > 0) {
    await freePracticeBtn.click();
    await page.waitForTimeout(400);
  }

  await shot(page, '07-terminal-free-practice', false);

  // Find and use the terminal input
  const termInput = page.locator('input[class*="bg-transparent"]').first();
  if (await termInput.count() > 0) {
    await termInput.click();
    await termInput.fill('help');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(600);
    await shot(page, '07-terminal-help-output', false);
    await scrollAndShot(page, '07-terminal-free-practice-help');
  } else {
    // Try clicking the terminal area directly
    const terminalBody = page.locator('[class*="bg-[#0d1117]"]').last();
    if (await terminalBody.count() > 0) {
      await terminalBody.click();
      await page.waitForTimeout(200);
      await page.keyboard.type('help');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(600);
      await shot(page, '07-terminal-help-typed', false);
    } else {
      console.log('  WARNING: Could not find terminal input');
      await shot(page, '07-terminal-no-input', false);
    }
  }
  console.log('  Terminal free practice captured\n');

  // =====================================================
  // SCREEN 8: TERMINAL - Challenge Mode
  // =====================================================
  console.log('--- SCREEN 8: Terminal - Challenge Mode ---');

  const challengeBtn = page.locator('button').filter({ hasText: 'Challenges' }).first();
  if (await challengeBtn.count() > 0) {
    await challengeBtn.click();
    await page.waitForTimeout(800);
    await shot(page, '08-terminal-challenge-initial', false);
    await scrollAndShot(page, '08-terminal-challenge-mode');
    console.log('  Challenge mode captured\n');
  } else {
    // Try "Challenge" text
    const altChallenge = page.locator('button').filter({ hasText: 'Challenge' }).first();
    if (await altChallenge.count() > 0) {
      await altChallenge.click();
      await page.waitForTimeout(800);
      await scrollAndShot(page, '08-terminal-challenge-mode');
    } else {
      console.log('  WARNING: Challenge mode button not found\n');
      await shot(page, '08-terminal-challenge-not-found', false);
    }
  }

  // =====================================================
  // SCREEN 9: INTEL SCREEN
  // =====================================================
  console.log('--- SCREEN 9: Intel Screen ---');
  await page.click('button:has-text("Intel")');
  await page.waitForTimeout(800);
  await shot(page, '09-intel-initial', false);
  await scrollAndShot(page, '09-intel-screen');

  // Try expanding a section
  const intelSectionBtns = await page.locator('button').all();
  let expandedSection = false;
  for (const btn of intelSectionBtns) {
    const text = await btn.textContent();
    if (text && (text.includes('Detection') || text.includes('Secrets') || text.includes('SAST') || text.includes('Container'))) {
      await btn.click();
      await page.waitForTimeout(500);
      await shot(page, '09-intel-section-expanded', false);
      expandedSection = true;
      break;
    }
  }

  if (!expandedSection) {
    // Click the first expandable element
    const accordions = page.locator('[class*="cursor-pointer"]');
    if (await accordions.count() > 0) {
      await accordions.first().click();
      await page.waitForTimeout(500);
      await shot(page, '09-intel-first-expanded', false);
    }
  }

  // Try search
  const intelSearch = page.locator('input[placeholder*="earch"]').first();
  if (await intelSearch.count() > 0) {
    await intelSearch.click();
    await intelSearch.fill('gitleaks');
    await page.waitForTimeout(600);
    await shot(page, '09-intel-search-gitleaks', false);
    await scrollAndShot(page, '09-intel-search-results');

    // Clear search
    await intelSearch.fill('');
    await page.waitForTimeout(300);
  }
  console.log('  Intel screen captured\n');

  // =====================================================
  // SCREEN 10: PROFILE SCREEN
  // =====================================================
  console.log('--- SCREEN 10: Profile Screen ---');
  await page.click('button:has-text("Profile")');
  await page.waitForTimeout(800);
  await shot(page, '10-profile-initial', false);
  await scrollAndShot(page, '10-profile-screen');

  // Try entering a callsign
  const callsignInput = page.locator('input[placeholder*="callsign"]').first();
  if (await callsignInput.count() > 0) {
    await callsignInput.fill('Agent007');
    await page.waitForTimeout(200);
    const saveBtn = page.locator('button').filter({ hasText: 'Save' }).first();
    if (await saveBtn.count() > 0) {
      await saveBtn.click();
      await page.waitForTimeout(400);
      await shot(page, '10-profile-callsign-saved', false);
    }
  }

  await scrollAndShot(page, '10-profile-full');
  console.log('  Profile screen captured\n');

  // =====================================================
  // SCREEN 11: LABS SCREEN
  // =====================================================
  console.log('--- SCREEN 11: Labs Screen ---');
  const labsBtn = page.locator('button').filter({ hasText: 'Labs' }).first();
  if (await labsBtn.count() > 0) {
    await labsBtn.click();
    await page.waitForTimeout(800);
    await shot(page, '11-labs-initial', false);
    await scrollAndShot(page, '11-labs-screen');
    console.log('  Labs screen captured\n');
  } else {
    console.log('  WARNING: Labs button not found in navigation\n');
    // Check all nav buttons
    const navButtons = await page.locator('nav button, [class*="sidebar"] button').allTextContents();
    console.log('  Navigation buttons found:', navButtons);
    await shot(page, '11-labs-not-found', false);
  }

  // =====================================================
  // BONUS: Back to Dashboard for final overview
  // =====================================================
  console.log('--- Final: Dashboard overview ---');
  await page.click('button:has-text("Dashboard")');
  await page.waitForTimeout(800);
  await scrollAndShot(page, '00-dashboard-final');

  // =====================================================
  // CONSOLE ERROR REPORT
  // =====================================================
  console.log('\n========================================');
  console.log('  Console Errors Detected');
  console.log('========================================');
  if (consoleErrors.length > 0) {
    consoleErrors.forEach((e, i) => console.log(`  ${i + 1}. ${e}`));
  } else {
    console.log('  None detected');
  }

  await browser.close();

  // List all screenshots
  console.log('\n========================================');
  console.log('  Screenshots Saved');
  console.log('========================================');
  const files = fs.readdirSync(SCREENSHOTS_DIR).filter(f => f.endsWith('.png')).sort();
  files.forEach(f => console.log(`  ${f}`));
  console.log(`\n  Total: ${files.length} screenshots`);
  console.log(`  Location: ${SCREENSHOTS_DIR}`);
})();
