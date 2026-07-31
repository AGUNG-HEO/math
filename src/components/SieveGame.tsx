"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Zap,
  Info,
  ChevronRight,
} from "lucide-react";

export default function SieveGame() {
  const MAX_NUM = 100;

  // Number grid states: 'unmarked', 'prime', 'eliminated', 'active'
  const [grid, setGrid] = useState<
    { val: number; status: "unmarked" | "prime" | "eliminated" | "active"; primeFactor?: number }[]
  >([]);

  // Current step for auto-visualizer
  const [currentPrime, setCurrentPrime] = useState<number | null>(null);
  const [gameMode, setGameMode] = useState<"auto" | "challenge">("challenge");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [primesFound, setPrimesFound] = useState<number[]>([]);
  const [message, setMessage] = useState<string>(
    "가장 작은 소수인 2부터 선택하여 배수를 체로 걸러내 보세요!"
  );
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Initialize 1..100 Grid
  const resetGrid = () => {
    const initialGrid = Array.from({ length: MAX_NUM }, (_, i) => {
      const num = i + 1;
      return {
        val: num,
        status: num === 1 ? ("eliminated" as const) : ("unmarked" as const),
      };
    });
    setGrid(initialGrid);
    setCurrentPrime(null);
    setIsPlaying(false);
    setScore(0);
    setPrimesFound([]);
    setIsCompleted(false);
    setMessage(
      gameMode === "challenge"
        ? "가장 작은 소수인 2부터 시작해 소수의 배수를 체로 걸러내 보세요!"
        : "▶ [자동 알고리즘 시작] 버튼을 누르면 에라토스테네스의 체 과정을 시각화합니다."
    );
  };

  useEffect(() => {
    resetGrid();
  }, [gameMode]);

  // Handle player clicking a number in Challenge Mode
  const handleCellClick = (num: number) => {
    if (gameMode !== "challenge" || isCompleted) return;
    if (num === 1) {
      setMessage("1은 소수가 아닙니다! 2부터 시작해 보세요.");
      return;
    }

    const targetCell = grid.find((c) => c.val === num);
    if (!targetCell) return;

    // Check if player clicked a valid next prime
    if (targetCell.status === "eliminated") {
      setMessage(`${num}은(는) 이미 체로 걸러진 합성수입니다.`);
      return;
    }

    if (targetCell.status === "prime") {
      setMessage(`${num}은(는) 이미 발견한 소수입니다.`);
      return;
    }

    // Is it a prime? (Check if not divisible by any smaller prime found so far)
    const isPrimeNumber = !primesFound.some((p) => num % p === 0);

    if (isPrimeNumber) {
      // Correct! Mark num as prime and eliminate its multiples
      const newPrimes = [...primesFound, num];
      setPrimesFound(newPrimes);

      let eliminatedCount = 0;
      const updatedGrid = grid.map((cell) => {
        if (cell.val === num) {
          return { ...cell, status: "prime" as const };
        }
        if (cell.val > num && cell.val % num === 0 && cell.status === "unmarked") {
          eliminatedCount++;
          return { ...cell, status: "eliminated" as const, primeFactor: num };
        }
        return cell;
      });

      setGrid(updatedGrid);
      const earned = 100 + eliminatedCount * 20;
      setScore((prev) => prev + earned);
      setMessage(
        `🎉 성공! 소수 ${num} 발견! ${num}의 배수 ${eliminatedCount}개를 체로 걸러냈습니다! (+${earned}점)`
      );

      // Check if algorithm complete (if current prime squared > 100, remaining unmarked are all prime)
      if (num * num > MAX_NUM) {
        // Mark all remaining unmarked as primes
        const finalGrid = updatedGrid.map((cell) =>
          cell.status === "unmarked" ? { ...cell, status: "prime" as const } : cell
        );
        setGrid(finalGrid);
        setIsCompleted(true);
        const totalPrimes = finalGrid.filter((c) => c.status === "prime").length;
        setMessage(
          `🏆 미션 완수! 1부터 100까지의 모든 소수(${totalPrimes}개)를 모두 찾아냈습니다!`
        );
      }
    } else {
      setMessage(
        `❌ 아쉬워요! ${num}은(는) 소수가 아닙니다. (소수 ${targetCell.primeFactor || "다른 수"}의 배수입니다)`
      );
    }
  };

  // Auto visualizer step interval
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && gameMode === "auto" && !isCompleted) {
      timer = setTimeout(() => {
        stepAutoSieve();
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, gameMode, currentPrime, grid, isCompleted]);

  const stepAutoSieve = () => {
    // Find next unmarked number >= 2
    let nextP = (currentPrime || 1) + 1;
    while (nextP <= Math.sqrt(MAX_NUM)) {
      const cell = grid.find((c) => c.val === nextP);
      if (cell && cell.status === "unmarked") {
        break;
      }
      nextP++;
    }

    if (nextP > Math.sqrt(MAX_NUM)) {
      // Finished sqrt stage, mark remaining unmarked as primes
      const finalGrid = grid.map((cell) =>
        cell.status === "unmarked" ? { ...cell, status: "prime" as const } : cell
      );
      setGrid(finalGrid);
      setIsCompleted(true);
      setIsPlaying(false);
      setMessage("🎉 에라토스테네스의 체 완성! 남은 모든 수가 100 이하의 소수입니다.");
      return;
    }

    // Process nextP
    setCurrentPrime(nextP);
    let eliminatedCount = 0;
    const updatedGrid = grid.map((cell) => {
      if (cell.val === nextP) {
        return { ...cell, status: "prime" as const };
      }
      if (cell.val > nextP && cell.val % nextP === 0 && cell.status === "unmarked") {
        eliminatedCount++;
        return { ...cell, status: "eliminated" as const, primeFactor: nextP };
      }
      return cell;
    });

    setGrid(updatedGrid);
    setMessage(
      `⚡ 소수 ${nextP}을(를) 선택하여 ${nextP}의 배수 ${eliminatedCount}개를 걸러내는 중...`
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-[#00f0ff]/40 shadow-[0_0_50px_rgba(0,240,255,0.2)] text-slate-100 space-y-8 relative overflow-hidden backdrop-blur-xl">
      {/* Background Neon Effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff007f]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-xs font-mono text-[#00f0ff]">
            <Sparkles className="w-3.5 h-3.5 text-[#facc15]" />
            <span>고대 그리스 수론 알고리즘</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#00f0ff] via-[#facc15] to-[#ff007f]">
            에라토스테네스의 체 아케이드
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            소수의 배수를 싹 지워내며 1부터 100까지의 진짜 소수만 남겨보세요!
          </p>
        </div>

        {/* Score & Mode Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setGameMode("challenge")}
            className={`btn-arcade px-4 py-2 text-xs sm:text-sm font-bold ${
              gameMode === "challenge"
                ? "btn-arcade-cyan"
                : "bg-slate-800 text-slate-300 border-slate-700"
            }`}
          >
            🕹️ 직접 풀기 게임
          </button>
          <button
            onClick={() => setGameMode("auto")}
            className={`btn-arcade px-4 py-2 text-xs sm:text-sm font-bold ${
              gameMode === "auto"
                ? "btn-arcade-pink"
                : "bg-slate-800 text-slate-300 border-slate-700"
            }`}
          >
            ⚡ 자동 체 시각화
          </button>

          <button
            onClick={resetGrid}
            className="btn-arcade bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 px-3 py-2 text-xs flex items-center gap-1"
            title="초기화"
          >
            <RotateCcw className="w-4 h-4 text-[#facc15]" />
            <span>리셋</span>
          </button>
        </div>
      </div>

      {/* Info Status Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#00f0ff]/10 text-[#00f0ff]">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <p className="text-sm font-medium text-slate-200">{message}</p>
        </div>

        {gameMode === "challenge" && (
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300">
              스코어: <span className="text-[#facc15] font-bold text-sm">{score}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300">
              찾은 소수:{" "}
              <span className="text-[#00f0ff] font-bold text-sm">
                {grid.filter((c) => c.status === "prime").length}개
              </span>
            </div>
          </div>
        )}

        {gameMode === "auto" && (
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={isCompleted}
            className={`btn-arcade px-6 py-2 text-xs font-bold ${
              isPlaying
                ? "btn-arcade-pink"
                : "btn-arcade-cyan"
            }`}
          >
            <Play className="w-4 h-4 fill-current mr-1" />
            <span>{isPlaying ? "일시정지" : "자동 시작"}</span>
          </button>
        )}
      </div>

      {/* 10x10 Number Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5 sm:gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
        {grid.map((cell) => {
          let stateStyle =
            "bg-slate-800/80 border-slate-700/70 text-slate-200 hover:border-[#00f0ff]/60 hover:text-white";

          if (cell.status === "eliminated") {
            stateStyle =
              "bg-slate-900/40 border-slate-800/60 text-slate-600 line-through opacity-50 cursor-not-allowed";
          } else if (cell.status === "prime") {
            stateStyle =
              "bg-[#00f0ff]/20 border-2 border-[#00f0ff] text-[#00f0ff] font-extrabold shadow-[0_0_15px_rgba(0,240,255,0.4)] animate-bounce-once";
          } else if (cell.status === "active") {
            stateStyle =
              "bg-[#facc15]/20 border-2 border-[#facc15] text-[#facc15] font-extrabold shadow-[0_0_15px_rgba(250,204,21,0.4)]";
          }

          return (
            <button
              key={cell.val}
              onClick={() => handleCellClick(cell.val)}
              disabled={cell.status === "eliminated" || cell.status === "prime" || isCompleted}
              className={`h-11 sm:h-13 rounded-xl border flex flex-col items-center justify-center font-mono text-sm sm:text-base font-bold transition-all duration-200 select-none ${stateStyle}`}
            >
              <span>{cell.val}</span>
              {cell.status === "prime" && (
                <span className="text-[9px] text-[#facc15] leading-none">PRIME</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Color Legend & Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
        {/* Legend */}
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
          <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#00f0ff]" />
            <span>범례 및 색상 가이드</span>
          </h4>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-[#00f0ff]/30 border border-[#00f0ff]" />
              <span className="text-slate-300">소수 (Prime)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-800 opacity-50 line-through" />
              <span className="text-slate-400">체로 걸러진 합성수</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-slate-800 border border-slate-700" />
              <span className="text-slate-300">미확인 수</span>
            </div>
          </div>
        </div>

        {/* Concept Explain */}
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1">
          <h4 className="font-bold text-[#facc15] flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-[#facc15]" />
            <span>에라토스테네스의 체 원리</span>
          </h4>
          <p className="text-slate-300 leading-relaxed">
            1보다 큰 자연수 중 1과 자기 자신만을 약수로 가지는 수를 <b>소수(Prime Number)</b>라 합니다.
            소수 $p$를 찾으면 $p$의 배수를 구멍 뚫린 체로 걸러내듯 제외시키는 고대 수학 알고리즘입니다!
          </p>
        </div>
      </div>
    </div>
  );
}
