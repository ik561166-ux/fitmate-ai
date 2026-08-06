"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ClothingItem = {
  id: number;
  category: string;
  name: string;
};

const STORAGE_KEY = "fitmate-closet-items";

export default function ClosetPage() {
  const [category, setCategory] = useState("상의");
  const [name, setName] = useState("");
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedItems = localStorage.getItem(STORAGE_KEY);

    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isLoaded]);

  const addItem = () => {
    const trimmedName = name.trim();

    if (!trimmedName) return;

    const newItem: ClothingItem = {
      id: Date.now(),
      category,
      name: trimmedName,
    };

    setItems((currentItems) => [...currentItems, newItem]);
    setName("");
  };

  const deleteItem = (id: number) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id),
    );
  };

  return (
    <main className="min-h-screen bg-[#efe8da] px-6 py-12 text-[#1f2d27]">
      <section className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-[#59645c] transition hover:text-[#18372d]"
        >
          ← 홈으로 돌아가기
        </Link>

        <div className="mt-8 rounded-[2rem] border border-[#b8aa90] bg-[#f8f3e9] p-8 shadow-xl md:p-12">
          <p className="text-sm font-semibold tracking-[0.25em] text-[#8a6f3d]">
            MY WARDROBE
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold md:text-5xl">
            내 옷장
          </h1>

          <p className="mt-3 text-[#68716a]">
            가지고 있는 옷을 등록하면 나중에 옷장 안에서만 코디를 추천할 수
            있어요.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-[180px_1fr_auto]">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-2xl border border-[#b8aa90] bg-white px-4 py-4 outline-none transition focus:border-[#18372d]"
            >
              <option>상의</option>
              <option>하의</option>
              <option>신발</option>
              <option>아우터</option>
              <option>가방</option>
              <option>액세서리</option>
            </select>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  addItem();
                }
              }}
              placeholder="예: 검정 옥스포드 셔츠"
              className="rounded-2xl border border-[#b8aa90] bg-white px-4 py-4 outline-none transition focus:border-[#18372d]"
            />

            <button
              type="button"
              onClick={addItem}
              className="rounded-2xl bg-[#18372d] px-6 py-4 font-bold text-[#f8f3e9] transition hover:bg-[#23493d] active:scale-[0.98]"
            >
              등록하기
            </button>
          </div>

          <div className="mt-12">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-[#8a6f3d]">
                  COLLECTION
                </p>

                <h2 className="mt-2 font-serif text-3xl font-bold">
                  등록된 옷
                </h2>
              </div>

              <p className="rounded-full bg-[#e3d7c1] px-4 py-2 text-sm font-semibold">
                총 {items.length}개
              </p>
            </div>

            {items.length === 0 ? (
              <div className="mt-8 rounded-3xl border border-dashed border-[#b8aa90] bg-[#f1e9da] p-10 text-center">
                <div className="text-5xl">♞</div>

                <p className="mt-4 font-serif text-2xl font-bold">
                  아직 등록된 옷이 없어요.
                </p>

                <p className="mt-2 text-[#68716a]">
                  가장 자주 입는 옷부터 하나씩 등록해보세요.
                </p>
              </div>
            ) : (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-3xl border border-[#c1b399] bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold tracking-[0.18em] text-[#8a6f3d]">
                          {item.category}
                        </p>

                        <h3 className="mt-2 font-serif text-xl font-bold">
                          {item.name}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteItem(item.id)}
                        className="rounded-full border border-[#d2c6b2] px-3 py-1 text-sm text-[#6f6658] transition hover:border-[#7a2f2f] hover:text-[#7a2f2f]"
                      >
                        삭제
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}