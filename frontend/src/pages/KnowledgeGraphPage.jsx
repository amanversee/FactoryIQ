import { useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Network, 
  Factory, 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  Cpu, 
  Search, 
  Layers, 
  Info,
  Maximize2,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const initialNodes = [
  { 
    id: '1', 
    position: { x: 300, y: 40 }, 
    data: { label: 'Conveyor Belt A', type: 'Equipment', status: 'OPERATIONAL', dept: 'Assembly Line 1' }, 
    style: { background: '#0f172a', color: '#fff', border: '1px solid #3b82f6', borderRadius: '16px', padding: '12px 18px', boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3)' } 
  },
  { 
    id: '2', 
    position: { x: 80, y: 180 }, 
    data: { label: 'Hydraulic Pump Manual v2.pdf', type: 'Document', category: 'MANUAL', size: '4.2 MB' }, 
    style: { background: '#0f172a', color: '#fff', border: '1px solid #06b6d4', borderRadius: '16px', padding: '12px 18px' } 
  },
  { 
    id: '3', 
    position: { x: 520, y: 180 }, 
    data: { label: 'Electrical Schematics EQ-001', type: 'Document', category: 'DRAWING', size: '12.5 MB' }, 
    style: { background: '#0f172a', color: '#fff', border: '1px solid #6366f1', borderRadius: '16px', padding: '12px 18px' } 
  },
  { 
    id: '4', 
    position: { x: 300, y: 300 }, 
    data: { label: 'Drive Motor M-203', type: 'Equipment', status: 'MAINTENANCE', health: 45 }, 
    style: { background: '#0f172a', color: '#fff', border: '1px solid #f59e0b', borderRadius: '16px', padding: '12px 18px' } 
  },
  { 
    id: '5', 
    position: { x: 300, y: 440 }, 
    data: { label: 'Vibration Anomaly Report', type: 'Incident', severity: 'HIGH', date: '2026-07-21' }, 
    style: { background: '#1c1917', color: '#fca5a5', border: '1px solid #ef4444', borderRadius: '16px', padding: '12px 18px', boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.4)' } 
  },
  { 
    id: '6', 
    position: { x: 550, y: 320 }, 
    data: { label: 'ISO 9001:2015 Regulation', type: 'Regulation', standard: 'Quality & Safety' }, 
    style: { background: '#0f172a', color: '#fff', border: '1px solid #10b981', borderRadius: '16px', padding: '12px 18px' } 
  }
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', label: 'HAS_DOCUMENT', animated: true, style: { stroke: '#06b6d4', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' } },
  { id: 'e1-3', source: '1', target: '3', label: 'HAS_DRAWING', style: { stroke: '#6366f1', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' } },
  { id: 'e1-4', source: '1', target: '4', label: 'CONTAINS_SUBCOMPONENT', style: { stroke: '#f59e0b', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' } },
  { id: 'e4-5', source: '4', target: '5', label: 'TRIGGERED_ALERT', animated: true, style: { stroke: '#ef4444', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
  { id: 'e3-6', source: '3', target: '6', label: 'COMPLIES_WITH', style: { stroke: '#10b981', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } }
];

export default function KnowledgeGraphPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(initialNodes[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleNodeClick = (_, node) => {
    setSelectedNode(node);
  };

  return (
    <div className="h-full flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Network className="w-6 h-6 text-blue-500" />
            Industrial Knowledge Graph
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-xs">
            Interactive neural network mapping equipment, documents, regulations, and failure events.
          </p>
        </div>

        {/* Legend Pills */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
            <Factory className="w-3.5 h-3.5" /> Equipment
          </span>
          <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Documents
          </span>
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" /> Subcomponents
          </span>
          <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Incidents
          </span>
        </div>
      </div>

      {/* Main Canvas + Inspector Drawer */}
      <div className="flex-1 bg-slate-950 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden relative flex">
        
        {/* ReactFlow Canvas */}
        <div className="flex-1 h-full relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            fitView
            attributionPosition="bottom-left"
          >
            <Controls className="bg-slate-900 border-slate-800 text-white rounded-xl overflow-hidden shadow-xl" />
            <MiniMap 
              style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px' }}
              nodeColor={(n) => {
                if (n.data?.type === 'Equipment') return '#3b82f6';
                if (n.data?.type === 'Document') return '#06b6d4';
                if (n.data?.type === 'Incident') return '#ef4444';
                return '#6366f1';
              }}
            />
            <Background color="#1e293b" gap={20} size={1} />
          </ReactFlow>
        </div>

        {/* Node Inspector Panel */}
        {selectedNode && (
          <div className="w-80 border-l border-slate-800 bg-slate-900/90 backdrop-blur-xl p-6 flex flex-col justify-between shrink-0 z-10 animate-in slide-in-from-right duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-400" /> Node Metadata
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {selectedNode.data?.type || 'Node'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white leading-snug">{selectedNode.data?.label}</h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">ID: {selectedNode.id}</p>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                {selectedNode.data?.status && (
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400">Operational Status</span>
                    <span className={`font-bold ${selectedNode.data.status === 'OPERATIONAL' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {selectedNode.data.status}
                    </span>
                  </div>
                )}

                {selectedNode.data?.category && (
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400">Document Type</span>
                    <span className="font-bold text-cyan-400">{selectedNode.data.category}</span>
                  </div>
                )}

                {selectedNode.data?.severity && (
                  <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-800/60 flex justify-between items-center">
                    <span className="text-rose-300 font-semibold">Incident Severity</span>
                    <span className="font-bold text-rose-400">{selectedNode.data.severity}</span>
                  </div>
                )}

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1 text-slate-300">
                  <p className="font-semibold text-slate-200">Connected Graph Edges:</p>
                  <p className="text-[11px] text-slate-400">Connected to 3 neighboring nodes via bidirectional vector relationships.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Query Graph via AI
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
