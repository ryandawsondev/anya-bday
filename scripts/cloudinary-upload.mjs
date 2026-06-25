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
const VIDEO_EXTS = new Set(['.mp4', '.mov', '.MP4', '.MOV', '.m4v']);

function getFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).map(f => join(dir, f));
}

function loadResults() {
  if (existsSync(RESULTS_FILE)) {
    return JSON.parse(readFileSync(RESULTS_FILE, 'utf-8'));
  }
  return {};
}

async function uploadFile(filePath, resourceType) {
  const name = basename(filePath);
  console.log(`  Uploading ${name}...`);
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: resourceType,
    folder: 'anya-bday',
    use_filename: true,
    unique_filename: false,
    overwrite: false,
  });
  return {
    original: name,
    publicId: result.public_id,
    url: result.secure_url,
    bytes: result.bytes,
    format: result.format,
    resourceType,
  };
}

const results = loadResults();
let uploaded = 0;
let skipped = 0;

const photos = getFiles(join(ROOT, 'public', 'photo'));
const videos = getFiles(join(ROOT, 'public', 'video'));
const audio  = getFiles(join(ROOT, 'public', 'audio'));

const tasks = [
  ...photos.map(f => ({ f, type: 'image' })),
  ...videos.map(f => ({ f, type: 'video' })),
  ...audio.map(f  => ({ f, type: 'video' })),
];

console.log(`Found ${tasks.length} files to process.\n`);

for (const { f, type } of tasks) {
  const ext = extname(f).toLowerCase();
  const isImage = IMAGE_EXTS.has(ext);
  const isVideo = VIDEO_EXTS.has(ext) || ext === '.mp4';

  if (!isImage && !isVideo) {
    console.log(`  Skipping unsupported: ${basename(f)}`);
    continue;
  }

  const key = basename(f);
  if (results[key]) {
    console.log(`  Already uploaded: ${key}`);
    skipped++;
    continue;
  }

  try {
    const data = await uploadFile(f, type);
    results[key] = data;
    writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
    console.log(`  ✓ ${key} → ${data.url}`);
    uploaded++;
  } catch (err) {
    console.error(`  ✗ ${key}: ${err.message}`);
  }
}

console.log(`\nDone. ${uploaded} uploaded, ${skipped} skipped.`);
console.log(`Results saved to: scripts/cloudinary-urls.json`);
