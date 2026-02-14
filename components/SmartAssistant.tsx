
import React, { useState } from 'react';
import { Bot, Sparkles, Send, X, MessageSquare } from 'lucide-react';
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
        className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group flex items-center gap-2"
      >
        <Sparkles size={24} className="group-hover:animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-[100px] transition-all duration-500 whitespace-nowrap font-bold text-sm">AI Assistant</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-end p-4 pointer-events-none">
          <div className="bg-white w-full max-w-md h-[500px] rounded-2xl shadow-2xl pointer-events-auto flex flex-col overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="bg-indigo-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold">Deal Genie</h3>
                  <p className="text-[10px] text-indigo-100">AI-Powered Shop Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-700 border border-gray-100">
                Hi! I'm your Smart Deal Genie. What are you looking to buy today? I'll find you the best loot deals from Amazon, Flipkart, and more!
              </div>

              {response && (
                <div className="bg-indigo-50 p-4 rounded-2xl rounded-tl-none border border-indigo-100 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase">
                    <Sparkles size={14} />
                    Gemini Insight
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {response.recommendation}
                  </p>
                </div>
              )}

              {loading && (
                <div className="flex items-center gap-2 text-gray-400 text-xs font-medium animate-pulse">
                  <Bot size={14} className="animate-bounce" />
                  Analyzing market deals...
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleAsk} className="p-4 border-t border-gray-100 bg-white flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Find me a cheap iPhone or Nike shoes..."
                className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button 
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SmartAssistant;
