import { useState, useEffect } from 'react';
import { Wrench, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import api from '../../lib/api';

export default function WorkOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/maintenance/work-orders');
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/maintenance/work-orders/${id}`, { status });
      fetchOrders();
    } catch (err) {
      alert('Failed to update work order status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Maintenance Work Orders & Dispatch Queue</h1>
        <p className="text-xs text-slate-500 mt-1">Manage preventative and emergency equipment repairs</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {orders.map(o => (
            <div key={o._id} className="p-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-950 text-[10px] font-bold rounded">
                    {o.priority}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{o.title}</h3>
                  <span className="text-xs text-slate-400">({o.workOrderId})</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{o.description}</p>
              </div>

              <div className="flex items-center gap-2">
                {o.status === 'PENDING' && (
                  <button onClick={() => updateStatus(o._id, 'IN_PROGRESS')} className="px-3 py-1.5 bg-amber-600 text-white font-bold text-xs rounded-xl">
                    Accept Ticket
                  </button>
                )}
                {o.status === 'IN_PROGRESS' && (
                  <button onClick={() => updateStatus(o._id, 'COMPLETED')} className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl">
                    Mark Repaired
                  </button>
                )}
                {o.status === 'COMPLETED' && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 font-bold text-xs rounded-lg">
                    COMPLETED
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
