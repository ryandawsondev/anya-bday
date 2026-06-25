import { v2 as cloudinary } from 'cloudinary';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';
import { tmpdir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

cloudinary.config({
  cloud_name: 'df9cka4lv',
  api_key: '273282595469533',
  api_secret: 'MnDJtWr51WrrOFQFm4erlHrY2xg',
});

const RESULTS_FILE = join(__dirname, 'cloudinary-urls.json');

const LARGE_FILES = [
  join(ROOT, 'public', 'video', 'IMG_0581.MOV'),
  join(ROOT, 'public', 'video', 'IMG_2111.mov'),
  join(ROOT, 'public', 'video', 'IMG_2978.MOV'),
  join(ROOT, 'public', 'video', 'IMG_3026.MOV'),
  join(ROOT, 'public', 'video', 'IMG_3055.MOV'),
];

function loadResults() {
  if (existsSync(RESULTS_FILE)) {
    return JSON.parse(readFileSync(RESULTS_FILE, 'utf-8'));
  }
  return {};
}

const results = loadResults();

for (const filePath of LARGE_FILES) {
  const name = basename(filePath);
  const tmpOut = join(tmpdir(), name.replace(/\.[^.]+$/, '_compressed.mp4'));

  console.log(`\nCompressing ${name}...`);
  try {
    execSync(
      `ffmpeg -y -i "${filePath}" -c:v libx264 -crf 28 -preset fast -vf "scale=-2:1080" -c:a aac -b:a 128k "${tmpOut}"`,
      { stdio: 'inherit' }
    );
  } catch (err) {
    console.error(`  ✗ Compression failed for ${name}: ${err.message}`);
    continue;
  }

  console.log(`Uploading compressed ${name}...`);
  try {
    const result = await cloudinary.uploader.upload(tmpOut, {
      resource_type: 'video',
      folder: 'anya-bday',
      public_id: name.replace(/\.[^.]+$/, ''),
      overwrite: true,
    });
    results[name] = {
      original: name,
      publicId: result.public_id,
      url: result.secure_url,
      bytes: result.bytes,
      format: result.format,
      resourceType: 'video',
      compressed: true,
    };
    writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
    console.log(`  ✓ ${name} → ${result.secure_url}`);
  } catch (err) {
    console.error(`  ✗ Upload failed for ${name}: ${err.message}`);
  }
}

console.log('\nAll done. Results updated in scripts/cloudinary-urls.json');
