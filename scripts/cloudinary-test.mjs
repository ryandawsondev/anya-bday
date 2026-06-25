import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'df9cka4lv',
  api_key: '273282595469533',
  api_secret: 'MnDJtWr51WrrOFQFm4erlHrY2xg',
});

console.log('Uploading sample image...');
const result = await cloudinary.uploader.upload(
  'https://res.cloudinary.com/demo/image/upload/sample.jpg'
);

console.log('\n--- Upload Result ---');
console.log('Secure URL:', result.secure_url);
console.log('Public ID: ', result.public_id);

console.log('\n--- Image Details ---');
console.log('Width:     ', result.width);
console.log('Height:    ', result.height);
console.log('Format:    ', result.format);
console.log('File size: ', result.bytes, 'bytes');

// f_auto: serve WebP/AVIF/etc based on what the browser supports
// q_auto: reduce quality to smallest acceptable level automatically
const transformedUrl = cloudinary.url(result.public_id, {
  fetch_format: 'auto',
  quality: 'auto',
});

console.log('\nDone! Click link below to see optimized version of the image. Check the size and the format.');
console.log(transformedUrl);
