import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { applyResponsiveImages } from '../scripts/responsive-images.mjs';
const manifest = {'/assets/photo.jpg': {width:1200,height:800,candidates:[{width:480,url:'/assets/responsive/photo-480.webp'},{width:1200,url:'/assets/responsive/photo-1200.webp'}]}};
test('adds WebP source while preserving fallback, attributes and hero priority', () => {
 const img='<img fetchpriority="high" src="/assets/photo.jpg" alt="Original detail" width="1200" height="800">';
 const out=applyResponsiveImages(img,manifest);
 assert.ok(out.includes(img)); assert.match(out, /type="image\/webp"/); assert.match(out,/photo-480.webp 480w/); assert.doesNotMatch(out,/loading="lazy"/);
 assert.equal(applyResponsiveImages(out,manifest),out);
});
test('inactive lazy loading survives and unknown images remain exact',()=>{
 const img='<img loading="lazy" decoding="async" src="/assets/photo.jpg" alt="Inactive">';
 assert.ok(applyResponsiveImages(img,manifest).includes(img));
 assert.equal(applyResponsiveImages('<img src="/other.png">',manifest),'<img src="/other.png">');
});
test('generated candidates resolve, have truthful widths, preserve original hashes and logo alpha',async()=>{
 const data=JSON.parse(await readFile(new URL('../data/responsive-images.json',import.meta.url)));
 const {createHash}=await import('node:crypto');
 for(const [url,entry] of Object.entries(data)) {
  const original=await readFile(new URL('..'+url,import.meta.url));
  assert.equal(createHash('sha256').update(original).digest('hex'),entry.sha256);
  for(const candidate of entry.candidates) {
   const bytes=await readFile(new URL('..'+candidate.url,import.meta.url));
   assert.equal(bytes.length,candidate.bytes); assert.ok(candidate.width<=entry.width);
   assert.equal(bytes.toString('ascii',8,12),'WEBP');
   const kind=bytes.toString('ascii',12,16);
   let width,height;
   if(kind==='VP8X'){width=1+bytes.readUIntLE(24,3);height=1+bytes.readUIntLE(27,3);}
   else if(kind==='VP8L'){const bits=bytes.readUInt32LE(21);width=1+(bits&0x3fff);height=1+((bits>>>14)&0x3fff);}
   else {assert.equal(kind,'VP8 ');width=bytes.readUInt16LE(26)&0x3fff;height=bytes.readUInt16LE(28)&0x3fff;}
   assert.equal(width,candidate.width);assert.equal(height,candidate.height);
   if(entry.lossless) {
    assert.ok(kind==='VP8L'||kind==='VP8X');
    assert.ok(kind==='VP8L' ? (bytes.readUInt32LE(21)&0x10000000)!==0 : (bytes[20]&0x10)!==0, 'transparent logo alpha must survive');
   }
  }
 }
 assert.equal(data['/assets/mel-one-logo.png'].hasAlpha,true);
 assert.equal(data['/assets/mel-one-logo.png'].lossless,true);
});
