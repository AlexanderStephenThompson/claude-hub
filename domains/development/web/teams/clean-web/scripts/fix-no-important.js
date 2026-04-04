#!/usr/bin/env node

/**
 * CSS !important Remover
 *
 * Removes `!important` flags from CSS declarations in .css files.
 * Preserves the rest of each declaration (semicolons, braces, whitespace).
 * Skips content inside block comments.
 *
 * Handles all variations:
 *   color: red !important;     → color: red;
 *   color: red !important }    → color: red }
 *   color: red !important\n    → color: red\n
 *   color: red!important;      → color: red;
 *
 * Usage:
 *   node fix-no-important.js <path>            Fix all CSS files under <path>
 *   node fix-no-important.js file.css          Fix a single file
 *   node fix-no-important.js --dry-run <path>  Show what would change
 *
 * Exit: 0 = success, 1 = error
 */

'use strict';

const fs = require('fs');
const path = require('path');

const IGNORE = new Set(['node_modules', '.git', 'dist', 'build', '~Transfer']);

/**
 * Matches ` !important` or `!important` (with optional leading whitespace).
 * Does NOT consume the semicolon, brace, or newline that follows.
 */
const IMPORTANT_RE = /\s*!important/g;

function findCssFiles(dir) {
    const results = [];
    function walk(current) {
        let entries;
        try { entries = fs.readdirSync(current, { withFileTypes: true }); } catch { return; }
        for (const entry of entries) {
            if (IGNORE.has(entry.name)) continue;
            const full = path.join(current, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith('.css')) results.push(full);
        }
    }
    walk(dir);
    return results;
}

function processFile(filePath) {
    const original = fs.readFileSync(filePath, 'utf8');
    const lines = original.split('\n');
    let fixCount = 0;
    let inBlockComment = false;

    const fixed = lines.map((line) => {
        const trimmed = line.trim();

        /* Track block comments — don't modify content inside them */
        if (inBlockComment) {
            if (trimmed.includes('*/')) inBlockComment = false;
            return line;
        }
        if (trimmed.startsWith('/*') && !trimmed.includes('*/')) {
            inBlockComment = true;
            return line;
        }

        /* Skip single-line block comments like: /* something */
        if (trimmed.startsWith('/*') && trimmed.includes('*/')) return line;

        /* Skip check-disable lines */
        if (/check-disable/.test(trimmed)) return line;

        /* Only process lines that contain !important */
        if (!IMPORTANT_RE.test(line)) return line;

        /* Reset regex lastIndex after test() */
        IMPORTANT_RE.lastIndex = 0;

        const matches = line.match(IMPORTANT_RE);
        if (matches) {
            fixCount += matches.length;
            return line.replace(IMPORTANT_RE, '');
        }

        return line;
    });

    return { content: fixed.join('\n'), modified: fixCount > 0, fixCount, original };
}

function main() {
    const args = process.argv.slice(2);
    let dryRun = false;
    const paths = [];

    for (const arg of args) {
        if (arg === '--dry-run') dryRun = true;
        else if (arg === '--help' || arg === '-h') {
            console.log('Usage: fix-no-important.js [--dry-run] <path|file.css> [...]');
            console.log('Removes !important flags from CSS declarations.');
            process.exit(0);
        } else paths.push(arg);
    }

    if (paths.length === 0) {
        console.error('Error: No path specified. Usage: fix-no-important.js <path>');
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
        if (stat.isDirectory()) files = files.concat(findCssFiles(resolved));
        else if (resolved.endsWith('.css')) files.push(resolved);
        else { console.error(`Error: Not a CSS file: "${p}"`); process.exit(1); }
    }

    if (files.length === 0) { console.log('No CSS files found.'); process.exit(0); }

    let modifiedCount = 0;
    let totalFixes = 0;

    for (const file of files) {
        const rel = path.relative(process.cwd(), file);
        const { content, modified, fixCount } = processFile(file);
        if (modified) {
            modifiedCount++;
            totalFixes += fixCount;
            if (dryRun) console.log(`WOULD FIX: ${rel} (${fixCount} !important flags)`);
            else {
                fs.writeFileSync(file, content, 'utf8');
                console.log(`FIXED: ${rel} (${fixCount} !important flags)`);
            }
        }
    }

    console.log('');
    if (dryRun) console.log(`Dry run: ${totalFixes} !important flags in ${modifiedCount} file(s) would be removed.`);
    else console.log(`Done: ${totalFixes} !important flags removed from ${modifiedCount} file(s).`);
}

main();
