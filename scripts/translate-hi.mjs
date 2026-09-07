import { readFileSync, writeFileSync } from 'fs';

const SUPABASE_URL = 'https://brjlbxvgiqgudzctrwat.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyamxieHZnaXFndWR6Y3Ryd2F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMzk3MDQsImV4cCI6MjEwMjkxNTcwNH0.5oBktfcWr1d0ukSUKnoFMYnEn7aqrKwZZxEuhkMJDB8';

async function translateBatch(texts, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ANON_KEY}`,
          apikey: ANON_KEY,
        },
        body: JSON.stringify({ texts, targetLang: 'hi' }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Translation failed: ${res.status} ${body}`);
      }
      const data = await res.json();
      return data.translations ?? [];
    } catch (e) {
      console.log(`  Attempt ${attempt+1} failed: ${e.message}`);
      if (attempt < retries - 1) await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error('All retries exhausted');
}

// Load and parse the TS data files to extract texts
const tipsFile = readFileSync('./src/data/cultivationTips.ts', 'utf-8');
const cropInfoFile = readFileSync('./src/data/cropInfo.ts', 'utf-8');
const diseasesFile = readFileSync('./src/data/diseases.ts', 'utf-8');

// We'll use a dynamic import approach - compile to JS first
// Actually, let's just eval the data by stripping imports and exporting

// Strip imports, interfaces, type annotations, and export keywords
function stripTs(content) {
  return content
    .replace(/^import.*$/gm, '')
    .replace(/^export\s+/gm, '')
    .replace(/^interface[\s\S]*?^\}\s*$/gm, '')
    .replace(/:\s*Partial<Record<[^>]+>>\s*=/g, ' =')
    .replace(/:\s*Record<string,\s*CropInfo>\s*=/g, ' =')
    .replace(/:\s*Disease\[\]\s*=/g, ' =');
}

function extractCultivationTips() {
  const content = stripTs(tipsFile);
  const fn = new Function(content + '\nreturn cultivationTips;');
  return fn();
}

function extractCropInfo() {
  const content = stripTs(cropInfoFile);
  const fn = new Function(content + '\nreturn cropInfo;');
  return fn();
}

function extractDiseases() {
  const content = stripTs(diseasesFile);
  const cleaned = content.split('\n').filter(l => !l.includes('diseaseById') && !l.includes('diseasesByCrop')).join('\n');
  const fn = new Function(cleaned + '\nreturn diseases;');
  return fn();
}

const tips = extractCultivationTips();
const cropInfo = extractCropInfo();
const diseases = extractDiseases();

// Collect all texts in order
const allTexts = [];

// Cultivation tips
const tipKeys = Object.keys(tips);
const tipTexts = [];
for (const key of tipKeys) {
  const cats = ['sowing','spacing','irrigation','fertilization','pestWatch','harvest','storage'];
  for (const cat of cats) {
    for (const t of tips[key][cat]) {
      tipTexts.push(t);
      allTexts.push(t);
    }
  }
}

// Crop info
const cropInfoKeys = Object.keys(cropInfo);
const cropInfoTexts = [];
for (const key of cropInfoKeys) {
  cropInfoTexts.push(cropInfo[key].season);
  cropInfoTexts.push(cropInfo[key].water);
  cropInfoTexts.push(cropInfo[key].soil);
  cropInfoTexts.push(cropInfo[key].tip);
  allTexts.push(cropInfo[key].season, cropInfo[key].water, cropInfo[key].soil, cropInfo[key].tip);
}

// Diseases
const diseaseTexts = [];
for (const d of diseases) {
  diseaseTexts.push(d.name);
  diseaseTexts.push(d.description);
  allTexts.push(d.name, d.description);
  for (const s of d.symptoms) { diseaseTexts.push(s); allTexts.push(s); }
  for (const t of d.treatment) { diseaseTexts.push(t); allTexts.push(t); }
}

console.log(`Total texts to translate: ${allTexts.length}`);

// Translate in chunks of 40
const CHUNK = 10;
const translated = [];
for (let i = 0; i < allTexts.length; i += CHUNK) {
  const chunk = allTexts.slice(i, i + CHUNK);
  console.log(`Translating batch ${Math.floor(i/CHUNK)+1}/${Math.ceil(allTexts.length/CHUNK)} (${chunk.length} texts)...`);
  const result = await translateBatch(chunk);
  translated.push(...result);
}

console.log(`Got ${translated.length} translations`);

// Now rebuild the data structures
let idx = 0;

// Rebuild cultivation tips
const tipsHi = {};
for (const key of tipKeys) {
  const cats = ['sowing','spacing','irrigation','fertilization','pestWatch','harvest','storage'];
  tipsHi[key] = {};
  for (const cat of cats) {
    tipsHi[key][cat] = [];
    for (let j = 0; j < tips[key][cat].length; j++) {
      tipsHi[key][cat].push(translated[idx++] ?? tips[key][cat][j]);
    }
  }
}

// Rebuild crop info
const cropInfoHi = {};
for (const key of cropInfoKeys) {
  cropInfoHi[key] = {
    season: translated[idx++] ?? cropInfo[key].season,
    water: translated[idx++] ?? cropInfo[key].water,
    soil: translated[idx++] ?? cropInfo[key].soil,
    tip: translated[idx++] ?? cropInfo[key].tip,
  };
}

// Rebuild diseases
const diseasesHi = [];
for (const d of diseases) {
  diseasesHi.push({
    id: d.id,
    name: translated[idx++] ?? d.name,
    cropId: d.cropId,
    severity: d.severity,
    description: translated[idx++] ?? d.description,
    symptoms: d.symptoms.map(() => translated[idx++] ?? ''),
    treatment: d.treatment.map(() => translated[idx++] ?? ''),
  });
}

// Write output
writeFileSync('./scripts/translated-hi.json', JSON.stringify({ tips: tipsHi, cropInfo: cropInfoHi, diseases: diseasesHi }, null, 2));
console.log('Done! Written to scripts/translated-hi.json');
