"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

export default function AnalyzePage() {
  const [imageUrl, setImageUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있어요.");
      return;
    }

    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    setImageUrl(URL.createObjectURL(file));
    setFileName(file.name);
    setIsAnalyzed(false);
  };

  const handleAnalyze = () => {
    if (!imageUrl) {
      return;
    }

    setIsAnalyzed(true);
  };

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">
      <section className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-gray-600 transition hover:text-black"
        >
          ← 홈으로 돌아가기
        </Link>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-xl md:p-12">
          <p className="text-sm font-semibold tracking-widest text-gray-500">
            FITMATE AI
          </p>

          <h1 className="mt-3 text-3xl font-bold md:text-4xl">
            사진으로 옷 분석
          </h1>

          <p className="mt-3 text-gray-500">
            옷 사진을 선택하면 미리 확인한 뒤 분석을 시작할 수 있어요.
          </p>

          <label className="mt-8 flex min-h-72 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition hover:border-black hover:bg-white">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="선택한 옷 미리보기"
                className="max-h-96 w-full rounded-2xl object-contain"
              />
            ) : (
              <>
                <div className="text-6xl">📷</div>
                <p className="mt-5 text-lg font-bold">
                  옷 사진을 선택해주세요
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  JPG, PNG, WEBP 이미지를 사용할 수 있어요.
                </p>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {fileName && (
            <p className="mt-4 text-center text-sm text-gray-500">
              선택한 파일:{" "}
              <span className="font-semibold text-black">{fileName}</span>
            </p>
          )}

          <button
            type="button"
            disabled={!imageUrl}
            onClick={handleAnalyze}
            className={`mt-8 w-full rounded-2xl px-6 py-4 text-lg font-bold transition ${
              imageUrl
                ? "bg-black text-white hover:bg-gray-800 active:scale-[0.98]"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}
          >
            AI 분석 시작
          </button>

          {isAnalyzed && (
            <div className="mt-8 rounded-3xl bg-black p-7 text-white">
              <p className="text-sm font-semibold text-gray-300">
                임시 분석 결과
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                사진이 정상적으로 등록됐어요.
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-gray-300">색상</p>
                  <p className="mt-1 font-bold">분석 준비 중</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-gray-300">원단</p>
                  <p className="mt-1 font-bold">분석 준비 중</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-gray-300">핏</p>
                  <p className="mt-1 font-bold">분석 준비 중</p>
                </div>
              </div>

              <p className="mt-5 leading-7 text-gray-300">
                현재는 사진 선택과 미리보기까지만 작동해요. 다음 단계에서
                실제 AI 분석 기능을 연결할 거예요.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}