import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Landmark, User, Calendar, 
  Search, Filter, ChevronRight, 
  MessageSquare, FileText, Scale
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import database from '../data/database.json';
import DetailSheet from '../components/DetailSheet';
import { getDisplayName } from '../lib/context-engine';
import FactStatusBadge from '../components/FactStatusBadge';

/**
 * HearingIndex: The Court Archive Module (Module 2)
 * Lists and manages court sessions as independent archival records.
 */
export default function HearingIndex() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const hearings = database.hearings || [];
  const filteredHearings = hearings.filter(h =>
    h.date?.includes(searchTerm) ||
    h.proceedings_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDetail = (item) => {
    setSelectedItem(item);
    setIsSheetOpen(true);
  };

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
                 <h2 className="text-[64px] font-serif font-bold text-[#1A1A1A] tracking-tighter italic antialiased leading-[0.85]">Court Records</h2>
                 <p className="text-[10px] font-black tracking-[1.2em] text-[#2F3A35]/40 uppercase mt-4 font-sans antialiased italic">Module 02 // Hearing Registry</p>
              </div>
           </div>
           
           <div className="flex flex-col md:flex-row gap-8 items-end justify-between pt-16">
              <div className="relative w-full md:w-96 group">
                <Search className="absolute left-14 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#2F3A35] transition-colors" size={18} />
                <Input 
                  placeholder="Audit registry by date or type..." 
                  className="pl-40 h-14 bg-white border-black/[0.05] rounded-xl shadow-sm italic font-serif text-[16px]"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
           </div>
        </header>

        {/* HEARING LIST */}
        <div className="space-y-12">
          {filteredHearings.map((hearing, idx) => (
            <motion.div
              key={hearing.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => openDetail(hearing)}
              className="group cursor-pointer"
            >
              <Card className="bg-white border-black/[0.04] p-12 hover:bg-[#F5F6F0]/50 transition-all rounded-[2rem] shadow-sm hover:shadow-xl relative overflow-hidden flex items-center gap-12">
                 {/* DATE BOX */}
                 <div className="w-40 border-r border-black/[0.05] pr-12 flex flex-col gap-4">
                    <span className="text-[20px] font-serif font-black italic tracking-tighter text-[#2F3A35]">{hearing.date?.split('-').join('.')}</span>
                    <FactStatusBadge status="Court Recognized" className="border-none shadow-none bg-transparent p-0" />
                 </div>

                 {/* CONTENT */}
                 <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-8">
                       <Badge variant="outline" className="bg-[#2F3A35]/5 border-none text-[#2F3A35]/60 text-[10px] uppercase font-black tracking-widest px-8 py-1 rounded-md italic">
                          {hearing.proceedings_type || hearing.procedure_type || '庭審'}
                       </Badge>
                       <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 italic">{hearing.location}</span>
                    </div>
                    <h3 className="text-[24px] font-serif font-bold italic text-[#1A1A1A] group-hover:text-[#2F3A35] transition-colors">
                       {hearing.title || hearing.stage || '庭審程序'}
                    </h3>
                    <div className="flex flex-wrap gap-4">
                       {hearing.participants?.slice(0, 4).map(p => (
                         <span key={p} className="text-[12px] font-serif italic text-slate-400 bg-slate-50 px-6 py-1 rounded-lg">
                            {getDisplayName(p, database)}
                         </span>
                       ))}
                    </div>
                 </div>

                 {/* ACTION */}
                 <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">
                    <ChevronRight size={24} className="text-[#2F3A35]" />
                 </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* DETAIL MODAL */}
      <DetailSheet 
        isOpen={isSheetOpen} 
        setOpen={setIsSheetOpen} 
        item={selectedItem} 
      />
    </div>
  );
}

function Input({ ...props }) {
  return (
    <input
      {...props}
      className={`w-full h-full bg-white border-black/[0.05] rounded-xl shadow-sm italic font-serif text-[16px] px-14 outline-none focus:ring-1 focus:ring-[#2F3A35]/20 ${props.className}`}
    />
  );
}
