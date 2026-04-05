import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldAlert, User, Scale, ArrowRightLeft, 
  MessageSquare, CheckCircle, XCircle, Info
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import database from '../data/database.json';
import DetailSheet from '../components/DetailSheet';
import { getDisplayName } from '../lib/context-engine';
import FactStatusBadge from '../components/FactStatusBadge';

/**
 * ClaimTracker: The Semantic Context Matrix
 * Shows the "Argument Web" of the archive.
 * Cross-references Claims with People, Orgs, and Hearings.
 */
export default function ClaimTracker() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeType, setActiveType] = useState('All');

  // Normalize claims: some use claim_id/claim_type, others use id/type
  const claims = (database.claims || []).map(c => ({
    ...c,
    id: c.id || c.claim_id,
    claim_type: c.claim_type || c.type || 'General',
  }));
  const filteredClaims = activeType === 'All'
    ? claims
    : claims.filter(c => c.claim_type === activeType);

  const openDetail = (item) => {
    setSelectedItem(item);
    setIsSheetOpen(true);
  };

  return (
    <div className="flex-1 bg-[#FDFCF8] pb-40 refined-tactile">
      <div className="max-w-6xl mx-auto px-10 md:px-20 py-24 md:py-36 space-y-36">
        
        {/* HEADER */}
        <header className="space-y-16">
           <div className="flex items-center gap-8">
              <div className="w-16 h-16 bg-[#FFFFFF] rounded-xl flex items-center justify-center border border-black/[0.05] shadow-md">
                 <ShieldAlert className="text-[#2F3A35]/30 w-7 h-7" />
              </div>
              <div className="flex flex-col">
                 <h2 className="text-[64px] font-serif font-bold text-[#1A1A1A] tracking-tighter italic antialiased leading-[0.85]">Claim Matrix</h2>
                 <p className="text-[10px] font-black tracking-[1.2em] text-[#2F3A35]/40 uppercase mt-4 font-sans antialiased italic">Semantic Argument Tracker</p>
              </div>
           </div>
           
           <div className="max-w-4xl border-l border-[#2F3A35]/20 pl-14 py-4">
              <p className="text-[22px] text-slate-500 font-serif font-medium leading-[1.8] italic antialiased opacity-90">
                 追蹤庭審中最具爭議性的核心主張。本介面將「辯論點」與「實體網絡」進行交叉映射，呈現出各方在法律責任認定上的攻防脈絡。
              </p>
           </div>

           <div className="flex gap-4 p-2 bg-[#F5F6F0] rounded-xl border border-black/[0.04] w-fit shadow-sm">
              {['All', 'Legal', 'Institutional', 'Academic'].map(type => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-10 py-5 rounded-md text-[10px] font-black uppercase tracking-[0.4em] transition-all
                    ${activeType === type ? 'bg-[#2F3A35] text-white shadow-md' : 'text-[#2F3A35]/40 hover:text-[#2F3A35]'}
                  `}
                >
                  {type}
                </button>
              ))}
           </div>
        </header>

        {/* GRID */}
        <section className="grid grid-cols-1 gap-16">
          <AnimatePresence>
            {filteredClaims.map((claim, idx) => (
              <motion.div
                key={claim.id || claim.claim_id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="bg-white rounded-[3.5rem] border border-black/[0.06] shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-1000 relative">
                   <div className="p-28 md:p-40 space-y-24">
                      {/* CLAIM HEADER */}
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-6">
                           <FactStatusBadge status={claim.status || 'Claim'} />
                        </div>
                        <Badge variant="outline" className="border-black/5 text-slate-300 font-black text-[9px] uppercase tracking-widest italic py-1 px-6 rounded-md">
                           {claim.claim_id}
                        </Badge>
                      </div>
                      <h3 className="text-[36px] font-serif font-bold text-[#1A1A1A] italic leading-tight tracking-tight pr-24 group-hover:text-[#2F3A35] transition-colors">
                         {claim.statement}
                      </h3>
                      <div className="w-16 h-16 bg-[#FDFCF8] rounded-2xl flex items-center justify-center text-[#2F3A35]/30 border border-black/[0.05] shadow-sm">
                         <MessageSquare size={26} />
                      </div>

                      {/* ARGUMENT MATRIX */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-24 pt-24 border-t border-black/[0.04]">
                         <div className="space-y-12">
                            <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.5em] text-[#2F3A35]/60 italic font-sans">
                               <CheckCircle size={14} className="text-emerald-500" />
                               支持論點與實體 / Pro-Arguments
                            </div>
                            <div className="flex flex-wrap gap-8">
                               {claim.pro_arguments?.map(id => (
                                 <Badge key={id} onClick={() => openDetail({ id, type: 'PERSON', name: getDisplayName(id, database) })} className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 cursor-pointer text-[14px] font-serif italic py-2 px-10 rounded-xl transition-all">
                                    {getDisplayName(id, database)}
                                 </Badge>
                               ))}
                               {!claim.pro_arguments?.length && <span className="text-[12px] font-serif italic text-slate-300">No explicit supporting actors.</span>}
                            </div>
                         </div>
                         <div className="space-y-12">
                            <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.5em] text-[#2F3A35]/60 italic font-sans">
                               <XCircle size={14} className="text-rose-500" />
                               對抗論點與實體 / Opposing
                            </div>
                            <div className="flex flex-wrap gap-8">
                               {claim.con_arguments?.map(id => (
                                 <Badge key={id} onClick={() => openDetail({ id, type: 'PERSON', name: getDisplayName(id, database) })} className="bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100 cursor-pointer text-[14px] font-serif italic py-2 px-10 rounded-xl transition-all">
                                    {getDisplayName(id, database)}
                                 </Badge>
                               ))}
                               {!claim.con_arguments?.length && <span className="text-[12px] font-serif italic text-slate-300">Uncontested in current archive record.</span>}
                            </div>
                         </div>
                      </div>

                      {/* CONTENTION POINT */}
                      <div className="p-24 bg-[#F5F6F0]/50 rounded-[2.5rem] border border-black/[0.03] space-y-8">
                         <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.4em] text-[#2F3A35]/50 italic font-sans">
                            <ArrowRightLeft size={14} />
                            法律爭點對標 / Point of Contention
                         </div>
                         <p className="text-[18px] font-serif italic text-slate-500 leading-relaxed antialiased">
                            {claim.point_of_contention}
                         </p>
                      </div>
                   </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </section>
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
