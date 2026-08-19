#!/usr/bin/env node

/**
 * Toolva - Automated Tool Submission Validator
 * 
 * Runs as part of the PR validation GitHub Action.
 * Validates tool entries added in src/data/ files.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const RESULTS_PATH = path.join(__dirname, 'validation-results.json');

const VALID_CATEGORIES = [
  'All', 'Chatbots', 'Image Generation', 'Code', 'Music', 'Video',
  'Writing', 'Education', 'Business', 'Design', 'Audio', 'APIs',
  'Machine Learning', 'Analytics', 'Security', 'Database', 'DevOps',
  'Research', 'Productivity', 'Startups', 'General'
];

async function main() {
  const checks = [];
  let allPassed = true;

  // 1. Get changed files
  let changedFiles = [];
  try {
    const diff = execSync('git diff --name-only HEAD~1 2>/dev/null || git diff --name-only HEAD', { encoding: 'utf8' });
    changedFiles = diff.split('\n').filter(f => f.startsWith('src/data/') && f.endsWith('.ts'));
  } catch (e) {
    changedFiles = [];
  }

  if (changedFiles.length === 0) {
    checks.push({ name: 'Changed Files', passed: true, message: 'No tool data files changed — skipping validation' });
    writeResults({ passed: true, checks });
    return;
  }

  checks.push({ name: 'Changed Files', passed: true, message: `Found ${changedFiles.length} changed data file(s): ${changedFiles.join(', ')}` });

  // 2. Check for required fields in each changed file
  for (const file of changedFiles) {
    const filePath = path.resolve(file);
    if (!fs.existsSync(filePath)) {
      checks.push({ name: `File Exists: ${file}`, passed: false, message: 'File not found' });
      allPassed = false;
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // Check for URL patterns
    const urlPattern = /url:\s*['"]([^'"]+)['"]/g;
    const urls = [];
    let match;
    while ((match = urlPattern.exec(content)) !== null) {
      urls.push(match[1]);
    }

    // Validate URLs
    for (const url of urls) {
      if (!url.startsWith('https://') && !url.startsWith('http://')) {
        checks.push({ name: `URL Format`, passed: false, message: `Invalid URL found: ${url} — must start with https://` });
        allPassed = false;
      }
    }

    // Check for required fields in tool objects
    const namePattern = /name:\s*['"]([^'"]*)['"],/g;
    const names = [];
    while ((match = namePattern.exec(content)) !== null) {
      names.push(match[1]);
    }

    // Check for empty names
    const emptyNames = names.filter(n => !n.trim());
    if (emptyNames.length > 0) {
      checks.push({ name: 'Tool Names', passed: false, message: `Found ${emptyNames.length} tool(s) with empty names` });
      allPassed = false;
    }

    // Check for duplicate names (case-insensitive)
    const lowerNames = names.map(n => n.toLowerCase().trim());
    const duplicates = lowerNames.filter((name, i) => lowerNames.indexOf(name) !== i);
    if (duplicates.length > 0) {
      checks.push({ name: 'Duplicate Check', passed: false, message: `Duplicate tool names found: ${[...new Set(duplicates)].join(', ')}` });
      allPassed = false;
    } else {
      checks.push({ name: 'Duplicate Check', passed: true, message: 'No duplicate tool names detected' });
    }

    // Check for valid categories
    const categoryPattern = /category:\s*['"]([^'"]*)['"],/g;
    const categories = [];
    while ((match = categoryPattern.exec(content)) !== null) {
      categories.push(match[1]);
    }

    const invalidCategories = categories.filter(c => !VALID_CATEGORIES.includes(c));
    if (invalidCategories.length > 0) {
      checks.push({ name: 'Categories', passed: false, message: `Invalid categories found: ${invalidCategories.join(', ')}` });
      allPassed = false;
    } else {
      checks.push({ name: 'Categories', passed: true, message: 'All categories are valid' });
    }

    checks.push({ name: `File: ${path.basename(file)}`, passed: true, message: `Scanned ${names.length} tool entries, ${urls.length} URLs` });
  }

  // 3. URL reachability check (sample first 5 URLs)
  const urlPattern2 = /url:\s*['"]([^'"]+)['"]/g;
  const allContent = changedFiles.map(f => fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '').join('\n');
  const allUrls = [];
  let m2;
  while ((m2 = urlPattern2.exec(allContent)) !== null) {
    if (m2[1].startsWith('https://')) allUrls.push(m2[1]);
  }

  const sampleUrls = allUrls.slice(0, 5);
  for (const url of sampleUrls) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        redirect: 'follow',
      });
      clearTimeout(timeout);
      if (res.ok || res.status === 405 || res.status === 403) {
        checks.push({ name: `URL Check`, passed: true, message: `${url} is reachable (HTTP ${res.status})` });
      } else {
        checks.push({ name: `URL Check`, passed: false, message: `${url} returned HTTP ${res.status}` });
        allPassed = false;
      }
    } catch (e) {
      checks.push({ name: `URL Check`, passed: false, message: `${url} is unreachable: ${e.message}` });
      allPassed = false;
    }
  }

  writeResults({ passed: allPassed, checks });

  if (!allPassed) {
    console.error('❌ Validation failed — see results above');
    process.exit(1);
  } else {
    console.log('✅ All validation checks passed');
  }
}

function writeResults(results) {
  fs.writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2));
  console.log('\nValidation Results:');
  for (const check of results.checks) {
    console.log(`  ${check.passed ? '✅' : '❌'} ${check.name}: ${check.message}`);
  }
}

main().catch(err => {
  console.error('Validation script error:', err);
  const results = { passed: false, checks: [{ name: 'Script Error', passed: false, message: err.message }] };
  fs.writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2));
  process.exit(1);
});
