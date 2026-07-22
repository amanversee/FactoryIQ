import { useState } from 'react';
import { Sparkles, Cpu, Database, Activity, Sliders, CheckCircle2 } from 'lucide-react';

export default function AIMonitoringPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Engine & Vector Search Index Monitoring</h1>
        <p className="text-xs text-slate-500 mt-1">Real-time status of Gemini 1.5 Flash models, Atlas Vector Search embeddings, and prompt configurations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase">Embedding Model</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">text-embedding-004</p>
          <span className="text-xs text-emerald-500 font-bold block mt-2">768 Dimensional Vectors</span>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase">Generative Model</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">gemini-1.5-pro-latest</p>
          <span className="text-xs text-blue-500 font-bold block mt-2">Industrial System Prompt Persona</span>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase">Vector Index Status</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">vector_index (MongoDB Atlas)</p>
          <span className="text-xs text-emerald-500 font-bold block mt-2">ACTIVE & SYNCHRONIZED</span>
        </div>
      </div>
    </div>
  );
}
