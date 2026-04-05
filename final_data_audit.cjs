const fs = require('fs');
const path = require('path');

const dbPath = path.join('src', 'data', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const report = {
  duplicates: [],
  orphans: [],
  emptyFields: [],
  biasKeywords: [],
  chronologyErrors: []
};

// 1. DUPLICATE CHECK
const checkDupes = (arr, name) => {
  const ids = new Set();
  arr.forEach(item => {
    if (ids.has(item.id)) report.duplicates.push(`${name}: ${item.id}`);
    ids.add(item.id);
  });
};
checkDupes(db.events, 'Event');
checkDupes(db.entities, 'Entity');
checkDupes(db.sources, 'Source');

// 2. ORPHAN CHECK
const allIds = new Set([
  ...db.events.map(e => e.id),
  ...db.entities.map(e => e.id),
  ...db.sources.map(s => s.id),
  ...(db.hearings?.map(h => h.id) || []),
  ...(db.claims?.map(c => c.id) || [])
]);

const checkOrphans = (item, fields) => {
  fields.forEach(f => {
    if (item[f] && Array.isArray(item[f])) {
      item[f].forEach(refId => {
        if (!allIds.has(refId)) report.orphans.push(`${item.id} -> ${f}: ${refId}`);
      });
    }
  });
};
db.events.forEach(e => checkOrphans(e, ['related_entities', 'source_refs', 'related_hearings']));
db.sources.forEach(s => checkOrphans(s, ['related_entities', 'related_events']));

// 3. BIAS CHECK (Non-Neutral Terms)
const biasTerms = ['疏失', '錯誤', '漏洞', '失敗', '隱患', '失能', 'failure', 'loophole', 'fault'];
const checkBias = (item, textFields) => {
  textFields.forEach(f => {
    if (item[f]) {
      biasTerms.forEach(term => {
        if (item[f].includes(term)) {
          report.biasKeywords.push(`${item.id} [${f}]: "${term}"`);
        }
      });
    }
  });
};
db.events.forEach(e => checkBias(e, ['title', 'description']));
db.claims.forEach(c => checkBias(c, ['statement']));

// 4. CHRONOLOGY CHECK
for (let i = 1; i < db.events.length; i++) {
  if (db.events[i].date < db.events[i-1].date) {
    report.chronologyErrors.push(`Event order: ${db.events[i-1].id} (${db.events[i-1].date}) > ${db.events[i].id} (${db.events[i].date})`);
  }
}

// 5. EMPTY FIELDS
db.events.forEach(e => {
  if (!e.title || !e.date || !e.phase) report.emptyFields.push(`Event ${e.id} missing core fields`);
});

console.log('--- DATA AUDIT REPORT ---');
console.log('Duplicates:', report.duplicates.length);
console.log('Orphans (Broken Links):', report.orphans.length);
console.log('Bias Keywords:', report.biasKeywords.length);
console.log('Chronology Errors:', report.chronologyErrors.length);
console.log('Empty Fields:', report.emptyFields.length);

if (report.orphans.length > 0) console.log('\nOrphan Details (Sample):', report.orphans.slice(0, 10));
if (report.biasKeywords.length > 0) console.log('\nBias Details (Sample):', report.biasKeywords.slice(0, 10));
if (report.chronologyErrors.length > 0) console.log('\nChronology Details:', report.chronologyErrors);
