"use client";

import React, { useState, useEffect } from "react";
import {
  Calculator,
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Save,
  User,
  Sparkles,
  Settings,
} from "lucide-react";
import { supabase, StudentScoreRecord, getSupabaseCredentials } from "@/lib/supabase";
import SupabaseConfigModal from "./SupabaseConfigModal";

interface Equation {
  a: number;
  b: number;
  c: number;
  solution: number;
  displayStr: string;
}

export default function LinearEquationGame() {
  const [studentName, setStudentName] = useState<string>("");
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  const [currentEq, setCurrentEq] = useState<Equation | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [feedback, setFeedback] = useState<{
    msg: string;
    type: "correct" | "incorrect" | "info";
  }>({
    msg: "일차방정식을 풀고 x의 값을 입력하세요!",
    type: "info",
  });

  const [leaderboard, setLeaderboard] = useState<StudentScoreRecord[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);

  // Generate random linear equation: ax + b = c
  const generateEquation = (): Equation => {
    const a = Math.floor(Math.random() * 8) + 2;
    const x = Math.floor(Math.random() * 21) - 10;
    const b = Math.floor(Math.random() * 30) - 15;
    const c = a * x + b;

    const bSignStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    const displayStr = `${a}x ${bSignStr} = ${c}`;

    return { a, b, c, solution: x, displayStr };
  };

  const startNewQuestion = () => {
    setCurrentEq(generateEquation());
    setUserAnswer("");
  };

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;
    setIsRegistered(true);
    setScore(0);
    setTotalQuestions(0);
    setStreak(0);
    setFeedback({
      msg: `환영합니다, ${studentName} 학생! 첫 번째 일차방정식 문제입니다.`,
      type: "info",
    });
    startNewQuestion();
  };

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEq || userAnswer.trim() === "") return;

    const numVal = parseInt(userAnswer.trim(), 10);
    setTotalQuestions((prev) => prev + 1);

    if (numVal === currentEq.solution) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      setFeedback({
        msg: `🎉 정답입니다! x = ${currentEq.solution} (연속 정답: ${streak + 1}회)`,
        type: "correct",
      });
    } else {
      setStreak(0);
      setFeedback({
        msg: `❌ 오답입니다! 정답은 x = ${currentEq.solution} 입니다.`,
        type: "incorrect",
      });
    }

    setTimeout(() => {
      startNewQuestion();
    }, 1500);
  };

  // Fetch leaderboard from Supabase with LocalStorage fallback
  const fetchLeaderboard = async () => {
    const localRecordsStr = localStorage.getItem("local_linear_scores");
    let localData: StudentScoreRecord[] = localRecordsStr ? JSON.parse(localRecordsStr) : [];

    const creds = getSupabaseCredentials();
    if (!creds.isConfigured) {
      setLeaderboard(localData);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("student_scores")
        .select("*")
        .order("score", { ascending: false })
        .limit(10);

      if (!error && data && data.length > 0) {
        setLeaderboard(data as StudentScoreRecord[]);
      } else {
        setLeaderboard(localData);
      }
    } catch (err) {
      setLeaderboard(localData);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Save score record with robust error handling for Failed to Fetch
  const handleSaveScore = async () => {
    if (!studentName || totalQuestions === 0) return;
    setIsSaving(true);
    setSaveStatus("저장 확인 중...");

    const accuracy = Math.round((score / totalQuestions) * 100);
    const newRecord: StudentScoreRecord = {
      student_name: studentName,
      score: score,
      total_questions: totalQuestions,
      accuracy: accuracy,
    };

    // Save to LocalStorage fallback
    const localStr = localStorage.getItem("local_linear_scores");
    let localList: StudentScoreRecord[] = localStr ? JSON.parse(localStr) : [];
    localList.push(newRecord);
    localList.sort((a, b) => b.score - a.score);
    localStorage.setItem("local_linear_scores", JSON.stringify(localList.slice(0, 10)));

    const creds = getSupabaseCredentials();
    if (!creds.isConfigured) {
      setSaveStatus(
        "⚠️ Supabase URL이 아직 설정되지 않았습니다. [⚙️ Supabase 연동 설정] 버튼에서 URL/Key를 등록하세요. (점수는 현재 브라우저에 저장됨)"
      );
      setLeaderboard(localList.slice(0, 10));
      setIsSaving(false);
      return;
    }

    try {
      const { error } = await supabase.from("student_scores").insert([newRecord]);

      if (error) {
        setSaveStatus(
          `⚠️ Supabase 저장 안내: ${error.message} (Supabase SQL Editor에서 student_scores 테이블이 생성되었는지 확인해주세요. 점수는 브라우저에 저장되었습니다)`
        );
      } else {
        setSaveStatus("✅ Supabase 클라우드 데이터베이스에 실시간 기록이 저장되었습니다!");
        fetchLeaderboard();
      }
    } catch (err: any) {
      setSaveStatus(
        "⚠️ Supabase 서버 연결 실패 (Failed to fetch). URL/API Key 및 인터넷 연결을 확인하거나 [⚙️ Supabase 연동 설정]을 클릭해 올바른 URL을 입력해주세요. (점수는 브라우저에 임시 저장됨)"
      );
      setLeaderboard(localList.slice(0, 10));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-[#ff007f]/40 shadow-[0_0_50px_rgba(255,0,127,0.2)] text-slate-100 space-y-8 relative overflow-hidden backdrop-blur-xl">
      <SupabaseConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onSaved={fetchLeaderboard}
      />

      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#facc15]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Title Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff007f]/10 border border-[#ff007f]/30 text-xs font-mono text-[#ff007f]">
            <Calculator className="w-3.5 h-3.5 text-[#facc15]" />
            <span>일차방정식 수학교실</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#ff007f] via-[#facc15] to-[#00f0ff]">
            일차방정식 챌린지 & Supabase 저장
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            방정식을 풀고 맞춘 문제 수를 Supabase 데이터베이스에 실시간 기록하세요!
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setIsConfigOpen(true)}
            className="btn-arcade bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 px-3 py-2.5 text-xs flex items-center gap-1.5"
          >
            <Settings className="w-4 h-4 text-[#00f0ff]" />
            <span>Supabase 연동 설정</span>
          </button>

          {isRegistered && (
            <>
              <button
                onClick={handleSaveScore}
                disabled={isSaving || totalQuestions === 0}
                className="btn-arcade btn-arcade-yellow px-4 py-2.5 text-xs font-bold flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Supabase에 점수 저장</span>
              </button>

              <button
                onClick={() => {
                  setIsRegistered(false);
                  setStudentName("");
                }}
                className="btn-arcade bg-slate-800 text-slate-300 border-slate-700 px-3 py-2.5 text-xs"
              >
                학생 변경
              </button>
            </>
          )}
        </div>
      </div>

      {/* Step 1: Student Name Input */}
      {!isRegistered ? (
        <form
          onSubmit={handleStartGame}
          className="max-w-md mx-auto p-8 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-6 text-center shadow-xl"
        >
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff]">
            <User className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-100">학생 이름을 입력하세요</h3>
            <p className="text-xs text-slate-400">
              문제 풀이 기록이 Supabase 리더보드에 저장됩니다.
            </p>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="예: 홍길동"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-center font-bold placeholder-slate-500 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all"
            />
            <button
              type="submit"
              className="w-full btn-arcade btn-arcade-cyan py-3 text-sm font-bold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>도전 시작하기</span>
            </button>
          </div>
        </form>
      ) : (
        /* Step 2: Game Board */
        <div className="space-y-8">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">학생 이름</span>
              <span className="text-base font-bold text-[#00f0ff]">{studentName}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">맞춘 문제 수</span>
              <span className="text-2xl font-black text-[#facc15]">{score}개</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">총 시도 문제</span>
              <span className="text-2xl font-black text-slate-200">{totalQuestions}개</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">정답률</span>
              <span className="text-2xl font-black text-[#ff007f]">
                {totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%
              </span>
            </div>
          </div>

          {/* Equation Problem Card */}
          {currentEq && (
            <div className="p-8 sm:p-10 rounded-2xl bg-slate-950/70 border-2 border-slate-800 text-center space-y-6 relative">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                [ 일차방정식을 만족하는 미지수 x의 값은? ]
              </div>

              <div className="text-4xl sm:text-6xl font-black tracking-wider text-slate-100 font-mono py-2 drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                {currentEq.displayStr}
              </div>

              <form onSubmit={handleSubmitAnswer} className="max-w-xs mx-auto space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl font-mono font-extrabold text-[#facc15]">x =</span>
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="정답"
                    autoFocus
                    required
                    className="w-32 px-4 py-3 rounded-xl bg-slate-900 border-2 border-[#00f0ff]/50 text-slate-100 text-center font-mono text-2xl font-bold focus:outline-none focus:border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn-arcade btn-arcade-cyan py-3 text-sm font-bold flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>정답 제출</span>
                </button>
              </form>

              <div
                className={`p-3 rounded-xl text-sm font-semibold transition-all ${
                  feedback.type === "correct"
                    ? "bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/40"
                    : feedback.type === "incorrect"
                    ? "bg-[#ff007f]/10 text-[#ff007f] border border-[#ff007f]/40"
                    : "bg-slate-800 text-slate-300 border border-slate-700"
                }`}
              >
                {feedback.msg}
              </div>

              {saveStatus && (
                <div className="p-3 rounded-xl bg-slate-800/90 text-xs font-mono text-[#facc15] border border-slate-700 leading-relaxed">
                  {saveStatus}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Leaderboard */}
      <div className="pt-6 border-t border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#facc15]" />
            <span>Supabase 실시간 학생 명예의 전당</span>
          </h3>
          <button
            onClick={fetchLeaderboard}
            className="text-xs text-slate-400 hover:text-[#00f0ff] transition-colors flex items-center gap-1 font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>새로고침</span>
          </button>
        </div>

        {leaderboard.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/40">
            <table className="w-full text-left text-sm font-mono">
              <thead className="bg-slate-800/80 text-slate-400 text-xs uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">순위</th>
                  <th className="py-3 px-4">학생 이름</th>
                  <th className="py-3 px-4">맞춘 문제 수</th>
                  <th className="py-3 px-4">총 풀이 수</th>
                  <th className="py-3 px-4">정답률</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {leaderboard.map((rec, index) => (
                  <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#facc15]">#{index + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-100">{rec.student_name}</td>
                    <td className="py-3 px-4 text-[#00f0ff] font-extrabold">{rec.score}개</td>
                    <td className="py-3 px-4">{rec.total_questions}개</td>
                    <td className="py-3 px-4 text-[#ff007f] font-bold">{rec.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-500 font-mono">
            등록된 점수가 없습니다. 점수를 기록해 첫 번째 명예의 전당에 올라보세요!
          </div>
        )}
      </div>
    </div>
  );
}
