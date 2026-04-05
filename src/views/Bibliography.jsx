import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { 
  Search, Filter, ArrowUpDown, ChevronDown, 
  Book, FileText, Globe, Landmark, Scale,
  ExternalLink, Layers, Info
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import database from '../data/database.json';
import { getSpinePhase, PHASES } from '../lib/context-engine';
import FactStatusBadge from '../components/FactStatusBadge';

/**
 * Bibliography: The Institutional Source Registry
 * Powered by TanStack Table for high-precision institutional research.
 * Fulfills V3 "Source Ledger Table" requirement.
 */
export default function Bibliography({ setSelectedItem }) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [activeType, setActiveType] = useState('All');

  const data = useMemo(() => database.sources, []);

  const columns = useMemo(() => [
    {
      accessorKey: 'publish_date',
      header: 'Date',
      cell: info => (
        <span className="text-[14px] font-serif tabular-nums font-bold text-[#2F3A35]/70 italic">
          {info.getValue()?.split('-').join('.')}
        </span>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Document Title',
      cell: info => (
        <div className="flex flex-col gap-2">
          <span className="text-[17px] font-serif font-bold text-[#1A1A1A] leading-tight italic group-hover:text-[#2F3A35] transition-colors">
            {info.getValue()}
          </span>
          <span className="text-[11px] font-sans font-black uppercase tracking-widest text-slate-300 italic">
             {info.row.original.publisher} // {info.row.original.source_id}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'source_type',
      header: 'System Category',
      cell: info => (
        <Badge variant="outline" className="bg-[#F5F6F0] border-black/[0.04] text-[#2F3A35]/40 font-sans px-8 py-1.5 text-[9px] uppercase tracking-widest font-black italic rounded-lg">
           {info.getValue()}
        </Badge>
      ),
    },
    {
      id: 'phase',
      header: 'Spine Location',
      cell: info => {
        const phaseId = getSpinePhase(info.row.original.id || info.row.original.source_id, database);
        const phase = PHASES.find(p => p.id === phaseId);
        return (
          <div className="flex items-center gap-6">
             <Layers size={12} className="opacity-20" />
             <span className="text-[11px] font-serif italic text-slate-400">
                {phase?.title || 'Pre-history'}
             </span>
          </div>
        );
      }
    },
    {
      id: 'actions',
      header: '',
      cell: info => (
        <Button 
          variant="ghost" 
          size="sm" 
          className="opacity-0 group-hover:opacity-100 transition-all rounded-full hover:bg-black/5"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedItem(info.row.original);
          }}
        >
           <Info size={16} className="text-[#2F3A35]/30" />
        </Button>
      )
    }
  ], [setSelectedItem]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex-1 bg-[#FDFCF8] pb-64 refined-tactile">
      <div className="max-w-6xl mx-auto px-10 md:px-20 py-24 md:py-36 space-y-36">
        
        {/* HEADER */}
        <header className="space-y-16">
           <div className="flex items-center gap-8">
              <div className="w-16 h-16 bg-[#FFFFFF] rounded-xl flex items-center justify-center border border-black/[0.05] shadow-md">
                 <Book className="text-[#2F3A35]/30 w-7 h-7" />
              </div>
              <div className="flex flex-col">
                 <h2 className="text-[64px] font-serif font-bold text-[#1A1A1A] tracking-tighter italic antialiased leading-[0.85]">Source Registry</h2>
                 <p className="text-[10px] font-black tracking-[1.2em] text-[#2F3A35]/40 uppercase mt-4 font-sans antialiased italic">Institutional Evidence Ledger</p>
              </div>
           </div>
           
           <div className="flex flex-col md:flex-row gap-8 items-end justify-between pt-16">
              <div className="relative w-full md:w-96 group">
                <Search className="absolute left-14 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#2F3A35] transition-colors" size={18} />
                <Input 
                  placeholder="Audit registry by ID, title, or publisher..." 
                  className="pl-40 h-14 bg-white border-black/[0.05] rounded-xl shadow-sm italic font-serif text-[16px] focus-visible:ring-[#2F3A35]/10"
                  value={globalFilter ?? ''}
                  onChange={e => setGlobalFilter(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                 <Button variant="outline" className="rounded-xl border-black/[0.05] bg-white h-14 px-10 text-[11px] font-black uppercase tracking-widest italic group">
                    <Filter size={14} className="mr-6 opacity-30 group-hover:opacity-100 transition-opacity" />
                    Refine Registry
                 </Button>
              </div>
           </div>
        </header>

        {/* LEDGER TABLE */}
        <div className="bg-white rounded-[3.5rem] border border-black/[0.06] shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="border-b border-black/[0.03]">
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="px-28 py-20 text-[10px] font-black uppercase tracking-[0.4em] text-[#2F3A35]/40 italic">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-black/[0.02]">
                {table.getRowModel().rows.map(row => (
                  <tr 
                    key={row.id} 
                    className="group hover:bg-[#F5F6F0]/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedItem(row.original)}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-28 py-24">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* EMPTY STATE */}
          {table.getRowModel().rows.length === 0 && (
            <div className="py-64 flex flex-col items-center justify-center space-y-12">
               <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                  <Book size={32} />
               </div>
               <p className="text-[18px] font-serif italic text-slate-300">No records matching the current audit criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
