const fs = require('fs');
const path = require('path');

const dbPath = path.join('src', 'data', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// 1. NEUTRALIZATION MAPPING (Removing Bias)
const neutralizationMap = {
  '失能': '功能運作現況',
  '疏失': '程序爭執點',
  '漏洞': '體制節點',
  '失敗': '未竟之處',
  '隱患': '待釐清點'
};

const neutralize = (text) => {
  if (!text) return text;
  let newText = text;
  Object.keys(neutralizationMap).forEach(key => {
    newText = newText.split(key).join(neutralizationMap[key]);
  });
  return newText;
};

db.events.forEach(e => {
  e.title = neutralize(e.title);
  e.description = neutralize(e.description);
});

db.claims?.forEach(c => {
  c.statement = neutralize(c.statement);
});

db.topics?.forEach(t => {
  t.title = neutralize(t.title);
  t.definition = neutralize(t.definition);
});

// 2. ORPHAN FIX (src-stage1-001 -> src-businesstoday-064)
db.events.forEach(e => {
  if (e.source_refs) {
    e.source_refs = e.source_refs.map(ref => ref === 'src-stage1-001' ? 'src-businesstoday-064' : ref);
  }
});

// 3. CHRONOLOGY FIX (Sorting)
db.events.sort((a, b) => {
  if (a.date < b.date) return -1;
  if (a.date > b.date) return 1;
  return 0;
});

// 4. ENTITY POLISHING
db.entities.forEach(ent => {
  if (!ent.entity_type) {
    ent.entity_type = ent.id.startsWith('prs-') ? 'person' : 'organization';
  }
});

// 5. REDUNDANT FIELD CLEANUP (Legacy fields)
db.events.forEach(e => {
  delete e.source_id; // Using source_refs now
  delete e.entities;  // Using related_entities now
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Final Data Hardening & Neutralization Complete.');
console.log('Processed:', db.events.length, 'events.');
