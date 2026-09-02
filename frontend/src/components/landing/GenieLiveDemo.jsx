import React, { useState } from 'react';
import { Send, Terminal } from 'lucide-react';
import SqlReveal from '../shared/SqlReveal';
import QueryDataReveal from '../shared/QueryDataReveal';
import { useGenie } from '../../hooks/useGenie';
import LoadingBubble from '../shared/LoadingBubble';

const PRELOADED_MESSAGES = [
  { role: 'user', content: 'Show me empty labs in Block C' },
  { 
    role: 'genie', 
    content: 'Currently, the AI Lab and Hardware Lab in Block C are completely empty (0% occupancy).',
    sql: "SELECT name, type, capacity FROM campus_rooms WHERE building = 'Block C' AND type = 'Lab' AND room_id IN (SELECT room_id FROM campus_utility_usage WHERE occupancy_pct = 0 AND date = CURRENT_DATE())",
    sql_description: "Checking room capacity vs current live occupancy"
  }
];

export default function GenieLiveDemo() {
  const { messages, isLoading, sendMessage } = useGenie();
  const [inputValue, setInputValue] = useState('');

  const displayMessages = messages.length > 0 ? messages : PRELOADED_MESSAGES;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div id="genie-demo" className="py-24 px-6 flex flex-col items-center relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFFFFF] opacity-[0.03] blur-[100px] rounded-full pointer-events-none"></div>

      <div className="text-center mb-12">
        <h2 className="font-heading font-bold text-4xl md:text-5xl text-[#F0F4FF]">Live Terminal</h2>
        <p className="mt-4 text-base font-medium text-[rgba(240,244,255,0.45)]">Connected to Databricks Genie Space</p>
      </div>

      <div className="w-full max-w-4xl bg-[rgba(15,20,32,0.6)] border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden">
        {/* Terminal Header */}
        <div className="border-b border-[rgba(255,255,255,0.08)] p-4 flex items-center justify-between bg-[rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-2 text-[rgba(240,244,255,0.7)] text-sm font-medium">
            <Terminal size={16} className="text-[#FFFFFF]" />
            <span>CampusVitals Terminal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#FFFFFF] rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
            <span className="text-[#FFFFFF] text-xs font-medium">Live</span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="p-6 flex-1 min-h-[350px] max-h-[500px] overflow-y-auto flex flex-col gap-6">
          {displayMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`
                max-w-[85%] p-4 text-sm
                ${msg.role === 'user' 
                  ? 'bg-gradient-to-r from-[#FFFFFF]/20 to-[#FFFFFF]/5 border border-[#FFFFFF]/30 text-[#FFFFFF] rounded-2xl rounded-br-md' 
                  : 'bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] text-[#F0F4FF] rounded-2xl rounded-bl-md'
                }
              `}>
                {msg.role === 'genie' && (
                  <div className="text-[#FFFFFF] font-semibold text-xs mb-2 flex items-center gap-2">
                    ✦ Genie Response
                  </div>
                )}
                <div className="leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                {msg.sql && (
                  <div className="flex flex-col gap-2 mt-4 border-t border-[rgba(255,255,255,0.08)] pt-4">
                    <SqlReveal sql={msg.sql} description={msg.sql_description} />
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
               <LoadingBubble />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.2)]">
          <form onSubmit={handleSend} className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Genie anything..."
              className="flex-1 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl p-3 text-[#F0F4FF] text-sm focus:outline-none focus:border-[#FFFFFF]/50 transition-colors placeholder:text-[rgba(240,244,255,0.3)]"
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-[#FFFFFF] text-[#000000] rounded-xl px-5 flex items-center justify-center hover:bg-[#FFFFFF]/90 transition-colors disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
