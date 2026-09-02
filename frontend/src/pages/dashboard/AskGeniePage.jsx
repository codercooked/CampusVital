import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Send, RotateCcw } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import LoadingBubble from '../../components/shared/LoadingBubble';
import SqlReveal from '../../components/shared/SqlReveal';
import QueryDataReveal from '../../components/shared/QueryDataReveal';
import { useGenie } from '../../hooks/useGenie';

const AskGeniePage = () => {
  const { messages, isLoading, sendMessage, resetConversation } = useGenie();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  const handleChipClick = (prompt) => {
    sendMessage(prompt);
  };

  const initialPrompts = [
    "Will there be a room for 80 students next Friday from 3-5 PM?",
    "Which rooms are free right now?",
    "Show this week's busiest periods",
    "Rooms underutilised this week",
    "Generate end-of-month summary",
    "Flag resource anomalies"
  ];

  const userMessages = messages.filter(m => m.role === 'user');
  const sqlMessages = messages.filter(m => m.sql);

  // Premium Predictive UI Component
  const PredictiveInsightCard = () => (
    <div className="mt-4 bg-[#0A0D16] border border-orange-500/30 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(249,115,22,0.1)]">
      <div className="bg-[#FFFFFF]/5 px-4 py-2 border-b border-orange-500/20 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316] animate-pulse"></div>
        <span className="text-xs font-bold text-white uppercase tracking-widest">Mosaic AI Predictive Model</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] text-white/50 border border-white/10 px-2 py-0.5 rounded-md">MLflow: campus_avail_v2</span>
          <span className="text-[10px] text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">Confidence: 94%</span>
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-widest text-[#FFFFFF]/50 font-bold">Current Status</span>
          <span className="text-sm text-red-400 font-medium">0 Rooms officially available for 80+ capacity.</span>
        </div>
        
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#FFFFFF]/10 to-transparent"></div>
        
        <div className="flex gap-4">
          <div className="w-1.5 rounded-full bg-gradient-to-b from-orange-400 to-[#888888]"></div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-orange-400 font-bold">High Probability Opening</span>
            <h3 className="text-lg font-heading font-bold text-[#FFFFFF] mt-1 mb-2">Room B203 <span className="text-sm font-normal text-[#FFFFFF]/50">(Capacity: 120)</span></h3>
            <p className="text-sm text-[rgba(240,244,255,0.7)] leading-relaxed">
              Based on historical Delta Lake logs, a recurring <strong>Friday 3:00 PM - 5:00 PM</strong> lecture (CS-401) scheduled here has been <span className="text-[#FFFFFF] border-b border-[#FFFFFF]/30">cancelled 4 out of the last 6 Fridays</span>.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <button className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                Auto-Book if Cancelled
              </button>
              <button className="border border-[#FFFFFF]/20 text-[#FFFFFF] text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#FFFFFF]/5 transition-colors">
                View Delta Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
      {/* Left Chat Area */}
      <GlassCard className="col-span-8 rounded-2xl flex flex-col h-full overflow-hidden relative">
        <div className="p-5 border-b border-[rgba(255,255,255,0.08)] flex items-center gap-3 bg-black/40 backdrop-blur-md z-10">
          <Sparkles className="w-6 h-6 text-orange-500" />
          <h2 className="font-heading text-xl font-semibold">Databricks Genie</h2>
          <span className="text-xs text-[rgba(240,244,255,0.45)] ml-auto border border-orange-500/20 bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></div>
            Powered by Mosaic AI
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 scroll-smooth relative z-0">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
                {initialPrompts.map((prompt, i) => (
                  <div
                    key={i}
                    onClick={() => handleChipClick(prompt)}
                    className="bg-black/40 border border-white/10 rounded-xl p-4 cursor-pointer hover:border-white/40 transition-all text-sm text-[rgba(240,244,255,0.6)] hover:text-white shadow-inner"
                  >
                    {prompt}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 flex flex-col">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`
                    max-w-[85%] px-5 py-4 text-sm shadow-xl
                    ${msg.role === 'user' 
                      ? 'bg-white/10 text-white rounded-2xl rounded-br-md border border-white/10 backdrop-blur-md' 
                      : 'border border-orange-500/20 bg-black/80 rounded-2xl rounded-bl-md backdrop-blur-md'
                    }
                  `}>
                    <div className="whitespace-pre-wrap leading-relaxed text-white prose prose-invert max-w-none prose-sm prose-p:my-2 prose-headings:my-3">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                    
                    {/* Render Predictive Insight if flagged */}
                    {msg.isPredictive && <PredictiveInsightCard />}

                    {/* Standard SQL Reveal */}
                    {msg.sql && (
                      <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
                        <SqlReveal sql={msg.sql} description="Databricks SQL Serverless Execution" />
                        {msg.attachment_id && (
                          <QueryDataReveal convId={msg.conversation_id} msgId={msg.message_id} attachId={msg.attachment_id} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="border border-orange-500/20 bg-black/80 rounded-2xl rounded-bl-md px-5 py-4 max-w-[80%] backdrop-blur-md shadow-xl">
                    <LoadingBubble />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[rgba(255,255,255,0.08)] bg-black/40 backdrop-blur-md">
          <form onSubmit={handleSend} className="flex items-center gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Genie anything about your campus..."
              className="flex-1 bg-[#0F1420] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-[#F0F4FF] placeholder:text-[rgba(240,244,255,0.3)] text-sm outline-none focus:border-orange-500/50 transition-colors shadow-inner"
            />
            <button
              type="button"
              onClick={resetConversation}
              className="text-[rgba(240,244,255,0.45)] text-xs hover:text-[#F0F4FF] px-3 flex flex-col items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>New</span>
            </button>
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-orange-500 text-white p-3 rounded-xl disabled:opacity-50 transition-all hover:bg-orange-600 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </GlassCard>

      {/* Right Sidebar Area */}
      <GlassCard className="col-span-4 rounded-2xl p-5 h-full overflow-y-auto space-y-6 bg-black/40 backdrop-blur-md">
        <div>
          <h3 className="text-sm font-heading font-semibold text-[#F0F4FF] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-500" /> Databricks Ecosystem
          </h3>
          <div className="mt-4 flex flex-col gap-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[rgba(240,244,255,0.45)]">Databricks SQL</span>
              <span className="text-[#FFFFFF] bg-white/5 border border-white/10 px-2 py-0.5 rounded">Serverless</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[rgba(240,244,255,0.45)]">Governance</span>
              <span className="text-[#FFFFFF] bg-white/5 border border-white/10 px-2 py-0.5 rounded">Unity Catalog</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[rgba(240,244,255,0.45)]">Vector Search</span>
              <span className="text-green-400 flex items-center gap-1.5 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse"></span>
                Active
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[rgba(240,244,255,0.45)]">Genie Space</span>
              <span className="font-mono text-[#F0F4FF] bg-white/5 px-2 py-0.5 rounded border border-white/10">01ef8a2c...</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.08)] pt-6">
          <h3 className="text-sm font-heading font-semibold text-[#F0F4FF] mb-3">Live Campus Snapshot</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[rgba(240,244,255,0.45)]">Rooms on campus</span>
              <span>47</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[rgba(240,244,255,0.45)]">Free right now</span>
              <span className="text-[#FFFFFF]">23</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[rgba(240,244,255,0.45)]">Bookings today</span>
              <span>12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[rgba(240,244,255,0.45)]">Pending approvals</span>
              <span className="text-orange-400">3</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.08)] pt-6">
          <h3 className="text-sm font-heading font-semibold text-[#F0F4FF] mb-3">Recent Queries</h3>
          <div className="space-y-2">
            {userMessages.length === 0 ? (
              <div className="text-xs text-[rgba(240,244,255,0.45)]">No queries yet</div>
            ) : (
              userMessages.slice(-5).map((msg, i) => (
                <div key={i} className="text-xs bg-[#0F1420] border border-[rgba(255,255,255,0.04)] rounded-lg px-3 py-2 text-[rgba(240,244,255,0.45)] truncate cursor-pointer hover:bg-white/[0.02]" onClick={() => setInputValue(msg.content)}>
                  {msg.content}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.08)] pt-6">
          <h3 className="text-sm font-heading font-semibold text-[#F0F4FF] mb-3">SQL History</h3>
          <div className="space-y-2">
            {sqlMessages.length === 0 ? (
              <div className="text-xs text-[rgba(240,244,255,0.45)]">No SQL generated yet</div>
            ) : (
              sqlMessages.slice(-3).map((msg, i) => (
                <details key={i} className="group bg-[#000000]/50 border border-[rgba(255,255,255,0.04)] rounded-lg">
                  <summary className="text-xs text-[#FFFFFF] p-3 cursor-pointer font-mono truncate select-none list-none group-open:border-b group-open:border-[rgba(255,255,255,0.04)]">
                    <span className="opacity-50 mr-2">▶</span>
                    {msg.sql.split('\n')[0].substring(0, 30)}...
                  </summary>
                  <pre className="p-3 text-[10px] text-[rgba(240,244,255,0.7)] font-mono overflow-x-auto whitespace-pre-wrap break-all">
                    {msg.sql}
                  </pre>
                </details>
              ))
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default AskGeniePage;
