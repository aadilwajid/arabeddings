// Simple icon generator for PWA
// Run: node scripts/generate-icons.js

const fs = require('fs');
const path = require('path');

// Create icons directory
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Simple SVG icon (gold circle with "ARA" text)
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#FDF8F3"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.4}" fill="#C4A265"/>
  <text x="${size/2}" y="${size/2 + size*0.05}" font-family="Georgia, serif" font-size="${size*0.2}" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">ARA</text>
</svg>
`;

// Write SVG files (browsers can use SVG as icons)
fs.writeFileSync(path.join(iconsDir, 'icon-192.svg'), createSVGIcon(192));
fs.writeFileSync(path.join(iconsDir, 'icon-512.svg'), createSVGIcon(512));

// Create simple PNG placeholders (1x1 pixel PNG)
// In production, you'd use actual PNG files or convert SVG to PNG
const pngPlaceholder = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), pngPlaceholder);
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), pngPlaceholder);

console.log('✓ PWA icons generated');
console.log('  Note: For production, replace placeholder PNGs with actual icons');
