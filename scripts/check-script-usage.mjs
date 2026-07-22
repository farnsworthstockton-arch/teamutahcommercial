#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const listingsScript = '<script src="script.min.js" defer></script>';
const requiredListingIds = [
    'propertiesGrid',
    'propertyCount',
    'loading',
    'noResults',
    'typeFilter',
    'priceFilter',
    'searchFilter',
    'sortFilter'
];

for (const page of ['index.html', 'cre-tools.html']) {
    const html = readFileSync(join(root, page), 'utf8');
    if (!html.includes(listingsScript)) continue;

    for (const id of requiredListingIds) {
        assert.match(
            html,
            new RegExp(`id=["']${id}["']`),
            `${page} loads script.min.js but is missing #${id}`
        );
    }
}

const index = readFileSync(join(root, 'index.html'), 'utf8');
assert.ok(index.includes(listingsScript), 'index.html must load the listings script');

console.log('Listings script usage is valid.');
