import { execSync } from 'child_process';
import { readdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import exifr from 'exifr';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const RESULTS_FILE = join(__dirname, 'cloudinary-urls.json');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.heic', '.webp']);
const VIDEO_EXTS = new Set(['.mp4', '.mov', '.m4v']);

const urls = JSON.parse(readFileSync(RESULTS_FILE, 'utf-8'));

async function getDate(filePath, ext) {
  // Images: use exifr for accurate DateTimeOriginal
  if (IMAGE_EXTS.has(ext)) {
    try {
      const tags = await exifr.parse(filePath, ['DateTimeOriginal', 'DateTime', 'CreateDate']);
      const d = tags?.DateTimeOriginal ?? tags?.DateTime ?? tags?.CreateDate;
      if (d) return new Date(d);
    } catch { /* ignore */ }
  }

  // Videos: use ffprobe creation_time
  try {
    const raw = execSync(
      `ffprobe -v quiet -print_format json -show_format -show_streams "${filePath}"`,
      { encoding: 'utf-8' }
    );
    const data = JSON.parse(raw);
    const ft = data.format?.tags?.creation_time;
    if (ft) return new Date(ft);
    for (const s of (data.streams || [])) {
      const t = s.tags?.creation_time;
      if (t) return new Date(t);
    }
  } catch { /* ignore */ }

  return null;
}

const FOLDERS = ['photo', 'video', 'new_content'];
const entries = [];

for (const folder of FOLDERS) {
  const dir = join(ROOT, 'public', folder);
  if (!existsSync(dir)) continue;
  for (const name of readdirSync(dir)) {

    const ext = extname(name).toLowerCase();
    if (!IMAGE_EXTS.has(ext) && !VIDEO_EXTS.has(ext)) continue;
    const filePath = join(dir, name);
    const date = await getDate(filePath, ext);
    const cloudEntry = urls[name];
    entries.push({
      name,
      date,
      dateStr: date ? date.toISOString().slice(0, 10) : 'unknown',
      url: cloudEntry?.url ?? '(not uploaded)',
      type: cloudEntry?.resourceType ?? (IMAGE_EXTS.has(ext) ? 'image' : 'video'),
    });
  }
}

entries.sort((a, b) => {
  if (!a.date && !b.date) return 0;
  if (!a.date) return 1;
  if (!b.date) return -1;
  return a.date - b.date;
});

// Write markdown report
const lines = [
  '# Media Date Report',
  '',
  'Sort by capture date. Group into visits below — add a "## Visit N" header above each group.',
  '',
  '| Date | File | Type | Cloudinary URL |',
  '|------|------|------|----------------|',
  ...entries.map(e =>
    `| ${e.dateStr} | ${e.name} | ${e.type} | ${e.url} |`
  ),
  '',
];

const reportPath = join(__dirname, 'date-report.md');
writeFileSync(reportPath, lines.join('\n'));
console.log(`Report written to scripts/date-report.md`);
console.log(`${entries.length} files, ${entries.filter(e => !e.date).length} with unknown date`);
