// NotoSansKR 폰트 서브셋 생성 스크립트
// fontkit (이미 @react-pdf/renderer 의존성으로 설치됨)을 사용
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const fontkit = require('../node_modules/fontkit/dist/main.cjs');
import fs from 'node:fs';
import path from 'node:path';

const FONTS_DIR = path.join(process.cwd(), 'public/fonts');

function buildCodePoints() {
  const codePoints = new Set();
  for (let i = 0x0020; i <= 0x007E; i++) codePoints.add(i); // ASCII
  for (let i = 0xAC00; i <= 0xD7A3; i++) codePoints.add(i); // 한글 완성형 전체
  for (let i = 0x3130; i <= 0x318F; i++) codePoints.add(i); // 한글 자모
  for (let i = 0xFFE0; i <= 0xFFE6; i++) codePoints.add(i); // 원화기호 등
  [0x2019, 0x201C, 0x201D, 0x2026, 0x00B7, 0x00D7, 0x2022].forEach(cp => codePoints.add(cp));
  return Array.from(codePoints);
}

async function subsetFont(inputFile, outputFile) {
  console.log(`\n처리 중: ${path.basename(inputFile)}`);
  const inputSize = fs.statSync(inputFile).size;
  console.log(`  원본 크기: ${(inputSize / 1024).toFixed(0)} KB`);

  const font = fontkit.openSync(inputFile);
  const codePoints = buildCodePoints();
  console.log(`  포함 코드포인트: ${codePoints.length}개`);

  const subset = font.createSubset();
  for (const cp of codePoints) {
    const glyph = font.glyphForCodePoint(cp);
    if (glyph && glyph.id !== 0) {
      subset.includeGlyph(glyph);
    }
  }

  const buffer = subset.encode();
  fs.writeFileSync(outputFile, buffer);

  const outputSize = fs.statSync(outputFile).size;
  const reduction = (((inputSize - outputSize) / inputSize) * 100).toFixed(1);
  console.log(`  서브셋 크기: ${(outputSize / 1024).toFixed(0)} KB`);
  console.log(`  절감: ${reduction}% 감소`);
}

const pairs = [
  ['NotoSansKR-Regular.ttf', 'NotoSansKR-Regular-subset.ttf'],
  ['NotoSansKR-Bold.ttf', 'NotoSansKR-Bold-subset.ttf'],
];

for (const [input, output] of pairs) {
  await subsetFont(
    path.join(FONTS_DIR, input),
    path.join(FONTS_DIR, output)
  );
}

console.log('\n서브셋 생성 완료!');
