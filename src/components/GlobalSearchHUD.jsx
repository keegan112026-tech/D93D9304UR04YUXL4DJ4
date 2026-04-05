import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Command, X, 
  User, Landmark, Scale, 
  FileText, Activity, MessageSquare,
  ChevronRight, ArrowRight
} from 'lucide-react';
import database from '../data/database.json';
import { getDisplayName } from '../lib/context-engine';

/**
 * GlobalSearchHUD: Institutional Command Overlay
 * A floating search interface for high-precision institutional lookup.
 */
export default function GlobalSearchHUD({ isOpen, onClose, setSelectedItem }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Handle ESC key for closing
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const results = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    const term = searchTerm.toLowerCase();
    const matches = [];

    // Search Entities
    database.entities?.forEach(ent => {
      if (ent.name?.toLowerCase().includes(term) || ent.role_in_case?.toLowerCase().includes(term)) {
        matches.push({ ...ent, type: 'ENTITY' });
      }
    });

    // Search Hearings
    database.hearings?.forEach(h => {
      if (h.date?.includes(term) ||
          h.proceedings_type?.toLowerCase().includes(term) ||
          h.title?.toLowerCase().includes(term)) {
        matches.push({ ...h, type: 'HEARING' });
      }
    });

    // Search Claims
    database.claims?.forEach(c => {
      if (c.statement?.toLowerCase().includes(term) || c.claim_id?.toLowerCase().includes(term)) {
        matches.push({ ...c, type: 'CLAIM' });
      }
    });

    // Search Sources
    database.sources?.forEach(s => {
      if (s.title?.toLowerCase().includes(term) || s.publisher?.toLowerCase().includes(term)) {
        matches.push({ ...s, type: 'SOURCE' });
      }
    });

    return matches.slice(0, 10);
  }, [searchTerm]);

  const getIcon = (type) => {
    switch (type) {
      case 'ENTITY': return <User size={16} className="text-emerald-300" />;
      case 'HEARING': return <Scale size={16} className="text-blue-300" />;
      case 'CLAIM': return <MessageSquare size={16} className="text-amber-300" />;
      case 'SOURCE': return <FileText size={16} className="text-slate-300" />;
      default: return <Activity size={16} />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-start justify-center pt-32 px-10"
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          className="w-full max-w-2xl bg-[#1A1A1A] border border-white/[0.08] shadow-[0_40px_100px_rgba(0,0,0,0.8)] rounded-[2.5rem] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* SEARCH BAR */}
          <div className="p-8 md:p-12 border-b border-white/[0.05] flex items-center gap-8 relative">
             <Search size={22} className="text-white/20 ml-4" />
             <input 
               autoFocus
               placeholder="Institutional Command / Search Everything..." 
               className="bg-transparent border-none outline-none text-[20px] font-serif italic text-white placeholder:text-white/10 w-full"
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
             />
             <div className="flex items-center gap-4 bg-white/5 px-6 py-2 rounded-lg border border-white/5 text-[10px] font-black tracking-widest text-white/30 uppercase italic font-sans mr-4">
                ESC to Exit
             </div>
          </div>

          {/* RESULTS AREA */}
          <div className="max-h-[500px] overflow-y-auto no-scrollbar p-8">
             {results.length > 0 ? (
               <div className="space-y-4">
                 <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-8 ml-4">Audit Result // Top 10 Hits</div>
                 {results.map((res, idx) => (
                   <motion.div
                     key={res.id || res.entity_id || res.source_id}
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: idx * 0.03 }}
                     onClick={() => {
                        setSelectedItem(res);
                        onClose();
                     }}
                     className="group cursor-pointer p-10 py-12 rounded-2xl hover:bg-white/[0.04] border border-transparent hover:border-white/[0.08] transition-all flex items-center gap-12"
                   >
                     <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
                        {getIcon(res.type)}
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center gap-6">
                           <span className="text-[11px] font-black uppercase tracking-widest text-white/20 italic">{res.type}</span>
                           <span className="text-[10px] font-black text-white/10 border-l border-white/5 pl-6">{res.id || res.entity_id || res.source_id}</span>
                        </div>
                        <h4 className="text-[18px] font-serif font-bold text-white group-hover:text-amber-200 transition-colors italic">
                           {res.title || res.name || res.statement || res.date}
                        </h4>
                     </div>
                     <ChevronRight size={18} className="text-white/10 group-hover:text-white group-hover:translate-x-2 transition-all" />
                   </motion.div>
                 ))}
               </div>
             ) : searchTerm.length > 1 ? (
               <div className="py-24 text-center space-y-8">
                  <div className="scale-150 opacity-10 inline-block mb-8">
                     <Search size={48} />
                  </div>
                  <p className="text-[18px] font-serif italic text-white/20 antialiased">No institutional records found matching this trace ID or title.</p>
               </div>
             ) : (
               <div className="py-24 text-center">
                  <p className="text-[14px] font-sans font-black uppercase tracking-[0.6em] text-white/10 italic">Awaiting Precision Query...</p>
               </div>
             )}
          </div>
          
          {/* FOOTER */}
          <div className="p-8 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
             <div className="flex gap-10 items-center">
                <Badge variant="outline" className="border-white/5 text-white/20 text-[9px] px-6 py-1">Entities</Badge>
                <Badge variant="outline" className="border-white/5 text-white/20 text-[9px] px-6 py-1">Hearings</Badge>
                <Badge variant="outline" className="border-white/5 text-white/20 text-[9px] px-6 py-1">Sources</Badge>
             </div>
             <div className="text-[11px] font-black italic text-white/10 uppercase tracking-widest">Daylight HUD v3.0</div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
