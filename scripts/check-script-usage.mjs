#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

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

const sourceScript = readFileSync(join(root, 'script.js'), 'utf8');
const logicContext = {};
vm.runInNewContext(
    sourceScript.match(/function hasNumericPrice[\s\S]*?(?=\/\/ Filter properties based)/)[0] +
    '; this.hasNumericPrice = hasNumericPrice; this.comparePropertiesByPrice = comparePropertiesByPrice;',
    logicContext
);
const priced = { price: 500000 };
const expensive = { price: 2000000 };
const unknown = { price: 0 };
assert.equal(logicContext.hasNumericPrice(priced), true, 'positive numeric prices must be filterable');
assert.equal(logicContext.hasNumericPrice(unknown), false, 'unknown prices must not match a max-price filter');
assert.ok(logicContext.comparePropertiesByPrice(priced, expensive, 'low-high') < 0, 'low-to-high price sorting is incorrect');
assert.ok(logicContext.comparePropertiesByPrice(unknown, priced, 'low-high') > 0, 'unknown prices must sort after known prices');
assert.ok(logicContext.comparePropertiesByPrice(unknown, expensive, 'high-low') > 0, 'unknown prices must remain last when sorting high-to-low');

const listing = readFileSync(join(root, 'listing.html'), 'utf8');
assert.ok(
    listing.includes("window.location.href = 'mailto:Robert@teamutahcre.com?subject='"),
    'listing inquiry form must hand submissions to a real contact channel'
);
assert.ok(
    !listing.includes('Form submit (demo'),
    'listing inquiry form must not use the fake-success demo handler'
);

console.log('Listings script and inquiry form usage are valid.');
