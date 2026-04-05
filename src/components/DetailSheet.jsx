import React from 'react';
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription 
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import database from '../data/database.json';
import { getRelatedNodes, getDisplayName, getSpinePhase, PHASES } from '../lib/context-engine';
import FactStatusBadge from './FactStatusBadge';
import { 
  User, Calendar, FileText, Bookmark, 
  ExternalLink, ShieldCheck, HelpCircle, 
  Tag, MapPin, Building, ArrowRight, Layers,
  Compass
} from 'lucide-react';

/**
 * Daylight DetailSheet
 * A unified rich-content modal for displaying deep archive entries.
 * Handles People, Events, Sources, Hearings, and Topics.
 */
export default function DetailSheet({ isOpen, setOpen, item }) {
  if (!item) return null;

  const renderIcon = () => {
    if (item.entity_type === 'person' || item.type === 'PEOPLE') return <User className="text-[#2F3A35]/40" />;
    if (item.entity_type === 'organization' || item.type === 'ORG') return <Building className="text-[#2F3A35]/40" />;
    if (item.procedure_type || item.hearing_id) return <Scale className="text-[#2F3A35]/40" />;
    if (item.source_type) return <FileText className="text-[#2F3A35]/40" />;
    return <HelpCircle className="text-[#2F3A35]/40" />;
  };

  const currentPhaseId = getSpinePhase(item.id || item.source_id || item.hearing_id, database);
  const currentPhase = PHASES.find(p => p.id === currentPhaseId);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-[400px] sm:w-[600px] bg-[#FDFCF8] border-l border-black/[0.08] shadow-2xl p-0 font-sans">
        <ScrollArea className="h-full">
          <div className="p-32 space-y-32">
            {/* HEADER SECTION */}
            <header className="space-y-16">
              <div className="flex flex-wrap items-center gap-10">
                 <FactStatusBadge status={item.status || (item.source_type === 'Official' ? 'Confirmed' : 'Media Reported')} />
                 <div className="h-6 w-[1px] bg-black/10 mx-2" />
                 <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-[#2F3A35]/40 italic">
                    <Compass size={14} className="opacity-40" />
                    Spine Location: {currentPhase?.title || 'Pre-history'}
                 </div>
              </div>

              <h1 className="text-[36px] md:text-[48px] font-serif font-bold italic leading-[1.05] text-[#1A1A1A] tracking-tighter antialiased pr-20">
                {item.title || item.name || "Archive Narrative"}
              </h1>
              
              <button 
                onClick={() => setOpen(false)}
                className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#2F3A35]/30 hover:text-[#2F3A35] transition-colors italic"
              >
                <ArrowRight className="rotate-180" size={12} />
                Return to Narrative
              </button>
            </header>

            {/* CONTENT BLOCKS */}
            <section className="space-y-40">
              {/* PRIMARY TEXT block */}
              <div className="space-y-16">
                <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.5em] text-[#2F3A35]/60 italic font-sans border-b border-black/[0.05] pb-8">
                   <Bookmark size={14} className="opacity-40" />
                   Institutional Audit / 制度分析紀錄
                </div>
                <div className="text-[22px] md:text-[24px] text-[#1A1A1A]/80 leading-[1.9] font-serif italic whitespace-pre-wrap antialiased tracking-tight pr-12">
                  {item.full_testimony_analysis || item.detailed_definition || item.detailed_context || item.abstract || item.text || "No deep narrative available."}
                </div>
              </div>

              {/* SYSTEMIC CONTEXT (脈絡性介面核心) */}
              <div className="space-y-16">
                 <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.5em] text-[#2F3A35]/60 italic font-sans border-b border-black/[0.05] pb-8">
                    <Layers size={14} className="opacity-40" />
                    Systemic Context / 交叉關聯存檔
                 </div>
                 <div className="flex flex-wrap gap-8">
                    {getRelatedNodes(item.id || item.hearing_id || item.claim_id, database).map((ref) => (
                      <Badge 
                        key={ref.id} 
                        variant="outline" 
                        className="bg-white border-black/[0.04] text-[#2F3A35]/60 hover:bg-[#F5F6F0] hover:text-[#2F3A35] transition-all cursor-pointer px-10 py-3 rounded-xl flex items-center gap-6 group shadow-sm border-dashed"
                      >
                         <span className="text-[9px] font-black opacity-30 group-hover:opacity-100">{ref.type}</span>
                         <span className="text-[14px] font-serif italic font-bold">
                           {getDisplayName(ref.id, database)}
                         </span>
                         <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                      </Badge>
                    ))}
                    {getRelatedNodes(item.id || item.hearing_id || item.claim_id, database).length === 0 && (
                      <span className="text-[12px] font-serif italic text-slate-300">No semantic links found for this trace.</span>
                    )}
                 </div>
              </div>

              {/* ROLE POSITIONING / BOUNDARIES */}
              {item.professional_positioning && (
                <div className="p-24 bg-[#F5F6F0]/50 rounded-[2.5rem] border border-black/[0.03] space-y-12">
                   <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.4em] text-[#2F3A35]/50 italic font-sans">
                      <Quote size={14} />
                      Professional Positioning / 專業定位
                   </div>
                   <p className="text-[19px] font-serif font-bold italic text-[#2F3A35]/80 leading-relaxed antialiased">
                      {item.professional_positioning}
                   </p>
                </div>
              )}

              {/* METADATA Grid */}
              <div className="grid grid-cols-2 gap-16 pt-16 border-t border-black/[0.04]">
                {item.role_in_case && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 italic font-sans">Role定位</span>
                    <p className="text-[14px] font-serif font-bold text-[#1A1A1A] italic">{item.role_in_case}</p>
                  </div>
                )}
                {item.date && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 italic font-sans">Date庭期</span>
                    <p className="text-[14px] font-serif font-bold text-[#1A1A1A] italic tabular-nums">{item.date}</p>
                  </div>
                )}
                {item.url && (
                  <div className="col-span-2 space-y-8 pt-16">
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 italic font-sans">Verification驗證連結</span>
                     <a 
                       href={item.url} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="flex items-center justify-between p-12 bg-white rounded-2xl border border-black/[0.05] shadow-sm hover:border-[#2F3A35]/30 transition-all group"
                     >
                        <span className="text-[13px] font-serif italic text-slate-400 truncate pr-16 group-hover:text-[#2F3A35] transition-colors">{item.url}</span>
                        <ExternalLink size={16} className="text-[#2F3A35]/30 group-hover:text-[#2F3A35] transition-colors" />
                     </a>
                  </div>
                )}
              </div>

              {/* FOOTER - SYSTEM STATUS */}
              <div className="pt-32 opacity-20 flex items-center gap-6">
                 <ShieldCheck size={14} className="text-[#2F3A35]" />
                 <span className="text-[9px] font-black uppercase tracking-[0.5em] text-[#2F3A35]">Archive Integrity Verified / SSA-892</span>
              </div>
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
