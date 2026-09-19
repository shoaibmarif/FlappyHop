import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const webPublicDir = path.join(rootDir, 'packages', 'web', 'public');
const extIconsDir = path.join(rootDir, 'packages', 'extension', 'public', 'icons');
const svgPath = path.join(webPublicDir, 'favicon.svg');

if (!fs.existsSync(svgPath)) {
  console.error(`SVG icon not found at ${svgPath}`);
  process.exit(1);
}

if (!fs.existsSync(webPublicDir)) {
  fs.mkdirSync(webPublicDir, { recursive: true });
}
if (!fs.existsSync(extIconsDir)) {
  fs.mkdirSync(extIconsDir, { recursive: true });
}

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'og-image.png', size: 1200, height: 630 }
];

console.log('Generating high-resolution icons using Chrome headless...');

const tempHtml = path.join(rootDir, 'temp-render.html');
const svgRaw = fs.readFileSync(svgPath, 'utf8');

for (const target of sizes) {
  const w = target.size;
  const h = target.height || target.size;
  const isOg = target.name === 'og-image.png';

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${w}px;
    height: ${h}px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${isOg ? 'linear-gradient(135deg, #090d16 0%, #1e1b4b 100%)' : 'transparent'};
    overflow: hidden;
  }
  .wrapper {
    width: ${isOg ? '320px' : '100%'};
    height: ${isOg ? '320px' : '100%'};
    display: flex;
    align-items: center;
    justify-content: center;
  }
  svg {
    width: 100%;
    height: 100%;
  }
  ${isOg ? `
  .hero-text {
    position: absolute;
    bottom: 60px;
    font-family: system-ui, -apple-system, sans-serif;
    text-align: center;
    color: #ffffff;
  }
  .hero-title {
    font-size: 52px;
    font-weight: 800;
    letter-spacing: -1px;
    margin-bottom: 8px;
    background: linear-gradient(to right, #38bdf8, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .hero-desc {
    font-size: 24px;
    color: #94a3b8;
  }
  ` : ''}
</style>
</head>
<body>
  <div class="wrapper">
    ${svgRaw}
  </div>
  ${isOg ? `
  <div class="hero-text">
    <div class="hero-title">Flappy Bird Online</div>
    <div class="hero-desc">Play Free In-Browser • 100% Client-Side Retro Arcade</div>
  </div>
  ` : ''}
</body>
</html>`;

  fs.writeFileSync(tempHtml, htmlContent, 'utf8');
  const outputPath = path.join(webPublicDir, target.name);

  execFileSync(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    `--window-size=${w},${h}`,
    `--screenshot=${outputPath}`,
    `file://${tempHtml.replace(/\\/g, '/')}`
  ]);

  console.log(`✓ Rendered ${target.name} (${w}x${h})`);
}

// Clean up temp file
if (fs.existsSync(tempHtml)) {
  fs.unlinkSync(tempHtml);
}

// Copy Chrome extension icons
fs.copyFileSync(path.join(webPublicDir, 'favicon-16x16.png'), path.join(extIconsDir, 'icon16.png'));
fs.copyFileSync(path.join(webPublicDir, 'favicon-48x48.png'), path.join(extIconsDir, 'icon48.png'));
// Generate icon128.png for extension
const icon128Html = path.join(rootDir, 'temp-128.html');
fs.writeFileSync(
  icon128Html,
  `<!DOCTYPE html><html><body style="margin:0;width:128px;height:128px;display:flex;align-items:center;justify-content:center;background:transparent">${svgRaw}</body></html>`
);
execFileSync(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--window-size=128,128',
  `--screenshot=${path.join(extIconsDir, 'icon128.png')}`,
  `file://${icon128Html.replace(/\\/g, '/')}`
]);
if (fs.existsSync(icon128Html)) {
  fs.unlinkSync(icon128Html);
}
console.log('✓ Generated Chrome Extension icons (icon16, icon48, icon128)');

// Build multi-icon binary favicon.ico containing 16x16, 32x32, and 48x48 PNGs
function buildMultiIco(images, outPath) {
  // ICO Header: 6 bytes
  // 2 bytes reserved (0), 2 bytes type (1 for ICO), 2 bytes count
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  let offset = 6 + count * 16;
  const directoryEntries = [];
  const imageBuffers = [];

  for (const img of images) {
    const data = fs.readFileSync(img.path);
    imageBuffers.push(data);

    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 0); // width
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 1); // height
    entry.writeUInt8(0, 2); // color palette (0 if >= 8bpp)
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8); // size of image in bytes
    entry.writeUInt32LE(offset, 12); // file offset

    directoryEntries.push(entry);
    offset += data.length;
  }

  const icoBuffer = Buffer.concat([header, ...directoryEntries, ...imageBuffers]);
  fs.writeFileSync(outPath, icoBuffer);
  console.log(`✓ Assembled multi-resolution favicon.ico (${images.map(i => i.size).join(', ')})`);
}

buildMultiIco(
  [
    { size: 16, path: path.join(webPublicDir, 'favicon-16x16.png') },
    { size: 32, path: path.join(webPublicDir, 'favicon-32x32.png') },
    { size: 48, path: path.join(webPublicDir, 'favicon-48x48.png') }
  ],
  path.join(webPublicDir, 'favicon.ico')
);

console.log('✅ Favicon & Icon suite build complete!');

