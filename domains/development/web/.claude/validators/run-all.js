#!/usr/bin/env node

/**
 * Run All Validators
 *
 * Runs all validators that enforce standards.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const validators = [
  { name: 'Design Tokens', script: 'design-tokens.js' },
  { name: 'Architecture', script: 'architecture-boundaries.js' },
  { name: 'File Naming', script: 'file-naming.js' },
  { name: 'Secrets', script: 'secret-scanner.js' },
  { name: 'Documentation Sync', script: 'documentation-sync.js' },
];

function isFreshProject() {
  return !fs.existsSync('Documentation/project-roadmap.md');
}

function main() {
  const fresh = isFreshProject();

  console.log('\n' + '='.repeat(50));
  console.log('  STANDARDS VALIDATION');
  console.log('='.repeat(50));

  if (fresh) {
    console.log('\n  Fresh project - run /Start_Project to initialize\n');
  }

  let passed = 0;
  let failed = 0;

  for (const v of validators) {
    console.log(`\n>> ${v.name}`);
    try {
      execSync(`node "${path.join(__dirname, v.script)}"`, { stdio: 'inherit' });
      passed++;
    } catch {
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`  Results: ${passed}/${validators.length} passed`);
  console.log('='.repeat(50) + '\n');

  process.exit(failed > 0 ? 1 : 0);
}

main();
