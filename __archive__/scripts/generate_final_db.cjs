const fs = require('fs');
const path = require('path');

const contentDir = 'c:/Users/User/OneDrive/Desktop/網站雛型/content';
const outputFile = 'c:/Users/User/OneDrive/Desktop/網站雛型/src/data/database.json';

/**
 * Unified Database Generator (V4 - BOM Aware)
 * Merges all 200+ JSON files into a single SSOT for the React frontend.
 * Strips UTF-8 BOM if present.
 */
function readJsonFile(dir, filename) {
  const p = path.join(dir, filename);
  if (!fs.existsSync(p)) return null;
  let content = fs.readFileSync(p, 'utf8');
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return JSON.parse(content);
}

function generateDB() {
  const db = {
    index: readJsonFile(contentDir, '_index.json'),
    sources: [],
    entities: {
      people: [],
      orgs: []
    },
    events: [],
    hearings: [],
    claims: [],
    topics: []
  };

  // Load Sources
  const srcFiles = fs.readdirSync(path.join(contentDir, 'sources'));
  srcFiles.forEach(f => db.sources.push(readJsonFile(path.join(contentDir, 'sources'), f)));

  // Load People
  const peopleFiles = fs.readdirSync(path.join(contentDir, 'entities/people'));
  peopleFiles.forEach(f => db.entities.people.push(readJsonFile(path.join(contentDir, 'entities/people'), f)));

  // Load Org
  const orgFiles = fs.readdirSync(path.join(contentDir, 'entities/orgs'));
  orgFiles.forEach(f => db.entities.orgs.push(readJsonFile(path.join(contentDir, 'entities/orgs'), f)));

  // Load Events
  const eventFiles = fs.readdirSync(path.join(contentDir, 'events'));
  eventFiles.forEach(f => db.events.push(readJsonFile(path.join(contentDir, 'events'), f)));

  // Load Hearings
  const hearingFiles = fs.readdirSync(path.join(contentDir, 'hearings'));
  hearingFiles.forEach(f => db.hearings.push(readJsonFile(path.join(contentDir, 'hearings'), f)));

  // Load Claims
  const claimFiles = fs.readdirSync(path.join(contentDir, 'claims'));
  claimFiles.forEach(f => db.claims.push(readJsonFile(path.join(contentDir, 'claims'), f)));

  // Load Topics
  const topicFiles = fs.readdirSync(path.join(contentDir, 'topics'));
  topicFiles.forEach(f => db.topics.push(readJsonFile(path.join(contentDir, 'topics'), f)));

  fs.writeFileSync(outputFile, JSON.stringify(db, null, 2), 'utf8');
  console.log(`Unified database (V4) generated at ${outputFile} with ${db.sources.length} sources and deep content.`);
}

generateDB();
