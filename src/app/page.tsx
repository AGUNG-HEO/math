"use client";

import React, { useState, useRef } from "react";
import {
  Gamepad2,
  Sparkles,
  BookOpen,
  Trophy,
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
      {/* ==================== 상단 헤더 (Header Bar) ==================== */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0f172a]/80 border-b border-slate-800/80 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* 서비스 로고 */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="p-2.5 rounded-xl bg-slate-800/90 border border-[#00f0ff]/40 shadow-[0_0_15px_rgba(0,240,255,0.2)] group-hover:border-[#00f0ff] transition-all">
              <Gamepad2 className="w-6 h-6 text-[#00f0ff] animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#00f0ff] via-[#facc15] to-[#ff007f]">
                아궁진영의 수학교실
              </span>
              <span className="text-[10px] font-mono text-slate-400 tracking-wider">
                AI MATH TUTOR & ARCADE v3.0
              </span>
            </div>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="hidden md:flex items-center space-x-5 text-sm font-semibold">
            <button
              onClick={() => handleSelectTab("chatbot")}
              className={`transition-colors flex items-center gap-1.5 ${
                activeTab === "chatbot" ? "text-[#00f0ff]" : "text-slate-300 hover:text-[#00f0ff]"
              }`}
            >
              <Bot className="w-4 h-4 text-[#00f0ff]" />
              AI 수학 선생님
            </button>
            <button
              onClick={() => handleSelectTab("expression")}
              className={`transition-colors flex items-center gap-1.5 ${
                activeTab === "expression" ? "text-[#facc15]" : "text-slate-300 hover:text-[#facc15]"
              }`}
            >
              <PenTool className="w-4 h-4 text-[#facc15]" />
              일차식 덧셈·뺄셈
            </button>
            <button
              onClick={() => handleSelectTab("linear")}
              className={`transition-colors flex items-center gap-1.5 ${
                activeTab === "linear" ? "text-[#ff007f]" : "text-slate-300 hover:text-[#ff007f]"
              }`}
            >
              <Calculator className="w-4 h-4 text-[#ff007f]" />
              일차방정식 챌린지
            </button>
            <button
              onClick={() => handleSelectTab("sieve")}
              className={`transition-colors flex items-center gap-1.5 ${
                activeTab === "sieve" ? "text-emerald-400" : "text-slate-300 hover:text-emerald-400"
              }`}
            >
              <Gamepad className="w-4 h-4 text-emerald-400" />
              에라토스테네스의 체
            </button>
          </nav>
        </div>
      </header>

      {/* ==================== 메인 화면 (Hero Section) ==================== */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* 네온 배경 장식 라이트 */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#ff007f]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center z-10 space-y-8 w-full">
          {/* 서브 뱃지 */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-800/80 border border-[#00f0ff]/30 text-xs font-mono text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.15)]">
            <Sparkles className="w-4 h-4 text-[#facc15]" />
            <span>AI POWERED MATH LEARNING PLATFORM</span>
          </div>

          {/* 메인 타이틀 */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            <span className="block text-slate-100">AI 수학 선생님 챗봇 &</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00f0ff] via-[#facc15] to-[#ff007f] glow-cyan">
              인터랙티브 수학교실
            </span>
          </h1>

          {/* 설명 */}
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
            수학 문제나 개념 질문을 AI 수학 선생님에게 자유롭게 물어보세요!
            일차식 계산과 방정식을 풀고 Supabase DB에 실시간 점수도 기록할 수 있습니다.
          </p>

          {/* 탭 전환 버튼 모음 */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => handleSelectTab("chatbot")}
              className={`btn-arcade px-8 py-4 text-base tracking-wide flex items-center gap-2 ${
                activeTab === "chatbot" ? "btn-arcade-cyan" : "bg-slate-800 text-slate-300 border-slate-700"
              }`}
            >
              <Bot className="w-5 h-5" />
              <span>🤖 AI 수학 선생님 챗봇</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab("expression")}
              className={`btn-arcade px-8 py-4 text-base tracking-wide flex items-center gap-2 ${
                activeTab === "expression" ? "btn-arcade-yellow" : "bg-slate-800 text-slate-300 border-slate-700"
              }`}
            >
              <PenTool className="w-5 h-5" />
              <span>✏️ 일차식 덧셈·뺄셈</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab("linear")}
              className={`btn-arcade px-8 py-4 text-base tracking-wide flex items-center gap-2 ${
                activeTab === "linear" ? "btn-arcade-pink" : "bg-slate-800 text-slate-300 border-slate-700"
              }`}
            >
              <Calculator className="w-5 h-5" />
              <span>📐 일차방정식 챌린지</span>
            </button>
          </div>

          {/* ==================== 메인 콘텐츠 섹션 ==================== */}
          <div ref={gameRef} className="pt-10 transition-all duration-500">
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
