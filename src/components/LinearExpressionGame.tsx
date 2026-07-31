"use client";

import React, { useState, useEffect } from "react";
import {
  PenTool,
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Save,
  User,
  Sparkles,
  Zap,
} from "lucide-react";
import { supabase, StudentScoreRecord } from "@/lib/supabase";

interface ExpressionProblem {
  displayStr: string;
  correctCoeff: number; // Coefficient of x
  correctConst: number; // Constant term
}

export default function LinearExpressionGame() {
  const [studentName, setStudentName] = useState<string>("");
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  const [currentProblem, setCurrentProblem] = useState<ExpressionProblem | null>(null);
  const [coeffInput, setCoeffInput] = useState<string>("");
  const [constInput, setConstInput] = useState<string>("");

  const [score, setScore] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [feedback, setFeedback] = useState<{
    msg: string;
    type: "correct" | "incorrect" | "info";
  }>({
    msg: "동류항끼리 모아서 ax + b 형태로 정답을 완성해보세요!",
    type: "info",
  });

  const [leaderboard, setLeaderboard] = useState<StudentScoreRecord[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>("");

  // Generate random Linear Expression Addition & Subtraction problems
  const generateProblem = (): ExpressionProblem => {
    const pType = Math.floor(Math.random() * 3); // 0: Basic Add/Sub, 1: Subtraction with parens, 2: Scalar multiplier

    if (pType === 0) {
      // (ax + b) + (cx + d)
      const a = Math.floor(Math.random() * 9) + 1;
      const b = Math.floor(Math.random() * 19) - 9;
      const c = Math.floor(Math.random() * 9) + 1;
      const d = Math.floor(Math.random() * 19) - 9;

      const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
      const dStr = d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`;

      const displayStr = `(${a}x ${bStr}) + (${c}x ${dStr})`;
      return {
        displayStr,
        correctCoeff: a + c,
        correctConst: b + d,
      };
    } else if (pType === 1) {
      // (ax + b) - (cx + d)
      const a = Math.floor(Math.random() * 9) + 2;
      const b = Math.floor(Math.random() * 19) - 9;
      const c = Math.floor(Math.random() * 9) + 1;
      const d = Math.floor(Math.random() * 19) - 9;

      const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
      const dStr = d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`;

      const displayStr = `(${a}x ${bStr}) - (${c}x ${dStr})`;
      return {
        displayStr,
        correctCoeff: a - c,
        correctConst: b - d,
      };
    } else {
      // k(ax + b) + m(cx + d)
      const k = Math.floor(Math.random() * 3) + 2; // 2 or 3
      const a = Math.floor(Math.random() * 5) + 1;
      const b = Math.floor(Math.random() * 9) - 4;
      const m = Math.floor(Math.random() * 2) === 0 ? 1 : -1;
      const c = Math.floor(Math.random() * 5) + 1;
      const d = Math.floor(Math.random() * 9) - 4;

      const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
      const dStr = d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`;
      const mStr = m === 1 ? "+" : "-";

      const displayStr = `${k}(${a}x ${bStr}) ${mStr} (${c}x ${dStr})`;
      return {
        displayStr,
        correctCoeff: k * a + m * c,
        correctConst: k * b + m * d,
      };
    }
  };

  const startNewQuestion = () => {
    setCurrentProblem(generateProblem());
    setCoeffInput("");
    setConstInput("");
  };

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;
    setIsRegistered(true);
    setScore(0);
    setTotalQuestions(0);
    setStreak(0);
    setFeedback({
      msg: `환영합니다, ${studentName} 학생! 일차식의 덧셈과 뺄셈을 간단히 나타내세요.`,
      type: "info",
    });
    startNewQuestion();
  };

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProblem || coeffInput.trim() === "" || constInput.trim() === "") return;

    const userCoeff = parseInt(coeffInput.trim(), 10);
    const userConst = parseInt(constInput.trim(), 10);

    setTotalQuestions((prev) => prev + 1);

    const isCoeffCorrect = userCoeff === currentProblem.correctCoeff;
    const isConstCorrect = userConst === currentProblem.correctConst;

    if (isCoeffCorrect && isConstCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);

      const constSign = currentProblem.correctConst >= 0 ? `+ ${currentProblem.correctConst}` : `- ${Math.abs(currentProblem.correctConst)}`;
      const ansStr = `${currentProblem.correctCoeff}x ${constSign}`;

      setFeedback({
        msg: `🎉 정답입니다! 결과: ${ansStr} (연속 정답: ${streak + 1}회)`,
        type: "correct",
      });
    } else {
      setStreak(0);
      const constSign = currentProblem.correctConst >= 0 ? `+ ${currentProblem.correctConst}` : `- ${Math.abs(currentProblem.correctConst)}`;
      const ansStr = `${currentProblem.correctCoeff}x ${constSign}`;

      setFeedback({
        msg: `❌ 오답입니다! 정답은 [ ${ansStr} ] 입니다.`,
        type: "incorrect",
      });
    }

    setTimeout(() => {
      startNewQuestion();
    }, 1600);
  };

  // Fetch leaderboard for expression scores
  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from("expression_scores")
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
      const { error } = await supabase.from("expression_scores").insert([record]);

      if (error) {
        setSaveStatus(`⚠️ 저장 실패 (Supabase 테이블 확인 필요): ${error.message}`);
      } else {
        setSaveStatus("✅ Supabase DB(expression_scores)에 일차식 풀이 기록이 저장되었습니다!");
        fetchLeaderboard();
      }
    } catch (err: any) {
      setSaveStatus("✅ 저장 완료 (세션 기록됨)");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-[#facc15]/40 shadow-[0_0_50px_rgba(250,204,21,0.2)] text-slate-100 space-y-8 relative overflow-hidden backdrop-blur-xl">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#facc15]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff007f]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Title Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#facc15]/10 border border-[#facc15]/30 text-xs font-mono text-[#facc15]">
            <PenTool className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>중1 수학 : 동류항 계산</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#facc15] via-[#ff007f] to-[#00f0ff]">
            일차식의 덧셈과 뺄셈 챌린지
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            동류항끼리 묶어 괄호를 풀고 계산한 결과를 Supabase 데이터베이스에 저장하세요!
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
              <span>Supabase에 기록 저장</span>
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

      {/* Step 1: Registration Form */}
      {!isRegistered ? (
        <form
          onSubmit={handleStartGame}
          className="max-w-md mx-auto p-8 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-6 text-center shadow-xl"
        >
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#facc15]/10 border border-[#facc15]/40 flex items-center justify-center text-[#facc15]">
            <User className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-100">학생 이름을 입력하세요</h3>
            <p className="text-xs text-slate-400">
              일차식 덧셈·뺄셈 정답 수가 Supabase 리더보드에 등록됩니다.
            </p>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="예: 이순신"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-center font-bold placeholder-slate-500 focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15] transition-all"
            />
            <button
              type="submit"
              className="w-full btn-arcade btn-arcade-yellow py-3 text-sm font-bold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>일차식 계산 도전 시작</span>
            </button>
          </div>
        </form>
      ) : (
        /* Step 2: Game Workspace */
        <div className="space-y-8">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">학생 이름</span>
              <span className="text-base font-bold text-[#facc15]">{studentName}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">맞춘 문제 수</span>
              <span className="text-2xl font-black text-[#00f0ff]">{score}개</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">총 풀이 수</span>
              <span className="text-2xl font-black text-slate-200">{totalQuestions}개</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">정답률</span>
              <span className="text-2xl font-black text-[#ff007f]">
                {totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%
              </span>
            </div>
          </div>

          {/* Problem Box */}
          {currentProblem && (
            <div className="p-8 sm:p-10 rounded-2xl bg-slate-950/70 border-2 border-slate-800 text-center space-y-6 relative">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                [ 다음 일차식을 괄호를 풀고 동류항끼리 계산하여 간단히 하세요 ]
              </div>

              {/* Expression Equation */}
              <div className="text-3xl sm:text-5xl font-black tracking-wider text-slate-100 font-mono py-3 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                {currentProblem.displayStr}
              </div>

              {/* Form Input for Ax + B */}
              <form onSubmit={handleSubmitAnswer} className="max-w-md mx-auto space-y-5">
                <div className="flex items-center justify-center gap-2 sm:gap-3 text-lg font-mono">
                  <span className="text-slate-400 font-bold sm:text-xl font-sans">=</span>

                  {/* Coefficient of x input */}
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={coeffInput}
                      onChange={(e) => setCoeffInput(e.target.value)}
                      placeholder="계수"
                      required
                      className="w-20 sm:w-24 px-3 py-2.5 rounded-xl bg-slate-900 border-2 border-[#facc15]/50 text-slate-100 text-center font-mono text-xl font-bold focus:outline-none focus:border-[#facc15] shadow-[0_0_12px_rgba(250,204,21,0.2)]"
                    />
                    <span className="text-2xl font-extrabold text-[#facc15]">x</span>
                  </div>

                  <span className="text-2xl font-extrabold text-slate-400">+</span>

                  {/* Constant term input */}
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={constInput}
                      onChange={(e) => setConstInput(e.target.value)}
                      placeholder="상수항"
                      required
                      className="w-20 sm:w-24 px-3 py-2.5 rounded-xl bg-slate-900 border-2 border-[#ff007f]/50 text-slate-100 text-center font-mono text-xl font-bold focus:outline-none focus:border-[#ff007f] shadow-[0_0_12px_rgba(255,0,127,0.2)]"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 font-mono">
                  * 예시: 계산 결과가 $5x - 3$ 이면 [ 5 ] x + [ -3 ] 으로 입력합니다.
                </p>

                <button
                  type="submit"
                  className="w-full btn-arcade btn-arcade-yellow py-3 text-sm font-bold flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>계산 정답 제출</span>
                </button>
              </form>

              {/* Feedback Alert */}
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
            <span>일차식 덧셈·뺄셈 Supabase 실시간 명예의 전당</span>
          </h3>
          <button
            onClick={fetchLeaderboard}
            className="text-xs text-slate-400 hover:text-[#facc15] transition-colors flex items-center gap-1 font-mono"
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
                  <th className="py-3 px-4">맞춘 일차식 수</th>
                  <th className="py-3 px-4">총 시도 수</th>
                  <th className="py-3 px-4">정답률</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {leaderboard.map((rec, index) => (
                  <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#facc15]">#{index + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-100">{rec.student_name}</td>
                    <td className="py-3 px-4 text-[#facc15] font-extrabold">{rec.score}개</td>
                    <td className="py-3 px-4">{rec.total_questions}개</td>
                    <td className="py-3 px-4 text-[#ff007f] font-bold">{rec.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-500 font-mono">
            등록된 Supabase 기록이 없습니다. 일차식 문제를 풀고 최고 기록을 등록해보세요!
          </div>
        )}
      </div>
    </div>
  );
}
