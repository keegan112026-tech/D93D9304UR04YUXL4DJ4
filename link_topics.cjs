const fs = require('fs');
const path = require('path');

const dbPath = path.join('src', 'data', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

/**
 * Auto-linking Topics to Events/Claims
 */
db.topics.forEach(topic => {
  const keywords = [topic.title, ...(topic.tags || [])];
  
  // Link to Events
  const relatedEvents = db.events.filter(evt => 
    keywords.some(kw => evt.title.includes(kw) || (evt.description && evt.description.includes(kw)))
  ).map(e => e.id);
  
  topic.related_events = [...new Set([...(topic.related_events || []), ...relatedEvents])];

  // Link to Claims
  const relatedClaims = db.claims.filter(clm => 
    keywords.some(kw => clm.statement.includes(kw))
  ).map(c => e.id);
  
  topic.related_claims = [...new Set([...(topic.related_claims || []), ...relatedClaims])];
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Topic Semantic Linking Complete.');
