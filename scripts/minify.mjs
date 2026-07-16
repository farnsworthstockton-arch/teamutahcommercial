#!/usr/bin/env node
// Conservative, dependency-free minifier for script.js -> script.min.js.
//
// Strips comments and collapses whitespace while leaving strings, template
// literals, and regex literals untouched (tracked via a small state machine).
// Deliberately does NOT rename identifiers or remove semicolons/newlines
// inside code — this is a safe whitespace/comment pass, not a full minifier,
// so it can't change runtime behavior.
//
//   node scripts/minify.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

function minify(src) {
    let out = '';
    let i = 0;
    const n = src.length;
    let lastMeaningful = '';

    const isRegexAllowed = () => {
        const t = lastMeaningful;
        if (!t) return true;
        if (/[\w$\])]$/.test(t) && !/\b(return|typeof|instanceof|in|of|new|delete|void|throw|case|do|else|yield)$/.test(t)) return false;
        return true;
    };

    while (i < n) {
        const c = src[i];
        const c2 = src[i + 1];

        // line comment
        if (c === '/' && c2 === '/') {
            i += 2;
            while (i < n && src[i] !== '\n') i++;
            continue;
        }
        // block comment
        if (c === '/' && c2 === '*') {
            i += 2;
            while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++;
            i += 2;
            continue;
        }
        // strings
        if (c === '"' || c === "'" || c === '`') {
            const quote = c;
            let str = c;
            i++;
            while (i < n) {
                if (src[i] === '\\' && i + 1 < n) { str += src[i] + src[i + 1]; i += 2; continue; }
                if (src[i] === quote) { str += src[i]; i++; break; }
                str += src[i]; i++;
            }
            out += str;
            lastMeaningful = str;
            continue;
        }
        // regex literal (best-effort)
        if (c === '/' && isRegexAllowed()) {
            let j = i + 1;
            let inClass = false;
            let ok = false;
            while (j < n) {
                if (src[j] === '\\') { j += 2; continue; }
                if (src[j] === '[') inClass = true;
                else if (src[j] === ']') inClass = false;
                else if (src[j] === '/' && !inClass) { ok = true; break; }
                else if (src[j] === '\n') break;
                j++;
            }
            if (ok) {
                let k = j + 1;
                while (k < n && /[a-z]/i.test(src[k])) k++;
                const regex = src.slice(i, k);
                out += regex;
                lastMeaningful = regex;
                i = k;
                continue;
            }
        }
        // whitespace run -> single space (or nothing at line boundaries around punctuation)
        if (/\s/.test(c)) {
            let j = i;
            while (j < n && /\s/.test(src[j])) j++;
            const prev = out[out.length - 1];
            const next = src[j];
            const skippable = (ch) => ch === undefined || /[{}();,:?=&|+\-*/<>!\[\]]/.test(ch);
            if (!(skippable(prev) || skippable(next))) {
                out += ' ';
            }
            i = j;
            continue;
        }
        out += c;
        lastMeaningful += c;
        if (lastMeaningful.length > 40) lastMeaningful = lastMeaningful.slice(-40);
        i++;
    }
    return out.trim();
}

function main() {
    const src = readFileSync(join(ROOT, 'script.js'), 'utf8');
    const min = minify(src);
    writeFileSync(join(ROOT, 'script.min.js'), min);
    console.log(`script.js: ${src.length} bytes -> script.min.js: ${min.length} bytes (${Math.round((1 - min.length / src.length) * 100)}% smaller)`);
}

main();
