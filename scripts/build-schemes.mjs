import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { LOAN_SCHEMES } from "./schemes/data-loans.mjs";
import { SUBSIDY_SCHEMES } from "./schemes/data-subsidies.mjs";
import { STARTUP_SUPPORT_SCHEMES } from "./schemes/data-startup-support.mjs";
import { renderSchemePage } from "./schemes/template.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "schemes");
const SCHEMES = [...SUBSIDY_SCHEMES, ...LOAN_SCHEMES, ...STARTUP_SUPPORT_SCHEMES];

async function main() {
  const bySlug = new Map(SCHEMES.map((scheme) => [scheme.slug, scheme]));

  const missing = SCHEMES.flatMap((scheme) => scheme.related.filter((slug) => !bySlug.has(slug)).map((slug) => `${scheme.slug} -> ${slug}`));
  if (missing.length) throw new Error(`Unknown related scheme slugs: ${missing.join(", ")}`);

  await mkdir(OUT_DIR, { recursive: true });
  const stale = (await readdir(OUT_DIR)).filter((file) => file.endsWith(".html") && !bySlug.has(file.replace(/\.html$/, "")));
  await Promise.all(stale.map((file) => rm(path.join(OUT_DIR, file))));

  await Promise.all(SCHEMES.map((scheme) => writeFile(path.join(OUT_DIR, `${scheme.slug}.html`), renderSchemePage(scheme, bySlug))));
  console.log(`Generated ${SCHEMES.length} scheme pages in schemes/`);
}

await main();
