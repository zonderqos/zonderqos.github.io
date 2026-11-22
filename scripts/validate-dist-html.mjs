import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('FAIL: dist/index.html does not exist. Run `npm run build` first.');
  process.exit(1);
}

const html = fs.readFileSync(indexHtmlPath, 'utf8');

if (html.includes('/src/main.tsx')) {
  console.error('FAIL: dist/index.html still references unbuilt /src/main.tsx source file.');
  process.exit(1);
}

const scriptMatches = Array.from(
  html.matchAll(/<script[^>]+src="(\/assets\/[^"]+\.js)"[^>]*>/gi),
).map((m) => m[1]);

const cssMatches = Array.from(
  html.matchAll(/<link[^>]+href="(\/assets\/[^"]+\.css)"[^>]*>/gi),
).map((m) => m[1]);

if (scriptMatches.length === 0) {
  console.error('FAIL: dist/index.html does not reference any built /assets/*.js entry bundle.');
  process.exit(1);
}

if (cssMatches.length === 0) {
  console.error('FAIL: dist/index.html does not reference any built /assets/*.css stylesheet.');
  process.exit(1);
}

for (const assetUrl of [...scriptMatches, ...cssMatches]) {
  const relativeAsset = assetUrl.replace(/^\//, '');
  const fullPath = path.join(distDir, relativeAsset);
  if (!fs.existsSync(fullPath)) {
    console.error(`FAIL: Referenced build asset is missing on disk: ${fullPath}`);
    process.exit(1);
  }
}

console.log(
  `PASS: dist/index.html verified (${scriptMatches.join(', ')} | ${cssMatches.join(', ')})`,
);
