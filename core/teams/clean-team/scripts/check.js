#!/usr/bin/env node

/**
 * Design System Checker
 *
 * Deterministic enforcement of design tokens, HTML quality, and JS hygiene.
 * Works alongside AI skill enforcement (probabilistic) for double coverage.
 *
 * CSS rules (10):
 *   no-hardcoded-color     (error)  Hex, rgb(), hsl(), named colors outside :root
 *   no-hardcoded-spacing   (warn)   Raw px >= 4 on margin/padding/gap
 *   no-hardcoded-font-size (warn)   Raw font-size values
 *   no-hardcoded-radius    (warn)   Raw border-radius values
 *   no-hardcoded-shadow    (warn)   Raw box-shadow/text-shadow values
 *   no-hardcoded-z-index   (warn)   Raw z-index numbers
 *   mobile-first           (warn)   max-width media queries
 *   no-important           (warn)   !important usage
 *   no-id-selector         (warn)   #id selectors (specificity wars)
 *   unit-zero              (warn)   0px, 0em, 0rem etc. (use unitless 0)
 *
 * HTML rules (11):
 *   no-inline-style        (error)  style= attributes
 *   img-alt-required       (error)  <img> without alt
 *   button-type-required   (error)  <button> without type attribute
 *   doctype-required       (error)  Missing DOCTYPE
 *   title-required         (error)  Missing <title>
 *   tabindex-no-positive   (error)  Positive tabindex values (breaks tab order)
 *   max-classes            (warn)   More than 4 classes on an element
 *   heading-order          (warn)   Heading levels that skip (h1 -> h3)
 *   single-h1              (warn)   Multiple <h1> elements per page
 *   no-div-as-button       (warn)   <div>/<span> with onclick handler
 *   wiki-page-attr         (warn)   Missing data-wiki-page on <body>
 *
 * JS/JSX/TSX rules (9):
 *   no-debugger            (error)  debugger statements
 *   no-var                 (error)  var declarations (use const/let)
 *   no-empty-catch         (error)  Empty catch blocks
 *   no-document-write      (error)  document.write() / document.writeln()
 *   no-hardcoded-secrets   (error)  Passwords, API keys, tokens in string literals
 *   no-console             (warn)   console.log/warn/error/info/debug/trace/dir/table
 *   no-double-equals       (warn)   == and != (allows == null for nullish check)
 *   no-innerHTML           (warn)   .innerHTML assignments (XSS risk)
 *   no-jsx-inline-style    (warn)   style={{ in JSX
 *
 * Project rules (1):
 *   css-file-count         (warn/error)  CSS file sprawl (warn >5, error >7)
 *
 * Inline suppression:
 *   CSS:  /* check-disable * / check-enable / check-disable-next-line (block comments)
 *   HTML: <!-- check-disable --> / check-enable / check-disable-next-line
 *   JS:   // check-disable / check-enable / check-disable-next-line
 *
 * Usage:
 *   node check.js              Check all CSS, HTML, JS/JSX/TSX files
 *   node check.js --quiet      Errors only (no warnings)
 *   node check.js file.css     Check specific file(s)
 *
 * Exit: 0 = clean, 1 = errors found (warnings alone don't fail)
 */

'use strict';

const fs = require('fs');
const path = require('path');

/* ── Constants ──────────────────────────────────────────────────────────── */

let ROOT = process.cwd(); /* set in main() — overridable with --root */
const IGNORE = new Set(['node_modules', '.git', '~Transfer', 'dist', 'build', 'tests']);
const ERROR = 'error';
const WARN = 'warn';

const MAX_CLASSES = 4;
const SPACING_PX_THRESHOLD = 4;
const MAX_CSS_FILES_WARN = 5;
const MAX_CSS_FILES_ERROR = 7;

/* Secret detection patterns (key = value with string literal) */
const SECRET_PATTERNS = [
    /(?:password|passwd|pwd)\s*[:=]\s*['"][^'"]{4,}['"]/i,
    /(?:api[_-]?key|apikey)\s*[:=]\s*['"][^'"]{8,}['"]/i,
    /(?:secret|token|auth)[_-]?\w*\s*[:=]\s*['"][^'"]{8,}['"]/i,
    /(?:access[_-]?key|private[_-]?key)\s*[:=]\s*['"][^'"]{8,}['"]/i,
    /['"](?:sk|pk)[-_](?:live|test)[-_]\w{10,}['"]/i,
];

/* ANSI helpers (TTY-aware) */
const tty = process.stdout.isTTY;
const c = {
    red: (s) => (tty ? `\x1b[31m${s}\x1b[0m` : s),
    yellow: (s) => (tty ? `\x1b[33m${s}\x1b[0m` : s),
    green: (s) => (tty ? `\x1b[32m${s}\x1b[0m` : s),
    dim: (s) => (tty ? `\x1b[2m${s}\x1b[0m` : s),
    bold: (s) => (tty ? `\x1b[1m${s}\x1b[0m` : s),
    underline: (s) => (tty ? `\x1b[4m${s}\x1b[0m` : s),
};

/* Complete CSS Level 4 named colors */
const NAMED_COLORS = new Set([
    'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure',
    'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet',
    'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate',
    'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan',
    'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen',
    'darkgrey', 'darkkhaki', 'darkmagenta', 'darkolivegreen',
    'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen',
    'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise',
    'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey',
    'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia',
    'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green',
    'greenyellow', 'grey', 'honeydew', 'hotpink', 'indianred', 'indigo',
    'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen',
    'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan',
    'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey',
    'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue',
    'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow',
    'lime', 'limegreen', 'linen', 'magenta', 'maroon',
    'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple',
    'mediumseagreen', 'mediumslateblue', 'mediumspringgreen',
    'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream',
    'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive',
    'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod',
    'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip',
    'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple',
    'rebeccapurple', 'red', 'rosybrown', 'royalblue', 'saddlebrown',
    'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver',
    'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow',
    'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato',
    'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow',
    'yellowgreen',
]);

/* CSS keywords that are NOT hardcoded colors */
const ALLOWED_KEYWORDS = new Set([
    'transparent', 'currentcolor', 'inherit', 'initial', 'unset',
    'revert', 'revert-layer', 'none', 'auto',
]);

/* Properties where named color words should be flagged */
const COLOR_PROP_RE = /^(color|background|border|outline|fill|stroke|box-shadow|text-shadow|text-decoration|caret-color|column-rule|accent-color|scrollbar|filter)/;

/* Spacing properties to check for raw px values */
const SPACING_PROP_RE = /^(margin|padding|gap|row-gap|column-gap|inset|top|right|bottom|left)(-(top|right|bottom|left|block|inline|block-start|block-end|inline-start|inline-end))?$/;

/* font-size keyword values that are allowed without var() */
const FONT_SIZE_KEYWORDS = new Set([
    'inherit', 'initial', 'unset', 'revert', 'smaller', 'larger',
    'xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large', 'xxx-large',
]);

/* border-radius properties (shorthand and individual corners) */
const RADIUS_PROP_RE = /^border(-top-left|-top-right|-bottom-left|-bottom-right)?-radius$/;

/* CSS cascade keywords allowed on any property without var() */
const CASCADE_KEYWORDS = new Set(['inherit', 'initial', 'unset', 'revert', 'revert-layer']);

/* ── File discovery ─────────────────────────────────────────────────────── */

function findFiles(dir, extensions) {
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
            } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
                results.push(full);
            }
        }
    }

    walk(dir);
    return results.sort();
}

/* ── CSS checker ────────────────────────────────────────────────────────── */

function checkCSS(filepath, content) {
    const issues = [];
    const lines = content.split('\n');

    let inComment = false;
    let braceDepth = 0;
    let rootStartDepth = -1;
    let rootPending = false;
    let disabled = false;
    let skipNextLine = false;

    for (let i = 0; i < lines.length; i++) {
        const lineNum = i + 1;
        const raw = lines[i];

        // Inline suppression: check-disable, check-enable, check-disable-next-line
        if (/\/\*\s*check-disable\b/.test(raw) && !/check-disable-next-line/.test(raw)) disabled = true;
        if (/\/\*\s*check-enable\b/.test(raw)) disabled = false;

        const isSkipped = disabled || skipNextLine;
        skipNextLine = /\/\*\s*check-disable-next-line\b/.test(raw);

        /* ── Strip comments ── */
        let line = '';
        let j = 0;

        if (inComment) {
            const end = raw.indexOf('*/');
            if (end === -1) continue; /* entire line inside comment */
            j = end + 2;
            inComment = false;
        }

        while (j < raw.length) {
            if (raw[j] === '/' && raw[j + 1] === '*') {
                const end = raw.indexOf('*/', j + 2);
                if (end === -1) {
                    inComment = true;
                    break;
                }
                j = end + 2;
            } else {
                line += raw[j];
                j++;
            }
        }

        /* Strip string contents and url() bodies */
        const clean = line
            .replace(/"[^"]*"/g, '""')
            .replace(/'[^']*'/g, "''")
            .replace(/url\([^)]*\)/g, 'url()');

        /* ── Track :root scope (always, even when disabled) ── */
        if (/:\s*root\b/.test(clean) && !/[>+~]/.test(clean)) {
            rootPending = true;
        }

        for (const ch of clean) {
            if (ch === '{') {
                if (rootPending) {
                    rootStartDepth = braceDepth;
                    rootPending = false;
                }
                braceDepth++;
            }
            if (ch === '}') {
                braceDepth--;
                if (rootStartDepth >= 0 && braceDepth === rootStartDepth) {
                    rootStartDepth = -1;
                }
            }
        }

        const inRoot = rootStartDepth >= 0;

        /* Skip checks if suppressed via inline comment */
        if (isSkipped) continue;

        /* ── ID selector (check before skipping root) ── */
        const idSelectorMatch = clean.match(/(^|[\s,;{}])#([a-zA-Z_][\w-]*)\s*[{,:]/);
        if (idSelectorMatch && !clean.trim().startsWith('--')) {
            issues.push({
                line: lineNum,
                col: raw.indexOf('#' + idSelectorMatch[2]) + 1,
                severity: WARN,
                message: `ID selector '#${idSelectorMatch[2]}' — use classes to avoid specificity wars`,
                rule: 'no-id-selector',
            });
        }

        /* ── @media max-width (check before skipping root) ── */
        if (/@media\b/.test(clean) && /max-width/.test(clean)) {
            issues.push({
                line: lineNum,
                col: raw.indexOf('max-width') + 1,
                severity: WARN,
                message: 'max-width media query — use min-width (mobile-first)',
                rule: 'mobile-first',
            });
        }

        /* Skip :root token definitions */
        if (inRoot) continue;

        /* Skip custom property declarations (token definitions anywhere) */
        if (/^\s*--[\w-]+\s*:/.test(clean)) continue;

        /* ── Extract property: value declaration ── */
        const declMatch = clean.match(/^\s*([\w-]+)\s*:\s*(.+?)\s*;?\s*$/);
        if (!declMatch) continue;

        const prop = declMatch[1];
        const value = declMatch[2];

        /* ── !important ── */
        if (value.includes('!important')) {
            issues.push({
                line: lineNum,
                col: raw.indexOf('!important') + 1,
                severity: WARN,
                message: '!important — avoid unless absolutely necessary',
                rule: 'no-important',
            });
        }

        /* ── Hardcoded hex colors ── */
        for (const m of value.matchAll(/#([0-9a-fA-F]{3,8})\b/g)) {
            issues.push({
                line: lineNum,
                col: raw.indexOf(m[0], raw.indexOf(':')) + 1,
                severity: ERROR,
                message: `Hardcoded color '${m[0]}' — use var(--color-*)`,
                rule: 'no-hardcoded-color',
            });
        }

        /* ── Hardcoded rgb()/rgba() ── */
        if (/rgba?\s*\(/.test(value)) {
            const idx = raw.indexOf('rgb', raw.indexOf(':'));
            issues.push({
                line: lineNum,
                col: idx >= 0 ? idx + 1 : 1,
                severity: ERROR,
                message: 'Hardcoded rgb()/rgba() — use var(--color-*)',
                rule: 'no-hardcoded-color',
            });
        }

        /* ── Hardcoded hsl()/hsla() ── */
        if (/hsla?\s*\(/.test(value)) {
            const idx = raw.indexOf('hsl', raw.indexOf(':'));
            issues.push({
                line: lineNum,
                col: idx >= 0 ? idx + 1 : 1,
                severity: ERROR,
                message: 'Hardcoded hsl()/hsla() — use var(--color-*)',
                rule: 'no-hardcoded-color',
            });
        }

        /* ── Named colors (only on color-related properties) ── */
        if (COLOR_PROP_RE.test(prop)) {
            for (const word of value.split(/[\s,/()]+/)) {
                const lower = word.toLowerCase();
                if (NAMED_COLORS.has(lower) && !ALLOWED_KEYWORDS.has(lower)) {
                    issues.push({
                        line: lineNum,
                        col: raw.toLowerCase().indexOf(lower, raw.indexOf(':')) + 1,
                        severity: ERROR,
                        message: `Named color '${word}' — use var(--color-*)`,
                        rule: 'no-hardcoded-color',
                    });
                }
            }
        }

        /* ── Hardcoded spacing ── */
        if (SPACING_PROP_RE.test(prop)) {
            for (const m of value.matchAll(/(\d+(?:\.\d+)?)\s*px/g)) {
                const px = parseFloat(m[1]);
                if (px >= SPACING_PX_THRESHOLD) {
                    issues.push({
                        line: lineNum,
                        col: raw.indexOf(m[0], raw.indexOf(':')) + 1,
                        severity: WARN,
                        message: `Hardcoded spacing '${m[0]}' — use var(--space-*)`,
                        rule: 'no-hardcoded-spacing',
                    });
                }
            }
        }

        /* ── Hardcoded font-size ── */
        if (prop === 'font-size') {
            const trimmed = value.trim();
            const usesToken = /var\(/.test(trimmed);
            const usesCalc = /calc\(/.test(trimmed) && usesToken;
            const isKeyword = FONT_SIZE_KEYWORDS.has(trimmed);
            if (!usesToken && !usesCalc && !isKeyword) {
                issues.push({
                    line: lineNum,
                    col: raw.indexOf(trimmed, raw.indexOf(':')) + 1,
                    severity: WARN,
                    message: `Hardcoded font-size '${trimmed}' — use var(--font-size-*)`,
                    rule: 'no-hardcoded-font-size',
                });
            }
        }

        /* ── Hardcoded border-radius ── */
        if (RADIUS_PROP_RE.test(prop)) {
            const trimmed = value.trim();
            const usesToken = /var\(/.test(trimmed);
            const isZero = /^0(%|[a-z]+)?$/.test(trimmed);
            const isKeyword = CASCADE_KEYWORDS.has(trimmed);
            if (!usesToken && !isZero && !isKeyword) {
                issues.push({
                    line: lineNum,
                    col: raw.indexOf(trimmed, raw.indexOf(':')) + 1,
                    severity: WARN,
                    message: `Hardcoded border-radius '${trimmed}' — use var(--radius-*)`,
                    rule: 'no-hardcoded-radius',
                });
            }
        }

        /* ── Hardcoded box-shadow / text-shadow ── */
        if (prop === 'box-shadow' || prop === 'text-shadow') {
            const trimmed = value.trim();
            const usesToken = /var\(/.test(trimmed);
            const isNone = trimmed === 'none';
            const isKeyword = CASCADE_KEYWORDS.has(trimmed);
            if (!usesToken && !isNone && !isKeyword) {
                issues.push({
                    line: lineNum,
                    col: raw.indexOf(trimmed, raw.indexOf(':')) + 1,
                    severity: WARN,
                    message: `Hardcoded ${prop} — use var(--shadow-*)`,
                    rule: 'no-hardcoded-shadow',
                });
            }
        }

        /* ── Hardcoded z-index ── */
        if (prop === 'z-index') {
            const trimmed = value.trim();
            const usesToken = /var\(/.test(trimmed);
            const isKeyword = CASCADE_KEYWORDS.has(trimmed) || trimmed === 'auto';
            if (!usesToken && !isKeyword) {
                issues.push({
                    line: lineNum,
                    col: raw.indexOf(trimmed, raw.indexOf(':')) + 1,
                    severity: WARN,
                    message: `Hardcoded z-index '${trimmed}' — use var(--z-*)`,
                    rule: 'no-hardcoded-z-index',
                });
            }
        }

        /* ── Redundant unit on zero ── */
        for (const um of value.matchAll(/\b0(px|em|rem|%|vh|vw|vmin|vmax|ch|ex)\b/g)) {
            issues.push({
                line: lineNum,
                col: raw.indexOf(um[0], raw.indexOf(':')) + 1,
                severity: WARN,
                message: `'${um[0]}' — use unitless 0`,
                rule: 'unit-zero',
            });
        }
    }

    return issues;
}

/* ── HTML checker ───────────────────────────────────────────────────────── */

function offsetToLine(content, offset) {
    return content.substring(0, offset).split('\n').length;
}

function offsetToCol(content, offset) {
    const lastNewline = content.lastIndexOf('\n', offset - 1);
    return offset - lastNewline;
}

function checkHTML(filepath, content) {
    const issues = [];
    const lines = content.split('\n');

    /* Build set of suppressed line numbers
     *  <!-- check-disable -->      suppress until check-enable
     *  <!-- check-enable -->       re-enable
     *  <!-- check-disable-next-line -->  suppress the next non-empty line
     */
    const suppressed = new Set();
    let disabled = false;
    let skipNext = false;

    for (let i = 0; i < lines.length; i++) {
        const ln = lines[i];
        if (/<!--\s*check-disable\s*-->/.test(ln)) disabled = true;
        if (/<!--\s*check-enable\s*-->/.test(ln)) disabled = false;

        if (disabled || skipNext) {
            suppressed.add(i + 1);
            if (skipNext && ln.trim().length > 0) skipNext = false;
        }

        if (/<!--\s*check-disable-next-line\s*-->/.test(ln)) skipNext = true;
    }

    /* ── Inline styles ── */
    for (let i = 0; i < lines.length; i++) {
        if (suppressed.has(i + 1)) continue;
        const match = lines[i].match(/\sstyle\s*=\s*["']/);
        if (match) {
            issues.push({
                line: i + 1,
                col: lines[i].indexOf('style=') + 1,
                severity: ERROR,
                message: 'Inline style — move to CSS file',
                rule: 'no-inline-style',
            });
        }
    }

    /* ── img alt required ── */
    const imgRe = /<img\b([^>]*)>/gi;
    let m;
    while ((m = imgRe.exec(content)) !== null) {
        const line = offsetToLine(content, m.index);
        if (suppressed.has(line)) continue;
        if (!/\balt\s*=/.test(m[1])) {
            issues.push({
                line,
                col: offsetToCol(content, m.index),
                severity: ERROR,
                message: '<img> missing alt attribute',
                rule: 'img-alt-required',
            });
        }
    }

    /* ── Class bloat ── */
    const classRe = /\bclass\s*=\s*"([^"]*)"/gi;
    while ((m = classRe.exec(content)) !== null) {
        const line = offsetToLine(content, m.index);
        if (suppressed.has(line)) continue;
        const classes = m[1].trim().split(/\s+/).filter(Boolean);
        if (classes.length > MAX_CLASSES) {
            issues.push({
                line,
                col: offsetToCol(content, m.index),
                severity: WARN,
                message: `${classes.length} classes on element (max ${MAX_CLASSES}) — consolidate into semantic class`,
                rule: 'max-classes',
            });
        }
    }

    /* ── DOCTYPE ── */
    if (!/<!doctype\s+html>/i.test(content.substring(0, 500))) {
        issues.push({
            line: 1,
            col: 1,
            severity: ERROR,
            message: 'Missing <!DOCTYPE html>',
            rule: 'doctype-required',
        });
    }

    /* ── <title> ── */
    if (!/<title\b[^>]*>.+<\/title>/is.test(content)) {
        issues.push({
            line: 1,
            col: 1,
            severity: ERROR,
            message: 'Missing or empty <title> element',
            rule: 'title-required',
        });
    }

    /* ── data-wiki-page on <body> ── */
    const bodyMatch = content.match(/<body\b([^>]*)>/i);
    if (bodyMatch && !/data-wiki-page/.test(bodyMatch[1])) {
        issues.push({
            line: offsetToLine(content, bodyMatch.index),
            col: 1,
            severity: WARN,
            message: 'Missing data-wiki-page attribute on <body>',
            rule: 'wiki-page-attr',
        });
    }

    /* ── button type required ── */
    const buttonRe = /<button\b([^>]*)>/gi;
    while ((m = buttonRe.exec(content)) !== null) {
        const line = offsetToLine(content, m.index);
        if (suppressed.has(line)) continue;
        if (!/\btype\s*=/.test(m[1])) {
            issues.push({
                line,
                col: offsetToCol(content, m.index),
                severity: ERROR,
                message: '<button> missing type — add type="button" or type="submit"',
                rule: 'button-type-required',
            });
        }
    }

    /* ── Heading hierarchy ── */
    const headingRe = /<h([1-6])\b/gi;
    let lastHeadingLevel = 0;
    let h1Count = 0;
    while ((m = headingRe.exec(content)) !== null) {
        const line = offsetToLine(content, m.index);
        if (suppressed.has(line)) continue;
        const level = parseInt(m[1]);
        if (level === 1) h1Count++;
        if (lastHeadingLevel > 0 && level > lastHeadingLevel + 1) {
            issues.push({
                line,
                col: offsetToCol(content, m.index),
                severity: WARN,
                message: `<h${level}> skips level — expected <h${lastHeadingLevel + 1}> after <h${lastHeadingLevel}>`,
                rule: 'heading-order',
            });
        }
        lastHeadingLevel = level;
    }

    /* ── Single h1 per page ── */
    if (h1Count > 1) {
        issues.push({
            line: 1,
            col: 1,
            severity: WARN,
            message: `${h1Count} <h1> elements — use exactly one per page`,
            rule: 'single-h1',
        });
    }

    /* ── div/span with onclick ── */
    const clickDivRe = /<(div|span)\b([^>]*?\bonclick\b[^>]*)>/gi;
    while ((m = clickDivRe.exec(content)) !== null) {
        const line = offsetToLine(content, m.index);
        if (suppressed.has(line)) continue;
        issues.push({
            line,
            col: offsetToCol(content, m.index),
            severity: WARN,
            message: `<${m[1]}> with onclick — use <button type="button"> instead`,
            rule: 'no-div-as-button',
        });
    }

    /* ── Positive tabindex ── */
    const tabindexRe = /\btabindex\s*=\s*"(\d+)"/gi;
    while ((m = tabindexRe.exec(content)) !== null) {
        const val = parseInt(m[1]);
        if (val > 0) {
            const line = offsetToLine(content, m.index);
            if (suppressed.has(line)) continue;
            issues.push({
                line,
                col: offsetToCol(content, m.index),
                severity: ERROR,
                message: `tabindex="${val}" — positive values break natural tab order, use 0 or -1`,
                rule: 'tabindex-no-positive',
            });
        }
    }

    return issues;
}

/* ── JS/JSX/TSX checker ────────────────────────────────────────────────── */

function checkJS(filepath, content) {
    const issues = [];
    const lines = content.split('\n');

    let inBlockComment = false;
    let disabled = false;
    let skipNextLine = false;

    for (let i = 0; i < lines.length; i++) {
        const lineNum = i + 1;
        const raw = lines[i];

        /* ── Suppression via // or block comments ── */
        if (/(?:\/\/|\/\*)\s*check-disable\b/.test(raw) && !/check-disable-next-line/.test(raw)) disabled = true;
        if (/(?:\/\/|\/\*)\s*check-enable\b/.test(raw)) disabled = false;

        const isSkipped = disabled || skipNextLine;
        skipNextLine = /(?:\/\/|\/\*)\s*check-disable-next-line\b/.test(raw);

        /* ── Strip comments ── */
        let line = '';
        let j = 0;

        if (inBlockComment) {
            const end = raw.indexOf('*/');
            if (end === -1) continue;
            j = end + 2;
            inBlockComment = false;
        }

        while (j < raw.length) {
            if (raw[j] === '/' && raw[j + 1] === '/') break; /* single-line comment */
            if (raw[j] === '/' && raw[j + 1] === '*') {
                const end = raw.indexOf('*/', j + 2);
                if (end === -1) {
                    inBlockComment = true;
                    break;
                }
                j = end + 2;
            } else {
                line += raw[j];
                j++;
            }
        }

        if (isSkipped) continue;

        /* Strip string contents for most checks (preserve raw for secret detection) */
        const stripped = line
            .replace(/`[^`]*`/g, '``')
            .replace(/"[^"]*"/g, '""')
            .replace(/'[^']*'/g, "''");

        /* ── no-debugger ── */
        if (/\bdebugger\b/.test(stripped)) {
            issues.push({
                line: lineNum,
                col: raw.indexOf('debugger') + 1,
                severity: ERROR,
                message: 'debugger statement — remove before committing',
                rule: 'no-debugger',
            });
        }

        /* ── no-console ── */
        if (/\bconsole\.(log|warn|error|info|debug|trace|dir|table)\b/.test(stripped)) {
            const cm = stripped.match(/\bconsole\.(log|warn|error|info|debug|trace|dir|table)\b/);
            issues.push({
                line: lineNum,
                col: raw.indexOf('console.') + 1,
                severity: WARN,
                message: `console.${cm[1]}() — use a proper logger or remove`,
                rule: 'no-console',
            });
        }

        /* ── no-var ── */
        if (/\bvar\s+/.test(stripped) && /^\s*var\s/.test(stripped)) {
            issues.push({
                line: lineNum,
                col: raw.indexOf('var') + 1,
                severity: ERROR,
                message: 'var declaration — use const or let',
                rule: 'no-var',
            });
        }

        /* ── no-double-equals ── */
        const eqMatch = stripped.match(/[^!=<>](==|!=)[^=]/);
        if (eqMatch) {
            const around = stripped.substring(
                Math.max(0, eqMatch.index),
                eqMatch.index + eqMatch[0].length + 6,
            );
            /* Allow == null and != null (idiomatic nullish check) */
            if (!/==\s*null\b/.test(around) && !/!=\s*null\b/.test(around)) {
                issues.push({
                    line: lineNum,
                    col: raw.indexOf(eqMatch[1]) + 1,
                    severity: WARN,
                    message: `'${eqMatch[1]}' — use strict equality (${eqMatch[1]}=)`,
                    rule: 'no-double-equals',
                });
            }
        }

        /* ── no-empty-catch ── */
        if (/\bcatch\s*(\([^)]*\))?\s*\{\s*\}/.test(stripped)) {
            issues.push({
                line: lineNum,
                col: raw.indexOf('catch') + 1,
                severity: ERROR,
                message: 'Empty catch block — handle the error or add a comment explaining why',
                rule: 'no-empty-catch',
            });
        }

        /* ── no-document-write ── */
        if (/\bdocument\.write(ln)?\s*\(/.test(stripped)) {
            issues.push({
                line: lineNum,
                col: raw.indexOf('document.write') + 1,
                severity: ERROR,
                message: 'document.write() — use DOM manipulation instead',
                rule: 'no-document-write',
            });
        }

        /* ── no-innerHTML ── */
        if (/\.innerHTML\s*=/.test(stripped)) {
            issues.push({
                line: lineNum,
                col: raw.indexOf('.innerHTML') + 1,
                severity: WARN,
                message: '.innerHTML assignment — XSS risk, use textContent or DOM methods',
                rule: 'no-innerHTML',
            });
        }

        /* ── no-jsx-inline-style ── */
        if (/\bstyle\s*=\s*\{\{/.test(stripped)) {
            issues.push({
                line: lineNum,
                col: raw.indexOf('style=') + 1,
                severity: WARN,
                message: 'JSX inline style — move to CSS file or styled component',
                rule: 'no-jsx-inline-style',
            });
        }

        /* ── no-hardcoded-secrets (uses original line, not stripped) ── */
        for (const pattern of SECRET_PATTERNS) {
            if (pattern.test(line)) {
                issues.push({
                    line: lineNum,
                    col: 1,
                    severity: ERROR,
                    message: 'Possible hardcoded secret — use environment variables',
                    rule: 'no-hardcoded-secrets',
                });
                break; /* one report per line is enough */
            }
        }
    }

    return issues;
}

/* ── Project-level checker ─────────────────────────────────────────────── */

function checkProject(cssFiles) {
    const issues = [];
    const count = cssFiles.length;

    if (count > MAX_CSS_FILES_ERROR) {
        issues.push({
            line: 0,
            col: 0,
            severity: ERROR,
            message: `${count} CSS files — 5-file architecture recommends tokens/base/layouts/components/utilities`,
            rule: 'css-file-count',
        });
    } else if (count > MAX_CSS_FILES_WARN) {
        issues.push({
            line: 0,
            col: 0,
            severity: WARN,
            message: `${count} CSS files — consider consolidating toward 5-file architecture`,
            rule: 'css-file-count',
        });
    }

    return issues;
}

/* ── Reporter ───────────────────────────────────────────────────────────── */

function report(allResults, quiet) {
    let errors = 0;
    let warnings = 0;

    for (const { file, issues } of allResults) {
        const filtered = quiet ? issues.filter((i) => i.severity === ERROR) : issues;
        if (filtered.length === 0) continue;

        const rel = path.relative(ROOT, file).replace(/\\/g, '/');
        console.log(`\n  ${c.underline(rel)}`);

        for (const issue of filtered) {
            const loc = issue.line === 0
                ? c.dim(''.padEnd(8))
                : c.dim(`${issue.line}:${issue.col}`.padEnd(8));
            const sev =
                issue.severity === ERROR
                    ? c.red(issue.severity.padEnd(6))
                    : c.yellow(issue.severity.padEnd(6));
            const rule = c.dim(issue.rule);
            console.log(`    ${loc} ${sev} ${issue.message}  ${rule}`);

            if (issue.severity === ERROR) errors++;
            else warnings++;
        }
    }

    if (errors + warnings === 0) {
        console.log(`\n  ${c.green('\u2714')} No issues found\n`);
        return 0;
    }

    const icon = errors > 0 ? c.red('\u2716') : c.yellow('\u26A0');
    console.log(`\n  ${icon} ${errors + warnings} problems (${errors} errors, ${warnings} warnings)\n`);
    return errors > 0 ? 1 : 0;
}

/* ── Main ───────────────────────────────────────────────────────────────── */

function main() {
    const args = process.argv.slice(2);
    const quiet = args.includes('--quiet');
    const help = args.includes('--help') || args.includes('-h');

    /* --root <dir> overrides the project root (default: cwd) */
    const rootIdx = args.indexOf('--root');
    if (rootIdx >= 0 && args[rootIdx + 1]) {
        ROOT = path.resolve(args[rootIdx + 1]);
    }

    /* Filter out flags and --root <value> from positional args */
    const files = args.filter((a, i) => {
        if (a.startsWith('-')) return false;
        if (i > 0 && args[i - 1] === '--root') return false;
        return true;
    });

    if (help) {
        console.log(`
  Design System Checker

  Usage:
    node check.js              Check all CSS, HTML, JS/JSX/TSX files
    node check.js --quiet      Errors only (no warnings)
    node check.js --root <dir> Set project root (default: cwd)
    node check.js file.css     Check specific file(s)
    node check.js --help       Show this help

  Exit: 0 = clean, 1 = errors found (warnings alone don't fail)
`);
        process.exit(0);
    }

    const selfPath = path.resolve(__filename);
    let cssFiles;
    let htmlFiles;
    let jsFiles;

    if (files.length > 0) {
        cssFiles = files.filter((f) => f.endsWith('.css')).map((f) => path.resolve(f));
        htmlFiles = files.filter((f) => f.endsWith('.html')).map((f) => path.resolve(f));
        jsFiles = files
            .filter((f) => f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.tsx'))
            .map((f) => path.resolve(f))
            .filter((f) => f !== selfPath);
    } else {
        cssFiles = findFiles(ROOT, ['.css']);
        htmlFiles = findFiles(ROOT, ['.html']);
        jsFiles = findFiles(ROOT, ['.js', '.jsx', '.tsx']).filter((f) => f !== selfPath);
    }

    const results = [];

    for (const file of cssFiles) {
        const content = fs.readFileSync(file, 'utf8');
        const issues = checkCSS(file, content);
        if (issues.length > 0) results.push({ file, issues });
    }

    for (const file of htmlFiles) {
        const content = fs.readFileSync(file, 'utf8');
        const issues = checkHTML(file, content);
        if (issues.length > 0) results.push({ file, issues });
    }

    for (const file of jsFiles) {
        const content = fs.readFileSync(file, 'utf8');
        const issues = checkJS(file, content);
        if (issues.length > 0) results.push({ file, issues });
    }

    /* Project-level checks */
    const projectIssues = checkProject(cssFiles);
    if (projectIssues.length > 0) {
        results.push({ file: path.join(ROOT, '(project)'), issues: projectIssues });
    }

    const exitCode = report(results, quiet);
    process.exit(exitCode);
}

main();
