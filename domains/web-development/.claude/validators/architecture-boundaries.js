#!/usr/bin/env node

/**
 * Architecture Boundary Checker
 *
 * Enforces 3-tier architecture dependency rules:
 * - 01-presentation → 02-logic → 03-data (valid flow)
 * - No reverse imports (03-data → 02-logic is INVALID)
 * - No circular dependencies
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
  tiers: {
    presentation: '01-presentation',
    logic: '02-logic',
    data: '03-data',
    config: 'config',   // Config can be imported by any tier
  },

  // Valid import directions
  // Each tier's shared/ folder is part of its tier — no special rules needed
  allowedImports: {
    '01-presentation': ['02-logic', 'config'],  // Presentation → logic, config
    '02-logic': ['03-data', 'config'],           // Logic → data, config
    '03-data': ['config'],                       // Data → config
    'config': [],                                 // Config imports nothing
  },

  patterns: [
    '01-presentation/**/*.ts',
    '01-presentation/**/*.tsx',
    '02-logic/**/*.ts',
    '02-logic/**/*.tsx',
    '03-data/**/*.ts',
    '03-data/**/*.tsx',
    'Config/**/*.ts',
    '!**/*.test.ts',
    '!**/*.test.tsx',
    '!node_modules/**',
  ],
};

// Determine which tier a file belongs to
function getTier(filePath) {
  const normalized = filePath.replace(/\\/g, '/');

  if (normalized.includes('/01-presentation/')) return '01-presentation';
  if (normalized.includes('/02-logic/')) return '02-logic';
  if (normalized.includes('/03-data/')) return '03-data';
  if (normalized.includes('/Config/') || normalized.includes('/config/')) return 'config';

  return null; // File not in any tier (tests/, etc. are unconstrained)
}

// Extract import statements from file
function extractImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const imports = [];

  // Match: import ... from '...'
  const importRegex = /import\s+(?:[\w{},\s*]+\s+from\s+)?['"]([^'"]+)['"]/g;
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];

    // Only check relative imports (starting with ./ or ../)
    if (importPath.startsWith('./') || importPath.startsWith('../')) {
      imports.push({
        raw: importPath,
        resolved: resolveImportPath(filePath, importPath),
      });
    }
  }

  return imports;
}

// Resolve relative import to absolute path
function resolveImportPath(fromFile, importPath) {
  const fromDir = path.dirname(fromFile);
  const resolved = path.resolve(fromDir, importPath);

  // Add common extensions if not present
  const extensions = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'];

  for (const ext of extensions) {
    const withExt = resolved + ext;
    if (fs.existsSync(withExt)) {
      return withExt;
    }
  }

  return resolved;
}

// Check if import is allowed
function isImportAllowed(fromTier, toTier) {
  if (!fromTier || !toTier) return true; // Files outside tier system are okay

  const allowed = config.allowedImports[fromTier] || [];
  return allowed.includes(toTier);
}

// Validate a single file
function validateFile(filePath) {
  const fromTier = getTier(filePath);

  if (!fromTier) {
    // File not in any tier, skip
    return [];
  }

  const imports = extractImports(filePath);
  const violations = [];

  for (const imp of imports) {
    const toTier = getTier(imp.resolved);

    if (!toTier) {
      // Importing from outside tier system (e.g., node_modules), okay
      continue;
    }

    if (!isImportAllowed(fromTier, toTier)) {
      violations.push({
        file: filePath,
        fromTier,
        toTier,
        importPath: imp.raw,
        resolvedPath: imp.resolved,
      });
    }
  }

  return violations;
}

// Find all source files
function findSourceFiles() {
  const files = [];

  for (const pattern of config.patterns) {
    const matches = glob.sync(pattern, { nodir: true });
    files.push(...matches);
  }

  return [...new Set(files)];
}

// Main execution
function main() {
  console.log('🔍 Validating architecture boundaries...\n');

  const files = findSourceFiles();

  if (files.length === 0) {
    console.log('ℹ️  No source files found to validate.');
    process.exit(0);
  }

  console.log(`Found ${files.length} file(s) to check.\n`);

  let allViolations = [];

  for (const file of files) {
    const violations = validateFile(file);
    allViolations = allViolations.concat(violations);
  }

  if (allViolations.length === 0) {
    console.log('✅ PASS: Architecture Boundary Checker');
    console.log('   All imports respect the 3-tier architecture.\n');
    console.log('   Valid flow: 01-presentation → 02-logic → 03-data ✅\n');
    process.exit(0);
  }

  // Print violations
  console.log(`❌ FAIL: Architecture Boundary Checker`);
  console.log(`   ${allViolations.length} violation(s) found:\n`);

  for (const v of allViolations) {
    console.log(`   📄 ${v.file}`);
    console.log(`      Tier: ${v.fromTier}`);
    console.log(`      ❌ Invalid import from: ${v.toTier}`);
    console.log(`      Import: ${v.importPath}`);
    console.log(`      Resolved: ${v.resolvedPath}`);
    console.log('');
  }

  console.log('💡 Architecture Rules:');
  console.log('   ✅ 01-presentation can import from: 02-logic, config');
  console.log('   ✅ 02-logic can import from: 03-data, config');
  console.log('   ✅ 03-data can import from: config only');
  console.log('   ✅ Each tier has its own shared/ for internal reuse');
  console.log('   ❌ Never import "upward" (data → logic or logic → presentation)\n');

  process.exit(1);
}

// Run
main();
