import React, { useMemo, useState } from 'react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Info, Network, AlertCircle, ArrowRightLeft, 
  Database, ShieldAlert, Scale, Target, 
  Activity, Landmark, ShieldCheck, User, Building
} from 'lucide-react';
import { motion } from "framer-motion";
import database from '../data/database.json';
import DetailSheet from '../components/DetailSheet';

/**
 * Dynamic RelationGraph
 * Renders the entire institutional network from database.json.
 * High-precision tactile design for relation topology.
 */
export default function RelationGraph() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // DYNAMICALLY GENERATE NODES & EDGES FROM DATABASE
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes = [];
    const edges = [];
    
    // 1. ADD ORGANIZATIONS (Central Hubs)
    const orgs = (database.entities || []).filter(e => e.entity_type === 'organization');
    orgs.forEach((org, i) => {
      nodes.push({
        id: org.id,
        type: 'default',
        data: { 
          label: org.name, 
          icon: <Building size={16} />,
          raw: org 
        },
        position: { x: 500 + (org.id.includes('nps') ? -200 : 200), y: 150 + i * 150 },
        className: 'daylight-node-org'
      });
    });

    // 2. ADD PEOPLE (Satellites)
    const people = (database.entities || []).filter(e => e.entity_type === 'person');
    people.forEach((person, i) => {
      nodes.push({
        id: person.id,
        type: 'default',
        data: { 
          label: person.name, 
          icon: <User size={16} />,
          raw: person 
        },
        position: { x: 500 + Math.cos(i) * 400, y: 400 + Math.sin(i) * 400 },
        className: 'daylight-node-person'
      });

      // Connect to Affiliation (Unified Lookup)
      if (person.affiliation) {
        edges.push({
          id: `e-${person.id}-${person.affiliation}`,
          source: person.affiliation,
          target: person.id,
          label: '所屬單位',
          animated: true,
          style: { stroke: "#2F3A35", strokeWidth: 2, opacity: 0.15 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#2F3A35", width: 20, height: 20 }
        });
      }

      // Connect to Related Entities
      if (person.related_entities) {
        person.related_entities.forEach(relatedId => {
          edges.push({
            id: `e-${person.id}-${relatedId}`,
            source: person.id,
            target: relatedId,
            label: '關聯關係',
            style: { stroke: "#64748B", strokeWidth: 0.5, opacity: 0.1 }
          });
        });
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = (evt, node) => {
    setSelectedItem(node.data.raw);
    setIsSheetOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FDFCF8] overflow-hidden font-sans refined-tactile">
      
      {/* DAYLIGHT HEADER */}
      <header className="p-12 pb-10 bg-[#F5F6F0] flex justify-between items-end border-b border-black/[0.04] relative z-20 shrink-0 shadow-sm">
         <div className="space-y-8">
            <motion.div 
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               className="flex items-center gap-6"
            >
               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#2F3A35]/40 border border-black/[0.05] shadow-sm">
                  <Network size={20} />
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2F3A35]/30 italic leading-none mb-3 font-sans italic">topology_mapping_matrix</span>
                  <div className="flex items-center gap-6">
                     <h2 className="text-h2 italic leading-none text-[#1A1A1A]">權責網絡地圖</h2>
                     <Badge variant="outline" className="border-black/[0.08] text-slate-300 font-sans font-black tabular-nums tracking-widest text-[9px] h-14 bg-white/50 backdrop-blur-sm px-6 py-0 uppercase italic">{nodes.length} NODES</Badge>
                  </div>
               </div>
            </motion.div>
         </div>
      </header>

      {/* FLOW CANVAS */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          className="bg-[#FDFCF8]/30"
          nodeTypes={{}} // Custom types if needed
        >
          <Background 
            color="#2F3A35" 
            gap={40} 
            size={0.8} 
            className="opacity-[0.03]" 
            variant="dots"
          />
          <Controls className="bg-white border-black/[0.08] shadow-xl rounded-xl scale-90 origin-bottom-left" />
          <MiniMap 
            className="bg-white border-black/[0.08] shadow-2xl rounded-2xl overflow-hidden grayscale opacity-30 hover:opacity-100 transition-opacity"
            nodeColor={(node) => node.className === 'daylight-node-org' ? '#2F3A35' : '#F5F6F0'}
            maskColor="rgba(245, 246, 240, 0.4)"
          />
        </ReactFlow>

        {/* FLOATING LEGEND */}
        <div className="absolute top-16 right-16 z-30 space-y-12">
           <Card className="bg-white/80 backdrop-blur-md border-black/[0.08] p-16 shadow-2xl rounded-[2.5rem] w-64">
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300 mb-12 border-b border-black/[0.05] pb-6 font-sans italic">Legend / 標本圖例</h4>
              <div className="space-y-10">
                 <LegendItem color="#2F3A35" label="官方機構 (Orgs)" icon={<Landmark size={12} />} />
                 <LegendItem color="#F5F6F0" label="角色實體 (People)" icon={<User size={12} />} />
                 <LegendItem color="rgba(47, 58, 53, 0.2)" label="管理/署名 (Auth)" dashed />
              </div>
           </Card>
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

function LegendItem({ color, label, icon, dashed }) {
  return (
    <div className="flex items-center gap-8">
      <div 
        className={`w-4 h-4 rounded-full border border-black/10`} 
        style={{ backgroundColor: color, borderStyle: dashed ? 'dashed' : 'solid' }}
      />
      <span className="text-[12px] font-serif italic text-slate-600 flex items-center gap-4">
        {icon}
        {label}
      </span>
    </div>
  );
}
