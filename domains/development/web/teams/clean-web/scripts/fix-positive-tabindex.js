#!/usr/bin/env node

/**
 * Positive Tabindex Fixer
 *
 * Replaces positive tabindex values with 0. Positive tabindex breaks natural
 * tab order. Matches check.js `tabindex-no-positive` rule.
 *
 * Handles both HTML (tabindex="N") and JSX (tabIndex={N}) syntax.
 * Leaves tabindex="0" and tabindex="-1" untouched.
 *
 * Usage:
 *   node fix-positive-tabindex.js <path>            Fix all files under <path>
 *   node fix-positive-tabindex.js file.html         Fix a single file
 *   node fix-positive-tabindex.js --dry-run <path>  Show what would change
 *
 * Exit: 0 = success, 1 = error
 */

'use strict';

const fs = require('fs');
const path = require('path');

const IGNORE = new Set(['node_modules', '.git', 'dist', 'build', '~Transfer']);
const EXTENSIONS = ['.html', '.htm', '.jsx', '.tsx'];

function findFiles(dir) {
    const results = [];
    function walk(current) {
        let entries;
        try { entries = fs.readdirSync(current, { withFileTypes: true }); } catch { return; }
        for (const entry of entries) {
            if (IGNORE.has(entry.name)) continue;
            const full = path.join(current, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (EXTENSIONS.some((ext) => entry.name.endsWith(ext))) results.push(full);
        }
    }
    walk(dir);
    return results;
}

function processFile(filePath) {
    const original = fs.readFileSync(filePath, 'utf8');
    let fixCount = 0;

    /* HTML: tabindex="N" where N > 0 */
    let content = original.replace(/\btabindex\s*=\s*"(\d+)"/gi, (match, val) => {
        const n = parseInt(val, 10);
        if (n > 0) { fixCount++; return 'tabindex="0"'; }
        return match;
    });

    /* HTML: tabindex='N' where N > 0 */
    content = content.replace(/\btabindex\s*=\s*'(\d+)'/gi, (match, val) => {
        const n = parseInt(val, 10);
        if (n > 0) { fixCount++; return "tabindex='0'"; }
        return match;
    });

    /* JSX: tabIndex={N} where N > 0 */
    content = content.replace(/\btabIndex\s*=\s*\{(\d+)\}/g, (match, val) => {
        const n = parseInt(val, 10);
        if (n > 0) { fixCount++; return 'tabIndex={0}'; }
        return match;
    });

    return { content, modified: fixCount > 0, fixCount, original };
}

function main() {
    const args = process.argv.slice(2);
    let dryRun = false;
    const paths = [];

    for (const arg of args) {
        if (arg === '--dry-run') dryRun = true;
        else if (arg === '--help' || arg === '-h') {
            console.log('Usage: fix-positive-tabindex.js [--dry-run] <path|file> [...]');
            console.log('Replaces positive tabindex values with 0.');
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
        if (stat.isDirectory()) files = files.concat(findFiles(resolved));
        else if (EXTENSIONS.some((ext) => resolved.endsWith(ext))) files.push(resolved);
        else { console.error(`Error: Not an HTML/JSX/TSX file: "${p}"`); process.exit(1); }
    }

    if (files.length === 0) { console.log('No HTML/JSX/TSX files found.'); process.exit(0); }

    let modifiedCount = 0;
    let totalFixes = 0;

    for (const file of files) {
        const rel = path.relative(process.cwd(), file);
        const { content, modified, fixCount } = processFile(file);
        if (modified) {
            modifiedCount++;
            totalFixes += fixCount;
            if (dryRun) console.log(`WOULD FIX: ${rel} (${fixCount} tabindex values)`);
            else {
                fs.writeFileSync(file, content, 'utf8');
                console.log(`FIXED: ${rel} (${fixCount} tabindex values)`);
            }
        }
    }

    console.log('');
    if (dryRun) console.log(`Dry run: ${totalFixes} positive tabindex values in ${modifiedCount} file(s) would be set to 0.`);
    else console.log(`Done: ${totalFixes} positive tabindex values set to 0 in ${modifiedCount} file(s).`);
}

main();
