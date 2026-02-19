#!/usr/bin/env node

/**
 * Debug Statement Stripper
 *
 * Removes console.log/warn/error/info/debug/trace/dir/table and debugger
 * statements from JS/TS/JSX/TSX files. Matches the same patterns as
 * check.js `no-console` and `no-debugger` rules.
 *
 * Handles multi-line console calls by tracking parenthesis depth.
 * Strips string contents before matching to avoid false positives
 * (same approach as check.js line 913-916).
 *
 * Usage:
 *   node strip-debug.js <path>            Fix all JS/TS files under <path>
 *   node strip-debug.js file.js           Fix a single file
 *   node strip-debug.js --dry-run <path>  Show what would change
 *
 * Exit: 0 = success, 1 = error
 */

'use strict';

const fs = require('fs');
const path = require('path');

const IGNORE = new Set(['node_modules', '.git', 'dist', 'build', '~Transfer']);
const JS_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx'];

const CONSOLE_RE = /\bconsole\.(log|warn|error|info|debug|trace|dir|table)\s*\(/;
const DEBUGGER_RE = /^\s*debugger\s*;?\s*$/;

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

/**
 * Strip string contents to avoid matching inside string literals.
 * Same approach as check.js: replace quoted content with empty quotes.
 */
function stripStrings(line) {
    return line
        .replace(/`[^`]*`/g, '``')
        .replace(/"[^"]*"/g, '""')
        .replace(/'[^']*'/g, "''");
}

function processFile(filePath) {
    const original = fs.readFileSync(filePath, 'utf8');
    const lines = original.split('\n');
    const result = [];
    let fixCount = 0;
    let inBlockComment = false;
    let skipDepth = 0; /* tracks paren depth for multi-line console removal */

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        /* Track block comments */
        if (inBlockComment) {
            if (trimmed.includes('*/')) inBlockComment = false;
            result.push(line);
            continue;
        }
        if (trimmed.startsWith('/*') && !trimmed.includes('*/')) {
            inBlockComment = true;
            result.push(line);
            continue;
        }

        /* Skip check-disable lines */
        if (/check-disable/.test(trimmed)) {
            result.push(line);
            continue;
        }

        /* If we're in a multi-line console call, count parens to find the end */
        if (skipDepth > 0) {
            for (const ch of line) {
                if (ch === '(') skipDepth++;
                else if (ch === ')') skipDepth--;
            }
            fixCount++; /* count continuation lines as part of the same fix */
            /* Remove trailing blank line left behind */
            continue;
        }

        /* Skip single-line comments */
        if (trimmed.startsWith('//')) {
            result.push(line);
            continue;
        }

        const stripped = stripStrings(line);

        /* ── debugger ── */
        if (DEBUGGER_RE.test(stripped)) {
            fixCount++;
            continue; /* remove the line */
        }

        /* ── console.xxx() ── */
        if (CONSOLE_RE.test(stripped)) {
            fixCount++;

            /* Check if the call is complete on this line */
            let depth = 0;
            let foundOpen = false;
            for (const ch of line) {
                if (ch === '(') { depth++; foundOpen = true; }
                else if (ch === ')') depth--;
            }

            if (foundOpen && depth > 0) {
                /* Multi-line call — skip until matching close paren */
                skipDepth = depth;
            }
            continue; /* remove the line */
        }

        result.push(line);
    }

    /* Clean up consecutive blank lines left by removals */
    const cleaned = [];
    for (let i = 0; i < result.length; i++) {
        if (result[i].trim() === '' && i > 0 && cleaned.length > 0 && cleaned[cleaned.length - 1].trim() === '') {
            continue; /* skip double blank lines */
        }
        cleaned.push(result[i]);
    }

    const content = cleaned.join('\n');
    return { content, modified: fixCount > 0, fixCount, original };
}

function main() {
    const args = process.argv.slice(2);
    let dryRun = false;
    const paths = [];

    for (const arg of args) {
        if (arg === '--dry-run') dryRun = true;
        else if (arg === '--help' || arg === '-h') {
            console.log('Usage: strip-debug.js [--dry-run] <path|file> [...]');
            console.log('Removes console.log/warn/error/... and debugger statements.');
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
            if (dryRun) console.log(`WOULD STRIP: ${rel} (${fixCount} statements)`);
            else {
                fs.writeFileSync(file, content, 'utf8');
                console.log(`STRIPPED: ${rel} (${fixCount} statements)`);
            }
        }
    }

    console.log('');
    if (dryRun) console.log(`Dry run: ${totalFixes} debug statements in ${modifiedCount} file(s) would be removed.`);
    else console.log(`Done: ${totalFixes} debug statements removed from ${modifiedCount} file(s).`);
}

main();
