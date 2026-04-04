#!/usr/bin/env node

/**
 * HTML Doctype Adder
 *
 * Adds `<!DOCTYPE html>` to HTML files that are missing it.
 * Only targets .html files (not .jsx, .tsx, or other templates).
 *
 * Checks for an existing doctype after stripping any leading
 * whitespace and BOM characters. Skips empty files.
 *
 * Usage:
 *   node add-doctype.js <path>            Fix all HTML files under <path>
 *   node add-doctype.js file.html         Fix a single file
 *   node add-doctype.js --dry-run <path>  Show what would change
 *
 * Exit: 0 = success, 1 = error
 */

'use strict';

const fs = require('fs');
const path = require('path');

const IGNORE = new Set(['node_modules', '.git', 'dist', 'build', '~Transfer']);

/** Matches <!DOCTYPE (case-insensitive) at the start after optional whitespace/BOM */
const DOCTYPE_RE = /^(\uFEFF)?\s*<!doctype\s/i;

function findHtmlFiles(dir) {
    const results = [];
    function walk(current) {
        let entries;
        try { entries = fs.readdirSync(current, { withFileTypes: true }); } catch { return; }
        for (const entry of entries) {
            if (IGNORE.has(entry.name)) continue;
            const full = path.join(current, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith('.html')) results.push(full);
        }
    }
    walk(dir);
    return results;
}

function processFile(filePath) {
    const original = fs.readFileSync(filePath, 'utf8');

    /* Skip empty files */
    if (original.trim().length === 0) {
        return { content: original, modified: false, fixCount: 0, original };
    }

    /* Already has a doctype — nothing to do */
    if (DOCTYPE_RE.test(original)) {
        return { content: original, modified: false, fixCount: 0, original };
    }

    /* Prepend doctype, preserving any existing BOM */
    let content;
    if (original.charCodeAt(0) === 0xFEFF) {
        /* Keep BOM at position 0, insert doctype after it */
        content = '\uFEFF<!DOCTYPE html>\n' + original.slice(1);
    } else {
        content = '<!DOCTYPE html>\n' + original;
    }

    return { content, modified: true, fixCount: 1, original };
}

function main() {
    const args = process.argv.slice(2);
    let dryRun = false;
    const paths = [];

    for (const arg of args) {
        if (arg === '--dry-run') dryRun = true;
        else if (arg === '--help' || arg === '-h') {
            console.log('Usage: add-doctype.js [--dry-run] <path|file.html> [...]');
            console.log('Adds <!DOCTYPE html> to HTML files missing a doctype declaration.');
            process.exit(0);
        } else paths.push(arg);
    }

    if (paths.length === 0) {
        console.error('Error: No path specified. Usage: add-doctype.js <path>');
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
        if (stat.isDirectory()) files = files.concat(findHtmlFiles(resolved));
        else if (resolved.endsWith('.html')) files.push(resolved);
        else { console.error(`Error: Not an HTML file: "${p}"`); process.exit(1); }
    }

    if (files.length === 0) { console.log('No HTML files found.'); process.exit(0); }

    let modifiedCount = 0;

    for (const file of files) {
        const rel = path.relative(process.cwd(), file);
        const { content, modified } = processFile(file);
        if (modified) {
            modifiedCount++;
            if (dryRun) console.log(`WOULD FIX: ${rel} (missing doctype)`);
            else {
                fs.writeFileSync(file, content, 'utf8');
                console.log(`FIXED: ${rel} (added doctype)`);
            }
        }
    }

    const cleanCount = files.length - modifiedCount;
    console.log('');
    if (dryRun) console.log(`Dry run: ${modifiedCount} file(s) would be fixed, ${cleanCount} already clean.`);
    else console.log(`Done: ${modifiedCount} file(s) fixed, ${cleanCount} already clean.`);
}

main();
