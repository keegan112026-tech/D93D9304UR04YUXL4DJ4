const fs = require('fs');
const path = require('path');

// THE 8 PHASES (ARCH-V3)
const PHASE_MAP = {
  'prehistory-family': 'prehistory-family',
  'referral-adoption-placement': 'referral-adoption-placement',
  'care-period-signs': 'care-period-signs',
  'injury-death-event': 'injury-death-event',
  'criminal-investigation-nanny': 'criminal-investigation-nanny',
  'social-worker-trial': 'social-worker-trial',
  'monitoring-admin-responsibility': 'monitoring-admin-responsibility',
  'reform-public-response': 'reform-public-response'
};

const stage1Path = path.join('__archive__', 'processed_stages', '第一階段完成_text_markdown.md');
const content = fs.readFileSync(stage1Path, 'utf8');

const events = [];

// SIMPLE REGEX TO EXTRACT TABLE ROWS
// | **111.01.06** | 剴剴生母... |
const tableRegex = /\|\s*\*\*(\d{3}\.\d{2}\.\d{2})\*\*\s*\|\s*([^|]+)\s*\|/g;
let match;
let idx = 0;

while ((match = tableRegex.exec(content)) !== null) {
  const rawDate = match[1];
  const title = match[2].trim();
  
  // Convert 111.01.06 to 2022-01-06
  const parts = rawDate.split('.');
  const year = parseInt(parts[0]) + 1911;
  const date = `${year}-${parts[1]}-${parts[2]}`;
  
  // Basic Phase Assignment Logic
  let phase = 'prehistory-family';
  if (year === 2022) phase = 'prehistory-family';
  if (year === 2023 && parseInt(parts[1]) < 9) phase = 'referral-adoption-placement';
  if (year === 2023 && parseInt(parts[1]) >= 9 && parseInt(parts[1]) < 12) phase = 'care-period-signs';
  if (date === '2023-12-24') phase = 'injury-death-event';
  if (year === 2024 && parseInt(parts[1]) < 8) phase = 'criminal-investigation-nanny';
  if (year === 2024 && parseInt(parts[1]) >= 8) phase = 'social-worker-trial';
  if (year === 2025) phase = 'social-worker-trial';
  if (year === 2026) phase = 'monitoring-admin-responsibility';

  events.push({
    event_id: `evt-${date}-${idx++}`,
    date,
    title,
    phase,
    status: 'Confirmed',
    source_refs: ['src-stage1-001']
  });
}

// Update database.json
const dbPath = path.join('src', 'data', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Unique events only
const existingIds = new Set(db.events.map(e => e.event_id));
const newEvents = events.filter(e => !existingIds.has(e.event_id));

db.events = [...db.events, ...newEvents];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`Injected ${newEvents.length} new events into the Case Spine.`);
