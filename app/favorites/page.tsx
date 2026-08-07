"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SavedOutfit = {
  id: number;
  top?: string;
  bottom?: string;
  shoes?: string;
  outer?: string;
  createdAt: string;
};

const FAVORITES_KEY = "fitmate-favorite-outfits";

export default function FavoritesPage() {
  const [outfits, setOutfits] = useState<SavedOutfit[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);

    if (saved) {
      try {
        setOutfits(JSON.parse(saved));
      } catch {
        localStorage.removeItem(FAVORITES_KEY);
      }
    }

    setIsLoaded(true);
  }, []);

  const deleteOutfit = (id: number) => {
    const updated = outfits.filter((outfit) => outfit.id !== id);

    setOutfits(updated);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  };

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eee6d8] text-[#1d2c25]">
        <p className="font-serif text-2xl font-bold">
          저장한 코디를 불러오는 중...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#eee6d8] px-6 py-10 text-[#1d2c25]">
      <section className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-[#59635b] transition hover:text-[#18372d]"
        >
          ← 홈으로 돌아가기
        </Link>

        <div className="mt-8 rounded-[2rem] border border-[#b9aa90] bg-[#f8f2e7] p-8 shadow-xl md:p-12">
          <p className="text-xs font-semibold tracking-[0.24em] text-[#8a6e39]">
            SAVED LOOKS
          </p>

          <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="font-serif text-4xl font-bold md:text-5xl">
                저장한 코디
              </h1>

              <p className="mt-3 text-[#687169]">
                마음에 든 조합을 모아두고 다시 확인할 수 있어요.
              </p>
            </div>

            <p className="rounded-full bg-[#e5d7bd] px-4 py-2 text-sm font-semibold">
              총 {outfits.length}개
            </p>
          </div>

          {outfits.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-[#b9aa90] bg-[#eee4d3] p-12 text-center">
              <div className="text-6xl">♡</div>

              <h2 className="mt-5 font-serif text-3xl font-bold">
                아직 저장한 코디가 없어요.
              </h2>

              <p className="mt-3 text-[#687169]">
                마음에 드는 추천 코디를 저장하면 이곳에 모여요.
              </p>

              <Link
                href="/closet-recommend"
                className="mt-7 inline-block rounded-full bg-[#18372d] px-7 py-4 font-bold text-[#f8f1e2] transition hover:bg-[#244b3f]"
              >
                코디 추천 받으러 가기
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {outfits.map((outfit) => (
                <article
                  key={outfit.id}
                  className="rounded-3xl border border-[#c5b69d] bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.2em] text-[#8a6e39]">
                        SAVED OUTFIT
                      </p>

                      <p className="mt-2 text-sm text-[#7a7469]">
                        {outfit.createdAt}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteOutfit(outfit.id)}
                      className="rounded-full border border-[#d1c3aa] px-3 py-1 text-sm text-[#6f6658] transition hover:border-[#8a3b32] hover:text-[#8a3b32]"
                    >
                      삭제
                    </button>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between rounded-2xl bg-[#f8f2e7] p-4">
                      <span className="text-sm text-[#786f61]">👕 상의</span>
                      <span className="font-serif font-bold">
                        {outfit.top || "미등록"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-[#f8f2e7] p-4">
                      <span className="text-sm text-[#786f61]">👖 하의</span>
                      <span className="font-serif font-bold">
                        {outfit.bottom || "미등록"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-[#f8f2e7] p-4">
                      <span className="text-sm text-[#786f61]">👞 신발</span>
                      <span className="font-serif font-bold">
                        {outfit.shoes || "미등록"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-[#f8f2e7] p-4">
                      <span className="text-sm text-[#786f61]">🧥 아우터</span>
                      <span className="font-serif font-bold">
                        {outfit.outer || "생략"}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}