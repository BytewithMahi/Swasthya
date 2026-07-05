'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User, Sparkles, AlertCircle, PlusCircle, CheckCircle } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  chartType?: 'beds' | 'meds';
}

const promptOptions = [
  { text: 'Forecast pediatric bed occupancy for next week', id: 'beds' },
  { text: 'Identify critical supply stock bottlenecks', id: 'meds' },
];

export default function Copilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "Hello! I am the Swasthya Healthcare Copilot. I analyze real-time patient queues, bed availability, and vaccine ledger records. Ask me to forecast occupancy, verify dispatch logs, or check logistics bottlenecks.",
    },
  ]);
  const [typingPrompt, setTypingPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activePromptId, setActivePromptId] = useState<string | null>(null);

  const triggerPrompt = (text: string, id: string) => {
    if (isTyping) return;
    setActivePromptId(id);
    setIsTyping(true);

    // Dynamic character typing mimic
    let charIndex = 0;
    const interval = setInterval(() => {
      setTypingPrompt((prev) => prev + text.charAt(charIndex));
      charIndex++;
      if (charIndex >= text.length) {
        clearInterval(interval);
        
        // Append user message
        setTimeout(() => {
          const userMsg: Message = { id: `u-${Date.now()}`, sender: 'user', text };
          setMessages((prev) => [...prev, userMsg]);
          setTypingPrompt('');
          
          // Trigger AI response trigger
          triggerAiResponse(id);
        }, 300);
      }
    }, 20);
  };

  const triggerAiResponse = (id: string) => {
    setIsTyping(true);
    // Mimic processing timer
    setTimeout(() => {
      let aiText = '';
      let chartType: 'beds' | 'meds' | undefined;

      if (id === 'beds') {
        aiText = "Based on local pediatric clinic trends and humidity indices, pediatric occupancy at Central CHC is projected to rise to 92% by next Thursday (July 9th). I recommend shifting 5 beds from Sub-Center East Coast, which currently operates at 30% load.";
        chartType = 'beds';
      } else {
        aiText = "Active blockchain audit check completed. Vaccine Supply Block #148 shows low inventory at PHC Sector 4 (12% capacity). However, dispatch ID #428F has been logged for transit, containing 150 vials, arriving in 4 hours.";
        chartType = 'meds';
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        chartType
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      setActivePromptId(null);
    }, 1500);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-dot-pattern">
      <div className="absolute top-[40%] right-[10%] w-[350px] h-[350px] rounded-full bg-primary/3 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Description */}
          <div className="lg:col-span-5 text-left flex flex-col items-start">
            <span className="px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs tracking-wider uppercase mb-4 inline-block">
              AI Copilot
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-txt-main tracking-tight leading-tight mt-2 mb-6">
              Ask Anything, Optimize Instantly
            </h2>
            <p className="text-lg text-txt-muted mb-8 leading-relaxed">
              Query our district health system using simple natural language. Draft medicine routing pathways, allocate beds, and check ledger blocks in seconds.
            </p>
            
            <div className="flex flex-col gap-4 w-full">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-txt-main">Predictive Dispatching</h4>
                  <p className="text-xs text-txt-muted mt-1 leading-relaxed">Let AI calculate logistic paths before stock reaches critical safety buffers.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                  <Bot className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-txt-main">Automated Routing Advice</h4>
                  <p className="text-xs text-txt-muted mt-1 leading-relaxed">Instantly balance patient flow and bed counts across remote health centers.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Chat Box Mockup */}
          <div className="lg:col-span-7 flex flex-col w-full h-[540px] clay-card p-5 md:p-6 border border-white relative overflow-hidden bg-white/70">
            
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4 select-none">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 clay-card-primary">
                <Bot className="w-5.5 h-5.5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-txt-main flex items-center gap-1.5">
                  Swasthya AI Copilot <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                </h3>
                <span className="text-[10px] text-txt-muted font-bold block uppercase tracking-wider">Natural Language Core</span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4 mb-4 pr-1">
              {messages.map((msg) => {
                const isAI = msg.sender === 'ai';
                return (
                  <div key={msg.id} className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}>
                    {isAI && (
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Bot className="w-4.5 h-4.5" />
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-2 max-w-[80%]">
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        isAI 
                          ? 'bg-slate-50 border border-slate-100 text-txt-main rounded-tl-xs' 
                          : 'bg-primary text-white font-medium rounded-tr-xs shadow-md shadow-primary/10 clay-card-primary'
                      }`}>
                        {msg.text}
                      </div>

                      {/* Diagnostic chart responses inside chat */}
                      {msg.chartType === 'beds' && (
                        <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-xs flex flex-col gap-2">
                          <span className="text-[9px] font-bold text-txt-muted uppercase tracking-wider">PROJECTED BED DEMAND (CHC)</span>
                          <div className="flex justify-between items-end h-16 pt-3">
                            <div className="w-[12%] bg-primary/20 rounded-t-xs h-[45%] text-[8px] font-bold text-center text-txt-muted pt-1">MON</div>
                            <div className="w-[12%] bg-primary/30 rounded-t-xs h-[55%] text-[8px] font-bold text-center text-txt-muted pt-1">TUE</div>
                            <div className="w-[12%] bg-primary/45 rounded-t-xs h-[70%] text-[8px] font-bold text-center text-txt-muted pt-1">WED</div>
                            <div className="w-[12%] bg-red-500 rounded-t-xs h-[92%] text-[8px] font-bold text-center text-white pt-1">THU</div>
                            <div className="w-[12%] bg-primary/60 rounded-t-xs h-[75%] text-[8px] font-bold text-center text-txt-muted pt-1">FRI</div>
                          </div>
                        </div>
                      )}

                      {msg.chartType === 'meds' && (
                        <div className="p-3.5 rounded-xl bg-white border border-slate-100 shadow-xs flex flex-col gap-2.5">
                          <span className="text-[9px] font-bold text-txt-muted uppercase tracking-wider">BLOCK AUDIT LOG #148</span>
                          
                          <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                              <span className="font-bold text-txt-main">PHC 4 Safety Buffer Low</span>
                            </div>
                            <span className="text-[9px] font-bold text-red-500">12% STOCK</span>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-accent" />
                              <span className="font-bold text-txt-main">Dispatch #428F Enroute</span>
                            </div>
                            <span className="text-[9px] font-bold text-accent">+150 VIALS</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {!isAI && (
                      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shrink-0 font-bold text-xs clay-card-primary">
                        U
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && activePromptId && typingPrompt === '' && (
                <div className="flex gap-3 justify-start items-center">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Bot className="w-4.5 h-4.5 animate-pulse" />
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-xs flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Prompt suggestions / User Input Box */}
            <div className="flex flex-col gap-3 select-none">
              
              {/* Query selection chips */}
              {messages.length < 3 && !isTyping && (
                <div className="flex flex-wrap gap-2">
                  {promptOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => triggerPrompt(opt.text, opt.id)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200/60 text-xs font-bold text-txt-muted hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer text-left"
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input row */}
              <div className="relative border border-slate-200/80 rounded-2xl bg-slate-50/50 p-1 flex items-center justify-between">
                <input
                  type="text"
                  readOnly
                  placeholder={isTyping && typingPrompt ? typingPrompt : "Ask AI Copilot for help..."}
                  className="flex-1 bg-transparent px-3 text-xs md:text-sm text-txt-main placeholder-txt-muted focus:outline-hidden"
                />
                <button className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white clay-card-primary shrink-0 hover:scale-102 cursor-pointer">
                  <Send className="w-4.5 h-4.5 text-white" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
