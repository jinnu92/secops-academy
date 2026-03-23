const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:4173';
const SCREENSHOTS_DIR = '/Users/praveenkumar/Documents/studdy/dev-sec-ops/secops-academy/e2e-screenshots';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function shot(page, name) {
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${name}.png`), fullPage: false });
  console.log(`Screenshot: ${name}.png`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  await page.goto(BASE_URL, { waitUntil: 'networkidle' });

  // --- BUG 1: Path icons show text strings not icons ---
  console.log('\n=== BUG 1: Path Icons on Dashboard ===');
  await shot(page, 'bug01-dashboard-path-icons');
  const pathIconText = await page.evaluate(() => {
    // Find the path cards in dashboard - looking for spans with text like "Shield", "Target" etc.
    const spans = Array.from(document.querySelectorAll('span.text-lg, span.text-2xl'));
    return spans.map(s => s.textContent?.trim()).filter(Boolean);
  });
  console.log('Path icon content in Dashboard:', pathIconText);

  // Navigate to Paths
  await page.click('button:has-text("Paths")');
  await page.waitForTimeout(500);
  await shot(page, 'bug01-paths-screen-icons');
  const pathIconTextInPaths = await page.evaluate(() => {
    const spans = Array.from(document.querySelectorAll('span.text-2xl'));
    return spans.map(s => s.textContent?.trim()).filter(Boolean);
  });
  console.log('Path icon content in Paths screen:', pathIconTextInPaths);

  // --- BUG 2: Click Path 1 to expand it ---
  console.log('\n=== BUG 2: Paths - Expand Path 1 ===');
  // Click the Path 1 button (DevSecOps Fundamentals)
  const path1Button = await page.$('button:has-text("DevSecOps Fundamentals")');
  if (path1Button) {
    await path1Button.click();
    await page.waitForTimeout(500);
    await shot(page, 'bug02-path1-expanded');
    console.log('Path 1 expanded successfully');

    // Check for modules visible
    const moduleButtons = await page.$$('button:has-text("What is DevSecOps"), button:has-text("1.1"), button:has-text("CI/CD")');
    console.log('Module buttons found:', moduleButtons.length);

    // Click Module 1.1
    const mod11 = await page.$('button:has-text("What is DevSecOps")');
    if (mod11) {
      await mod11.click();
      await page.waitForTimeout(500);
      await shot(page, 'bug02-module11-view');
      console.log('Module 1.1 clicked - module view should appear');
    } else {
      console.log('ERROR: Module 1.1 button not found');
    }
  } else {
    console.log('ERROR: Path 1 button not found');
  }

  // --- BUG 3: Module view tabs ---
  console.log('\n=== BUG 3: Module View Tabs ===');
  await shot(page, 'bug03-module-tabs');
  const tabButtons = await page.$$eval('button', btns => btns.map(b => b.textContent?.trim()).filter(t => ['Learn', 'Simulate', 'Execute', 'Verify', 'Quiz'].includes(t)));
  console.log('Module tab buttons:', tabButtons);

  // Click Learn tab (should already be active)
  const learnBtn = await page.$('button:has-text("Learn")');
  if (learnBtn) {
    await learnBtn.click();
    await page.waitForTimeout(300);
    await shot(page, 'bug03-learn-tab');
    console.log('Learn tab content visible');
  }

  // Click Quiz tab
  const quizBtn = await page.$('button:has-text("Quiz")');
  if (quizBtn) {
    await quizBtn.click();
    await page.waitForTimeout(300);
    await shot(page, 'bug03-quiz-tab');

    // Try answering all questions
    const radioLabels = await page.$$('label');
    console.log(`Found ${radioLabels.length} quiz option labels`);

    // Select first option for each question (radio inputs named q-0, q-1, etc.)
    for (let i = 0; i < 5; i++) {
      const radio = await page.$(`input[name="q-${i}"][value="0"]`);
      // Actually try clicking first label of each question
      await page.evaluate((qi) => {
        const radio = document.querySelector(`input[name="q-${qi}"]`);
        if (radio) {
          radio.click();
          // Trigger change event
          const event = new Event('change', { bubbles: true });
          radio.dispatchEvent(event);
        }
      }, i);
    }
    await page.waitForTimeout(200);

    // Try clicking first option label for each question
    const quizOptions = await page.$$('label.flex.items-center');
    console.log(`Found ${quizOptions.length} clickable option labels`);
    if (quizOptions.length > 0) {
      // Click one option per question (every 4th label is a new question with 4 options)
      for (let i = 0; i < Math.min(quizOptions.length, 5); i += 4) {
        await quizOptions[i].click();
        await page.waitForTimeout(100);
      }
      await shot(page, 'bug03-quiz-options-selected');
    }

    // Try Submit button
    const submitBtn = await page.$('button:has-text("Submit Quiz")');
    if (submitBtn) {
      const isDisabled = await submitBtn.getAttribute('disabled');
      console.log('Submit Quiz button disabled?', isDisabled);
      await shot(page, 'bug03-quiz-submit-button');
    } else {
      console.log('ERROR: Submit Quiz button not found');
    }
  } else {
    console.log('ERROR: Quiz tab not found');
  }

  // --- BUG 4: Module 1.4 with Simulate tab ---
  console.log('\n=== BUG 4: Module 1.4 Simulate Tab ===');
  // Go back to path view
  const backBtn = await page.$('button svg.rotate-180');
  if (!backBtn) {
    // Try finding the back chevron
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const back = btns.find(b => b.querySelector('svg') && b.className.includes('text-[#8b949e]'));
      if (back) back.click();
    });
  } else {
    await backBtn.click();
  }
  await page.waitForTimeout(500);

  // Click Path 1 again if needed
  const path1Btn2 = await page.$('button:has-text("DevSecOps Fundamentals")');
  if (path1Btn2) {
    // Check if already expanded
    const modules = await page.$('button:has-text("Docker Fundamentals")');
    if (!modules) {
      await path1Btn2.click();
      await page.waitForTimeout(500);
    }
  }

  const dockerModule = await page.$('button:has-text("Docker Fundamentals")');
  if (dockerModule) {
    await dockerModule.click();
    await page.waitForTimeout(500);
    await shot(page, 'bug04-module14-view');

    const simulateBtn = await page.$('button:has-text("Simulate")');
    if (simulateBtn) {
      await simulateBtn.click();
      await page.waitForTimeout(500);
      await shot(page, 'bug04-simulate-tab');
      console.log('Simulate tab found and clicked');

      // Check file browser
      const filesBrowser = await page.$('div:has-text("Files")');
      console.log('Files browser visible:', !!filesBrowser);

      // Check terminal input in simulation
      const simInputs = await page.$$('input.bg-transparent');
      console.log(`Simulation inputs found: ${simInputs.length}`);
      if (simInputs.length > 0) {
        await simInputs[0].click();
        await simInputs[0].type('docker --version');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(400);
        await shot(page, 'bug04-simulate-command');
        console.log('Simulation terminal command entered');
      }

      // Test clicking a file in the file browser
      const fileButton = await page.$('button:has-text("app.py")');
      if (fileButton) {
        await fileButton.click();
        await page.waitForTimeout(300);
        await shot(page, 'bug04-file-viewer');
        console.log('File browser: app.py clicked');
      } else {
        console.log('WARNING: app.py file button not found in file browser');
      }
    } else {
      console.log('ERROR: Simulate tab not found in Module 1.4');
    }
  } else {
    console.log('ERROR: Docker Fundamentals module not found');
  }

  // --- BUG 5: Terminal - input detection ---
  console.log('\n=== BUG 5: Terminal Screen ===');
  await page.click('button:has-text("Terminal")');
  await page.waitForTimeout(500);
  await shot(page, 'bug05-terminal-screen');

  // The terminal uses a transparent input - need to click in the right area
  const terminalInput = await page.$('input.bg-transparent.text-\\[\\#00ff41\\]');
  console.log('Terminal transparent input found:', !!terminalInput);

  if (terminalInput) {
    await terminalInput.click();
    await terminalInput.fill('help');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    await shot(page, 'bug05-terminal-help');

    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasHelpOutput = bodyText.includes('Available commands') || bodyText.includes('help') || bodyText.includes('gitleaks') || bodyText.includes('docker');
    console.log('Help command showed output:', hasHelpOutput);

    await terminalInput.fill('docker ps');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    await shot(page, 'bug05-terminal-docker-ps');

    await terminalInput.fill('gitleaks detect -v');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    await shot(page, 'bug05-terminal-gitleaks');

    const afterCmds = await page.evaluate(() => document.body.innerText);
    console.log('Terminal output preview:', afterCmds.substring(afterCmds.indexOf('secops') || 0, 500));
  } else {
    // Try clicking in the black area of terminal
    const blackArea = await page.$('div.bg-black.p-4');
    if (blackArea) {
      await blackArea.click();
      await page.waitForTimeout(200);
      await page.keyboard.type('help');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(400);
      await shot(page, 'bug05-terminal-help-via-area');
      console.log('Typed help via black area click');
    }
  }

  // Challenge mode
  const challengeBtn = await page.$('button:has-text("Challenges")');
  if (challengeBtn) {
    await challengeBtn.click();
    await page.waitForTimeout(400);
    await shot(page, 'bug05-challenge-mode');
    console.log('Challenge mode activated');

    // Check challenge content
    const challengeText = await page.evaluate(() => document.body.innerText);
    const hasChallenge = challengeText.includes('Challenge') && challengeText.includes('gitleaks');
    console.log('Challenge mode has challenge content:', hasChallenge);

    // Try typing the answer
    const challengeInput = await page.$('input.bg-transparent');
    if (challengeInput) {
      await challengeInput.click();
      await challengeInput.fill('gitleaks detect -v');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(400);
      await shot(page, 'bug05-challenge-answer');
    }
  }

  // --- BUG 6: Intel - Search and collapsible ---
  console.log('\n=== BUG 6: Intel Screen ===');
  await page.click('button:has-text("Intel")');
  await page.waitForTimeout(500);
  await shot(page, 'bug06-intel-screen');

  // Test search
  const searchInput = await page.$('input[placeholder*="Search"]');
  if (searchInput) {
    await searchInput.click();
    await searchInput.type('gitleaks');
    await page.waitForTimeout(400);
    await shot(page, 'bug06-intel-search-gitleaks');
    console.log('Intel search: typed "gitleaks"');

    // Check if results filtered
    const results = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('div.bg-\\[\\#0d1117\\]')).map(el => el.textContent?.trim().substring(0, 50));
    });
    console.log('Search result cards:', results.slice(0, 5));

    // Clear and search again
    await searchInput.fill('');
    await page.waitForTimeout(200);
  }

  // Test collapsible section - click "Secrets Detection" header
  const secretsBtn = await page.$('button:has-text("Secrets Detection")');
  if (secretsBtn) {
    await secretsBtn.click();
    await page.waitForTimeout(400);
    await shot(page, 'bug06-intel-secrets-expanded');
    console.log('Intel: Secrets Detection section clicked');

    // Check if expanded
    const expandedContent = await page.evaluate(() => {
      return document.body.innerText.includes('gitleaks detect') || document.body.innerText.includes('--source');
    });
    console.log('Secrets Detection section expanded with commands:', expandedContent);
  } else {
    console.log('ERROR: Secrets Detection button not found');
  }

  // --- BUG 7: Profile - callsign and badge hint ---
  console.log('\n=== BUG 7: Profile Screen ===');
  await page.click('button:has-text("Profile")');
  await page.waitForTimeout(500);
  await shot(page, 'bug07-profile-screen');

  // Test callsign save
  const callsignInput = await page.$('input[placeholder="Enter callsign..."]');
  if (callsignInput) {
    await callsignInput.fill('Agent007');
    await page.waitForTimeout(200);
    const saveBtn = await page.$('button:has-text("Save")');
    if (saveBtn) {
      await saveBtn.click();
      await page.waitForTimeout(400);
      await shot(page, 'bug07-profile-callsign-saved');
      console.log('Profile: callsign saved');

      // Check if callsign appears on dashboard
      await page.click('button:has-text("Dashboard")');
      await page.waitForTimeout(300);
      await shot(page, 'bug07-dashboard-after-callsign');
      const dashboardText = await page.evaluate(() => document.body.innerText);
      const hasCallsign = dashboardText.includes('Agent007');
      console.log('Dashboard shows callsign after save:', hasCallsign);
      if (!hasCallsign) {
        console.log('ERROR: Callsign not reflected on Dashboard after save');
      }
    }
  } else {
    console.log('ERROR: Callsign input not found');
  }

  // Go back to profile to check badge descriptions
  await page.click('button:has-text("Profile")');
  await page.waitForTimeout(300);

  // Check badge sections - looking for undefined hint
  const badgeTexts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[class*="opacity-40"]')).map(el => el.textContent?.trim().substring(0, 80));
  });
  console.log('Badge texts (locked state):', badgeTexts.slice(0, 3));

  // The badges use b.hint but BADGES data has b.desc - check what renders
  const badgeSection = await page.$('div:has-text("Badges")');
  if (badgeSection) {
    await shot(page, 'bug07-profile-badges-hint');
    const badgeContent = await page.evaluate(() => {
      const badges = document.querySelectorAll('[class*="opacity-40"] [class*="text-\\[10px\\]"]');
      return Array.from(badges).map(b => b.textContent?.trim()).filter(Boolean);
    });
    console.log('Badge hint/desc content (should show description, not blank):', badgeContent.slice(0, 3));
  }

  // --- BUG 8: Dashboard unlock logic for Paths 3 & 4 ---
  console.log('\n=== BUG 8: Dashboard Path Unlock Logic ===');
  await page.click('button:has-text("Dashboard")');
  await page.waitForTimeout(300);
  await shot(page, 'bug08-dashboard-paths');
  // Check if Path 3 and 4 show as locked but the logic in Dashboard always unlocks them
  const pathCards = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[class*="opacity-50"], [class*="cursor-not-allowed"]')).map(el => el.textContent?.trim().substring(0, 50));
  });
  console.log('Locked/disabled elements on dashboard:', pathCards);

  // --- CONSOLE ERRORS ---
  console.log('\n=== CONSOLE ERRORS ===');
  if (consoleErrors.length > 0) {
    consoleErrors.forEach(e => console.log(' ERROR:', e));
  } else {
    console.log('No console errors');
  }

  await browser.close();

  console.log('\n=== SCREENSHOTS SAVED ===');
  const files = fs.readdirSync(SCREENSHOTS_DIR).filter(f => f.endsWith('.png'));
  files.forEach(f => console.log(' -', f));
})();
