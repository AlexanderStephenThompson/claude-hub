#!/usr/bin/env node

/**
 * CSS Import Order Fixer
 *
 * Reorders @import statements in CSS files and <link rel="stylesheet"> tags
 * in HTML files to match the canonical cascade order:
 *   reset → global → layouts → components → overrides
 *
 * Matches the same logic as check.js `css-import-order` rule.
 * Non-canonical imports keep their relative order, placed between
 * the last matched canonical import and the next one.
 *
 * Usage:
 *   node fix-imports-order.js <path>            Fix all files under <path>
 *   node fix-imports-order.js file.css           Fix a single file
 *   node fix-imports-order.js --dry-run <path>   Show what would change
 *
 * Exit: 0 = success, 1 = error
 */

'use strict';

const fs = require('fs');
const path = require('path');

const IGNORE = new Set(['node_modules', '.git', 'dist', 'build', '~Transfer']);

/* Canonical cascade order — matches check.js CSS_CASCADE_ORDER */
const CASCADE_ORDER = ['reset', 'global', 'layouts', 'components', 'overrides'];
const CASCADE_MAP = new Map(CASCADE_ORDER.map((name, i) => [name, i]));

function findFiles(dir) {
    const results = [];
    function walk(current) {
        let entries;
        try { entries = fs.readdirSync(current, { withFileTypes: true }); } catch { return; }
        for (const entry of entries) {
            if (IGNORE.has(entry.name)) continue;
            const full = path.join(current, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (/\.(css|html?)$/.test(entry.name)) results.push(full);
        }
    }
    walk(dir);
    return results;
}

/**
 * Extract the canonical position of an import/link reference.
 * Returns the cascade index (0-4) or -1 if not canonical.
 */
function getCascadePosition(ref) {
    const basename = path.basename(ref, '.css');
    const pos = CASCADE_MAP.get(basename);
    return pos !== undefined ? pos : -1;
}

/**
 * Sort a group of consecutive @import lines by cascade order.
 */
function sortCssImports(lines) {
    const importRe = /@import\s+(?:url\(\s*)?['"]([^'"]+)['"]/;
    const importLines = [];
    const preamble = []; /* non-import lines before the first import (comments, blank) */
    let foundFirst = false;

    for (const line of lines) {
        const match = line.match(importRe);
        if (match) {
            foundFirst = true;
            importLines.push({ line, ref: match[1], pos: getCascadePosition(match[1]) });
        } else if (!foundFirst) {
            preamble.push(line);
        }
    }

    if (importLines.length <= 1) return null; /* nothing to sort */

    /* Check if already sorted */
    let needsSort = false;
    for (let i = 1; i < importLines.length; i++) {
        const prevPos = importLines[i - 1].pos;
        const currPos = importLines[i].pos;
        if (prevPos >= 0 && currPos >= 0 && currPos < prevPos) {
            needsSort = true;
            break;
        }
    }
    if (!needsSort) return null;

    /* Stable sort: canonical imports by position, non-canonical keep relative order */
    const canonical = importLines.filter((x) => x.pos >= 0).sort((a, b) => a.pos - b.pos);
    const nonCanonical = importLines.filter((x) => x.pos < 0);

    /* Interleave: canonical first, then non-canonical at the end (before overrides if present) */
    const overridesIdx = canonical.findIndex((x) => x.pos === 4);
    const sorted = [];

    if (overridesIdx >= 0) {
        /* Insert non-canonical before overrides */
        sorted.push(...canonical.slice(0, overridesIdx));
        sorted.push(...nonCanonical);
        sorted.push(...canonical.slice(overridesIdx));
    } else {
        sorted.push(...canonical);
        sorted.push(...nonCanonical);
    }

    return [...preamble, ...sorted.map((x) => x.line)];
}

/**
 * Sort <link rel="stylesheet"> tags in an HTML file.
 */
function sortHtmlLinks(content) {
    const lines = content.split('\n');
    const linkRe = /<link\s[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/i;
    const linkAltRe = /<link\s[^>]*href=["']([^"']+)["'][^>]*rel=["']stylesheet["']/i;

    /* Find consecutive groups of link lines */
    let modified = false;
    const result = [];
    let linkGroup = [];
    let inGroup = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(linkRe) || line.match(linkAltRe);

        if (match) {
            linkGroup.push({ line, ref: match[1], pos: getCascadePosition(match[1]) });
            inGroup = true;
        } else {
            if (inGroup && linkGroup.length > 1) {
                /* Check if this group needs sorting */
                let needsSort = false;
                for (let j = 1; j < linkGroup.length; j++) {
                    const prev = linkGroup[j - 1].pos;
                    const curr = linkGroup[j].pos;
                    if (prev >= 0 && curr >= 0 && curr < prev) {
                        needsSort = true;
                        break;
                    }
                }

                if (needsSort) {
                    modified = true;
                    const canonical = linkGroup.filter((x) => x.pos >= 0).sort((a, b) => a.pos - b.pos);
                    const nonCanonical = linkGroup.filter((x) => x.pos < 0);
                    const overridesIdx = canonical.findIndex((x) => x.pos === 4);

                    if (overridesIdx >= 0) {
                        result.push(...canonical.slice(0, overridesIdx).map((x) => x.line));
                        result.push(...nonCanonical.map((x) => x.line));
                        result.push(...canonical.slice(overridesIdx).map((x) => x.line));
                    } else {
                        result.push(...canonical.map((x) => x.line));
                        result.push(...nonCanonical.map((x) => x.line));
                    }
                } else {
                    result.push(...linkGroup.map((x) => x.line));
                }
                linkGroup = [];
                inGroup = false;
            } else if (linkGroup.length === 1) {
                result.push(linkGroup[0].line);
                linkGroup = [];
                inGroup = false;
            }
            result.push(line);
        }
    }

    /* Flush remaining group */
    if (linkGroup.length > 0) {
        result.push(...linkGroup.map((x) => x.line));
    }

    return { content: result.join('\n'), modified };
}

function processCssFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    /* Collect consecutive @import lines (including interspersed blank/comment lines) */
    const importRe = /@import\s+(?:url\(\s*)?['"]([^'"]+)['"]/;
    const importGroup = [];
    const beforeImports = [];
    const afterImports = [];
    let phase = 'before'; /* before | imports | after */

    for (const line of lines) {
        if (phase === 'before') {
            if (importRe.test(line)) {
                phase = 'imports';
                importGroup.push(line);
            } else {
                beforeImports.push(line);
            }
        } else if (phase === 'imports') {
            if (importRe.test(line) || line.trim() === '' || line.trim().startsWith('/*')) {
                importGroup.push(line);
            } else {
                phase = 'after';
                afterImports.push(line);
            }
        } else {
            afterImports.push(line);
        }
    }

    if (importGroup.length <= 1) return { content, modified: false };

    const sorted = sortCssImports(importGroup);
    if (!sorted) return { content, modified: false };

    const result = [...beforeImports, ...sorted, ...afterImports].join('\n');
    return { content: result, modified: result !== content };
}

function processFile(filePath) {
    if (filePath.endsWith('.css')) return processCssFile(filePath);
    if (/\.html?$/.test(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        return sortHtmlLinks(content);
    }
    return { content: '', modified: false };
}

function main() {
    const args = process.argv.slice(2);
    let dryRun = false;
    const paths = [];

    for (const arg of args) {
        if (arg === '--dry-run') dryRun = true;
        else if (arg === '--help' || arg === '-h') {
            console.log('Usage: fix-imports-order.js [--dry-run] <path|file> [...]');
            console.log('Reorders CSS @import and HTML <link> tags to cascade order:');
            console.log('  reset → global → layouts → components → overrides');
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
        else if (/\.(css|html?)$/.test(resolved)) files.push(resolved);
        else { console.error(`Error: Not a CSS or HTML file: "${p}"`); process.exit(1); }
    }

    if (files.length === 0) { console.log('No CSS/HTML files found.'); process.exit(0); }

    let modifiedCount = 0;

    for (const file of files) {
        const rel = path.relative(process.cwd(), file);
        const { content, modified } = processFile(file);
        if (modified) {
            modifiedCount++;
            if (dryRun) console.log(`WOULD REORDER: ${rel}`);
            else {
                fs.writeFileSync(file, content, 'utf8');
                console.log(`REORDERED: ${rel}`);
            }
        }
    }

    console.log('');
    if (dryRun) console.log(`Dry run: ${modifiedCount} file(s) would be reordered.`);
    else console.log(`Done: ${modifiedCount} file(s) reordered.`);
}

main();
