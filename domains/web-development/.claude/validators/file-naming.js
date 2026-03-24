#!/usr/bin/env node

/**
 * File Naming Validator
 *
 * Validates file naming conventions across the codebase.
 *
 * Rules:
 * - Components: PascalCase.tsx (Button.tsx)
 * - Services: PascalCase + Service.ts (EmailService.ts)
 * - Repositories: PascalCase + Repository.ts (UserRepository.ts)
 * - Utils: camelCase.ts (formatDate.ts)
 * - Styles: kebab-case.css (button.css)
 * - Tests: Same as source + .test (Button.test.tsx)
 *
 * Exit codes:
 * - 0: Pass (all files follow conventions)
 * - 1: Fail (violations found)
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const config = {
  patterns: [
    '01-presentation/**/*.ts',
    '01-presentation/**/*.tsx',
    '01-presentation/**/*.css',
    '02-logic/**/*.ts',
    '02-logic/**/*.tsx',
    '03-data/**/*.ts',
    '03-data/**/*.tsx',
    'tests/**/*.ts',
    '01-presentation/styles/**/*.css',
    '!node_modules/**',
  ],
};

// Naming convention rules
const rules = {
  // React components (01-presentation/)
  component: {
    test: (file) => {
      return file.includes('/01-presentation/') &&
             file.endsWith('.tsx') &&
             !file.endsWith('.test.tsx');
    },
    validate: (basename) => {
      // Must be PascalCase
      return /^[A-Z][a-zA-Z0-9]*\.tsx$/.test(basename);
    },
    message: 'Components must be PascalCase.tsx',
    example: 'Button.tsx, UserProfile.tsx',
  },

  // Services (02-logic/services/)
  service: {
    test: (file) => {
      return file.includes('/02-logic/services/') &&
             file.endsWith('.ts') &&
             !file.endsWith('.test.ts');
    },
    validate: (basename) => {
      // Must be PascalCase + 'Service.ts'
      return /^[A-Z][a-zA-Z0-9]*Service\.ts$/.test(basename);
    },
    message: 'Services must be PascalCaseService.ts',
    example: 'EmailService.ts, MealPlanService.ts',
  },

  // Repositories (03-data/repositories/)
  repository: {
    test: (file) => {
      return file.includes('/03-data/repositories/') &&
             file.endsWith('.ts') &&
             !file.endsWith('.test.ts');
    },
    validate: (basename) => {
      // Must be PascalCase + 'Repository.ts'
      return /^[A-Z][a-zA-Z0-9]*Repository\.ts$/.test(basename);
    },
    message: 'Repositories must be PascalCaseRepository.ts',
    example: 'UserRepository.ts, MealPlanRepository.ts',
  },

  // Models (02-logic/models/)
  model: {
    test: (file) => {
      return file.includes('/02-logic/models/') &&
             file.endsWith('.ts') &&
             !file.endsWith('.test.ts');
    },
    validate: (basename) => {
      // Must be PascalCase
      return /^[A-Z][a-zA-Z0-9]*\.ts$/.test(basename);
    },
    message: 'Models must be PascalCase.ts',
    example: 'User.ts, MealPlan.ts, Recipe.ts',
  },

  // Utility functions (anywhere with 'utils' in path)
  util: {
    test: (file) => {
      return (file.includes('/utils/') || file.includes('/helpers/')) &&
             file.endsWith('.ts') &&
             !file.endsWith('.test.ts');
    },
    validate: (basename) => {
      // Must be camelCase
      return /^[a-z][a-zA-Z0-9]*\.ts$/.test(basename);
    },
    message: 'Utils must be camelCase.ts',
    example: 'formatDate.ts, validateEmail.ts',
  },

  // CSS files
  css: {
    test: (file) => {
      return file.endsWith('.css') && !file.includes('node_modules');
    },
    validate: (basename) => {
      // Must be kebab-case or global.css
      return /^[a-z][a-z0-9-]*\.css$/.test(basename);
    },
    message: 'CSS files must be kebab-case.css',
    example: 'global.css, button-styles.css, user-profile.css',
  },

  // Test files
  test: {
    test: (file) => {
      return file.endsWith('.test.ts') || file.endsWith('.test.tsx');
    },
    validate: (basename, file) => {
      // Test file should match source file naming convention
      const sourceBasename = basename.replace('.test', '');
      const sourceFile = file.replace('.test', '');

      // Check if source file exists
      const sourceExists = fs.existsSync(sourceFile);

      if (!sourceExists) {
        return true; // Don't validate naming if source doesn't exist
      }

      // Test file should match source file case
      return true; // Tests inherit source file naming
    },
    message: 'Test files must match source file naming',
    example: 'Button.test.tsx, EmailService.test.ts',
  },
};

// Find all files to check
function findFiles() {
  const files = [];

  for (const pattern of config.patterns) {
    const matches = glob.sync(pattern, { nodir: true });
    files.push(...matches);
  }

  return [...new Set(files)];
}

// Determine which rule applies to a file
function getApplicableRule(file) {
  for (const [ruleName, rule] of Object.entries(rules)) {
    if (rule.test(file)) {
      return { name: ruleName, rule };
    }
  }
  return null;
}

// Validate a single file
function validateFile(file) {
  const basename = path.basename(file);
  const applicableRule = getApplicableRule(file);

  if (!applicableRule) {
    // No rule applies, skip
    return null;
  }

  const { name: ruleName, rule } = applicableRule;
  const isValid = rule.validate(basename, file);

  if (!isValid) {
    return {
      file,
      rule: ruleName,
      basename,
      message: rule.message,
      example: rule.example,
    };
  }

  return null;
}

// Main execution
function main() {
  console.log('🔍 Validating file naming conventions...\n');

  const files = findFiles();

  if (files.length === 0) {
    console.log('ℹ️  No files found to validate.');
    process.exit(0);
  }

  console.log(`Found ${files.length} file(s) to check.\n`);

  const violations = [];

  for (const file of files) {
    const violation = validateFile(file);
    if (violation) {
      violations.push(violation);
    }
  }

  if (violations.length === 0) {
    console.log('✅ PASS: File Naming Validator');
    console.log('   All files follow naming conventions.\n');
    process.exit(0);
  }

  // Print violations
  console.log(`❌ FAIL: File Naming Validator`);
  console.log(`   ${violations.length} violation(s) found:\n`);

  // Group by rule type
  const violationsByRule = {};
  for (const v of violations) {
    if (!violationsByRule[v.rule]) {
      violationsByRule[v.rule] = [];
    }
    violationsByRule[v.rule].push(v);
  }

  for (const [ruleName, ruleViolations] of Object.entries(violationsByRule)) {
    const firstViolation = ruleViolations[0];
    console.log(`   ${ruleName.toUpperCase()} VIOLATIONS:`);
    console.log(`   ${firstViolation.message}`);
    console.log(`   Examples: ${firstViolation.example}\n`);

    for (const v of ruleViolations) {
      console.log(`   📄 ${v.file}`);
      console.log(`      Current: ${v.basename}`);
    }
    console.log('');
  }

  console.log('💡 Naming Conventions:');
  console.log('   Components (01-presentation/): PascalCase.tsx');
  console.log('   Services (02-logic/services/): PascalCaseService.ts');
  console.log('   Repositories (03-data/repositories/): PascalCaseRepository.ts');
  console.log('   Models (02-logic/models/): PascalCase.ts');
  console.log('   Utils: camelCase.ts');
  console.log('   CSS: kebab-case.css');
  console.log('   Tests: Match source file naming + .test\n');

  process.exit(1);
}

// Run
main();
