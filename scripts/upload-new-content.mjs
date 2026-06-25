import { v2 as cloudinary } from 'cloudinary';
import { readdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
import { join, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

cloudinary.config({
  cloud_name: 'df9cka4lv',
  api_key: '273282595469533',
  api_secret: 'MnDJtWr51WrrOFQFm4erlHrY2xg',
});

const RESULTS_FILE = join(__dirname, 'cloudinary-urls.json');
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.heic', '.webp']);
const VIDEO_EXTS = new Set(['.mp4', '.mov', '.m4v']);

function loadResults() {
  if (existsSync(RESULTS_FILE)) return JSON.parse(readFileSync(RESULTS_FILE, 'utf-8'));
  return {};
}

const results = loadResults();
const dir = join(ROOT, 'public', 'new_content');
const files = readdirSync(dir).map(f => join(dir, f));

for (const filePath of files) {
  const ext = extname(filePath).toLowerCase();
  const name = basename(filePath);
  const isImage = IMAGE_EXTS.has(ext);
  const isVideo = VIDEO_EXTS.has(ext);

  if (!isImage && !isVideo) {
    console.log(`Skipping unsupported: ${name}`);
    continue;
  }

  if (results[name]) {
    console.log(`Already uploaded: ${name}`);
    continue;
  }

  console.log(`Uploading ${name}...`);
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: isImage ? 'image' : 'video',
      folder: 'anya-bday',
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    });
    results[name] = {
      original: name,
      publicId: result.public_id,
      url: result.secure_url,
      bytes: result.bytes,
      format: result.format,
      resourceType: isImage ? 'image' : 'video',
    };
    writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
    console.log(`✓ ${name} → ${result.secure_url}`);
  } catch (err) {
    console.error(`✗ ${name}: ${err.message}`);
  }
}

console.log('\nDone. Results updated in scripts/cloudinary-urls.json');
