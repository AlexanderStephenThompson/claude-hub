#!/usr/bin/env node

/**
 * Button Type Fixer
 *
 * Adds `type="button"` to <button> elements that don't have a type attribute.
 * Prevents accidental form submissions. Matches check.js `button-type-required` rule.
 *
 * Handles HTML, JSX, and TSX files. Skips buttons that already have type=.
 *
 * Usage:
 *   node fix-button-type.js <path>            Fix all files under <path>
 *   node fix-button-type.js file.html         Fix a single file
 *   node fix-button-type.js --dry-run <path>  Show what would change
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

/**
 * Process a file and add type="button" to <button> tags missing a type attribute.
 *
 * Strategy: match <button...> tags (potentially multiline) that don't already
 * contain a type= attribute, and insert type="button" after <button.
 */
function processFile(filePath) {
    const original = fs.readFileSync(filePath, 'utf8');

    /* Match <button with optional attributes up to >. Multiline-safe. */
    const BUTTON_TAG_RE = /<button\b([^>]*)>/gi;

    let fixCount = 0;
    const content = original.replace(BUTTON_TAG_RE, (match, attrs) => {
        /* Skip if type= already present */
        if (/\btype\s*=/i.test(attrs)) return match;

        /* Skip if inside a comment */
        const beforeMatch = original.substring(0, original.indexOf(match));
        const lastCommentOpen = beforeMatch.lastIndexOf('<!--');
        const lastCommentClose = beforeMatch.lastIndexOf('-->');
        if (lastCommentOpen > lastCommentClose) return match;

        fixCount++;
        return `<button type="button"${attrs}>`;
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
            console.log('Usage: fix-button-type.js [--dry-run] <path|file> [...]');
            console.log('Adds type="button" to <button> elements missing a type attribute.');
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
            if (dryRun) console.log(`WOULD FIX: ${rel} (${fixCount} buttons)`);
            else {
                fs.writeFileSync(file, content, 'utf8');
                console.log(`FIXED: ${rel} (${fixCount} buttons)`);
            }
        }
    }

    console.log('');
    if (dryRun) console.log(`Dry run: ${totalFixes} buttons in ${modifiedCount} file(s) would get type="button".`);
    else console.log(`Done: ${totalFixes} buttons fixed in ${modifiedCount} file(s).`);
}

main();
