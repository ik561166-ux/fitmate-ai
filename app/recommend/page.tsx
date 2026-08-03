"use client";

import Link from "next/link";
import { useState } from "react";

const options = [
  "출근",
  "데이트",
  "백화점",
  "여행",
  "운동",
  "편하게 외출",
];

export default function RecommendPage() {
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">
      <section className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-black"
        >
          ← 홈으로 돌아가기
        </Link>

        <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl">
          <p className="text-sm font-semibold text-gray-500">
            FITMATE AI
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            오늘 어디에 가시나요?
          </h1>

          <p className="mt-3 text-gray-500">
            상황을 선택하면 AI가 코디를 추천해드립니다.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedOption(option)}
                className={`rounded-2xl border p-5 font-semibold transition ${
                  selectedOption === option
                    ? "bg-black text-white border-black"
                    : "bg-white border-gray-300 hover:border-black"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {selectedOption && (
            <p className="mt-6 text-center text-gray-600">
              선택한 상황 :
              <span className="font-bold text-black">
                {" "}
                {selectedOption}
              </span>
            </p>
          )}

          {selectedOption ? (
            <Link
              href={`/result?situation=${selectedOption}`}
              className="mt-8 block rounded-2xl bg-black py-4 text-center text-lg font-bold text-white hover:bg-gray-800"
            >
              코디 추천받기
            </Link>
          ) : (
            <button
              disabled
              className="mt-8 w-full rounded-2xl bg-gray-300 py-4 text-lg font-bold text-gray-500 cursor-not-allowed"
            >
              코디 추천받기
            </button>
          )}
        </div>
      </section>
    </main>
  );
}