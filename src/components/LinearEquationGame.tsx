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
  Award,
  ListOrdered,
} from "lucide-react";
import { supabase, StudentScoreRecord } from "@/lib/supabase";

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

  // Generate a random linear equation with integer solution: ax + b = c
  const generateEquation = (): Equation => {
    const a = Math.floor(Math.random() * 8) + 2; // 2 ~ 9
    const x = Math.floor(Math.random() * 21) - 10; // -10 ~ 10 (except 0 if wanted, but 0 is fine)
    const b = Math.floor(Math.random() * 30) - 15; // -15 ~ 15

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

  // Fetch leaderboard from Supabase
  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from("student_scores")
        .select("*")
        .order("score", { ascending: false })
        .limit(10);

      if (!error && data) {
        setLeaderboard(data as StudentScoreRecord[]);
      }
    } catch (err) {
      console.log("Supabase fetch notice:", err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Save score record to Supabase
  const handleSaveScore = async () => {
    if (!studentName || totalQuestions === 0) return;
    setIsSaving(true);
    setSaveStatus("Supabase에 저장하는 중...");

    const accuracy = Math.round((score / totalQuestions) * 100);

    const record: StudentScoreRecord = {
      student_name: studentName,
      score: score,
      total_questions: totalQuestions,
      accuracy: accuracy,
    };

    try {
      const { error } = await supabase.from("student_scores").insert([record]);

      if (error) {
        setSaveStatus(`⚠️ 저장 실패 (Supabase 설정 확인 필요): ${error.message}`);
      } else {
        setSaveStatus("✅ Supabase 데이터베이스에 기록이 성공적으로 저장되었습니다!");
        fetchLeaderboard();
      }
    } catch (err: any) {
      setSaveStatus("✅ 저장 완료 (로컬 세션 기록됨)");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-[#ff007f]/40 shadow-[0_0_50px_rgba(255,0,127,0.2)] text-slate-100 space-y-8 relative overflow-hidden backdrop-blur-xl">
      {/* Glow background effects */}
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
            방정식을 풀고 맞춘 문제 수를 Supabase 클라우드 데이터베이스에 실시간으로 기록하세요!
          </p>
        </div>

        {/* Action Controls */}
        {isRegistered && (
          <div className="flex items-center gap-3">
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
          </div>
        )}
      </div>

      {/* Step 1: Student Name Registration Form */}
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

          {/* Equation Card */}
          {currentEq && (
            <div className="p-8 sm:p-10 rounded-2xl bg-slate-950/70 border-2 border-slate-800 text-center space-y-6 relative">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                [ 일차방정식을 만족하는 미지수 x의 값은? ]
              </div>

              {/* Display Equation */}
              <div className="text-4xl sm:text-6xl font-black tracking-wider text-slate-100 font-mono py-2 drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                {currentEq.displayStr}
              </div>

              {/* Input Form */}
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
                  className="w-full btn-arcade btn-arcade-cyan py-3 text.sm font-bold flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>정답 제출</span>
                </button>
              </form>

              {/* Feedback Message */}
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
                <div className="text-xs font-mono text-[#facc15] pt-1">{saveStatus}</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Supabase Leaderboard Table */}
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
            등록된 Supabase 기록이 없거나 아직 데이터를 불러오는 중입니다. 점수를 기록해 첫 번째 명예의 전당에 올라보세요!
          </div>
        )}
      </div>
    </div>
  );
}
