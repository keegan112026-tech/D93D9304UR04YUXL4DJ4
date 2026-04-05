const fs = require('fs');
const path = require('path');

const dbPath = path.join('src', 'data', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

/**
 * Harmonize ID field to strictly "id" across all modules.
 */
const harmonize = (arr, oldKey) => {
  if (!arr) return;
  arr.forEach(item => {
    if (item[oldKey] && !item.id) {
      item.id = item[oldKey];
    }
  });
};

harmonize(db.events, 'event_id');
harmonize(db.entities, 'entity_id');
harmonize(db.sources, 'source_id');
harmonize(db.hearings, 'hearing_id');
harmonize(db.claims, 'claim_id');
harmonize(db.topics, 'topic_id');

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('ID Harmonization Complete. All objects now use the unified "id" property.');
