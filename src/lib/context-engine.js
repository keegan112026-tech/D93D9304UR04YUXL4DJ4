/**
 * DAYLIGHT SEMANTIC CONTEXT ENGINE v2
 * Core knowledge graph traversal for the Daylight Archive.
 *
 * This engine treats database.json as a bidirectional knowledge graph.
 * Every lookup can be followed in both directions (forward + backlink).
 */

// ─────────────────────────────────────────────────────────────────
// PHASE DEFINITIONS (ARCH-V3)
// ─────────────────────────────────────────────────────────────────
export const PHASES = [
  { id: 'prehistory-family',              title: '前史與家庭背景' },
  { id: 'referral-adoption-placement',    title: '轉介、收出養與安置決策' },
  { id: 'care-period-signs',              title: '保母照顧期間與異常徵兆' },
  { id: 'injury-death-event',             title: '傷勢、醫療發現與死亡事件' },
  { id: 'criminal-investigation-nanny',   title: '刑事偵辦與保母案審理' },
  { id: 'social-worker-trial',            title: '社工案起訴、庭期與法庭攻防' },
  { id: 'monitoring-admin-responsibility',title: '監察調查、行政責任與制度檢討' },
  { id: 'reform-public-response',         title: '修法、輿論反應與後續制度效應' },
];

// ─────────────────────────────────────────────────────────────────
// ITEM TYPE DETECTION
// ─────────────────────────────────────────────────────────────────
export function getItemType(item) {
  if (!item) return 'unknown';
  if (item.source_type || item.source_id || item.publisher || item.reliability_tier)
    return 'source';
  if (item.proceedings_type || item.hearing_id ||
      (item.witnesses !== undefined && item.date))
    return 'hearing';
  if (item.claim_id || item.statement || item.point_of_contention)
    return 'claim';
  if (item.phase !== undefined && item.significance !== undefined)
    return 'event';
  if (item.entity_type === 'person')   return 'person';
  if (item.entity_type === 'organization') return 'organization';
  if (item.entity_type === 'law')      return 'law';
  if (item.topic_id || (item.related_claims !== undefined && item.definition))
    return 'topic';
  return 'generic';
}

// ─────────────────────────────────────────────────────────────────
// RESOLVE REFERENCES
// Turns an array of IDs into full objects from any collection.
// ─────────────────────────────────────────────────────────────────
export function resolveRefs(ids, db) {
  if (!ids || !ids.length) return [];
  return ids.map(id => {
    return (
      db.sources?.find(s => s.id === id || s.source_id === id) ||
      db.entities?.find(e => e.id === id) ||
      db.hearings?.find(h => h.id === id) ||
      db.claims?.find(c => c.id === id || c.claim_id === id) ||
      db.events?.find(e => e.id === id) ||
      db.topics?.find(t => t.id === id || t.topic_id === id) ||
      null
    );
  }).filter(Boolean);
}

// ─────────────────────────────────────────────────────────────────
// FIND BACKLINKS  (Obsidian-style bidirectional lookup)
// Given any item, finds everything in the database that references it —
// by ID match OR by name/alias text match in titles and content fields.
// ─────────────────────────────────────────────────────────────────
export function findBacklinks(item, db) {
  if (!item || !db) return { events: [], hearings: [], claims: [], sources: [], topics: [] };

  const id       = item.id || item.entity_id || item.source_id ||
                   item.hearing_id || item.claim_id || item.event_id ||
                   item.topic_id;
  const name     = item.name || item.title || item.statement || '';
  const aliases  = item.alias || [];
  const allNames = [name, ...aliases].filter(n => n && n.length > 1);

  const textHit = (text) =>
    text && allNames.some(n => text.includes(n));

  const byIdOrName = (arr, ...textFields) =>
    (arr || []).filter(obj => {
      const objId = obj.id || obj.source_id || obj.hearing_id ||
                    obj.claim_id || obj.event_id;
      if (objId === id) return false; // skip self

      // ID-based checks across all relational arrays
      const idArrays = [
        obj.related_entities, obj.source_refs, obj.related_events,
        obj.related_hearings, obj.related_claims, obj.related_sources,
        obj.pro_arguments, obj.con_arguments, obj.participants,
        obj.related_laws, obj.related_topics,
      ];
      if (idArrays.some(arr => Array.isArray(arr) && arr.includes(id))) return true;

      // Witness lookup for hearings
      if (obj.witnesses && Array.isArray(obj.witnesses)) {
        if (obj.witnesses.some(w => w.entity_id === id)) return true;
        if (allNames.some(n => obj.witnesses.some(w =>
          w.testimony_summary?.includes(n)))) return true;
      }

      // Text-based checks
      return textFields.some(field => textHit(obj[field]));
    });

  return {
    events:   byIdOrName(db.events,   'title', 'significance', 'description'),
    hearings: byIdOrName(db.hearings, 'title', 'court_activity'),
    claims:   byIdOrName(db.claims,   'statement', 'point_of_contention'),
    sources:  byIdOrName(db.sources,  'title', 'citation_text'),
    topics:   byIdOrName(db.topics,   'title', 'definition'),
  };
}

// ─────────────────────────────────────────────────────────────────
// TEXT TAGGER  (Obsidian [[link]] equivalent)
// Scans a string and wraps entity names/aliases in tagged segments.
// Returns an array: [{ type:'text'|'entity', text, entity? }]
// ─────────────────────────────────────────────────────────────────
export function tagText(text, db) {
  if (!text || !db) return [{ type: 'text', text: text || '' }];
  const clean = text.replace(/\*\*/g, '').trim();
  if (!clean) return [];

  // Build name→entity map, longest names first (greedy match)
  const map = {};
  (db.entities || []).forEach(ent => {
    if (ent.name && ent.name.length > 1) map[ent.name] = ent;
    (ent.alias || []).forEach(a => { if (a && a.length > 1) map[a] = ent; });
  });
  const names = Object.keys(map).sort((a, b) => b.length - a.length);

  const segs = [];
  let rem = clean;
  while (rem.length > 0) {
    let matched = false;
    for (const n of names) {
      if (rem.startsWith(n)) {
        segs.push({ type: 'entity', text: n, entity: map[n] });
        rem = rem.slice(n.length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      const last = segs[segs.length - 1];
      if (last && last.type === 'text') last.text += rem[0];
      else segs.push({ type: 'text', text: rem[0] });
      rem = rem.slice(1);
    }
  }
  return segs;
}

// ─────────────────────────────────────────────────────────────────
// DISPLAY NAME helper
// ─────────────────────────────────────────────────────────────────
export function getDisplayName(id, db) {
  if (!id) return '—';
  const entity  = (db.entities  || []).find(e => e.id === id);
  if (entity)  return entity.name;
  const hearing = (db.hearings  || []).find(h => h.id === id);
  if (hearing) return hearing.title || `庭期 ${hearing.date}`;
  const claim   = (db.claims    || []).find(c => c.id === id || c.claim_id === id);
  if (claim)   return claim.statement?.slice(0, 30) + '…';
  const source  = (db.sources   || []).find(s => s.id === id || s.source_id === id);
  if (source)  return source.title;
  const evt     = (db.events    || []).find(e => e.id === id);
  if (evt)     return evt.title?.replace(/\*\*/g, '').slice(0, 40) + '…';
  const topic   = (db.topics    || []).find(t => t.id === id || t.topic_id === id);
  if (topic)   return topic.title || topic.name;
  return id;
}

// ─────────────────────────────────────────────────────────────────
// SPINE PHASE lookup (unchanged logic, kept for compatibility)
// ─────────────────────────────────────────────────────────────────
export function getSpinePhase(id, db) {
  if (!id || !db) return null;
  const evt = db.events?.find(e => e.id === id);
  if (evt?.phase) return evt.phase;
  const linked = db.events?.find(e =>
    e.related_entities?.includes(id) ||
    e.source_refs?.includes(id) ||
    e.related_claims?.includes(id) ||
    e.related_hearings?.includes(id)
  );
  if (linked?.phase) return linked.phase;
  const item = db.sources?.find(s => s.id === id) || db.hearings?.find(h => h.id === id);
  if (item?.date) {
    const y = parseInt(item.date.split('-')[0]);
    if (y === 2022) return 'prehistory-family';
    if (y >= 2025) return 'social-worker-trial';
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────
// RELIABILITY TIER LABEL
// ─────────────────────────────────────────────────────────────────
export function getTierLabel(tier) {
  const labels = {
    1: { label: 'Tier 1 — 司法／官方文件', color: '#0F5132', bg: '#D1FAE5' },
    2: { label: 'Tier 2 — 主流媒體報導',   color: '#1E3A5F', bg: '#DBEAFE' },
    3: { label: 'Tier 3 — 專業評論／聲明',  color: '#4A1942', bg: '#F3E8FF' },
    4: { label: 'Tier 4 — 網路二手資料',    color: '#7C2D12', bg: '#FEE2E2' },
  };
  return labels[tier] || { label: `Tier ${tier}`, color: '#64748B', bg: '#F1F5F9' };
}

// ─────────────────────────────────────────────────────────────────
// Legacy: getRelatedNodes (kept for backward compatibility)
// ─────────────────────────────────────────────────────────────────
export function getRelatedNodes(id, db) {
  if (!id || !db) return [];
  const item = resolveRefs([id], db)[0];
  if (!item) return [];
  const bl = findBacklinks(item, db);
  return [
    ...bl.events.map(e => ({ id: e.id, type: 'EVENT' })),
    ...bl.hearings.map(h => ({ id: h.id, type: 'HEARING' })),
    ...bl.claims.map(c => ({ id: c.id, type: 'CLAIM' })),
    ...bl.sources.map(s => ({ id: s.id, type: 'SOURCE' })),
  ].filter(x => x.id !== id);
}
