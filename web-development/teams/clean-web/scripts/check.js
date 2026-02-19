#!/usr/bin/env node

/**
 * Design System Checker
 *
 * Deterministic enforcement of design tokens, HTML quality, and JS hygiene.
 * Works alongside AI skill enforcement (probabilistic) for double coverage.
 *
 * Each rule maps to a skill via RULE_SKILLS. When adding/removing rules,
 * update BOTH the registry here AND the skill's "## Enforced Rules" section.
 *
 * CSS rules (14):
 *   no-hardcoded-color     (error)  Hex, rgb(), hsl(), named colors outside :root
 *   no-hardcoded-spacing   (warn)   Raw px >= 4 on margin/padding/gap
 *   no-hardcoded-font-size (warn)   Raw font-size values
 *   no-hardcoded-radius    (warn)   Raw border-radius values
 *   no-hardcoded-shadow    (warn)   Raw box-shadow/text-shadow values
 *   no-hardcoded-z-index   (warn)   Raw z-index numbers
 *   css-property-order     (warn)   Property group ordering (Position → Box Model → Type → Visual → Anim)
 *   css-import-order       (warn)   @import / <link> not in cascade order (reset → global → layouts → components → overrides)
 *   css-section-order      (warn)   Major section headers out of canonical order within a file
 *   token-category-order   (warn)   Token sub-categories out of order within :root in global.css
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
 * JS/JSX/TSX rules (10):
 *   no-debugger            (error)  debugger statements
 *   no-var                 (error)  var declarations (use const/let)
 *   no-empty-catch         (error)  Empty catch blocks
 *   no-document-write      (error)  document.write() / document.writeln()
 *   no-hardcoded-secrets   (error)  Passwords, API keys, tokens in string literals
 *   tier-imports           (error)  Reverse or layer-skipping imports across 3-tier boundaries
 *   no-console             (warn)   console.log/warn/error/info/debug/trace/dir/table
 *   no-double-equals       (warn)   == and != (allows == null for nullish check)
 *   no-innerHTML           (warn)   .innerHTML assignments (XSS risk)
 *   no-jsx-inline-style    (warn)   style={{ in JSX
 *
 * Project rules (3):
 *   css-file-count         (warn/error)  CSS file sprawl (warn >5, error >7)
 *   css-file-names         (warn)        No canonical CSS names (reset/global/layouts/components/overrides)
 *   tier-structure         (error)       Missing or incomplete 3-tier architecture in web projects
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

/**
 * Rule → Skill mapping.
 * Every check.js rule links to the skill it enforces.
 * When adding/removing rules, update BOTH this registry AND the skill's
 * "## Enforced Rules" section. See CLAUDE.md for the sync convention.
 */
const RULE_SKILLS = {
    // CSS (14) — web-css
    'no-hardcoded-color':     'web-css',
    'no-hardcoded-spacing':   'web-css',
    'no-hardcoded-font-size': 'web-css',
    'no-hardcoded-radius':    'web-css',
    'no-hardcoded-shadow':    'web-css',
    'no-hardcoded-z-index':   'web-css',
    'css-property-order':     'web-css',
    'css-import-order':       'web-css',
    'css-section-order':      'web-css',
    'token-category-order':   'web-css',
    'mobile-first':           'web-css',
    'no-important':           'web-css',
    'no-id-selector':         'web-css',
    'unit-zero':              'web-css',

    // HTML (11) — design, web-accessibility
    'no-inline-style':        'design',
    'img-alt-required':       'web-accessibility',
    'button-type-required':   'design',
    'doctype-required':       'design',
    'title-required':         'web-accessibility',
    'tabindex-no-positive':   'web-accessibility',
    'max-classes':            'design',
    'heading-order':          'web-accessibility',
    'single-h1':             'web-accessibility',
    'no-div-as-button':       'web-accessibility',
    'wiki-page-attr':          null, // project-specific, no skill

    // JS (10) — code-quality, security, architecture, design
    'no-debugger':            'code-quality',
    'no-var':                 'code-quality',
    'no-empty-catch':         'code-quality',
    'no-document-write':      'security',
    'no-hardcoded-secrets':   'security',
    'tier-imports':           'architecture',
    'no-console':             'code-quality',
    'no-double-equals':       'code-quality',
    'no-innerHTML':           'security',
    'no-jsx-inline-style':    'design',

    // Project (3) — web-css, architecture
    'css-file-count':         'web-css',
    'css-file-names':         'web-css',
    'tier-structure':         'architecture',
};

const MAX_CLASSES = 4;
const SPACING_PX_THRESHOLD = 4;
const MAX_CSS_FILES_WARN = 5;
const MAX_CSS_FILES_ERROR = 7;
const MIN_FILES_FOR_TIER_CHECK = 5;

/* Canonical CSS import order — index = expected position */
const CSS_CASCADE_ORDER = ['reset', 'global', 'layouts', 'components', 'overrides'];
const CSS_CASCADE_MAP = new Map(CSS_CASCADE_ORDER.map((name, i) => [name, i]));

/* Canonical major section order per file — unknown sections are ignored */
const FILE_SECTION_ORDER = {
    'reset.css':      ['BOX MODEL', 'DOCUMENT', 'TYPOGRAPHY', 'MEDIA', 'FORMS', 'TABLES'],
    'global.css':     ['DESIGN TOKENS', 'ELEMENT DEFAULTS'],
    'layouts.css':    ['CONTAINERS', 'PAGE LAYOUTS', 'GRIDS', 'SECTIONS', 'RESPONSIVE OVERRIDES'],
    'overrides.css':  ['UTILITIES', 'PAGE-SPECIFIC', 'PRINT'],
    /* components.css: alphabetical order (checked dynamically) */
};

/* Canonical token sub-category order within :root in global.css */
const TOKEN_CATEGORY_ORDER = [
    'Colors',
    'Typography',
    'Spacing',
    'Borders',
    'Shadows',
    'Animations',
    'Z-index',
    'Breakpoints',
];

/* Secret detection patterns (key = value with string literal) */
const SECRET_PATTERNS = [
    /(?:password|passwd|pwd)\s*[:=]\s*['"][^'"]{4,}['"]/i,
    /(?:api[_-]?key|apikey)\s*[:=]\s*['"][^'"]{8,}['"]/i,
    /(?:secret|token|auth)[_-]?\w*\s*[:=]\s*['"][^'"]{8,}['"]/i,
    /(?:access[_-]?key|private[_-]?key)\s*[:=]\s*['"][^'"]{8,}['"]/i,
    /['"](?:sk|pk)[-_](?:live|test)[-_]\w{10,}['"]/i,
];

/* ANSI helpers (TTY-aware) */
const isTTY = process.stdout.isTTY;
const ansi = {
    red: (text) => (isTTY ? `\x1b[31m${text}\x1b[0m` : text),
    yellow: (text) => (isTTY ? `\x1b[33m${text}\x1b[0m` : text),
    green: (text) => (isTTY ? `\x1b[32m${text}\x1b[0m` : text),
    dim: (text) => (isTTY ? `\x1b[2m${text}\x1b[0m` : text),
    bold: (text) => (isTTY ? `\x1b[1m${text}\x1b[0m` : text),
    underline: (text) => (isTTY ? `\x1b[4m${text}\x1b[0m` : text),
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

/* CSS property ordering — group names for error messages */
const PROPERTY_GROUP_NAMES = {
    1: 'Positioning',
    2: 'Box Model',
    3: 'Typography',
    4: 'Visual',
    5: 'Animation',
};

/**
 * Map a CSS property to its ordering group.
 *
 * Groups: 1=Positioning, 2=Box Model, 3=Typography, 4=Visual, 5=Animation.
 * Returns 0 for unknown properties (not checked).
 */
function getPropertyGroup(prop) {
    /* Exceptions where prefix matching would assign the wrong group */
    if (prop === 'text-shadow') return 4;
    if (prop === 'overflow-wrap') return 3;

    /* Group 1: Positioning */
    if (/^(position|top|right|bottom|left|z-index|float|clear|inset(-.*)?)$/.test(prop)) return 1;

    /* Group 2: Box Model */
    if (/^(display|flex(-.+)?|grid(-.+)?|gap|row-gap|column-gap|align-.+|justify-.+|place-.+|order|width|min-width|max-width|height|min-height|max-height|margin(-.+)?|padding(-.+)?|overflow(-.+)?|box-sizing|aspect-ratio)$/.test(prop)) return 2;

    /* Group 3: Typography */
    if (/^(font(-.+)?|line-height|letter-spacing|word-spacing|text-.+|white-space|word-break|word-wrap|hyphens|tab-size|color|vertical-align|list-style(-.+)?|content|quotes|counter-.+|direction|unicode-bidi|writing-mode)$/.test(prop)) return 3;

    /* Group 4: Visual */
    if (/^(border(-.+)?|background(-.+)?|box-shadow|outline(-.+)?|opacity|visibility|cursor|pointer-events|user-select|filter|backdrop-filter|mix-blend-mode|clip-path|mask(-.+)?|transform(-.+)?|perspective(-.+)?|appearance|resize|object-.+|table-layout|caption-side|empty-cells|fill|stroke(-.+)?|accent-color|caret-color|scroll-.+|column-count|column-rule(-.+)?|column-width|columns)$/.test(prop)) return 4;

    /* Group 5: Animation */
    if (/^(transition(-.+)?|animation(-.+)?|will-change)$/.test(prop)) return 5;

    return 0;
}

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

/* ── CSS section-order helpers ──────────────────────────────────────────── */

/**
 * Extract major section headers (3-line === pattern) from CSS content.
 * Returns array of { name, line } objects.
 */
function extractMajorSections(content) {
    const sections = [];
    const lines = content.split('\n');

    for (let i = 1; i < lines.length - 1; i++) {
        const prev = lines[i - 1].trim();
        const curr = lines[i].trim();
        const next = lines[i + 1] ? lines[i + 1].trim() : '';

        if (/^\/\*\s*={3,}\s*$/.test(prev) && /^={3,}\s*\*\/\s*$/.test(next) && curr.length > 0) {
            sections.push({ name: curr, line: i + 1 });
        }
    }

    return sections;
}

/**
 * Check major section ordering within a canonical CSS file.
 */
function checkCssSectionOrder(filepath, content) {
    const issues = [];
    const basename = path.basename(filepath);
    const sections = extractMajorSections(content);

    if (sections.length <= 1) return issues;

    if (basename === 'components.css') {
        /* Alphabetical order check for component sections */
        for (let i = 1; i < sections.length; i++) {
            if (sections[i].name.localeCompare(sections[i - 1].name) < 0) {
                issues.push({
                    line: sections[i].line,
                    col: 1,
                    severity: WARN,
                    message: `Section '${sections[i].name}' after '${sections[i - 1].name}' — component sections should be alphabetical`,
                    rule: 'css-section-order',
                    skill: RULE_SKILLS['css-section-order'],
                });
            }
        }
    } else if (FILE_SECTION_ORDER[basename]) {
        const expected = FILE_SECTION_ORDER[basename];
        let lastKnownIdx = -1;
        let lastKnownName = '';

        for (const section of sections) {
            const expectedIdx = expected.indexOf(section.name);
            if (expectedIdx >= 0) {
                if (expectedIdx < lastKnownIdx) {
                    issues.push({
                        line: section.line,
                        col: 1,
                        severity: WARN,
                        message: `Section '${section.name}' after '${lastKnownName}' — expected: ${expected.join(' → ')}`,
                        rule: 'css-section-order',
                        skill: RULE_SKILLS['css-section-order'],
                    });
                }
                lastKnownIdx = expectedIdx;
                lastKnownName = section.name;
            }
        }
    }

    return issues;
}

/**
 * Check token sub-category ordering within :root in global.css.
 * Detects minor section comments (/* Name ...\n ...--- * /) and
 * verifies they follow TOKEN_CATEGORY_ORDER.
 */
function checkTokenCategoryOrder(filepath, content) {
    const issues = [];
    if (path.basename(filepath) !== 'global.css') return issues;

    const lines = content.split('\n');
    let inRoot = false;
    let braceDepth = 0;
    let rootDone = false;
    let lastCatIdx = -1;
    let lastCatName = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        /* Detect :root { */
        if (!inRoot && !rootDone && /:\s*root\b/.test(line)) {
            inRoot = true;
        }

        if (!inRoot) continue;

        /* Track brace depth to know when :root ends */
        for (const ch of line) {
            if (ch === '{') braceDepth++;
            if (ch === '}') {
                braceDepth--;
                if (braceDepth <= 0) {
                    inRoot = false;
                    rootDone = true;
                }
            }
        }

        if (!inRoot && rootDone) break;

        /* Look for minor section comments: line has slash-star Text, next line has --- */
        const commentMatch = line.match(/\/\*\s*(.+?)\s*$/);
        if (commentMatch && i + 1 < lines.length) {
            const nextLine = lines[i + 1].trim();
            if (/^-{3,}\s*\*\//.test(nextLine)) {
                const commentText = commentMatch[1].trim();
                /* Match against canonical categories by prefix */
                const catIdx = TOKEN_CATEGORY_ORDER.findIndex((cat) =>
                    commentText.toLowerCase().startsWith(cat.toLowerCase()),
                );

                if (catIdx >= 0) {
                    if (catIdx < lastCatIdx) {
                        issues.push({
                            line: i + 1,
                            col: 1,
                            severity: WARN,
                            message: `Token category '${commentText}' after '${lastCatName}' — expected: ${TOKEN_CATEGORY_ORDER.join(' → ')}`,
                            rule: 'token-category-order',
                            skill: RULE_SKILLS['token-category-order'],
                        });
                    }
                    lastCatIdx = catIdx;
                    lastCatName = commentText;
                }
            }
        }
    }

    return issues;
}

/* ── CSS checker ────────────────────────────────────────────────────────── */

function checkCSS(filepath, content) {
    const issues = [];
    const lines = content.split('\n');

    let inComment = false;
    let braceDepth = 0;
    let rootStartDepth = -1;
    let rootPending = false;
    let lastCascadeIdx = -1;
    let lastCascadeName = '';
    let disabled = false;
    let skipNextLine = false;
    let blockOrderStack = [{ lastGroup: 0, lastGroupProp: '', lastGroupLine: 0 }];

    for (let i = 0; i < lines.length; i++) {
        const lineNum = i + 1;
        const raw = lines[i];

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

        /* Strip string contents and url() bodies to avoid false positives */
        const strippedLine = line
            .replace(/"[^"]*"/g, '""')
            .replace(/'[^']*'/g, "''")
            .replace(/url\([^)]*\)/g, 'url()');

        /* ── Track :root scope (always, even when disabled) ── */
        if (/:\s*root\b/.test(strippedLine) && !/[>+~]/.test(strippedLine)) {
            rootPending = true;
        }

        for (const char of strippedLine) {
            if (char === '{') {
                if (rootPending) {
                    rootStartDepth = braceDepth;
                    rootPending = false;
                }
                braceDepth++;
                blockOrderStack.push({ lastGroup: 0, lastGroupProp: '', lastGroupLine: 0 });
            }
            if (char === '}') {
                braceDepth--;
                if (blockOrderStack.length > 1) blockOrderStack.pop();
                if (rootStartDepth >= 0 && braceDepth === rootStartDepth) {
                    rootStartDepth = -1;
                }
            }
        }

        const inRoot = rootStartDepth >= 0;

        /* Skip checks if suppressed via inline comment */
        if (isSkipped) continue;

        /* ── @import cascade order ── */
        const importMatch = strippedLine.match(/@import\s+(?:url\(\s*)?['"]([^'"]+)['"]/);
        if (importMatch) {
            const importFile = path.basename(importMatch[1], '.css');
            const cascadePosition = CSS_CASCADE_MAP.get(importFile);
            if (cascadePosition !== undefined) {
                if (cascadePosition < lastCascadeIdx) {
                    issues.push({
                        line: lineNum,
                        col: raw.indexOf(importMatch[1]) + 1,
                        severity: WARN,
                        message: `'${importFile}.css' imported after '${lastCascadeName}.css' — expected order: reset → global → layouts → components → overrides`,
                        rule: 'css-import-order',
                        skill: RULE_SKILLS['css-import-order'],
                    });
                }
                lastCascadeIdx = cascadePosition;
                lastCascadeName = importFile;
            }
        }

        /* ── ID selector (check before skipping root) ── */
        const idSelectorMatch = strippedLine.match(/(^|[\s,;{}])#([a-zA-Z_][\w-]*)\s*[{,:]/);
        if (idSelectorMatch && !strippedLine.trim().startsWith('--')) {
            issues.push({
                line: lineNum,
                col: raw.indexOf('#' + idSelectorMatch[2]) + 1,
                severity: WARN,
                message: `ID selector '#${idSelectorMatch[2]}' — use classes to avoid specificity wars`,
                rule: 'no-id-selector',
                skill: RULE_SKILLS['no-id-selector'],
            });
        }

        /* ── @media max-width (check before skipping root) ── */
        if (/@media\b/.test(strippedLine) && /max-width/.test(strippedLine)) {
            issues.push({
                line: lineNum,
                col: raw.indexOf('max-width') + 1,
                severity: WARN,
                message: 'max-width media query — use min-width (mobile-first)',
                rule: 'mobile-first',
                skill: RULE_SKILLS['mobile-first'],
            });
        }

        /* Skip :root token definitions */
        if (inRoot) continue;

        /* Skip custom property declarations (token definitions anywhere) */
        if (/^\s*--[\w-]+\s*:/.test(strippedLine)) continue;

        /* ── Extract property: value declaration ── */
        const declMatch = strippedLine.match(/^\s*([\w-]+)\s*:\s*(.+?)\s*;?\s*$/);
        if (!declMatch) continue;

        const prop = declMatch[1];
        const value = declMatch[2];

        /* ── Property ordering ── */
        const group = getPropertyGroup(prop);
        if (group > 0 && blockOrderStack.length > 0) {
            const block = blockOrderStack[blockOrderStack.length - 1];
            if (group < block.lastGroup) {
                issues.push({
                    line: lineNum,
                    col: raw.indexOf(prop) + 1,
                    severity: WARN,
                    message: `'${prop}' (${PROPERTY_GROUP_NAMES[group]}) after '${block.lastGroupProp}' (${PROPERTY_GROUP_NAMES[block.lastGroup]}) — expected: Positioning → Box Model → Typography → Visual → Animation`,
                    rule: 'css-property-order',
                    skill: RULE_SKILLS['css-property-order'],
                });
            }
            if (group >= block.lastGroup) {
                block.lastGroup = group;
                block.lastGroupProp = prop;
                block.lastGroupLine = lineNum;
            }
        }

        /* ── !important ── */
        if (value.includes('!important')) {
            issues.push({
                line: lineNum,
                col: raw.indexOf('!important') + 1,
                severity: WARN,
                message: '!important — avoid unless absolutely necessary',
                rule: 'no-important',
                skill: RULE_SKILLS['no-important'],
            });
        }

        /* ── Hardcoded hex colors ── */
        for (const hexMatch of value.matchAll(/#([0-9a-fA-F]{3,8})\b/g)) {
            issues.push({
                line: lineNum,
                col: raw.indexOf(hexMatch[0], raw.indexOf(':')) + 1,
                severity: ERROR,
                message: `Hardcoded color '${hexMatch[0]}' — use var(--color-*)`,
                rule: 'no-hardcoded-color',
                skill: RULE_SKILLS['no-hardcoded-color'],
            });
        }

        /* ── Hardcoded rgb()/rgba() ── */
        if (/rgba?\s*\(/.test(value)) {
            const rgbCol = raw.indexOf('rgb', raw.indexOf(':'));
            issues.push({
                line: lineNum,
                col: rgbCol >= 0 ? rgbCol + 1 : 1,
                severity: ERROR,
                message: 'Hardcoded rgb()/rgba() — use var(--color-*)',
                rule: 'no-hardcoded-color',
                skill: RULE_SKILLS['no-hardcoded-color'],
            });
        }

        /* ── Hardcoded hsl()/hsla() ── */
        if (/hsla?\s*\(/.test(value)) {
            const hslCol = raw.indexOf('hsl', raw.indexOf(':'));
            issues.push({
                line: lineNum,
                col: hslCol >= 0 ? hslCol + 1 : 1,
                severity: ERROR,
                message: 'Hardcoded hsl()/hsla() — use var(--color-*)',
                rule: 'no-hardcoded-color',
                skill: RULE_SKILLS['no-hardcoded-color'],
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
                        skill: RULE_SKILLS['no-hardcoded-color'],
                    });
                }
            }
        }

        /* ── Hardcoded spacing ── */
        if (SPACING_PROP_RE.test(prop)) {
            for (const pxMatch of value.matchAll(/(\d+(?:\.\d+)?)\s*px/g)) {
                const pxValue = parseFloat(pxMatch[1]);
                if (pxValue >= SPACING_PX_THRESHOLD) {
                    issues.push({
                        line: lineNum,
                        col: raw.indexOf(pxMatch[0], raw.indexOf(':')) + 1,
                        severity: WARN,
                        message: `Hardcoded spacing '${pxMatch[0]}' — use var(--space-*)`,
                        rule: 'no-hardcoded-spacing',
                        skill: RULE_SKILLS['no-hardcoded-spacing'],
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
                    skill: RULE_SKILLS['no-hardcoded-font-size'],
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
                    skill: RULE_SKILLS['no-hardcoded-radius'],
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
                    skill: RULE_SKILLS['no-hardcoded-shadow'],
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
                    skill: RULE_SKILLS['no-hardcoded-z-index'],
                });
            }
        }

        /* ── Redundant unit on zero ── */
        for (const unitMatch of value.matchAll(/\b0(px|em|rem|%|vh|vw|vmin|vmax|ch|ex)\b/g)) {
            issues.push({
                line: lineNum,
                col: raw.indexOf(unitMatch[0], raw.indexOf(':')) + 1,
                severity: WARN,
                message: `'${unitMatch[0]}' — use unitless 0`,
                rule: 'unit-zero',
                skill: RULE_SKILLS['unit-zero'],
            });
        }
    }

    /* ── Section and token category order (pre-pass on raw content) ── */
    issues.push(...checkCssSectionOrder(filepath, content));
    issues.push(...checkTokenCategoryOrder(filepath, content));

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
        const htmlLine = lines[i];
        if (/<!--\s*check-disable\s*-->/.test(htmlLine)) disabled = true;
        if (/<!--\s*check-enable\s*-->/.test(htmlLine)) disabled = false;

        if (disabled || skipNext) {
            suppressed.add(i + 1);
            if (skipNext && htmlLine.trim().length > 0) skipNext = false;
        }

        if (/<!--\s*check-disable-next-line\s*-->/.test(htmlLine)) skipNext = true;
    }

    /* ── <link> stylesheet cascade order ── */
    let lastLinkCascadeIdx = -1;
    let lastLinkCascadeName = '';
    const linkRe = /<link\b[^>]*rel\s*=\s*["']stylesheet["'][^>]*href\s*=\s*["']([^"']+)["']|<link\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*rel\s*=\s*["']stylesheet["']/gi;
    let linkMatch;
    while ((linkMatch = linkRe.exec(content)) !== null) {
        const href = linkMatch[1] || linkMatch[2];
        const line = offsetToLine(content, linkMatch.index);
        if (suppressed.has(line)) continue;
        const linkFile = path.basename(href, '.css');
        const cascadeIdx = CSS_CASCADE_MAP.get(linkFile);
        if (cascadeIdx !== undefined) {
            if (cascadeIdx < lastLinkCascadeIdx) {
                issues.push({
                    line,
                    col: offsetToCol(content, linkMatch.index),
                    severity: WARN,
                    message: `'${linkFile}.css' linked after '${lastLinkCascadeName}.css' — expected order: reset → global → layouts → components → overrides`,
                    rule: 'css-import-order',
                    skill: RULE_SKILLS['css-import-order'],
                });
            }
            lastLinkCascadeIdx = cascadeIdx;
            lastLinkCascadeName = linkFile;
        }
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
                skill: RULE_SKILLS['no-inline-style'],
            });
        }
    }

    /* ── img alt required ── */
    const imgRe = /<img\b([^>]*)>/gi;
    let tagMatch;
    while ((tagMatch = imgRe.exec(content)) !== null) {
        const line = offsetToLine(content, tagMatch.index);
        if (suppressed.has(line)) continue;
        if (!/\balt\s*=/.test(tagMatch[1])) {
            issues.push({
                line,
                col: offsetToCol(content, tagMatch.index),
                severity: ERROR,
                message: '<img> missing alt attribute',
                rule: 'img-alt-required',
                skill: RULE_SKILLS['img-alt-required'],
            });
        }
    }

    /* ── Class bloat ── */
    const classRe = /\bclass\s*=\s*"([^"]*)"/gi;
    while ((tagMatch = classRe.exec(content)) !== null) {
        const line = offsetToLine(content, tagMatch.index);
        if (suppressed.has(line)) continue;
        const classes = tagMatch[1].trim().split(/\s+/).filter(Boolean);
        if (classes.length > MAX_CLASSES) {
            issues.push({
                line,
                col: offsetToCol(content, tagMatch.index),
                severity: WARN,
                message: `${classes.length} classes on element (max ${MAX_CLASSES}) — consolidate into semantic class`,
                rule: 'max-classes',
                skill: RULE_SKILLS['max-classes'],
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
            skill: RULE_SKILLS['doctype-required'],
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
            skill: RULE_SKILLS['title-required'],
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
            skill: RULE_SKILLS['wiki-page-attr'],
        });
    }

    /* ── button type required ── */
    const buttonRe = /<button\b([^>]*)>/gi;
    while ((tagMatch = buttonRe.exec(content)) !== null) {
        const line = offsetToLine(content, tagMatch.index);
        if (suppressed.has(line)) continue;
        if (!/\btype\s*=/.test(tagMatch[1])) {
            issues.push({
                line,
                col: offsetToCol(content, tagMatch.index),
                severity: ERROR,
                message: '<button> missing type — add type="button" or type="submit"',
                rule: 'button-type-required',
                skill: RULE_SKILLS['button-type-required'],
            });
        }
    }

    /* ── Heading hierarchy ── */
    const headingRe = /<h([1-6])\b/gi;
    let lastHeadingLevel = 0;
    let h1Count = 0;
    while ((tagMatch = headingRe.exec(content)) !== null) {
        const line = offsetToLine(content, tagMatch.index);
        if (suppressed.has(line)) continue;
        const level = parseInt(tagMatch[1]);
        if (level === 1) h1Count++;
        if (lastHeadingLevel > 0 && level > lastHeadingLevel + 1) {
            issues.push({
                line,
                col: offsetToCol(content, tagMatch.index),
                severity: WARN,
                message: `<h${level}> skips level — expected <h${lastHeadingLevel + 1}> after <h${lastHeadingLevel}>`,
                rule: 'heading-order',
                skill: RULE_SKILLS['heading-order'],
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
            skill: RULE_SKILLS['single-h1'],
        });
    }

    /* ── div/span with onclick ── */
    const clickDivRe = /<(div|span)\b([^>]*?\bonclick\b[^>]*)>/gi;
    while ((tagMatch = clickDivRe.exec(content)) !== null) {
        const line = offsetToLine(content, tagMatch.index);
        if (suppressed.has(line)) continue;
        issues.push({
            line,
            col: offsetToCol(content, tagMatch.index),
            severity: WARN,
            message: `<${tagMatch[1]}> with onclick — use <button type="button"> instead`,
            rule: 'no-div-as-button',
            skill: RULE_SKILLS['no-div-as-button'],
        });
    }

    /* ── Positive tabindex ── */
    const tabindexRe = /\btabindex\s*=\s*"(\d+)"/gi;
    while ((tagMatch = tabindexRe.exec(content)) !== null) {
        const tabindexValue = parseInt(tagMatch[1]);
        if (tabindexValue > 0) {
            const line = offsetToLine(content, tagMatch.index);
            if (suppressed.has(line)) continue;
            issues.push({
                line,
                col: offsetToCol(content, tagMatch.index),
                severity: ERROR,
                message: `tabindex="${tabindexValue}" — positive values break natural tab order, use 0 or -1`,
                rule: 'tabindex-no-positive',
                skill: RULE_SKILLS['tabindex-no-positive'],
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

        /* Preserve raw line for secret detection, use stripped for other checks */
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
                skill: RULE_SKILLS['no-debugger'],
            });
        }

        /* ── no-console ── */
        if (/\bconsole\.(log|warn|error|info|debug|trace|dir|table)\b/.test(stripped)) {
            const consoleMatch = stripped.match(/\bconsole\.(log|warn|error|info|debug|trace|dir|table)\b/);
            issues.push({
                line: lineNum,
                col: raw.indexOf('console.') + 1,
                severity: WARN,
                message: `console.${consoleMatch[1]}() — use a proper logger or remove`,
                rule: 'no-console',
                skill: RULE_SKILLS['no-console'],
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
                skill: RULE_SKILLS['no-var'],
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
                    skill: RULE_SKILLS['no-double-equals'],
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
                skill: RULE_SKILLS['no-empty-catch'],
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
                skill: RULE_SKILLS['no-document-write'],
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
                skill: RULE_SKILLS['no-innerHTML'],
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
                skill: RULE_SKILLS['no-jsx-inline-style'],
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
                    skill: RULE_SKILLS['no-hardcoded-secrets'],
                });
                break; /* one report per line is enough */
            }
        }

        /* ── tier-imports (reverse or layer-skipping dependency) ── */
        const fileTierMatch = filepath.replace(/\\/g, '/').match(/\/(0[1-3])-(?:presentation|logic|data)\//);
        if (fileTierMatch) {
            const fileTierNum = parseInt(fileTierMatch[1]);
            const importMatch = line.match(/(?:import\s+.*?from\s+|require\s*\()['"]([^'"]+)['"]/);
            if (importMatch) {
                const importTierMatch = importMatch[1].match(/(0[1-3])-(?:presentation|logic|data)/);
                if (importTierMatch) {
                    const importTierNum = parseInt(importTierMatch[1]);
                    if (importTierNum !== fileTierNum) {
                        const isReverse = importTierNum < fileTierNum;
                        const isSkip = importTierNum > fileTierNum + 1;
                        if (isReverse) {
                            issues.push({
                                line: lineNum,
                                col: raw.indexOf(importMatch[1]) + 1,
                                severity: ERROR,
                                message: `Reverse tier import — ${fileTierMatch[0].slice(1, -1)} cannot import from ${importTierMatch[0]}`,
                                rule: 'tier-imports',
                                skill: RULE_SKILLS['tier-imports'],
                            });
                        } else if (isSkip) {
                            issues.push({
                                line: lineNum,
                                col: raw.indexOf(importMatch[1]) + 1,
                                severity: ERROR,
                                message: `Layer-skipping import — ${fileTierMatch[0].slice(1, -1)} cannot import directly from ${importTierMatch[0]} (must go through 02-logic)`,
                                rule: 'tier-imports',
                                skill: RULE_SKILLS['tier-imports'],
                            });
                        }
                    }
                }
            }
        }
    }

    return issues;
}

/* ── Project-level checker ─────────────────────────────────────────────── */

function checkProject(cssFiles, jsFiles, htmlFiles) {
    const issues = [];
    const count = cssFiles.length;

    if (count > MAX_CSS_FILES_ERROR) {
        issues.push({
            line: 0,
            col: 0,
            severity: ERROR,
            message: `${count} CSS files — 5-file architecture recommends reset/global/layouts/components/overrides`,
            rule: 'css-file-count',
            skill: RULE_SKILLS['css-file-count'],
        });
    } else if (count > MAX_CSS_FILES_WARN) {
        issues.push({
            line: 0,
            col: 0,
            severity: WARN,
            message: `${count} CSS files — consider consolidating toward 5-file architecture (reset/global/layouts/components/overrides)`,
            rule: 'css-file-count',
            skill: RULE_SKILLS['css-file-count'],
        });
    }

    /* ── Canonical file names ── */
    const CANONICAL_CSS = new Set(['reset.css', 'global.css', 'layouts.css', 'components.css', 'overrides.css']);
    if (count > 0) {
        const names = cssFiles.map((f) => path.basename(f));
        const hasCanonical = names.some((n) => CANONICAL_CSS.has(n));
        if (!hasCanonical) {
            issues.push({
                line: 0,
                col: 0,
                severity: WARN,
                message: `No canonical CSS file names found — expected: reset.css, global.css, layouts.css, components.css, overrides.css`,
                rule: 'css-file-names',
                skill: RULE_SKILLS['css-file-names'],
            });
        }
    }

    /* ── 3-tier architecture (web projects) ── */
    const hasPackageJson = fs.existsSync(path.join(ROOT, 'package.json'));
    const hasWebFiles = count > 0
        || jsFiles.some((f) => /\.(jsx|tsx)$/.test(f))
        || htmlFiles.length > 0;

    if (hasPackageJson && hasWebFiles) {
        const TIER_DIRS = ['01-presentation', '02-logic', '03-data'];
        const existingTiers = TIER_DIRS.filter((t) =>
            fs.existsSync(path.join(ROOT, t)) || fs.existsSync(path.join(ROOT, 'src', t)) || fs.existsSync(path.join(ROOT, 'source', t)),
        );

        const sourceFileCount = count + jsFiles.length + htmlFiles.length;

        if (existingTiers.length === 0 && sourceFileCount > MIN_FILES_FOR_TIER_CHECK) {
            issues.push({
                line: 0,
                col: 0,
                severity: ERROR,
                message: `Web project without 3-tier architecture — expected: 01-presentation/, 02-logic/, 03-data/`,
                rule: 'tier-structure',
                skill: RULE_SKILLS['tier-structure'],
            });
        } else if (existingTiers.length > 0 && existingTiers.length < 3) {
            const missing = TIER_DIRS.filter((t) => !existingTiers.includes(t));
            issues.push({
                line: 0,
                col: 0,
                severity: ERROR,
                message: `Incomplete tier structure: found ${existingTiers.join(', ')} — missing: ${missing.join(', ')}`,
                rule: 'tier-structure',
                skill: RULE_SKILLS['tier-structure'],
            });
        }
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
        console.log(`\n  ${ansi.underline(rel)}`);

        for (const issue of filtered) {
            const loc = issue.line === 0
                ? ansi.dim(''.padEnd(8))
                : ansi.dim(`${issue.line}:${issue.col}`.padEnd(8));
            const sev =
                issue.severity === ERROR
                    ? ansi.red(issue.severity.padEnd(6))
                    : ansi.yellow(issue.severity.padEnd(6));
            const rule = ansi.dim(issue.rule);
            const skill = issue.skill ? ansi.dim(`[${issue.skill}]`) : '';
            console.log(`    ${loc} ${sev} ${issue.message}  ${rule}  ${skill}`);

            if (issue.severity === ERROR) errors++;
            else warnings++;
        }
    }

    if (errors + warnings === 0) {
        console.log(`\n  ${ansi.green('\u2714')} No issues found\n`);
        return 0;
    }

    const icon = errors > 0 ? ansi.red('\u2716') : ansi.yellow('\u26A0');
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
    node check.js --validate-registry  Verify all rules are in RULE_SKILLS

  Exit: 0 = clean, 1 = errors found (warnings alone don't fail)
`);
        process.exit(0);
    }

    /* --validate-registry: self-check that every rule ID used in checker
       functions is registered in RULE_SKILLS (dev-time safeguard) */
    if (args.includes('--validate-registry')) {
        const sourceCode = fs.readFileSync(__filename, 'utf8');
        const usedRules = new Set();
        /* Build regex dynamically to avoid self-matching */
        const ruleRe = new RegExp("rule:\\s*'([a-zA-Z][a-zA-Z0-9-]+)'", 'g');
        for (const ruleMatch of sourceCode.matchAll(ruleRe)) {
            usedRules.add(ruleMatch[1]);
        }
        const registered = new Set(Object.keys(RULE_SKILLS));
        let ok = true;
        for (const rule of usedRules) {
            if (!registered.has(rule)) {
                console.log(ansi.red(`  Missing from RULE_SKILLS: '${rule}'`));
                ok = false;
            }
        }
        for (const rule of registered) {
            if (!usedRules.has(rule)) {
                console.log(ansi.yellow(`  In RULE_SKILLS but never used: '${rule}'`));
                ok = false;
            }
        }
        if (ok) {
            console.log(ansi.green(`  ✔ All ${registered.size} rules registered and used`));
        }
        process.exit(ok ? 0 : 1);
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
    const projectIssues = checkProject(cssFiles, jsFiles, htmlFiles);
    if (projectIssues.length > 0) {
        results.push({ file: path.join(ROOT, '(project)'), issues: projectIssues });
    }

    const exitCode = report(results, quiet);
    process.exit(exitCode);
}

main();
