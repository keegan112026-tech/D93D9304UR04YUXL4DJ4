import React, { useState, Suspense, lazy, useEffect } from 'react';
import { 
  Home as HomeIcon, BookOpen, Layers, 
  Network, Database, Search, 
  ChevronRight, ArrowRight, Activity, 
  FileText, Users, Landmark, 
  Scale, ShieldAlert, BadgeCheck, Tag, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

// Lazy views
const Home = lazy(() => import('./views/Home'));
const CaseSpine = lazy(() => import('./views/CaseSpine'));
const ChapterReader = lazy(() => import('./views/ChapterReader'));
const HearingIndex = lazy(() => import('./views/HearingIndex'));
const PolicyDashboard = lazy(() => import('./views/PolicyDashboard'));
const TopicHub = lazy(() => import('./views/TopicHub'));
const Bibliography = lazy(() => import('./views/Bibliography'));
const RelationGraph = lazy(() => import('./views/RelationGraph'));
const ClaimTracker = lazy(() => import('./views/ClaimTracker'));

import DetailSheet from './components/DetailSheet';
import GlobalSearchHUD from './components/GlobalSearchHUD';

export default function App() {
  const [activeView, setActiveView] = useState('home');
  const [activeChapterId, setActiveChapterId] = useState('exec-summary');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigateTo = (view, chapterId = null) => {
    setActiveView(view);
    if (chapterId) setActiveChapterId(chapterId);
    setSelectedItem(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen bg-[#FDFCF8] text-[#1A1A1A] font-sans selection:bg-[#2F3A35]/15 selection:text-black">
      
      {/* DAYLIGHT HIGH-PRECISION SIDEBAR: PALE GREEN-WHITE */}
      <nav className="fixed left-0 top-0 h-screen w-20 md:w-24 bg-[#F5F6F0] border-r border-black/[0.08] flex flex-col items-center py-12 z-50 shadow-[20px_0_60px_rgba(0,0,0,0.03)]">
         <div 
           onClick={() => navigateTo('home')}
           className="w-12 h-12 md:w-14 md:h-14 bg-black/[0.03] rounded-xl flex items-center justify-center border border-black/[0.08] mb-12 cursor-pointer hover:bg-[#2F3A35] hover:text-white hover:scale-105 active:scale-95 transition-all shadow-sm"
         >
            <Landmark size={24} className="md:size-28" />
         </div>

         <div className="flex-1 flex flex-col gap-8">
            <NavButton icon={<HomeIcon size={22} />} label="Home" active={activeView === 'home'} onClick={() => navigateTo('home')} />
            
            <div className="w-10 h-[0.5px] bg-black/[0.05] mx-auto my-4" />
            
            <NavButton icon={<Layers size={22} />} label="Spine / 案件主軸" active={activeView === 'spine'} onClick={() => navigateTo('spine')} />
            <NavButton icon={<BookOpen size={22} />} label="Analysis / 體制報告" active={activeView === 'chapters'} onClick={() => navigateTo('chapters')} />
            
            <div className="w-10 h-[0.5px] bg-black/[0.05] mx-auto my-4" />
            
            <NavButton icon={<Scale size={22} />} label="Hearings / 庭期紀錄" active={activeView === 'hearings'} onClick={() => navigateTo('hearings')} />
            <NavButton icon={<Landmark size={22} />} label="Policy / 體制分析" active={activeView === 'policy'} onClick={() => navigateTo('policy')} />
            <NavButton icon={<Tag size={22} />} label="Themes / 系統專題" active={activeView === 'themes'} onClick={() => navigateTo('themes')} />
            <NavButton icon={<Database size={22} />} label="Literature" active={activeView === 'bibliography'} onClick={() => navigateTo('bibliography')} />
            <NavButton icon={<ShieldAlert size={22} />} label="Claims / 主張矩陣" active={activeView === 'claims'} onClick={() => navigateTo('claims')} />
            <NavButton icon={<Network size={22} />} label="Topology" active={activeView === 'graph'} onClick={() => navigateTo('graph')} />
         </div>

         <div className="mt-auto space-y-8 flex flex-col items-center">
            <NavButton icon={<Search size={22} />} label="Omni-Search" active={isSearchOpen} onClick={() => setIsSearchOpen(true)} />
            <div className="h-[0.5px] w-8 bg-black/[0.1]" />
            <div className="text-[10px] font-black tracking-widest text-[#2F3A35]/30 uppercase vertical-text opacity-60">v8.4.2</div>
         </div>
      </nav>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 pl-20 md:pl-24 transition-all duration-500 relative bg-transparent">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-screen"
          >
            <Suspense fallback={
              <div className="flex-1 h-screen flex items-center justify-center bg-[#FDFCF8]">
                 <div className="space-y-6 text-center animate-pulse">
                    <div className="h-0.5 w-[240px] bg-black/[0.05] rounded-full overflow-hidden">
                       <div className="h-full bg-[#2F3A35] w-1/3 animate-progress" />
                    </div>
                    <div className="text-[11px] font-black uppercase tracking-[0.8em] text-[#2F3A35]/40 italic">Syncing Daylight Archive...</div>
                 </div>
              </div>
            }>
               {activeView === 'home' && <Home onNavigate={navigateTo} />}
               {activeView === 'spine' && <CaseSpine />}
               {activeView === 'hearings' && <HearingIndex />}
               {activeView === 'policy' && <PolicyDashboard />}
               {activeView === 'themes' && <TopicHub />}
               {activeView === 'chapters' && (
                 <ChapterReader 
                   activeId={activeChapterId} 
                   onChapterChange={setActiveChapterId} 
                   setSelectedItem={setSelectedItem} 
                 />
               )}
               {activeView === 'claims' && <ClaimTracker />}
               {activeView === 'bibliography' && <Bibliography setSelectedItem={setSelectedItem} />}
               {activeView === 'graph' && <RelationGraph />}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* DAYLIGHT INSTITUTIONAL DETAIL MODAL */}
      <DetailSheet 
        isOpen={!!selectedItem} 
        setOpen={(open) => !open && setSelectedItem(null)} 
        item={selectedItem} 
      />

      <GlobalSearchHUD 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        setSelectedItem={setSelectedItem} 
      />
    </div>
  );
}

function NavButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all relative group
        ${active ? 'bg-white text-[#2F3A35] border border-black/[0.08] shadow-md' : 'text-[#2F3A35]/40 hover:text-[#2F3A35] hover:bg-black/[0.02]'}
      `}
      title={label}
    >
      {icon}
      {active && (
        <motion.div layoutId="nav-glow" className="absolute -inset-1 bg-[#2F3A35]/5 blur-xl rounded-full -z-10" />
      )}
      <div className={`absolute right-0 w-0.5 h-6 bg-[#2F3A35] rounded-l-full transition-all duration-500 scale-y-0 translate-x-1
        ${active ? 'scale-y-100 translate-x-0 opacity-100' : 'opacity-0'}
      `} />
    </button>
  );
}

function DetailBlock({ label, value }) {
  return (
    <div className="space-y-3">
       <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#2F3A35]/50 italic font-sans font-black">{label}</div>
       <div className="text-[20px] font-serif font-bold italic text-[#1A1A1A] tracking-tight leading-none truncate">{value}</div>
    </div>
  );
}
