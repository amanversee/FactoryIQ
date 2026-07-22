import { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, Cpu } from 'lucide-react';
import api from '../../lib/api';

export default function AIPredictionsPage() {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const res = await api.get('/maintenance/predictions');
      setPredictions(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Predictive Maintenance & Failure Risk Matrix</h1>
        <p className="text-xs text-slate-500 mt-1">Machine learning failure predictions and recommended preventative actions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {predictions.map((p, idx) => (
          <div key={idx} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">{p.equipmentName}</span>
              <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded ${p.riskLevel === 'HIGH' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950' : 'bg-emerald-100 text-emerald-700'}`}>
                RISK LEVEL: {p.riskLevel}
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Health Score: {p.healthScore}%</span>
              <span>Predicted Failure In: {p.predictedFailureDays} Days</span>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
              <strong>Recommended Action:</strong> {p.recommendedAction}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
