"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold mb-10">FitMate AI</h1>

      <div className="grid grid-cols-2 gap-6 w-full max-w-xl">
        <Link
          href="/recommend"
          className="bg-white rounded-2xl shadow-lg p-8 text-center text-xl font-semibold hover:scale-105 transition"
        >
          👕 AI 추천
        </Link>

        <Link
          href="/closet"
          className="bg-white rounded-2xl shadow-lg p-8 text-center text-xl font-semibold hover:scale-105 transition"
        >
          👔 내 옷 등록
        </Link>

        <Link
          href="/outfit"
          className="bg-white rounded-2xl shadow-lg p-8 text-center text-xl font-semibold hover:scale-105 transition"
        >
          ✨ 코디 보기
        </Link>

        <Link
          href="/chat"
          className="bg-white rounded-2xl shadow-lg p-8 text-center text-xl font-semibold hover:scale-105 transition"
        >
          🤖 AI 채팅
        </Link>
      </div>
    </main>
  );
}