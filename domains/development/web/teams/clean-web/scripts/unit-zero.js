#!/usr/bin/env node

/**
 * CSS Unit-Zero Fixer
 *
 * Replaces redundant units on zero values: 0px → 0, 0em → 0, 0rem → 0, etc.
 * Matches the same pattern as check.js `unit-zero` rule.
 *
 * Safe units to strip: px, em, rem, %, vh, vw, vmin, vmax, ch, ex
 * (Time units like 0s/0ms are left alone — some contexts require them.)
 *
 * Usage:
 *   node unit-zero.js <path>            Fix all .css files under <path>
 *   node unit-zero.js file.css          Fix a single file
 *   node unit-zero.js --dry-run <path>  Show what would change without writing
 *
 * Exit: 0 = success, 1 = error
 */

'use strict';

const fs = require('fs');
const path = require('path');

const IGNORE = new Set(['node_modules', '.git', 'dist', 'build', '~Transfer']);

/* Matches check.js unit-zero: \b0(px|em|rem|%|vh|vw|vmin|vmax|ch|ex)\b */
const UNIT_ZERO_RE = /\b0(px|em|rem|%|vh|vw|vmin|vmax|ch|ex)\b/g;

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

    const fixed = lines.map((line) => {
        const trimmed = line.trim();

        /* Skip comments */
        if (trimmed.startsWith('/*') || trimmed.startsWith('*')) return line;

        /* Skip custom property definitions — they may define token values */
        if (/^\s*--[\w-]+\s*:/.test(line)) return line;

        /* Skip check-disable lines */
        if (/check-disable/.test(line)) return line;

        /* Replace 0px/0em/0rem/etc. with 0 on declaration lines */
        if (line.includes(':')) {
            const colonIdx = line.indexOf(':');
            const before = line.substring(0, colonIdx + 1);
            const after = line.substring(colonIdx + 1);
            const replaced = after.replace(UNIT_ZERO_RE, '0');
            if (replaced !== after) {
                fixCount += (after.match(UNIT_ZERO_RE) || []).length;
                return before + replaced;
            }
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
            console.log('Usage: unit-zero.js [--dry-run] <path|file.css> [...]');
            console.log('Replaces 0px/0em/0rem/etc. with unitless 0 in CSS files.');
            process.exit(0);
        } else paths.push(arg);
    }

    if (paths.length === 0) {
        console.error('Error: No path specified. Usage: unit-zero.js <path>');
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
            if (dryRun) console.log(`WOULD FIX: ${rel} (${fixCount} units)`);
            else {
                fs.writeFileSync(file, content, 'utf8');
                console.log(`FIXED: ${rel} (${fixCount} units)`);
            }
        }
    }

    console.log('');
    if (dryRun) console.log(`Dry run: ${totalFixes} redundant units in ${modifiedCount} file(s) would be fixed.`);
    else console.log(`Done: ${totalFixes} redundant units fixed in ${modifiedCount} file(s).`);
}

main();
