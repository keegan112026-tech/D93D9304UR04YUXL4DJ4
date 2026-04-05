import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Search, Filter, 
  ChevronRight, Layers, HelpCircle,
  FileText, Activity, MessageSquare,
  ShieldAlert, BookOpen, Scale,
  ChevronDown, Landmark, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import database from '../data/database.json';
import DetailSheet from '../components/DetailSheet';
import { getDisplayName } from '../lib/context-engine';

/**
 * PolicyDashboard: Module 04 (Systemic Comparison)
 * Compares "Systemic Mandate" vs "Case Status / Trace".
 */
export default function PolicyDashboard() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [activePillar, setActivePillar] = useState('evaluation');

  const PILLARS = [
    { 
      id: 'evaluation', 
      title: '收出養評估流程', 
      mandate: '依兒少權法§15，出養必要性評估應由地方政府主導，並整合社政與醫療資源進行評估核定。',
      actual: '實務運作中，長期由民間媒合機構（兒盟）自行評估、政府核定。直至2024年5月改革後，方回歸地方政府主導。',
      sources: ['src-stage1-001']
    },
    { 
      id: 'visitation', 
      title: '居家托育訪視規範', 
      mandate: '居托管理辦法§17規定，新收托30日內須完成首訪。例行訪視需「親見兒童」且採「不預約、不同時段」原則。',
      actual: '本案中，居托訪視紀錄與社工訪視紀錄之時間重合性（例如掉牙問題之回報）在法庭中成為辯詰核心。',
      sources: ['src-stage1-001']
    },
    { 
      id: 'oversight', 
      title: '三方協力機制', 
      mandate: '收出養媒合為特許行業，受中央與地方二級督導。地方政府（新北/台北）對跨轄區個案有資訊通報與共同監督之責。',
      actual: '監察院糾正報告指出，中央對收出養機制監督不力，且三方（兒盟、新北、台北）交接資訊斷裂。',
      sources: ['src-stage1-001']
    },
    { 
      id: 'records', 
      title: '專業紀錄保存', 
      mandate: '社工師法§17規定紀錄應保存10年。紀錄撰製應符合據實原則，補正程序需有明確標註。',
      actual: '法庭中針對「紀錄補正」是否構成「業務登載不實」進行高度辯理，社工職業工會主張不應將紀錄補正直接推定為惡意。',
      sources: ['src-stage1-001']
    }
  ];

  const current = PILLARS.find(p => p.id === activePillar);

  return (
    <div className="flex-1 bg-[#FDFCF8] pb-64 refined-tactile">
      <div className="max-w-6xl mx-auto px-10 md:px-20 py-24 md:py-36 space-y-36">
        
        {/* HEADER */}
        <header className="space-y-16">
           <div className="flex items-center gap-8">
              <div className="w-16 h-16 bg-[#FFFFFF] rounded-xl flex items-center justify-center border border-black/[0.05] shadow-md">
                 <Scale className="text-[#2F3A35]/30 w-7 h-7" />
              </div>
              <div className="flex flex-col">
                 <h2 className="text-[64px] font-serif font-bold text-[#1A1A1A] tracking-tighter italic antialiased leading-[0.85]">體制狀況分析</h2>
                 <p className="text-[10px] font-black tracking-[1.2em] text-[#2F3A35]/40 uppercase mt-4 font-sans antialiased italic">Module 04 // Systemic Comparison</p>
              </div>
           </div>

           <div className="flex flex-wrap gap-4 pt-16">
              {PILLARS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setActivePillar(p.id)}
                  className={`px-12 py-6 rounded-2xl border transition-all text-[14px] font-serif font-bold italic
                    ${activePillar === p.id ? 'bg-[#2F3A35] text-white border-[#2F3A35] shadow-xl' : 'bg-white text-slate-400 border-black/[0.05] hover:border-[#2F3A35]/20'}
                  `}
                >
                   {p.title}
                </button>
              ))}
           </div>
        </header>

        {/* COMPARISON MATRIX */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePillar}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 relative"
          >
             {/* THE CONNECTOR */}
             <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-[#FDFCF8] border border-black/[0.05] flex items-center justify-center shadow-md">
                   <ChevronRight className="text-slate-200" />
                </div>
             </div>

             {/* MANDATE CARD */}
             <Card className="bg-white rounded-[3.5rem] border border-black/[0.06] p-24 md:p-40 space-y-24 shadow-sm hover:shadow-xl transition-all">
                <div className="flex items-center gap-8">
                   <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                      <Landmark size={18} />
                   </div>
                   <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#2F3A35]/40 italic">體制原定設計 ／ 法規規範</span>
                </div>
                <h3 className="text-[32px] font-serif font-bold italic text-[#1A1A1A] leading-tight">
                   {current.title}
                </h3>
                <p className="text-[20px] text-slate-500 font-serif leading-[1.8] italic pr-12">
                   {current.mandate}
                </p>
                <div className="flex items-center gap-6 text-[10px] font-black text-slate-200 uppercase tracking-widest italic pt-12 border-t border-black/[0.03]">
                   Official Directive // Central Authority
                </div>
             </Card>

             {/* ACTUAL TRACE CARD */}
             <Card className="bg-[#FFFFFF] rounded-[3.5rem] border border-[#2F3A35]/15 p-24 md:p-40 space-y-24 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8">
                   <div className="w-14 h-14 rounded-full bg-[#2F3A35]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Activity size={20} className="text-[#2F3A35]/30" />
                   </div>
                </div>
                <div className="flex items-center gap-8">
                   <div className="w-10 h-10 rounded-full bg-[#2F3A35]/5 flex items-center justify-center text-[#2F3A35]/40">
                      <FileText size={18} />
                   </div>
                   <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#2F3A35]/40 italic">本案實務存檔 ／ 運作軌跡</span>
                </div>
                <h3 className="text-[32px] font-serif font-bold italic text-[#2F3A35] leading-tight">
                   實務追蹤分析
                </h3>
                <p className="text-[20px] text-slate-600 font-serif leading-[1.8] italic pr-12">
                   {current.actual}
                </p>
                <div className="pt-12 border-t border-black/[0.03] flex items-center gap-12">
                   {current.sources.map(srcId => (
                     <button
                        key={srcId}
                        onClick={() => setSelectedItem({ id: srcId, type: 'SOURCE' })}
                        className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#2F3A35]/60 hover:text-black transition-colors italic"
                     >
                        <Globe size={12} />
                        Source Reference // {srcId}
                     </button>
                   ))}
                </div>
             </Card>
          </motion.div>
        </AnimatePresence>

        {/* PILLAR DESCRIPTION */}
        <div className="max-w-4xl pt-24 border-t border-black/[0.05] space-y-12">
           <h4 className="text-[18px] font-serif font-black italic text-slate-300">Analytical Note</h4>
           <p className="text-[16px] text-slate-400 font-serif italic leading-relaxed antialiased">
              本看板旨在客觀呈現兒少保護體系在法律規範層面的原定設計，與本案中透過偵查、審理及媒體報導所揭露的實務執行狀況。我們不對其差異進行主觀評價，僅透過檔案追蹤呈現制度運作的客觀軌跡。
           </p>
        </div>

      </div>

      {/* DETAIL MODAL */}
      <DetailSheet 
        isOpen={!!selectedItem} 
        setOpen={(open) => !open && setSelectedItem(null)} 
        item={selectedItem} 
      />
    </div>
  );
}
