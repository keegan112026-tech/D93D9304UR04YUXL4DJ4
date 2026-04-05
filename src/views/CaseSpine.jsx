import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, ArrowRight, Bookmark, 
  MapPin, Clock, ShieldCheck, HelpCircle,
  FileText, Activity, Landmark, Layers,
  ChevronDown, Search
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import database from '../data/database.json';
import DetailSheet from '../components/DetailSheet';
import { getDisplayName } from '../lib/context-engine';
import FactStatusBadge from '../components/FactStatusBadge';

// THE 8 PHASES (ARCH-V3)
const PHASES = [
  { id: 'prehistory-family', title: '前史與家庭背景', color: '#2F3A35' },
  { id: 'referral-adoption-placement', title: '轉介、收出養與安置決策', color: '#2F3A35' },
  { id: 'care-period-signs', title: '保母照顧期間與異常徵兆', color: '#2F3A35' },
  { id: 'injury-death-event', title: '傷勢、醫療發現與死亡事件', color: '#B91C1C' }, // Danger Highlight
  { id: 'criminal-investigation-nanny', title: '刑事偵辦與保母案審理', color: '#2F3A35' },
  { id: 'social-worker-trial', title: '社工案起訴、庭期與法庭攻防', color: '#2F3A35' },
  { id: 'monitoring-admin-responsibility', title: '監察調查、行政責任與制度檢討', color: '#2F3A35' },
  { id: 'reform-public-response', title: '修法、輿論反應與後續制度效應', color: '#1E293B' }
];

export default function CaseSpine() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [activePhase, setActivePhase] = useState(PHASES[0].id);

  const eventsByPhase = useMemo(() => {
    const groups = {};
    PHASES.forEach(p => {
      groups[p.id] = database.events.filter(e => e.phase === p.id || e.tags?.includes(p.id));
    });
    return groups;
  }, []);

  const openDetail = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="flex-1 bg-[#FDFCF8] min-h-screen pb-64 font-sans refined-tactile">
      
      {/* NARRATIVE RAIL: STICKY NAV */}
      <nav className="sticky top-0 z-40 bg-[#FDFCF8]/80 backdrop-blur-md border-b border-black/[0.05] py-10 shadow-sm">
         <div className="max-w-6xl mx-auto px-10 md:px-20 flex items-center justify-between overflow-x-auto no-scrollbar gap-8">
            {PHASES.map((phase, idx) => (
              <button
                key={phase.id}
                onClick={() => {
                  setActivePhase(phase.id);
                  document.getElementById(phase.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`shrink-0 flex flex-col gap-2 transition-all group
                  ${activePhase === phase.id ? 'opacity-100' : 'opacity-30 hover:opacity-100'}
                `}
              >
                 <span className="text-[9px] font-black tabular-nums tracking-widest text-[#2F3A35]/40 italic">0{idx + 1}</span>
                 <span className={`text-[11px] font-bold uppercase tracking-widest whitespace-nowrap
                   ${activePhase === phase.id ? 'text-[#2F3A35]' : 'text-slate-400'}
                 `}>
                   {phase.title}
                 </span>
                 <div className={`h-[1.5px] w-full transition-all duration-500
                   ${activePhase === phase.id ? 'bg-[#2F3A35]' : 'bg-transparent group-hover:bg-slate-200'}
                 `} />
              </button>
            ))}
         </div>
      </nav>

      {/* SPINE HERO */}
      <header className="max-w-6xl mx-auto px-10 md:px-20 py-28 md:py-40">
         <div className="space-y-16">
            <div className="flex items-center gap-6">
               <div className="h-[0.5px] w-12 bg-[#2F3A35]/20" />
               <span className="text-[11px] font-black uppercase tracking-[1em] text-[#2F3A35]/40 italic">Case Spine v3.0 // 案件主軸</span>
            </div>
            <h1 className="text-h1 max-w-4xl tracking-tighter leading-none italic text-[#1A1A1A]">
               剴剴案 <span className="opacity-50 font-sans not-italic text-slate-800">／</span> 全景制度存檔
            </h1>
            <p className="text-[24px] text-slate-500 font-serif font-medium leading-[1.8] max-w-3xl italic antialiased opacity-90">
               這是一份以制度脈絡為核心、多維度佐證的案件主軸。我們將四萬多字的長篇報告拆解為 8 個關鍵轉折點，讓研究者能透過證據節點，逐層展開這起影響台灣社安網深遠的制度性事件。
            </p>
         </div>
      </header>

      {/* MAIN SPINE CONTENT */}
      <main className="max-w-4xl mx-auto px-10 md:px-20 relative">
         {/* THE LINE */}
         <div className="absolute left-10 md:left-20 top-0 bottom-0 w-[0.5px] bg-[#2F3A35]/15 z-0" />

         <div className="space-y-48 relative z-10">
            {PHASES.map((phase, idx) => (
              <section key={phase.id} id={phase.id} className="scroll-mt-48 space-y-24">
                 {/* PHASE HEADER */}
                 <div className="flex items-center gap-12 -ml-2 md:-ml-4">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-[#2F3A35]/20 flex items-center justify-center text-[11px] font-black text-[#2F3A35] shadow-sm">
                       {idx + 1}
                    </div>
                    <h2 className="text-[32px] font-serif font-bold italic text-[#1A1A1A] bg-[#FDFCF8] pr-8 py-2">
                       {phase.title}
                    </h2>
                 </div>

                 {/* EVENT CARDS */}
                 <div className="space-y-16 pl-20">
                    {eventsByPhase[phase.id]?.length > 0 ? (
                      eventsByPhase[phase.id].map((evt) => (
                        <EventCard 
                          key={evt.id || evt.event_id} 
                          event={evt} 
                          onClick={() => openDetail(evt)} 
                        />
                      ))
                    ) : (
                      <div className="p-12 border border-dashed border-black/[0.08] rounded-2xl flex items-center justify-center">
                         <span className="text-[12px] font-serif italic text-slate-300">Phase under secondary audit...</span>
                      </div>
                    )}
                 </div>
              </section>
            ))}
         </div>
      </main>

      {/* DETAIL MODAL */}
      <DetailSheet 
        isOpen={!!selectedItem} 
        setOpen={(open) => !open && setSelectedItem(null)} 
        item={selectedItem} 
      />
    </div>
  );
}

function EventCard({ event, onClick }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Claim': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Court Recognized': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Danger': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  return (
    <motion.div 
      whileHover={{ x: 8 }}
      className="bg-white rounded-[2.5rem] p-12 border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all cursor-pointer group relative overflow-hidden flex flex-col md:flex-row gap-12"
      onClick={onClick}
    >
       {/* STATUS & DATE RAIL */}
       <div className="w-full md:w-36 shrink-0 flex flex-row md:flex-col justify-between md:justify-start gap-4">
          <div className="text-[22px] font-serif italic font-black text-[#2F3A35] tabular-nums leading-none">
             {event.date?.split('-').join('.')}
          </div>
          <FactStatusBadge status={event.status || 'Confirmed'} />
       </div>

       {/* MAIN CONTENT */}
       <div className="flex-1 space-y-8">
          <h3 className="text-[28px] font-serif font-bold italic leading-[1.1] text-[#1A1A1A] group-hover:text-[#2F3A35] transition-colors antialiased pr-20">
             {event.title}
          </h3>
          
          <p className="text-[17px] text-slate-500 font-serif leading-[1.8] italic opacity-90 pr-8 line-clamp-3">
             {event.significance || event.description || "相關制度存檔細節已收入引用抽屜。"}
          </p>
          
          {/* ENTITY CHIPS */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-black/[0.04]">
             {event.related_entities?.map(entId => (
               <Badge key={entId} className="rounded-xl bg-[#F5F6F0] border-black/[0.05] text-[#2F3A35]/60 text-[10px] font-sans font-black italic px-8 py-2 hover:bg-[#2F3A35] hover:text-white transition-all">
                  {getDisplayName(entId, database)}
               </Badge>
             ))}
             <div className="flex-1" />
             <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-300 italic">
                <FileText size={12} />
                {event.source_refs?.length || 1} Sources
             </div>
          </div>
       </div>

       {/* ACTION HINT */}
       <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-4 transition-all duration-500">
          <div className="w-16 h-16 rounded-full border border-black/[0.05] flex items-center justify-center bg-white shadow-xl">
             <ArrowRight size={22} className="text-[#2F3A35]" />
          </div>
       </div>
    </motion.div>
  );
}
