import { useState } from 'react';
import { MessageSquareText, Send, Sparkles, Bot, User, CornerDownRight, CheckCircle2, ShieldCheck, Wrench, Files, Building2 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import api from '../lib/api';

export default function RoleChatPage() {
  const { user } = useAuthStore();
  const role = user?.role || 'ENGINEER';

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello ${user?.name || 'User'}! I am your FactoryIQ ${role} AI Assistant. Ask me anything regarding your ${role.toLowerCase()} operations, technical documents, or plant procedures.`,
      sources: []
    }
  ]);

  // Suggested Prompts based on Role
  const roleSuggestions = {
    ADMIN: [
      'Show system health & user activity summary',
      'What are the pending AI processing jobs?',
      'Which department has the highest equipment failure risk?'
    ],
    ENGINEER: [
      'What are the torque specifications for Conveyor Belt A-10?',
      'How to inspect hydraulic pump pressure seals?',
      'Summarize safety findings for Assembly Line A'
    ],
    MAINTENANCE_TEAM: [
      'What is the failure risk score for Hydraulic Pump P-102?',
      'Give me step-by-step seal replacement instructions for Pump P-102',
      'Show repair history for Heat Exchanger TX-90'
    ],
    AUDITOR: [
      'Is ISO 9001:2015 Clause 4.2 documentation compliant?',
      'What safety certificates are currently expired in the plant?',
      'List all major non-compliance violations for Q2'
    ]
  };

  const currentSuggestions = roleSuggestions[role] || roleSuggestions.ENGINEER;

  const handleSend = async (queryText) => {
    const text = queryText || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await api.post('/chat', { message: text });
      const aiResponse = res.data.data;

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: aiResponse.answer,
        sources: aiResponse.sources || []
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: `[${role} AI Assistant]: Processing completed with standard plant knowledge fallback: Please ensure document indexes are active.`,
        sources: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] sm:h-[calc(100vh-8rem)] flex flex-col bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      
      {/* Role Chat Header */}
      <div className="p-3 sm:p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="p-2.5 sm:p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl text-white shadow-lg shadow-blue-500/20 shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">FactoryIQ {role} AI</h2>
              <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-md shrink-0">
                RAG Engine
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 truncate">Tailored query responses for {role} persona</p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6">
        {messages.map((m, idx) => (
          <div 
            key={idx}
            className={`flex gap-2.5 sm:gap-4 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            )}

            <div className={`max-w-[85%] sm:max-w-2xl rounded-2xl p-3 sm:p-4 text-xs leading-relaxed ${
              m.sender === 'user'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
            }`}>
              <p className="whitespace-pre-line font-sans text-xs">{m.text}</p>

              {/* Citations / Sources if present */}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Cited Sources:</span>
                  {m.sources.map((s, i) => (
                    <div key={i} className="flex items-center gap-1 text-[11px] text-blue-500 font-medium">
                      <CornerDownRight className="w-3 h-3" />
                      <span>{s.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center text-xs text-slate-400">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
            </div>
            <span>Analyzing indexed industrial chunks for {role}...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Query Pills */}
      <div className="px-3 sm:px-6 py-2 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Quick Queries:</span>
        {currentSuggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            className="px-2.5 sm:px-3 py-1 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] sm:text-[11px] font-medium rounded-full shrink-0 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-2.5 sm:p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 sm:gap-3">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Ask ${role} AI Assistant...`}
          className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !inputMessage.trim()}
          className="px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/30 disabled:opacity-50 flex items-center gap-1.5 shrink-0"
        >
          <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Send</span>
        </button>
      </form>

    </div>
  );
}
