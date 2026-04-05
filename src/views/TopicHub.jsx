import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Search, Filter, 
  ChevronRight, Layers, HelpCircle,
  FileText, Activity, MessageSquare,
  ShieldAlert, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import database from '../data/database.json';
import DetailSheet from '../components/DetailSheet';
import { getDisplayName } from '../lib/context-engine';

/**
 * TopicHub: Module 03 (Structural Issues)
 * Aggregates narrative fragments by transversal theme.
 */
export default function TopicHub() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const topics = useMemo(() => database.topics || [], []);

  const filteredTopics = topics.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 bg-[#FDFCF8] pb-64 refined-tactile">
      <div className="max-w-6xl mx-auto px-10 md:px-20 py-24 md:py-36 space-y-36">
        
        {/* HEADER */}
        <header className="space-y-16">
           <div className="flex items-center gap-8">
              <div className="w-16 h-16 bg-[#FFFFFF] rounded-xl flex items-center justify-center border border-black/[0.05] shadow-md">
                 <ShieldAlert className="text-[#2F3A35]/30 w-7 h-7" />
              </div>
              <div className="flex flex-col">
                 <h2 className="text-[64px] font-serif font-bold text-[#1A1A1A] tracking-tighter italic antialiased leading-[0.85]">Topic Hub</h2>
                 <p className="text-[10px] font-black tracking-[1.2em] text-[#2F3A35]/40 uppercase mt-4 font-sans antialiased italic">Module 03 // Transversal Analysis</p>
              </div>
           </div>
           
           <div className="flex flex-col md:flex-row gap-8 items-end justify-between pt-16">
              <div className="relative w-full md:w-96 group">
                <Search className="absolute left-14 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#2F3A35] transition-colors" size={18} />
                <input 
                  placeholder="Audit registry by systemic theme..." 
                  className="pl-40 h-14 w-full bg-white border-black/[0.05] rounded-xl shadow-sm italic font-serif text-[16px] outline-none focus:ring-1 focus:ring-[#2F3A35]/20"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
           </div>
        </header>

        {/* TOPIC GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {filteredTopics.map((topic, idx) => (
            <motion.div
              key={topic.id || topic.topic_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedItem(topic)}
              className="group cursor-pointer"
            >
              <Card className="bg-white border-black/[0.04] p-20 hover:bg-[#F5F6F0]/50 transition-all rounded-[2.5rem] shadow-sm hover:shadow-2xl relative overflow-hidden h-full flex flex-col space-y-12">
                 <div className="flex justify-between items-start">
                    <div className="flex flex-wrap gap-4">
                       {topic.tags?.map(tag => (
                         <Badge key={tag} variant="outline" className="bg-[#2F3A35]/5 border-none text-[#2F3A35]/40 text-[9px] uppercase font-black tracking-widest px-6 py-1 rounded-sm italic font-sans">
                            {tag}
                         </Badge>
                       ))}
                    </div>
                    <div className="w-12 h-12 rounded-full border border-black/[0.05] flex items-center justify-center text-slate-200">
                       <Plus size={16} />
                    </div>
                 </div>

                 <h3 className="text-[28px] font-serif font-bold italic text-[#1A1A1A] group-hover:text-[#2F3A35] transition-colors">
                    {topic.title}
                 </h3>

                 <p className="text-[15px] text-slate-500 font-serif leading-[1.6] italic line-clamp-3">
                    {topic.definition}
                 </p>

                 <div className="pt-12 mt-auto border-t border-black/[0.03] flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-[#2F3A35]/30 italic">
                    <div className="flex items-center gap-4">
                       <Activity size={12} />
                       {topic.related_events?.length || 0} Events
                    </div>
                    <div className="h-4 w-[1px] bg-black/5" />
                    <div className="flex items-center gap-4">
                       <MessageSquare size={12} />
                       {topic.related_claims?.length || 0} Claims
                    </div>
                 </div>
              </Card>
            </motion.div>
          ))}
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
