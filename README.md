# Officer Safety & Wellness Legislative Watch

Prototype public legislative information service for federal legislation affecting law-enforcement officer safety, wellness, families, training, and agency capacity.

## Tonight's prototype

- `/index.html` — public landing page with three featured bills
- `/bill.html?bill=119-s-419` — individual legislation view
- `/embed-demo.html` — same embed rendered inside three different host-site designs
- `/embed.js` — stylesheet-free embed script
- `/.netlify/functions/congress-bill` — server-side Congress.gov API proxy

## Core embed principle

The embed ships **no stylesheet**. It injects semantic HTML and predictable class names. The host website controls fonts, colors, spacing, borders, and layout.

Example:

```html
<div data-osw-legislation data-bill="119-s-419"></div>
<script src="https://YOUR-SITE.netlify.app/embed.js" defer></script>
```

## Congress.gov API

Create a Congress.gov API key at https://api.congress.gov/sign-up/

In Netlify, add a secret environment variable:

`CONGRESS_API_KEY`

The API key stays server-side and is never sent to the browser.

## Demo legislation

- S. 419 — Reauthorizing Support and Treatment for Officers in Crisis Act of 2025
- H.R. 2240 — Improving Law Enforcement Officer Safety and Wellness Through Data Act
- H.R. 2711 — Invest to Protect Act of 2025

The prototype contains editorial fallback data so it remains presentable before the API key is configured. Once the key is present, official Congress.gov bill metadata can be retrieved through the Netlify function.
