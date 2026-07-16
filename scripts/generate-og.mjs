#!/usr/bin/env node
// Generates static Open Graph / Twitter Card metadata for each listing that has
// its own listing.html detail page, plus a matching sitemap.xml.
//
// Source of truth: real-listings.json. Re-run this after any listing change
// (new listing, price update, photo swap) to keep og/listings.json and
// sitemap.xml in sync. No network calls, no dependencies beyond Node's fs.
//
//   node scripts/generate-og.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SITE = 'https://teamutahcommercial.com';
const TODAY = '2026-07-16'; // bump manually on each regeneration

const EAGLE_MTN_OM_MARKER = 'propid=169603-1';

const typeNames = {
    'Retail': 'Retail', 'RETAIL': 'Retail',
    'Res. Land': 'Residential Land', 'Retail Land': 'Retail Land',
    'Industrial Land': 'Industrial Land', 'Commercial Land': 'Commercial Land',
    'Ag. Land': 'Agricultural Land',
    'IND': 'Industrial', 'Industrial': 'Industrial',
    'OFFICE': 'Office', 'Office': 'Office',
    'FARM': 'Farm', 'Farm': 'Farm',
    'Agricultural': 'Agricultural', 'Income': 'Income', 'Commercial': 'Commercial'
};

function formatPrice(listing) {
    if (listing.price == null) return null;
    return '$' + Number(listing.price).toLocaleString('en-US');
}

function formatAcres(listing) {
    if (listing.acresDisplay) return listing.acresDisplay;
    if (listing.acres) return `${listing.acres} acres`;
    return null;
}

function hasUniqueDetailPage(listing) {
    return Boolean(listing.om) && !String(listing.om).includes(EAGLE_MTN_OM_MARKER);
}

function buildOgEntry(listing) {
    const typeName = typeNames[listing.type] || listing.type || 'Commercial';
    const forLease = /lease/i.test(listing.section || '');
    const priceStr = formatPrice(listing);
    const acresStr = formatAcres(listing);

    const titleBits = [listing.address, typeName].filter(Boolean);
    const ogTitle = `${titleBits.join(' — ')} | Team Utah Commercial`;

    const descBits = [];
    if (priceStr) descBits.push(`${forLease ? 'Available for lease at' : 'Offered at'} ${priceStr}${forLease && listing.sf ? '/SF/yr' : ''}`);
    else descBits.push(forLease ? 'Available for lease' : 'Available for sale');
    if (acresStr) descBits.push(acresStr);
    if (listing.sf) descBits.push(`${Number(listing.sf).toLocaleString('en-US')} SF`);
    const ogDescription = `${typeName} — ${descBits.join(' · ')}. Listed by Team Utah Commercial — RE/MAX Associates.`;

    return {
        address: listing.address,
        url: `${SITE}/listing.html?address=${encodeURIComponent(listing.address)}`,
        image: listing.photo ? `${SITE}/${listing.photo}` : `${SITE}/logos/team-utah-commercial-white.png`,
        title: ogTitle,
        description: ogDescription
    };
}

function main() {
    const listings = JSON.parse(readFileSync(join(ROOT, 'real-listings.json'), 'utf8'));
    const detailListings = listings.filter(hasUniqueDetailPage);

    const ogEntries = detailListings.map(buildOgEntry);
    writeFileSync(join(ROOT, 'og', 'listings.json'), JSON.stringify(ogEntries, null, 2) + '\n');
    console.log(`Wrote og/listings.json (${ogEntries.length} listings with unique detail pages)`);

    const staticPages = [
        { loc: '/', changefreq: 'weekly', priority: '1.0', image: 'logos/team-utah-commercial-white.png', imageTitle: 'Team Utah Commercial Real Estate' },
        { loc: '/map.html', changefreq: 'weekly', priority: '0.8' },
        { loc: '/glossary.html', changefreq: 'monthly', priority: '0.6' },
        { loc: '/blog.html', changefreq: 'weekly', priority: '0.7' },
        { loc: '/cre-tools.html', changefreq: 'monthly', priority: '0.6' },
        { loc: '/analyzer.html', changefreq: 'monthly', priority: '0.6' },
        { loc: '/clients-served', changefreq: 'monthly', priority: '0.7' },
        { loc: '/stockton.html', changefreq: 'monthly', priority: '0.8' },
        { loc: '/eagle-mountain.html', changefreq: 'monthly', priority: '0.8' },
    ];

    const blogSlugs = [
        '1031-exchange-utah-guide',
        'due-diligence-commercial-property-utah',
        'eagle-mountain-commercial-development',
        'nnn-lease-investing-utah',
        'silicon-slopes-commercial-real-estate',
        'understanding-cap-rates-utah',
        'utah-industrial-market-2026',
        'utah-retail-real-estate-trends-2026',
        'utah-zoning-laws-commercial-property',
        'why-invest-salt-lake-city-commercial-real-estate'
    ];
    for (const slug of blogSlugs) {
        staticPages.push({ loc: `/blog/${slug}.html`, changefreq: 'monthly', priority: '0.6' });
    }

    const urlXml = (page) => {
        const image = page.image
            ? `\n    <image:image>\n      <image:loc>${SITE}/${page.image}</image:loc>\n      <image:title>${page.imageTitle}</image:title>\n    </image:image>`
            : '';
        return `  <url>\n    <loc>${SITE}${page.loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>${image}\n  </url>`;
    };

    const listingUrlXml = (entry) => `  <url>\n    <loc>${entry.url}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n    <image:image>\n      <image:loc>${entry.image}</image:loc>\n      <image:title>${escapeXml(entry.title)}</image:title>\n    </image:image>\n  </url>`;

    const body = [
        ...staticPages.map(urlXml),
        ...ogEntries.map(listingUrlXml)
    ].join('\n\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/0.9">\n\n${body}\n\n</urlset>\n`;
    writeFileSync(join(ROOT, 'sitemap.xml'), sitemap);
    console.log(`Wrote sitemap.xml (${staticPages.length} static pages + ${ogEntries.length} listing pages)`);
}

function escapeXml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

main();
