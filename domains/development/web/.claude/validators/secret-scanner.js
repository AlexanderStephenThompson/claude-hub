#!/usr/bin/env node

/**
 * Secret Scanner
 *
 * Scans for hardcoded secrets and sensitive data.
 *
 * Detects:
 * - API keys
 * - Passwords
 * - Tokens
 * - Private keys
 * - AWS credentials
 * - Database connection strings with passwords
 *
 * Exit codes:
 * - 0: Pass (no secrets found)
 * - 1: Fail (secrets detected)
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const config = {
  patterns: [
    '01-presentation/**/*.ts',
    '01-presentation/**/*.tsx',
    '01-presentation/**/*.js',
    '01-presentation/**/*.jsx',
    '02-logic/**/*.ts',
    '02-logic/**/*.tsx',
    '02-logic/**/*.js',
    '03-data/**/*.ts',
    '03-data/**/*.tsx',
    '03-data/**/*.js',
    'Config/**/*.ts',
    'Config/**/*.js',
    '!node_modules/**',
    '!**/*.test.ts',
    '!**/*.test.tsx',
  ],

  // Secret detection patterns
  secretPatterns: [
    {
      name: 'API Key',
      pattern: /(api[_-]?key|apikey)\s*[:=]\s*['"][^'"]{20,}['"]/gi,
      severity: 'high',
    },
    {
      name: 'Secret Key',
      pattern: /(secret[_-]?key|secretkey)\s*[:=]\s*['"][^'"]{20,}['"]/gi,
      severity: 'high',
    },
    {
      name: 'Password',
      pattern: /(password|passwd|pwd)\s*[:=]\s*['"][^'"]{3,}['"]/gi,
      severity: 'high',
    },
    {
      name: 'Auth Token',
      pattern: /(auth[_-]?token|authtoken|bearer)\s*[:=]\s*['"][^'"]{20,}['"]/gi,
      severity: 'high',
    },
    {
      name: 'Private Key',
      pattern: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/gi,
      severity: 'critical',
    },
    {
      name: 'AWS Access Key',
      pattern: /(AWS|aws)_?ACCESS_?KEY_?ID\s*[:=]\s*['"][A-Z0-9]{20}['"]/gi,
      severity: 'critical',
    },
    {
      name: 'AWS Secret Key',
      pattern: /(AWS|aws)_?SECRET_?ACCESS_?KEY\s*[:=]\s*['"][A-Za-z0-9/+=]{40}['"]/gi,
      severity: 'critical',
    },
    {
      name: 'GitHub Token',
      pattern: /(github|gh)_?token\s*[:=]\s*['"]ghp_[a-zA-Z0-9]{36}['"]/gi,
      severity: 'critical',
    },
    {
      name: 'Database Connection String',
      pattern: /(mongodb|mysql|postgres|postgresql):\/\/[^:]+:[^@]+@/gi,
      severity: 'high',
    },
    {
      name: 'JWT Token',
      pattern: /eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/g,
      severity: 'medium',
    },
  ],

  // Patterns that are ALLOWED (false positives)
  allowedPatterns: [
    /process\.env\./,                          // Environment variables (OK)
    /import\.meta\.env\./,                     // Vite env variables (OK)
    /['"]password['"]\s*[:=]\s*['"]['"]$/,    // Empty strings (OK)
    /['"]api[_-]?key['"]\s*[:=]\s*['"]['"]$/, // Empty strings (OK)
    /\/\/ password:/i,                         // Comments (OK for examples)
    /\/\* password:/i,                         // Block comments (OK)
    /\* @param password/i,                     // JSDoc params (OK)
    /placeholder/i,                            // Placeholder values (OK)
    /example/i,                                // Example values (OK)
    /your[_-]?api[_-]?key/i,                  // Template placeholders (OK)
    /YOUR_API_KEY/,                            // Template constants (OK)
  ],
};

// Find all files to scan
function findFiles() {
  const files = [];

  for (const pattern of config.patterns) {
    const matches = glob.sync(pattern, { nodir: true });
    files.push(...matches);
  }

  return [...new Set(files)];
}

// Check if a match is allowed (false positive)
function isAllowedMatch(line, match) {
  // Check if line contains any allowed patterns
  return config.allowedPatterns.some(pattern => pattern.test(line));
}

// Scan a file for secrets
function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const secrets = [];

  for (const secretDef of config.secretPatterns) {
    const pattern = new RegExp(secretDef.pattern.source, secretDef.pattern.flags);
    let match;

    while ((match = pattern.exec(content)) !== null) {
      // Find line number
      const lineNumber = content.substring(0, match.index).split('\n').length;
      const line = lines[lineNumber - 1];

      // Check if this is a false positive
      if (!isAllowedMatch(line, match[0])) {
        secrets.push({
          file: filePath,
          line: lineNumber,
          content: line.trim(),
          secretType: secretDef.name,
          severity: secretDef.severity,
          match: match[0].substring(0, 50) + (match[0].length > 50 ? '...' : ''),
        });
      }
    }
  }

  return secrets;
}

// Main execution
function main() {
  console.log('🔍 Scanning for hardcoded secrets...\n');

  const files = findFiles();

  if (files.length === 0) {
    console.log('ℹ️  No files found to scan.');
    process.exit(0);
  }

  console.log(`Scanning ${files.length} file(s)...\n`);

  let allSecrets = [];

  for (const file of files) {
    const secrets = scanFile(file);
    allSecrets = allSecrets.concat(secrets);
  }

  if (allSecrets.length === 0) {
    console.log('✅ PASS: Secret Scanner');
    console.log('   No hardcoded secrets detected.\n');
    process.exit(0);
  }

  // Print violations
  console.log(`❌ FAIL: Secret Scanner`);
  console.log(`   ${allSecrets.length} potential secret(s) detected:\n`);

  // Group by severity
  const critical = allSecrets.filter(s => s.severity === 'critical');
  const high = allSecrets.filter(s => s.severity === 'high');
  const medium = allSecrets.filter(s => s.severity === 'medium');

  if (critical.length > 0) {
    console.log(`   🚨 CRITICAL (${critical.length}):`);
    for (const secret of critical) {
      console.log(`      📄 ${secret.file}:${secret.line}`);
      console.log(`         Type: ${secret.secretType}`);
      console.log(`         Line: ${secret.content}`);
      console.log('');
    }
  }

  if (high.length > 0) {
    console.log(`   ⚠️  HIGH (${high.length}):`);
    for (const secret of high) {
      console.log(`      📄 ${secret.file}:${secret.line}`);
      console.log(`         Type: ${secret.secretType}`);
      console.log(`         Line: ${secret.content}`);
      console.log('');
    }
  }

  if (medium.length > 0) {
    console.log(`   ℹ️  MEDIUM (${medium.length}):`);
    for (const secret of medium) {
      console.log(`      📄 ${secret.file}:${secret.line}`);
      console.log(`         Type: ${secret.secretType}`);
      console.log(`         Line: ${secret.content}`);
      console.log('');
    }
  }

  console.log('💡 How to Fix:');
  console.log('   ✅ Use environment variables: process.env.API_KEY');
  console.log('   ✅ Store secrets in .env file (add to .gitignore)');
  console.log('   ✅ Use secret management tools (AWS Secrets Manager, etc.)');
  console.log('   ❌ NEVER commit secrets to version control\n');

  console.log('📚 Allowed Patterns:');
  console.log('   ✅ process.env.API_KEY');
  console.log('   ✅ const apiKey = ""  (empty strings OK)');
  console.log('   ✅ // Example: password: "xyz"  (comments OK)');
  console.log('   ✅ placeholder or example values\n');

  process.exit(1);
}

// Run
main();
