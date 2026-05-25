import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, User, ChevronUp } from "lucide-react";
import { ChatMessage } from "../types";

interface RamarajuChatProps {
  embedMode?: boolean;
}

export default function RamarajuChat({ embedMode = false }: RamarajuChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "greet-1",
          role: "model",
          content: "Ayyoo! Asalu katha emiti babji! Welcome to Andhra Cafe. I am Ramaraju, your master brewer. I have been roasting and brewing premium filter coffee in Araku Valley for four decades. Need to know the secrets of our brass slow-drip extraction, chicory ratios, or which spicy podi matches your morning cup? Let's chat, nanna!",
          timestamp: new Date()
        }
      ]);
    }
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputVal.trim(),
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setLoading(true);

    try {
      // Map chat messages to role/content pairs the server expects
      const payloadMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages })
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "model",
          content: data.content || "Ayyoo, my brass filter is running dry! Ask me again, babji.",
          timestamp: new Date()
        }
      ]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: "model",
          content: "Ayyoo! It seems my old stove is sputtering slightly. Let me get my filter brewing and ask me in a jiffy!",
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (embedMode) {
    return (
      <div className="w-full h-full bg-white flex flex-col justify-between overflow-hidden font-sans">
        {/* Header banner */}
        <div className="bg-gradient-to-r from-brand-coffee to-brand-mahogany text-brand-cream px-4 py-3 flex items-center justify-between border-b border-brand-mahogany/30 flex-none">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-mahogany border-2 border-brand-stone flex items-center justify-center font-serif text-sm font-bold select-none text-brand-cream shadow-inner">
              RR
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-bold font-serif tracking-tight text-brand-cream leading-tight">
                  Ramaraju (Master Barista)
                </h4>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <span className="text-[9px] font-mono text-brand-stone opacity-95 uppercase tracking-wider block leading-none font-bold">
                40 Yrs Organic Shade Harvesting
              </span>
            </div>
          </div>
        </div>

        {/* Message Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-brand-cream/35"
        >
          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div
                key={m.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"} items-start gap-2`}
              >
                {!isUser && (
                  <div className="w-6.5 h-6.5 rounded-full bg-brand-mahogany border border-brand-coffee text-[9px] font-bold text-brand-cream flex items-center justify-center flex-none mt-0.5">
                    R
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed shadow-xs ${
                    isUser
                      ? "bg-brand-mahogany text-brand-cream rounded-tr-none font-medium"
                      : "bg-white text-brand-coffee border border-brand-beige rounded-tl-none font-text"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  <span className={`block text-[8px] mt-0.5 text-right italic ${isUser ? "text-brand-stone/80" : "text-brand-taupe"}`}>
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start items-center gap-2">
              <div className="w-6.5 h-6.5 rounded-full bg-brand-mahogany border border-brand-coffee text-[9px] font-bold text-brand-cream flex items-center justify-center flex-none">
                R
              </div>
              <div className="bg-white rounded-xl rounded-tl-none px-3 py-2 border border-brand-beige shadow-xs">
                <div className="flex space-x-1">
                  <span className="w-1 h-1 bg-brand-mahogany rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1 h-1 bg-brand-mahogany rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1 h-1 bg-brand-mahogany rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Helper Prompts */}
        {messages.length === 1 && !loading && (
          <div className="px-3 py-1.5 bg-brand-cream border-t border-brand-beige flex gap-1.5 overflow-x-auto text-[10px] whitespace-nowrap scrollbar-none flex-none">
            <button
              type="button"
              onClick={() => setInputVal("Explain how the brass filter works?")}
              className="bg-white hover:bg-brand-cream hover:text-brand-mahogany text-brand-coffee px-2 py-0.5 rounded border border-brand-beige cursor-pointer transition-colors"
            >
              Filter Secrets
            </button>
            <button
              type="button"
              onClick={() => setInputVal("What is MLA Pesarattu?")}
              className="bg-[#FAF8F5] hover:bg-brand-cream hover:text-brand-mahogany text-brand-coffee px-2 py-0.5 rounded border border-brand-beige cursor-pointer transition-colors"
            >
              MLA Pesarattu
            </button>
            <button
              type="button"
              onClick={() => setInputVal("How organic are the Araku beans?")}
              className="bg-[#FAF8F5] hover:bg-brand-cream hover:text-brand-mahogany text-brand-coffee px-2 py-0.5 rounded border border-brand-beige cursor-pointer transition-colors"
            >
              Araku Farms
            </button>
          </div>
        )}

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="p-2 border-t border-brand-beige flex gap-1.5 items-center bg-white flex-none"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask Ramaraju about coffee..."
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-brand-beige bg-brand-cream/25 text-brand-coffee focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-mahogany"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || loading}
            className="p-2 rounded-lg bg-brand-mahogany text-brand-cream hover:bg-brand-saddle disabled:opacity-50 disabled:hover:bg-brand-mahogany transition-all cursor-pointer flex-none"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="chat-trigger-btn"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-brand-mahogany text-brand-cream hover:bg-brand-saddle transition-all rounded-full shadow-2xl border border-brand-mahogany cursor-pointer group"
          >
            <div className="relative">
              <MessageCircle className="w-5 h-5 text-brand-stone group-hover:rotate-12 transition-transform" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-brand-stone rounded-full animate-ping" />
            </div>
            <span className="text-xs font-mono font-bold tracking-wider uppercase">
              Talk to Ramaraju
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="w-[360px] md:w-[410px] h-[520px] bg-white rounded-2xl border border-brand-beige shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Header banner */}
            <div className="bg-gradient-to-r from-brand-coffee to-brand-mahogany text-brand-cream px-4.5 py-4 flex items-center justify-between border-b border-brand-mahogany/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-mahogany border-2 border-brand-stone flex items-center justify-center font-serif text-lg font-bold select-none text-brand-cream shadow-inner">
                  RR
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold font-serif tracking-tight text-brand-cream">
                      Ramaraju (Barista)
                    </h4>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  </div>
                  <span className="text-[11px] font-mono text-brand-stone opacity-90 uppercase tracking-widest block leading-none font-semibold">
                    Master Brewer • 40 Yrs Exp
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-brand-stone hover:text-brand-cream p-1.5 rounded-full hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-brand-cream/30"
            >
              {messages.map((m) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={m.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"} items-start gap-2.5`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-full bg-brand-mahogany border border-brand-coffee text-[10px] font-bold text-brand-cream flex items-center justify-center flex-none mt-1">
                        R
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-xs ${
                        isUser
                          ? "bg-brand-mahogany text-brand-cream rounded-tr-none font-medium"
                          : "bg-white text-brand-coffee border border-brand-beige rounded-tl-none font-text"
                      }`}
                    >
                      <p>{m.content}</p>
                      <span className={`block text-[9px] mt-1 text-right italic ${isUser ? "text-brand-stone/80" : "text-brand-taupe"}`}>
                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex justify-start items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand-mahogany border border-brand-coffee text-[10px] font-bold text-brand-cream flex items-center justify-center flex-none">
                    R
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 border border-brand-beige shadow-xs">
                    <div className="flex space-x-1.5">
                      <span className="w-1.5 h-1.5 bg-brand-mahogany rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-brand-mahogany rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-brand-mahogany rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Helper Prompts */}
            {messages.length === 1 && !loading && (
              <div className="px-4 py-2 bg-brand-cream border-t border-brand-beige flex gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap scrollbar-none">
                <button
                  onClick={() => setInputVal("Explain how the brass filter works?")}
                  className="bg-white hover:bg-brand-cream hover:text-brand-mahogany text-brand-coffee px-2.5 py-1 rounded-lg border border-brand-beige cursor-pointer transition-colors"
                >
                  Brass Filter Secrets
                </button>
                <button
                  onClick={() => setInputVal("What is MLA Pesarattu?")}
                  className="bg-white hover:bg-[#FAF8F5] hover:text-brand-mahogany text-brand-coffee px-2.5 py-1 rounded-lg border border-brand-beige cursor-pointer transition-colors"
                >
                  MLA Pesarattu Upma
                </button>
                <button
                  onClick={() => setInputVal("How are Araku coffee beans harvested?")}
                  className="bg-white hover:bg-[#FAF8F5] hover:text-brand-mahogany text-brand-coffee px-2.5 py-1 rounded-lg border border-brand-beige cursor-pointer transition-colors"
                >
                  Araku Valley Harvesting
                </button>
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-brand-beige flex gap-2 items-center bg-white"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask Ramaraju about coffee lore..."
                className="flex-1 text-sm px-3.5 py-2.5 rounded-xl border border-brand-beige bg-brand-cream/25 text-brand-coffee focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-mahogany"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || loading}
                className="p-2.5 rounded-xl bg-brand-mahogany text-brand-cream hover:bg-brand-saddle disabled:opacity-50 disabled:hover:bg-brand-mahogany transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
