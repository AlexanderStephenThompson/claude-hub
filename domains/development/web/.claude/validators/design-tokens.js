#!/usr/bin/env node

/**
 * Design Token Validator
 *
 * Ensures all CSS uses design tokens from /01-presentation/styles/global.css
 * Blocks hardcoded colors, spacing, fonts, shadows, border-radius, etc.
 *
 * Exit codes:
 * - 0: Pass (no violations)
 * - 1: Fail (violations found)
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const config = {
  // CSS files to check (exclude global.css itself)
  patterns: [
    '01-presentation/**/*.css',
    '02-logic/**/*.css',
    '03-data/**/*.css',
    '!01-presentation/styles/global.css',
    '!node_modules/**',
  ],

  // Rules for what's not allowed
  rules: {
    // No placeholder tokens (unconfigured project)
    placeholderTokens: {
      pattern: /var\(--[^)]*placeholder[^)]*\)/gi,
      message: 'Placeholder token not configured',
      suggestion: 'Run /Start_Project to configure design tokens, or replace with actual value',
    },

    // No hardcoded hex colors
    hexColors: {
      pattern: /:\s*#[0-9A-Fa-f]{3,8}\s*[;}]/g,
      message: 'Hardcoded hex color',
      suggestion: 'Use var(--color-*) from global.css',
    },

    // No rgb/rgba colors
    rgbColors: {
      pattern: /:\s*rgba?\([^)]+\)\s*[;}]/g,
      message: 'Hardcoded RGB color',
      suggestion: 'Use var(--color-*) from global.css',
    },

    // No hsl/hsla colors
    hslColors: {
      pattern: /:\s*hsla?\([^)]+\)\s*[;}]/g,
      message: 'Hardcoded HSL color',
      suggestion: 'Use var(--color-*) from global.css',
    },

    // No hardcoded pixel spacing (except 0)
    pixelSpacing: {
      pattern: /(margin|padding|gap|top|right|bottom|left):\s*[1-9]\d*px\s*[;}]/g,
      message: 'Hardcoded pixel spacing',
      suggestion: 'Use var(--space-*) from global.css',
    },

    // No hardcoded font sizes
    fontSize: {
      pattern: /font-size:\s*[1-9]\d*px\s*[;}]/g,
      message: 'Hardcoded font size',
      suggestion: 'Use var(--font-size-*) from global.css',
    },

    // No hardcoded border radius
    borderRadius: {
      pattern: /border-radius:\s*[1-9]\d*px\s*[;}]/g,
      message: 'Hardcoded border radius',
      suggestion: 'Use var(--radius-*) from global.css',
    },

    // No hardcoded box shadows
    boxShadow: {
      pattern: /box-shadow:\s*[0-9]/g,
      message: 'Hardcoded box shadow',
      suggestion: 'Use var(--shadow-*) from global.css',
    },
  },

  // Allowed exceptions
  exceptions: {
    // These patterns are okay
    zero: /:\s*0\s*[;}]/,              // 0 is fine
    percentage: /:\s*\d+%\s*[;}]/,      // Percentages are fine
    viewport: /:\s*\d+v[wh]\s*[;}]/,    // vw/vh are fine
    calc: /calc\([^)]+\)/,               // calc() is fine
    inherit: /:\s*inherit\s*[;}]/,      // inherit is fine
    auto: /:\s*auto\s*[;}]/,            // auto is fine
  },
};

// Main validation function
function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const violations = [];
  const lines = content.split('\n');

  // Check each rule
  for (const [ruleName, rule] of Object.entries(config.rules)) {
    let match;
    const rulePattern = new RegExp(rule.pattern.source, rule.pattern.flags);

    while ((match = rulePattern.exec(content)) !== null) {
      const violationText = match[0];

      // Check if this is an allowed exception
      let isException = false;
      for (const exceptionPattern of Object.values(config.exceptions)) {
        if (exceptionPattern.test(violationText)) {
          isException = true;
          break;
        }
      }

      if (!isException) {
        // Find line number
        const lineNumber = content.substring(0, match.index).split('\n').length;
        const lineContent = lines[lineNumber - 1].trim();

        // Skip if inside a CSS comment (line starts with * or is a comment line)
        if (lineContent.startsWith('*') || lineContent.startsWith('/*') || lineContent.startsWith('//')) {
          continue;
        }

        violations.push({
          file: filePath,
          line: lineNumber,
          content: lineContent,
          violation: violationText.trim(),
          rule: ruleName,
          message: rule.message,
          suggestion: rule.suggestion,
        });
      }
    }
  }

  return violations;
}

// Find all CSS files
function findCSSFiles() {
  const files = [];

  for (const pattern of config.patterns) {
    const matches = glob.sync(pattern, { nodir: true });
    files.push(...matches);
  }

  // Remove duplicates
  return [...new Set(files)];
}

// Main execution
function main() {
  console.log('🔍 Validating design tokens...\n');

  const files = findCSSFiles();

  if (files.length === 0) {
    console.log('ℹ️  No CSS files found to validate.');
    process.exit(0);
  }

  console.log(`Found ${files.length} CSS file(s) to check.\n`);

  let allViolations = [];

  for (const file of files) {
    const violations = validateFile(file);
    allViolations = allViolations.concat(violations);
  }

  if (allViolations.length === 0) {
    console.log('✅ PASS: Design Token Validator');
    console.log('   All CSS uses design tokens. No hardcoded values found.\n');
    process.exit(0);
  }

  // Group violations by file
  const violationsByFile = {};
  for (const violation of allViolations) {
    if (!violationsByFile[violation.file]) {
      violationsByFile[violation.file] = [];
    }
    violationsByFile[violation.file].push(violation);
  }

  // Print violations
  console.log(`❌ FAIL: Design Token Validator`);
  console.log(`   ${allViolations.length} violation(s) found:\n`);

  for (const [file, violations] of Object.entries(violationsByFile)) {
    console.log(`   📄 ${file}`);
    for (const v of violations) {
      console.log(`      Line ${v.line}: ${v.message}`);
      console.log(`      - ${v.content}`);
      console.log(`      ⚠️  ${v.suggestion}\n`);
    }
  }

  console.log('💡 Tip: All colors, spacing, fonts, etc. must use CSS variables from /01-presentation/styles/global.css');
  console.log('   Example: color: var(--color-primary) instead of color: #3B82F6\n');

  process.exit(1);
}

// Run
main();
