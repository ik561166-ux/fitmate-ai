"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ClothingItem = {
  id: number;
  category: string;
  name: string;
};

type Outfit = {
  top?: ClothingItem;
  bottom?: ClothingItem;
  shoes?: ClothingItem;
  outer?: ClothingItem;
};

const STORAGE_KEY = "fitmate-closet-items";

function pickRandomItem(
  items: ClothingItem[],
  category: string,
): ClothingItem | undefined {
  const filteredItems = items.filter(
    (item) => item.category === category,
  );

  if (filteredItems.length === 0) {
    return undefined;
  }

  const randomIndex = Math.floor(Math.random() * filteredItems.length);

  return filteredItems[randomIndex];
}

export default function ClosetRecommendPage() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [outfit, setOutfit] = useState<Outfit>({});
  const [isLoaded, setIsLoaded] = useState(false);

  const createOutfit = (closetItems: ClothingItem[]) => {
    setOutfit({
      top: pickRandomItem(closetItems, "상의"),
      bottom: pickRandomItem(closetItems, "하의"),
      shoes: pickRandomItem(closetItems, "신발"),
      outer: pickRandomItem(closetItems, "아우터"),
    });
  };

  useEffect(() => {
    const savedItems = localStorage.getItem(STORAGE_KEY);

    if (savedItems) {
      try {
        const parsedItems: ClothingItem[] = JSON.parse(savedItems);

        setItems(parsedItems);
        createOutfit(parsedItems);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setIsLoaded(true);
  }, []);

  const outfitParts = [
    {
      label: "상의",
      icon: "👕",
      item: outfit.top,
    },
    {
      label: "하의",
      icon: "👖",
      item: outfit.bottom,
    },
    {
      label: "신발",
      icon: "👞",
      item: outfit.shoes,
    },
    {
      label: "아우터",
      icon: "🧥",
      item: outfit.outer,
    },
  ];

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#efe8da] text-[#1f2d27]">
        <p className="font-serif text-2xl font-bold">
          옷장을 불러오는 중이에요...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#efe8da] px-6 py-12 text-[#1f2d27]">
      <section className="mx-auto max-w-5xl">
        <Link
          href="/closet"
          className="inline-flex items-center text-sm font-semibold text-[#59645c] transition hover:text-[#18372d]"
        >
          ← 내 옷장으로 돌아가기
        </Link>

        <div className="mt-8 rounded-[2rem] border border-[#b8aa90] bg-[#f8f3e9] p-8 shadow-xl md:p-12">
          <p className="text-sm font-semibold tracking-[0.25em] text-[#8a6f3d]">
            WARDROBE STYLING
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold md:text-5xl">
            내 옷장 코디 추천
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-[#68716a]">
            등록된 옷 중에서 상의, 하의, 신발과 아우터를 조합해
            오늘 입을 수 있는 코디를 만들었어요.
          </p>

          {items.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-[#b8aa90] bg-[#f1e9da] p-10 text-center">
              <div className="text-6xl">♞</div>

              <h2 className="mt-5 font-serif text-3xl font-bold">
                옷장이 아직 비어 있어요.
              </h2>

              <p className="mt-3 text-[#68716a]">
                먼저 상의, 하의, 신발을 등록해주세요.
              </p>

              <Link
                href="/closet"
                className="mt-7 inline-block rounded-full bg-[#18372d] px-7 py-4 font-bold text-[#f8f3e9] transition hover:bg-[#23493d]"
              >
                옷 등록하러 가기
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {outfitParts.map((part) => (
                  <article
                    key={part.label}
                    className="rounded-3xl border border-[#c1b399] bg-white p-6 shadow-sm"
                  >
                    <div className="text-5xl">{part.icon}</div>

                    <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-[#8a6f3d]">
                      {part.label}
                    </p>

                    <h2 className="mt-2 font-serif text-xl font-bold">
                      {part.item
                        ? part.item.name
                        : `${part.label} 미등록`}
                    </h2>

                    {!part.item && (
                      <p className="mt-3 text-sm text-[#7a7469]">
                        옷장에 {part.label}을 등록하면 추천에 포함돼요.
                      </p>
                    )}
                  </article>
                ))}
              </div>

              <div className="mt-8 rounded-3xl bg-[#18372d] p-7 text-[#f8f3e9]">
                <p className="text-sm font-semibold tracking-[0.2em] text-[#d2b06d]">
                  STYLE NOTE
                </p>

                <h2 className="mt-3 font-serif text-2xl font-bold">
                  보유한 옷을 활용한 추천이에요.
                </h2>

                <p className="mt-4 leading-7 text-[#ded7c8]">
                  현재는 카테고리별 옷을 조합하는 기본 추천 방식이에요.
                  다음 단계에서는 색상과 날씨, 외출 목적까지 반영해 더
                  자연스러운 조합을 만들 수 있어요.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => createOutfit(items)}
                  className="rounded-2xl bg-[#d2b06d] px-6 py-4 font-bold text-[#18372d] transition hover:bg-[#e0c48a] active:scale-[0.98]"
                >
                  다른 조합 추천받기
                </button>

                <Link
                  href="/closet"
                  className="rounded-2xl border border-[#9f927b] px-6 py-4 text-center font-bold transition hover:border-[#18372d]"
                >
                  옷장 수정하기
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}