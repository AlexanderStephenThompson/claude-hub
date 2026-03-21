#!/usr/bin/env node

/**
 * Var-to-Let Fixer
 *
 * Replaces `var` declarations with `let` in JS/TS/JSX/TSX files.
 * Matches the same pattern as check.js `no-var` rule.
 *
 * Uses `let` (not `const`) as the safe universal replacement — `let`
 * is always a valid substitute for `var`, while `const` requires
 * verifying the variable is never reassigned. The code-improver agent
 * can upgrade `let` to `const` where appropriate during its judgment phase.
 *
 * String contents are stripped before matching to avoid false positives.
 *
 * Usage:
 *   node fix-var.js <path>            Fix all JS/TS files under <path>
 *   node fix-var.js file.js           Fix a single file
 *   node fix-var.js --dry-run <path>  Show what would change
 *
 * Exit: 0 = success, 1 = error
 */

'use strict';

const fs = require('fs');
const path = require('path');

const IGNORE = new Set(['node_modules', '.git', 'dist', 'build', '~Transfer']);
const JS_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx'];

/* Matches check.js: /\bvar\s+/.test(stripped) && /^\s*var\s/.test(stripped) */
const VAR_DECL_RE = /^\s*var\s/;

function findJsFiles(dir) {
    const results = [];
    function walk(current) {
        let entries;
        try { entries = fs.readdirSync(current, { withFileTypes: true }); } catch { return; }
        for (const entry of entries) {
            if (IGNORE.has(entry.name)) continue;
            const full = path.join(current, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (JS_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) results.push(full);
        }
    }
    walk(dir);
    return results;
}

function stripStrings(line) {
    return line
        .replace(/`[^`]*`/g, '``')
        .replace(/"[^"]*"/g, '""')
        .replace(/'[^']*'/g, "''");
}

function processFile(filePath) {
    const original = fs.readFileSync(filePath, 'utf8');
    const lines = original.split('\n');
    let fixCount = 0;
    let inBlockComment = false;

    const fixed = lines.map((line) => {
        const trimmed = line.trim();

        /* Track block comments */
        if (inBlockComment) {
            if (trimmed.includes('*/')) inBlockComment = false;
            return line;
        }
        if (trimmed.startsWith('/*') && !trimmed.includes('*/')) {
            inBlockComment = true;
            return line;
        }

        /* Skip single-line comments */
        if (trimmed.startsWith('//')) return line;

        /* Skip check-disable lines */
        if (/check-disable/.test(trimmed)) return line;

        const stripped = stripStrings(line);

        /* Match check.js: line starts with var (after whitespace) */
        if (VAR_DECL_RE.test(stripped) && /\bvar\s+/.test(stripped)) {
            fixCount++;
            /* Replace first occurrence of `var ` with `let ` */
            return line.replace(/\bvar\s/, 'let ');
        }

        return line;
    });

    const content = fixed.join('\n');
    return { content, modified: fixCount > 0, fixCount, original };
}

function main() {
    const args = process.argv.slice(2);
    let dryRun = false;
    const paths = [];

    for (const arg of args) {
        if (arg === '--dry-run') dryRun = true;
        else if (arg === '--help' || arg === '-h') {
            console.log('Usage: fix-var.js [--dry-run] <path|file> [...]');
            console.log('Replaces var declarations with let.');
            process.exit(0);
        } else paths.push(arg);
    }

    if (paths.length === 0) {
        console.error('Error: No path specified.');
        process.exit(1);
    }

    let files = [];
    for (const p of paths) {
        const resolved = path.resolve(p);
        let stat;
        try { stat = fs.statSync(resolved); } catch {
            console.error(`Error: Cannot access "${p}"`);
            process.exit(1);
        }
        if (stat.isDirectory()) files = files.concat(findJsFiles(resolved));
        else if (JS_EXTENSIONS.some((ext) => resolved.endsWith(ext))) files.push(resolved);
        else { console.error(`Error: Not a JS/TS file: "${p}"`); process.exit(1); }
    }

    if (files.length === 0) { console.log('No JS/TS files found.'); process.exit(0); }

    let modifiedCount = 0;
    let totalFixes = 0;

    for (const file of files) {
        const rel = path.relative(process.cwd(), file);
        const { content, modified, fixCount } = processFile(file);
        if (modified) {
            modifiedCount++;
            totalFixes += fixCount;
            if (dryRun) console.log(`WOULD FIX: ${rel} (${fixCount} var declarations)`);
            else {
                fs.writeFileSync(file, content, 'utf8');
                console.log(`FIXED: ${rel} (${fixCount} var declarations)`);
            }
        }
    }

    console.log('');
    if (dryRun) console.log(`Dry run: ${totalFixes} var declarations in ${modifiedCount} file(s) would be fixed.`);
    else console.log(`Done: ${totalFixes} var declarations replaced with let in ${modifiedCount} file(s).`);
}

main();
