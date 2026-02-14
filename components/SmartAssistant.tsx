
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, Send, X, MessageSquare, ExternalLink } from 'lucide-react';
import { getDealInsight } from '../services/geminiService';
import { Deal } from '../types';

interface SmartAssistantProps {
  availableDeals: Deal[];
}

const SmartAssistant: React.FC<SmartAssistantProps> = ({ availableDeals }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [response, loading]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    const result = await getDealInsight(input, availableDeals);
    setResponse(result);
    setLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group flex items-center gap-2 border-4 border-white"
      >
        <Sparkles size={24} className="group-hover:animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-[100px] transition-all duration-500 whitespace-nowrap font-bold text-sm">AI Deal Genie</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-end p-4 pointer-events-none sm:p-6 md:p-10">
          <div className="bg-white w-full max-w-md h-[500px] rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] pointer-events-auto flex flex-col overflow-hidden border border-gray-100 ring-1 ring-black/5 animate-in slide-in-from-bottom-10 duration-300">
            {/* Header */}
            <div className="bg-indigo-600 p-5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="font-black text-lg">Deal Genie</h3>
                  <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-widest">AI Shopping Advisor</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/50">
              <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-700 border border-slate-100 leading-relaxed">
                Hi! I'm your Smart Deal Genie. 👋 <br/><br/> Tell me what you're looking for (e.g., "Best cheap iPhone" or "Men's sneakers under 2000") and I'll find the best loots for you!
              </div>

              {response && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                   <div className="bg-indigo-50 p-5 rounded-2xl rounded-tl-none border border-indigo-100 space-y-3 shadow-sm">
                    <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-wider">
                      <Sparkles size={14} className="fill-indigo-600" />
                      Genie's Recommendation
                    </div>
                    <p className="text-sm text-slate-800 leading-relaxed font-medium">
                      {response.recommendation}
                    </p>
                  </div>

                  <div className="grid gap-2">
                    {response.topDeals?.map((dealName: string, idx: number) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between hover:border-indigo-300 transition-colors group">
                        <span className="text-xs font-bold text-slate-600 line-clamp-1">{dealName}</span>
                        <ExternalLink size={12} className="text-slate-400 group-hover:text-indigo-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex items-center gap-3 text-indigo-500 text-xs font-black animate-pulse bg-indigo-50 w-fit p-3 rounded-2xl">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  Analyzing live marketplace...
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleAsk} className="p-4 border-t border-gray-100 bg-white flex gap-3 shrink-0">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Genie: 'Find Nike shoes'..."
                className="flex-1 bg-slate-100 border-none rounded-2xl px-5 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
              />
              <button 
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-indigo-600 text-white p-3 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-90 disabled:opacity-40 disabled:shadow-none"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SmartAssistant;
