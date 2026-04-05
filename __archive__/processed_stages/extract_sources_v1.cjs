const fs = require('fs');
const path = require('path');

const inputPath = 'c:/Users/User/OneDrive/Desktop/網站雛型/剴剴案_第一階段_全部來源連結彙整.md';
const outputDir = 'c:/Users/User/OneDrive/Desktop/網站雛型/content/sources';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const content = fs.readFileSync(inputPath, 'utf8');

// Simple regex to extract rows from the markdown tables
const rowRegex = /^\|\s*(\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/gm;

let match;
const sources = [];

const publisherMap = {
  '司法': 'judicial',
  '臺北地院': 'tpd',
  '高等法院': 'tph',
  '監察院': 'cy',
  '衛福部': 'mohw',
  '社家署': 'sfaa',
  '中央社': 'cna',
  '公視': 'pts',
  '聯合報': 'udn',
  '今周刊': 'businesstoday',
  '鏡週刊': 'mirrormedia',
  '知新聞': 'knews',
  '太報': 'taisounds',
  '關鍵評論網': 'thenewslens',
  'TVBS': 'tvbs',
  '民視': 'ftv',
  'ETtoday': 'ettoday',
  '三立': 'setn',
  'NOWnews': 'nownews',
  'CTWANT': 'ctwant',
  '新頭殼': 'newtalk',
  '自由時報': 'ltn',
  '遠見': 'gvm',
  '新唐人': 'ntdtv',
  '客新聞': 'hakkanews',
  '大紀元': 'epochtimes',
  '網路溫度計': 'dailyview',
  '蘋果新聞網': 'nextapple',
  '報導者': 'twreporter',
  '多多益善': 'rightplus',
  'nnyy': 'nnyy',
  '司法改革基金會': 'jrf',
  '民報': 'peoplenews',
  '陽光': 'sunnyswa',
  'g0v': 'g0v',
  'Change.org': 'change-org',
  '公共政策': 'join',
  '沈後山': 'shen-houshan',
  '維基百科': 'wikipedia',
  'Taiwan News': 'taiwannews',
  'South China': 'scmp',
  'Focus Taiwan': 'focustaiwan',
  'Facebook': 'facebook',
  'Yahoo': 'yahoo'
};

while ((match = rowRegex.exec(content)) !== null) {
  const [_, id, category, title, url] = match;
  
  let publisher = 'unknown';
  let pubShort = 'misc';
  
  for (const [key, val] of Object.entries(publisherMap)) {
    if (title.includes(key) || url.includes(val)) {
      publisher = key;
      pubShort = val;
      break;
    }
  }

  // Refine publisher for news sites if not found
  if (publisher === 'unknown') {
    if (url.includes('cna.com.tw')) { publisher = '中央社'; pubShort = 'cna'; }
    else if (url.includes('udn.com')) { publisher = '聯合新聞網'; pubShort = 'udn'; }
    else if (url.includes('pts.org.tw')) { publisher = '公視新聞網'; pubShort = 'pts'; }
    else if (url.includes('judicial.gov.tw')) { publisher = '司法院/法院'; pubShort = 'judicial'; }
    else if (url.includes('mohw.gov.tw')) { publisher = '衛福部'; pubShort = 'mohw'; }
    else if (url.includes('cy.gov.tw')) { publisher = '監察院'; pubShort = 'cy'; }
  }

  // Type Mapping
  let type = 'media';
  let tier = 2;
  if (pubShort === 'judicial' || pubShort === 'tpd' || pubShort === 'tph' || pubShort === 'mohw' || pubShort === 'sfaa' || pubShort === 'cy') {
    type = 'official';
    tier = 1;
  } else if (title.includes('刑法') || url.includes('law.moj.gov.tw')) {
    type = 'legislation';
    tier = 1;
  } else if (pubShort === 'wikipedia') {
    type = 'commentary';
    tier = 4;
  } else if (pubShort === 'facebook' || pubShort === 'g0v' || pubShort === 'change-org') {
    type = 'statement';
    tier = 4;
  }

  // Date extraction
  let date = null;
  const dateMatch = title.match(/\((\d{4}-\d{2}-\d{2})\)/) || title.match(/\d{4}\.\d{2}\.\d{2}/) || title.match(/\d{3}\.\d{2}\.\d{2}/);
  if (dateMatch) {
    date = dateMatch[0].replace(/\(|\)/g, '').replace(/\./g, '-');
    if (date.length === 8 && date.includes('.')) { 
        // 112.12.24 style
    }
    // Handle 民國 date if needed
    if (date.startsWith('11') && date.length <= 10) {
        const parts = date.split('-');
        if (parts[0].length <= 3) {
            date = `${parseInt(parts[0]) + 1911}-${parts[1]}-${parts[2]}`;
        }
    }
  }

  const sourceId = `src-${pubShort}-${id}`;
  
  const source = {
    source_id: sourceId,
    title: title.trim(),
    source_type: type,
    publisher: publisher,
    publish_date: date,
    url: url.trim(),
    reliability_tier: tier,
    language: "zh-TW",
    citation_text: `${publisher}。${title.trim()}。`,
    archive_status: "active",
    tags: [category.trim()]
  };

  sources.push(source);
  fs.writeFileSync(path.join(outputDir, `${sourceId}.json`), JSON.stringify(source, null, 2));
}

// Generate _index.json
const index = {
  sources: sources.map(s => s.source_id),
  total: sources.length,
  last_updated: "2026-04-05"
};
fs.writeFileSync(path.join(outputDir, '../_index.json'), JSON.stringify(index, null, 2));

console.log(`Successfully generated ${sources.length} source files.`);
