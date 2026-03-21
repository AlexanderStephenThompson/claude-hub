#!/usr/bin/env node

/**
 * CSS Scaffold
 *
 * Copies the 5 canonical CSS template files into a target directory.
 * Never overwrites existing files — safe to run on a project that
 * already has some CSS files in place.
 *
 * Templates are resolved relative to this script's install location:
 *   ~/.claude/skills/web-css/templates/
 *
 * Usage:
 *   node scaffold-css.js <target-directory>
 *   node scaffold-css.js ./src/styles
 *   node scaffold-css.js --dry-run <target-directory>
 *
 * Exit: 0 = success, 1 = error
 */

'use strict';

const fs = require('fs');
const path = require('path');

const TEMPLATE_FILES = ['reset.css', 'global.css', 'layouts.css', 'components.css', 'overrides.css'];

/**
 * Resolve the templates directory relative to this script's location.
 * When deployed via sync, this script lives at:
 *   ~/.claude/plugins/cache/claude-hub/clean-web/<version>/scripts/scaffold-css.js
 * Templates live at:
 *   ~/.claude/skills/web-css/templates/
 *
 * Fallback: look relative to the repo structure for development use.
 */
function findTemplatesDir() {
    /* Primary: deployed location */
    const claudeDir = process.env.HOME
        ? path.join(process.env.HOME, '.claude')
        : path.join(process.env.USERPROFILE || '', '.claude');
    const deployedDir = path.join(claudeDir, 'skills', 'web-css', 'templates');
    if (fs.existsSync(deployedDir)) return deployedDir;

    /* Fallback: repo-relative (for development) */
    const repoDir = path.resolve(__dirname, '..', '..', '..', 'skills', 'web-css', 'templates');
    if (fs.existsSync(repoDir)) return repoDir;

    return null;
}

function main() {
    const args = process.argv.slice(2);
    let dryRun = false;
    const paths = [];

    for (const arg of args) {
        if (arg === '--dry-run') dryRun = true;
        else if (arg === '--help' || arg === '-h') {
            console.log('Usage: scaffold-css.js [--dry-run] <target-directory>');
            console.log('Copies the 5 canonical CSS templates into the target directory.');
            console.log('Never overwrites existing files.');
            process.exit(0);
        } else paths.push(arg);
    }

    if (paths.length === 0) {
        console.error('Error: No target directory specified.');
        console.error('Usage: scaffold-css.js [--dry-run] <target-directory>');
        process.exit(1);
    }

    const targetDir = path.resolve(paths[0]);
    const templatesDir = findTemplatesDir();

    if (!templatesDir) {
        console.error('Error: Cannot find CSS templates directory.');
        console.error('Expected at: ~/.claude/skills/web-css/templates/');
        process.exit(1);
    }

    /* Verify all templates exist */
    for (const file of TEMPLATE_FILES) {
        const templatePath = path.join(templatesDir, file);
        if (!fs.existsSync(templatePath)) {
            console.error(`Error: Missing template: ${templatePath}`);
            process.exit(1);
        }
    }

    /* Create target directory if needed */
    if (!dryRun && !fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
        console.log(`Created: ${targetDir}`);
    }

    let copiedCount = 0;
    let skippedCount = 0;

    for (const file of TEMPLATE_FILES) {
        const src = path.join(templatesDir, file);
        const dest = path.join(targetDir, file);

        if (fs.existsSync(dest)) {
            console.log(`SKIP: ${file} (already exists)`);
            skippedCount++;
            continue;
        }

        if (dryRun) {
            console.log(`WOULD COPY: ${file}`);
        } else {
            fs.copyFileSync(src, dest);
            console.log(`COPIED: ${file}`);
        }
        copiedCount++;
    }

    console.log('');
    if (dryRun) {
        console.log(`Dry run: ${copiedCount} file(s) would be copied, ${skippedCount} skipped.`);
    } else {
        console.log(`Done: ${copiedCount} file(s) copied, ${skippedCount} skipped.`);
    }
}

main();
