#!/usr/bin/env node

/**
 * Strict Equality Fixer
 *
 * Replaces == with === and != with !== in JS/TS/JSX/TSX files.
 * Skips == null and != null (idiomatic nullish checks).
 * Matches the same logic as check.js `no-double-equals` rule.
 *
 * String contents are stripped before matching to avoid false positives
 * (same approach as check.js line 913-916).
 *
 * Usage:
 *   node fix-double-equals.js <path>            Fix all JS/TS files under <path>
 *   node fix-double-equals.js file.js           Fix a single file
 *   node fix-double-equals.js --dry-run <path>  Show what would change
 *
 * Exit: 0 = success, 1 = error
 */

'use strict';

const fs = require('fs');
const path = require('path');

const IGNORE = new Set(['node_modules', '.git', 'dist', 'build', '~Transfer']);
const JS_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx'];

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

/**
 * Fix loose equality operators on a single line.
 *
 * Strategy: find == and != in the stripped version (no string contents),
 * then apply fixes at the same positions in the original line.
 * Skip == null and != null (idiomatic nullish check pattern).
 */
function fixLine(line) {
    const stripped = stripStrings(line);

    /* Match check.js pattern: [^!=<>](==|!=)[^=] */
    const matches = [];
    const re = /[^!=<>](==|!=)[^=]/g;
    let m;
    while ((m = re.exec(stripped)) !== null) {
        const op = m[1];
        const matchStart = m.index + 1; /* skip the leading char */

        /* Check for == null / != null (check.js allowance) */
        const after = stripped.substring(matchStart + op.length, matchStart + op.length + 10);
        if (/^\s*null\b/.test(after)) continue;

        matches.push({ index: matchStart, op });
    }

    if (matches.length === 0) return { line, fixCount: 0 };

    /* Apply replacements from right to left to preserve indices */
    let result = line;
    for (let i = matches.length - 1; i >= 0; i--) {
        const { index, op } = matches[i];
        result = result.substring(0, index) + op + '=' + result.substring(index + op.length);
    }

    return { line: result, fixCount: matches.length };
}

function processFile(filePath) {
    const original = fs.readFileSync(filePath, 'utf8');
    const lines = original.split('\n');
    let totalFixes = 0;
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

        const { line: fixedLine, fixCount } = fixLine(line);
        totalFixes += fixCount;
        return fixedLine;
    });

    const content = fixed.join('\n');
    return { content, modified: totalFixes > 0, fixCount: totalFixes, original };
}

function main() {
    const args = process.argv.slice(2);
    let dryRun = false;
    const paths = [];

    for (const arg of args) {
        if (arg === '--dry-run') dryRun = true;
        else if (arg === '--help' || arg === '-h') {
            console.log('Usage: fix-double-equals.js [--dry-run] <path|file> [...]');
            console.log('Replaces == with === and != with !== (skips == null).');
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
            if (dryRun) console.log(`WOULD FIX: ${rel} (${fixCount} operators)`);
            else {
                fs.writeFileSync(file, content, 'utf8');
                console.log(`FIXED: ${rel} (${fixCount} operators)`);
            }
        }
    }

    console.log('');
    if (dryRun) console.log(`Dry run: ${totalFixes} loose equality operators in ${modifiedCount} file(s) would be fixed.`);
    else console.log(`Done: ${totalFixes} loose equality operators fixed in ${modifiedCount} file(s).`);
}

main();
