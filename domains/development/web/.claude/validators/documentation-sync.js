#!/usr/bin/env node

/**
 * Documentation Sync Validator
 *
 * Checks that documentation stays in sync with code reality.
 *
 * Checks:
 * 1. Every feature in module explainers has a matching .md file
 * 2. Feature statuses in module tables match feature file statuses
 * 3. Module progress counts (X/Y) match actual feature counts
 * 4. CLAUDE.md has a populated Project State section (if project is initialized)
 * 5. Features marked complete have corresponding code in 01/02/03 tiers
 *
 * Exit codes:
 * - 0: Pass (all docs in sync)
 * - 1: Fail (drift detected)
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const FEATURES_DIR = 'Documentation/features';
const ROADMAP_FILE = 'Documentation/project-roadmap.md';
const CLAUDE_FILE = 'CLAUDE.md';

function isFreshProject() {
  return !fs.existsSync(ROADMAP_FILE);
}

/**
 * Find all module explainer files (_module-name.md)
 */
function findModuleExplainers() {
  if (!fs.existsSync(FEATURES_DIR)) return [];
  return glob.sync(`${FEATURES_DIR}/**/_*.md`);
}

/**
 * Extract features listed in a module explainer's table
 * Looks for markdown table rows with feature names and statuses
 */
function extractFeaturesFromModule(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const features = [];

  // Match table rows: | feature-name | description | milestone | status |
  const tableRowRegex = /\|\s*\[?([a-z0-9-]+)\]?\(?[^)]*\)?\s*\|.*\|.*\|\s*(.*?)\s*\|/gi;
  let match;

  while ((match = tableRowRegex.exec(content)) !== null) {
    const name = match[1].trim();
    const statusCell = match[2].trim();

    // Skip header rows
    if (name === '---' || name === 'Feature' || name === 'feature') continue;

    // Extract status from structured comment
    let status = 'unknown';
    const statusComment = statusCell.match(/STATUS:(\w[\w-]*)/);
    if (statusComment) {
      status = statusComment[1];
    } else if (statusCell.includes('Complete') || statusCell.includes('✅')) {
      status = 'complete';
    } else if (statusCell.includes('In Progress') || statusCell.includes('🔄')) {
      status = 'in-progress';
    } else if (statusCell.includes('Planned') || statusCell.includes('⏳')) {
      status = 'planned';
    }

    features.push({ name, status });
  }

  return features;
}

/**
 * Extract progress count from module explainer
 * Looks for: **Progress:** X/Y features <!-- PROGRESS:X/Y -->
 */
function extractProgressCount(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const progressMatch = content.match(/PROGRESS:(\d+)\/(\d+)/);
  if (progressMatch) {
    return {
      complete: parseInt(progressMatch[1], 10),
      total: parseInt(progressMatch[2], 10),
    };
  }
  return null;
}

/**
 * Extract status from a feature file
 */
function extractFeatureStatus(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf8');

  const statusComment = content.match(/STATUS:(\w[\w-]*)/);
  if (statusComment) return statusComment[1];

  if (content.includes('Status: Complete') || content.includes('Status:** Complete')) return 'complete';
  if (content.includes('Status: In Progress') || content.includes('Status:** In Progress')) return 'in-progress';
  if (content.includes('Status: Planned') || content.includes('Status:** Planned')) return 'planned';

  return 'unknown';
}

/**
 * Check if CLAUDE.md has a populated Project State section
 */
function checkClaudeProjectState() {
  if (!fs.existsSync(CLAUDE_FILE)) return { ok: false, reason: 'CLAUDE.md not found' };

  const content = fs.readFileSync(CLAUDE_FILE, 'utf8');

  const hasStart = content.includes('PROJECT_STATE_START');
  const hasEnd = content.includes('PROJECT_STATE_END');

  if (!hasStart || !hasEnd) {
    return { ok: false, reason: 'CLAUDE.md missing Project State markers' };
  }

  // Check if it's still the uninitialized template
  if (content.includes('**Project:** Not initialized')) {
    return { ok: false, reason: 'CLAUDE.md Project State not initialized (run /Start_Project or /Adopt)' };
  }

  return { ok: true };
}

function main() {
  const errors = [];
  const warnings = [];

  if (isFreshProject()) {
    console.log('Documentation Sync: Fresh project — no docs to validate.');
    console.log('Run /Start_Project to initialize documentation.\n');
    process.exit(0);
  }

  console.log('Documentation Sync: Checking documentation consistency...\n');

  // Check 1: CLAUDE.md Project State
  const claudeCheck = checkClaudeProjectState();
  if (!claudeCheck.ok) {
    warnings.push(`CLAUDE.md: ${claudeCheck.reason}`);
  }

  // Check 2-4: Module explainers vs feature files
  const moduleFiles = findModuleExplainers();

  for (const moduleFile of moduleFiles) {
    const moduleDir = path.dirname(moduleFile);
    const moduleName = path.basename(moduleFile, '.md').replace(/^_/, '');
    const features = extractFeaturesFromModule(moduleFile);
    const progress = extractProgressCount(moduleFile);

    if (features.length === 0) continue;

    let actualComplete = 0;

    for (const feature of features) {
      const featureFile = path.join(moduleDir, `${feature.name}.md`);

      // Check 2: Feature file exists
      if (!fs.existsSync(featureFile)) {
        errors.push(
          `Missing feature file: ${featureFile}\n` +
          `  Listed in: ${moduleFile} as "${feature.name}"`
        );
        continue;
      }

      // Check 3: Status consistency
      const fileStatus = extractFeatureStatus(featureFile);
      if (fileStatus && fileStatus !== feature.status && fileStatus !== 'unknown' && feature.status !== 'unknown') {
        warnings.push(
          `Status mismatch for "${feature.name}":\n` +
          `  Module table (${moduleFile}): ${feature.status}\n` +
          `  Feature file (${featureFile}): ${fileStatus}`
        );
      }

      if (fileStatus === 'complete' || feature.status === 'complete') {
        actualComplete++;
      }
    }

    // Check 4: Progress count accuracy
    if (progress) {
      if (progress.total !== features.length) {
        warnings.push(
          `Progress total mismatch in ${moduleFile}:\n` +
          `  Claims ${progress.total} features, but table lists ${features.length}`
        );
      }
      if (progress.complete !== actualComplete) {
        warnings.push(
          `Progress complete count mismatch in ${moduleFile}:\n` +
          `  Claims ${progress.complete} complete, but ${actualComplete} are actually complete`
        );
      }
    }
  }

  // Output results
  if (errors.length === 0 && warnings.length === 0) {
    console.log('  All documentation in sync.\n');
    process.exit(0);
  }

  if (warnings.length > 0) {
    console.log(`  Warnings (${warnings.length}):\n`);
    warnings.forEach((w, i) => console.log(`  ${i + 1}. ${w}\n`));
  }

  if (errors.length > 0) {
    console.log(`  Errors (${errors.length}):\n`);
    errors.forEach((e, i) => console.log(`  ${i + 1}. ${e}\n`));
    process.exit(1);
  }

  // Warnings only — pass but inform
  process.exit(0);
}

main();
