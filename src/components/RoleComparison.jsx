import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, ShieldAlert, ArrowRightLeft, Quote } from 'lucide-react';
import database from '../data/database.json';

/**
 * RoleComparison Dashboard
 * Displays the conflicting legal/professional positions of key actors.
 * Specifically handles the "Adoption vs. Primary" defense logic.
 */
export default function RoleComparison() {
  const people = (database.entities || []).filter(p => p.entity_type === 'person' && p.professional_positioning);

  return (
    <div className="space-y-32 py-32 border-t border-black/[0.04]">
      <div className="flex items-center gap-12 mb-24">
         <div className="w-16 h-16 bg-[#FDFCF8] rounded-2xl flex items-center justify-center text-[#2F3A35]/30 border border-black/[0.05] shadow-sm">
            <ArrowRightLeft size={28} />
         </div>
         <div className="space-y-2">
            <h3 className="text-h3 italic text-[#1A1A1A]">庭審角色界線衝突對照</h3>
            <p className="text-[12px] font-black uppercase tracking-[1em] text-slate-300 italic font-sans font-black">Role Boundary & Positioning Matrix</p>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-24">
        {people.map((person) => (
          <Card key={person.id} className="bg-white rounded-[3.5rem] border border-black/[0.06] shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-1000">
            <div className="flex flex-col md:flex-row h-full">
              {/* LEFT: Identity */}
              <div className="md:w-1/3 p-28 bg-[#F5F6F0]/50 border-r border-black/[0.03] space-y-16">
                 <div className="flex items-center gap-10">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-black/[0.05] shadow-sm">
                       <User size={18} className="text-[#2F3A35]/40" />
                    </div>
                    <Badge variant="outline" className="border-[#2F3A35]/15 text-[#2F3A35]/60 bg-white rounded-md font-black text-[10px] tracking-[0.4em] px-8 py-2 uppercase italic">
                       {person.id}
                    </Badge>
                 </div>
                 <h4 className="text-[32px] font-serif font-bold text-[#1A1A1A] italic leading-tight">{person.name}</h4>
                 <p className="text-[14px] font-sans font-black uppercase tracking-[0.4em] text-[#2F3A35]/40 italic">{person.role_in_case}</p>
                 <div className="pt-16 border-t border-black/[0.05] flex items-center gap-6 opacity-30 text-[#2F3A35]">
                    <ShieldAlert size={14} />
                    <span className="text-[9px] font-black tracking-[0.2em]">Institutional Accountability Trace</span>
                 </div>
              </div>

              {/* RIGHT: Positioning */}
              <div className="md:w-2/3 p-28 space-y-24 flex flex-col justify-center">
                 <div className="space-y-12">
                    <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.5em] text-[#2F3A35]/60 italic font-sans border-b border-black/[0.05] pb-8">
                       <Quote size={12} />
                       專業自我定位 / Self-Positioning
                    </div>
                    <p className="text-[20px] font-serif italic text-[#1A1A1A]/80 leading-[1.8] antialiased">
                       {person.professional_positioning}
                    </p>
                 </div>
                 
                 {person.responsibility_boundary && (
                   <div className="space-y-12">
                      <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.5em] text-[#2F3A35]/60 italic font-sans border-b border-black/[0.05] pb-8">
                         <ShieldAlert size={12} />
                         責任判定邊界 / Responsibility Boundary
                      </div>
                      <p className="text-[17px] font-serif italic text-slate-400 leading-[1.8] antialiased">
                         {person.responsibility_boundary}
                      </p>
                   </div>
                 )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
