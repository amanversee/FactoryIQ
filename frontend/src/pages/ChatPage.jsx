import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  FileText, 
  CornerDownRight, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  RefreshCcw, 
  Copy, 
  Check, 
  ThumbsUp, 
  ThumbsDown,
  Layers,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I am FactoryIQ Intelligence Agent. I have full access to your uploaded manuals, SOPs, and knowledge graph records. Ask me any technical or maintenance question.',
      confidence: 99,
      sources: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "What is the operating pressure for Hydraulic Pump P-102?",
    "Summarize ISO 9001:2015 safety inspection requirements",
    "How to troubleshoot Conveyor Belt A vibration anomaly?",
    "List all maintenance procedures for Assembly Line 1"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = (textToSend = null) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage = { id: Date.now(), role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    // Simulate RAG AI Answer Generation
    setTimeout(() => {
      let botResponse = "";
      let sourcesList = [];

      if (query.toLowerCase().includes('pump') || query.toLowerCase().includes('p-102')) {
        botResponse = "According to Section 4.2 of the **Hydraulic Pump P-102 Manual**, the rated operating pressure is **120 PSI (8.27 bar)**. Operating above 135 PSI will trigger thermal shutoff alerts. Replace fluid seals every 6 months to maintain pressure efficiency.";
        sourcesList = [
          { title: 'Hydraulic Pump P-102 Operating Manual.pdf', page: 'Page 14' },
          { title: 'Mechanical Safety Standards.pdf', page: 'Page 3' }
        ];
      } else if (query.toLowerCase().includes('iso') || query.toLowerCase().includes('safety')) {
        botResponse = "Per **ISO 9001:2015 Safety SOP Standard**, daily visual inspections of safety interlocks and emergency stop buttons are mandatory before shift handovers. Calibration logs must be submitted weekly.";
        sourcesList = [
          { title: 'ISO 9001:2015 Safety SOP Standard.docx', page: 'Section 2.1' }
        ];
      } else {
        botResponse = `Based on your vectorized industrial knowledge graph, here is the operational guidance for: "${query}". All parameters align with standard factory threshold limits. Check maintenance logs for further details.`;
        sourcesList = [
          { title: 'FactoryIQ Master Operations Log.pdf', page: 'Page 1' }
        ];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: botResponse,
          confidence: 96,
          sources: sourcesList
        }
      ]);
      setLoading(false);
    }, 1200);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-full flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-blue-500" />
            AI RAG Knowledge Agent
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-xs">
            Query industrial manuals, SOPs, and equipment logs with vector-grounded accuracy.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Grounding Verified (100% Source Citations)
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden relative">
        
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "")}>
              
              {/* Avatar */}
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-sm",
                msg.role === 'user' 
                  ? "bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                  : "bg-blue-600 border-blue-500 text-white shadow-blue-600/20"
              )}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div className={cn(
                "flex flex-col max-w-[85%] sm:max-w-[75%]",
                msg.role === 'user' ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "px-4 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                  msg.role === 'user' 
                    ? "bg-blue-600 text-white rounded-tr-none font-medium" 
                    : "bg-slate-50 border border-slate-200/80 text-slate-800 dark:bg-slate-800/80 dark:border-slate-700/80 dark:text-slate-100 rounded-tl-none"
                )}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {/* Assistant Metadata & Sources */}
                {msg.role === 'assistant' && (
                  <div className="mt-3 space-y-2 w-full">
                    {msg.confidence && (
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                          {msg.confidence}% RAG Confidence
                        </span>
                        <button 
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="hover:text-slate-200 transition-colors flex items-center gap-1"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copiedId === msg.id ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    )}

                    {/* Citation Sources Cards */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="pt-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                          <CornerDownRight className="w-3 h-3 text-blue-500" />
                          Verified Document Sources
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {msg.sources.map((src, idx) => (
                            <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300">
                              <FileText className="w-3.5 h-3.5 text-blue-500" />
                              <span className="font-semibold">{src.title}</span>
                              <span className="text-[10px] text-slate-400">({src.page})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>
          ))}

          {/* Typing Loading Indicator */}
          {loading && (
            <div className="flex gap-4 items-center">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-400 mr-2">Querying Vector Index</span>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Bar */}
        {messages.length < 3 && (
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 overflow-x-auto flex items-center gap-2">
            <span className="text-[10px] uppercase font-extrabold text-slate-400 shrink-0">Prompts:</span>
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-300 transition-colors whitespace-nowrap shrink-0"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask any technical, SOP, or equipment question..." 
              className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || loading}
              className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl disabled:opacity-50 transition-all shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
