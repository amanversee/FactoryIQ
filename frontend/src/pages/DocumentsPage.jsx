import { useState } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle2,
  Clock,
  X,
  Trash2,
  Eye,
  Download,
  Plus,
  Sparkles,
  Layers,
  FileCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import useAuthStore from '../store/authStore';

export default function DocumentsPage() {
  const { user } = useAuthStore();
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Initial Documents List
  const [documents, setDocuments] = useState([
    { id: 1, title: 'Hydraulic Pump P-102 Operating Manual.pdf', category: 'MANUAL', department: 'Mechanical', status: 'COMPLETED', date: '2026-07-21', chunks: 14, size: '4.2 MB', uploader: 'John Doe' },
    { id: 2, title: 'ISO 9001:2015 Safety SOP Standard.docx', category: 'SOP', department: 'Safety', status: 'COMPLETED', date: '2026-07-20', chunks: 8, size: '1.8 MB', uploader: 'Sarah Connor' },
    { id: 3, title: 'Conveyor Belt Assembly Schematics.pdf', category: 'DRAWING', department: 'Electrical', status: 'PROCESSING', date: '2026-07-21', chunks: 22, size: '12.5 MB', uploader: 'Mike Ross' },
    { id: 4, title: 'Quarterly Maintenance Audit Report Q2.pdf', category: 'REPORT', department: 'Operations', status: 'COMPLETED', date: '2026-07-19', chunks: 19, size: '8.4 MB', uploader: 'Aman Admin' },
  ]);

  const [newDoc, setNewDoc] = useState({
    title: '',
    category: 'MANUAL',
    department: 'Mechanical',
    file: null
  });

  const categories = ['ALL', 'MANUAL', 'SOP', 'DRAWING', 'REPORT'];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setNewDoc({ ...newDoc, title: file.name, file });
    }
  };

  const handleSimulatedUpload = (e) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          const createdDoc = {
            id: Date.now(),
            title: newDoc.title || 'Uploaded Document.pdf',
            category: newDoc.category,
            department: newDoc.department,
            status: 'PROCESSING',
            date: new Date().toISOString().split('T')[0],
            chunks: Math.floor(Math.random() * 15) + 5,
            size: '3.5 MB',
            uploader: user?.name || 'Current User'
          };
          setDocuments([createdDoc, ...documents]);
          setShowUploadModal(false);
          setUploadProgress(0);
          setNewDoc({ title: '', category: 'MANUAL', department: 'Mechanical', file: null });
          return 100;
        }
        return prev + 30;
      });
    }, 300);
  };

  const handleDelete = (id) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" />
            Knowledge Base & Documents
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Upload, manage, and extract AI embeddings from industrial manuals and SOPs.
          </p>
        </div>

        <button 
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/25 transition-all self-start sm:self-auto cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents by title, department, or content..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-900 dark:text-white"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer",
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Documents Table */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3.5">Document Title</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5">AI Status</th>
                <th className="px-6 py-3.5">Chunks</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No documents found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl border border-blue-500/20 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{doc.title}</p>
                          <span className="text-[11px] text-slate-400">{doc.size} • Uploaded by {doc.uploader}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">{doc.department}</td>
                    <td className="px-6 py-4">
                      {doc.status === 'COMPLETED' ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Ready (RAG Active)</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 animate-pulse">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Processing OCR</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                      {doc.chunks} vectors
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">{doc.date}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setShowPreviewModal(doc)}
                          className="p-1.5 text-slate-400 hover:text-blue-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View metadata"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {user?.role === 'ADMIN' && (
                          <button 
                            onClick={() => handleDelete(doc.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Delete document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-blue-500" />
                Upload Knowledge Document
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSimulatedUpload} className="p-6 space-y-4">
              <div 
                className={cn(
                  "border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer",
                  dragActive ? "border-blue-500 bg-blue-500/10" : "border-slate-300 dark:border-slate-700 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-3">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <p className="text-base font-bold text-slate-900 dark:text-white">Drag and drop file here</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                  PDF, DOCX, XLSX, images supported up to 50MB.
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewDoc({ ...newDoc, title: e.target.files[0].name, file: e.target.files[0] });
                    }
                  }}
                />
                <label 
                  htmlFor="file-upload"
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors inline-block cursor-pointer"
                >
                  Choose File
                </label>
              </div>

              {newDoc.title && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-between text-xs text-blue-700 dark:text-blue-300">
                  <span className="font-semibold truncate">{newDoc.title}</span>
                  <span className="font-mono text-[10px]">Selected</span>
                </div>
              )}

              {isUploading && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>Extracting OCR & Generating Embeddings...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select 
                    value={newDoc.category}
                    onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                  >
                    <option value="MANUAL">MANUAL</option>
                    <option value="SOP">SOP</option>
                    <option value="DRAWING">DRAWING</option>
                    <option value="REPORT">REPORT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <select 
                    value={newDoc.department}
                    onChange={(e) => setNewDoc({ ...newDoc, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                  >
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Safety">Safety</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/20 disabled:opacity-50"
                >
                  {isUploading ? 'Processing AI...' : 'Upload & Process AI'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded">
                  {showPreviewModal.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">{showPreviewModal.title}</h3>
              </div>
              <button onClick={() => setShowPreviewModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-2 text-xs text-slate-600 dark:text-slate-300 font-mono">
              <p><span className="text-slate-400">Department:</span> {showPreviewModal.department}</p>
              <p><span className="text-slate-400">Embeddings:</span> {showPreviewModal.chunks} Text Chunks Vectorized</p>
              <p><span className="text-slate-400">File Size:</span> {showPreviewModal.size}</p>
              <p><span className="text-slate-400">Uploader:</span> {showPreviewModal.uploader}</p>
              <p><span className="text-slate-400">Status:</span> {showPreviewModal.status}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setShowPreviewModal(null)} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500">
                Close Metadata
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
