#!/usr/bin/env node

/**
 * CSS Property Sorter
 *
 * Reorders CSS properties within each rule block to follow the 5-group convention:
 *   1. Positioning  (position, top, right, bottom, left, z-index, float, clear, inset)
 *   2. Box Model    (display, flex-*, grid-*, gap, align-*, justify-*, width, height, margin, padding, overflow, box-sizing)
 *   3. Typography   (font-*, line-height, letter-spacing, text-*, color, white-space, word-break)
 *   4. Visual       (border-*, background-*, box-shadow, outline, opacity, transform, cursor, pointer-events)
 *   5. Animation    (transition-*, animation-*, will-change)
 *
 * Uses the same getPropertyGroup() logic as check.js for consistency.
 *
 * Usage:
 *   node sort-css-properties.js <path>          Sort all .css files under <path>
 *   node sort-css-properties.js file.css        Sort a single file
 *   node sort-css-properties.js --dry-run <path>  Show what would change without writing
 *
 * Exit: 0 = success, 1 = error
 */

'use strict';

const fs = require('fs');
const path = require('path');

/* ── Constants ──────────────────────────────────────────────────────────── */

const IGNORE = new Set(['node_modules', '.git', 'dist', 'build', '~Transfer']);

/* ── Property grouping (mirrors check.js exactly) ──────────────────────── */

function getPropertyGroup(prop) {
    if (prop === 'text-shadow') return 4;
    if (prop === 'overflow-wrap') return 3;

    if (/^(position|top|right|bottom|left|z-index|float|clear|inset(-.*)?)$/.test(prop)) return 1;
    if (/^(display|flex(-.+)?|grid(-.+)?|gap|row-gap|column-gap|align-.+|justify-.+|place-.+|order|width|min-width|max-width|height|min-height|max-height|margin(-.+)?|padding(-.+)?|overflow(-.+)?|box-sizing|aspect-ratio)$/.test(prop)) return 2;
    if (/^(font(-.+)?|line-height|letter-spacing|word-spacing|text-.+|white-space|word-break|word-wrap|hyphens|tab-size|color|vertical-align|list-style(-.+)?|content|quotes|counter-.+|direction|unicode-bidi|writing-mode)$/.test(prop)) return 3;
    if (/^(border(-.+)?|background(-.+)?|box-shadow|outline(-.+)?|opacity|visibility|cursor|pointer-events|user-select|filter|backdrop-filter|mix-blend-mode|clip-path|mask(-.+)?|transform(-.+)?|perspective(-.+)?|appearance|resize|object-.+|table-layout|caption-side|empty-cells|fill|stroke(-.+)?|accent-color|caret-color|scroll-.+|column-count|column-rule(-.+)?|column-width|columns)$/.test(prop)) return 4;
    if (/^(transition(-.+)?|animation(-.+)?|will-change)$/.test(prop)) return 5;

    return 0;
}

/* ── File discovery ────────────────────────────────────────────────────── */

function findCssFiles(dir) {
    const results = [];

    function walk(current) {
        let entries;
        try {
            entries = fs.readdirSync(current, { withFileTypes: true });
        } catch {
            return;
        }
        for (const entry of entries) {
            if (IGNORE.has(entry.name)) continue;
            const full = path.join(current, entry.name);
            if (entry.isDirectory()) {
                walk(full);
            } else if (entry.name.endsWith('.css')) {
                results.push(full);
            }
        }
    }

    walk(dir);
    return results;
}

/* ── Parsing ───────────────────────────────────────────────────────────── */

/**
 * Parse a CSS file into a structure we can sort and reconstruct.
 *
 * We track "chunks" — contiguous runs of lines that are either:
 *   - Non-block content (selectors, comments, @rules, blank lines)
 *   - Property blocks (the lines between { and })
 *
 * For property blocks, we parse individual declarations so we can sort them
 * while preserving comments, blank lines, and formatting.
 */

function extractPropertyName(line) {
    const trimmed = line.trim();

    /* Skip custom properties — they stay in original position */
    if (trimmed.startsWith('--')) return null;

    /* Skip lines that aren't declarations */
    if (!trimmed.includes(':')) return null;
    if (trimmed.startsWith('/*') || trimmed.startsWith('//')) return null;
    if (trimmed.startsWith('@')) return null;

    /* Extract property name (everything before the colon) */
    const colonIndex = trimmed.indexOf(':');
    const prop = trimmed.substring(0, colonIndex).trim();

    /* Ignore if property name looks invalid */
    if (!prop || /\s/.test(prop) || prop.includes('{') || prop.includes('}')) return null;

    return prop;
}

/**
 * Sort properties within a single block.
 *
 * A "block" is an array of line objects between { and }.
 * Each line is { text, group, isProperty, isCustomProp, isComment, isBlank }.
 *
 * Sorting rules:
 * 1. Custom properties (--*) stay at the top, in original order
 * 2. Known properties are sorted by group (1-5), preserving order within groups
 * 3. Unknown properties (group 0) stay at the bottom, in original order
 * 4. Comments attach to the property that follows them
 * 5. Blank lines between groups are removed and re-inserted at group boundaries
 */
function sortBlock(lines) {
    if (lines.length === 0) return lines;

    /* Classify each line */
    const classified = lines.map((text) => {
        const trimmed = text.trim();
        const isBlank = trimmed === '';
        const isComment = trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('//');
        const isCustomProp = /^\s*--[\w-]+\s*:/.test(text);

        let group = 0;
        let isProperty = false;

        if (!isBlank && !isComment && !isCustomProp) {
            const prop = extractPropertyName(text);
            if (prop) {
                group = getPropertyGroup(prop);
                isProperty = true;
            }
        }

        return { text, group, isProperty, isCustomProp, isComment, isBlank };
    });

    /* Build declaration groups: attach leading comments to the next property */
    const customProps = [];
    const groupedDecls = []; /* { group, lines: [text] } */
    const unknownProps = [];
    let pendingComments = [];

    for (const item of classified) {
        if (item.isBlank) {
            /* Blank lines: hold in pending, will be used as group separators */
            if (pendingComments.length > 0) {
                pendingComments.push(item.text);
            }
            continue;
        }

        if (item.isCustomProp) {
            /* Flush any pending comments before custom props */
            for (const c of pendingComments) customProps.push(c);
            pendingComments = [];
            customProps.push(item.text);
            continue;
        }

        if (item.isComment && !item.isProperty) {
            pendingComments.push(item.text);
            continue;
        }

        if (item.isProperty) {
            const entry = {
                group: item.group,
                lines: [...pendingComments, item.text],
            };
            pendingComments = [];

            if (item.group === 0) {
                unknownProps.push(entry);
            } else {
                groupedDecls.push(entry);
            }
            continue;
        }

        /* Anything else (shouldn't happen in a block, but be safe) */
        pendingComments.push(item.text);
    }

    /* Sort known properties by group (stable sort preserves within-group order) */
    groupedDecls.sort((a, b) => a.group - b.group);

    /* Reconstruct the block */
    const result = [];

    /* 1. Custom properties first */
    for (const line of customProps) result.push(line);

    /* 2. Add blank line separator if custom props exist and known props follow */
    if (customProps.length > 0 && groupedDecls.length > 0) {
        result.push('');
    }

    /* 3. Known properties, with blank lines between groups */
    let lastGroup = 0;
    for (const entry of groupedDecls) {
        if (lastGroup > 0 && entry.group !== lastGroup) {
            result.push('');
        }
        for (const line of entry.lines) result.push(line);
        lastGroup = entry.group;
    }

    /* 4. Unknown properties at the end */
    if (unknownProps.length > 0 && (groupedDecls.length > 0 || customProps.length > 0)) {
        result.push('');
    }
    for (const entry of unknownProps) {
        for (const line of entry.lines) result.push(line);
    }

    /* 5. Trailing comments that weren't attached to anything */
    for (const line of pendingComments) result.push(line);

    return result;
}

/* ── Main processing ───────────────────────────────────────────────────── */

function processFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    const outputLines = [];
    let blockLines = [];
    let depth = 0;
    let inBlock = false;
    let inKeyframes = false;
    let inRoot = false;
    let modified = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        /* Track @keyframes — skip sorting inside them */
        if (/^@keyframes\s/.test(trimmed)) {
            inKeyframes = true;
        }

        /* Track :root — skip sorting inside it (custom property definitions) */
        if (/^:root\s*\{/.test(trimmed) || trimmed === ':root {' || /^:root$/.test(trimmed)) {
            inRoot = true;
        }

        /* Count braces */
        const opens = (line.match(/\{/g) || []).length;
        const closes = (line.match(/\}/g) || []).length;

        if (!inBlock && opens > 0 && depth === 0) {
            /* Opening a top-level or nested rule */
            outputLines.push(line);
            depth += opens - closes;
            if (depth > 0 && !inKeyframes && !inRoot) {
                inBlock = true;
                blockLines = [];
            }
            continue;
        }

        if (inBlock) {
            if (closes > 0 && depth + opens - closes <= 0) {
                /* Closing brace for our block */
                const sorted = sortBlock(blockLines);

                /* Check if order changed */
                const originalText = blockLines.join('\n');
                const sortedText = sorted.join('\n');
                if (originalText !== sortedText) {
                    modified = true;
                }

                for (const sl of sorted) outputLines.push(sl);
                outputLines.push(line);
                depth += opens - closes;
                inBlock = false;
                blockLines = [];

                if (depth <= 0) {
                    inKeyframes = false;
                    inRoot = false;
                    depth = 0;
                }
                continue;
            }

            /* Nested block inside our block (e.g., @media inside a rule is unusual,
               but nested selectors in SCSS-like syntax could exist) */
            if (opens > 0) {
                /* Don't sort nested blocks — pass through as-is */
                blockLines.push(line);
                depth += opens - closes;
                continue;
            }

            blockLines.push(line);
            depth += opens - closes;
            continue;
        }

        /* Outside any sortable block */
        depth += opens - closes;

        if (depth <= 0) {
            inKeyframes = false;
            inRoot = false;
            depth = 0;
        }

        outputLines.push(line);
    }

    /* Flush any remaining block lines (shouldn't happen in valid CSS) */
    for (const bl of blockLines) outputLines.push(bl);

    const result = outputLines.join('\n');
    return { content: result, modified, original: content };
}

/* ── CLI ───────────────────────────────────────────────────────────────── */

function main() {
    const args = process.argv.slice(2);
    let dryRun = false;
    const paths = [];

    for (const arg of args) {
        if (arg === '--dry-run') {
            dryRun = true;
        } else if (arg === '--help' || arg === '-h') {
            console.log('Usage: sort-css-properties.js [--dry-run] <path|file.css> [...]');
            console.log('');
            console.log('Sorts CSS properties into 5-group convention:');
            console.log('  Positioning → Box Model → Typography → Visual → Animation');
            console.log('');
            console.log('Options:');
            console.log('  --dry-run   Show what would change without writing files');
            process.exit(0);
        } else {
            paths.push(arg);
        }
    }

    if (paths.length === 0) {
        console.error('Error: No path specified. Usage: sort-css-properties.js <path>');
        process.exit(1);
    }

    /* Collect CSS files */
    let files = [];
    for (const p of paths) {
        const resolved = path.resolve(p);
        let stat;
        try {
            stat = fs.statSync(resolved);
        } catch {
            console.error(`Error: Cannot access "${p}"`);
            process.exit(1);
        }

        if (stat.isDirectory()) {
            files = files.concat(findCssFiles(resolved));
        } else if (resolved.endsWith('.css')) {
            files.push(resolved);
        } else {
            console.error(`Error: Not a CSS file: "${p}"`);
            process.exit(1);
        }
    }

    if (files.length === 0) {
        console.log('No CSS files found.');
        process.exit(0);
    }

    /* Process each file */
    let modifiedCount = 0;
    let skippedCount = 0;

    for (const file of files) {
        const rel = path.relative(process.cwd(), file);
        const { content, modified } = processFile(file);

        if (modified) {
            modifiedCount++;
            if (dryRun) {
                console.log(`WOULD SORT: ${rel}`);
            } else {
                fs.writeFileSync(file, content, 'utf8');
                console.log(`SORTED: ${rel}`);
            }
        } else {
            skippedCount++;
        }
    }

    /* Summary */
    console.log('');
    if (dryRun) {
        console.log(`Dry run: ${modifiedCount} file(s) would be sorted, ${skippedCount} already ordered.`);
    } else {
        console.log(`Done: ${modifiedCount} file(s) sorted, ${skippedCount} already ordered.`);
    }
}

main();
