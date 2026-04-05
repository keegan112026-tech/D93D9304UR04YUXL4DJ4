import React from 'react';
import {
  Sheet, SheetContent
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import database from '../data/database.json';
import { getRelatedNodes, getDisplayName, getSpinePhase, PHASES } from '../lib/context-engine';
import FactStatusBadge from './FactStatusBadge';
import {
  User, FileText, Bookmark, Scale, Quote, Globe,
  ExternalLink, ShieldCheck, HelpCircle, MessageSquare,
  Building, ArrowRight, Layers, Compass
} from 'lucide-react';

/**
 * Daylight DetailSheet — Unified Rich-Content Modal
 * Handles People, Events, Sources, Hearings, Topics, Claims.
 */
export default function DetailSheet({ isOpen, setOpen, item }) {
  if (!item) return null;

  // Build primary display content based on item type
  const getPrimaryContent = () => {
    if (item.court_activity) return item.court_activity;
    if (item.citation_text) return item.citation_text;
    if (item.significance) return item.significance;
    if (item.description) return item.description;
    if (item.description_short) return item.description_short;
    if (item.point_of_contention) return item.point_of_contention;
    if (item.definition) return item.definition;
    if (item.full_testimony_analysis) return item.full_testimony_analysis;
    if (item.detailed_definition) return item.detailed_definition;
    if (item.detailed_context) return item.detailed_context;
    if (item.abstract) return item.abstract;
    if (item.text) return item.text;
    return null;
  };

  const primaryContent = getPrimaryContent();
  const currentPhaseId = getSpinePhase(item.id || item.source_id || item.hearing_id, database);
  const currentPhase = PHASES.find(p => p.id === currentPhaseId);
  const displayTitle = item.title || item.name || item.statement ||
    (item.date ? `庭期紀錄：${item.date}` : null) || 'Archive Entry';

  const contentLabel = item.proceedings_type || item.procedure_type
    ? '庭審紀錄 / Court Record'
    : item.source_type
    ? '文獻摘要 / Source'
    : item.entity_type
    ? '實體定位 / Entity'
    : item.statement
    ? '主張摘要 / Claim'
    : '案件紀錄 / Record';

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-[400px] sm:w-[600px] bg-[#FDFCF8] border-l border-black/[0.08] shadow-2xl p-0 font-sans">
        <ScrollArea className="h-full">
          <div className="p-8 space-y-8">

            {/* HEADER */}
            <header className="space-y-4 pt-4">
              <div className="flex flex-wrap items-center gap-3">
                <FactStatusBadge status={
                  item.status ||
                  (item.proceedings_type ? 'Court Recognized' : 'Confirmed')
                } />
                <div className="h-4 w-[1px] bg-black/10" />
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#2F3A35]/40 italic">
                  <Compass size={12} className="opacity-40" />
                  {currentPhase?.title || '存檔記錄'}
                </div>
              </div>

              <h1 className="text-[26px] md:text-[34px] font-serif font-bold italic leading-tight text-[#1A1A1A] tracking-tighter antialiased pr-8">
                {displayTitle}
              </h1>

              <button
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#2F3A35]/30 hover:text-[#2F3A35] transition-colors italic"
              >
                <ArrowRight className="rotate-180" size={12} />
                回到主畫面
              </button>
            </header>

            {/* PRIMARY CONTENT */}
            {primaryContent && (
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.5em] text-[#2F3A35]/60 italic font-sans border-b border-black/[0.05] pb-2">
                  <Bookmark size={12} className="opacity-40" />
                  {contentLabel}
                </div>
                <div className="text-[16px] text-[#1A1A1A]/80 leading-[1.9] font-serif italic whitespace-pre-wrap antialiased tracking-tight">
                  {primaryContent}
                </div>
              </section>
            )}

            {/* HEARING: Legal Arguments */}
            {item.legal_arguments && item.legal_arguments.length > 0 && (
              <section className="space-y-3">
                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#2F3A35]/60 italic font-sans border-b border-black/[0.05] pb-2">
                  法律論點 / Legal Arguments
                </div>
                <ul className="space-y-2">
                  {item.legal_arguments.map((arg, i) => (
                    <li key={i} className="text-[14px] font-serif italic text-slate-600 leading-relaxed pl-4 border-l border-[#2F3A35]/20">
                      {arg}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* CLAIM: Pro/Con */}
            {(item.pro_arguments?.length > 0 || item.con_arguments?.length > 0) && (
              <section className="space-y-4">
                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#2F3A35]/60 italic font-sans border-b border-black/[0.05] pb-2">
                  論點攻防 / Arguments
                </div>
                {item.pro_arguments?.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">支持方</span>
                    <div className="flex flex-wrap gap-2">
                      {item.pro_arguments.map(id => (
                        <Badge key={id} className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[12px] font-serif italic px-3 py-1 rounded-lg">
                          {getDisplayName(id, database)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {item.con_arguments?.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest">反對方</span>
                    <div className="flex flex-wrap gap-2">
                      {item.con_arguments.map(id => (
                        <Badge key={id} className="bg-rose-50 text-rose-700 border-rose-100 text-[12px] font-serif italic px-3 py-1 rounded-lg">
                          {getDisplayName(id, database)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* PROFESSIONAL POSITIONING */}
            {item.professional_positioning && (
              <section className="p-5 bg-[#F5F6F0]/50 rounded-[1.5rem] border border-black/[0.03] space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-[#2F3A35]/50 italic font-sans">
                  <Quote size={12} />
                  專業定位
                </div>
                <p className="text-[14px] font-serif font-bold italic text-[#2F3A35]/80 leading-relaxed antialiased line-clamp-6">
                  {item.professional_positioning}
                </p>
              </section>
            )}

            {/* CROSS-REFERENCES */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.5em] text-[#2F3A35]/60 italic font-sans border-b border-black/[0.05] pb-2">
                <Layers size={12} className="opacity-40" />
                交叉關聯 / Cross-References
              </div>
              <div className="flex flex-wrap gap-2">
                {getRelatedNodes(item.id || item.hearing_id || item.claim_id || item.source_id, database).slice(0, 8).map((ref) => (
                  <Badge
                    key={ref.id}
                    variant="outline"
                    className="bg-white border-black/[0.06] text-[#2F3A35]/60 hover:bg-[#F5F6F0] hover:text-[#2F3A35] transition-all cursor-pointer px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm text-[11px]"
                  >
                    <span className="text-[8px] font-black opacity-30">{ref.type}</span>
                    <span className="font-serif italic">{getDisplayName(ref.id, database)}</span>
                  </Badge>
                ))}
                {getRelatedNodes(item.id || item.hearing_id || item.claim_id || item.source_id, database).length === 0 && (
                  <span className="text-[12px] font-serif italic text-slate-300">此筆記錄尚無交叉引用連結。</span>
                )}
              </div>
            </section>

            {/* METADATA */}
            <section className="grid grid-cols-2 gap-4 pt-4 border-t border-black/[0.04]">
              {item.role_in_case && (
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 italic font-sans">案件角色</span>
                  <p className="text-[13px] font-serif font-bold text-[#1A1A1A] italic">{item.role_in_case}</p>
                </div>
              )}
              {item.date && (
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 italic font-sans">日期</span>
                  <p className="text-[13px] font-serif font-bold text-[#1A1A1A] italic tabular-nums">{item.date}</p>
                </div>
              )}
              {item.case_number && (
                <div className="col-span-2 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 italic font-sans">案號</span>
                  <p className="text-[13px] font-serif font-bold text-[#1A1A1A] italic">{item.case_number}</p>
                </div>
              )}
              {item.publisher && (
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 italic font-sans">出版單位</span>
                  <p className="text-[13px] font-serif font-bold text-[#1A1A1A] italic">{item.publisher}</p>
                </div>
              )}
              {item.reliability_tier && (
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 italic font-sans">可信度</span>
                  <p className="text-[13px] font-serif font-bold text-[#1A1A1A] italic">Tier {item.reliability_tier}</p>
                </div>
              )}
              {item.url && (
                <div className="col-span-2 pt-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-white rounded-2xl border border-black/[0.05] shadow-sm hover:border-[#2F3A35]/30 transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-[#2F3A35]/30 shrink-0" />
                      <span className="text-[11px] font-serif italic text-slate-400 truncate group-hover:text-[#2F3A35] transition-colors">
                        {item.url.replace(/^https?:\/\//, '').substring(0, 55)}
                      </span>
                    </div>
                    <ExternalLink size={13} className="text-[#2F3A35]/30 group-hover:text-[#2F3A35] transition-colors shrink-0 ml-2" />
                  </a>
                </div>
              )}
            </section>

            {/* FOOTER */}
            <div className="pt-4 pb-8 opacity-20 flex items-center gap-2">
              <ShieldCheck size={12} className="text-[#2F3A35]" />
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-[#2F3A35]">Archive Integrity Verified</span>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
