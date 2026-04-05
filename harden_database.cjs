const fs = require('fs');
const path = require('path');

const dbPath = path.join('src', 'data', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// 1. FLATTEN ENTITIES
const flatEntities = [];
if (db.entities.people) {
  db.entities.people.forEach(p => {
    flatEntities.push({ ...p, id: p.entity_id || p.id });
  });
}
if (db.entities.orgs) {
  db.entities.orgs.forEach(o => {
    flatEntities.push({ ...o, id: o.entity_id || o.id });
  });
}

// 2. NORMALIZE ID FIELD
db.entities = flatEntities;

// Normalize Hearings IDs
db.hearings = db.hearings.map(h => ({ ...h, id: h.hearing_id || h.id }));

// Normalize Claims IDs
db.claims = db.claims.map(c => ({ ...c, id: c.claim_id || c.id }));

// Normalize Events IDs
db.events = db.events.map(e => ({ ...e, id: e.event_id || e.id }));

// Normalize Sources IDs
db.sources = db.sources.map(s => ({ ...s, id: s.source_id || s.id }));

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Database Hardening Complete: Entities flattened and IDs normalized.');
