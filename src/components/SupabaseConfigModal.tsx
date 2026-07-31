"use client";

import React, { useState, useEffect } from "react";
import { Settings, Check, X, Database, Key, HelpCircle } from "lucide-react";
import { getSupabaseCredentials } from "@/lib/supabase";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function SupabaseConfigModal({ isOpen, onClose, onSaved }: Props) {
  const [url, setUrl] = useState("");
  const [key, setKey] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      setUrl(creds.url.includes("your-supabase-project") ? "" : creds.url);
      setKey(creds.key.includes("your-anon-key") ? "" : creds.key);
      setMessage("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !key.trim()) {
      setMessage("⚠️ URL과 Anon Key를 모두 입력해주세요.");
      return;
    }

    localStorage.setItem("custom_supabase_url", url.trim());
    localStorage.setItem("custom_supabase_anon_key", key.trim());

    setMessage("✅ 설정이 브라우저에 저장되었습니다!");
    setTimeout(() => {
      onSaved();
      onClose();
    }, 800);
  };

  const handleClear = () => {
    localStorage.removeItem("custom_supabase_url");
    localStorage.removeItem("custom_supabase_anon_key");
    setUrl("");
    setKey("");
    setMessage("기본 환경변수 설정으로 초기화되었습니다.");
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-[#00f0ff]/50 shadow-[0_0_50px_rgba(0,240,255,0.3)] text-slate-100 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-xs font-mono text-[#00f0ff]">
            <Database className="w-3.5 h-3.5" />
            <span>Supabase 데이터베이스 연동</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-100">
            Supabase URL & Key 직접 입력
          </h3>
          <p className="text-xs text-slate-400">
            Vercel 환경변수 설정 없이도 Supabase 대시보드의 Project URL과 anon key를 입력하면 즉시 DB에 저장됩니다.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-sm font-mono">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#00f0ff]" />
              <span>Project URL</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzxyz.supabase.co"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#00f0ff]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-[#facc15]" />
              <span>API anon key (public)</span>
            </label>
            <textarea
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              rows={3}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs placeholder-slate-600 focus:outline-none focus:border-[#facc15] resize-none"
            />
          </div>

          {message && (
            <div className="p-3 rounded-xl bg-slate-800 text-xs text-[#facc15]">
              {message}
            </div>
          )}

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              className="flex-1 btn-arcade btn-arcade-cyan py-3 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>설정 저장하기</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-3 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold"
            >
              초기화
            </button>
          </div>
        </form>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs text-slate-400">
          <div className="font-bold text-[#facc15] flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Supabase 정보 찾는 위치:</span>
          </div>
          <p>
            Supabase 대시보드 ➔ <b>Project Settings</b> ➔ <b>API</b> ➔ <b>Project URL</b> 과 <b>anon public key</b>
          </p>
        </div>
      </div>
    </div>
  );
}
