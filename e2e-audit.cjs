const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:4173';
const SCREENSHOTS_DIR = '/Users/praveenkumar/Documents/studdy/dev-sec-ops/secops-academy/e2e-screenshots';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const bugs = [];
const consoleErrors = [];

function logBug(screen, description, severity = 'MEDIUM') {
  const bug = { screen, description, severity };
  bugs.push(bug);
  console.log(`[BUG][${severity}][${screen}] ${description}`);
}

async function screenshot(page, name) {
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${name}.png`), fullPage: true });
}

async function waitAndClick(page, selector, description, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout });
    await page.click(selector);
    return true;
  } catch (e) {
    return false;
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // Capture all console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = `[${msg.type()}] ${msg.text()}`;
      consoleErrors.push(text);
      console.log('CONSOLE ERROR:', text);
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(`PAGE ERROR: ${err.message}`);
    console.log('PAGE ERROR:', err.message);
  });

  // ============================================================
  // TEST 1: Dashboard loads
  // ============================================================
  console.log('\n=== TEST 1: Dashboard ===');
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 });
    await screenshot(page, '01-dashboard');

    const title = await page.title();
    console.log('Page title:', title);

    // Check for React root content
    const bodyText = await page.evaluate(() => document.body.innerText);
    if (bodyText.trim().length < 50) {
      logBug('Dashboard', 'Page appears blank or has very little content', 'HIGH');
    }

    // Check for nav tabs
    const navItems = await page.$$eval('nav button, nav a, [role="tab"], button[class*="nav"]', els => els.map(e => e.textContent?.trim()));
    console.log('Nav items found:', navItems);

    // Check for visible errors on screen
    const errorText = await page.evaluate(() => {
      const body = document.body.innerText;
      return body.includes('Error') || body.includes('undefined') || body.includes('Cannot read');
    });
    if (errorText) {
      logBug('Dashboard', 'Error text visible in page content', 'HIGH');
    }

    await screenshot(page, '01-dashboard-full');
    console.log('Dashboard loaded OK');
  } catch (e) {
    logBug('Dashboard', `Failed to load: ${e.message}`, 'CRITICAL');
    await screenshot(page, '01-dashboard-error');
  }

  // ============================================================
  // TEST 2: Navigate through all tabs
  // ============================================================
  console.log('\n=== TEST 2: Nav Tabs ===');
  const tabs = ['Paths', 'Labs', 'Terminal', 'Intel', 'Profile'];

  for (const tab of tabs) {
    console.log(`\n--- Navigating to ${tab} ---`);
    try {
      // Try multiple selectors for nav tabs
      const clicked = await page.evaluate((tabName) => {
        const buttons = Array.from(document.querySelectorAll('button, a, [role="tab"]'));
        const btn = buttons.find(b => b.textContent?.trim() === tabName || b.textContent?.includes(tabName));
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      }, tab);

      if (!clicked) {
        logBug('Navigation', `Tab "${tab}" not found or not clickable`, 'HIGH');
        continue;
      }

      await page.waitForTimeout(800);
      await screenshot(page, `02-nav-${tab.toLowerCase()}`);

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (bodyText.trim().length < 30) {
        logBug(tab, `Screen appears blank after navigation`, 'HIGH');
      }

      console.log(`${tab} tab OK`);
    } catch (e) {
      logBug(tab, `Navigation error: ${e.message}`, 'HIGH');
      await screenshot(page, `02-nav-${tab.toLowerCase()}-error`);
    }
  }

  // Go back to Dashboard
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, a'));
    const btn = buttons.find(b => b.textContent?.trim() === 'Dashboard' || b.textContent?.includes('Dashboard'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(500);

  // ============================================================
  // TEST 3: Paths screen - expand Path 1, click Module 1.1
  // ============================================================
  console.log('\n=== TEST 3: Paths - Path 1 and Module 1.1 ===');
  try {
    // Navigate to Paths
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const btn = buttons.find(b => b.textContent?.trim() === 'Paths' || b.textContent?.includes('Paths'));
      if (btn) btn.click();
    });
    await page.waitForTimeout(800);
    await screenshot(page, '03-paths-initial');

    // Try to expand Path 1 - look for expandable elements
    const expandClicked = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('button, [role="button"], div[class*="cursor"], h2, h3'));
      // Look for something that contains "Path 1" or "1." or "Foundational" etc.
      const pathEl = elements.find(el => {
        const text = el.textContent?.trim() || '';
        return (text.includes('Path 1') || text.match(/^1\.\s/) || text.includes('Foundational') || text.includes('Introduction'));
      });
      if (pathEl) {
        console.log('Clicking path element:', pathEl.textContent?.substring(0, 50));
        pathEl.click();
        return pathEl.textContent?.substring(0, 50);
      }
      return null;
    });
    console.log('Clicked path element:', expandClicked);
    await page.waitForTimeout(800);
    await screenshot(page, '03-paths-expanded');

    // Try to click Module 1.1
    const moduleClicked = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('button, [role="button"], div, li'));
      const moduleEl = elements.find(el => {
        const text = el.textContent?.trim() || '';
        return text.match(/^1\.1/) || text.includes('Module 1.1') || (text.includes('1.1') && text.length < 80);
      });
      if (moduleEl) {
        console.log('Clicking module:', moduleEl.textContent?.substring(0, 50));
        moduleEl.click();
        return moduleEl.textContent?.substring(0, 50);
      }
      return null;
    });
    console.log('Clicked module:', moduleClicked);
    await page.waitForTimeout(800);
    await screenshot(page, '03-module-view');

    const bodyAfterModule = await page.evaluate(() => document.body.innerText);
    if (!bodyAfterModule.includes('Learn') && !bodyAfterModule.includes('Quiz') && !bodyAfterModule.includes('module')) {
      logBug('Paths', 'Module view did not open - no Learn/Quiz tabs visible after clicking Module 1.1', 'HIGH');
    } else {
      console.log('Module 1.1 view opened OK');
    }
  } catch (e) {
    logBug('Paths', `Path/Module navigation error: ${e.message}`, 'HIGH');
    await screenshot(page, '03-paths-error');
  }

  // ============================================================
  // TEST 4: Module view - Learn tab, Quiz tab, Submit quiz
  // ============================================================
  console.log('\n=== TEST 4: Module Tabs (Learn/Quiz) ===');
  try {
    // Try clicking Learn tab
    const learnClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, [role="tab"]'));
      const btn = buttons.find(b => b.textContent?.trim() === 'Learn' || b.textContent?.includes('Learn'));
      if (btn) { btn.click(); return true; }
      return false;
    });
    if (!learnClicked) {
      logBug('Module View', 'Learn tab not found', 'MEDIUM');
    }
    await page.waitForTimeout(500);
    await screenshot(page, '04-module-learn-tab');

    // Check Learn content
    const learnContent = await page.evaluate(() => document.body.innerText);
    if (!learnContent.includes('Learn') && !learnContent.includes('content') && !learnContent.includes('lesson')) {
      logBug('Module View', 'Learn tab appears empty', 'MEDIUM');
    }

    // Try clicking Quiz tab
    const quizClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, [role="tab"]'));
      const btn = buttons.find(b => b.textContent?.trim() === 'Quiz' || b.textContent?.includes('Quiz'));
      if (btn) { btn.click(); return true; }
      return false;
    });
    if (!quizClicked) {
      logBug('Module View', 'Quiz tab not found', 'MEDIUM');
    }
    await page.waitForTimeout(500);
    await screenshot(page, '04-module-quiz-tab');

    // Check quiz content
    const quizContent = await page.evaluate(() => document.body.innerText);
    console.log('Quiz page content preview:', quizContent.substring(0, 200));

    // Try to answer quiz questions - look for radio buttons or clickable options
    const options = await page.$$('input[type="radio"], input[type="checkbox"], [role="radio"]');
    console.log(`Found ${options.length} quiz options`);

    if (options.length > 0) {
      await options[0].click();
      await page.waitForTimeout(300);
      await screenshot(page, '04-quiz-answered');
    } else {
      // Try clicking on answer divs
      const answered = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('button, div[class*="option"], div[class*="answer"], li'));
        const answerEl = elements.find(el => {
          const text = el.textContent?.trim() || '';
          return text.length > 5 && text.length < 100 && !el.querySelector('button');
        });
        if (answerEl) {
          answerEl.click();
          return answerEl.textContent?.substring(0, 50);
        }
        return null;
      });
      console.log('Clicked answer:', answered);
    }

    // Try submitting quiz
    const submitClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => {
        const text = b.textContent?.trim() || '';
        return text === 'Submit' || text.includes('Submit') || text === 'Check' || text.includes('Check Answer');
      });
      if (btn) { btn.click(); return btn.textContent?.trim(); }
      return null;
    });
    console.log('Submit button:', submitClicked);
    await page.waitForTimeout(500);
    await screenshot(page, '04-quiz-submitted');

    if (!submitClicked) {
      logBug('Module View', 'Quiz submit button not found or not clickable', 'MEDIUM');
    }

  } catch (e) {
    logBug('Module View', `Quiz interaction error: ${e.message}`, 'MEDIUM');
    await screenshot(page, '04-module-error');
  }

  // ============================================================
  // TEST 5: Module 1.4 - Simulation tab
  // ============================================================
  console.log('\n=== TEST 5: Module 1.4 - Simulation ===');
  try {
    // Go back to Paths
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const btn = buttons.find(b => b.textContent?.trim() === 'Paths' || b.textContent?.includes('Paths'));
      if (btn) btn.click();
    });
    await page.waitForTimeout(800);

    // Look for back button or path list
    const backButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map(b => b.textContent?.trim()).filter(t => t && t.length < 30);
    });
    console.log('Available buttons:', backButtons.slice(0, 15));

    // Try to find and click back
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => {
        const text = b.textContent?.trim() || '';
        return text === 'Back' || text === '← Back' || text.includes('Back') || text.includes('←');
      });
      if (btn) btn.click();
    });
    await page.waitForTimeout(500);
    await screenshot(page, '05-paths-back');

    // Find Module 1.4
    const module14Clicked = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('button, [role="button"], div, li'));
      const moduleEl = elements.find(el => {
        const text = el.textContent?.trim() || '';
        return text.match(/^1\.4/) || text.includes('1.4') && text.length < 100;
      });
      if (moduleEl) {
        moduleEl.click();
        return moduleEl.textContent?.substring(0, 60);
      }
      return null;
    });
    console.log('Module 1.4 clicked:', module14Clicked);
    await page.waitForTimeout(800);

    if (!module14Clicked) {
      logBug('Paths', 'Module 1.4 not found - may need to expand path first', 'MEDIUM');

      // Try expanding path again
      await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('button, [role="button"]'));
        const pathEl = elements.find(el => el.textContent?.includes('Path 1') || el.textContent?.includes('Foundational'));
        if (pathEl) pathEl.click();
      });
      await page.waitForTimeout(600);

      await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('button, div, li'));
        const moduleEl = elements.find(el => {
          const text = el.textContent?.trim() || '';
          return text.match(/1\.4/) && text.length < 100;
        });
        if (moduleEl) moduleEl.click();
      });
      await page.waitForTimeout(800);
    }

    await screenshot(page, '05-module14-view');

    // Click Simulate tab
    const simClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, [role="tab"]'));
      const btn = buttons.find(b => {
        const text = b.textContent?.trim() || '';
        return text === 'Simulate' || text.includes('Simulat') || text === 'Lab' || text.includes('Lab');
      });
      if (btn) { btn.click(); return btn.textContent?.trim(); }
      return null;
    });
    console.log('Simulate tab:', simClicked);
    if (!simClicked) {
      logBug('Module 1.4', 'Simulate/Lab tab not found', 'MEDIUM');
    }
    await page.waitForTimeout(800);
    await screenshot(page, '05-simulate-tab');

    // Check file browser
    const hasFIleBrowser = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('file') || text.includes('File') || text.includes('/') || text.includes('ls') || text.includes('directory');
    });
    if (!hasFIleBrowser) {
      logBug('Module 1.4 Simulation', 'File browser content not visible', 'MEDIUM');
    }

    // Check terminal in simulation
    const hasTerminal = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('terminal') || text.includes('Terminal') || text.includes('$') || text.includes('>_');
    });
    if (!hasTerminal) {
      logBug('Module 1.4 Simulation', 'Terminal not visible in simulation', 'MEDIUM');
    }

    console.log('Simulation tab - file browser:', hasFIleBrowser, 'terminal:', hasTerminal);

    // Try interacting with terminal if it exists
    const terminalInput = await page.$('input[placeholder*="command"], input[placeholder*="$"], textarea[class*="terminal"], div[contenteditable="true"]');
    if (terminalInput) {
      await terminalInput.click();
      await terminalInput.type('ls -la');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
      await screenshot(page, '05-simulate-terminal-input');
    }

  } catch (e) {
    logBug('Module 1.4', `Simulation error: ${e.message}`, 'MEDIUM');
    await screenshot(page, '05-simulate-error');
  }

  // ============================================================
  // TEST 6: Terminal screen - free practice mode
  // ============================================================
  console.log('\n=== TEST 6: Terminal ===');
  try {
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const btn = buttons.find(b => b.textContent?.trim() === 'Terminal' || b.textContent?.includes('Terminal'));
      if (btn) btn.click();
    });
    await page.waitForTimeout(800);
    await screenshot(page, '06-terminal-screen');

    // Check terminal screen loaded
    const terminalContent = await page.evaluate(() => document.body.innerText);
    console.log('Terminal screen content:', terminalContent.substring(0, 300));

    if (!terminalContent.includes('Terminal') && !terminalContent.includes('$') && !terminalContent.includes('>')) {
      logBug('Terminal', 'Terminal screen appears empty or missing content', 'HIGH');
    }

    // Look for terminal input
    const inputSelectors = [
      'input[type="text"]',
      'input[placeholder]',
      'textarea',
      '[contenteditable="true"]',
      'input[class*="terminal"]',
      'input[class*="command"]'
    ];

    let termInput = null;
    for (const sel of inputSelectors) {
      termInput = await page.$(sel);
      if (termInput) {
        console.log('Found terminal input with selector:', sel);
        break;
      }
    }

    if (!termInput) {
      logBug('Terminal', 'No terminal input field found - cannot type commands', 'HIGH');
    } else {
      // Type "help"
      await termInput.click();
      await termInput.fill('help');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(600);
      await screenshot(page, '06-terminal-help');

      const afterHelp = await page.evaluate(() => document.body.innerText);
      if (!afterHelp.includes('help') && !afterHelp.includes('command') && !afterHelp.includes('available')) {
        logBug('Terminal', '"help" command produced no output or unexpected result', 'MEDIUM');
      }

      // Type "docker ps"
      await termInput.click();
      await termInput.fill('docker ps');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(600);
      await screenshot(page, '06-terminal-docker');

      // Type "gitleaks detect -v"
      await termInput.click();
      await termInput.fill('gitleaks detect -v');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(600);
      await screenshot(page, '06-terminal-gitleaks');
    }
  } catch (e) {
    logBug('Terminal', `Terminal interaction error: ${e.message}`, 'HIGH');
    await screenshot(page, '06-terminal-error');
  }

  // ============================================================
  // TEST 7: Terminal - Challenge mode
  // ============================================================
  console.log('\n=== TEST 7: Terminal Challenge Mode ===');
  try {
    // Look for Challenge mode button
    const challengeClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, [role="tab"]'));
      const btn = buttons.find(b => {
        const text = b.textContent?.trim() || '';
        return text === 'Challenge' || text.includes('Challenge') || text === 'Challenge Mode';
      });
      if (btn) { btn.click(); return btn.textContent?.trim(); }
      return null;
    });
    console.log('Challenge mode button:', challengeClicked);
    if (!challengeClicked) {
      logBug('Terminal', 'Challenge mode button not found', 'MEDIUM');
    }
    await page.waitForTimeout(800);
    await screenshot(page, '07-terminal-challenge');

    const challengeContent = await page.evaluate(() => document.body.innerText);
    console.log('Challenge mode content:', challengeContent.substring(0, 300));

    if (challengeClicked && !challengeContent.includes('challenge') && !challengeContent.includes('Challenge') && !challengeContent.includes('task')) {
      logBug('Terminal', 'Challenge mode opened but shows no challenge content', 'MEDIUM');
    }
  } catch (e) {
    logBug('Terminal', `Challenge mode error: ${e.message}`, 'MEDIUM');
    await screenshot(page, '07-terminal-challenge-error');
  }

  // ============================================================
  // TEST 8: Intel screen
  // ============================================================
  console.log('\n=== TEST 8: Intel Screen ===');
  try {
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const btn = buttons.find(b => b.textContent?.trim() === 'Intel' || b.textContent?.includes('Intel'));
      if (btn) btn.click();
    });
    await page.waitForTimeout(800);
    await screenshot(page, '08-intel-screen');

    const intelContent = await page.evaluate(() => document.body.innerText);
    console.log('Intel content:', intelContent.substring(0, 300));

    // Test search
    const searchInput = await page.$('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]');
    if (!searchInput) {
      logBug('Intel', 'Search input not found', 'MEDIUM');
    } else {
      await searchInput.click();
      await searchInput.type('docker');
      await page.waitForTimeout(600);
      await screenshot(page, '08-intel-search');

      const searchResults = await page.evaluate(() => document.body.innerText);
      console.log('Search results preview:', searchResults.substring(0, 200));

      // Clear search
      await searchInput.fill('');
      await page.waitForTimeout(400);
    }

    // Test collapsible sections
    const collapsibleItems = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('button, [role="button"], summary, div[class*="accordion"]'));
      return elements.filter(el => {
        const text = el.textContent?.trim() || '';
        return text.length > 3 && text.length < 100;
      }).slice(0, 10).map(el => el.textContent?.trim());
    });
    console.log('Possible collapsible items:', collapsibleItems);

    // Try clicking a section header
    const sectionExpanded = await page.evaluate(() => {
      // Look for chevron icons or expand buttons
      const elements = Array.from(document.querySelectorAll('button, [role="button"]'));
      const collapsible = elements.find(el => {
        const hasChevron = el.querySelector('svg') || el.innerHTML?.includes('chevron') || el.innerHTML?.includes('arrow');
        const text = el.textContent?.trim() || '';
        return (hasChevron || text.includes('+') || text.includes('▶')) && text.length < 100;
      });
      if (collapsible) {
        collapsible.click();
        return collapsible.textContent?.trim().substring(0, 50);
      }
      return null;
    });
    console.log('Expanded section:', sectionExpanded);
    await page.waitForTimeout(500);
    await screenshot(page, '08-intel-expanded');

  } catch (e) {
    logBug('Intel', `Intel screen error: ${e.message}`, 'MEDIUM');
    await screenshot(page, '08-intel-error');
  }

  // ============================================================
  // TEST 9: Profile screen
  // ============================================================
  console.log('\n=== TEST 9: Profile Screen ===');
  try {
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const btn = buttons.find(b => b.textContent?.trim() === 'Profile' || b.textContent?.includes('Profile'));
      if (btn) btn.click();
    });
    await page.waitForTimeout(800);
    await screenshot(page, '09-profile-screen');

    const profileContent = await page.evaluate(() => document.body.innerText);
    console.log('Profile content:', profileContent.substring(0, 300));

    // Find callsign input
    const callsignInput = await page.$('input[placeholder*="callsign"], input[placeholder*="Callsign"], input[name*="callsign"], input[id*="callsign"]');
    if (!callsignInput) {
      // Try generic inputs
      const inputs = await page.$$('input[type="text"], input:not([type])');
      console.log(`Found ${inputs.length} text inputs on profile`);

      if (inputs.length === 0) {
        logBug('Profile', 'No input fields found for callsign entry', 'MEDIUM');
      } else {
        // Try first text input
        await inputs[0].click();
        await inputs[0].fill('TestAgent007');
        await page.waitForTimeout(300);
        await screenshot(page, '09-profile-callsign-entered');

        // Try to save
        const saveClicked = await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const btn = buttons.find(b => {
            const text = b.textContent?.trim() || '';
            return text === 'Save' || text.includes('Save') || text === 'Update' || text.includes('Update');
          });
          if (btn) { btn.click(); return btn.textContent?.trim(); }
          return null;
        });
        console.log('Save button:', saveClicked);
        if (!saveClicked) {
          logBug('Profile', 'Save/Update button not found', 'MEDIUM');
        }
        await page.waitForTimeout(500);
        await screenshot(page, '09-profile-saved');
      }
    } else {
      await callsignInput.click();
      await callsignInput.fill('TestAgent007');
      await page.waitForTimeout(300);

      const saveClicked = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find(b => b.textContent?.includes('Save') || b.textContent?.includes('Update'));
        if (btn) { btn.click(); return btn.textContent?.trim(); }
        return null;
      });
      await page.waitForTimeout(500);
      await screenshot(page, '09-profile-saved');
    }
  } catch (e) {
    logBug('Profile', `Profile screen error: ${e.message}`, 'MEDIUM');
    await screenshot(page, '09-profile-error');
  }

  // ============================================================
  // TEST 10: Labs screen detailed check
  // ============================================================
  console.log('\n=== TEST 10: Labs Screen ===');
  try {
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const btn = buttons.find(b => b.textContent?.trim() === 'Labs' || b.textContent?.includes('Labs'));
      if (btn) btn.click();
    });
    await page.waitForTimeout(800);
    await screenshot(page, '10-labs-screen');

    const labsContent = await page.evaluate(() => document.body.innerText);
    console.log('Labs content:', labsContent.substring(0, 300));

    if (labsContent.trim().length < 50) {
      logBug('Labs', 'Labs screen appears empty', 'HIGH');
    }

    // Try clicking first lab if any
    const labClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => {
        const text = b.textContent?.trim() || '';
        return text.includes('Lab') || text.includes('Start') || text.includes('Open');
      });
      if (btn) { btn.click(); return btn.textContent?.trim(); }
      return null;
    });
    console.log('Lab action clicked:', labClicked);
    await page.waitForTimeout(500);
    await screenshot(page, '10-labs-clicked');
  } catch (e) {
    logBug('Labs', `Labs screen error: ${e.message}`, 'MEDIUM');
  }

  // ============================================================
  // FINAL: Check all console errors
  // ============================================================
  console.log('\n=== FINAL SCREENSHOT ===');
  await screenshot(page, 'final-state');

  await browser.close();

  // ============================================================
  // REPORT
  // ============================================================
  console.log('\n\n====================================');
  console.log('     E2E AUDIT REPORT');
  console.log('====================================');
  console.log(`\nTotal bugs found: ${bugs.length}`);
  console.log(`Console errors: ${consoleErrors.length}`);

  if (consoleErrors.length > 0) {
    console.log('\n--- CONSOLE ERRORS ---');
    consoleErrors.forEach(e => console.log(' -', e));
  }

  if (bugs.length > 0) {
    console.log('\n--- BUGS ---');
    const critical = bugs.filter(b => b.severity === 'CRITICAL');
    const high = bugs.filter(b => b.severity === 'HIGH');
    const medium = bugs.filter(b => b.severity === 'MEDIUM');
    const low = bugs.filter(b => b.severity === 'LOW');

    if (critical.length) {
      console.log('\n[CRITICAL]');
      critical.forEach(b => console.log(`  [${b.screen}] ${b.description}`));
    }
    if (high.length) {
      console.log('\n[HIGH]');
      high.forEach(b => console.log(`  [${b.screen}] ${b.description}`));
    }
    if (medium.length) {
      console.log('\n[MEDIUM]');
      medium.forEach(b => console.log(`  [${b.screen}] ${b.description}`));
    }
    if (low.length) {
      console.log('\n[LOW]');
      low.forEach(b => console.log(`  [${b.screen}] ${b.description}`));
    }
  } else {
    console.log('\nNo bugs found!');
  }

  console.log(`\nScreenshots saved to: ${SCREENSHOTS_DIR}`);
})();
