'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, CheckCircle2, UserCheck, Stethoscope, AlertTriangle } from 'lucide-react';

interface Node {
  id: string;
  name: string;
  type: 'hq' | 'chc' | 'phc' | 'subcenter';
  x: number; // percentage
  y: number; // percentage
  occupancy: number; // percentage
  alert: 'Optimal' | 'Warning' | 'Critical';
  alertText: string;
  doctor: string;
  meds: 'Optimal' | 'Low' | 'Critical';
  patients: number;
}

const nodes: Node[] = [
  {
    id: 'hq',
    name: 'District Command HQ',
    type: 'hq',
    x: 50,
    y: 50,
    occupancy: 45,
    alert: 'Optimal',
    alertText: 'All systems operational. Network latency 12ms.',
    doctor: 'Dr. Sarah Jenkins (Chief Medical Officer)',
    meds: 'Optimal',
    patients: 124,
  },
  {
    id: 'chc1',
    name: 'Central CHC Hospital',
    type: 'chc',
    x: 25,
    y: 30,
    occupancy: 88,
    alert: 'Warning',
    alertText: 'High occupancy load in maternity ward. Dynamic triage recommended.',
    doctor: 'Dr. Amit Patel, Dr. Lisa Wong',
    meds: 'Optimal',
    patients: 284,
  },
  {
    id: 'phc1',
    name: 'Sector 4 Primary Clinic',
    type: 'phc',
    x: 75,
    y: 25,
    occupancy: 94,
    alert: 'Critical',
    alertText: 'Critical supply warning: Influenza vaccines at 10% safety stock.',
    doctor: 'Dr. Rajesh Sharma',
    meds: 'Low',
    patients: 98,
  },
  {
    id: 'sub1',
    name: 'Sub-Center East Coast',
    type: 'subcenter',
    x: 80,
    y: 70,
    occupancy: 30,
    alert: 'Optimal',
    alertText: 'Normal patient queue. Vaccines synced via offline-first ledger.',
    doctor: 'Nurse Practitioner Maria Rossi',
    meds: 'Optimal',
    patients: 22,
  },
  {
    id: 'phc2',
    name: 'Sunderbans Remote PHC',
    type: 'phc',
    x: 20,
    y: 75,
    occupancy: 62,
    alert: 'Optimal',
    alertText: 'Low latency satellite sync active. Inventory records current.',
    doctor: 'Dr. Vivek Nair',
    meds: 'Optimal',
    patients: 44,
  },
];

const connections = [
  { from: 'hq', to: 'chc1' },
  { from: 'hq', to: 'phc1' },
  { from: 'hq', to: 'sub1' },
  { from: 'hq', to: 'phc2' },
  { from: 'chc1', to: 'phc2' },
  { from: 'phc1', to: 'sub1' },
];

export default function DistrictTwin() {
  const [selectedNode, setSelectedNode] = useState<Node>(nodes[0]);

  return (
    <section className="py-24 relative overflow-hidden bg-white/20 border-y border-slate-100">
      {/* Background Gradient Blob */}
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/4 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Title */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs tracking-wider uppercase mb-4 inline-block">
            District Digital Twin
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-txt-main tracking-tight mt-2 mb-6">
            Interactive Topology Simulation
          </h2>
          <p className="text-lg text-txt-muted max-w-xl mx-auto font-normal">
            Click on any clinic node in the digital twin map to view active resources, staff availability, and predictive warnings.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Interactive Topology Canvas */}
          <div className="lg:col-span-7 clay-card p-6 md:p-8 border border-white flex flex-col items-center justify-center relative overflow-hidden bg-slate-50/50 min-h-[420px]">
            {/* Background Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-60 z-0 pointer-events-none" />

            {/* Network Connections SVG Overlay */}
            <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
              {connections.map((conn, idx) => {
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;
                
                return (
                  <g key={idx}>
                    {/* Line connecting nodes */}
                    <line
                      x1={`${fromNode.x}%`}
                      y1={`${fromNode.y}%`}
                      x2={`${toNode.x}%`}
                      y2={`${toNode.y}%`}
                      stroke="rgba(79, 124, 255, 0.15)"
                      strokeWidth="2"
                    />
                    {/* Pulsing signal dot along the route */}
                    <motion.circle
                      r="3.5"
                      fill="#7B61FF"
                      initial={{ offset: 0 }}
                      animate={{
                        cx: [`${fromNode.x}%`, `${toNode.x}%`],
                        cy: [`${fromNode.y}%`, `${toNode.y}%`],
                      }}
                      transition={{
                        duration: 4 + idx,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Interactive Clinic Node Pins */}
            <div className="absolute inset-0 z-20">
              {nodes.map((node) => {
                const isSelected = selectedNode.id === node.id;
                
                let glowColor = 'shadow-primary/20 bg-primary';
                if (node.alert === 'Warning') glowColor = 'shadow-yellow-500/30 bg-yellow-500';
                if (node.alert === 'Critical') glowColor = 'shadow-red-500/40 bg-red-500';

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 focus:outline-hidden group"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  >
                    {/* Pulsing outer glow ring */}
                    <motion.div
                      className={`absolute inset-[-12px] rounded-full opacity-20 ${glowColor.split(' ')[1]}`}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Node Dot */}
                    <div className={`w-6 h-6 rounded-full border-3 border-white shadow-lg flex items-center justify-center relative transition-all duration-300 ${
                      isSelected ? 'scale-130 ring-4 ring-primary/20' : 'hover:scale-115'
                    } ${glowColor.split(' ')[1]}`}>
                      <span className="text-[8px] font-black text-white">{node.type.substring(0, 2).toUpperCase()}</span>
                    </div>

                    {/* Simple Tooltip on hover */}
                    <div className="absolute top-[120%] left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30 shadow-md">
                      {node.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Node Details Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
                className="clay-card p-8 border border-white flex flex-col justify-between flex-1 relative overflow-hidden"
              >
                <div>
                  {/* Status Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-bold text-txt-muted uppercase tracking-wider block">
                      Facility Profile
                    </span>
                    <div className="flex items-center gap-1.5">
                      {selectedNode.alert === 'Optimal' && (
                        <span className="flex items-center gap-1 text-[11px] font-extrabold text-accent bg-accent/10 px-3 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Operational
                        </span>
                      )}
                      {selectedNode.alert === 'Warning' && (
                        <span className="flex items-center gap-1 text-[11px] font-extrabold text-yellow-600 bg-yellow-500/10 px-3 py-1 rounded-full animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5" /> High Load
                        </span>
                      )}
                      {selectedNode.alert === 'Critical' && (
                        <span className="flex items-center gap-1 text-[11px] font-extrabold text-red-500 bg-red-500/10 px-3 py-1 rounded-full animate-pulse">
                          <ShieldAlert className="w-3.5 h-3.5" /> Supplies Low
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Type */}
                  <h3 className="text-2xl font-extrabold text-txt-main mb-6 leading-tight">
                    {selectedNode.name}
                  </h3>

                  {/* Metrics grid */}
                  <div className="grid grid-cols-2 gap-6 mb-8 border-b border-slate-100 pb-6">
                    <div>
                      <span className="text-[10px] font-bold text-txt-muted block uppercase tracking-wider">BED OCCUPANCY</span>
                      <span className="text-2xl font-black text-txt-main block mt-1">{selectedNode.occupancy}%</span>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            selectedNode.occupancy > 80 ? 'bg-red-500' : selectedNode.occupancy > 60 ? 'bg-yellow-500' : 'bg-accent'
                          }`}
                          style={{ width: `${selectedNode.occupancy}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-txt-muted block uppercase tracking-wider">ACTIVE OUTPATIENTS</span>
                      <span className="text-2xl font-black text-txt-main block mt-1">{selectedNode.patients}</span>
                      <span className="text-[9px] text-txt-muted font-semibold block mt-1">Live queue status</span>
                    </div>
                  </div>

                  {/* Staffing & Medicine Details */}
                  <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 mb-6">
                    <div className="flex gap-3 items-start">
                      <div className="p-1 rounded bg-slate-100 text-txt-main">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-txt-muted block uppercase tracking-wider">ASSIGNED STAFF</span>
                        <span className="text-xs md:text-sm font-semibold text-txt-main mt-0.5 block">{selectedNode.doctor}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="p-1 rounded bg-slate-100 text-txt-main">
                        <Stethoscope className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-txt-muted block uppercase tracking-wider">VITAL MEDICINE STOCK</span>
                        <span className="text-xs md:text-sm font-semibold text-txt-main mt-0.5 block">
                          Stock Level: <strong className={selectedNode.meds === 'Optimal' ? 'text-accent' : 'text-red-500'}>{selectedNode.meds}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Warning Box */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100/50 flex gap-2.5">
                    <Activity className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-xs text-txt-muted font-normal leading-relaxed">
                      {selectedNode.alertText}
                    </p>
                  </div>
                </div>

                <div className="text-[10px] font-bold text-txt-muted mt-6 flex justify-between items-center">
                  <span>FACILITY ID: SW-{selectedNode.id.toUpperCase()}</span>
                  <span>SYNCED 2M AGO</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
