# Vertex Certification website

Static marketing site for vertex-certification.com, built with HTML, Tailwind CSS v4 and vanilla JS.

## Run locally

```bash
pnpm install
pnpm dev     # Tailwind watcher, rebuilds assets/css/styles.css on change
pnpm start   # static server on http://localhost:3100
```

Before deploying, run `pnpm build` to produce a minified `assets/css/styles.css`.
The site is plain static files, so it can go on any host (Cloudflare Pages, Netlify, Vercel, cPanel).

## Structure

```
index.html  services.html  schemes.html  about.html  contact.html  careers.html
schemes/*.html           15 scheme detail pages (generated, do not edit by hand)
scripts/schemes/         Scheme content (data-*.mjs) and the page template
scripts/build-schemes.mjs  Generates schemes/*.html from the data files
styles/tailwind.css      Tailwind entry: theme tokens (brand purple, accent orange) and shared utilities
assets/css/styles.css    Generated CSS (do not edit by hand)
assets/js/config.js      Single source for phone, email, address, WhatsApp, nav, services and schemes
assets/js/layout.js      Renders the top bar, header + mega menus, mobile drawer, footer and floating actions
assets/js/main.js        Interactions: menus, scroll reveal, counters, FAQ, scheme filters, form validation
assets/img/              Logo (logo.webp, logo-light.webp for dark backgrounds, logo-mark.webp), favicons and photos
assets/docs/             Downloadable documents (company ISO 9001:2015 certificate)
```

Header and footer are injected by `layout.js` into `<div id="site-header">` and `<div id="site-footer">`,
so nav and contact details only need to change in `config.js`.

## Scheme pages

Scheme content lives in `scripts/schemes/data-*.mjs`. After editing it, run `pnpm pages` to regenerate
`schemes/*.html` (`pnpm build` also does this). Sub-folder pages set `data-root="../"` on `<body>` so the
shared header and footer links resolve correctly.

## Photos

Hero and service photos in `assets/img/` are from Unsplash (free for commercial use, no attribution required).

## Enquiry forms

All forms use `data-enquiry-form` and are validated client-side (required fields, Indian mobile number, email).

- `FORM_ENDPOINT` empty (default): submitting opens WhatsApp with the enquiry prefilled.
- `FORM_ENDPOINT` set (Formspree, Web3Forms or your own API): the enquiry is POSTed as JSON.

## To do before launch

- Add real social profile URLs in `config.js` (`SOCIAL_LINKS`)
- Insights cards link to the contact page until blog articles exist
- Confirm scheme limits with the client (they change with government guidelines)
