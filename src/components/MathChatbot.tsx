"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  User,
  Send,
  Sparkles,
  RotateCcw,
  Key,
  HelpCircle,
  MessageSquare,
  Loader2,
  Check,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function MathChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "안녕하세요! 🎓 **아궁진영 AI 수학 선생님**입니다. 일차방정식, 일차식의 계산, 소수 등 수학에 대해 궁금한 점이 있다면 무엇이든 물어보세요!",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customKey, setCustomKey] = useState<string>("");
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const quickQuestions = [
    "일차방정식 2x + 6 = 14 풀이법 알려줘",
    "일차식의 동류항이란 무엇인가요?",
    "에라토스테네스의 체 소수 찾는 원리 알려줘",
    "음수 곱하기 음수가 왜 양수가 되나요?",
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: query }];
    setMessages(newMessages);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          apiKey: customKey || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `⚠️ 오류: ${data.error || "답변을 불러오지 못했습니다."}`,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ 네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-[#00f0ff]/40 shadow-[0_0_50px_rgba(0,240,255,0.2)] text-slate-100 space-y-6 relative overflow-hidden backdrop-blur-xl">
      {/* Glow Backdrops */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff007f]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff]">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#facc15]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OPENAI GPT-4o POWERED</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#00f0ff] via-[#facc15] to-[#ff007f]">
              아궁진영 AI 수학 선생님 챗봇
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="btn-arcade bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 px-3 py-2 text-xs flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5 text-[#facc15]" />
            <span>API 키 직접 입력</span>
          </button>
          <button
            onClick={() =>
              setMessages([
                {
                  role: "assistant",
                  content:
                    "안녕하세요! 🎓 **아궁진영 AI 수학 선생님**입니다. 궁금한 수학 질문을 자유롭게 입력해보세요!",
                },
              ])
            }
            className="btn-arcade bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 px-3 py-2 text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>대화 초기화</span>
          </button>
        </div>
      </div>

      {/* API Key Drawer */}
      {showKeyInput && (
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-mono">
          <label className="text-slate-300 font-bold block">
            개인 OpenAI API Key 직접 입력 (선택사항)
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              placeholder="sk-proj-..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#00f0ff]"
            />
            <button
              onClick={() => setShowKeyInput(false)}
              className="btn-arcade btn-arcade-cyan px-4 py-2 text-xs font-bold"
            >
              적용
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            * Vercel 환경변수(OPENAI_API_KEY)가 설정되어 있다면 입력하지 않아도 바로 작동합니다.
          </p>
        </div>
      )}

      {/* Chat Messages Display Box */}
      <div className="h-[420px] overflow-y-auto p-4 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-md ${
                msg.role === "user"
                  ? "bg-[#ff007f]/20 border border-[#ff007f]/50 text-[#ff007f]"
                  : "bg-[#00f0ff]/20 border border-[#00f0ff]/50 text-[#00f0ff]"
              }`}
            >
              {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[82%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-[#ff007f]/15 border border-[#ff007f]/30 text-slate-100 rounded-tr-none"
                  : "bg-slate-800/90 border border-slate-700/80 text-slate-200 rounded-tl-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00f0ff]/20 border border-[#00f0ff]/50 text-[#00f0ff] flex items-center justify-center">
              <Bot className="w-5 h-5 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs font-mono text-[#00f0ff] flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#facc15]" />
              <span>AI 수학 선생님이 풀이 과정을 작성하는 중입니다...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="space-y-2">
        <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#facc15]" />
          <span>추천 수학 질문 클릭:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700 hover:border-[#00f0ff] text-xs text-slate-300 hover:text-[#00f0ff] transition-all text-left"
            >
              💡 {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-3 pt-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="수학 관련 질문을 입력하세요... (예: 일차방정식 3x - 5 = 10 풀어줘)"
          disabled={isLoading}
          className="flex-1 px-5 py-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 font-medium focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="btn-arcade btn-arcade-cyan px-6 py-3.5 font-bold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">질문하기</span>
        </button>
      </form>
    </div>
  );
}
