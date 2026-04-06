import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, BookOpen } from 'lucide-react';
import database from '../data/database.json';
import DetailSheet from '../components/DetailSheet';

/**
 * ChronicleView — Module 10: 大世記 / Full Chronological Archive
 *
 * All 107 events sorted by date, with auto-tagged entity name chips.
 * Clicking an entity chip filters the timeline to that entity's events.
 * Phase filter bar across the top narrows by stage.
 */

const PHASE_META = {
  'prehistory-family':             { label: '前史與家庭', color: '#6B7280', bg: '#F3F4F6', num: '01' },
  'referral-adoption-placement':   { label: '收出養安置', color: '#4B5563', bg: '#F9FAFB', num: '02' },
  'care-period-signs':             { label: '照顧期異常', color: '#D97706', bg: '#FFFBEB', num: '03' },
  'injury-death-event':            { label: '傷勢死亡',   color: '#DC2626', bg: '#FEF2F2', num: '04' },
  'criminal-investigation-nanny':  { label: '保母案偵審', color: '#7C3AED', bg: '#F5F3FF', num: '05' },
  'social-worker-trial':           { label: '社工案審理', color: '#2563EB', bg: '#EFF6FF', num: '06' },
  'monitoring-admin-responsibility':{ label: '監察行政',  color: '#0D9488', bg: '#F0FDFA', num: '07' },
  'reform-public-response':        { label: '修法輿論',   color: '#2F3A35', bg: '#F5F6F0', num: '08' },
};

const DEFAULT_PHASE = { label: '其他', color: '#94A3B8', bg: '#F8FAFC', num: '—' };

export default function ChronicleView() {
  const [selectedItem, setSelectedItem]   = useState(null);
  const [filterPhase, setFilterPhase]     = useState('all');
  const [filterEntity, setFilterEntity]   = useState(null);
  const [searchText, setSearchText]       = useState('');

  // ── Entity name → entity lookup (aliases included, longest first for greedy match) ──
  const { entityMap, entityNames } = useMemo(() => {
    const map = {};
    (database.entities || []).forEach(ent => {
      if (ent.name) map[ent.name] = ent;
      (ent.alias || []).forEach(a => { if (a && a.length > 1) map[a] = ent; });
    });
    const names = Object.keys(map).sort((a, b) => b.length - a.length);
    return { entityMap: map, entityNames: names };
  }, []);

  // ── Segment text into plain strings + entity chips ──
  const tagText = (text) => {
    if (!text) return null;
    const clean = text.replace(/\*\*/g, '').trim();
    if (!clean) return null;
    const segments = [];
    let remaining = clean;
    while (remaining.length > 0) {
      let matched = false;
      for (const name of entityNames) {
        if (remaining.startsWith(name)) {
          segments.push({ type: 'entity', text: name, entity: entityMap[name] });
          remaining = remaining.slice(name.length);
          matched = true;
          break;
        }
      }
      if (!matched) {
        const last = segments[segments.length - 1];
        if (last && last.type === 'text') {
          last.text += remaining[0];
        } else {
          segments.push({ type: 'text', text: remaining[0] });
        }
        remaining = remaining.slice(1);
      }
    }
    return segments;
  };

  // ── Render segmented text ──
  const renderSegments = (segments, meta, size = 'normal') => {
    if (!segments) return null;
    return segments.map((seg, i) => {
      if (seg.type === 'entity') {
        return (
          <button
            key={i}
            onClick={e => { e.stopPropagation(); setFilterEntity(seg.entity); }}
            title={seg.entity.role_in_case || seg.entity.description_short || ''}
            className="inline-flex items-center px-1.5 py-0.5 rounded-md font-bold mx-0.5 transition-colors hover:opacity-80 leading-snug"
            style={{
              background: meta.bg,
              color: meta.color,
              fontSize: size === 'small' ? '12px' : '14px',
            }}
          >
            {seg.text}
          </button>
        );
      }
      return <span key={i}>{seg.text}</span>;
    });
  };

  // ── Events: sorted by date ──
  const allEvents = useMemo(() =>
    [...(database.events || [])].sort((a, b) =>
      (a.date || '').localeCompare(b.date || '')
    ), []);

  // ── Filtered events ──
  const filteredEvents = useMemo(() => {
    const q = searchText.toLowerCase();
    return allEvents.filter(evt => {
      if (filterPhase !== 'all' && evt.phase !== filterPhase) return false;
      if (filterEntity) {
        const inRelated = (evt.related_entities || []).includes(filterEntity.id);
        const inTitle   = (evt.title || '').includes(filterEntity.name);
        const inSig     = (evt.significance || '').includes(filterEntity.name);
        if (!inRelated && !inTitle && !inSig) return false;
      }
      if (q) {
        const combined = ((evt.title || '') + (evt.significance || '')).toLowerCase();
        if (!combined.includes(q)) return false;
      }
      return true;
    });
  }, [allEvents, filterPhase, filterEntity, searchText]);

  const getPhaseMeta = (phase) => PHASE_META[phase] || DEFAULT_PHASE;

  return (
    <div className="flex-1 bg-[#FDFCF8] min-h-screen font-sans">

      {/* ── STICKY HEADER ── */}
      <header className="sticky top-0 z-40 bg-[#FDFCF8]/96 backdrop-blur-md border-b border-black/[0.07] shadow-sm">
        <div className="max-w-5xl mx-auto px-8 md:px-16 py-6 space-y-5">

          {/* Title row */}
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#2F3A35] flex items-center justify-center">
                <BookOpen size={18} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black tracking-[0.8em] text-[#2F3A35]/50 uppercase leading-none mb-1">
                  Module 10 // Chronicle
                </p>
                <h2 className="text-[26px] font-serif font-bold text-[#1A1A1A] leading-none">
                  大世記&nbsp;
                  <span className="text-slate-400 font-sans not-italic text-[16px] font-normal">
                    全案時序記錄
                  </span>
                </h2>
              </div>
            </div>
            <div className="text-right text-[12px] text-slate-500 font-sans leading-relaxed">
              <div className="font-bold text-[#1A1A1A]">{filteredEvents.length} <span className="font-normal text-slate-400">/ {allEvents.length} 筆</span></div>
              <div>2022.01 — 2026.04</div>
            </div>
          </div>

          {/* Search + phase filters */}
          <div className="space-y-3">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                placeholder="搜尋事件標題、關鍵字…"
                className="w-full pl-10 pr-4 py-2.5 text-[14px] bg-white border border-black/[0.10] rounded-xl focus:outline-none focus:border-[#2F3A35]/50 font-sans text-[#1A1A1A] placeholder:text-slate-400"
              />
              {searchText && (
                <button
                  onClick={() => setSearchText('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1A1A1A]"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Phase pills */}
            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={() => setFilterPhase('all')}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors ${
                  filterPhase === 'all'
                    ? 'bg-[#2F3A35] text-white'
                    : 'bg-white border border-black/[0.08] text-slate-600 hover:border-[#2F3A35]/40'
                }`}
              >
                全部階段
              </button>
              {Object.entries(PHASE_META).map(([id, meta]) => (
                <button
                  key={id}
                  onClick={() => setFilterPhase(filterPhase === id ? 'all' : id)}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors"
                  style={{
                    background:   filterPhase === id ? meta.color : meta.bg,
                    color:        filterPhase === id ? 'white'    : meta.color,
                    border:       `1px solid ${meta.color}50`,
                    fontWeight:   600,
                  }}
                >
                  {meta.num} {meta.label}
                </button>
              ))}

              {/* Active entity filter chip */}
              {filterEntity && (
                <button
                  onClick={() => setFilterEntity(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2F3A35] text-white rounded-lg text-[12px] font-bold"
                >
                  <X size={11} />
                  {filterEntity.name}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── TIMELINE ── */}
      <main className="max-w-5xl mx-auto px-8 md:px-16 py-10 relative">
        {/* Vertical rail */}
        <div className="absolute left-[3.75rem] md:left-[4.75rem] top-10 bottom-10 w-px bg-[#2F3A35]/12 pointer-events-none" />

        <div>
          {filteredEvents.length === 0 && (
            <div className="text-center py-32 text-slate-400 font-serif italic text-[18px]">
              沒有符合條件的事件
            </div>
          )}

          {filteredEvents.map((evt, idx) => {
            const meta      = getPhaseMeta(evt.phase);
            const prevEvt   = filteredEvents[idx - 1];
            const showYear  = !prevEvt || evt.date?.slice(0, 4) !== prevEvt.date?.slice(0, 4);
            const showMonth = !showYear && (!prevEvt || evt.date?.slice(0, 7) !== prevEvt.date?.slice(0, 7));
            const titleSegs = tagText(evt.title);
            const sigSegs   = tagText(evt.significance);

            return (
              <div key={evt.id || evt.event_id}>

                {/* Year banner */}
                {showYear && (
                  <div className="flex items-center gap-5 pt-10 pb-4 pl-14">
                    <div
                      className="text-[52px] font-serif font-bold tabular-nums leading-none select-none"
                      style={{ color: `${meta.color}20` }}
                    >
                      {evt.date?.slice(0, 4)}
                    </div>
                    <div className="h-px flex-1 bg-[#2F3A35]/08" />
                  </div>
                )}

                {/* Month marker */}
                {showMonth && (
                  <div className="flex items-center gap-3 py-2 pl-14">
                    <div className="text-[11px] font-black text-slate-400 tracking-widest tabular-nums">
                      {evt.date?.slice(0, 7).replace('-', ' / ')}
                    </div>
                    <div className="h-px w-8 bg-slate-200" />
                  </div>
                )}

                {/* Event row */}
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-5 py-1.5 group"
                >
                  {/* Dot + date */}
                  <div className="w-12 shrink-0 flex flex-col items-center pt-3 gap-1">
                    <div
                      className="w-2.5 h-2.5 rounded-full border-2 border-[#FDFCF8] shadow-sm z-10 relative shrink-0"
                      style={{ backgroundColor: meta.color }}
                    />
                    <div className="text-[10px] font-black tabular-nums text-slate-400 text-center leading-none mt-0.5">
                      {evt.date?.slice(5).replace('-', '.')}
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    onClick={() => setSelectedItem(evt)}
                    className="flex-1 bg-white rounded-2xl px-6 py-4 mb-2 border border-black/[0.07] shadow-sm cursor-pointer hover:shadow-md hover:border-black/[0.14] transition-shadow"
                    style={{ borderLeft: `3px solid ${meta.color}60` }}
                  >
                    {/* Phase badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md leading-none"
                        style={{ background: meta.bg, color: meta.color }}
                      >
                        {meta.num} {meta.label}
                      </span>
                      {evt.status === 'Danger' && (
                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider">⚠ 高風險</span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-[15px] font-bold text-[#1A1A1A] leading-snug mb-1.5 font-sans">
                      {renderSegments(titleSegs, meta) ?? evt.title?.replace(/\*\*/g, '')}
                    </h3>

                    {/* Significance */}
                    {evt.significance && (
                      <p className="text-[13px] text-slate-600 leading-relaxed font-sans">
                        {renderSegments(sigSegs, meta, 'small') ?? evt.significance}
                      </p>
                    )}

                    {/* Related entity chips */}
                    {(evt.related_entities?.length ?? 0) > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-black/[0.05]">
                        {(evt.related_entities || []).map(entId => {
                          const ent = database.entities.find(e => e.id === entId);
                          if (!ent) return null;
                          return (
                            <button
                              key={entId}
                              onClick={e => { e.stopPropagation(); setFilterEntity(ent); }}
                              className="text-[11px] font-bold px-2 py-1 rounded-lg transition-colors"
                              style={{ background: meta.bg, color: meta.color }}
                            >
                              {ent.name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </main>

      <DetailSheet
        isOpen={!!selectedItem}
        setOpen={open => !open && setSelectedItem(null)}
        item={selectedItem}
      />
    </div>
  );
}
