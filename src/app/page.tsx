import React from "react";
import { Gamepad2, Sparkles, PlusCircle, BookOpen, Trophy, Cpu } from "lucide-react";

export default function Home() {
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
                MATH ARCADE EDITION v1.0
              </span>
            </div>
          </div>

          {/* 네비게이션 공간 */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold">
            <a
              href="#hero"
              className="text-slate-300 hover:text-[#00f0ff] transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-[#00f0ff]" />
              학습 코스
            </a>
            <a
              href="#features"
              className="text-slate-300 hover:text-[#facc15] transition-colors flex items-center gap-1.5"
            >
              <Trophy className="w-4 h-4 text-[#facc15]" />
              대시보드
            </a>
            <a
              href="#about"
              className="text-slate-300 hover:text-[#ff007f] transition-colors flex items-center gap-1.5"
            >
              <Cpu className="w-4 h-4 text-[#ff007f]" />
              설정
            </a>
          </nav>
        </div>
      </header>

      {/* ==================== 메인 화면 (Hero Section) ==================== */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
        {/* 네온 배경 장식 라이트 (Neon Glow Accents) */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#ff007f]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center z-10 space-y-8">
          {/* 서브 뱃지 */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-800/80 border border-[#00f0ff]/30 text-xs font-mono text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.15)]">
            <Sparkles className="w-4 h-4 text-[#facc15]" />
            <span>INTERACTIVE MATH PLATFORM</span>
          </div>

          {/* 환영 문구 (Main Heading) */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            <span className="block text-slate-100">나만의 교육용</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00f0ff] via-[#facc15] to-[#ff007f] glow-cyan">
              웹앱 만들기
            </span>
          </h1>

          {/* 간단한 설명 */}
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
            세련된 오락실 느낌의 감성과 직관적인 3D 인터랙티브 버튼으로 즐겁게
            수학을 배우는 차세대 네온 게이밍 학습 공간입니다.
          </p>

          {/* 기능 추가용 가짜 (Placeholder) 3D 입체 버튼 1개 */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              className="btn-arcade btn-arcade-cyan px-8 py-4 text-base tracking-wide flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>새로운 학습 기능 추가하기</span>
            </button>
          </div>

          {/* 가짜 기능 카드 그리드 (Placeholder Demo Cards) */}
          <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 hover:border-[#00f0ff]/60 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]">
              <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 flex items-center justify-center text-[#00f0ff] mb-4 font-extrabold">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">
                인터랙티브 문제집
              </h3>
              <p className="text-sm text-slate-400">
                실시간 피드백과 반응형 3D 버튼으로 몰입감 넘치는 수학교실.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 hover:border-[#ff007f]/60 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(255,0,127,0.15)]">
              <div className="w-10 h-10 rounded-xl bg-[#ff007f]/10 flex items-center justify-center text-[#ff007f] mb-4 font-extrabold">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">
                네온 게이밍 랭킹
              </h3>
              <p className="text-sm text-slate-400">
                선생님과 학생들이 다 함께 스코어를 겨루는 아케이드 리그.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 hover:border-[#facc15]/60 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(250,204,21,0.15)]">
              <div className="w-10 h-10 rounded-xl bg-[#facc15]/10 flex items-center justify-center text-[#facc15] mb-4 font-extrabold">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">
                맞춤형 학습 리포트
              </h3>
              <p className="text-sm text-slate-400">
                개인별 성장 수치와 정확도를 한눈에 분석하는 대시보드.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ==================== 하단 푸터 (Footer) ==================== */}
      <footer className="border-t border-slate-800/80 px-6 py-6 bg-[#0f172a]/90 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} 아궁진영의 수학교실. All rights reserved.</p>
          <div className="flex items-center space-x-4 text-slate-400">
            <span className="text-[#00f0ff]">NEXT.JS APP ROUTER</span>
            <span>•</span>
            <span className="text-[#ff007f]">TAILWIND CSS</span>
            <span>•</span>
            <span className="text-[#facc15]">VERCEL READY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
