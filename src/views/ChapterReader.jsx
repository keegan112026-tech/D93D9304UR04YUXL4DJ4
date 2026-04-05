import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, Info, Calendar, ArrowRightLeft, 
  AlertCircle, Download, BookOpen, Clock, 
  ChevronLeft, Share2, Printer, 
  Search, ExternalLink,
  Network, Database, ShieldAlert, Scale, Activity, ShieldCheck, ListFilter, Bookmark, Landmark
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import { CHAPTERS } from '../data/chapters';
import database from '../data/database.json';
import DetailSheet from '../components/DetailSheet';
import RoleComparison from '../components/RoleComparison';

export default function ChapterReader({ activeId, onChapterChange }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const activeChapter = CHAPTERS.find(c => c.id === activeId) || CHAPTERS[0];
  const scrollRef = useRef(null);

  const handleCardClick = (event) => {
    let realItem = null;
    if (event.type === 'HEARING') {
      realItem = database.hearings.find(h => h.date === event.date);
    } else {
      realItem = database.events?.find(e => e.id === event.id || e.title === event.focus);
    }
    
    setSelectedItem(realItem || { title: event.focus, date: event.date, id: event.id });
    setIsSheetOpen(true);
  };

  // Helper to find deep content for a timeline item
  const getDeepContent = (item) => {
    if (item.type === 'HEARING') {
      const hearing = database.hearings.find(h => h.date === item.date);
      return hearing ? hearing.full_testimony_analysis : item.focus;
    }
    if (item.type === 'TOPIC') {
      const topic = database.topics.find(t => t.id === item.id);
      return topic ? topic.detailed_definition : item.focus;
    }
    return item.focus;
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeId]);

  return (
    <div className="flex h-full bg-[#FDFCF8] overflow-hidden font-sans refined-tactile">
      
      {/* DAYLIGHT TOC SIDEBAR: PALE GREEN-WHITE */}
      <aside className="w-[400px] bg-[#F5F6F0] border-r border-black/[0.08] flex flex-col z-20 relative overflow-hidden shadow-[20px_0_60px_rgba(0,0,0,0.03)]">
        <div className="absolute top-0 right-0 p-12 opacity-[0.015] pointer-events-none transform rotate-12 scale-150 text-[#2F3A35]">
           <BookOpen size={360} />
        </div>

        <div className="p-12 pb-10 border-b border-black/[0.05] bg-white/40">
           <div className="flex items-center gap-6 mb-8">
              <div className="h-[0.5px] w-12 bg-[#2F3A35]/30" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.8em] text-[#2F3A35]/50 italic font-sans">Archive Registry</h3>
           </div>
           <h2 className="text-[42px] font-serif font-bold text-[#1A1A1A] tracking-tighter italic leading-none antialiased pr-8">深度分析分卷</h2>
        </div>

        <ScrollArea className="flex-1 px-8 py-10">
          <div className="space-y-4 pb-16">
            {CHAPTERS.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => onChapterChange(chapter.id)}
                className={`w-full group flex items-center gap-6 px-10 py-5 rounded-lg transition-all duration-500 relative overflow-hidden ${
                  activeId === chapter.id 
                    ? 'bg-white text-[#2F3A35] border border-black/[0.06] shadow-md scale-[1.02]' 
                    : 'text-slate-400 hover:bg-white/20 hover:text-[#2F3A35]'
                }`}
              >
                <div className={`text-[15px] font-serif font-bold italic tracking-tighter w-10 shrink-0 transition-opacity tabular-nums ${activeId === chapter.id ? 'opacity-100 text-[#2F3A35]/50' : 'opacity-20 group-hover:opacity-100'}`}>
                   {chapter.chapterNum}
                </div>
                <div className="flex flex-col items-start overflow-hidden pt-1">
                   <span className="text-[16px] font-semibold tracking-tight text-left leading-tight truncate w-full uppercase font-sans">{chapter.title.split('：')[0]}</span>
                   {activeId === chapter.id && (
                     <motion.span 
                       initial={{ opacity: 0, y: 3 }} 
                       animate={{ opacity: 1, y: 0 }}
                       className="text-[9px] font-black text-[#2F3A35]/30 uppercase tracking-[0.5em] mt-3 font-sans italic"
                     >
                       Recon Active
                     </motion.span>
                   )}
                </div>
                {activeId === chapter.id && (
                   <motion.div layoutId="toc-indicator" className="absolute left-0 top-0 w-[0.5px] h-full bg-[#2F3A35] opacity-60 shadow-sm" />
                )}
              </button>
            ))}
          </div>
        </ScrollArea>

        <div className="p-12 bg-white/50 border-t border-black/[0.05] space-y-8 group hover:bg-[#FDFCF8] transition-all">
           <div className="flex items-center gap-5">
              <div className="p-3 bg-black/[0.02] rounded-xl border border-black/[0.05] shadow-sm transition-all group-hover:border-[#2F3A35]/40">
                 <ShieldCheck className="text-[#2F3A35]/30 group-hover:text-[#2F3A35] transition-colors" size={20} />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#2F3A35]/30 font-sans leading-none mb-3 italic">Trace Code Validation</span>
                 <span className="text-[11px] font-serif italic text-slate-400 tracking-tight leading-none group-hover:text-[#2F3A35]/60 transition-colors">Archive Index v8.4.2</span>
              </div>
           </div>
        </div>
      </aside>

      {/* DAYLIGHT READING AREA: RICE WHITE */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth bg-transparent relative">
        <div className="max-w-4xl mx-auto px-16 md:px-24 py-24 md:py-40 space-y-36 antialiased">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-36"
            >
              
              {/* CHAPTER HEADER */}
              <header className="space-y-16 relative">
                 <div className="flex items-center gap-10">
                    <Badge className="bg-black/[0.02] text-[#2F3A35]/40 border border-black/[0.05] px-8 py-2 rounded-md font-black text-[10px] tracking-[0.8em] uppercase font-sans italic shadow-sm tabular-nums">
                       MODERN DOSSIER {activeChapter.chapterNum}
                    </Badge>
                    <div className="h-[0.5px] flex-1 bg-black/5 opacity-40"></div>
                 </div>
                 
                 <h1 className="text-h2 italic pr-24 text-[#1A1A1A] opacity-95">
                    {activeChapter.title}
                 </h1>

                 <div className="flex items-center justify-between pt-12 border-t border-black/[0.04] font-serif italic text-slate-400">
                    <div className="flex gap-20">
                       <div className="space-y-3">
                          <div className="text-[11px] font-black uppercase tracking-[0.5em] text-[#2F3A35]/30 font-sans italic">Archive Source</div>
                          <div className="text-[20px] font-medium text-slate-500 flex items-center gap-4">
                             <Landmark size={20} className="text-[#2F3A35]/20" /> TACTILE REGISTRY
                          </div>
                       </div>
                       <div className="space-y-3">
                          <div className="text-[11px] font-black uppercase tracking-[0.5em] text-[#2F3A35]/30 font-sans italic">Clearance Level</div>
                          <Badge variant="outline" className="border-[#2F3A35]/15 text-[#2F3A35]/40 bg-[#2F3A35]/5 rounded-md font-black text-[10px] tracking-[0.4em] px-6 py-2 uppercase italic">ALPHA-OMEGA-8</Badge>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <Button variant="outline" size="icon" className="rounded-lg w-16 h-16 border-black/[0.05] text-slate-300 hover:text-[#2F3A35] transition-all shadow-sm">
                          <Printer size={20} strokeWidth={1.5} />
                       </Button>
                       <Button variant="outline" size="icon" className="rounded-lg w-16 h-16 border-black/[0.05] text-slate-300 hover:text-[#2F3A35] transition-all shadow-sm">
                          <Share2 size={20} strokeWidth={1.5} />
                       </Button>
                    </div>
                 </div>
              </header>

              {/* ARTICLE BODY - DAYLIGHT PAPER SAMPLE */}
              <article className="space-y-36">
                 <section className="bg-[#FFFFFF] p-24 md:p-32 rounded-[2.5rem] border border-black/[0.06] relative group overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 p-24 opacity-[0.012] group-hover:opacity-[0.04] transition-all duration-1000 pointer-events-none text-[#2F3A35]">
                       <Database size={200} />
                    </div>
                    
                    <div className="flex items-center gap-8 mb-24 font-sans">
                       <div className="w-16 h-16 bg-[#FDFCF8] rounded-2xl flex items-center justify-center text-[#2F3A35]/30 border border-black/[0.05] shadow-sm group-hover:border-[#2F3A35]/40 transition-all duration-1000">
                          <Activity size={26} />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[11px] font-black uppercase tracking-[0.6em] text-[#2F3A35]/30 italic leading-none mb-3 font-sans italic">Archive Logic Protocol</span>
                          <span className="text-[18px] font-bold text-slate-300 tracking-tighter uppercase tracking-[0.4em] font-sans italic opacity-40">數據校對摘要輸出</span>
                       </div>
                    </div>

                    <div className="text-[24px] text-slate-600 leading-[2.1] font-serif font-medium tracking-tight text-justify whitespace-pre-wrap antialiased italic pr-16 group-hover:text-slate-800 transition-colors duration-1000">
                       {activeChapter.content}
                    </div>

                    <div className="mt-28 pt-16 border-t border-black/[0.04] flex items-center justify-between">
                       <div className="flex items-center gap-6 font-sans opacity-30">
                          <div className="w-1.5 h-1.5 bg-[#2F3A35]/40 rounded-full animate-pulse shadow-sm" />
                          <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[#2F3A35]/60 font-sans italic">REC ID: {activeChapter.source || 'TACTILE-TRACE-8'}</span>
                       </div>
                       <Button 
                        onClick={() => setSelectedItem({ title: activeChapter.title, abstract: activeChapter.content, year: '2026', author: activeChapter.source })}
                        className="rounded-lg h-18 px-14 text-[14px] font-black uppercase tracking-[0.4em] font-sans italic gap-5 bg-[#2F3A35] text-white hover:bg-[#2F3A35]/90 transition-all shadow-xl active:scale-95 border border-black/10"
                       >
                          Cite Status <ExternalLink size={18} strokeWidth={2.5} />
                       </Button>
                    </div>
                 </section>

                 {/* DYNAMIC DATA BLOCKS: DAYLIGHT TABLES */}
                 {activeChapter.negligence && (
                   <div className="space-y-24">
                      <div className="flex items-center gap-8">
                         <div className="w-18 h-18 bg-[#FFFFFF] rounded-[2rem] flex items-center justify-center text-[#2F3A35]/30 border border-black/[0.05] shadow-md">
                            <AlertCircle size={32} />
                         </div>
                         <div className="space-y-2">
                            <h3 className="text-h3 italic text-[#1A1A1A]">體制過失對標存檔</h3>
                            <p className="text-[12px] font-black uppercase tracking-[1em] text-slate-300 italic font-sans font-black">Analytical Audit Trace (A-8)</p>
                         </div>
                      </div>
                      
                      <div className="rounded-[3.5rem] overflow-hidden border border-black/[0.08] shadow-xl bg-white">
                         <Table>
                            <TableHeader className="bg-[#F5F6F0] border-b border-black/[0.04]">
                               <TableRow className="hover:bg-transparent border-none h-32">
                                  <TableHead className="w-40 text-slate-300 font-sans font-black uppercase tracking-[0.8em] text-[10px] text-center italic tabular-nums">Ref-ID</TableHead>
                                  <TableHead className="text-slate-600 font-serif italic text-[24px] px-18">過失事項 / Operational Trace</TableHead>
                                  <TableHead className="text-slate-300 font-sans font-black uppercase tracking-[0.8em] text-[10px] italic">對標法律</TableHead>
                               </TableRow>
                            </TableHeader>
                            <TableBody>
                               {activeChapter.negligence.map((item) => (
                                 <TableRow 
                                   key={item.id} 
                                   className="group hover:bg-[#F5F6F0]/30 transition-all cursor-pointer border-black/[0.04]" 
                                   onClick={() => setSelectedItem({ title: `過失認定 #${item.id}`, text: item.item, year: '2026', type: 'TRACE-POINT' })}
                                 >
                                    <TableCell className="text-center font-serif font-bold text-slate-200 text-[48px] px-12 group-hover:text-[#2F3A35]/20 transition-all duration-1000 py-18 italic tabular-nums">{String(item.id).padStart(2, '0')}</TableCell>
                                    <TableCell className="px-18 font-serif font-medium text-slate-400 leading-[2.1] text-[26px] italic group-hover:text-slate-800 transition-all antialiased opacity-70 group-hover:opacity-100">{item.item}</TableCell>
                                    <TableCell className="pr-14">
                                       <Badge variant="outline" className="border-[#2F3A35]/15 text-[#2F3A35]/40 bg-[#2F3A35]/5 rounded-md font-black text-[11px] tracking-[0.4em] px-8 py-3 uppercase italic font-sans group-hover:bg-[#2F3A35] group-hover:text-white transition-all shadow-sm">LAW-{item.law.split(' ')[0]}</Badge>
                                    </TableCell>
                                 </TableRow>
                               ))}
                            </TableBody>
                         </Table>
                      </div>
                   </div>
                 )}

                  {/* ROLE BOUNDARY COMPARISON: ONLY FOR CHAPTER 5 (HEARINGS) */}
                  {activeChapter.id === 'CH-5' && (
                    <RoleComparison />
                  )}

                  {/* FINDINGS CARDS (ch4, ch6) */}
                 {activeChapter.findings && activeChapter.findings.length > 0 && (
                   <div className="space-y-12">
                      <div className="flex items-center gap-8">
                         <div className="w-18 h-18 bg-[#FFFFFF] rounded-[2rem] flex items-center justify-center text-[#2F3A35]/30 border border-black/[0.05] shadow-md">
                            <ListFilter size={28} />
                         </div>
                         <div className="space-y-2">
                            <h3 className="text-h3 italic text-[#1A1A1A]">制度分析要點</h3>
                            <p className="text-[12px] font-black uppercase tracking-[1em] text-slate-300 italic font-sans">Key Findings</p>
                         </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {activeChapter.findings.map((finding, i) => (
                           <div key={i} className="bg-white rounded-[2rem] p-12 border border-black/[0.05] shadow-sm hover:shadow-md transition-all space-y-6">
                              <h4 className="text-[18px] font-serif font-bold italic text-[#1A1A1A]">{finding.title}</h4>
                              <p className="text-[15px] font-serif italic text-slate-500 leading-relaxed">{finding.text}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}

                  {/* CHRONICLE CARDS: DAYLIGHT */}
                 {activeChapter.timeline && (
                   <div className="space-y-28">
                      <div className="flex items-center gap-8">
                         <div className="w-18 h-18 bg-[#FDFCF8] rounded-[2.5rem] flex items-center justify-center text-[#2F3A35]/30 border border-black/[0.05] shadow-md">
                            <Clock size={32} />
                         </div>
                         <div className="space-y-2">
                            <h3 className="text-h3 italic text-[#1A1A1A]">庭審時間線校對</h3>
                            <p className="text-[12px] font-black uppercase tracking-[1em] text-slate-300 italic font-sans font-black">Chronicle Sync Protocol</p>
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         {activeChapter.timeline.map((event, i) => (
                           <Card 
                             key={i} 
                             onClick={() => handleCardClick(event)}
                             className="bg-white rounded-[3rem] border border-black/[0.06] shadow-md group hover:-translate-y-2 transition-all duration-600 cursor-pointer relative overflow-hidden"
                           >
                              <div className="p-16 space-y-12">
                                 <div className="flex justify-between items-center mb-12">
                                    <Badge className="bg-[#F5F6F0] text-[#2F3A35]/60 border border-[#2F3A35]/15 px-8 py-2 rounded-md font-black text-[11px] uppercase tracking-[0.6em] group-hover:bg-[#2F3A35] group-hover:text-white transition-all italic font-sans shadow-sm">{event.type}</Badge>
                                    <ChevronRight className="text-slate-200 group-hover:text-[#2F3A35]/60 transition-all group-hover:translate-x-4 duration-600" size={28} />
                                 </div>
                                 <CardTitle className="text-[64px] font-serif font-bold text-slate-200 italic tracking-tighter antialiased leading-[0.85] group-hover:text-[#2F3A35] transition-colors duration-600 tabular-nums">{event.date}</CardTitle>
                                 <p className="text-[26px] font-serif italic text-slate-400 group-hover:text-slate-700 transition-colors duration-600 antialiased pr-12 leading-tight opacity-90">{event.focus}</p>
                              </div>
                           </Card>
                         ))}
                      </div>
                   </div>
                 )}
              </article>

              {/* NEXT CHAPTER GATEWAY */}
              <footer className="pt-32 pb-64 border-t border-black/[0.08] flex flex-col items-center gap-16 text-center relative overflow-hidden">
                 <div className="space-y-6 relative z-10 font-sans">
                    <span className="text-[14px] font-black uppercase tracking-[2em] text-[#2F3A35]/10 italic ml-[2em]">Transition to Next Logic Sequence</span>
                    <h4 className="text-[64px] font-serif font-bold italic tracking-tight text-black/[0.015] leading-none">Daylight Institutional Registry</h4>
                 </div>
                 
                 <Button 
                   onClick={() => {
                     const nextIdx = CHAPTERS.findIndex(c => c.id === activeId) + 1;
                     if (nextIdx < CHAPTERS.length) onChapterChange(CHAPTERS[nextIdx].id);
                   }}
                   className="rounded-lg px-24 py-12 h-24 text-3xl font-serif font-bold italic bg-[#2F3A35] text-white shadow-xl group relative transition-all active:scale-95 border border-black/10"
                 >
                    存檔移轉 <ChevronRight className="ml-6 group-hover:translate-x-4 transition-transform duration-600 shadow-xl" size={40} strokeWidth={3} />
                 </Button>
              </footer>

            </motion.div>
          </AnimatePresence>

        </div>
      </main>
      {/* DETAIL MODAL */}
      <DetailSheet 
        isOpen={isSheetOpen} 
        setOpen={setIsSheetOpen} 
        item={selectedItem} 
      />
    </div>
  );
}
