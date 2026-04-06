import React, { useState, useMemo } from 'react';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import database from '../data/database.json';
import {
  getItemType, findBacklinks, resolveRefs,
  tagText, getDisplayName, getTierLabel, PHASES,
} from '../lib/context-engine';
import FactStatusBadge from './FactStatusBadge';
import {
  ExternalLink, Globe, ArrowLeft, BookOpen,
  FileText, Users, Landmark, Scale, Activity,
  MessageSquare, Tag, Link2, ChevronDown, ChevronUp,
  ShieldCheck, AlertTriangle,
} from 'lucide-react';

// ─── colour palette for phase labels ───────────────────────────
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

// ─── TaggedText: renders entity-linked chips inline ────────────
function TaggedText({ text, onEntityClick, className = '' }) {
  const segs = useMemo(() => tagText(text, database), [text]);
  if (!segs || segs.length === 0) return null;
  return (
    <span className={className}>
      {segs.map((seg, i) =>
        seg.type === 'entity' ? (
          <button
            key={i}
            onClick={e => { e.stopPropagation(); onEntityClick?.(seg.entity); }}
            className="inline-flex items-center px-1.5 py-0.5 rounded-md font-semibold mx-0.5
                       bg-[#F0F4F0] text-[#2F3A35] text-[13px] hover:bg-[#2F3A35] hover:text-white
                       transition-colors leading-snug"
            title={seg.entity.role_in_case || seg.entity.description_short || ''}
          >
            {seg.text}
          </button>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </span>
  );
}

// ─── Collapsible section ────────────────────────────────────────
function Section({ icon, title, count, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  if (count === 0) return null;
  return (
    <div className="border border-black/[0.06] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5
                   bg-[#F5F6F0] hover:bg-[#ECEEE8] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-[#2F3A35]/50">{icon}</span>
          <span className="text-[12px] font-black uppercase tracking-widest text-[#2F3A35]/80">
            {title}
          </span>
          <span className="text-[11px] font-bold text-slate-400 bg-white/60 px-2 py-0.5 rounded-full">
            {count}
          </span>
        </div>
        {open ? <ChevronUp size={14} className="text-slate-400" /> :
                <ChevronDown size={14} className="text-slate-400" />}
      </button>
      {open && <div className="px-5 py-4 space-y-2.5">{children}</div>}
    </div>
  );
}

// ─── Source card ────────────────────────────────────────────────
function SourceCard({ source, onClick }) {
  const tier = getTierLabel(source.reliability_tier);
  return (
    <div
      onClick={() => onClick?.(source)}
      className="flex gap-3 p-3 bg-white rounded-xl border border-black/[0.06]
                 hover:border-[#2F3A35]/30 cursor-pointer transition-colors group"
    >
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-[13px] font-semibold text-[#1A1A1A] leading-snug line-clamp-2
                      group-hover:text-[#2F3A35] transition-colors">
          {source.title}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[10px] font-black px-2 py-0.5 rounded-full"
            style={{ background: tier.bg, color: tier.color }}
          >
            {tier.label}
          </span>
          {source.publisher && (
            <span className="text-[11px] text-slate-400">{source.publisher}</span>
          )}
        </div>
      </div>
      {source.url && (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="shrink-0 self-center p-2 rounded-lg text-slate-300
                     hover:text-[#2F3A35] hover:bg-[#F5F6F0] transition-colors"
          title="開啟原始來源"
        >
          <ExternalLink size={14} />
        </a>
      )}
    </div>
  );
}

// ─── Compact clickable row ──────────────────────────────────────
function ItemRow({ icon, label, sub, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-black/[0.06]
                 hover:border-[#2F3A35]/30 text-left transition-colors group"
    >
      <div
        className="w-6 h-6 rounded-lg shrink-0 flex items-center justify-center"
        style={{ background: `${color}20`, color }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[#1A1A1A] leading-snug line-clamp-2
                      group-hover:text-[#2F3A35] transition-colors">
          {label?.replace(/\*\*/g, '')}
        </p>
        {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
      </div>
      <ExternalLink size={11} className="shrink-0 text-slate-300 group-hover:text-[#2F3A35] transition-colors" />
    </button>
  );
}

// ─── Main component ─────────────────────────────────────────────
export default function DetailSheet({ isOpen, setOpen, item, onItemClick }) {
  const navigate = (newItem) => { if (newItem && onItemClick) onItemClick(newItem); };

  const data = useMemo(() => {
    if (!item) return null;
    const type      = getItemType(item);
    const backlinks = findBacklinks(item, database);
    const sourceRefs = resolveRefs(
      item.source_refs || item.sources || [], database
    ).filter(s => s.source_type || s.publisher);

    return { type, backlinks, sourceRefs };
  }, [item]);

  if (!item || !data) return null;

  const { type, backlinks, sourceRefs } = data;

  // ── Title + subtitle ─────────────────────────────────────────
  const displayTitle = (
    item.name || item.title || item.statement ||
    (item.date ? `庭期記錄 ${item.date}` : null) ||
    '存檔條目'
  )?.replace(/\*\*/g, '');

  const phaseId = item.phase;
  const phase   = PHASES.find(p => p.id === phaseId);
  const phaseColor = PHASE_COLOR[phaseId] || '#2F3A35';

  // ── Type badge config ────────────────────────────────────────
  const TYPE_CONFIG = {
    source:       { label: '文獻來源',   color: '#1E3A5F', bg: '#DBEAFE', icon: <FileText size={12} /> },
    person:       { label: '人物實體',   color: '#065F46', bg: '#D1FAE5', icon: <Users size={12} /> },
    organization: { label: '機構實體',   color: '#1E3A5F', bg: '#DBEAFE', icon: <Landmark size={12} /> },
    law:          { label: '法規制度',   color: '#4A1942', bg: '#F3E8FF', icon: <Scale size={12} /> },
    hearing:      { label: '庭期記錄',   color: '#92400E', bg: '#FEF3C7', icon: <BookOpen size={12} /> },
    claim:        { label: '主張爭議',   color: '#7C2D12', bg: '#FEE2E2', icon: <MessageSquare size={12} /> },
    event:        { label: '事件記錄',   color: '#2F3A35', bg: '#F5F6F0', icon: <Activity size={12} /> },
    topic:        { label: '主題專題',   color: '#4A1942', bg: '#F3E8FF', icon: <Tag size={12} /> },
    generic:      { label: '存檔記錄',   color: '#64748B', bg: '#F1F5F9', icon: <FileText size={12} /> },
  };
  const tc = TYPE_CONFIG[type] || TYPE_CONFIG.generic;

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-[420px] sm:w-[540px] bg-[#FDFCF8] border-l border-black/[0.08] p-0 font-sans overflow-hidden flex flex-col">

        {/* ── Fixed header ──────────────────────────────────────*/}
        <div className="shrink-0 px-6 pt-6 pb-4 border-b border-black/[0.06] bg-[#FDFCF8] space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest
                         text-slate-400 hover:text-[#2F3A35] transition-colors"
            >
              <ArrowLeft size={13} /> 關閉
            </button>
            {item.status && <FactStatusBadge status={item.status} />}
          </div>

          {/* Type + phase chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-black px-2.5 py-1 rounded-full"
              style={{ background: tc.bg, color: tc.color }}
            >
              {tc.icon}{tc.label}
            </span>
            {phase && (
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                style={{ background: `${phaseColor}18`, color: phaseColor }}
              >
                {phase.title}
              </span>
            )}
            {item.reliability_tier && (
              <span
                className="text-[11px] font-black px-2.5 py-1 rounded-full"
                style={{ ...getTierLabel(item.reliability_tier) }}
              >
                {getTierLabel(item.reliability_tier).label}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-[20px] font-bold text-[#1A1A1A] leading-snug">
            {displayTitle}
          </h2>

          {/* Quick meta row */}
          <div className="flex items-center gap-4 text-[11px] text-slate-400 flex-wrap">
            {item.date && <span className="tabular-nums font-semibold text-[#1A1A1A]">{item.date}</span>}
            {item.case_number && <span>{item.case_number}</span>}
            {item.publisher && <span>{item.publisher}</span>}
            {item.role_in_case && <span className="text-[#2F3A35]/70">{item.role_in_case}</span>}
          </div>
        </div>

        {/* ── Scrollable body ───────────────────────────────────*/}
        <ScrollArea className="flex-1">
          <div className="px-6 py-5 space-y-4">

            {/* ── Primary content (with entity tagging) ──────── */}
            {(item.significance || item.description || item.definition ||
              item.court_activity || item.point_of_contention ||
              item.description_short || item.official_mandate) && (
              <div className="p-4 bg-white rounded-2xl border border-black/[0.06] space-y-2">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  {type === 'source' ? '摘要' :
                   type === 'hearing' ? '庭審活動' :
                   type === 'claim'   ? '爭點內容' :
                   type === 'topic'   ? '主題定義' : '事件摘要'}
                </p>
                <p className="text-[14px] text-[#1A1A1A] leading-relaxed">
                  <TaggedText
                    text={
                      item.significance || item.description || item.definition ||
                      item.court_activity || item.point_of_contention ||
                      item.description_short || item.official_mandate
                    }
                    onEntityClick={navigate}
                  />
                </p>
              </div>
            )}

            {/* ── Entity: professional positioning ───────────── */}
            {item.professional_positioning && (
              <div className="p-4 bg-[#F5F6F0] rounded-2xl border border-black/[0.04] space-y-2">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">專業定位與責任邊界</p>
                <p className="text-[13px] text-slate-700 leading-relaxed">{item.professional_positioning}</p>
              </div>
            )}

            {/* ── Claim: pro / con ────────────────────────────── */}
            {(item.pro_arguments?.length > 0 || item.con_arguments?.length > 0) && (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">支持方</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(item.pro_arguments || []).map(id => {
                      const ent = database.entities.find(e => e.id === id);
                      return (
                        <button key={id} onClick={() => ent && navigate(ent)}
                          className="text-[12px] font-semibold px-2 py-1 bg-white text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors">
                          {getDisplayName(id, database)}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-rose-700">反對方</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(item.con_arguments || []).map(id => {
                      const ent = database.entities.find(e => e.id === id);
                      return (
                        <button key={id} onClick={() => ent && navigate(ent)}
                          className="text-[12px] font-semibold px-2 py-1 bg-white text-rose-700 rounded-lg hover:bg-rose-100 transition-colors">
                          {getDisplayName(id, database)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── Hearing: witnesses ──────────────────────────── */}
            {item.witnesses?.length > 0 && (
              <Section icon={<Users size={14} />} title="出庭證人" count={item.witnesses.length}>
                {item.witnesses.map((w, i) => {
                  const ent = database.entities.find(e => e.id === w.entity_id);
                  return (
                    <div key={i} className="p-3 bg-white rounded-xl border border-black/[0.06] space-y-1">
                      <button
                        onClick={() => ent && navigate(ent)}
                        className="text-[13px] font-bold text-[#1A1A1A] hover:text-[#2F3A35] transition-colors"
                      >
                        {ent?.name || w.entity_id}
                      </button>
                      {w.testimony_summary && (
                        <p className="text-[12px] text-slate-500 leading-relaxed">
                          <TaggedText text={w.testimony_summary} onEntityClick={navigate} />
                        </p>
                      )}
                    </div>
                  );
                })}
              </Section>
            )}

            {/* ── Hearing: legal arguments ────────────────────── */}
            {item.legal_arguments?.length > 0 && (
              <Section icon={<Scale size={14} />} title="法律論點" count={item.legal_arguments.length}>
                {item.legal_arguments.map((arg, i) => (
                  <p key={i} className="text-[13px] text-slate-600 leading-relaxed pl-3 border-l-2 border-[#2F3A35]/20">
                    {arg}
                  </p>
                ))}
              </Section>
            )}

            {/* ── Source refs (resolved) ───────────────────────── */}
            {sourceRefs.length > 0 && (
              <Section icon={<FileText size={14} />} title="引用來源" count={sourceRefs.length} defaultOpen={type === 'event' || type === 'hearing'}>
                {sourceRefs.map(src => (
                  <SourceCard key={src.id || src.source_id} source={src} onClick={navigate} />
                ))}
              </Section>
            )}

            {/* ── BACKLINKS: Related Events ───────────────────── */}
            {backlinks.events.length > 0 && type !== 'event' && (
              <Section icon={<Activity size={14} />} title="關聯事件" count={backlinks.events.length} defaultOpen={type === 'person' || type === 'organization'}>
                {backlinks.events.slice(0, 12).map(evt => (
                  <ItemRow
                    key={evt.id}
                    icon={<Activity size={11} />}
                    label={evt.title}
                    sub={`${evt.date || ''}  ${evt.phase ? '· ' + (PHASES.find(p => p.id === evt.phase)?.title || '') : ''}`}
                    color={PHASE_COLOR[evt.phase] || '#2F3A35'}
                    onClick={() => navigate(evt)}
                  />
                ))}
              </Section>
            )}

            {/* ── BACKLINKS: Related Hearings ─────────────────── */}
            {backlinks.hearings.length > 0 && type !== 'hearing' && (
              <Section icon={<BookOpen size={14} />} title="關聯庭期" count={backlinks.hearings.length}>
                {backlinks.hearings.slice(0, 8).map(h => (
                  <ItemRow
                    key={h.id}
                    icon={<BookOpen size={11} />}
                    label={h.title || h.court_activity || '庭期記錄'}
                    sub={h.date}
                    color="#92400E"
                    onClick={() => navigate(h)}
                  />
                ))}
              </Section>
            )}

            {/* ── BACKLINKS: Related Claims ───────────────────── */}
            {backlinks.claims.length > 0 && type !== 'claim' && (
              <Section icon={<MessageSquare size={14} />} title="關聯主張爭議" count={backlinks.claims.length}>
                {backlinks.claims.map(c => (
                  <ItemRow
                    key={c.id || c.claim_id}
                    icon={<MessageSquare size={11} />}
                    label={c.statement}
                    sub={c.claim_type}
                    color="#7C2D12"
                    onClick={() => navigate(c)}
                  />
                ))}
              </Section>
            )}

            {/* ── BACKLINKS: Related Topics ───────────────────── */}
            {backlinks.topics.length > 0 && (
              <Section icon={<Tag size={14} />} title="關聯主題專題" count={backlinks.topics.length}>
                {backlinks.topics.map(t => (
                  <ItemRow
                    key={t.id || t.topic_id}
                    icon={<Tag size={11} />}
                    label={t.title || t.name}
                    sub={t.definition?.slice(0, 60) + '…'}
                    color="#4A1942"
                    onClick={() => navigate(t)}
                  />
                ))}
              </Section>
            )}

            {/* ── BACKLINKS: Sources that cite this ───────────── */}
            {backlinks.sources.length > 0 && type !== 'source' && (
              <Section icon={<Link2 size={14} />} title="引用本條目的來源" count={backlinks.sources.length} defaultOpen={false}>
                {backlinks.sources.slice(0, 8).map(src => (
                  <SourceCard key={src.id || src.source_id} source={src} onClick={navigate} />
                ))}
              </Section>
            )}

            {/* ── Source: direct URL ──────────────────────────── */}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white rounded-2xl
                           border border-black/[0.06] hover:border-[#2F3A35]/40 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Globe size={16} className="text-[#2F3A35]/40 shrink-0" />
                  <span className="text-[12px] text-slate-500 truncate group-hover:text-[#2F3A35] transition-colors">
                    {item.url.replace(/^https?:\/\//, '').slice(0, 60)}
                  </span>
                </div>
                <ExternalLink size={14} className="shrink-0 text-slate-300 group-hover:text-[#2F3A35] transition-colors ml-3" />
              </a>
            )}

            {/* ── Citation ────────────────────────────────────── */}
            {item.citation_text && (
              <div className="p-4 bg-[#F5F6F0] rounded-2xl border border-black/[0.04] space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">學術引用格式</p>
                <p className="text-[12px] text-slate-600 leading-relaxed font-serif italic">
                  {item.citation_text}
                </p>
              </div>
            )}

            {/* ── Empty state ──────────────────────────────────── */}
            {sourceRefs.length === 0 &&
             backlinks.events.length === 0 &&
             backlinks.hearings.length === 0 &&
             backlinks.claims.length === 0 &&
             backlinks.topics.length === 0 && (
              <div className="py-8 text-center space-y-2">
                <ShieldCheck size={24} className="text-slate-200 mx-auto" />
                <p className="text-[12px] text-slate-300 font-serif italic">
                  此條目尚無資料庫交叉關聯，可透過 AI 匯入工作流程補充。
                </p>
              </div>
            )}

            <div className="h-8" />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
