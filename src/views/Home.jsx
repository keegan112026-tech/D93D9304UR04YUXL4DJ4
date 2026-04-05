import React, { useMemo } from 'react';
import { 
  Search, BookOpen, Network, Database, ShieldAlert, 
  Scale, ChevronRight, ArrowRight, Activity, 
  FileText, Users, Landmark, Clock, Bookmark, ShieldCheck,
  TrendingDown, FileSignature, CheckCircle, Tag, Layers, CheckCircle2
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

import database from '../data/database.json';

export default function Home({ onNavigate }) {
  const stats = useMemo(() => ({
    sources: (database.sources || []).length,
    hearings: (database.hearings || []).length,
    entities: (database.entities || []).length,
    lastUpdate: '2026-04-05'
  }), []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
  };

  return (
    <div className="flex-1 bg-[#FDFCF8] overflow-x-hidden pb-40 refined-tactile">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-10 md:px-20 py-24 md:py-36 space-y-36"
      >
        
        {/* DAYLIGHT HIGH-PRECISION HERO */}
        <section className="relative pt-12 md:pt-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-b from-[#2F3A35]/[0.02] to-transparent rounded-full blur-[160px] pointer-events-none -z-10" />
          
          <div className="space-y-16 relative z-10 flex flex-col items-center">
            <motion.div variants={itemVariants} className="flex items-center gap-6 mb-4">
               <div className="h-[0.5px] w-12 bg-[#2F3A35]/15" />
               <span className="text-[12px] font-black uppercase text-[#2F3A35]/40 tracking-[1em] font-sans italic tabular-nums">Version 8.4.2 Protocol</span>
               <div className="h-[0.5px] w-12 bg-[#2F3A35]/15" />
            </motion.div>
            
            <motion.h1 
              variants={itemVariants} 
              className="text-h1 flex flex-col items-center group cursor-default text-[#1A1A1A]"
            >
               <span className="opacity-95 md:tracking-[-0.04em]">現代觸感</span>
               <span className="text-[#2F3A35]/70 not-italic block -mt-4 underline decoration-[#2F3A35]/10 underline-offset-[16px] decoration-[0.5px]">研究存檔庫</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-[22px] md:text-[24px] text-slate-500 font-serif font-medium leading-[2.1] max-w-4xl italic antialiased text-center opacity-90 px-8">
               這是一個融合了高精準度數位美學與實體紙質溫度的存檔空間。我們在數千頁的公文與法庭筆錄中，提煉出影響社會體制運作的核心變量，為專業法律研究提供極致清晰的沉浸式紀錄。
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-8 pt-10">
               <Button 
                 onClick={() => onNavigate('spine')}
                 className="rounded-lg px-14 py-8 h-20 text-[18px] font-bold shadow-xl group bg-[#2F3A35] text-white hover:bg-[#2F3A35]/90 transition-all font-sans uppercase tracking-[0.2em] border border-black/10 active:scale-95"
               >
                  從案件主軸開始 <ArrowRight className="ml-5 group-hover:translate-x-3 transition-transform duration-500" size={24} />
               </Button>
               <Button 
                 variant="ghost"
                 onClick={() => onNavigate('bibliography')}
                 className="rounded-lg px-14 py-8 h-20 text-[18px] font-bold border border-black/[0.05] text-[#2F3A35]/60 hover:text-[#2F3A35] hover:bg-black/[0.02] transition-all font-serif italic"
               >
                  解鎖文獻存檔
               </Button>
            </motion.div>
          </div>
        </section>

        {/* DAYLIGHT STATS: PRECISION LEDGER */}
        <motion.section variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-8">
           <StatLedger icon={<Clock size={18} />} label="存檔校冊總量" value={`${stats.sources} Units`} />
           <StatLedger icon={<Users size={18} />} label="追蹤實體對象" value={`${stats.entities} Units`} />
           <StatLedger icon={<Landmark size={18} />} label="關鍵庭期紀錄" value={`${stats.hearings} Sessions`} />
           <StatLedger icon={<CheckCircle2 size={18} />} label="數據整合狀態" value="VALIDATED" />
        </motion.section>

        {/* MODULE CARDS: DAYLIGHT MINIMALIST */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <ModuleCard 
            icon={<Layers size={32} />} 
            title="案件全景主軸" 
            desc="以 8 個關鍵階段串連時間、人物與事實，建立案件的骨幹脈絡。"
            id="spine"
            onNavigate={onNavigate}
          />
          <ModuleCard 
            icon={<Landmark size={32} />} 
            title="體制狀況分析" 
            desc="對照社會安全網原定設計與本案實務運作，分析制度執行現況。"
            id="policy"
            onNavigate={onNavigate}
          />
          <ModuleCard 
            icon={<Tag size={32} />} 
            title="系統專題中心" 
            desc="針對訪視管理、收出養評估等橫向議題進行跨時間線的規約分析。"
            id="themes"
            onNavigate={onNavigate}
          />
          <ModuleCard 
            icon={<Scale size={32} />} 
            title="庭期審理紀錄" 
            desc="全量收錄 11+ 次庭期對話與證人證詞，還原法庭攻防核心細節。"
            id="hearings"
            onNavigate={onNavigate}
          />
          <ModuleCard 
            icon={<BookOpen size={32} />} 
            title="研究分析報告" 
            desc="針對社工專業、委託體制與法律爭議，進行章節式的深層解讀。"
            id="chapters"
            onNavigate={onNavigate}
          />
          <ModuleCard 
            icon={<Database size={32} />} 
            title="文獻數位存檔" 
            desc="170+ 筆原始公文與報導數位化，為研究論據提供精準調閱。"
            id="bibliography"
            onNavigate={onNavigate}
          />
        </section>

        {/* INVESTIGATIVE SUMMARY: DAYLIGHT COLUMNAR BOX */}
        <motion.section 
          variants={itemVariants}
          className="bg-[#F5F6F0] rounded-[3rem] p-16 md:p-20 overflow-hidden relative border border-black/[0.04] shadow-[0_40px_80px_rgba(0,0,0,0.03)]"
        >
           <div className="absolute -bottom-40 -right-20 w-[600px] h-[600px] bg-[#2F3A35]/[0.05] rounded-full blur-[140px] pointer-events-none" />
           <div className="relative z-10 flex flex-col lg:flex-row gap-20 items-center">
              <div className="space-y-12 flex-1">
                 <Badge className="bg-white text-[#2F3A35]/50 border border-black/[0.05] px-8 py-2 rounded-md font-black text-[11px] uppercase tracking-[0.6em] font-sans italic shadow-sm">Analytics Protocol</Badge>
                 <h3 className="text-h2 italic text-[#1A1A1A] flex flex-col group">
                   程序正義的 
                   <span className="text-[#2F3A35]/70 not-italic block mt-3">系統狀況分析</span>
                 </h3>
                 <p className="text-[20px] text-slate-500 leading-[1.9] font-serif italic max-w-xl antialiased py-6 border-l border-[#2F3A35]/20 pl-10 opacity-90">
                   在此沈靜的存檔環境中，我們透過「對立驗證」與「證據對標」，在數位的邊界點尋找被體制遺忘的真相。
                 </p>
                 <div className="flex gap-6">
                    <StatusTag icon={<ShieldCheck size={16} />} text="Data Integrity" />
                    <StatusTag icon={<Activity size={16} />} text="Trace Tracking" />
                 </div>
              </div>
              <div className="flex-1 w-full lg:max-w-md relative">
                 <div className="bg-white rounded-[2rem] p-12 space-y-10 border border-black/[0.05] shadow-xl group overflow-hidden">
                    <div className="space-y-4">
                       <div className="text-[11px] font-black uppercase tracking-[0.6em] text-[#2F3A35]/40 font-sans">Research Core</div>
                       <div className="text-[32px] font-serif font-bold italic text-[#1A1A1A] leading-tight">體制狀況分析報告</div>
                    </div>
                    <div className="space-y-6 pt-4">
                       <DashboardMetric label="Batch Parallel Sync" value="84.2%" />
                       <DashboardMetric label="Consistency Index" value="1.00" />
                       <DashboardMetric label="Traceability" value="ACTIVE" />
                    </div>
                 </div>
              </div>
           </div>
        </motion.section>

      </motion.div>
    </div>
  );
}

function StatLedger({ icon, label, value }) {
   return (
      <div className="bg-[#FFFFFF] border border-black/[0.04] p-8 rounded-2xl hover:bg-[#F5F6F0] transition-all duration-500 group relative shadow-md">
         <div className="text-[#2F3A35]/30 mb-5 group-hover:text-[#2F3A35]/70 transition-colors duration-500">{icon}</div>
         <div className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mb-3 font-sans opacity-60 leading-none"> {label}</div>
         <div className="text-[32px] font-serif font-bold text-[#1A1A1A] tracking-tighter italic tabular-nums leading-none">{value}</div>
      </div>
   );
}

function ModuleCard({ icon, title, desc, id, onNavigate }) {
   return (
      <div 
        onClick={() => onNavigate(id)}
        className="bg-[#FFFFFF] border border-black/[0.04] rounded-[2.5rem] p-12 shadow-md hover:-translate-y-2 transition-all duration-600 cursor-pointer group relative flex flex-col h-full overflow-hidden"
      >
         <div className="text-[#2F3A35]/20 mb-8 group-hover:text-[#2F3A35]/60 transition-all duration-600">{icon}</div>
         <h3 className="text-4xl font-serif font-bold tracking-tight mb-8 italic text-[#1A1A1A] group-hover:text-[#2F3A35]/90 transition-colors duration-600 leading-none">{title}</h3>
         <p className="text-[20px] text-slate-500 leading-[1.9] font-serif italic mb-10 antialiased opacity-90 group-hover:text-slate-800 transition-all">{desc}</p>
         <div className="mt-auto flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.6em] text-[#2F3A35]/30 font-sans italic">
            Trace Access <ChevronRight className="group-hover:translate-x-2 transition-transform shadow-sm" size={16} />
         </div>
      </div>
   );
}

function StatusTag({ icon, text, item }) {
  return (
    <div className="flex items-center gap-4 px-6 py-3 bg-[#2F3A35]/[0.02] rounded-lg border border-black/[0.04] shadow-sm">
       <span className="text-[#2F3A35]/30 opacity-60">
         {item?.entity_type === 'person' && <User className="text-[#2F3A35]/40" />}
         {item?.entity_type === 'organization' && <Building className="text-[#2F3A35]/40" />}
         {item?.date && item?.participants && <Scale className="text-[#2F3A35]/40" />}
         {item?.source_type && <FileText className="text-[#2F3A35]/40" />}
         {!item && icon}
       </span>
       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2F3A35]/60 font-sans italic">{text}</span>
    </div>
  );
}

function DashboardMetric({ label, value }) {
  return (
    <div className="flex justify-between items-end border-b border-black/[0.03] pb-5">
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 font-sans">{label}</span>
      <span className="text-2xl font-serif font-bold text-[#2F3A35] italic tracking-tighter tabular-nums shadow-sm">{value}</span>
    </div>
  );
}
