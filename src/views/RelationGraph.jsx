import React, { useMemo, useState, useEffect } from 'react';
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
  // Layout: 4-zone structured grid for readable topology
  // Zone A (x=80):   Government Central orgs
  // Zone B (x=380):  Government Local + Court orgs
  // Zone C (x=680):  NGO orgs
  // Zone D (x=980):  People (clustered beside their org)
  // Zone E (x=1320): Key events (index events only — 18 max)
  // Zone F (x=80, top): Laws (horizontal strip)
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes = [];
    const edges = [];

    // Org type buckets for structured layout
    const ORG_BUCKETS = {
      'government-central': { x: 80,  label: '中央機關' },
      'government-local':   { x: 380, label: '地方機關' },
      'court':              { x: 380, label: '司法機關' },
      'ngo':                { x: 680, label: '民間機構' },
    };
    const bucketCounters = { 80: 0, 380: 0, 680: 0 };
    const orgPositions = {}; // id → {x, y}

    // 1. LAWS — top strip at y = -120
    const laws = (database.entities || []).filter(e => e.entity_type === 'law');
    laws.forEach((law, i) => {
      nodes.push({
        id: law.id,
        data: { label: law.name, icon: <Scale size={14} />, raw: law },
        position: { x: 80 + i * 320, y: -120 },
        className: 'daylight-node-law'
      });
    });

    // 2. ORGS — zone by org_type, 160px vertical spacing
    const orgs = (database.entities || []).filter(e => e.entity_type === 'organization');
    orgs.forEach((org) => {
      const bucket = ORG_BUCKETS[org.org_type] || { x: 680 };
      const bx = bucket.x;
      const idx = bucketCounters[bx] ?? 0;
      bucketCounters[bx] = idx + 1;
      const pos = { x: bx, y: 80 + idx * 160 };
      orgPositions[org.id] = pos;
      nodes.push({
        id: org.id,
        data: { label: org.name, icon: <Building size={14} />, raw: org },
        position: pos,
        className: 'daylight-node-org'
      });
    });

    // 3. PEOPLE — beside their affiliated org, 2-column sub-grid at x+300
    const people = (database.entities || []).filter(e => e.entity_type === 'person');
    const peopleCounts = {};
    people.forEach((person, i) => {
      let x = 980, y = 80 + i * 90;
      if (person.affiliation && orgPositions[person.affiliation]) {
        const op = orgPositions[person.affiliation];
        const cnt = peopleCounts[person.affiliation] || 0;
        peopleCounts[person.affiliation] = cnt + 1;
        x = op.x + 300 + (cnt % 2) * 160;
        y = op.y + Math.floor(cnt / 2) * 80;
      }
      nodes.push({
        id: person.id,
        data: { label: person.name, icon: <User size={14} />, raw: person },
        position: { x, y },
        className: 'daylight-node-person'
      });
      if (person.affiliation) {
        edges.push({
          id: `e-${person.id}-aff`,
          source: person.affiliation,
          target: person.id,
          label: '成員',
          animated: true,
          style: { stroke: "#2F3A35", strokeWidth: 1.5, opacity: 0.2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#2F3A35", width: 12, height: 12 }
        });
      }
      if (person.related_entities) {
        person.related_entities.forEach(relId => {
          if (relId !== person.affiliation) {
            edges.push({
              id: `e-${person.id}-${relId}`,
              source: person.id,
              target: relId,
              style: { stroke: "#94A3B8", strokeWidth: 0.5, opacity: 0.08 }
            });
          }
        });
      }
    });

    // 4. KEY EVENTS — use only the 18 index events for readable graph
    const indexEventIds = new Set(database.index?.events || []);
    const keyEvents = (database.events || []).filter(e =>
      indexEventIds.has(e.id) || indexEventIds.has(e.event_id)
    );
    keyEvents.forEach((evt, i) => {
      const evtId = evt.id || evt.event_id;
      nodes.push({
        id: evtId,
        data: { label: evt.title?.replace(/\*\*/g, ''), icon: <Activity size={14} />, raw: evt },
        position: { x: 1320, y: 80 + i * 130 },
        className: 'daylight-node-event border-rose-200'
      });
      if (evt.related_entities) {
        evt.related_entities.forEach(entId => {
          edges.push({
            id: `e-evt-${evtId}-${entId}`,
            source: evtId,
            target: entId,
            animated: false,
            style: { stroke: "#CBD5E1", strokeWidth: 1, opacity: 0.12 }
          });
        });
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, []);

  const [activeNodeId, setActiveNodeId] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Focus Hierarchy Engine: Multi-Layer Highlighting
  useEffect(() => {
    if (!activeNodeId) {
      // Reset all
      setNodes((nds) => nds.map((n) => ({ ...n, style: { ...n.style, opacity: 1, filter: 'none' } })));
      setEdges((eds) => eds.map((e) => ({ ...e, animated: false, style: { ...e.style, opacity: 0.1, stroke: e.label ? "#2F3A35" : "#CBD5E1" } })));
      return;
    }

    // Find connections
    const connectedNodeIds = new Set([activeNodeId]);
    edges.forEach((edge) => {
      if (edge.source === activeNodeId) connectedNodeIds.add(edge.target);
      if (edge.target === activeNodeId) connectedNodeIds.add(edge.source);
    });

    setNodes((nds) => nds.map((n) => {
      const isConnected = connectedNodeIds.has(n.id);
      return {
        ...n,
        style: { 
          ...n.style, 
          opacity: isConnected ? 1 : 0.05,
          filter: isConnected ? 'none' : 'blur(2px)',
          transition: 'all 0.5s ease-in-out'
        }
      };
    }));

    setEdges((eds) => eds.map((e) => {
      const isRelated = e.source === activeNodeId || e.target === activeNodeId;
      return {
         ...e,
         animated: isRelated,
         style: { 
           ...e.style, 
           opacity: isRelated ? 0.8 : 0.02,
           stroke: isRelated ? "#2F3A35" : "#CBD5E1",
           strokeWidth: isRelated ? 2 : 1,
           transition: 'all 0.5s ease-in-out'
         }
      };
    }));
  }, [activeNodeId, setNodes, setEdges]);

  const onNodeClick = (evt, node) => {
    setActiveNodeId(node.id);
    const raw = node.data.raw;
    // Standardize type for DetailSheet
    if (!raw.entity_type && raw.source_id) raw.entity_type = 'source';
    if (!raw.entity_type && (raw.id?.startsWith('evt-') || raw.event_id)) raw.entity_type = 'event';
    
    setSelectedItem(raw);
    setIsSheetOpen(true);
  };

  const onPaneClick = () => {
    setActiveNodeId(null);
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
                 <LegendItem color="#2F3A35" label="官方機構 (Orgs)" icon={<Building size={12} />} />
                 <LegendItem color="#FFFFFF" label="角色實體 (People)" icon={<User size={12} />} />
                 <LegendItem color="#EFF6FF" label="法規/制度 (Laws)" icon={<Scale size={12} />} />
                 <LegendItem color="#FFF1F2" label="關鍵事件 (Events)" icon={<Activity size={12} />} />
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
        onItemClick={(item) => setSelectedItem(item)}
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
