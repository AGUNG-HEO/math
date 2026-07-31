"use client";

import React, { useState, useRef } from "react";
import {
  Gamepad2,
  Calculator,
  PenTool,
  Gamepad,
  Bot,
} from "lucide-react";
import SieveGame from "@/components/SieveGame";
import LinearEquationGame from "@/components/LinearEquationGame";
import LinearExpressionGame from "@/components/LinearExpressionGame";
import MathChatbot from "@/components/MathChatbot";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"chatbot" | "expression" | "linear" | "sieve">("chatbot");
  const gameRef = useRef<HTMLDivElement>(null);

  const handleSelectTab = (tab: "chatbot" | "expression" | "linear" | "sieve") => {
    setActiveTab(tab);
    setTimeout(() => {
      gameRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0f172a] text-slate-100 font-sans selection:bg-[#ff007f] selection:text-white">
      {/* ==================== 상단 네비게이션 바 (Header Navbar) ==================== */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0f172a]/90 border-b border-slate-800/80 px-4 sm:px-6 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* 서비스 로고 */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="p-2 rounded-xl bg-slate-800/90 border border-[#00f0ff]/40 shadow-[0_0_15px_rgba(0,240,255,0.2)] group-hover:border-[#00f0ff] transition-all">
              <Gamepad2 className="w-5 h-5 text-[#00f0ff] animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#00f0ff] via-[#facc15] to-[#ff007f]">
                아궁진영의 수학교실
              </span>
              <span className="text-[10px] font-mono text-slate-400 tracking-wider">
                AI MATH TUTOR & ARCADE v3.0
              </span>
            </div>
          </div>

          {/* 상단 네비게이션 전용 메뉴 */}
          <nav className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => handleSelectTab("chatbot")}
              className={`px-3.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 select-none ${
                activeTab === "chatbot"
                  ? "bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.3)] font-bold"
                  : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-500"
              }`}
            >
              <Bot className="w-4 h-4 text-[#00f0ff]" />
              <span>AI 수학 선생님</span>
            </button>

            <button
              onClick={() => handleSelectTab("expression")}
              className={`px-3.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 select-none ${
                activeTab === "expression"
                  ? "bg-[#facc15]/20 border-[#facc15] text-[#facc15] shadow-[0_0_15px_rgba(250,204,21,0.3)] font-bold"
                  : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-500"
              }`}
            >
              <PenTool className="w-4 h-4 text-[#facc15]" />
              <span>일차식 덧셈·뺄셈</span>
            </button>

            <button
              onClick={() => handleSelectTab("linear")}
              className={`px-3.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 select-none ${
                activeTab === "linear"
                  ? "bg-[#ff007f]/20 border-[#ff007f] text-[#ff007f] shadow-[0_0_15px_rgba(255,0,127,0.3)] font-bold"
                  : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-500"
              }`}
            >
              <Calculator className="w-4 h-4 text-[#ff007f]" />
              <span>일차방정식 챌린지</span>
            </button>

            <button
              onClick={() => handleSelectTab("sieve")}
              className={`px-3.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 select-none ${
                activeTab === "sieve"
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)] font-bold"
                  : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-500"
              }`}
            >
              <Gamepad className="w-4 h-4 text-emerald-400" />
              <span>에라토스테네스의 체</span>
            </button>
          </nav>
        </div>
      </header>

      {/* ==================== 메인 화면 (Main Workspace) ==================== */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 py-6 relative overflow-hidden">
        {/* 네온 배경 장식 라이트 */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#ff007f]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center z-10 w-full">
          {/* ==================== 메인 콘텐츠 섹션 ==================== */}
          <div ref={gameRef} className="transition-all duration-500">
            {activeTab === "chatbot" && <MathChatbot />}
            {activeTab === "expression" && <LinearExpressionGame />}
            {activeTab === "linear" && <LinearEquationGame />}
            {activeTab === "sieve" && <SieveGame />}
          </div>
        </div>
      </main>

      {/* ==================== 하단 푸터 (Footer) ==================== */}
      <footer className="border-t border-slate-800/80 px-6 py-6 bg-[#0f172a]/90 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} 아궁진영의 수학교실. All rights reserved.</p>
          <div className="flex items-center space-x-4 text-slate-400">
            <span className="text-[#00f0ff]">OPENAI GPT-4o</span>
            <span>•</span>
            <span className="text-[#ff007f]">NEXT.JS APP ROUTER</span>
            <span>•</span>
            <span className="text-[#facc15]">VERCEL READY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
