/**
 * SEMANTIC CONTEXT ENGINE
 * Handles cross-referencing between Hearings, Claims, Sources, and Entities.
 */

/**
 * getRelatedNodes: Core logic for semantic mapping
 * Finds everything linked to a specific ID.
 */
export function getRelatedNodes(id, db) {
  if (!id || !db) return [];

  const sources = db.sources?.filter(s => 
    s.related_entities?.includes(id) || 
    s.related_events?.includes(id) ||
    s.related_hearings?.includes(id) ||
    s.id === id
  ) || [];
  
  const events = db.events?.filter(e => 
    e.related_entities?.includes(id) || 
    e.source_refs?.includes(id) ||
    e.related_hearings?.includes(id) ||
    e.id === id
  ) || [];

  const hearings = db.hearings?.filter(h => 
    h.participants?.includes(id) || 
    h.source_refs?.includes(id) ||
    h.events?.includes(id) ||
    h.id === id
  ) || [];

  const claims = db.claims?.filter(c => 
    c.related_entities?.includes(id) || 
    c.related_events?.includes(id) ||
    c.id === id
  ) || [];

  // Combine and de-duplicate (excluding the node itself)
  const results = [
    ...sources.map(s => ({ id: s.id, type: 'SOURCE' })),
    ...events.map(e => ({ id: e.id, type: 'EVENT' })),
    ...hearings.map(h => ({ id: h.id, type: 'HEARING' })),
    ...claims.map(c => ({ id: c.id, type: 'CLAIM' }))
  ].filter(item => item.id !== id);

  // De-duplicate by ID
  return results.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
}

/**
 * getDisplayName: Helper to format IDs into human-readable titles.
 */
export function getDisplayName(id, db) {
  if (!id) return "Unknown Archive Entry";
  
  const entity = (db.entities || []).find(e => e.id === id);
  if (entity) return entity.name;

  const hearing = (db.hearings || []).find(h => h.id === id);
  if (hearing) return `Transcript: ${hearing.date}`;

  const claim = (db.claims || []).find(c => c.id === id);
  if (claim) return `Claim: ${claim.id}`;

  const source = (db.sources || []).find(s => s.id === id);
  if (source) return source.title;

  const evt = (db.events || []).find(e => e.id === id);
  if (evt) return `Event: ${evt.title}`;

  return id;
}

/**
 * PHASE DEFINITIONS (ARCH-V3)
 */
export const PHASES = [
  { id: 'prehistory-family', title: '前史與家庭背景' },
  { id: 'referral-adoption-placement', title: '轉介、收出養與安置決策' },
  { id: 'care-period-signs', title: '保母照顧期間與異常徵兆' },
  { id: 'injury-death-event', title: '傷勢、醫療發現與死亡事件' },
  { id: 'criminal-investigation-nanny', title: '刑事偵辦與保母案審理' },
  { id: 'social-worker-trial', title: '社工案起訴、庭期與法庭攻防' },
  { id: 'monitoring-admin-responsibility', title: '監察調查、行政責任與制度檢討' },
  { id: 'reform-public-response', title: '修法、輿論反應與後續制度效應' }
];

/**
 * getSpinePhase: Finds the narrative phase for a given item.
 */
export function getSpinePhase(id, db) {
  if (!id || !db) return null;

  // 1. Check if it's an event itself
  const evt = db.events?.find(e => e.id === id);
  if (evt && evt.phase) return evt.phase;

  // 2. Check if it's linked to an event
  const linkedEvt = db.events?.find(e => 
    e.related_entities?.includes(id) || 
    e.source_refs?.includes(id) ||
    e.related_claims?.includes(id) ||
    e.related_hearings?.includes(id)
  );
  if (linkedEvt && linkedEvt.phase) return linkedEvt.phase;

  // 3. Defaults based on date if possible
  const item = db.sources?.find(s => s.id === id) || db.hearings?.find(h => h.id === id);
  if (item && item.date) {
    const year = parseInt(item.date.split('-')[0]);
    if (year === 2022) return 'prehistory-family';
    if (year === 2024) return 'social-worker-trial';
  }

  return 'prehistory-family'; // Baseline fallback
}
