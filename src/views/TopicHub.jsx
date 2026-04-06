import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import {
  Search, Tag, Activity, MessageSquare,
  BookOpen, Scale, ChevronDown, ChevronUp, ExternalLink,
} from 'lucide-react';
import database from '../data/database.json';
import DetailSheet from '../components/DetailSheet';
import { resolveRefs, findBacklinks, tagText, PHASES } from '../lib/context-engine';

/**
 * TopicHub — Module 03: Thematic Cross-Reference Hub
 *
 * Topics act as Obsidian-style "index notes": each topic is an intersection
 * of events, hearings, claims, laws, and sources. Clicking any linked item
 * opens its full Evidence Drawer.
 */

const PHASE_COLOR = {
  'prehistory-family':              '#6B7280',
  'referral-adoption-placement':    '#4B5563',
  'care-period-signs':              '#D97706',
  'injury-death-event':             '#DC2626',
  'criminal-investigation-nanny':   '#7C3AED',
  'social-worker-trial':            '#2563EB',
  'monitoring-admin-responsibility':'#0D9488',
  'reform-public-response':         '#2F3A35',
};

function TaggedText({ text, onEntityClick }) {
  const segs = useMemo(() => tagText(text, database), [text]);
  if (!segs || !segs.length) return <span>{text}</span>;
  return (
    <span>
      {segs.map((seg, i) =>
        seg.type === 'entity' ? (
          <button
            key={i}
            onClick={e => { e.stopPropagation(); onEntityClick?.(seg.entity); }}
            className="inline-flex items-center px-1.5 py-0.5 rounded font-semibold mx-0.5
                       bg-[#F0F4F0] text-[#2F3A35] text-[13px] hover:bg-[#2F3A35]
                       hover:text-white transition-colors"
          >
            {seg.text}
          </button>
        ) : <span key={i}>{seg.text}</span>
      )}
    </span>
  );
}

function EventRow({ evt, onClick }) {
  const phase = PHASES.find(p => p.id === evt.phase);
  const color = PHASE_COLOR[evt.phase] || '#2F3A35';
  return (
    <button
      onClick={() => onClick(evt)}
      className="w-full flex gap-3 p-3 bg-white rounded-xl border border-black/[0.06]
                 hover:border-[#2F3A35]/30 text-left transition-colors group"
    >
      <div className="w-1 shrink-0 rounded-full self-stretch" style={{ background: color }} />
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="text-[13px] font-semibold text-[#1A1A1A] leading-snug line-clamp-2
                      group-hover:text-[#2F3A35] transition-colors">
          {evt.title?.replace(/\*\*/g, '')}
        </p>
        <p className="text-[11px] text-slate-400 tabular-nums">
          {evt.date}{phase ? `  ·  ${phase.title}` : ''}
        </p>
      </div>
      <ExternalLink size={12} className="shrink-0 self-center text-slate-200 group-hover:text-[#2F3A35] transition-colors" />
    </button>
  );
}

function ClaimRow({ claim, onClick }) {
  return (
    <button
      onClick={() => onClick(claim)}
      className="w-full flex gap-3 p-3 bg-white rounded-xl border border-black/[0.06]
                 hover:border-rose-200 text-left transition-colors group"
    >
      <div className="w-1 shrink-0 rounded-full self-stretch bg-rose-300" />
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="text-[13px] font-semibold text-[#1A1A1A] leading-snug line-clamp-2
                      group-hover:text-rose-700 transition-colors">
          {claim.statement}
        </p>
        {claim.claim_type && (
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">
            {claim.claim_type}
          </span>
        )}
      </div>
      <ExternalLink size={12} className="shrink-0 self-center text-slate-200 group-hover:text-rose-400 transition-colors" />
    </button>
  );
}

function HearingRow({ h, onClick }) {
  return (
    <button
      onClick={() => onClick(h)}
      className="w-full flex gap-3 p-3 bg-white rounded-xl border border-black/[0.06]
                 hover:border-amber-200 text-left transition-colors group"
    >
      <div className="w-1 shrink-0 rounded-full self-stretch bg-amber-300" />
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="text-[13px] font-semibold text-[#1A1A1A] leading-snug line-clamp-2
                      group-hover:text-amber-700 transition-colors">
          {h.title || h.court_activity || '庭期記錄'}
        </p>
        <p className="text-[11px] text-slate-400 tabular-nums">{h.date}</p>
      </div>
      <ExternalLink size={12} className="shrink-0 self-center text-slate-200 group-hover:text-amber-400 transition-colors" />
    </button>
  );
}

function TopicCard({ topic, onItemClick }) {
  const [expanded, setExpanded] = useState(false);

  // Resolve all related items for this topic
  const related = useMemo(() => {
    const eventIds   = topic.related_events   || [];
    const claimIds   = topic.related_claims   || [];
    const hearingIds = topic.related_hearings || [];
    const lawIds     = topic.related_laws     || [];
    const sourceIds  = topic.related_sources  || [];

    const events   = resolveRefs(eventIds,   database).filter(x => x.phase !== undefined);
    const claims   = resolveRefs(claimIds,   database).filter(x => x.statement);
    const hearings = resolveRefs(hearingIds, database).filter(x => x.date);
    const laws     = resolveRefs(lawIds,     database);
    const sources  = resolveRefs(sourceIds,  database).filter(x => x.publisher || x.source_type);

    // Also do backlink search for richer results
    const bl = findBacklinks(topic, database);
    const allEvents   = [...events,   ...bl.events  .filter(e => !events.find(x => x.id === e.id))];
    const allClaims   = [...claims,   ...bl.claims  .filter(c => !claims.find(x => x.id === c.id))];
    const allHearings = [...hearings, ...bl.hearings.filter(h => !hearings.find(x => x.id === h.id))];

    return {
      events:   allEvents.sort((a, b) => (a.date || '').localeCompare(b.date || '')),
      claims:   allClaims,
      hearings: allHearings,
      laws,
      sources,
    };
  }, [topic]);

  const totalLinks = related.events.length + related.claims.length +
                     related.hearings.length + related.laws.length + related.sources.length;

  return (
    <motion.div
      layout
      className="bg-white border border-black/[0.07] rounded-[2rem] overflow-hidden shadow-sm
                 hover:shadow-md transition-shadow"
    >
      {/* Card header */}
      <div
        className="p-6 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {(topic.tags || topic.topic_group ? [topic.topic_group] : []).filter(Boolean).map(tag => (
                <span key={tag}
                  className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full
                             bg-[#2F3A35]/8 text-[#2F3A35]/60">
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-[20px] font-bold text-[#1A1A1A] leading-snug">
              {topic.title || topic.name}
            </h3>
            {topic.definition && (
              <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-3">
                <TaggedText text={topic.definition} onEntityClick={onItemClick} />
              </p>
            )}
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <div className="text-right">
              <div className="text-[18px] font-bold text-[#2F3A35] tabular-nums">{totalLinks}</div>
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">關聯</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#F5F6F0] flex items-center justify-center">
              {expanded ? <ChevronUp size={14} className="text-slate-500" /> :
                          <ChevronDown size={14} className="text-slate-500" />}
            </div>
          </div>
        </div>

        {/* Summary chips */}
        {!expanded && (
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-black/[0.04]">
            {related.events.length > 0 && (
              <span className="flex items-center gap-1.5 text-[11px] text-[#2F3A35]/60 font-semibold">
                <Activity size={12} />{related.events.length} 事件
              </span>
            )}
            {related.claims.length > 0 && (
              <span className="flex items-center gap-1.5 text-[11px] text-rose-500 font-semibold">
                <MessageSquare size={12} />{related.claims.length} 主張
              </span>
            )}
            {related.hearings.length > 0 && (
              <span className="flex items-center gap-1.5 text-[11px] text-amber-600 font-semibold">
                <BookOpen size={12} />{related.hearings.length} 庭期
              </span>
            )}
            {related.laws.length > 0 && (
              <span className="flex items-center gap-1.5 text-[11px] text-purple-600 font-semibold">
                <Scale size={12} />{related.laws.length} 法規
              </span>
            )}
          </div>
        )}
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-4 border-t border-black/[0.05] pt-4">

              {/* Events */}
              {related.events.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-widest text-[#2F3A35]/50 flex items-center gap-2">
                    <Activity size={12} /> 關聯事件 ({related.events.length})
                  </p>
                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {related.events.map(evt => (
                      <EventRow key={evt.id} evt={evt} onClick={onItemClick} />
                    ))}
                  </div>
                </div>
              )}

              {/* Claims */}
              {related.claims.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-widest text-rose-500/70 flex items-center gap-2">
                    <MessageSquare size={12} /> 關聯主張爭議 ({related.claims.length})
                  </p>
                  <div className="space-y-1.5">
                    {related.claims.map(c => (
                      <ClaimRow key={c.id || c.claim_id} claim={c} onClick={onItemClick} />
                    ))}
                  </div>
                </div>
              )}

              {/* Hearings */}
              {related.hearings.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-widest text-amber-600/70 flex items-center gap-2">
                    <BookOpen size={12} /> 關聯庭期 ({related.hearings.length})
                  </p>
                  <div className="space-y-1.5">
                    {related.hearings.map(h => (
                      <HearingRow key={h.id} h={h} onClick={onItemClick} />
                    ))}
                  </div>
                </div>
              )}

              {/* Laws */}
              {related.laws.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-widest text-purple-600/70 flex items-center gap-2">
                    <Scale size={12} /> 關聯法規 ({related.laws.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {related.laws.map(law => (
                      <button
                        key={law.id}
                        onClick={() => onItemClick(law)}
                        className="text-[12px] font-semibold px-3 py-1.5 bg-purple-50 text-purple-700
                                   rounded-xl border border-purple-100 hover:bg-purple-100 transition-colors"
                      >
                        {law.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TopicHub() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm]     = useState('');

  const topics = useMemo(() => database.topics || [], []);

  const filtered = useMemo(() => {
    if (!searchTerm) return topics;
    const q = searchTerm.toLowerCase();
    return topics.filter(t =>
      (t.title || '').toLowerCase().includes(q) ||
      (t.definition || '').toLowerCase().includes(q) ||
      (t.tags || []).some(tag => tag.toLowerCase().includes(q))
    );
  }, [topics, searchTerm]);

  return (
    <div className="flex-1 bg-[#FDFCF8] min-h-screen font-sans">
      <div className="max-w-4xl mx-auto px-8 md:px-16 py-16 space-y-10">

        {/* Header */}
        <header className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#2F3A35] flex items-center justify-center">
              <Tag size={20} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-[0.8em] text-[#2F3A35]/50 uppercase leading-none mb-1">
                Module 03 // Transversal Topics
              </p>
              <h2 className="text-[28px] font-bold text-[#1A1A1A] leading-none">
                系統專題中心
              </h2>
            </div>
          </div>

          <p className="text-[15px] text-slate-500 leading-relaxed max-w-2xl">
            每個主題是跨事件、庭期、主張、法規的交叉入口。點擊主題卡片可展開所有關聯內容。
            名稱 chip 可直接點擊跳轉至實體資訊。
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="搜尋主題名稱或定義關鍵字…"
              className="w-full pl-10 pr-4 py-2.5 text-[14px] bg-white border border-black/[0.10]
                         rounded-xl focus:outline-none focus:border-[#2F3A35]/40 text-[#1A1A1A]
                         placeholder:text-slate-400"
            />
          </div>
        </header>

        {/* Topic cards */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <p className="text-center py-20 text-slate-400 font-serif italic">
              沒有符合條件的主題
            </p>
          )}
          {filtered.map(topic => (
            <TopicCard
              key={topic.id || topic.topic_id}
              topic={topic}
              onItemClick={setSelectedItem}
            />
          ))}
        </div>

        {/* Footnote */}
        <p className="text-[12px] text-slate-300 text-center font-serif italic pt-4 border-t border-black/[0.04]">
          主題關聯透過 database.json 的 related_events / related_claims / related_hearings 及名稱比對雙重機制建立。
          可透過 AI 匯入工作流程（DAYLIGHT_IMPORT_SPEC.md）補充關聯。
        </p>
      </div>

      <DetailSheet
        isOpen={!!selectedItem}
        setOpen={open => !open && setSelectedItem(null)}
        item={selectedItem}
        onItemClick={setSelectedItem}
      />
    </div>
  );
}
